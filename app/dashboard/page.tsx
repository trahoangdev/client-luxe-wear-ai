"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingGrid } from "@/components/shared/LoadingGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteAgent, getAgent, createAgent } from "@/services/agentService";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { chat } from "@/services/chatService";
import { trackEvent, reportError } from "@/services/observabilityService";
import { useTenant } from "@/lib/hooks/useTenant";
import { usePagination } from "@/lib/hooks/usePagination";
import { useUrlFilters } from "@/lib/hooks/useUrlFilters";
import { useListAgentsQuery, useSearchAgentsQuery } from "@/services/agentsApi";
import { AgentCard } from "@/components/agent/AgentCard";

export default function DashboardHomePage() {
  const router = useRouter();
  const { currentTenant } = useTenant();
  
  // URL filters
  const urlFilters = useUrlFilters({
    q: "",
    sortBy: "created_at-DESC",
    page: "1",
    status: "all",
  });

  const [agents, setAgents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlFilters.getFilter("q"));
  const { page, pageCount, setPage, setPageSize, setTotal } = usePagination(Number(urlFilters.getFilter("page")) || 1, 12);
  const [perPage, setPerPage] = useState(12);
  const [sortBy, setSortBy] = useState(urlFilters.getFilter("sortBy") || "created_at-DESC");
  const [statusFilter, setStatusFilter] = useState<string>(urlFilters.getFilter("status") || "all");
  const [confirmOpen, setConfirmOpen] = useState<null | { id: string; name: string }>(null);
  const [chatAgentId, setChatAgentId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const hasSearch = !!searchTerm.trim();
  const {
    data: listData,
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    refetch: refetchList,
  } = useListAgentsQuery(
    { page, pageSize: perPage },
    { skip: !currentTenant || hasSearch }
  );
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    refetch: refetchSearch,
  } = useSearchAgentsQuery(
    { q: searchTerm.trim(), page, pageSize: perPage },
    { skip: !currentTenant || !hasSearch }
  );

  useEffect(() => {
    if (!currentTenant) {
      setAgents([]);
      setTotal(0);
      return;
    }
    const source = hasSearch ? searchData : listData;
    if (!source) return;

    let agentsData = (source as any).data?.agents || (source as any).agents || [];
    const pagination = (source as any).data?.pagination || (source as any).pagination;

    // Apply status filter (Public/Private)
    if (statusFilter !== "all") {
      agentsData = agentsData.filter((agent: any) => {
        const isPublic = agent.isPublic ?? agent.is_public ?? false;
        if (statusFilter === "public") return isPublic === true;
        if (statusFilter === "private") return isPublic === false;
        return true;
      });
    }

    // Apply sorting
    const [field, order] = sortBy.split("-");
    agentsData = [...agentsData].sort((a: any, b: any) => {
      const aName = a.name?.toLowerCase?.() || "";
      const bName = b.name?.toLowerCase?.() || "";
      const aCreated = new Date(a.createdAt || a.created_at || 0).getTime();
      const bCreated = new Date(b.createdAt || b.created_at || 0).getTime();
      if (field === "name") {
        return order === "ASC" ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }
      return order === "ASC" ? aCreated - bCreated : bCreated - aCreated;
    });

    setAgents(agentsData);
    setTotal(agentsData.length); // Use filtered count for pagination
  }, [currentTenant, hasSearch, listData, searchData, sortBy, setTotal]);

  // Update URL when filters change
  useEffect(() => {
    urlFilters.setFilter("q", searchTerm);
  }, [searchTerm, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("sortBy", sortBy);
  }, [sortBy, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("page", String(page));
  }, [page, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("status", statusFilter);
    setPage(1); // Reset to first page when filter changes
  }, [statusFilter, urlFilters]);

  const showTenantEmpty = !currentTenant;
  const loading = isLoadingList || isLoadingSearch || isFetchingList || isFetchingSearch;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">AI Agents</h1>
        <Button onClick={() => router.push("/dashboard/agents/new")} disabled={!currentTenant} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Tạo AI Agent mới
        </Button>
      </div>

      {showTenantEmpty ? (
        <EmptyState
          title="Bạn chưa chọn workspace nào"
          description="Chọn hoặc tạo workspace tenant để xem và quản lý AI agents của bạn."
          actionLabel="Đi đến Tenants"
          onAction={() => router.push("/dashboard/tenants")}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Tìm kiếm agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px]"
              aria-label="Search agents"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger 
                className="w-[140px]"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                className="w-[180px]"
                aria-label="Sort agents"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-DESC">Mới nhất trước</SelectItem>
                <SelectItem value="created_at-ASC">Cũ nhất trước</SelectItem>
                <SelectItem value="name-ASC">Tên A-Z</SelectItem>
                <SelectItem value="name-DESC">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
              <Select
                value={String(perPage)}
                onValueChange={(v) => {
                  const next = parseInt(v);
                  setPerPage(next);
                  setPageSize(next);
                  setPage(1);
                }}
              >
              <SelectTrigger className="w-[110px]"><SelectValue placeholder="Mỗi trang" /></SelectTrigger>
              <SelectContent>
                {[6,12,24,36].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}/trang</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingGrid />
          ) : agents.length === 0 ? (
            <EmptyState
              title="Chưa có agent nào trong tenant này"
              description="Tạo AI Agent đầu tiên để bắt đầu phục vụ khách hàng với LuxeWear."
              actionLabel="Tạo agent đầu tiên của bạn"
              onAction={() => router.push("/dashboard/agents/new")}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onOpenDetail={() => router.push(`/dashboard/chat?agentId=${agent.id}`)}
                    onChat={() => {
                      setChatAgentId(agent.id);
                      setChatMessages([]);
                    }}
                    onDuplicate={async () => {
                      try {
                        const res = await getAgent(agent.id);
                        const data = res.data || res;
                        const payload = {
                          name: `${data.name || agent.name} Copy`,
                          description: data.description || agent.description,
                          config: data.config || agent.config,
                        } as any;
                        const created = await createAgent(payload);
                        if (created.success) {
                          toast.success("Đã sao chép agent");
                        } else {
                          toast.error(created.message || "Sao chép thất bại");
                        }
                      } catch (e: any) {
                        toast.error(e?.response?.data?.message || e?.message || "Sao chép thất bại");
                      }
                    }}
                    onDelete={() => setConfirmOpen({ id: agent.id, name: agent.name })}
                  />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <span className="py-2 px-4">
                    {page} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page >= pageCount}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Dialog open={!!confirmOpen} onOpenChange={(o) => { if (!o) setConfirmOpen(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa agent</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Bạn có chắc chắn muốn xóa {confirmOpen?.name}? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(null)}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirmOpen) return;
                try {
                  const res = await deleteAgent(confirmOpen.id);
                  if (res.success) {
                    toast.success("Đã xóa agent");
                    setConfirmOpen(null);
                    // reload current list/search
                    refetchList();
                    refetchSearch();
                  } else {
                    toast.error(res.message || "Xóa agent thất bại");
                  }
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || e?.message || "Xóa agent thất bại");
                }
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!chatAgentId} onOpenChange={(o) => { if (!o) { setChatAgentId(null); setChatMessages([]); } }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Trò chuyện nhanh</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-3 bg-muted/30">
            {chatMessages.length === 0 && (
              <p className="text-xs text-muted-foreground">Bắt đầu cuộc trò chuyện nhanh với agent này.</p>
            )}
            {chatMessages.map((m, idx) => (
              <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                <span className="inline-block text-sm px-3 py-2 rounded-lg bg-white shadow-sm">
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Textarea
              rows={3}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  // Ctrl+Enter: chèn xuống dòng
                  e.preventDefault();
                  const target = e.currentTarget;
                  const { selectionStart, selectionEnd, value } = target;
                  const nextValue =
                    value.slice(0, selectionStart ?? value.length) +
                    "\n" +
                    value.slice(selectionEnd ?? value.length);
                  setChatInput(nextValue);
                  requestAnimationFrame(() => {
                    const pos = (selectionStart ?? 0) + 1;
                    target.selectionStart = target.selectionEnd = pos;
                  });
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!chatAgentId || !chatInput.trim() || chatLoading) return;
                  const msg = chatInput.trim();
                  setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
                  setChatInput("");
                  setChatLoading(true);
                  void (async () => {
                    try {
                      const res = await chat(chatAgentId, { message: msg });
                      const reply =
                        (res as any).data?.response ||
                        (res as any).data?.message ||
                        (res as any).message ||
                        "(không có phản hồi)";
                      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
                      void trackEvent("quick_chat_message_sent", {
                        agentId: chatAgentId,
                        source: "dashboard_quick_chat",
                        length: msg.length,
                      });
                    } catch (e: any) {
                      if (e?.message === "CHAT_TIMEOUT") {
                        toast.error("Phản hồi mất hơn 20 giây, vui lòng thử lại.");
                      } else {
                        toast.error(e?.response?.data?.message || e?.message || "Trò chuyện thất bại");
                      }
                      void reportError(e, {
                        component: "DashboardQuickChat",
                        extra: { agentId: chatAgentId },
                      });
                    } finally {
                      setChatLoading(false);
                    }
                  })();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setChatInput("")}>Xóa</Button>
              <Button
                onClick={async () => {
                  if (!chatAgentId || !chatInput.trim()) return;
                  const msg = chatInput.trim();
                  setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
                  setChatInput("");
                  setChatLoading(true);
                  try {
                    const res = await chat(chatAgentId, { message: msg });
                    const reply =
                      (res as any).data?.response ||
                      (res as any).data?.message ||
                      (res as any).message ||
                      "(không có phản hồi)";
                    setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
                    void trackEvent("quick_chat_message_sent", {
                      agentId: chatAgentId,
                      source: "dashboard_quick_chat",
                      length: msg.length,
                    });
                  } catch (e: any) {
                    if (e?.message === "CHAT_TIMEOUT") {
                      toast.error("Phản hồi mất hơn 20 giây, vui lòng thử lại.");
                    } else {
                      toast.error(e?.response?.data?.message || e?.message || "Trò chuyện thất bại");
                    }
                    void reportError(e, {
                      component: "DashboardQuickChat",
                      extra: { agentId: chatAgentId },
                    });
                  } finally {
                    setChatLoading(false);
                  }
                }}
                disabled={chatLoading}
              >
                {chatLoading ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
