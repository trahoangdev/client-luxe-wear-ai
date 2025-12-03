import api from "./http";

export async function getUserAnalytics(params?: { period?: string; agentId?: string }) {
  const res = await api.get(`/analytics/user`, { params });
  return res.data;
}

export async function getTenantAnalytics(params?: { period?: string; startDate?: string; endDate?: string; agentId?: string }) {
  const res = await api.get(`/analytics/tenant`, { params });
  return res.data;
}

export async function getAgentAnalytics(agentId: string) {
  const res = await api.get(`/analytics/agents/${agentId}`);
  return res.data;
}

export async function exportAnalytics(params?: { format?: 'json' | 'csv'; startDate?: string; endDate?: string; agentId?: string }) {
  const res = await api.get(`/analytics/export`, { 
    params,
    responseType: params?.format === 'csv' ? 'blob' : 'json'
  });
  return res.data;
}

// Admin: system analytics
export async function getSystemAnalytics() {
  const res = await api.get(`/analytics/system`);
  return res.data;
}

export async function getApiHealth() {
  const res = await api.get(`/health`);
  return res.data;
}



