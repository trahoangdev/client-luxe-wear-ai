import http from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name?: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await http.post("/auth/login", payload);
    if (typeof window !== "undefined" && data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken || "");
    }
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await http.post("/auth/register", payload);
    if (typeof window !== "undefined" && data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken || "");
    }
    return data.data;
  },

  async logout(): Promise<void> {
    try {
      await http.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  },

  async refresh(): Promise<AuthResult> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "";
    const { data } = await http.post("/auth/refresh", { refreshToken });
    if (typeof window !== "undefined" && data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken || "");
    }
    return data.data;
  },
};

export default AuthService;

