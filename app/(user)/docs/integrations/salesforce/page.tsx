'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import DocsContent from "@/components/docs/DocsContent";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Building2,
  Info,
  Lightbulb,
  Users,
  MessageSquare
} from 'lucide-react';

export default function SalesforceIntegrationPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">Integrations</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Salesforce Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect LuxeWear with Salesforce to sync leads, track conversations, and enhance your CRM with AI-powered insights. Integrate customer interactions seamlessly with your Salesforce workflows.
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
              <h2 id="overview" className="scroll-mt-20">Overview</h2>
              <p className="text-base leading-7 mb-6">
                The Salesforce integration enables you to synchronize contacts, leads, and conversations between LuxeWear and Salesforce CRM. This integration helps you maintain a complete view of customer interactions, track leads through your sales process, and leverage AI insights within your Salesforce environment.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up the Salesforce integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Salesforce account (Salesforce org access)</li>
                <li>System Administrator or Integration User permissions</li>
                <li>A LuxeWear account with an active AI agent</li>
                <li>API access enabled in Salesforce (for custom integrations)</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Create Connected App in Salesforce</h3>
              <p className="mb-4">Set up OAuth authentication in Salesforce:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Log in to Salesforce Setup</li>
                <li>Navigate to <strong>App Manager</strong> (under Apps)</li>
                <li>Click <strong>&quot;New Connected App&quot;</strong></li>
                <li>Fill in basic information:
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>Connected App Name: &quot;LuxeWear Integration&quot;</li>
                    <li>API Name: Auto-generated</li>
                    <li>Contact Email: Your email</li>
                  </ul>
                </li>
                <li>Enable OAuth Settings:
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>Callback URL: <code className="px-1.5 py-0.5 rounded bg-muted text-sm">https://luxewear.ai/oauth/salesforce</code></li>
                    <li>Selected OAuth Scopes: Full access (full), Perform requests on your behalf at any time (refresh_token, offline_access)</li>
                  </ul>
                </li>
                <li>Save and note the Consumer Key and Consumer Secret</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Security:</strong> Keep your Consumer Key and Consumer Secret secure. These are used for OAuth authentication.
                </div>
              </div>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Connect Salesforce in LuxeWear</h3>
              <p className="mb-4">Authorize LuxeWear to access your Salesforce org:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your LuxeWear Dashboard</li>
                <li>Navigate to <strong>Integrations → Salesforce</strong></li>
                <li>Click <strong>&quot;Connect Salesforce&quot;</strong></li>
                <li>Enter your Salesforce login URL (e.g., <code className="px-1.5 py-0.5 rounded bg-muted text-sm">https://login.salesforce.com</code> or your custom domain)</li>
                <li>Enter Consumer Key and Consumer Secret from Step 1</li>
                <li>Click <strong>&quot;Authorize&quot;</strong></li>
                <li>Log in to Salesforce and approve the connection</li>
                <li>You&apos;ll be redirected back to LuxeWear</li>
              </ol>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Configure Object Mapping</h3>
              <p className="mb-4">Map LuxeWear data to Salesforce objects:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Contacts:</strong> Map to Salesforce Contact or Lead objects</li>
                <li><strong>Conversations:</strong> Map to Salesforce Tasks, Events, or custom objects</li>
                <li><strong>Custom Fields:</strong> Map custom fields between systems</li>
                <li>Choose sync direction (LuxeWear → Salesforce, bidirectional, etc.)</li>
              </ul>

              <h3 id="step-4" className="mt-6 mb-4">Step 4: Configure Field Mapping</h3>
              <p className="mb-4">Map specific fields between LuxeWear and Salesforce:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Name:</strong> Map to FirstName and LastName in Salesforce</li>
                <li><strong>Email:</strong> Map to Email field</li>
                <li><strong>Phone:</strong> Map to Phone field</li>
                <li><strong>Company:</strong> Map to Account association</li>
                <li><strong>Custom Fields:</strong> Map any custom fields you&apos;ve created</li>
              </ul>

              <h2 id="features" className="scroll-mt-20 mt-10">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Lead & Contact Sync</h3>
                      <p className="text-sm text-muted-foreground">Automatically sync leads and contacts between systems</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Activity Tracking</h3>
                      <p className="text-sm text-muted-foreground">Track AI conversations as activities in Salesforce</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Opportunity Association</h3>
                      <p className="text-sm text-muted-foreground">Associate conversations with Salesforce Opportunities</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Workflow Automation</h3>
                      <p className="text-sm text-muted-foreground">Trigger Salesforce workflows based on AI interactions</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="use-cases" className="scroll-mt-20 mt-10">Use Cases</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Lead Qualification:</strong> Automatically create and qualify leads in Salesforce from AI agent interactions</li>
                <li><strong>Sales Enablement:</strong> Provide sales teams with AI conversation context directly in Salesforce</li>
                <li><strong>Customer Support:</strong> Track support conversations and create cases in Salesforce</li>
                <li><strong>Marketing Automation:</strong> Trigger Salesforce campaigns based on AI agent interactions</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Use email as the unique identifier for matching records</li>
                <li>Map fields carefully to ensure data accuracy</li>
                <li>Use Salesforce validation rules to maintain data quality</li>
                <li>Set up proper object relationships (Account, Contact, Lead)</li>
                <li>Use Salesforce workflows and Process Builder for automation</li>
                <li>Regularly review sync logs for errors</li>
                <li>Test the integration in a Salesforce sandbox first</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with one-way sync (LuxeWear → Salesforce) to test, then enable bidirectional sync if needed. Always test in a sandbox environment first.
                </div>
              </div>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="oauth-issues" className="mt-6 mb-4">OAuth Connection Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify Consumer Key and Consumer Secret are correct</li>
                <li>Check that callback URL matches exactly in Connected App</li>
                <li>Ensure OAuth scopes are properly configured</li>
                <li>Check Salesforce org security settings</li>
              </ul>

              <h3 id="sync-issues" className="mt-6 mb-4">Sync Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check Salesforce API limits and usage</li>
                <li>Verify field mappings are correct</li>
                <li>Review sync logs in LuxeWear dashboard</li>
                <li>Ensure required fields are populated</li>
                <li>Check Salesforce validation rules</li>
              </ul>

              <h3 id="permission-issues" className="mt-6 mb-4">Permission Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify the integration user has necessary object permissions</li>
                <li>Check field-level security settings</li>
                <li>Ensure profile/permission set includes required access</li>
              </ul>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "prerequisites", label: "Prerequisites" },
              { id: "setup", label: "Setup Instructions" },
              { id: "features", label: "Features" },
              { id: "use-cases", label: "Use Cases" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
