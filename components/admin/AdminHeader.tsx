"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Bot,
  Database,
  Building2,
  BarChart3,
  FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout as logoutAction } from "@/store/authSlice";
import { clearTokens, logout as apiLogout } from "@/services/authUserService";
import { resetTenantState } from "@/store/tenantSlice";
import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const adminRoutes = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "User Management", href: "/admin/dashboard/user", icon: Users },
  { title: "Agent Management", href: "/admin/dashboard/agent", icon: Bot },
  { title: "Knowledge Management", href: "/admin/dashboard/knowledge", icon: Database },
  { title: "Tenant Management", href: "/admin/dashboard/tenant", icon: Building2 },
  { title: "System Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
  // { title: "Activity Logs", href: "/admin/dashboard/activity", icon: Activity },
  // { title: "Error Monitoring", href: "/admin/dashboard/errors", icon: AlertTriangle },
  { title: "Content Moderation", href: "/admin/dashboard/moderation", icon: FileText },
  { title: "System Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const rawRole = user?.role?.toLowerCase()?.trim();
  const roleLabel =
    rawRole === "super_admin"
      ? "Super admin"
      : rawRole === "owner"
      ? "Owner"
      : rawRole === "admin"
      ? "Admin"
      : rawRole === "member"
      ? "Member"
      : undefined;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiLogout();
      dispatch(logoutAction());
      dispatch(resetTenantState());
      clearTokens();
      setOpen(false);
      setLogoutDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      dispatch(logoutAction());
      dispatch(resetTenantState());
      clearTokens();
      setOpen(false);
      setLogoutDialogOpen(false);
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 items-center justify-between px-4">
          {/* Left: Brand + nav */}
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image 
                src="/logoGobal.png" 
                alt="LuxeWear" 
                width={32} 
                height={32} 
                className="h-8 w-auto dark:brightness-0 dark:invert" 
                unoptimized 
              />
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">LuxeWear</span>
                <span>/</span>
                <span>Admin</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/admin/dashboard/user" className="text-muted-foreground hover:text-foreground transition-colors">Users</Link>
              <Link href="/admin/dashboard/agent" className="text-muted-foreground hover:text-foreground transition-colors">Agents</Link>
              <Link href="/admin/settings" className="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
            </div>
          </div>

          {/* Right: Search + actions */}
          <div className="flex items-center gap-3" ref={menuRef}>
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-xl border bg-background px-3 h-9 text-sm hover:border-foreground/20 transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Search</span>
              <span className="ml-2 rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘ K</span>
            </button>
            <Link 
              href="/admin/settings"
              className="h-9 w-9 rounded-lg border inline-flex items-center justify-center hover:bg-muted transition-colors" 
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="overflow-hidden rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
              aria-label="User menu"
            >
              <UserAvatar
                image={user?.avatar_url || undefined}
                fallback={(user?.name || user?.email || "A").slice(0, 2).toUpperCase()}
                className="h-9 w-9"
              />
            </button>
            {open && (
              <div className="absolute right-4 top-12 w-72 rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-semibold">
                        {user?.name || "Admin"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user?.email || ""}
                      </div>
                    </div>
                    {roleLabel && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {roleLabel}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="p-2">
                  <Link 
                    href="/dashboard/user" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard/pages/settings" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Settings
                  </Link>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    User Dashboard
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => {
                      setOpen(false);
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
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Sign out
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You&apos;ll need to sign in again to access the admin panel.
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

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search admin pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Admin Pages">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <CommandItem
                  key={route.href}
                  onSelect={() => {
                    setSearchOpen(false);
                    router.push(route.href);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{route.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
