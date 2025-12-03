import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TenantItem {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
}

interface TenantState {
  tenants: TenantItem[];
  currentTenant: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<TenantItem[]>) => {
      state.tenants = action.payload;
    },
    setCurrentTenant: (state, action: PayloadAction<string | null>) => {
      state.currentTenant = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) localStorage.setItem('currentTenant', action.payload);
        else localStorage.removeItem('currentTenant');
      }
    },
    addTenant: (state, action: PayloadAction<TenantItem>) => {
      state.tenants.push(action.payload);
    },
    updateTenant: (state, action: PayloadAction<{ id: string; tenant: Partial<TenantItem> }>) => {
      const index = state.tenants.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = { ...state.tenants[index], ...action.payload.tenant } as TenantItem;
      }
    },
    removeTenant: (state, action: PayloadAction<string>) => {
      state.tenants = state.tenants.filter((t) => t.id !== action.payload);
      if (state.currentTenant === action.payload) state.currentTenant = null;
    },
    resetTenantState: (state) => {
      state.tenants = [];
      state.currentTenant = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentTenant');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTenants,
  setCurrentTenant,
  addTenant,
  updateTenant,
  removeTenant,
  resetTenantState,
  setLoading,
  setError,
} = tenantSlice.actions;

export default tenantSlice.reducer;
