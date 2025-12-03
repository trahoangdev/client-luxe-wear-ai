"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout as logoutAction } from "@/store/authSlice";
import { logout as apiLogout, clearTokens } from "@/services/authUserService";
import { resetTenantState } from "@/store/tenantSlice";
import UserAvatar from "@/components/user-avatar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { 
  Bot, 
  BarChart2, 
  UserRoundCog, 
  SlidersHorizontal, 
  Shield, 
  MessageSquare, 
  ArrowLeft, 
  LogOut, 
  LayoutDashboard, 
  Home,
  Code2,
  Database,
  Settings,
  TrendingUp,
  FileText,
  Menu,
  X,
  Building2,
} from "lucide-react";
import TenantSwitcher from "@/components/tenant/TenantSwitcher";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { href: string; label: string; icon?: React.ElementType };

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Bảo vệ khu vực dashboard phía client
  useRequireAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const currentTenant = useAppSelector((s) => s.tenant.currentTenant);
  // Check if user is admin - handle different role formats (admin, super_admin, etc.)
  const userRole = user?.role?.toLowerCase()?.trim();
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  // Detect agent context from path or query
  const agentMatch = pathname?.match(/^\/dashboard\/agents\/([^/]+)$/);
  const agentIdFromPath = agentMatch?.[1] || null;
  const agentIdFromQuery = searchParams?.get("agentId") || null;
  const currentAgentId = agentIdFromPath || agentIdFromQuery;
  const currentTab = searchParams?.get("tab") || "config";

  // Main navigation (when not in agent context)
  const mainNav: NavItem[] = [
    { href: "/dashboard", label: "Agents", icon: Bot },
    { href: "/dashboard/knowledge", label: "Knowledge", icon: Database },
    { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/dashboard/usage", label: "Usage", icon: BarChart2 },
    { href: "/dashboard/tenants", label: "Tenants", icon: Building2 },
  ];

  // Settings & Account
  const settingsNav: NavItem[] = [
    { href: "/dashboard/user", label: "Account", icon: UserRoundCog },
    { href: "/dashboard/workspaceSetting/general", label: "Workspace", icon: Settings },
  ];

  // Quick links
  const quickLinks: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
  ];

  // Agent-specific navigation (when in agent context)
  // Ordered: Chat → Knowledge → Config → Analytics
  const agentMainNav: NavItem[] = currentAgentId
    ? [
        // Step 1: Test your agent
        { href: `/dashboard/chat?agentId=${currentAgentId}`, label: "Chat", icon: MessageSquare },
        // Step 2: Add knowledge to your agent
        { href: `/dashboard/knowledge?agentId=${currentAgentId}`, label: "Knowledge", icon: Database },
        // Step 3: Configure your agent
        { href: `/dashboard/agents/${currentAgentId}?tab=config`, label: "Config", icon: SlidersHorizontal },
        // Step 4: Monitor performance
        { href: `/dashboard/analytics?agentId=${currentAgentId}`, label: "Analytics", icon: BarChart2 },
      ]
    : [];

  const agentAdvancedNav: NavItem[] = currentAgentId
    ? [
        // Step 5: Embed in your website
        { href: `/dashboard/agents/${currentAgentId}?tab=embed`, label: "Embed Widget", icon: Code2 },
        // Step 6: Integrate via API
        { href: `/dashboard/agents/${currentAgentId}?tab=api`, label: "API & Security", icon: Shield },
      ]
    : [];

  const agentBackNav: NavItem[] = currentAgentId
    ? [
        { href: "/dashboard", label: "Back to Agents", icon: ArrowLeft },
      ]
    : [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Helper function to check if nav item is active
  const isNavItemActive = (item: NavItem): boolean => {
    const basePath = item.href.split("?")[0];
    const hrefUrl = new URL(item.href, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const hrefTab = hrefUrl.searchParams.get("tab");
    const hrefAgentId = hrefUrl.searchParams.get("agentId");

    if (hrefTab) {
      return pathname === `/dashboard/agents/${currentAgentId}` && currentTab === hrefTab;
    } else if (hrefAgentId) {
      return pathname === basePath && currentAgentId === hrefAgentId;
    } else {
      // Exact match for root paths
      if (basePath === "/" || basePath === "/dashboard") {
        return pathname === basePath;
      }
      // For other paths, check exact match or if pathname starts with basePath + "/"
      return pathname === basePath || (pathname?.startsWith(basePath + "/") && basePath !== "/");
    }
  };

  // Render navigation item
  const renderNavItem = (item: NavItem, onClick?: () => void) => {
    const isActive = isNavItemActive(item);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
        <span>{item.label}</span>
      </Link>
    );
  };

  // Render navigation section
  const renderNavSection = () => (
    <>
      {/* Main Navigation */}
      <div className="space-y-4">
        {currentAgentId ? (
          <>
            <div>
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent</h3>
              </div>
              <div className="space-y-1">
                {agentMainNav.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
              </div>
            </div>
            
            {agentAdvancedNav.length > 0 && (
              <div>
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Integration</h3>
                </div>
                <div className="space-y-1">
                  {agentAdvancedNav.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
                </div>
              </div>
            )}

            {/* Back to Agents - Moved to bottom */}
            {agentBackNav.length > 0 && (
              <div className="pt-2 border-t">
                <div className="space-y-1">
                  {agentBackNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                      >
                        {Icon ? <Icon className="h-4 w-4" /> : null}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-1">
              {mainNav.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
            </div>

            {/* Settings Section */}
            {settingsNav.length > 0 && (
              <div className="pt-2 border-t">
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</h3>
                </div>
                <div className="space-y-1">
                  {settingsNav.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            {quickLinks.length > 0 && (
              <div className="pt-2 border-t">
                <div className="space-y-1">
                  {quickLinks.map((item) => renderNavItem(item, () => setSidebarOpen(false)))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiLogout();
      dispatch(logoutAction());
      dispatch(resetTenantState());
      clearTokens();
      setMenuOpen(false);
      setLogoutDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      dispatch(logoutAction());
      dispatch(resetTenantState());
      clearTokens();
      setMenuOpen(false);
      setLogoutDialogOpen(false);
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          {/* Left: Logo + workspace name placeholder */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logoGobal.png" alt="LuxeWear" className="h-7 w-auto" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">LuxeWear</span>
                <span className="text-muted-foreground/60">/</span>
                <span className="text-muted-foreground">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Right: quick links */}
          <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium">
            <div className="hidden sm:block">
              <TenantSwitcher />
            </div>
            <Link 
              href="/docs/user-guides" 
              className="hidden md:inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/user" className="flex items-center gap-2 cursor-pointer">
                    <UserRoundCog className="h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/workspaceSetting/general" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Workspace</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/pages/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>General Settings</span>
            </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative" ref={menuRef}>
              <button
                className="overflow-hidden rounded-full"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open profile menu"
              >
                <UserAvatar image={user?.avatar_url || undefined} fallback={(user?.name || user?.email || "U").slice(0,2).toUpperCase()} className="h-7 w-7" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4">
                    <div className="text-base font-semibold">{user?.name || "User"}</div>
                    <div className="text-sm text-muted-foreground">{user?.email || ""}</div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="p-2">
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">Dashboard</Link>
                    {isAdmin && (
                      <Link 
                        href="/admin/dashboard" 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setLogoutDialogOpen(true);
                      }}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside 
            ref={sidebarRef}
            className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-xl animate-in slide-in-from-left duration-300"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <img src="/logoGobal.png" alt="LuxeWear" className="h-6 w-auto" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
              {renderNavSection()}
            </nav>
          </aside>
        </div>
      )}

      {/* Body with Sidebar */}
      <div className="mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 border-r bg-background/50">
          <nav className="p-4">
            {renderNavSection()}
          </nav>
        </aside>

        {/* Content */}
        <main
          key={currentTenant || 'no-tenant'}
          className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 transition-opacity duration-200 dashboard-main-zoom"
        >
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Sign out
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={loggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loggingOut}
              className="gap-2"
            >
              {loggingOut ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
