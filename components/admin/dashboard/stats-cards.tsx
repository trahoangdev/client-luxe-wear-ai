'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { adminListUsers } from '@/services/userService';
import { adminListAllAgents } from '@/services/agentService';
import { adminListAllKnowledge } from '@/services/knowledgeService';
import { adminListAllTenants } from '@/services/tenantService';
import {
    Users,
    Bot,
    Database,
    Building2
} from 'lucide-react';
import Link from 'next/link';

export function StatsCards() {
    const [stats, setStats] = useState({
        users: 0,
        agents: 0,
        knowledge: 0,
        tenants: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch concurrently but handle errors individually
                const [usersRes, agentsRes, knowledgeRes, tenantsRes] = await Promise.all([
                    adminListUsers({ page: 1, perPage: 1 }).catch(() => ({ total: 0 } as unknown as any)),
                    adminListAllAgents({ page: 1, perPage: 1 }).catch(() => ({ data: { pagination: { total: 0 } } } as unknown as any)),
                    adminListAllKnowledge({ page: 1, perPage: 1 }).catch(() => ({ data: { pagination: { total: 0 } } } as unknown as any)),
                    adminListAllTenants({ page: 1, perPage: 1 }).catch(() => ({ data: { pagination: { total: 0 } } } as unknown as any)),
                ]);

                // Access properties safely knowing the structure matches services
                const totalUsers = 'total' in usersRes ? usersRes.total : 0;
                const totalAgents = agentsRes.data?.pagination?.total || 0;
                const totalKnowledge = knowledgeRes.data?.pagination?.total || 0;
                const totalTenants = tenantsRes.data?.pagination?.total || 0;

                setStats({
                    users: totalUsers,
                    agents: totalAgents,
                    knowledge: totalKnowledge,
                    tenants: totalTenants
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-500/10',
            link: '/admin/dashboard/user',
        },
        {
            title: 'Total Agents',
            value: stats.agents,
            icon: Bot,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-500/10',
            link: '/admin/dashboard/agent',
        },
        {
            title: 'Knowledge Entries',
            value: stats.knowledge,
            icon: Database,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-500/10',
            link: '/admin/dashboard/knowledge',
        },
        {
            title: 'Total Tenants',
            value: stats.tenants,
            icon: Building2,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-500/10',
            link: '/admin/dashboard/tenant',
        },
    ];

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6 h-[100px] animate-pulse bg-muted/50" />
                ))}
            </div>
        )
    }

    return (
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
                                        {card.value.toLocaleString()}
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
    );
}
