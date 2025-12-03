import { useAppSelector } from "@/store";

export function useAuth() {
  const auth = useAppSelector((s) => s.auth);
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  };
}


