"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { listAgents } from "@/services/agentService";
import { getAgentAnalytics, getTenantAnalytics, exportAnalytics, getUserAnalytics } from "@/services/analyticsService";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { retryOnNetworkError, retryOnServerError } from "@/lib/utils/retry";
import { useUrlFilters } from "@/lib/hooks/useUrlFilters";
import { CalendarIcon, BarChart2 } from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/AnalyticsCharts"),
  {
    ssr: false,
    loading: () => (
      <LoadingSkeleton label="Đang tải biểu đồ analytics..." count={3} />
    ),
  },
);

export default function AnalyticsDashboardPage() {
  const params = useSearchParams();
  const lockedAgentId = params.get("agentId");
  
  // URL filters
  const urlFilters = useUrlFilters({
    agentId: "all",
    range: "7d",
    dateFrom: "",
    dateTo: "",
  });
  
  const [agentId, setAgentId] = useState<string>(lockedAgentId || urlFilters.getFilter("agentId"));
  const [range, setRange] = useState<string>(urlFilters.getFilter("range"));
  const [dateRange, setDateRange] = useState<DateRange>({
    from: urlFilters.getFilter("dateFrom") ? new Date(urlFilters.getFilter("dateFrom")) : undefined,
    to: urlFilters.getFilter("dateTo") ? new Date(urlFilters.getFilter("dateTo")) : undefined,
  });
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);

  const [summary, setSummary] = useState<{ creditsUsed: number; agentsUsed: number }>({ creditsUsed: 0, agentsUsed: 0 });
  const [usageSeries, setUsageSeries] = useState<Array<{ date: string; value: number }>>([]);
  const [creditsPerAgent, setCreditsPerAgent] = useState<Array<{ name: string; value: number }>>([]);
  const [conversationsByAgent, setConversationsByAgent] = useState<Array<{ name: string; value: number }>>([]);
  const [recentQueries, setRecentQueries] = useState<Array<{ id: string; agent: string; query: string; response: string; timestamp: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update URL when filters change
  useEffect(() => {
    if (lockedAgentId) return; // Don't update URL if locked
    urlFilters.setFilter("agentId", agentId);
  }, [agentId, lockedAgentId, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("range", range);
    if (range === "custom" && dateRange.from && dateRange.to) {
      urlFilters.setFilter("dateFrom", format(dateRange.from, "yyyy-MM-dd"));
      urlFilters.setFilter("dateTo", format(dateRange.to, "yyyy-MM-dd"));
    } else {
      urlFilters.setFilter("dateFrom", "");
      urlFilters.setFilter("dateTo", "");
    }
  }, [range, dateRange, urlFilters]);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const res = await listAgents({ page: 1, pageSize: 100 });
        const data = res.data?.agents || res.data?.data?.agents || [];
        setAgents([{ id: "all", name: "All agents" }, ...data.map((a: any) => ({ id: a.id, name: a.name }))]);
        if (lockedAgentId && data.some((a: any) => a.id === lockedAgentId)) setAgentId(lockedAgentId);
      } catch {}
    };
    if (!lockedAgentId) loadAgents();
  }, [params, lockedAgentId]);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nf = (id: string) => {
        const a = agents.find((x) => x.id === id);
        return a ? a.name : id;
      };
      // User summary with retry
      const user = await retryOnNetworkError(
        () => getUserAnalytics(),
        2
      );
      const u = user?.data || user;
      const creditsUsed = Number(u?.totalQueries ?? 0);
      const agentsUsed = Number(u?.uniqueAgents ?? 0);
      setSummary({ creditsUsed, agentsUsed });

      // Build params for tenant analytics
      let tenantParams: any = {};
      if (range === "custom" && dateRange.from && dateRange.to) {
        tenantParams.startDate = format(dateRange.from, "yyyy-MM-dd");
        tenantParams.endDate = format(dateRange.to, "yyyy-MM-dd");
      } else if (range !== "custom") {
        tenantParams.period = range;
      }

      // Tenant analytics for charts with retry
      const tenant = await retryOnNetworkError(
        () => getTenantAnalytics(tenantParams),
        2
      );
      const t = tenant?.data || tenant;

      // usage over time from dailyStats
      const ds: Record<string, number> = t?.dailyStats || {};
      const series = Object.entries(ds)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));
      setUsageSeries(series);

      const topAgents: Array<{ agentId: string; count: number }> = t?.topAgents || [];
      const perAgent = topAgents.map((x) => ({ name: nf(x.agentId), value: x.count }));
      setCreditsPerAgent(perAgent);
      setConversationsByAgent(perAgent);

      setRecentQueries(t?.recentQueries || u?.recentQueries || []);

      const effectiveAgentId = lockedAgentId || (agentId !== "all" ? agentId : "");
      if (effectiveAgentId) {
        const ag = await retryOnNetworkError(
          () => getAgentAnalytics(effectiveAgentId),
          2
        );
        const a = ag?.data || ag;
        setRecentQueries(a?.recentQueries || []);
        const single = [{ name: nf(effectiveAgentId), value: Number(a?.totalQueries ?? 0) }];
        setCreditsPerAgent(single);
        setConversationsByAgent(single);
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load analytics";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [agentId, range, dateRange, agents, lockedAgentId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleExport = async () => {
    try {
      const blob = await exportAnalytics(lockedAgentId ? { agentId: lockedAgentId } : undefined);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Export failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-3">
          {!lockedAgentId && (
            <>
              <Select value={agentId} onValueChange={setAgentId}>
                <SelectTrigger 
                  className="w-[220px]"
                  aria-label="Filter by agent"
                >
                  <SelectValue placeholder="All agents" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger 
                  className="w-[160px]"
                  aria-label="Select time range"
                >
                  <SelectValue placeholder="7d" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {range === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-[240px] justify-start text-left font-normal"
                      aria-label="Select custom date range"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                      ) : dateRange.from ? (
                        format(dateRange.from, "MMM dd, yyyy")
                      ) : (
                        "Pick dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </>
          )}
          <Button 
            variant="outline" 
            onClick={handleExport}
            aria-label="Export analytics data to CSV"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {loading && !usageSeries.length && !creditsPerAgent.length ? (
        <LoadingSkeleton label="Đang tải dữ liệu thống kê..." count={3} />
      ) : error ? (
        <ErrorState
          title="Không thể tải dữ liệu analytics"
          description={error}
          onAction={loadAnalytics}
          actionLabel="Thử tải lại"
        />
      ) : !loading && usageSeries.length === 0 && creditsPerAgent.length === 0 && recentQueries.length === 0 ? (
        <EmptyState
          title="No analytics data"
          description="Start using agents to see analytics here. Your usage statistics and charts will appear once you begin chatting with your agents."
          icon={<BarChart2 className="h-12 w-12" />}
        />
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{summary.creditsUsed.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Credits used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{summary.agentsUsed.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Agents used</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts
        usageSeries={usageSeries}
        conversationsByAgent={conversationsByAgent}
        creditsPerAgent={creditsPerAgent}
        recentQueries={recentQueries}
        loading={loading}
      />
      </>
      )}
    </div>
  );
}
