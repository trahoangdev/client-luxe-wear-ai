'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Server,
  ShieldAlert,
  Flag,
  FileText
} from "lucide-react";
import { getSystemAnalytics, getApiHealth } from '@/services/analyticsService';
import { adminListAllAgents } from '@/services/agentService';
import { adminListUsers } from '@/services/userService';
import { adminListAllTenants } from '@/services/tenantService';
import { toast } from 'sonner';

export default function AdminSystemSettingsPage() {
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const [sys, hlth, usersRes, agentsRes, tenantsRes] = await Promise.all([
        getSystemAnalytics().catch(() => null),
        getApiHealth().catch(() => null),
        adminListUsers({ page: 1, perPage: 100 }).catch(() => ({ data: { users: [], pagination: { totalCount: 0 } } })),
        adminListAllAgents({ page: 1, perPage: 100 }).catch(() => ({ data: { agents: [], pagination: { total: 0 } } })),
        adminListAllTenants({ page: 1, perPage: 100 }).catch(() => ({ data: { tenants: [], pagination: { total: 0 } } })),
      ]);

      const sysData = (sys as any)?.data || sys;
      const hlthData = (hlth as any)?.data || hlth;

      // Extract data from responses
      const users = (usersRes as any)?.data?.users || (usersRes as any)?.users || [];
      const usersPagination = (usersRes as any)?.data?.pagination || (usersRes as any)?.pagination || {};
      const totalUsers = usersPagination.totalCount || users.length;

      const agents = (agentsRes as any)?.data?.agents || (agentsRes as any)?.agents || [];
      const agentsPagination = (agentsRes as any)?.data?.pagination || (agentsRes as any)?.pagination || {};
      const totalAgents = agentsPagination.total || agents.length;
      const publicAgents = agents.filter((a: any) => a.isPublic === true || a.is_public === true).length;

      const tenants = (tenantsRes as any)?.data?.tenants || (tenantsRes as any)?.tenants || [];
      const tenantsPagination = (tenantsRes as any)?.data?.pagination || (tenantsRes as any)?.pagination || {};
      const totalTenants = tenantsPagination.total || tenantsPagination.totalCount || tenants.length;

      // Calculate active users in last 24h
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const activeUsers = users.filter((u: any) => {
        const lastLogin = u.last_login ? new Date(u.last_login) : null;
        return lastLogin && lastLogin > yesterday;
      }).length;

      // Combine stats from API and calculated values
      const combinedStats = {
        totalAgents: totalAgents,
        publicAgents: publicAgents,
        totalTenants: totalTenants,
        activeUsers: activeUsers,
        ...sysData, // Include any other fields from analytics API
      };

      setStats(combinedStats);
      setHealth(hlthData);

      // Placeholder audit logs (backend endpoint not provided). Show last 10 agents as sample log entries
      try {
        const all = await adminListAllAgents({ page: 1, perPage: 10 });
        const payload = (all as any)?.data?.agents || (all as any)?.agents || [];
        setLogs(payload.map((a: any) => ({
          key: a.id,
          action: a.isPublic ? 'Agent made public' : 'Agent created',
          actor: a.owner?.email || 'system',
          target: a.name,
          timestamp: a.createdAt || a.created_at,
        })));
      } catch { }
    } catch (e: any) {
      console.error('Failed to load system data:', e);
      toast.error(e?.response?.data?.message || 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <Card className="rounded-2xl border p-6">
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stats" className="flex items-center gap-2"><Activity className="h-4 w-4" /> System Stats</TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2"><Server className="h-4 w-4" /> Health</TabsTrigger>
            <TabsTrigger value="rate" className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Rate Limits</TabsTrigger>
            <TabsTrigger value="flags" className="flex items-center gap-2"><Flag className="h-4 w-4" /> Feature Flags</TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              )) : (
                <>
                  <div className="flex flex-col gap-1 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Total Agents</span>
                    <span className="text-2xl font-bold">{stats?.totalAgents ?? '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Public Agents</span>
                    <span className="text-2xl font-bold">{stats?.publicAgents ?? '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Total Tenants</span>
                    <span className="text-2xl font-bold">{stats?.totalTenants ?? '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                    <span className="text-2xl font-bold">{stats?.activeUsers ?? '-'}</span>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Status</span>
                {health?.success ? <Badge className="bg-emerald-600">Healthy</Badge> : <Badge variant="destructive">Down</Badge>}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Message</span>
                <span>{health?.message || '-'}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Timestamp</span>
                <span className="font-mono text-sm">{health?.timestamp || new Date().toISOString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Uptime</span>
                <span className="font-mono text-sm">{health?.uptime ? `${Math.floor(health.uptime)}s` : '-'}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rate" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Public Chat Limiter</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Auth Routes Limiter</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Strict AI Chat Limiter</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">Enabled</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Displaying demo configuration based on current middleware.</p>
            </div>
          </TabsContent>

          <TabsContent value="flags" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">RAG Indexing v2</span>
                <Badge>On</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Experimental SSE</span>
                <Badge variant="secondary">Off</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Multi-tenant Beta</span>
                <Badge>On</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Placeholder for feature flags - requires backend implementation to toggle.</p>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((item) => (
                    <div key={item.key} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.action} — {item.target}</span>
                        <span className="text-xs text-muted-foreground">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Actor: {item.actor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent logs found.</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
