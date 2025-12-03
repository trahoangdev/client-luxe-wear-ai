'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
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

export default function HubSpotIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">HubSpot Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect LuxeWear with HubSpot to sync contacts, track conversations, and enhance your CRM with AI-powered insights. Seamlessly integrate customer interactions with your sales and marketing workflows.
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
                The HubSpot integration allows you to synchronize contacts and conversations between LuxeWear and HubSpot CRM. This enables you to maintain a unified view of customer interactions, track leads through your sales pipeline, and leverage AI insights within your existing HubSpot workflows.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up the HubSpot integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A HubSpot account (free or paid)</li>
                <li>Administrator or integration permissions in HubSpot</li>
                <li>A LuxeWear account with an active AI agent</li>
                <li>HubSpot API access enabled (for custom integrations)</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Connect HubSpot Account</h3>
              <p className="mb-4">Authorize LuxeWear to access your HubSpot account:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your LuxeWear Dashboard</li>
                <li>Navigate to <strong>Integrations → HubSpot</strong></li>
                <li>Click <strong>&quot;Connect HubSpot&quot;</strong></li>
                <li>You&apos;ll be redirected to HubSpot to authorize</li>
                <li>Log in to your HubSpot account</li>
                <li>Review and approve the requested permissions</li>
                <li>You&apos;ll be redirected back to LuxeWear</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Permissions:</strong> LuxeWear requests access to read and write contacts, read conversations, and create timeline events. These permissions are necessary for full integration functionality.
                </div>
              </div>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Configure Sync Settings</h3>
              <p className="mb-4">Set up how data syncs between LuxeWear and HubSpot:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Choose sync direction:
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>LuxeWear → HubSpot (contacts created in LuxeWear sync to HubSpot)</li>
                    <li>HubSpot → LuxeWear (contacts from HubSpot sync to LuxeWear)</li>
                    <li>Bidirectional (syncs both ways)</li>
                  </ul>
                </li>
                <li>Configure field mapping (match LuxeWear fields to HubSpot properties)</li>
                <li>Set sync frequency (real-time or scheduled)</li>
                <li>Choose which contact properties to sync</li>
              </ol>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Map Contact Fields</h3>
              <p className="mb-4">Map LuxeWear contact fields to HubSpot properties:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Name:</strong> Map to HubSpot first name and last name</li>
                <li><strong>Email:</strong> Map to HubSpot email property</li>
                <li><strong>Phone:</strong> Map to HubSpot phone property</li>
                <li><strong>Company:</strong> Map to HubSpot company association</li>
                <li><strong>Custom Fields:</strong> Map any custom fields you&apos;ve created</li>
              </ul>

              <h3 id="step-4" className="mt-6 mb-4">Step 4: Configure Conversation Tracking</h3>
              <p className="mb-4">Set up how conversations are tracked in HubSpot:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Enable conversation sync to create timeline events in HubSpot</li>
                <li>Choose which conversation types to sync</li>
                <li>Configure how conversation summaries are created</li>
                <li>Set up automatic contact association</li>
              </ul>

              <h2 id="features" className="scroll-mt-20 mt-10">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Contact Sync</h3>
                      <p className="text-sm text-muted-foreground">Automatically sync contacts between LuxeWear and HubSpot</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Conversation Tracking</h3>
                      <p className="text-sm text-muted-foreground">Track AI conversations as timeline events in HubSpot</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Lead Scoring</h3>
                      <p className="text-sm text-muted-foreground">Use conversation data to update HubSpot lead scores</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Deal Association</h3>
                      <p className="text-sm text-muted-foreground">Associate conversations with HubSpot deals</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="use-cases" className="scroll-mt-20 mt-10">Use Cases</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Lead Capture:</strong> Automatically create HubSpot contacts when leads are captured through your AI agent</li>
                <li><strong>Sales Enablement:</strong> Provide sales teams with AI conversation context in HubSpot</li>
                <li><strong>Marketing Automation:</strong> Trigger HubSpot workflows based on AI agent interactions</li>
                <li><strong>Customer Support:</strong> Track support conversations in HubSpot for better customer service</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Map fields carefully to ensure data accuracy</li>
                <li>Use bidirectional sync only when necessary to avoid conflicts</li>
                <li>Regularly review sync logs for errors</li>
                <li>Set up proper field mappings for custom properties</li>
                <li>Use HubSpot workflows to automate follow-up actions</li>
                <li>Monitor sync performance and adjust frequency as needed</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with one-way sync (LuxeWear → HubSpot) to test the integration, then enable bidirectional sync if needed.
                </div>
              </div>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="sync-issues" className="mt-6 mb-4">Sync Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check that HubSpot permissions are still valid</li>
                <li>Verify field mappings are correct</li>
                <li>Review sync logs in LuxeWear dashboard</li>
                <li>Ensure HubSpot API limits aren&apos;t exceeded</li>
              </ul>

              <h3 id="duplicate-contacts" className="mt-6 mb-4">Duplicate Contacts</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Use email as the unique identifier for matching</li>
                <li>Enable duplicate detection in HubSpot</li>
                <li>Review sync settings to prevent duplicate creation</li>
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
