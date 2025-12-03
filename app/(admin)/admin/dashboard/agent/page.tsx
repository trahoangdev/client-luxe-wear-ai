"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "antd";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminListAllAgents,
  adminForceDeleteAgent,
  getAgent,
  getAgentStats,
} from "@/services/agentService";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  RefreshCw,
  BarChart3,
  Database,
  MessageSquare,
  User,
} from "lucide-react";
import {
  AdminActionState,
  AdminConfirmActionDialog,
} from "@/components/admin/AdminConfirmActionDialog";

export default function AdminAgentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [pubFilter, setPubFilter] = useState<"all" | "public" | "private">(
    "all",
  );
  const [sortKey, setSortKey] = useState<
    "created_desc" | "created_asc" | "name_asc" | "name_desc"
  >("created_desc");
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [confirmAction, setConfirmAction] =
    useState<AdminActionState<any> | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminListAllAgents({ page, perPage });
      const body = (res as any)?.data || res;
      const payload = body?.data || body;
      const agents = payload?.agents || body?.agents || [];
      const pagination = payload?.pagination || body?.pagination || { total: agents.length };
      setData(agents);
      setTotal(pagination.total || agents.length);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, perPage]);

  const handleViewAgent = async (agent: any) => {
    setSelectedAgent(agent);
    setViewOpen(true);
    setLoadingStats(true);
    try {
      const [agentDetail, agentStats] = await Promise.all([
        getAgent(agent.id),
        getAgentStats(agent.id).catch(() => null),
      ]);
      const detail = (agentDetail as any)?.data || agentDetail;
      setSelectedAgent({ ...agent, ...detail });
      setStats((agentStats as any)?.data || agentStats);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Failed to load agent details",
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const filtered = useMemo(() => {
    let list = Array.isArray(data) ? [...data] : [];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => 
        (a.name || '').toLowerCase().includes(q) || 
        (a.description || '').toLowerCase().includes(q) ||
        (a.owner?.email || '').toLowerCase().includes(q) ||
        (a.owner?.name || '').toLowerCase().includes(q)
      );
    }
    if (pubFilter !== 'all') {
      list = list.filter((a) => (pubFilter === 'public' ? a.isPublic : !a.isPublic));
    }
    switch (sortKey) {
      case 'created_asc':
        list.sort((a, b) => new Date(a.createdAt || a.created_at).getTime() - new Date(b.createdAt || b.created_at).getTime());
        break;
      case 'name_asc':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name_desc':
        list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
    }
    return list;
  }, [data, query, pubFilter, sortKey]);

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (_: any, r: any) => (
        <div>
          <div className="font-medium">{r.name}</div>
          {r.description && (
            <div className="text-xs text-muted-foreground truncate max-w-[300px]">{r.description}</div>
          )}
        </div>
      ),
    },
    { 
      title: 'Owner', 
      dataIndex: ['owner','email'], 
      key: 'owner', 
      render: (_: any, r: any) => (
        <div>
          <div className="text-sm">{r.owner?.email || '-'}</div>
          {r.owner?.name && (
            <div className="text-xs text-muted-foreground">{r.owner.name}</div>
          )}
        </div>
      ),
    },
    { 
      title: 'Visibility', 
      dataIndex: 'isPublic', 
      key: 'isPublic', 
      render: (v: boolean) => v ? <Tag color="green">Public</Tag> : <Tag>Private</Tag> 
    },
    { 
      title: 'Created', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      render: (_: any, r: any) => {
        const d = r.createdAt || r.created_at;
        return d ? (
          <div>
            <div className="text-sm">{new Date(d).toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">{new Date(d).toLocaleTimeString()}</div>
          </div>
        ) : '-';
      } 
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, r: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewAgent(r)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              setConfirmAction({
                type: "delete",
                target: r,
                title: `Force delete agent "${r.name}"?`,
                description:
                  "Thao tác này không thể hoàn tác. Tất cả hội thoại và cấu hình liên quan có thể bị xoá vĩnh viễn.",
              })
            }
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Statistics summary
  const statsSummary = useMemo(() => {
    const publicCount = data.filter(a => a.isPublic).length;
    const privateCount = data.filter(a => !a.isPublic).length;
    return { public: publicCount, private: privateCount, total: data.length };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
          <p className="text-muted-foreground mt-1">Manage all AI agents in the system</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Public Agents</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.public}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Private Agents</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.private}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            placeholder="Search by name, description, or owner email" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="flex-1" 
          />
          <Select value={pubFilter} onValueChange={(v: any) => setPubFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(v: any) => setSortKey(v)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1); }}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}/page</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Agents Table */}
      <Card className="rounded-2xl border overflow-x-auto p-2">
        {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
        {(() => {
          const { Table } = require("antd");
          return (
            <Table
              rowKey="id"
              size="middle"
              columns={columns as any}
              dataSource={filtered}
              loading={loading}
              pagination={{
                current: page,
                pageSize: perPage,
                total: filtered.length,
                showSizeChanger: false,
                onChange: (p: number) => setPage(p),
              }}
              scroll={{ x: 1200 }}
            />
          );
        })()}
      </Card>

      {/* View Agent Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <p className="mt-1">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Visibility:</span>
                    <p className="mt-1">
                      {selectedAgent.isPublic ? (
                        <Tag color="green">Public</Tag>
                      ) : (
                        <Tag>Private</Tag>
                      )}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Description:</span>
                    <p className="mt-1">{selectedAgent.description || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Owner:</span>
                    <p className="mt-1">{selectedAgent.owner?.email || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Created:</span>
                    <p className="mt-1">
                      {selectedAgent.createdAt || selectedAgent.created_at
                        ? new Date(selectedAgent.createdAt || selectedAgent.created_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {stats && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Conversations</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalConversations || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Users</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Knowledge</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.knowledgeEntries || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Config */}
              {selectedAgent.config && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Configuration</h3>
                  <pre className="p-3 rounded-lg border bg-muted/40 text-xs overflow-x-auto">
                    {JSON.stringify(selectedAgent.config, null, 2)}
                  </pre>
                </div>
              )}

              {/* System Prompt */}
              {selectedAgent.systemPrompt && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">System Prompt</h3>
                  <div className="p-3 rounded-lg border bg-muted/40 text-sm">
                    {selectedAgent.systemPrompt}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedAgent.instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                  <div className="p-3 rounded-lg border bg-muted/40 text-sm">
                    {selectedAgent.instructions}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            {selectedAgent && (
              <Button
                variant="destructive"
                onClick={() =>
                  setConfirmAction({
                    type: "delete",
                    target: selectedAgent,
                    title: `Force delete agent "${selectedAgent.name}"?`,
                    description:
                      "Thao tác này không thể hoàn tác. Tất cả hội thoại và cấu hình liên quan có thể bị xoá vĩnh viễn.",
                  })
                }
              >
                Force Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminConfirmActionDialog
        action={confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
        onConfirm={async (action) => {
          if (!action.target) return;
          const agentId = (action.target as any).id;
          try {
            if (action.type === "delete") {
              await adminForceDeleteAgent(agentId);
              toast.success("Agent deleted");
              if (selectedAgent?.id === agentId) {
                setViewOpen(false);
              }
            }
            load();
          } catch (e: any) {
            toast.error(
              e?.response?.data?.message || "Failed to perform action",
            );
          }
        }}
      />
    </div>
  );
}
