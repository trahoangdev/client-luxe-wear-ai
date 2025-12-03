import api from "./http";

export interface PaginationQuery {
  page?: number;
  pageSize?: number; // client-side naming; will be mapped to perPage/limit for server
}

export interface AgentPayload {
  name: string;
  description?: string;
  config?: Record<string, any>;
  systemPrompt?: string;
  instructions?: string;
  tools?: string[];
  allowed_origins?: string[];
  is_public?: boolean;
}

export async function listAgents(query: PaginationQuery = {}) {
  const params: Record<string, any> = {};
  if (typeof query.page === "number") params.page = query.page;
  if (typeof query.pageSize === "number") params.perPage = query.pageSize; // server expects perPage
  const res = await api.get(`/agents`, { params });
  return res.data;
}

export async function searchAgents(params: { q: string } & PaginationQuery) {
  const mapped: Record<string, any> = { q: params.q };
  if (typeof params.page === "number") mapped.page = params.page;
  if (typeof params.pageSize === "number") mapped.limit = params.pageSize; // server expects limit
  const res = await api.get(`/agents/search`, { params: mapped });
  return res.data;
}

export async function getAgent(agentId: string) {
  const res = await api.get(`/agents/${agentId}`);
  return res.data;
}

export async function createAgent(payload: AgentPayload) {
  // map snake_case fields to server expected camelCase
  const body: any = {
    name: payload.name,
    description: payload.description,
    systemPrompt: (payload as any).systemPrompt,
    config: payload.config,
    isPublic: (payload as any).is_public ?? (payload as any).isPublic,
    allowedOrigins: payload.allowed_origins ?? (payload as any).allowedOrigins,
  };
  const res = await api.post(`/agents`, body);
  return res.data;
}

export async function updateAgent(agentId: string, payload: Partial<AgentPayload>) {
  const body: any = {
    name: payload.name,
    description: payload.description,
    systemPrompt: (payload as any).systemPrompt,
    config: payload.config,
    isPublic: (payload as any).is_public ?? (payload as any).isPublic,
    allowedOrigins: payload.allowed_origins ?? (payload as any).allowedOrigins,
  };
  const res = await api.put(`/agents/${agentId}`, body);
  return res.data;
}

export async function deleteAgent(agentId: string) {
  const res = await api.delete(`/agents/${agentId}`);
  return res.data;
}

export async function getAgentStats(agentId: string) {
  const res = await api.get(`/agents/${agentId}/stats`);
  return res.data;
}

export async function regenerateApiKey(agentId: string) {
  const res = await api.post(`/agents/${agentId}/regenerate-key`, {});
  return res.data;
}

export async function togglePublic(agentId: string, is_public: boolean, allowed_origins?: string[]) {
  const res = await api.patch(`/agents/${agentId}/public`, {
    isPublic: is_public,
    allowedOrigins: allowed_origins,
  });
  return res.data;
}

export async function chatWithAgent(agentId: string, payload: { message: string; context?: any }) {
  const res = await api.post(`/agents/${agentId}/chat`, payload);
  return res.data;
}

// Admin APIs
export async function adminListAllAgents(query: { page?: number; perPage?: number; isPublic?: 'all' | 'public' | 'private'; sort?: 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc' } = {}) {
  const params: any = {};
  if (query.page) params.page = query.page;
  if (query.perPage) params.perPage = query.perPage;
  // server currently supports pagination only; we'll filter/sort client-side for now
  const res = await api.get(`/agents/admin/all`, { params });
  return res.data;
}

export async function adminForceDeleteAgent(agentId: string) {
  const res = await api.delete(`/agents/admin/${agentId}`);
  return res.data;
}


