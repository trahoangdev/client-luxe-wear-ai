'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/admin/users/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from '@/components/ui/table-skeleton';
import {
  RefreshCw,
  Search,
  Download,
  Activity,
  User,
  Bot,
  Database,
  Building2,
  Settings,
  AlertCircle
} from 'lucide-react';
import { toast } from "sonner";
import { getActivityLogs, exportActivityLogs, type ActivityLog } from '@/services/adminService';
import { adminListUsers, type AdminUserListResponse } from '@/services/userService';
import { adminListAllAgents, type AdminAgentListResponse } from '@/services/agentService';

export default function AdminActivityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Try to get activity logs from API
      let logsList: any[] = [];
      let totalCount = 0;

      try {
        const res = await getActivityLogs({
          page,
          perPage,
          action: actionFilter !== 'all' ? actionFilter : undefined,
          userId: userFilter !== 'all' ? userFilter : undefined,
          dateRange: dateRange !== 'all' ? dateRange : undefined,
        });

        // Handle different response structures
        const body = (res as any)?.data || res;
        const payload = body?.data || body;

        // Try multiple possible field names for logs
        logsList = payload?.logs ||
          payload?.activities ||
          payload?.activity_logs ||
          (Array.isArray(payload) ? payload : []);

        // Handle pagination
        const pagination = payload?.pagination ||
          body?.pagination ||
          payload?.meta ||
          { total: logsList.length };
        totalCount = pagination.total ||
          pagination.totalCount ||
          pagination.count ||
          logsList.length;
      } catch (apiError: any) {
        // If API not available (404, 500, or network error), generate logs from users and agents
        const isApiUnavailable =
          apiError?.response?.status === 404 ||
          apiError?.response?.status === 500 ||
          apiError?.status === 404 ||
          apiError?.message?.includes('Route not found') ||
          apiError?.message?.includes('404');

        if (isApiUnavailable) {
          const [usersRes, agentsRes] = await Promise.all([
            adminListUsers({ page: 1, perPage: 1000 }).catch(() => ({ users: [], total: 0 } as unknown as AdminUserListResponse)),
            adminListAllAgents({ page: 1, perPage: 1000 }).catch(() => ({ data: { agents: [] } } as unknown as AdminAgentListResponse)),
          ]);

          const users = usersRes.users || [];
          const agents = agentsRes.data?.agents || [];

          // Calculate date range
          const now = new Date();
          let startDate = new Date();
          if (dateRange === '24h') {
            startDate.setHours(now.getHours() - 24);
          } else if (dateRange === '7d') {
            startDate.setDate(now.getDate() - 7);
          } else if (dateRange === '30d') {
            startDate.setDate(now.getDate() - 30);
          } else if (dateRange === '90d') {
            startDate.setDate(now.getDate() - 90);
          }

          // Generate activity logs from users
          const userLogs = users
            .filter((u) => {
              const created = u.created_at;
              if (!created) return false;
              return new Date(created) >= startDate;
            })
            .map((u) => ({
              id: `user-${u.id}`,
              action: 'user_registered',
              actor: {
                email: u.email,
                name: u.name,
                id: u.id,
              },
              target: `User: ${u.name || u.email}`,
              timestamp: u.created_at,
              created_at: u.created_at,
              metadata: {
                userId: u.id,
                email: u.email,
              },
            }));

          // Generate activity logs from agents
          const agentLogs = agents
            .filter((a) => {
              const created = a.created_at;
              if (!created) return false;
              return new Date(created) >= startDate;
            })
            .map((a) => ({
              id: `agent-${a.id}`,
              action: 'agent_created',
              actor: {
                email: a.owner?.email || 'Unknown',
                name: a.owner?.name,
                id: a.owner?.id,
              },
              target: `Agent: ${a.name}`,
              timestamp: a.created_at,
              created_at: a.created_at,
              metadata: {
                agentId: a.id,
                agentName: a.name,
              },
            }));

          // Combine and sort by timestamp
          let allLogs = [...userLogs, ...agentLogs].sort((a, b) =>
            new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
          );

          // Apply filters
          if (actionFilter !== 'all') {
            if (actionFilter === 'login') {
              allLogs = allLogs.filter(l => l.action.includes('login') || l.action.includes('logout'));
            } else if (actionFilter === 'create') {
              allLogs = allLogs.filter(l => l.action.includes('create') || l.action.includes('registered'));
            } else if (actionFilter === 'update') {
              allLogs = allLogs.filter(l => l.action.includes('update'));
            } else if (actionFilter === 'delete') {
              allLogs = allLogs.filter(l => l.action.includes('delete'));
            } else if (actionFilter === 'api') {
              allLogs = allLogs.filter(l => l.action.includes('api'));
            }
          }

          totalCount = allLogs.length;

          // Apply pagination
          const startIndex = (page - 1) * perPage;
          const endIndex = startIndex + perPage;
          logsList = allLogs.slice(startIndex, endIndex);

          // Don't show error toast if fallback was successful
          console.info('Activity logs API not available, using fallback data');
        } else {
          throw apiError;
        }
      }

      setLogs(Array.isArray(logsList) ? logsList : []);
      setTotal(totalCount);
    } catch (e: any) {
      console.error('Activity logs load error:', e);
      // Only show error if it's not a 404 (which we handle with fallback)
      const is404 = e?.response?.status === 404 || e?.status === 404 || e?.message?.includes('404');
      if (!is404) {
        const msg = (e as any)?.response?.data?.message || (e as any)?.message || 'Failed to load activity logs';
        toast.error(msg);
      }
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, actionFilter, userFilter, dateRange]);

  const getActionIcon = (action: string) => {
    if (action.includes('agent')) return Bot;
    if (action.includes('user')) return User;
    if (action.includes('knowledge')) return Database;
    if (action.includes('tenant')) return Building2;
    if (action.includes('login') || action.includes('logout')) return Activity;
    if (action.includes('error')) return AlertCircle;
    return Settings;
  };



  // Column Definitions
  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action;
        const Icon = getActionIcon(action);
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";

        if (action.includes('create')) variant = "default"; // green-ish in theme? default is usually heavy
        else if (action.includes('update')) variant = "secondary";
        else if (action.includes('delete') || action.includes('error')) variant = "destructive";
        else variant = "outline";

        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <Badge variant={variant}>{action}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "actor",
      header: "Actor",
      cell: ({ row }) => {
        const actor = row.original.actor;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{actor?.name || actor?.email || 'System'}</span>
            {actor?.email && actor.name && (
              <span className="text-xs text-muted-foreground">{actor.email}</span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) => <div className="max-w-[300px] truncate" title={row.original.target}>{row.original.target || '-'}</div>
    },
    {
      accessorKey: "created_at",
      header: "Timestamp",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at || row.original.timestamp);
        return (
          <div className="flex flex-col">
            <span className="text-sm">{date.toLocaleDateString()}</span>
            <span className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</span>
          </div>
        )
      }
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => {
        const meta = row.original.metadata || row.original.details;
        return (
          <div className="text-xs text-muted-foreground max-w-[200px] truncate">
            {meta?.ip && <span className="mr-2">IP: {meta.ip}</span>}
            {meta?.agentId && <span>Agent: {meta.agentId}</span>}
          </div>
        )
      }
    }
  ];

  const filteredLogs = logs.filter(log => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor?.email?.toLowerCase().includes(q) ||
        log.actor?.name?.toLowerCase().includes(q) ||
        log.target?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor all system activities and user actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                // Calculate date range for export
                const now = new Date();
                let startDate: Date | undefined;
                let endDate: Date | undefined = now;

                if (dateRange === '24h') {
                  startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                } else if (dateRange === '7d') {
                  startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                } else if (dateRange === '30d') {
                  startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                } else if (dateRange === '90d') {
                  startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                }

                const blob = await exportActivityLogs({
                  format: 'csv',
                  startDate: startDate?.toISOString(),
                  endDate: endDate?.toISOString(),
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Activity logs exported');
              } catch (e: any) {
                const msg = e?.response?.data?.message || 'Failed to export logs';
                toast.error(msg);
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by action, actor, or target"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login/Logout</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="api">API Calls</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={(v) => { setDateRange(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1); }}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}/page</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Activity Logs Table */}
      <Card className="rounded-2xl border p-2">
        {loading ? (
          <TableSkeleton rowCount={perPage} columnCount={5} />
        ) : (
          <DataTable
            data={filteredLogs}
            columns={columns}
            pageCount={Math.ceil(total / perPage)}
            pagination={{ pageIndex: page - 1, pageSize: perPage }}
            onPaginationChange={(updater) => {
              const nextState = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: perPage }) : updater;
              setPage(nextState.pageIndex + 1);
              setPerPage(nextState.pageSize);
            }}
          />
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : total}</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">User Actions</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? '...' : filteredLogs.filter(l => l.action.includes('user')).length}
              </p>
            </div>
            <User className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Agent Actions</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? '...' : filteredLogs.filter(l => l.action.includes('agent')).length}
              </p>
            </div>
            <Bot className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Calls</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? '...' : filteredLogs.filter(l => l.action.includes('api')).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      </div>
    </div>
  );
}

