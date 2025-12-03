'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, Tag, Space } from 'antd';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  FileText,
  Bot,
  Database,
  AlertTriangle
} from 'lucide-react';
import { 
  getModerationQueue, 
  getModerationItem, 
  approveModerationItem, 
  rejectModerationItem,
  getModerationStats
} from '@/services/adminService';
import { adminUpdateUser } from '@/services/userService';

export default function AdminContentModerationPage() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [moderationStats, setModerationStats] = useState<any>(null);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        getModerationQueue({ 
          page, 
          perPage, 
          type: typeFilter !== 'all' ? typeFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        }).catch(() => ({ data: { queue: [], pagination: { total: 0 } } })),
        getModerationStats().catch(() => null),
      ]);
      
      // Parse queue response
      const body = (queueRes as any)?.data || queueRes;
      let queueList: any[] = [];
      let paginationTotal = 0;

      // Try different response structures
      if (Array.isArray(body)) {
        queueList = body;
        paginationTotal = body.length;
      } else if (body?.data) {
        if (Array.isArray(body.data)) {
          queueList = body.data;
        } else if (body.data?.queue) {
          queueList = Array.isArray(body.data.queue) ? body.data.queue : [];
        }
        paginationTotal = body.pagination?.total || body.pagination?.totalCount || body.data?.pagination?.total || queueList.length;
      } else if (body?.queue) {
        queueList = Array.isArray(body.queue) ? body.queue : [];
        paginationTotal = body.pagination?.total || body.pagination?.totalCount || queueList.length;
      }

      setQueue(queueList);
      setTotal(paginationTotal);
      
      // Parse stats response
      const statsBody = (statsRes as any)?.data || statsRes;
      setModerationStats(statsBody);
    } catch (e: any) {
      console.error('Failed to load moderation queue:', e);
      // If API fails, try to show empty state gracefully
      if (e?.response?.status === 404 || e?.response?.status === 500) {
        setQueue([]);
        setTotal(0);
        // Don't show error toast for 404/500, just show empty state
      } else {
        toast.error(e?.response?.data?.message || 'Failed to load moderation queue');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [page, perPage, typeFilter, statusFilter]);

  const handleViewItem = async (item: any) => {
    setSelectedItem(item);
    setViewOpen(true);
    try {
      const detail = await getModerationItem(item.id);
      const detailData = (detail as any)?.data || detail;
      setSelectedItem({ ...item, ...detailData });
    } catch (e: any) {
      // If detail fetch fails, just use the item from list
      console.error('Failed to load moderation item details:', e);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveModerationItem(id);
      toast.success('Content approved');
      loadQueue();
      if (selectedItem?.id === id) {
        setViewOpen(false);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to approve content');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and remove this content?')) return;
    try {
      await rejectModerationItem(id);
      toast.success('Content rejected and removed');
      loadQueue();
      if (selectedItem?.id === id) {
        setViewOpen(false);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to reject content');
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm('Ban this user?')) return;
    try {
      await adminUpdateUser(userId, { is_active: false });
      toast.success('User banned');
      loadQueue();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to ban user');
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'agent') return Bot;
    if (type === 'knowledge') return Database;
    return FileText;
  };

  const columns = [
    {
      title: 'Type',
      key: 'type',
      render: (_: any, record: any) => {
        const Icon = getTypeIcon(record.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <Tag>{record.type}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Content',
      key: 'content',
      render: (_: any, record: any) => (
        <div className="max-w-[300px]">
          <p className="text-sm font-medium truncate">
            {record.content?.name || record.content?.title || 'Unknown'}
          </p>
          {record.content?.description && (
            <p className="text-xs text-muted-foreground truncate">{record.content.description}</p>
          )}
        </div>
      ),
    },
    {
      title: 'Reason',
      key: 'reason',
      render: (_: any, record: any) => (
        <div className="max-w-[200px] truncate text-sm">{record.reason}</div>
      ),
    },
    {
      title: 'Reported By',
      key: 'reportedBy',
      render: (_: any, record: any) => (
        <div className="text-sm">{record.reportedBy?.email || 'System'}</div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        const colors: Record<string, string> = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red',
        };
        return <Tag color={colors[record.status] || 'default'}>{record.status}</Tag>;
      },
    },
    {
      title: 'Timestamp',
      key: 'timestamp',
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm">{new Date(record.timestamp).toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">{new Date(record.timestamp).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewItem(record)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Review
          </Button>
        </Space>
      ),
    },
  ];

  const filteredQueue = queue.filter(item => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.type.toLowerCase().includes(q) ||
        item.content?.name?.toLowerCase().includes(q) ||
        item.content?.title?.toLowerCase().includes(q) ||
        item.reason?.toLowerCase().includes(q) ||
        item.reportedBy?.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    return true;
  });

  // Use API stats if available, otherwise calculate from queue list
  const stats = moderationStats || {
    pending: queue.filter(i => i.status === 'pending').length,
    approved: queue.filter(i => i.status === 'approved').length,
    rejected: queue.filter(i => i.status === 'rejected').length,
    total: queue.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground mt-1">Review and moderate flagged content</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadQueue} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">{loading ? '...' : stats.pending}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{loading ? '...' : stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{loading ? '...' : stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by content, reason, or reporter" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="agent">Agents</SelectItem>
              <SelectItem value="knowledge">Knowledge</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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

      {/* Moderation Queue Table */}
      <Card className="rounded-2xl border overflow-x-auto p-2">
        <Table
          rowKey="id"
          size="middle"
          columns={columns as any}
          dataSource={filteredQueue}
          loading={loading}
          pagination={{ 
            current: page, 
            pageSize: perPage, 
            total: total, 
            showSizeChanger: false, 
            onChange: (p) => setPage(p) 
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Review Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              {/* Content Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Content Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <p className="mt-1">
                      <Tag>{selectedItem.type}</Tag>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <p className="mt-1">
                      <Tag color={selectedItem.status === 'pending' ? 'orange' : selectedItem.status === 'approved' ? 'green' : 'red'}>
                        {selectedItem.status}
                      </Tag>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Content:</span>
                    <p className="mt-1 font-medium">{selectedItem.content?.name || selectedItem.content?.title}</p>
                    {selectedItem.content?.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{selectedItem.content.description}</p>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Owner:</span>
                    <p className="mt-1">{selectedItem.content?.owner?.email || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Reported By:</span>
                    <p className="mt-1">{selectedItem.reportedBy?.email || 'System'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Reason:</span>
                    <p className="mt-1">{selectedItem.reason}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Timestamp:</span>
                    <p className="mt-1">{new Date(selectedItem.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Full Content */}
              {selectedItem.content?.content && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Full Content</h3>
                  <div className="p-3 rounded-lg border bg-muted/40 text-sm max-h-[300px] overflow-y-auto">
                    {selectedItem.content.content}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
            {selectedItem && selectedItem.status === 'pending' && (
              <>
                {selectedItem.content?.owner?.id && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleBanUser(selectedItem.content.owner.id)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Ban User
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(selectedItem.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleApprove(selectedItem.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

