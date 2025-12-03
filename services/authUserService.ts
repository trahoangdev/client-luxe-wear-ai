import api, { API_BASE_URL, API_PREFIX } from "./http";

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    requiresEmailConfirmation?: boolean;
  };
  errors?: Array<{ msg: string; param?: string }>;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post(`/auth/login`, {
    email,
    password,
  });

  // Normalize server payload { token, refreshToken } -> { accessToken, refreshToken }
  const payload = res.data as {
    success: boolean;
    message: string;
    data?: any;
  };

  if (payload?.data) {
    const { token, refreshToken, user, ...rest } = payload.data;
    return {
      ...payload,
      data: {
        ...rest,
        user,
        accessToken: token,
        refreshToken,
      },
    } as AuthResponse;
  }

  return payload as AuthResponse;
}

export async function register(email: string, password: string, name?: string): Promise<AuthResponse> {
  const res = await api.post(`/auth/register`, {
    email,
    password,
    name,
  });

  const payload = res.data as { success: boolean; message: string; data?: any };
  if (payload?.data) {
    const { token, refreshToken, user, ...rest } = payload.data;
    return {
      ...payload,
      data: {
        ...rest,
        user,
        accessToken: token,
        refreshToken,
      },
    } as AuthResponse;
  }
  return payload as AuthResponse;
}

export function getOAuthUrl(provider: "google" | "github"): string {
  return `${API_BASE_URL}${API_PREFIX}/auth/${provider}`;
}

export async function getMe(): Promise<{ success: boolean; message: string; data?: { user?: any; memberships?: any[] } }> {
  const res = await api.get(`/auth/me`);
  return res.data;
}

export async function refreshToken(refreshToken: string): Promise<{ success: boolean; message: string; data?: { accessToken?: string } }> {
  const res = await api.post(`/auth/refresh`, {
    refreshToken,
  });
  // server returns { token } -> normalize to accessToken
  const payload = res.data as { success: boolean; message: string; data?: any };
  if (payload?.data && "token" in payload.data) {
    return {
      ...payload,
      data: { accessToken: payload.data.token },
    };
  }
  return payload as any;
}

export async function forgotPassword(email: string) {
  const res = await api.post(`/auth/forgot-password`, { email });
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await api.post(`/auth/change-password`, { currentPassword, newPassword });
  return res.data;
}

export async function verifyTokenApi(token: string) {
  const res = await api.post(`/auth/verify-token`, { token });
  return res.data;
}

export function saveTokens(accessToken?: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem("access_token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
  // lightweight auth flag for middleware-based routing
  if (accessToken) {
    document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // clear auth flag cookie
  document.cookie = "auth=; path=/; max-age=0";
}

export async function logout(): Promise<void> {
  try {
    if (getAccessToken()) {
      await api.post(`/auth/logout`, {});
    }
  } catch {
    // ignore API errors on client logout
  } finally {
    clearTokens();
  }
}


