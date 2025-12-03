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
  Info,
  Lightbulb
} from 'lucide-react';

export default function MakeIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Make Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect LuxeWear with Make (formerly Integromat) to create powerful automation scenarios. Build complex workflows with visual automation tools.
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
                Make (formerly Integromat) is a visual automation platform that allows you to connect LuxeWear with hundreds of apps and services. Create complex automation scenarios with a visual, no-code interface that gives you more control than traditional automation tools.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up Make integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Make account (free or paid plan)</li>
                <li>A LuxeWear account with an active AI agent</li>
                <li>Access to the apps you want to connect</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Find LuxeWear in Make</h3>
              <p className="mb-4">Locate the LuxeWear module in Make:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Log in to your <a href="https://make.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Make account</a></li>
                <li>Click <strong>&quot;Create a new scenario&quot;</strong></li>
                <li>Click the <strong>&quot;+&quot;</strong> button to add a module</li>
                <li>Search for <strong>&quot;LuxeWear&quot;</strong></li>
                <li>Select LuxeWear from the results</li>
              </ol>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Connect Your LuxeWear Account</h3>
              <p className="mb-4">Authenticate with LuxeWear:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Click <strong>&quot;Add a new connection&quot;</strong></li>
                <li>Enter your LuxeWear API key (found in Dashboard → Settings → API)</li>
                <li>Click <strong>&quot;Save&quot;</strong> to authorize</li>
                <li>Test the connection</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> Your API key can be found in your LuxeWear dashboard under Settings → API Keys. Keep it secure.
                </div>
              </div>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Create a Scenario</h3>
              <p className="mb-4">Build your automation workflow:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Add a <strong>Trigger</strong> module (LuxeWear or another app)</li>
                <li>Configure the trigger settings</li>
                <li>Add <strong>Action</strong> modules to process the data</li>
                <li>Use <strong>Filters</strong> to control when scenarios run</li>
                <li>Add <strong>Routers</strong> for conditional logic</li>
                <li>Map data between modules</li>
                <li>Test your scenario</li>
                <li>Activate the scenario</li>
              </ol>

              <h2 id="features" className="scroll-mt-20 mt-10">Key Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Visual Builder</h3>
                  <p className="text-sm text-muted-foreground">Build complex workflows with a visual, drag-and-drop interface</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Advanced Logic</h3>
                  <p className="text-sm text-muted-foreground">Use routers, filters, and aggregators for complex automation</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Data Transformation</h3>
                  <p className="text-sm text-muted-foreground">Transform and manipulate data between modules</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Error Handling</h3>
                  <p className="text-sm text-muted-foreground">Built-in error handling and retry mechanisms</p>
                </div>
              </div>

              <h2 id="available-modules" className="scroll-mt-20 mt-10">Available Modules</h2>
              <p className="mb-4">LuxeWear provides the following modules in Make:</p>
              
              <h3 id="trigger-modules" className="mt-6 mb-4">Trigger Modules</h3>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Watch Conversations:</strong> Triggers when new conversations are created</li>
                <li><strong>Watch Messages:</strong> Triggers when new messages are received</li>
                <li><strong>Watch Contacts:</strong> Triggers when new contacts are created</li>
              </ul>

              <h3 id="action-modules" className="mt-6 mb-4">Action Modules</h3>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Send Message:</strong> Send a message through your AI agent</li>
                <li><strong>Create Contact:</strong> Create a new contact</li>
                <li><strong>Update Contact:</strong> Update an existing contact</li>
                <li><strong>Get Conversation:</strong> Retrieve conversation details</li>
                <li><strong>Get Contact:</strong> Retrieve contact information</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Use filters to prevent unnecessary scenario executions</li>
                <li>Test scenarios thoroughly before activating</li>
                <li>Use routers for conditional logic instead of multiple scenarios</li>
                <li>Monitor scenario execution history for errors</li>
                <li>Use data stores for temporary data storage</li>
                <li>Optimize scenarios to reduce execution time and costs</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Make&apos;s visual interface makes it easy to see data flow. Use the data mapper to transform data between modules effectively.
                </div>
              </div>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="connection-issues" className="mt-6 mb-4">Connection Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify your API key is correct</li>
                <li>Check your LuxeWear account status</li>
                <li>Try recreating the connection</li>
              </ul>

              <h3 id="scenario-errors" className="mt-6 mb-4">Scenario Errors</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check execution history for detailed error messages</li>
                <li>Verify data mapping between modules</li>
                <li>Ensure all required fields are provided</li>
                <li>Check module settings and filters</li>
              </ul>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "prerequisites", label: "Prerequisites" },
              { id: "setup", label: "Setup Instructions" },
              { id: "features", label: "Key Features" },
              { id: "available-modules", label: "Available Modules" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
