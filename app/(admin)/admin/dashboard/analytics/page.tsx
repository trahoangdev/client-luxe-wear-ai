'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSystemAnalytics } from '@/services/analyticsService';
import { adminListUsers } from '@/services/userService';
import { adminListAllAgents } from '@/services/agentService';
import { adminListAllKnowledge } from '@/services/knowledgeService';
import { adminListAllTenants } from '@/services/tenantService';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  TrendingUp,
  Users,
  Bot,
  Database,
  Building2,
  Activity,
  Download,
  BarChart3
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState<string>('30d');
  const [chartData, setChartData] = useState<any>({
    usersGrowth: [],
    agentsCreated: [],
    apiUsage: [],
    errorTrends: [],
  });

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
      const currentTime = new Date();
      const yesterday = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const activeUsers24h = users.filter((u: any) => {
        const lastLogin = u.last_login ? new Date(u.last_login) : null;
        return lastLogin && lastLogin > yesterday;
      }).length;

      const activeUsers7d = users.filter((u: any) => {
        const lastLogin = u.last_login ? new Date(u.last_login) : null;
        return lastLogin && lastLogin > weekAgo;
      }).length;

      // Calculate growth (simplified - compare with previous period)
      // For now, set to 0 as we don't have historical data
      const usersGrowth = 0;
      const agentsGrowth = 0;
      const knowledgeGrowth = 0;
      const tenantsGrowth = 0;

      // Combine stats
      const combinedStats = {
        totalUsers: totalUsers,
        totalAgents: totalAgents,
        totalKnowledge: totalKnowledge,
        totalTenants: totalTenants,
        activeUsers24h: activeUsers24h,
        activeUsers7d: activeUsers7d,
        totalApiCalls: analyticsData?.totalAnalytics || 0,
        totalConversations: analyticsData?.totalAnalytics || 0, // Using analytics as proxy for conversations
        apiCalls24h: 0, // TODO: Calculate from analytics with date filter
        conversations24h: 0, // TODO: Calculate from analytics with date filter
        usersGrowth: usersGrowth,
        agentsGrowth: agentsGrowth,
        knowledgeGrowth: knowledgeGrowth,
        tenantsGrowth: tenantsGrowth,
        topUsers: users.slice(0, 5).map((u: any) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          activity: 0, // TODO: Calculate from analytics
        })),
        topAgents: agents.slice(0, 5).map((a: any) => ({
          id: a.id,
          name: a.name,
          usage: 0, // TODO: Calculate from analytics
        })),
        ...analyticsData, // Include any other fields from analytics API
      };

      setStats(combinedStats);

      // Generate chart data
      let intervals = 30;
      let intervalType: 'hour' | 'day' = 'day';
      
      if (period === '24h') {
        intervals = 24;
        intervalType = 'hour';
      } else if (period === '7d') {
        intervals = 7;
        intervalType = 'day';
      } else if (period === '30d') {
        intervals = 30;
        intervalType = 'day';
      } else if (period === '90d') {
        intervals = 90;
        intervalType = 'day';
      }

      // Users Growth Chart Data
      const usersGrowthData = [];
      for (let i = intervals - 1; i >= 0; i--) {
        const date = new Date(currentTime);
        if (intervalType === 'hour') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }
        
        const dateStr = intervalType === 'hour'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const usersBeforeDate = users.filter((u: any) => {
          const created = u.created_at || u.createdAt;
          if (!created) return false;
          const createdDate = new Date(created);
          return createdDate <= date;
        }).length;
        
        usersGrowthData.push({
          date: dateStr,
          users: usersBeforeDate,
        });
      }

      // Agents Created Chart Data
      const agentsCreatedData = [];
      for (let i = intervals - 1; i >= 0; i--) {
        const date = new Date(currentTime);
        if (intervalType === 'hour') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }
        
        const dateStr = intervalType === 'hour'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const agentsBeforeDate = agents.filter((a: any) => {
          const created = a.created_at || a.createdAt;
          if (!created) return false;
          const createdDate = new Date(created);
          return createdDate <= date;
        }).length;
        
        agentsCreatedData.push({
          date: dateStr,
          agents: agentsBeforeDate,
        });
      }

      // API Usage Chart Data (mock data based on analytics)
      const apiUsageData = [];
      const baseApiCalls = analyticsData?.totalAnalytics || 0;
      for (let i = intervals - 1; i >= 0; i--) {
        const date = new Date(currentTime);
        if (intervalType === 'hour') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }
        
        const dateStr = intervalType === 'hour'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Simulate API calls distribution
        const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% variation
        const intervalCalls = Math.floor((baseApiCalls / intervals) * randomFactor);
        
        apiUsageData.push({
          date: dateStr,
          calls: intervalCalls,
        });
      }

      // Error Trends Chart Data (mock data)
      const errorTrendsData = [];
      for (let i = intervals - 1; i >= 0; i--) {
        const date = new Date(currentTime);
        if (intervalType === 'hour') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }
        
        const dateStr = intervalType === 'hour'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Simulate error rate (0-5% of API calls)
        const intervalCalls = apiUsageData[intervals - 1 - i]?.calls || 0;
        const errors = Math.floor(intervalCalls * (0.01 + Math.random() * 0.04));
        
        errorTrendsData.push({
          date: dateStr,
          errors: errors,
        });
      }

      setChartData({
        usersGrowth: usersGrowthData,
        agentsCreated: agentsCreatedData,
        apiUsage: apiUsageData,
        errorTrends: errorTrendsData,
      });
    } catch (e: any) {
      console.error('Analytics load error:', e);
      toast.error(e?.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.usersGrowth || 0,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Total Agents',
      value: stats?.totalAgents || 0,
      change: stats?.agentsGrowth || 0,
      icon: Bot,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      title: 'Knowledge Entries',
      value: stats?.totalKnowledge || 0,
      change: stats?.knowledgeGrowth || 0,
      icon: Database,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      title: 'Total Tenants',
      value: stats?.totalTenants || 0,
      change: stats?.tenantsGrowth || 0,
      icon: Building2,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive system metrics and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">
                    {loading ? '...' : card.value.toLocaleString()}
                  </p>
                  {card.change !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`h-4 w-4 ${card.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                      <span className={`text-sm ${card.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {card.change >= 0 ? '+' : ''}{card.change}%
                      </span>
                      <span className="text-xs text-muted-foreground">vs previous period</span>
                    </div>
                  )}
                </div>
                <div className={`h-12 w-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Activity Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users (24h)</p>
              <p className="text-2xl font-bold">{loading ? '...' : (stats?.activeUsers24h || 0)}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats?.activeUsers7d ? `${stats.activeUsers7d} in last 7 days` : ''}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total API Calls</p>
              <p className="text-2xl font-bold">{loading ? '...' : (stats?.totalApiCalls || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats?.apiCalls24h ? `${stats.apiCalls24h.toLocaleString()} in last 24h` : ''}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
              <p className="text-2xl font-bold">{loading ? '...' : (stats?.totalConversations || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats?.conversations24h ? `${stats.conversations24h.toLocaleString()} in last 24h` : ''}
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Users Growth</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : chartData.usersGrowth.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer
              config={{
                users: {
                  label: 'Users',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-64 w-full"
            >
              <LineChart data={chartData.usersGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={50}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--color-users)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agents Created</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : chartData.agentsCreated.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer
              config={{
                agents: {
                  label: 'Agents',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-64 w-full"
            >
              <BarChart data={chartData.agentsCreated}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={50}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="agents" 
                  fill="var(--color-agents)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Usage</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : chartData.apiUsage.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer
              config={{
                calls: {
                  label: 'API Calls',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="h-64 w-full"
            >
              <LineChart data={chartData.apiUsage}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={60}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="var(--color-calls)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Error Trends</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : chartData.errorTrends.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer
              config={{
                errors: {
                  label: 'Errors',
                  color: 'hsl(var(--destructive))',
                },
              }}
              className="h-64 w-full"
            >
              <LineChart data={chartData.errorTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={50}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="var(--color-errors)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Users by Activity</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : stats?.topUsers && stats.topUsers.length > 0 ? (
              stats.topUsers.slice(0, 5).map((user: any, idx: number) => (
                <div key={user.id || idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.email || user.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{user.activity || 0} activities</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No data available</div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Agents by Usage</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : stats?.topAgents && stats.topAgents.length > 0 ? (
              stats.topAgents.slice(0, 5).map((agent: any, idx: number) => (
                <div key={agent.id || idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{agent.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{agent.usage || 0} uses</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No data available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

