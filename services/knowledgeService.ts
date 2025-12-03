import api from "./http";

export interface KnowledgePayload {
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
  agentId?: string | null;
}

export async function listKnowledge(params: { page?: number; pageSize?: number; agentId?: string }) {
  const mapped: Record<string, any> = {};
  if (typeof params.page === "number") mapped.page = params.page;
  if (typeof params.pageSize === "number") mapped.perPage = params.pageSize; // server expects perPage
  if (params.agentId) mapped.agentId = params.agentId;
  const res = await api.get(`/knowledge`, { params: mapped });
  return res.data;
}

export async function searchKnowledge(params: { query: string; limit?: number; agentId?: string }) {
  const res = await api.get(`/knowledge/search`, { params });
  return res.data;
}

export async function getKnowledge(id: string) {
  const res = await api.get(`/knowledge/${id}`);
  return res.data;
}

export async function createKnowledge(payload: KnowledgePayload) {
  const res = await api.post(`/knowledge`, payload);
  return res.data;
}

export async function updateKnowledge(id: string, payload: Partial<KnowledgePayload>) {
  const res = await api.put(`/knowledge/${id}`, payload);
  return res.data;
}

export async function deleteKnowledge(id: string) {
  const res = await api.delete(`/knowledge/${id}`);
  return res.data;
}

export async function uploadFiles(formData: FormData) {
  const res = await api.post(`/knowledge/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getUploadProgress(sessionId: string) {
  const res = await api.get(`/knowledge/upload/progress/${sessionId}`);
  return res.data;
}

// Admin APIs
export async function adminListAllKnowledge(params: { page?: number; perPage?: number; agentId?: string; userId?: string; tenantId?: string }) {
  const res = await api.get(`/knowledge/admin/all`, { params });
  return res.data;
}

export async function adminGetKnowledgeStats() {
  const res = await api.get(`/knowledge/admin/stats`);
  return res.data;
}

export async function adminGetKnowledge(id: string) {
  const res = await api.get(`/knowledge/admin/${id}`);
  return res.data;
}

export async function adminForceDeleteKnowledge(id: string) {
  const res = await api.delete(`/knowledge/admin/${id}`);
  return res.data;
}

