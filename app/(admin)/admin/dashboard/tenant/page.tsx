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
  adminListAllTenants,
  adminGetTenantStats,
  adminSuspendTenant,
  adminActivateTenant,
  adminDeleteTenant,
  getTenantById,
  getTenantStats,
  listTenantMembers,
} from "@/services/tenantService";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  RefreshCw,
  Building2,
  Users,
  Ban,
  CheckCircle,
  Search,
} from "lucide-react";
import {
  AdminActionState,
  AdminConfirmActionDialog,
} from "@/components/admin/AdminConfirmActionDialog";

export default function AdminTenantsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [tenantStats, setTenantStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] =
    useState<AdminActionState<any> | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [tenantsRes, statsRes] = await Promise.all([
        adminListAllTenants({ 
          page, 
          perPage,
          plan: planFilter !== 'all' ? planFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          q: query.trim() || undefined,
        }),
        adminGetTenantStats().catch(() => null),
      ]);

      // Parse tenants response
      const body = (tenantsRes as any)?.data || tenantsRes;
      let tenants: any[] = [];
      let paginationTotal = 0;

      // Try different response structures
      if (Array.isArray(body)) {
        tenants = body;
        paginationTotal = body.length;
      } else if (body?.data) {
        if (Array.isArray(body.data)) {
          tenants = body.data;
        } else if (body.data?.tenants) {
          tenants = Array.isArray(body.data.tenants) ? body.data.tenants : [];
        }
        paginationTotal =
          body.pagination?.total ||
          body.pagination?.totalCount ||
          body.data?.pagination?.total ||
          tenants.length;
      } else if (body?.tenants) {
        tenants = Array.isArray(body.tenants) ? body.tenants : [];
        paginationTotal =
          body.pagination?.total ||
          body.pagination?.totalCount ||
          tenants.length;
      }

      setData(tenants);
      setTotal(paginationTotal);
      
      // Parse stats response
      const statsBody = (statsRes as any)?.data || statsRes;
      setStats(statsBody);
    } catch (e: any) {
      console.error("Failed to load tenants:", e);
      // If API fails, try to show empty state gracefully
      if (e?.response?.status === 404 || e?.response?.status === 500) {
        setData([]);
        setTotal(0);
        // Don't show error toast for 404/500, just show empty state
      } else {
        toast.error(e?.response?.data?.message || "Failed to load tenants");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timer = setTimeout(() => {
      if (query) {
        setPage(1);
        load();
      } else {
        load();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => { load(); }, [page, perPage, planFilter, statusFilter]);

  const handleViewTenant = async (tenant: any) => {
    setSelectedTenant(tenant);
    setViewOpen(true);
    try {
      const [detail, stats, membersList] = await Promise.all([
        getTenantById(tenant.id),
        getTenantStats(tenant.id).catch(() => null),
        listTenantMembers(tenant.id).catch(() => ({ data: [] })),
      ]);
      const detailData = (detail as any)?.data || detail;
      setSelectedTenant({ ...tenant, ...detailData });
      setTenantStats((stats as any)?.data || stats);
      setMembers((membersList as any)?.data || []);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Failed to load tenant details",
      );
    }
  };

  const handleSuspend = async (tenantId: string) => {
    setConfirmAction({
      type: "suspend",
      target: { id: tenantId },
      title: "Suspend tenant này?",
      description:
        "Tenant sẽ bị tạm dừng truy cập cho tới khi được kích hoạt lại.",
    });
  };

  const handleActivate = async (tenantId: string) => {
    setConfirmAction({
      type: "activate",
      target: { id: tenantId },
      title: "Activate tenant này?",
      description: "Tenant sẽ được mở lại quyền truy cập vào hệ thống.",
    });
  };

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (_: any, r: any) => (
        <div>
          <div className="font-medium">{r.name}</div>
          {r.id && (
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{r.id}</div>
          )}
        </div>
      ),
    },
    { 
      title: 'Plan', 
      dataIndex: 'plan', 
      key: 'plan', 
      render: (v: string) => {
        const colors: Record<string, string> = {
          free: 'default',
          pro: 'blue',
          enterprise: 'purple',
        };
        return <Tag color={colors[v] || 'default'}>{v || 'free'}</Tag>;
      }
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (v: string) => {
        const colors: Record<string, string> = {
          active: "green",
          inactive: "default",
          suspended: "red",
        };
        return <Tag color={colors[v] || "default"}>{v || "active"}</Tag>;
      }
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
      title: 'Actions', 
      key: 'actions', 
      fixed: 'right' as const, 
      render: (_: any, r: any) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewTenant(r)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {r.status === 'suspended' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleActivate(r.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Activate
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSuspend(r.id)}
            >
              <Ban className="h-4 w-4 mr-1" />
              Suspend
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={async () => {
              setConfirmAction({
                type: "delete",
                target: r,
                title: `Xoá tenant "${r.name}"?`,
                description:
                  "Thao tác này không thể hoàn tác. Dữ liệu và quyền truy cập liên quan có thể bị xoá vĩnh viễn.",
              });
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ) 
    },
  ];

  // Statistics summary
  const statsSummary = useMemo(() => {
    const byPlan: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    data.forEach((t) => {
      byPlan[t.plan || "free"] = (byPlan[t.plan || "free"] || 0) + 1;
      byStatus[t.status || "active"] =
        (byStatus[t.status || "active"] || 0) + 1;
    });
    return { byPlan, byStatus, total: data.length };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">Manage all tenants in the system</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Free Plan</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.byPlan.free || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pro Plan</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.byPlan.pro || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : statsSummary.byStatus.active || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
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

      {/* Tenants Table */}
      <Card className="rounded-2xl border overflow-x-auto p-2">
        {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
        {(() => {
          const { Table } = require("antd");
          return (
            <Table
              rowKey="id"
              size="middle"
              columns={columns as any}
              dataSource={data}
              loading={loading}
              pagination={{
                current: page,
                pageSize: perPage,
                total,
                showSizeChanger: false,
                onChange: (p: number) => setPage(p),
              }}
              scroll={{ x: 1200 }}
            />
          );
        })()}
      </Card>

      {/* View Tenant Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <p className="mt-1">{selectedTenant.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Plan:</span>
                    <p className="mt-1">
                      <Tag color={selectedTenant.plan === 'enterprise' ? 'purple' : selectedTenant.plan === 'pro' ? 'blue' : 'default'}>
                        {selectedTenant.plan || 'free'}
                      </Tag>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <p className="mt-1">
                      <Tag color={selectedTenant.status === 'active' ? 'green' : selectedTenant.status === 'suspended' ? 'red' : 'default'}>
                        {selectedTenant.status || 'active'}
                      </Tag>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Created:</span>
                    <p className="mt-1">
                      {selectedTenant.createdAt || selectedTenant.created_at
                        ? new Date(selectedTenant.createdAt || selectedTenant.created_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">ID:</span>
                    <p className="mt-1 break-all text-xs">{selectedTenant.id}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {tenantStats && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Agents</div>
                      <p className="text-2xl font-bold">{tenantStats.totalAgents || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Knowledge</div>
                      <p className="text-2xl font-bold">{tenantStats.totalKnowledge || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Usage</div>
                      <p className="text-2xl font-bold">{tenantStats.totalUsage || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Members */}
              {members.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Members ({members.length})</h3>
                  <div className="space-y-2">
                    {members.map((member: any) => (
                      <div key={member.userId} className="flex items-center justify-between p-2 rounded-lg border">
                        <div>
                          <p className="text-sm font-medium">{member.user?.email || member.userId}</p>
                          <p className="text-xs text-muted-foreground">Joined: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}</p>
                        </div>
                        <Tag>{member.role || 'member'}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            {selectedTenant && (
              <>
                {selectedTenant.status === 'suspended' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleActivate(selectedTenant.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleSuspend(selectedTenant.id)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    setConfirmAction({
                      type: "delete",
                      target: selectedTenant,
                      title: `Xoá tenant "${selectedTenant.name}"?`,
                      description:
                        "Thao tác này không thể hoàn tác. Dữ liệu và quyền truy cập liên quan có thể bị xoá vĩnh viễn.",
                    });
                  }}
                >
                  Delete
                </Button>
              </>
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
          const tenantId = (action.target as any).id;
          try {
            if (action.type === "delete") {
              await adminDeleteTenant(tenantId);
              toast.success("Tenant deleted");
              if (selectedTenant?.id === tenantId) {
                setViewOpen(false);
              }
            } else if (action.type === "suspend") {
              await adminSuspendTenant(tenantId);
              toast.success("Tenant suspended");
              if (selectedTenant?.id === tenantId) {
                setSelectedTenant({ ...selectedTenant, status: "suspended" });
              }
            } else if (action.type === "activate") {
              await adminActivateTenant(tenantId);
              toast.success("Tenant activated");
              if (selectedTenant?.id === tenantId) {
                setSelectedTenant({ ...selectedTenant, status: "active" });
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

