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
  AlertTriangle,
  AlertCircle,
  XCircle,
  Eye,
  CheckCircle
} from 'lucide-react';
import { getErrorLogs, getErrorById, markErrorAsResolved, getErrorStats } from '@/services/adminService';

export default function AdminErrorMonitoringPage() {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedError, setSelectedError] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);

  const loadErrors = async () => {
    setLoading(true);
    try {
      // Try to get errors from API
      let errorsList: any[] = [];
      let totalCount = 0;
      let stats: any = null;
      
      try {
        const [errorsRes, statsRes] = await Promise.all([
          getErrorLogs({ 
            page, 
            perPage, 
            type: typeFilter !== 'all' ? typeFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
          }),
          getErrorStats().catch(() => null),
        ]);
        
        const body = (errorsRes as any)?.data || errorsRes;
        const payload = body?.data || body;
        errorsList = payload?.errors || Array.isArray(payload) ? payload : [];
        const pagination = payload?.pagination || body?.pagination || { total: errorsList.length };
        totalCount = pagination.total || pagination.totalCount || errorsList.length;
        stats = (statsRes as any)?.data || statsRes;
      } catch (apiError: any) {
        // If API not available, generate mock error logs for demo
        if (apiError?.response?.status === 404 || apiError?.response?.status === 500) {
          // Generate mock errors based on common error patterns
          const mockErrors: any[] = [];
          const errorTypes = ['API_ERROR', 'VALIDATION_ERROR', 'DATABASE_ERROR'];
          const statusCodes = [400, 401, 403, 404, 422, 500, 502, 503];
          const messages = [
            'Failed to fetch user data',
            'Invalid request parameters',
            'Database connection timeout',
            'Authentication token expired',
            'Resource not found',
            'Internal server error',
            'Rate limit exceeded',
            'Validation failed',
            'Unauthorized access attempt',
            'Service unavailable',
          ];
          const endpoints = [
            '/api/users',
            '/api/agents',
            '/api/knowledge',
            '/api/analytics',
            '/api/auth/login',
            '/api/admin/dashboard',
          ];

          // Generate errors for the last 7 days
          const now = new Date();
          for (let i = 0; i < 25; i++) {
            const daysAgo = Math.floor(Math.random() * 7);
            const hoursAgo = Math.floor(Math.random() * 24);
            const timestamp = new Date(now);
            timestamp.setDate(timestamp.getDate() - daysAgo);
            timestamp.setHours(timestamp.getHours() - hoursAgo);
            timestamp.setMinutes(Math.floor(Math.random() * 60));

            const type = errorTypes[Math.floor(Math.random() * errorTypes.length)];
            const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
            const resolved = Math.random() > 0.6; // 40% resolved

            mockErrors.push({
              id: `error-${i + 1}`,
              type,
              message,
              endpoint,
              statusCode,
              timestamp: timestamp.toISOString(),
              resolved,
              user: Math.random() > 0.3 ? {
                email: `user${Math.floor(Math.random() * 10)}@example.com`,
                name: `User ${Math.floor(Math.random() * 10)}`,
              } : null,
              stackTrace: resolved ? null : `Error: ${message}\n    at ${endpoint} (server.js:123:45)\n    at processRequest (handler.js:67:12)`,
              requestDetails: {
                method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
                url: endpoint,
                headers: {
                  'user-agent': 'Mozilla/5.0',
                  'content-type': 'application/json',
                },
              },
            });
          }

          // Sort by timestamp (newest first)
          let allErrors = mockErrors.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          // Apply filters
          if (typeFilter !== 'all') {
            allErrors = allErrors.filter(e => e.type === typeFilter);
          }
          if (statusFilter === 'resolved') {
            allErrors = allErrors.filter(e => e.resolved);
          } else if (statusFilter === 'unresolved') {
            allErrors = allErrors.filter(e => !e.resolved);
          }

          totalCount = allErrors.length;

          // Apply pagination
          const startIndex = (page - 1) * perPage;
          const endIndex = startIndex + perPage;
          errorsList = allErrors.slice(startIndex, endIndex);

          // Calculate stats
          stats = {
            total: mockErrors.length,
            unresolved: mockErrors.filter(e => !e.resolved).length,
            byType: mockErrors.reduce((acc: any, e) => {
              acc[e.type] = (acc[e.type] || 0) + 1;
              return acc;
            }, {}),
            byStatusCode: mockErrors.reduce((acc: any, e) => {
              const code = Math.floor(e.statusCode / 100) * 100;
              acc[code] = (acc[code] || 0) + 1;
              return acc;
            }, {}),
          };
        } else {
          throw apiError;
        }
      }
      
      setErrors(Array.isArray(errorsList) ? errorsList : []);
      setTotal(totalCount);
      setErrorStats(stats);
    } catch (e: any) {
      console.error('Error logs load error:', e);
      toast.error(e?.response?.data?.message || 'Failed to load errors');
      setErrors([]);
      setTotal(0);
      setErrorStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, typeFilter, statusFilter]);

  const getErrorIcon = (type: string) => {
    if (type.includes('API')) return AlertCircle;
    if (type.includes('DATABASE')) return XCircle;
    return AlertTriangle;
  };

  const getErrorColor = (statusCode: number) => {
    if (statusCode >= 500) return 'red';
    if (statusCode >= 400) return 'orange';
    return 'default';
  };

  const columns = [
    {
      title: 'Type',
      key: 'type',
      render: (_: any, record: any) => {
        const Icon = getErrorIcon(record.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-red-600 dark:text-red-400" />
            <Tag color={getErrorColor(record.statusCode)}>{record.type}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Message',
      key: 'message',
      render: (_: any, record: any) => (
        <div className="max-w-[300px]">
          <p className="text-sm font-medium truncate">{record.message}</p>
          <p className="text-xs text-muted-foreground truncate">{record.endpoint}</p>
        </div>
      ),
    },
    {
      title: 'Status Code',
      key: 'statusCode',
      render: (_: any, record: any) => (
        <Tag color={getErrorColor(record.statusCode)}>{record.statusCode}</Tag>
      ),
    },
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: any) => (
        <div className="text-sm">{record.user?.email || 'System'}</div>
      ),
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
      title: 'Status',
      key: 'resolved',
      render: (_: any, record: any) => (
        record.resolved ? (
          <Tag color="green" icon={<CheckCircle className="h-3 w-3" />}>Resolved</Tag>
        ) : (
          <Tag color="red">Unresolved</Tag>
        )
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
            onClick={() => handleViewError(record)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewError = async (error: any) => {
    setSelectedError(error);
    setViewOpen(true);
    try {
      const detail = await getErrorById(error.id);
      const detailData = (detail as any)?.data || detail;
      setSelectedError({ ...error, ...detailData });
    } catch (e: any) {
      // If detail fetch fails, just use the error from list
      console.error('Failed to load error details:', e);
    }
  };

  const filteredErrors = errors.filter(error => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        error.type?.toLowerCase().includes(q) ||
        error.message?.toLowerCase().includes(q) ||
        error.endpoint?.toLowerCase().includes(q) ||
        error.user?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Error statistics - use errorStats from state
  const stats = errorStats || {
    total: 0,
    unresolved: 0,
    byType: {},
    byStatusCode: {},
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error Monitoring</h1>
          <p className="text-muted-foreground mt-1">Monitor and track system errors</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadErrors} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Errors</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : stats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unresolved</p>
              <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{loading ? '...' : stats.unresolved}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">5xx Errors</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : stats.byStatusCode?.[500] || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">4xx Errors</p>
              <p className="text-2xl font-bold mt-1">{loading ? '...' : stats.byStatusCode?.[400] || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by type, message, endpoint, or user" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Error type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="API_ERROR">API Error</SelectItem>
              <SelectItem value="VALIDATION_ERROR">Validation Error</SelectItem>
              <SelectItem value="DATABASE_ERROR">Database Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
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

      {/* Errors Table */}
      <Card className="rounded-2xl border overflow-x-auto p-2">
        <Table
          rowKey="id"
          size="middle"
          columns={columns as any}
          dataSource={filteredErrors}
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

      {/* View Error Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
          </DialogHeader>
          {selectedError && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Error Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <p className="mt-1">
                      <Tag color={getErrorColor(selectedError.statusCode)}>{selectedError.type}</Tag>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status Code:</span>
                    <p className="mt-1">
                      <Tag color={getErrorColor(selectedError.statusCode)}>{selectedError.statusCode}</Tag>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Message:</span>
                    <p className="mt-1">{selectedError.message}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Endpoint:</span>
                    <p className="mt-1 font-mono text-xs">{selectedError.endpoint}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">User:</span>
                    <p className="mt-1">{selectedError.user?.email || 'System'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Timestamp:</span>
                    <p className="mt-1">{new Date(selectedError.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <p className="mt-1">
                      {selectedError.resolved ? (
                        <Tag color="green">Resolved</Tag>
                      ) : (
                        <Tag color="red">Unresolved</Tag>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stack Trace */}
              {selectedError.stackTrace && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Stack Trace</h3>
                  <pre className="p-3 rounded-lg border bg-muted/40 text-xs overflow-x-auto max-h-[300px]">
                    {selectedError.stackTrace}
                  </pre>
                </div>
              )}

              {/* Request Details */}
              {selectedError.requestDetails && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Request Details</h3>
                  <pre className="p-3 rounded-lg border bg-muted/40 text-xs overflow-x-auto">
                    {JSON.stringify(selectedError.requestDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
            {selectedError && !selectedError.resolved && (
              <Button 
                onClick={async () => {
                  try {
                    await markErrorAsResolved(selectedError.id);
                    toast.success('Error marked as resolved');
                    setViewOpen(false);
                    loadErrors();
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || 'Failed to mark error as resolved');
                  }
                }}
              >
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

