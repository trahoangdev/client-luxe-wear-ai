import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";
import { getAccessToken } from "@/services/authUserService";

/**
 * Client-side guard to ensure user is authenticated before using protected areas (e.g. dashboard).
 * If không có token và không authenticated, sẽ redirect sang trang login, kèm query redirect.
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Có token trong localStorage thì chờ Bootstrapper xác thực xong
    const hasToken = !!getAccessToken();
    if (isAuthenticated || hasToken) return;

    // Không có token và chưa authenticated -> gửi về trang login
    const searchParams = new URLSearchParams();
    if (pathname && pathname !== "/") {
      searchParams.set("redirect", pathname);
    }
    const loginUrl =
      "/auth/login" + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    router.replace(loginUrl);
  }, [isAuthenticated, router, pathname]);
}


