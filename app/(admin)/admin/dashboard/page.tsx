'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSystemAnalytics } from '@/services/analyticsService';
import { adminListUsers } from '@/services/userService';
import { adminListAllAgents } from '@/services/agentService';
import { adminListAllKnowledge } from '@/services/knowledgeService';
import { adminListAllTenants, adminGetTenantStats } from '@/services/tenantService';
import { getActivityLogs } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  Users, 
  Bot, 
  Database, 
  Building2, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analytics, usersRes, agentsRes, knowledgeRes, tenantsRes] = await Promise.all([
        getSystemAnalytics().catch(() => null),
        adminListUsers({ page: 1, perPage: 100 }).catch(() => ({ data: { users: [], pagination: { totalCount: 0 } } })),
        adminListAllAgents({ page: 1, perPage: 100 }).catch(() => ({ data: { agents: [], pagination: { total: 0 } } })),
        adminListAllKnowledge({ page: 1, perPage: 100 }).catch(() => ({ data: { knowledge: [], pagination: { total: 0 } } })),
        adminListAllTenants({ page: 1, perPage: 100 }).catch(() => ({ data: { tenants: [], pagination: { total: 0 } } })),
      ]);

      const analyticsData = (analytics as any)?.data || analytics;
      
      // Extract data from responses
      const users = (usersRes as any)?.data?.users || (usersRes as any)?.users || [];
      const usersPagination = (usersRes as any)?.data?.pagination || (usersRes as any)?.pagination || {};
      const totalUsers = usersPagination.totalCount || users.length;

      const agents = (agentsRes as any)?.data?.agents || (agentsRes as any)?.agents || [];
      const agentsPagination = (agentsRes as any)?.data?.pagination || (agentsRes as any)?.pagination || {};
      const totalAgents = agentsPagination.total || agents.length;

      const knowledge = (knowledgeRes as any)?.data?.knowledge || (knowledgeRes as any)?.data?.entries || (knowledgeRes as any)?.knowledge || [];
      const knowledgePagination = (knowledgeRes as any)?.data?.pagination || (knowledgeRes as any)?.pagination || {};
      const totalKnowledge = knowledgePagination.total || knowledgePagination.totalCount || knowledge.length;

      const tenants = (tenantsRes as any)?.data?.tenants || (tenantsRes as any)?.tenants || [];
      const tenantsPagination = (tenantsRes as any)?.data?.pagination || (tenantsRes as any)?.pagination || {};
      const totalTenants = tenantsPagination.total || tenantsPagination.totalCount || tenants.length;

      // Calculate active users in last 24h
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const activeUsers24h = users.filter((u: any) => {
        const lastLogin = u.last_login ? new Date(u.last_login) : null;
        return lastLogin && lastLogin > yesterday;
      }).length;

      // Combine stats
      const combinedStats = {
        totalUsers: totalUsers,
        totalAgents: totalAgents,
        totalKnowledge: totalKnowledge,
        totalTenants: totalTenants,
        activeUsers24h: activeUsers24h,
        activeUsers7d: users.filter((u: any) => {
          const lastLogin = u.last_login ? new Date(u.last_login) : null;
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return lastLogin && lastLogin > weekAgo;
        }).length,
        totalApiCalls: analyticsData?.totalAnalytics || 0,
        errorRate: 0, // TODO: Calculate from error logs
        ...analyticsData, // Include any other fields from analytics API
      };

      setStats(combinedStats);

      // Get recent activity from API
      try {
        const activityRes = await getActivityLogs({ 
          page: 1, 
          perPage: 5,
          dateRange: '7d' // Get last 7 days of activity
        });
        
        const activityData = (activityRes as any)?.data || activityRes;
        const activityLogs = activityData?.logs || activityData?.activities || activityData || [];
        
        // Transform API response to match component format
        const activity = activityLogs.slice(0, 5).map((log: any) => ({
          type: log.action?.includes('agent') ? 'agent' : 
                log.action?.includes('user') ? 'user' : 
                log.action?.includes('knowledge') ? 'knowledge' : 'system',
          action: log.action || 'Activity',
          name: log.actor?.name || log.actor?.email || log.target || 'System',
          time: log.timestamp || log.created_at || log.createdAt,
        }));
        
        setRecentActivity(activity);
      } catch (activityError: any) {
        // Fallback to generating from users/agents if API fails (404, 500, etc.)
        const isApiUnavailable = 
          activityError?.response?.status === 404 || 
          activityError?.response?.status === 500 ||
          activityError?.status === 404 ||
          activityError?.message?.includes('Route not found') ||
          activityError?.message?.includes('404');
        
        if (isApiUnavailable) {
          console.info('Activity logs API not available, using fallback data');
        } else {
          console.warn('Failed to load activity logs:', activityError);
        }
        const activity = [
          ...users.slice(0, 3).map((u: any) => ({
            type: 'user',
            action: 'User registered',
            name: u.name || u.email,
            time: u.created_at || u.createdAt,
          })),
          ...agents.slice(0, 3).map((a: any) => ({
            type: 'agent',
            action: 'Agent created',
            name: a.name,
            time: a.created_at || a.createdAt,
          })),
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
        
        setRecentActivity(activity);
      }
    } catch (e: any) {
      console.error('Dashboard load error:', e);
      toast.error(e?.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      link: '/admin/dashboard/user',
    },
    {
      title: 'Total Agents',
      value: stats?.totalAgents || 0,
      icon: Bot,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
      link: '/admin/dashboard/agent',
    },
    {
      title: 'Knowledge Entries',
      value: stats?.totalKnowledge || 0,
      icon: Database,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
      link: '/admin/dashboard/knowledge',
    },
    {
      title: 'Total Tenants',
      value: stats?.totalTenants || 0,
      icon: Building2,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
      link: '/admin/dashboard/tenant',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.link || '#'}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">
                      {loading ? '...' : card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users (24h)</p>
              <p className="text-2xl font-bold">{loading ? '...' : (stats?.activeUsers24h || 0)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total API Calls</p>
              <p className="text-2xl font-bold">{loading ? '...' : (stats?.totalApiCalls || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold">
                {loading ? '...' : `${((stats?.errorRate || 0) * 100).toFixed(2)}%`}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Link href="/admin/dashboard/activity">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activity</div>
          ) : (
            recentActivity.map((item, idx) => {
              const getIcon = () => {
                if (item.type === 'user') return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
                if (item.type === 'agent') return <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
                if (item.type === 'knowledge') return <Database className="h-4 w-4 text-green-600 dark:text-green-400" />;
                return <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
              };
              
              const getBgColor = () => {
                if (item.type === 'user') return 'bg-blue-100 dark:bg-blue-500/20';
                if (item.type === 'agent') return 'bg-purple-100 dark:bg-purple-500/20';
                if (item.type === 'knowledge') return 'bg-green-100 dark:bg-green-500/20';
                return 'bg-gray-100 dark:bg-gray-500/20';
              };
              
              return (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getBgColor()}`}>
                      {getIcon()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.time ? new Date(item.time).toLocaleString() : '-'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/dashboard/user">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/dashboard/agent">
            <Button variant="outline" className="w-full justify-start">
              <Bot className="h-4 w-4 mr-2" />
              Manage Agents
            </Button>
          </Link>
          <Link href="/admin/dashboard/knowledge">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Manage Knowledge
            </Button>
          </Link>
          <Link href="/admin/dashboard/tenant">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="h-4 w-4 mr-2" />
              Manage Tenants
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
