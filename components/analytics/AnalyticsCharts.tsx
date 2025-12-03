"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

interface UsagePoint {
  date: string;
  value: number;
}

interface CreditsPoint {
  name: string;
  value: number;
}

interface RecentQuery {
  id: string;
  agent: string;
  query: string;
  response: string;
  timestamp: string;
}

interface AnalyticsChartsProps {
  usageSeries: UsagePoint[];
  conversationsByAgent: CreditsPoint[];
  creditsPerAgent: CreditsPoint[];
  recentQueries: RecentQuery[];
  loading?: boolean;
}

export default function AnalyticsCharts({
  usageSeries,
  conversationsByAgent,
  creditsPerAgent,
  recentQueries,
  loading = false,
}: AnalyticsChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Usage over time</div>
            <ChartContainer
              config={{ usage: { label: "Usage", color: "hsl(var(--primary))" } }}
            >
              <LineChart data={usageSeries} margin={{ left: 12, right: 12 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-usage)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Conversations by agent</div>
            <ChartContainer config={{}}>
              <PieChart>
                <Pie
                  data={conversationsByAgent}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {conversationsByAgent.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Credits per agent</div>
            <ChartContainer
              config={{
                credits: {
                  label: "Credits",
                  color: "hsl(var(--primary))",
                },
              }}
            >
              <BarChart data={creditsPerAgent}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-credits)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Recent queries</div>
            {loading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs">
                    <tr>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Agent</th>
                      <th className="text-left p-2">Query</th>
                      <th className="text-left p-2">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQueries.length === 0 ? (
                      <tr>
                        <td
                          className="p-2 text-muted-foreground"
                          colSpan={4}
                        >
                          No data
                        </td>
                      </tr>
                    ) : (
                      recentQueries.map((r) => (
                        <tr key={r.id} className="border-t align-top">
                          <td className="p-2 whitespace-nowrap">
                            {new Date(r.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2 whitespace-nowrap">{r.agent}</td>
                          <td
                            className="p-2 max-w-[180px] truncate"
                            title={r.query}
                          >
                            {r.query}
                          </td>
                          <td
                            className="p-2 max-w-[220px] truncate"
                            title={r.response}
                          >
                            {r.response}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}


