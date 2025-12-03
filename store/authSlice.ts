import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MembershipSummary {
  id?: string;
  tenant_id?: string;
  role?: string;
  status?: string;
  joined_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  avatar_url?: string | null;
  phone?: string | null;
  website?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
  memberships?: MembershipSummary[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null
};

export interface CredentialsPayload {
  user: AuthUser;
  accessToken?: string | null;
  refreshToken?: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      if (action.payload.accessToken !== undefined) {
        state.accessToken = action.payload.accessToken ?? null;
      }
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken ?? null;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
