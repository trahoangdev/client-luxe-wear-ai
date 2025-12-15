'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Bot,
    Database,
    Building2
} from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
    return (
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
    )
}
