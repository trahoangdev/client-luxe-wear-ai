import http from './http';

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface UserTenantMembership {
  userId: string;
  tenantId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export const createTenant = async (data: {
  name: string;
  plan?: 'free' | 'pro' | 'enterprise';
  status?: 'active' | 'inactive' | 'suspended';
}): Promise<{ data: Tenant }> => {
  return http.post('/tenants', data);
};

export const listUserTenants = async (): Promise<{ data: { tenants: Tenant[]; count: number } }> => {
  return http.get('/tenants');
};

export const getTenantById = async (tenantId: string): Promise<{ data: Tenant }> => {
  return http.get(`/tenants/${tenantId}`);
};

export const updateTenant = async (
  tenantId: string,
  data: { name?: string; plan?: 'free' | 'pro' | 'enterprise'; status?: 'active' | 'inactive' | 'suspended' }
): Promise<{ data: Tenant }> => {
  return http.put(`/tenants/${tenantId}`, data);
};

export const deleteTenant = async (tenantId: string): Promise<void> => {
  return http.delete(`/tenants/${tenantId}`);
};

export const getTenantStats = async (tenantId: string): Promise<{ data: any }> => {
  return http.get(`/tenants/${tenantId}/stats`);
};

export const listTenantMembers = async (tenantId: string): Promise<{ data: UserTenantMembership[] }> => {
  return http.get(`/tenants/${tenantId}/members`);
};

export const addTenantMember = async (
  tenantId: string,
  data: { userId: string; role: 'owner' | 'admin' | 'member' }
): Promise<{ data: UserTenantMembership }> => {
  return http.post(`/tenants/${tenantId}/members`, data);
};

export const updateMemberRole = async (
  tenantId: string,
  userId: string,
  data: { role: 'owner' | 'admin' | 'member' }
): Promise<{ data: UserTenantMembership }> => {
  return http.put(`/tenants/${tenantId}/members/${userId}`, data);
};

export const removeTenantMember = async (tenantId: string, userId: string): Promise<void> => {
  return http.delete(`/tenants/${tenantId}/members/${userId}`);
};

// Admin APIs
export interface AdminTenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
}

export interface AdminTenantListResponse {
  data: {
    tenants: AdminTenant[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
}

export const adminListAllTenants = async (params?: { page?: number; perPage?: number; plan?: string; status?: string; q?: string }): Promise<AdminTenantListResponse> => {
  const res = await http.get('/tenants/admin/all', { params });
  return res.data;
};

export const adminGetTenantStats = async (): Promise<any> => {
  return http.get('/tenants/admin/stats');
};

export const adminSuspendTenant = async (tenantId: string): Promise<any> => {
  return http.put(`/tenants/admin/${tenantId}/suspend`);
};

export const adminActivateTenant = async (tenantId: string): Promise<any> => {
  return http.put(`/tenants/admin/${tenantId}/activate`);
};

export const adminDeleteTenant = async (tenantId: string): Promise<void> => {
  return http.delete(`/tenants/admin/${tenantId}`);
};