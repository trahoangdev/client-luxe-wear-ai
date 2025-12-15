'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActivityLogs, type ActivityLogListResponse } from '@/services/adminService';
import { adminListUsers, type AdminUserListResponse } from '@/services/userService';
import { adminListAllAgents, type AdminAgentListResponse } from '@/services/agentService';
import {
    Users,
    Bot,
    Database,
    Activity
} from 'lucide-react';
import Link from 'next/link';

export function RecentActivity() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Get recent activity from API
                const activityRes = await getActivityLogs({
                    page: 1,
                    perPage: 5,
                    dateRange: '7d'
                }).catch((err) => {
                    return null;
                });

                if (activityRes?.data?.logs) {
                    const activityLogs = activityRes.data.logs;

                    const formatted = activityLogs.slice(0, 5).map((log) => ({
                        type: log.action?.includes('agent') ? 'agent' :
                            log.action?.includes('user') ? 'user' :
                                log.action?.includes('knowledge') ? 'knowledge' : 'system',
                        action: log.action || 'Activity',
                        name: log.actor?.name || log.actor?.email || 'System',
                        time: log.created_at || log.timestamp,
                    }));
                    setActivities(formatted);
                } else {
                    // Fallback: mock from users/agents creation if API endpoint is missing (common in dev)
                    const [usersRes, agentsRes] = await Promise.all([
                        adminListUsers({ page: 1, perPage: 5, sortField: 'created_at', sortOrder: 'desc' }).catch(() => ({ users: [] } as unknown as AdminUserListResponse)),
                        adminListAllAgents({ page: 1, perPage: 5 }).catch(() => ({ data: { agents: [] } } as unknown as AdminAgentListResponse)),
                    ]);

                    const users = 'users' in usersRes ? usersRes.users : [];
                    const agents = agentsRes && 'data' in agentsRes ? agentsRes.data?.agents || [] : [];

                    const activity = [
                        ...users.map((u) => ({
                            type: 'user',
                            action: 'User registered',
                            name: u.name || u.email,
                            time: u.created_at,
                        })),
                        ...agents.map((a) => ({
                            type: 'agent',
                            action: 'Agent created',
                            name: a.name,
                            time: a.created_at,
                        })),
                    ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()).slice(0, 5);

                    setActivities(activity);
                }

            } catch (error) {
                console.error("Failed to load activity", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [])

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Link href="/admin/dashboard/activity">
                    <Button variant="ghost" size="sm">View All</Button>
                </Link>
            </div>
            <div className="space-y-3">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-8 w-8 rounded-full bg-muted"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 w-1/3 bg-muted rounded"></div>
                                    <div className="h-2 w-1/4 bg-muted rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No recent activity</div>
                ) : (
                    activities.map((item, idx) => {
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
    )

}
