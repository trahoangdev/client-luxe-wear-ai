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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminListAllKnowledge,
  adminGetKnowledgeStats,
  adminForceDeleteKnowledge,
  adminGetKnowledge,
} from "@/services/knowledgeService";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  RefreshCw,
  Database,
  Search,
  FileText,
} from "lucide-react";
import {
  AdminActionState,
  AdminConfirmActionDialog,
} from "@/components/admin/AdminConfirmActionDialog";
import { DataTable } from "@/components/admin/users/data-table";
import { columns } from "@/components/admin/knowledge/columns";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table";

export default function AdminKnowledgePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Table State
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [query, setQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [selectedKnowledge, setSelectedKnowledge] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [confirmAction, setConfirmAction] =
    useState<AdminActionState<any> | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = pagination.pageIndex + 1;
      const perPage = pagination.pageSize;

      const [knowledgeRes, statsRes] = await Promise.all([
        adminListAllKnowledge({
          page,
          perPage,
          agentId: agentFilter !== 'all' ? agentFilter : undefined,
        }),
        adminGetKnowledgeStats().catch(() => null),
      ]);

      // Parse knowledge response
      const body = (knowledgeRes as any)?.data || knowledgeRes;
      let knowledge: any[] = [];
      let paginationTotal = 0;

      // Try different response structures
      if (Array.isArray(body)) {
        knowledge = body;
        paginationTotal = body.length;
      } else if (body?.data) {
        if (Array.isArray(body.data)) {
          knowledge = body.data;
        } else if (body.data?.knowledge) {
          knowledge = Array.isArray(body.data.knowledge) ? body.data.knowledge : [];
        } else if (body.data?.entries) {
          knowledge = Array.isArray(body.data.entries) ? body.data.entries : [];
        }
        paginationTotal = body.pagination?.total || body.pagination?.totalCount || body.data?.pagination?.total || knowledge.length;
      } else if (body?.knowledge) {
        knowledge = Array.isArray(body.knowledge) ? body.knowledge : [];
        paginationTotal = body.pagination?.total || body.pagination?.totalCount || knowledge.length;
      } else if (body?.entries) {
        knowledge = Array.isArray(body.entries) ? body.entries : [];
        paginationTotal = body.pagination?.total || body.pagination?.totalCount || knowledge.length;
      }

      setData(knowledge);
      setTotal(paginationTotal);
      setPageCount(Math.ceil(paginationTotal / perPage));

      // Parse stats response
      const statsBody = (statsRes as any)?.data || statsRes;
      setStats(statsBody);
    } catch (e: any) {
      console.error("Failed to load knowledge:", e);
      if (e?.response?.status === 404 || e?.response?.status === 500) {
        setData([]);
        setTotal(0);
      } else {
        toast.error(e?.response?.data?.message || "Failed to load knowledge");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [pagination, agentFilter]);

  const handleViewKnowledge = async (item: any) => {
    setSelectedKnowledge(item);
    setViewOpen(true);
    try {
      const detail = await adminGetKnowledge(item.id);
      const detailData = (detail as any)?.data || detail;
      setSelectedKnowledge({ ...item, ...detailData });
    } catch (e: any) {
      if (e?.response?.status === 404) {
        console.warn(
          "Admin knowledge detail API not available, using list data",
        );
      } else {
        console.warn(
          "Could not fetch detailed knowledge info:",
          e?.response?.data?.message || e?.message,
        );
      }
    }
  };

  // Pre-filter data client-side if query exists (since API might strictly filter)
  // Or we just rely on API if implemented. The code had client-side filtering below.
  // I will keep the filtering logic on 'data' but ideally the API handles 'q'.
  // The API call currently doesn't pass 'q' for query. The original code did:
  /*
      const filtered = useMemo(() => {
        let list = Array.isArray(data) ? [...data] : [];
        if (query.trim()) { ... }
        return list;
      }, [data, query]);
  */
  // I will reproduce this client side filtering behavior on top of the paginated data for now,
  // or pass 'q' to API if I updated the service. The service `adminListAllKnowledge` signature implies page/perPage/agentId only in original code.
  // So I'll keep client side filtering of the *current page* which is suboptimal but safe.

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((k) =>
      (k.title || '').toLowerCase().includes(q) ||
      (k.content || '').toLowerCase().includes(q) ||
      (k.agent?.name || '').toLowerCase().includes(q) ||
      (k.user?.email || '').toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Management</h1>
          <p className="text-muted-foreground mt-1">Manage all knowledge entries in the system</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold mt-1">{stats.totalEntries || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">By Agent</p>
                <p className="text-2xl font-bold mt-1">{stats.byAgent || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">By User</p>
                <p className="text-2xl font-bold mt-1">{stats.byUser || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Usage</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.storageUsage ? `${(stats.storageUsage / 1024 / 1024).toFixed(2)} MB` : '0 MB'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, content, agent, or user"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={agentFilter} onValueChange={(v) => { setAgentFilter(v); setPagination(p => ({ ...p, pageIndex: 0 })); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {/* Agent options would be loaded from API */}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Knowledge Table */}
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        {loading ? (
          <TableSkeleton rowCount={pagination.pageSize} columnCount={5} />
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            onView={handleViewKnowledge}
            onDelete={(r) => {
              setConfirmAction({
                type: "delete",
                target: r,
                title: `Force delete knowledge entry "${r.title || r.id}"?`,
                description:
                  "Thao tác này không thể hoàn tác. Dữ liệu kiến thức này sẽ bị xoá vĩnh viễn khỏi hệ thống.",
              });
            }}
          />
        )}
      </div>

      {/* View Knowledge Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Knowledge Entry Details</DialogTitle>
          </DialogHeader>
          {selectedKnowledge && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Title:</span>
                    <p className="mt-1">{selectedKnowledge.title || '(No title)'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Agent:</span>
                    <p className="mt-1">{selectedKnowledge.agent?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">User:</span>
                    <p className="mt-1">{selectedKnowledge.user?.email || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Tenant:</span>
                    <p className="mt-1">{selectedKnowledge.tenant?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Created:</span>
                    <p className="mt-1">
                      {selectedKnowledge.createdAt || selectedKnowledge.created_at
                        ? new Date(selectedKnowledge.createdAt || selectedKnowledge.created_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              {selectedKnowledge.content && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Content</h3>
                  <div className="p-3 rounded-lg border bg-muted/40 text-sm max-h-[300px] overflow-y-auto">
                    {selectedKnowledge.content}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedKnowledge.metadata && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Metadata</h3>
                  <pre className="p-3 rounded-lg border bg-muted/40 text-xs overflow-x-auto">
                    {JSON.stringify(selectedKnowledge.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            {selectedKnowledge && (
              <Button
                variant="destructive"
                onClick={() =>
                  setConfirmAction({
                    type: "delete",
                    target: selectedKnowledge,
                    title: `Force delete knowledge entry "${selectedKnowledge.title || selectedKnowledge.id}"?`,
                    description:
                      "Thao tác này không thể hoàn tác. Dữ liệu kiến thức này sẽ bị xoá vĩnh viễn khỏi hệ thống.",
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
          const id = (action.target as any).id;
          try {
            if (action.type === "delete") {
              await adminForceDeleteKnowledge(id);
              toast.success("Knowledge deleted");
              if (selectedKnowledge?.id === id) {
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
