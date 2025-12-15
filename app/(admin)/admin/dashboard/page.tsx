'use client';

import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { StatsCards } from '@/components/admin/dashboard/stats-cards';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh is now implicit per widget, but global reload can be kept for force sync */}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-4 grid-cols-1"> {/* Expanded to full width, or split if charts added */}
        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
