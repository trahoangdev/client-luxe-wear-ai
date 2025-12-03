import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const isAuthenticated = Boolean(cookies.get("auth")?.value);
  const pathname = nextUrl.pathname;

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname.startsWith("/auth/");

  // Redirect unauthenticated user away from dashboard về trang chủ
  if (isDashboard && !isAuthenticated) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access to auth pages even if cookie exists
  // Let the client-side handle redirect if user is truly authenticated
  // This allows users to login again or switch accounts
  // The login page will handle redirecting authenticated users via useRequireAuth or similar hooks

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"]
};
