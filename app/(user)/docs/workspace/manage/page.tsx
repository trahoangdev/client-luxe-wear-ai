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
  Users,
  UserPlus,
  Settings,
  Shield,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceManagePage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Manage Workspace</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Manage your workspace members, roles, permissions, and team collaboration. Control who has access to what features and resources.
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
                Workspace management allows you to collaborate with team members, control access permissions, and organize your AI agents and resources. Manage your team effectively to ensure security and productivity.
              </p>

              <h2 id="workspace-members">Workspace Members</h2>
              <p>View and manage all workspace members:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>See all team members and their roles</li>
                <li>View member activity and last login</li>
                <li>Manage member permissions</li>
                <li>Invite or remove members</li>
              </ul>

              <h2 id="inviting-members">Inviting Members</h2>
              <p>To invite a new team member:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to Workspace → Manage</li>
                <li>Click &quot;Invite Member&quot;</li>
                <li>Enter the member&apos;s email address</li>
                <li>Select a role (see Roles below)</li>
                <li>Optionally assign to specific agents or projects</li>
                <li>Send the invitation</li>
              </ol>

              <h2 id="roles-and-permissions">Roles and Permissions</h2>
              <p>Different roles have different access levels:</p>
              
              <h3 id="owner">Owner</h3>
              <p>Full access to everything:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Manage workspace settings</li>
                <li>Invite and remove members</li>
                <li>Manage billing and subscriptions</li>
                <li>Delete workspace</li>
                <li>All admin and member permissions</li>
              </ul>

              <h3 id="admin">Admin</h3>
              <p>Manage workspace and agents:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Create and manage agents</li>
                <li>Manage sources and knowledge base</li>
                <li>Configure integrations</li>
                <li>View analytics and reports</li>
                <li>Invite members (with restrictions)</li>
                <li>Cannot manage billing or delete workspace</li>
              </ul>

              <h3 id="member">Member</h3>
              <p>Standard user access:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use agents in Playground</li>
                <li>View analytics (limited)</li>
                <li>Manage assigned agents</li>
                <li>Cannot invite members or manage workspace</li>
              </ul>

              <h3 id="viewer">Viewer</h3>
              <p>Read-only access:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>View agents and analytics</li>
                <li>Cannot make changes</li>
                <li>Cannot create or edit agents</li>
              </ul>

              <h2 id="managing-permissions">Managing Permissions</h2>
              <p>Customize permissions for specific members:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Grant or revoke specific permissions</li>
                <li>Assign members to specific agents</li>
                <li>Set project-level permissions</li>
                <li>Control access to sensitive features</li>
              </ul>

              <h2 id="removing-members">Removing Members</h2>
              <p>To remove a workspace member:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to the member&apos;s profile</li>
                <li>Click &quot;Remove from Workspace&quot;</li>
                <li>Confirm the removal</li>
                <li>Choose what to do with their resources (transfer or delete)</li>
              </ol>

              <h2 id="workspace-settings">Workspace Settings</h2>
              <p>Manage workspace-level settings:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Workspace Name:</strong> Change workspace display name</li>
                <li><strong>Workspace URL:</strong> Custom workspace URL</li>
                <li><strong>Default Settings:</strong> Set defaults for new agents</li>
                <li><strong>Security:</strong> Two-factor authentication, SSO</li>
                <li><strong>Integrations:</strong> Workspace-level integrations</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use the principle of least privilege (give minimum necessary access)</li>
                <li>Regularly review member access and permissions</li>
                <li>Remove inactive members</li>
                <li>Use roles appropriately (don&apos;t make everyone admin)</li>
                <li>Document permission changes</li>
                <li>Enable two-factor authentication for security</li>
                <li>Assign members to specific agents when possible</li>
                <li>Review workspace activity regularly</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with viewer or member roles and promote as needed. It&apos;s easier to grant more access than to revoke it.
                </div>
              </div>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/workspace/usage" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Usage</h3>
                      <p className="text-sm text-muted-foreground mt-1">Monitor workspace usage and limits</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/workspace/settings" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Settings</h3>
                      <p className="text-sm text-muted-foreground mt-1">Configure workspace settings</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "workspace-members", label: "Workspace Members" },
              { id: "inviting-members", label: "Inviting Members" },
              { id: "roles-and-permissions", label: "Roles and Permissions" },
              { id: "owner", label: "Owner" },
              { id: "admin", label: "Admin" },
              { id: "member", label: "Member" },
              { id: "viewer", label: "Viewer" },
              { id: "managing-permissions", label: "Managing Permissions" },
              { id: "removing-members", label: "Removing Members" },
              { id: "workspace-settings", label: "Workspace Settings" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

