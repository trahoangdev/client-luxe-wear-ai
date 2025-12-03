'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

const navItems = [
  {
    href: '/docs/user-guides',
    label: 'Welcome to LuxeWear',
    icon: '✦',
  },
  {
    href: '/docs/your-first-agent',
    label: 'Build Your First AI Agent',
    icon: '🔑',
  },
  {
    href: '/docs/best-practices',
    label: 'Best Practices',
    icon: '☆',
  },
];

const managementItems = [
  {
    href: '/docs/playground',
    label: 'Playground',
    icon: '▶',
  },
  {
    href: '/docs/sources',
    label: 'Sources',
    icon: '▦',
  },
  {
    href: '/docs/settings',
    label: 'Settings',
    icon: '⚙',
  },
];

const actionsItems = [
  { href: '/docs/actions/overview', label: 'Overview' },
  { href: '/docs/actions/create', label: 'Create Actions' },
  { href: '/docs/actions/webhook', label: 'Webhook Actions' },
  { href: '/docs/actions/custom', label: 'Custom Actions' },
];

const contactsItems = [
  { href: '/docs/contacts/overview', label: 'Overview' },
  { href: '/docs/contacts/manage', label: 'Manage Contacts' },
  { href: '/docs/contacts/segments', label: 'Segments' },
];

const analyticsItems = [
  {
    href: '/docs/analytics/activity',
    label: 'Activity',
    icon: '📊',
  },
  {
    href: '/docs/analytics/overview',
    label: 'Analytics',
    icon: '📈',
  },
];

const workspaceItems = [
  {
    href: '/docs/workspace/manage',
    label: 'Manage',
    icon: '👥',
  },
  {
    href: '/docs/workspace/usage',
    label: 'Usage',
    icon: '📊',
  },
  {
    href: '/docs/workspace/settings',
    label: 'Settings',
    icon: '⚙',
  },
];

const websitePlatformsItems = [
  { href: '/docs/integrations/wordpress', label: 'WordPress' },
  { href: '/docs/integrations/shopify', label: 'Shopify' },
  { href: '/docs/integrations/webflow', label: 'Webflow' },
  { href: '/docs/integrations/custom', label: 'Custom Website' },
];

const messagingPlatformsItems = [
  { href: '/docs/integrations/whatsapp', label: 'WhatsApp' },
  { href: '/docs/integrations/slack', label: 'Slack' },
  { href: '/docs/integrations/telegram', label: 'Telegram' },
  { href: '/docs/integrations/discord', label: 'Discord' },
];

const businessToolsItems = [
  { href: '/docs/integrations/zapier', label: 'Zapier' },
  { href: '/docs/integrations/make', label: 'Make' },
  { href: '/docs/integrations/hubspot', label: 'HubSpot' },
  { href: '/docs/integrations/salesforce', label: 'Salesforce' },
];

const performanceItems = [
  {
    href: '/docs/performance/response-quality',
    label: 'Response Quality',
    icon: '⏱',
  },
  {
    href: '/docs/performance/models-comparison',
    label: 'Models Comparison',
    icon: '⚖',
  },
];

export default function DocsLeftSidebar() {
  const pathname = usePathname();
  
  // Auto-expand sections based on current pathname
  const getInitialOpenState = (): Record<string, boolean> => {
    if (!pathname) {
      return {
        actions: false,
        contacts: false,
        websitePlatforms: false,
        messagingPlatforms: false,
        businessTools: false,
      };
    }
    
    return {
      actions: pathname.startsWith('/docs/actions'),
      contacts: pathname.startsWith('/docs/contacts'),
      websitePlatforms: pathname.startsWith('/docs/integrations/wordpress') ||
                        pathname.startsWith('/docs/integrations/shopify') ||
                        pathname.startsWith('/docs/integrations/webflow') ||
                        pathname.startsWith('/docs/integrations/custom'),
      messagingPlatforms: pathname.startsWith('/docs/integrations/whatsapp') ||
                          pathname.startsWith('/docs/integrations/slack') ||
                          pathname.startsWith('/docs/integrations/telegram') ||
                          pathname.startsWith('/docs/integrations/discord'),
      businessTools: pathname.startsWith('/docs/integrations/zapier') ||
                     pathname.startsWith('/docs/integrations/make') ||
                     pathname.startsWith('/docs/integrations/hubspot') ||
                     pathname.startsWith('/docs/integrations/salesforce'),
    };
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => getInitialOpenState());

  // Update open sections when pathname changes
  useEffect(() => {
    const newState = getInitialOpenState();
    setOpenSections(prev => {
      // Only update if pathname actually changed the state
      const hasChanges = Object.keys(newState).some(key => newState[key] !== prev[key]);
      return hasChanges ? { ...prev, ...newState } : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-24 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Quick Start */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Quick Start</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href) || 
                (item.href === '/docs/user-guides' && pathname?.startsWith('/docs/user-guides')) ||
                (item.href === '/docs/best-practices' && pathname?.startsWith('/docs/best-practices'));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI Agent Management */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">AI Agent Management</div>
          <nav className="space-y-1">
            {managementItems.map((item) => {
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            
            {/* Actions - Collapsible */}
            <Collapsible open={openSections.actions} onOpenChange={() => toggleSection('actions')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">⚡</span>
                  <span>Actions</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.actions && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {actionsItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            {/* Contacts - Collapsible */}
            <Collapsible open={openSections.contacts} onOpenChange={() => toggleSection('contacts')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">👤</span>
                  <span>Contacts</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.contacts && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {contactsItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </nav>
        </div>

        {/* Analytics & Monitoring */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Analytics & Monitoring</div>
          <nav className="space-y-1">
            {analyticsItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workspace Management */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Workspace Management</div>
          <nav className="space-y-1">
            {workspaceItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Integrations */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Integrations</div>
          <nav className="space-y-1">
            {/* Website Platforms */}
            <Collapsible open={openSections.websitePlatforms} onOpenChange={() => toggleSection('websitePlatforms')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <span>Website Platforms</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.websitePlatforms && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {websitePlatformsItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            {/* Messaging Platforms */}
            <Collapsible open={openSections.messagingPlatforms} onOpenChange={() => toggleSection('messagingPlatforms')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <span>Messaging Platforms</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.messagingPlatforms && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {messagingPlatformsItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            {/* Business Tools */}
            <Collapsible open={openSections.businessTools} onOpenChange={() => toggleSection('businessTools')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <span>Business Tools</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.businessTools && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {businessToolsItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </nav>
        </div>

        {/* AI Performance & Quality */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">AI Performance & Quality</div>
          <nav className="space-y-1">
            {performanceItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
