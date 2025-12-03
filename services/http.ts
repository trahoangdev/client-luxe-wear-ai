import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com";
export const API_PREFIX = "/api";

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isNetworkError: boolean;
}

const api = axios.create({ baseURL: `${API_BASE_URL}${API_PREFIX}` });

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  // Attach tenant header if available
  if (typeof window !== "undefined") {
    const tenantId = localStorage.getItem("currentTenant");
    if (tenantId) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-Tenant-Id"] = tenantId;
    }
  }
  return config;
});

function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const payload =
      typeof data === "object" && data !== null
        ? (data as { message?: string; error?: string })
        : undefined;
    const message =
      (typeof data === "string" && data) ||
      payload?.message ||
      payload?.error ||
      error.message ||
      "Request failed";
    return {
      message,
      status,
      data,
      isNetworkError: !status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, isNetworkError: false };
  }

  return { message: "Unknown error", isNetworkError: false };
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error?.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const doRefresh = async () => {
        const rToken = getRefreshToken();
        if (!rToken) throw error;
        const { data } = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
          refreshToken: rToken,
        });
        const newToken = data?.data?.token || data?.data?.accessToken;
        if (!newToken) throw error;
        setAccessToken(newToken);
        return newToken as string;
      };

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      try {
        isRefreshing = true;
        const token = await doRefresh();
        pendingQueue.forEach((cb) => cb(token));
        pendingQueue = [];
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        clearTokens();
        return Promise.reject(normalizeApiError(e));
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(normalizeApiError(error));
  }
);

export default api;

export { normalizeApiError };


