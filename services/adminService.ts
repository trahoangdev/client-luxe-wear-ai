import api from "./http";

// Activity Logs
export async function getActivityLogs(params?: {
  page?: number;
  perPage?: number;
  action?: string;
  userId?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}) {
  const res = await api.get(`/admin/activity-logs`, { params });
  return res.data;
}

export async function exportActivityLogs(params?: {
  format?: 'json' | 'csv';
  startDate?: string;
  endDate?: string;
  action?: string;
}) {
  const res = await api.get(`/admin/activity-logs/export`, {
    params,
    responseType: params?.format === 'csv' ? 'blob' : 'json'
  });
  return res.data;
}

// Error Monitoring
export async function getErrorLogs(params?: {
  page?: number;
  perPage?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const res = await api.get(`/admin/errors`, { params });
  return res.data;
}

export async function getErrorById(errorId: string) {
  const res = await api.get(`/admin/errors/${errorId}`);
  return res.data;
}

export async function markErrorAsResolved(errorId: string) {
  const res = await api.put(`/admin/errors/${errorId}/resolve`);
  return res.data;
}

export async function getErrorStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const res = await api.get(`/admin/errors/stats`, { params });
  return res.data;
}

// Content Moderation
export async function getModerationQueue(params?: {
  page?: number;
  perPage?: number;
  type?: string;
  status?: string;
}) {
  const res = await api.get(`/admin/moderation/queue`, { params });
  return res.data;
}

export async function getModerationItem(itemId: string) {
  const res = await api.get(`/admin/moderation/queue/${itemId}`);
  return res.data;
}

export async function approveModerationItem(itemId: string) {
  const res = await api.put(`/admin/moderation/queue/${itemId}/approve`);
  return res.data;
}

export async function rejectModerationItem(itemId: string) {
  const res = await api.put(`/admin/moderation/queue/${itemId}/reject`);
  return res.data;
}

export async function getModerationStats() {
  const res = await api.get(`/admin/moderation/stats`);
  return res.data;
}

