'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import DocsContent from "@/components/docs/DocsContent";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Info, 
  Settings,
  Shield,
  Bell,
  Globe,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceSettingsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <DocsLeftSidebar />

          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Workspace Management</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Workspace Settings</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Configure workspace-wide settings including security, notifications, integrations, and preferences. Customize your workspace to match your team&apos;s needs.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPage}
                  className="rounded-lg"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy page
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content */}
            <DocsContent>
              <h2 id="overview">Overview</h2>
              <p>
                Workspace settings allow you to configure how your workspace operates, including security policies, notification preferences, default configurations, and integrations. These settings apply workspace-wide and affect all members.
              </p>

              <h2 id="general-settings">General Settings</h2>
              
              <h3 id="workspace-name">Workspace Name</h3>
              <p>Change your workspace display name:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Update workspace name</li>
                <li>Change workspace description</li>
                <li>Set workspace logo/avatar</li>
              </ul>

              <h3 id="workspace-url">Workspace URL</h3>
              <p>Customize your workspace URL:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Set custom workspace subdomain</li>
                <li>Use for branded links and integrations</li>
                <li>URL must be unique and available</li>
              </ul>

              <h3 id="timezone">Timezone</h3>
              <p>Set default timezone for the workspace:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Affects timestamps and scheduling</li>
                <li>Members can override in personal settings</li>
                <li>Used for reports and analytics</li>
              </ul>

              <h2 id="security-settings">Security Settings</h2>
              
              <h3 id="two-factor-auth">Two-Factor Authentication</h3>
              <p>Enhance workspace security:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Require 2FA for all members</li>
                <li>Enforce 2FA for admins only</li>
                <li>Optional 2FA (member choice)</li>
              </ul>

              <h3 id="sso">Single Sign-On (SSO)</h3>
              <p>Configure SSO for enterprise workspaces:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>SAML 2.0 support</li>
                <li>OAuth integration</li>
                <li>Directory sync</li>
                <li>Automatic user provisioning</li>
              </ul>

              <h3 id="session-management">Session Management</h3>
              <p>Control user sessions:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Session timeout duration</li>
                <li>Maximum concurrent sessions</li>
                <li>IP whitelisting</li>
                <li>Device management</li>
              </ul>

              <h3 id="api-security">API Security</h3>
              <p>Manage API access:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>API key rotation policies</li>
                <li>Rate limiting</li>
                <li>IP restrictions</li>
                <li>Webhook security</li>
              </ul>

              <h2 id="notification-settings">Notification Settings</h2>
              <p>Configure workspace-wide notifications:</p>
              
              <h3 id="email-notifications">Email Notifications</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Usage alerts</li>
                <li>Security alerts</li>
                <li>Weekly summaries</li>
                <li>Team activity updates</li>
              </ul>

              <h3 id="in-app-notifications">In-App Notifications</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Real-time activity updates</li>
                <li>System announcements</li>
                <li>Team mentions</li>
                <li>Alert preferences</li>
              </ul>

              <h2 id="default-settings">Default Settings</h2>
              <p>Set defaults for new agents and resources:</p>
              
              <h3 id="agent-defaults">Agent Defaults</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Default AI model</li>
                <li>Default temperature</li>
                <li>Default instructions template</li>
                <li>Default response format</li>
              </ul>

              <h3 id="source-defaults">Source Defaults</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Default chunk size</li>
                <li>Default processing settings</li>
                <li>Default metadata fields</li>
              </ul>

              <h2 id="integrations">Workspace Integrations</h2>
              <p>Configure workspace-level integrations:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Slack workspace integration</li>
                <li>Email service configuration</li>
                <li>Analytics tools</li>
                <li>CRM connections</li>
                <li>Custom webhooks</li>
              </ul>

              <h2 id="billing-settings">Billing Settings</h2>
              <p>Manage workspace billing:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>View current plan</li>
                <li>Update payment method</li>
                <li>View billing history</li>
                <li>Manage subscriptions</li>
                <li>Set billing email</li>
              </ul>

              <h2 id="data-settings">Data Settings</h2>
              
              <h3 id="data-retention">Data Retention</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Conversation retention period</li>
                <li>Log retention settings</li>
                <li>Archive policies</li>
                <li>Auto-deletion rules</li>
              </ul>

              <h3 id="data-export">Data Export</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Enable/disable data export</li>
                <li>Export formats</li>
                <li>Export frequency</li>
              </ul>

              <h3 id="backup">Backup</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Automatic backup settings</li>
                <li>Backup frequency</li>
                <li>Backup retention</li>
              </ul>

              <h2 id="compliance">Compliance and Privacy</h2>
              <p>Configure compliance settings:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>GDPR compliance settings</li>
                <li>Data processing agreements</li>
                <li>Privacy policy links</li>
                <li>Cookie consent settings</li>
                <li>Data residency options</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Review and update workspace settings regularly, especially security and compliance settings. Keep them aligned with your organization&apos;s policies.
                </div>
              </div>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Enable two-factor authentication for enhanced security</li>
                <li>Set appropriate session timeouts</li>
                <li>Configure usage alerts to avoid surprises</li>
                <li>Review security settings regularly</li>
                <li>Keep default settings aligned with your needs</li>
                <li>Document custom configurations</li>
                <li>Test settings changes in a test workspace first</li>
                <li>Train team members on security policies</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/workspace/manage" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Manage Workspace</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage team members and permissions</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/workspace/usage" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Usage</h3>
                      <p className="text-sm text-muted-foreground mt-1">Monitor workspace usage</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "general-settings", label: "General Settings" },
              { id: "workspace-name", label: "Workspace Name" },
              { id: "workspace-url", label: "Workspace URL" },
              { id: "security-settings", label: "Security Settings" },
              { id: "two-factor-auth", label: "Two-Factor Authentication" },
              { id: "sso", label: "Single Sign-On" },
              { id: "notification-settings", label: "Notification Settings" },
              { id: "default-settings", label: "Default Settings" },
              { id: "integrations", label: "Workspace Integrations" },
              { id: "billing-settings", label: "Billing Settings" },
              { id: "data-settings", label: "Data Settings" },
              { id: "compliance", label: "Compliance and Privacy" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

