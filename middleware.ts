import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const isAuthenticated = Boolean(cookies.get("auth")?.value);
  const pathname = nextUrl.pathname;

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtected = isDashboard || isAdmin;

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname.startsWith("/auth/");

  // 1. Redirect unauthenticated users trying to access protected routes to login
  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL("/auth/login", request.url);
    // Optional: Add ?from=... to redirect back after login
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Redirect authenticated users trying to access auth pages to dashboard
  if (isAuthPage && isAuthenticated) {
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"]
};
