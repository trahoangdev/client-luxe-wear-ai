"use client";
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  Database, 
  Building2, 
  BarChart3, 
  Settings, 
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const nav = [
    { 
      href: "/admin/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      exact: true,
    },
    { 
      href: "/admin/dashboard/user", 
      label: "User Management", 
      icon: Users,
    },
    { 
      href: "/admin/dashboard/agent", 
      label: "Agent Management", 
      icon: Bot,
    },
    { 
      href: "/admin/dashboard/knowledge", 
      label: "Knowledge Management", 
      icon: Database,
    },
    { 
      href: "/admin/dashboard/tenant", 
      label: "Tenant Management", 
      icon: Building2,
    },
    { 
      href: "/admin/dashboard/analytics", 
      label: "System Analytics", 
      icon: BarChart3,
    },
    // { 
    //   href: "/admin/dashboard/activity", 
    //   label: "Activity Logs", 
    //   icon: Activity,
    // },
    // { 
    //   href: "/admin/dashboard/errors", 
    //   label: "Error Monitoring", 
    //   icon: AlertTriangle,
    // },
    { 
      href: "/admin/dashboard/moderation", 
      label: "Content Moderation", 
      icon: FileText,
    },
    { 
      href: "/admin/settings", 
      label: "System Settings", 
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-background">
      <div className="p-4 border-b">
        <div className="text-sm font-semibold text-foreground">Admin Panel</div>
        <div className="text-xs text-muted-foreground mt-1">System Management</div>
      </div>
      <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
