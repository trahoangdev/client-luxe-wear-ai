"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, BookOpen, FileCode, RefreshCcw, BookMarked, LogOut, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout as logoutAction } from "@/store/authSlice";
import { logout as apiLogout, clearTokens } from "@/services/authUserService";
import { resetTenantState } from "@/store/tenantSlice";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = !!user;
  // Check if user is admin - handle different role formats (admin, super_admin, etc.)
  const userRole = user?.role?.toLowerCase()?.trim();
  const isAdmin = userRole === "admin" || userRole === "super_admin";
  const roleLabel =
    userRole === "super_admin"
      ? "Super admin"
      : userRole === "owner"
      ? "Owner"
      : userRole === "admin"
      ? "Admin"
      : userRole === "member"
      ? "Member"
      : undefined;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto h-14 flex items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity relative z-10">
          <Image
            src="/logoGobal.png"
            alt="Logo"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
            quality={100}
            unoptimized
            style={{ opacity: 1, filter: 'none' }}
          />
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-16 text-base font-semibold">
          <Link href="/pricing" className="hover:text-foreground/80 transition-colors">Pricing</Link>
          <Link href="/enterprise" className="hover:text-foreground/80 transition-colors">Enterprise</Link>
          <div
            className="relative"
            onMouseEnter={() => {
              setOpen(true);
              setShowBridge(true);
            }}
            onMouseLeave={() => {
              setOpen(false);
              setShowBridge(false);
            }}
          >
            <button
              onMouseEnter={() => {
                setOpen(true);
                setShowBridge(true);
              }}
              onClick={() => {
                setOpen((v) => !v);
                setShowBridge(true);
              }}
              className="inline-flex items-center gap-1 hover:text-foreground/80"
            >
              Resources <ChevronDown className="h-4 w-4" />
            </button>
            {/* Hover bridge area only when hovering trigger */}
            {showBridge && (
              <div
                className="absolute left-0 top-full w-[560px] max-w-[90vw] h-3"
                onMouseEnter={() => setOpen(true)}
              />
            )}

            {open && (
              <div className="absolute left-0 top-full mt-3 w-[560px] max-w-[90vw] rounded-2xl border bg-background shadow-2xl">
                <div className="p-6">
                  <div className="text-2xl font-bold">Resources</div>
                  <div className="mt-4 space-y-5">
                    <Link href="/docs/user-guides" className="flex items-start gap-4 p-2 rounded-xl hover:bg-muted" onClick={() => setOpen(false)}>
                      <div className="h-12 w-12 rounded-xl border inline-flex items-center justify-center"><BookOpen className="h-5 w-5" /></div>
                      <div>
                        <div className="text-lg font-semibold">Guide</div>
                        <p className="text-sm text-muted-foreground">Find out everything on how to use LuxeWear, and unlock its full potential.</p>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-4 p-2 rounded-xl hover:bg-muted" onClick={() => setOpen(false)}>
                      <div className="h-12 w-12 rounded-xl border inline-flex items-center justify-center"><BookMarked className="h-5 w-5" /></div>
                      <div>
                        <div className="text-lg font-semibold">Blog</div>
                        <p className="text-sm text-muted-foreground">Learn more about LuxeWear by reading our latest articles.</p>
                      </div>
                    </Link>
                    <Link href="/docs/user-guides" className="flex items-start gap-4 p-2 rounded-xl hover:bg-muted" onClick={() => setOpen(false)}>
                      <div className="h-12 w-12 rounded-xl border inline-flex items-center justify-center"><FileCode className="h-5 w-5" /></div>
                      <div>
                        <div className="text-lg font-semibold">Docs</div>
                        <p className="text-sm text-muted-foreground">Explore our API and learn how to integrate LuxeWear with your app.</p>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-4 p-2 rounded-xl hover:bg-muted" onClick={() => setOpen(false)}>
                      <div className="h-12 w-12 rounded-xl border inline-flex items-center justify-center"><RefreshCcw className="h-5 w-5" /></div>
                      <div>
                        <div className="text-lg font-semibold">Changelog</div>
                        <p className="text-sm text-muted-foreground">Stay up to date with the latest updates and features.</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Login + Dashboard or User Menu */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-base font-semibold hover:text-foreground/80 transition-colors">Dashboard</Link>
              <div className="relative" ref={menuRef}>
                <button
                  className="overflow-hidden rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Open profile menu"
                >
                  <UserAvatar 
                    image={user?.avatar_url || undefined} 
                    fallback={(user?.name || user?.email || "U").slice(0, 2).toUpperCase()} 
                    className="h-8 w-8" 
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-base font-semibold">
                            {user?.name || "User"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user?.email || ""}
                          </div>
                        </div>
                        {roleLabel && (
                          <Badge variant={isAdmin ? "default" : "outline"} className="text-xs px-2 py-0.5">
                            {roleLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="p-2">
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link 
                          href="/admin/dashboard" 
                          onClick={() => setMenuOpen(false)} 
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <Shield className="h-4 w-4" />
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
            </>
          ) : (
            <Link 
              href="/auth/login"
              onClick={(e) => {
                // Prevent any automatic redirects, ensure we go to login page
                e.preventDefault();
                router.push("/auth/login");
              }}
              className="text-base font-semibold hover:text-foreground/80 transition-colors"
            >
              Login / Register
            </Link>
          )}
        </div>
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
    </header>
  );
}
