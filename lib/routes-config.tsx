type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: string;
  isComing?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "Menu",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/default",
        icon: "PieChart"
      },
      { title: "Users", href: "/dashboard/pages/users", icon: "Users" },
      { title: "Tenants", href: "/dashboard/tenants", icon: "Building" },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: "Settings"
      },
      {
        title: "Authentication",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "Login", href: "/auth/login" },
          { title: "Register", href: "/auth/register" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "404", href: "/pages/error/404" },
          { title: "500", href: "/pages/error/500" }
        ]
      }
    ]
  }
];
