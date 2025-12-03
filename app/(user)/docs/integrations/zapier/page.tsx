'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import DocsContent from "@/components/docs/DocsContent";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Zap,
  Settings,
  Info,
  Lightbulb,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ZapierIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Zapier Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect LuxeWear with thousands of apps through Zapier. Automate workflows, sync data, and integrate with your favorite tools without writing code.
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
                Zapier is an automation platform that connects LuxeWear with over 5,000+ apps. Create automated workflows (Zaps) that trigger actions in other apps based on events in LuxeWear, or vice versa. No coding required.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up Zapier integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Zapier account (free or paid plan)</li>
                <li>A LuxeWear account with an active AI agent</li>
                <li>Access to the apps you want to connect</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Find LuxeWear in Zapier</h3>
              <p className="mb-4">Locate the LuxeWear app in Zapier:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Log in to your <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Zapier account</a></li>
                <li>Click <strong>&quot;Create Zap&quot;</strong></li>
                <li>Search for <strong>&quot;LuxeWear&quot;</strong> in the app search</li>
                <li>Select LuxeWear from the results</li>
              </ol>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Connect Your LuxeWear Account</h3>
              <p className="mb-4">Authenticate with LuxeWear:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Click <strong>&quot;Connect a new account&quot;</strong></li>
                <li>Enter your LuxeWear API key (found in Dashboard → Settings → API)</li>
                <li>Click <strong>&quot;Yes, continue&quot;</strong> to authorize</li>
                <li>Test the connection to verify it works</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> You can find your API key in your LuxeWear dashboard under Settings → API Keys. Keep it secure and never share it publicly.
                </div>
              </div>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Create a Zap</h3>
              <p className="mb-4">Set up your automation workflow:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Choose a <strong>Trigger</strong> (when something happens in LuxeWear or another app)</li>
                <li>Configure the trigger settings</li>
                <li>Choose an <strong>Action</strong> (what should happen next)</li>
                <li>Map the data fields between apps</li>
                <li>Test your Zap</li>
                <li>Turn on your Zap to activate it</li>
              </ol>

              <h2 id="common-use-cases" className="scroll-mt-20 mt-10">Common Use Cases</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">New Contact → CRM</h3>
                  <p className="text-sm text-muted-foreground">Automatically create contacts in your CRM when new leads are captured in LuxeWear</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Conversation → Slack</h3>
                  <p className="text-sm text-muted-foreground">Send notifications to Slack when important conversations occur</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Email → AI Response</h3>
                  <p className="text-sm text-muted-foreground">Trigger AI agent responses when new emails arrive</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Form Submission → AI</h3>
                  <p className="text-sm text-muted-foreground">Process form submissions through your AI agent automatically</p>
                </div>
              </div>

              <h2 id="available-triggers" className="scroll-mt-20 mt-10">Available Triggers</h2>
              <p className="mb-4">LuxeWear provides the following triggers in Zapier:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>New Conversation:</strong> Triggered when a new conversation starts</li>
                <li><strong>New Contact:</strong> Triggered when a new contact is created</li>
                <li><strong>New Message:</strong> Triggered when a new message is received</li>
                <li><strong>Conversation Updated:</strong> Triggered when a conversation is updated</li>
              </ul>

              <h2 id="available-actions" className="scroll-mt-20 mt-10">Available Actions</h2>
              <p className="mb-4">LuxeWear provides the following actions in Zapier:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Send Message:</strong> Send a message through your AI agent</li>
                <li><strong>Create Contact:</strong> Create a new contact in LuxeWear</li>
                <li><strong>Update Contact:</strong> Update an existing contact</li>
                <li><strong>Get Conversation:</strong> Retrieve conversation details</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Test your Zaps thoroughly before turning them on</li>
                <li>Use filters to avoid unnecessary triggers</li>
                <li>Map data fields carefully to ensure correct information flow</li>
                <li>Monitor your Zaps regularly for errors</li>
                <li>Use Zapier&apos;s built-in error handling and retry logic</li>
                <li>Document your Zaps for team members</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with simple Zaps and gradually build more complex workflows. Zapier offers templates to get you started quickly.
                </div>
              </div>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="connection-issues" className="mt-6 mb-4">Connection Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify your API key is correct and active</li>
                <li>Check that your LuxeWear account is in good standing</li>
                <li>Try disconnecting and reconnecting your account</li>
              </ul>

              <h3 id="zap-not-triggering" className="mt-6 mb-4">Zap Not Triggering</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check that your Zap is turned on</li>
                <li>Verify trigger conditions are met</li>
                <li>Review Zap history for error messages</li>
                <li>Ensure your Zapier plan supports the required task count</li>
              </ul>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "prerequisites", label: "Prerequisites" },
              { id: "setup", label: "Setup Instructions" },
              { id: "common-use-cases", label: "Common Use Cases" },
              { id: "available-triggers", label: "Available Triggers" },
              { id: "available-actions", label: "Available Actions" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
