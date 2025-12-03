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
  Zap,
  Webhook,
  Code,
  Link as LinkIcon,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ActionsOverviewPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">AI Agent Management</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Actions Overview</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Actions allow your AI agent to perform tasks beyond just answering questions. Connect to external APIs, trigger workflows, and automate business processes.
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
              <h2 id="what-are-actions">What Are Actions?</h2>
              <p>
                Actions are functions that your AI agent can call to perform specific tasks. Instead of just providing information, actions enable your agent to:
              </p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Send emails or notifications</li>
                <li>Create records in databases</li>
                <li>Trigger webhooks and API calls</li>
                <li>Collect user information</li>
                <li>Schedule appointments</li>
                <li>Process payments</li>
                <li>And much more...</li>
              </ul>

              <h2 id="action-types">Types of Actions</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Webhook className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Webhook Actions</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Trigger HTTP requests to external APIs. Perfect for integrating with third-party services like Slack, Stripe, or your own backend.
                      </p>
                      <Link href="/docs/actions/webhook" className="text-sm text-primary hover:underline">
                        Learn more about Webhook Actions →
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Custom Actions</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Write custom JavaScript functions to perform complex logic, data transformations, or integrate with any service.
                      </p>
                      <Link href="/docs/actions/custom" className="text-sm text-primary hover:underline">
                        Learn more about Custom Actions →
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <LinkIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Pre-built Actions</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use ready-made actions for common services like Slack, Stripe, Calendly, and lead collection. No coding required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="how-actions-work">How Actions Work</h2>
              <p>When a user interacts with your AI agent:</p>
              <ol className="ml-4 mt-2 space-y-3">
                <li>
                  <div className="font-semibold">User Query</div>
                  <div>The user asks a question or makes a request</div>
                </li>
                <li>
                  <div className="font-semibold">Intent Detection</div>
                  <div>The AI agent analyzes the query and determines if an action is needed</div>
                </li>
                <li>
                  <div className="font-semibold">Action Execution</div>
                  <div>If an action matches, the agent calls the appropriate action function</div>
                </li>
                <li>
                  <div className="font-semibold">Response</div>
                  <div>The agent responds to the user with the action result</div>
                </li>
              </ol>

              <h2 id="use-cases">Common Use Cases</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Lead Collection</h3>
                  <p className="text-sm text-muted-foreground">Capture contact information and add to CRM automatically</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Appointment Booking</h3>
                  <p className="text-sm text-muted-foreground">Schedule meetings and send calendar invites</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">E-commerce</h3>
                  <p className="text-sm text-muted-foreground">Process orders, check inventory, track shipments</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack, email, or other channels</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Data Retrieval</h3>
                  <p className="text-sm text-muted-foreground">Fetch information from databases or APIs</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Workflow Automation</h3>
                  <p className="text-sm text-muted-foreground">Trigger multi-step business processes</p>
                </div>
              </div>

              <h2 id="getting-started">Getting Started</h2>
              <p>To create your first action:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Navigate to your agent&apos;s Settings</li>
                <li>Go to the &quot;Actions&quot; section</li>
                <li>Click &quot;Create Action&quot;</li>
                <li>Choose the action type (Webhook or Custom)</li>
                <li>Configure the action parameters</li>
                <li>Test the action in the Playground</li>
                <li>Deploy to production</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with simple webhook actions to understand the flow, then move to more complex custom actions as needed.
                </div>
              </div>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/actions/create" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Create Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Step-by-step guide to creating your first action</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/actions/webhook" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Webhook className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Webhook Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn how to integrate with external APIs</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/actions/custom" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Custom Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Build advanced actions with JavaScript</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "what-are-actions", label: "What Are Actions?" },
              { id: "action-types", label: "Types of Actions" },
              { id: "how-actions-work", label: "How Actions Work" },
              { id: "use-cases", label: "Common Use Cases" },
              { id: "getting-started", label: "Getting Started" },
              { id: "next-steps", label: "Next Steps" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

