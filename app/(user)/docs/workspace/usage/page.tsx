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
  BarChart3,
  TrendingUp,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceUsagePage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Usage</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Monitor your workspace usage, track resource consumption, and understand your plan limits. Stay informed about your usage to avoid unexpected limits.
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
                The Usage page provides detailed insights into how your workspace is using LuxeWear resources. Monitor conversations, API calls, storage, and other metrics to understand your consumption and plan limits.
              </p>

              <h2 id="usage-metrics">Usage Metrics</h2>
              <p>Track the following usage metrics:</p>
              
              <h3 id="conversations">Conversations</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Total conversations this month</li>
                <li>Conversations per day/week</li>
                <li>Conversation limit vs. usage</li>
                <li>Projected usage for the month</li>
              </ul>

              <h3 id="api-calls">API Calls</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Total API requests</li>
                <li>API calls by endpoint</li>
                <li>Rate limit usage</li>
                <li>Error rate</li>
              </ul>

              <h3 id="storage">Storage</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Knowledge base storage used</li>
                <li>File storage usage</li>
                <li>Storage limit vs. usage</li>
                <li>Storage by agent</li>
              </ul>

              <h3 id="tokens">Token Usage</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Total tokens consumed</li>
                <li>Input vs. output tokens</li>
                <li>Token usage by model</li>
                <li>Cost estimation</li>
              </ul>

              <h2 id="viewing-usage">Viewing Usage</h2>
              <p>To view your workspace usage:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Navigate to Workspace → Usage</li>
                <li>View the usage dashboard</li>
                <li>Select a time period (this month, last month, custom)</li>
                <li>Filter by agent or resource type</li>
                <li>Export usage data if needed</li>
              </ol>

              <h2 id="usage-limits">Understanding Limits</h2>
              <p>Your plan includes various limits:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Conversation Limits:</strong> Maximum conversations per month</li>
                <li><strong>Storage Limits:</strong> Maximum knowledge base storage</li>
                <li><strong>Agent Limits:</strong> Maximum number of agents</li>
                <li><strong>API Rate Limits:</strong> Requests per minute/hour</li>
                <li><strong>Team Member Limits:</strong> Maximum workspace members</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Important:</strong> When you approach limits, you&apos;ll receive notifications. Upgrade your plan or optimize usage to avoid service interruptions.
                </div>
              </div>

              <h2 id="usage-alerts">Usage Alerts</h2>
              <p>Set up alerts to stay informed:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Email alerts when approaching limits</li>
                <li>Notifications at 50%, 75%, 90%, and 100% usage</li>
                <li>Daily or weekly usage summaries</li>
                <li>Custom alert thresholds</li>
              </ul>

              <h2 id="optimizing-usage">Optimizing Usage</h2>
              <p>Ways to optimize your usage:</p>
              
              <h3 id="conversation-optimization">Conversation Optimization</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Remove inactive or test agents</li>
                <li>Optimize agent responses to reduce token usage</li>
                <li>Use caching for frequently asked questions</li>
                <li>Archive old conversations</li>
              </ul>

              <h3 id="storage-optimization">Storage Optimization</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Remove unused sources</li>
                <li>Compress large files</li>
                <li>Archive old knowledge base content</li>
                <li>Remove duplicate content</li>
              </ul>

              <h3 id="api-optimization">API Optimization</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Implement request caching</li>
                <li>Batch API calls when possible</li>
                <li>Use webhooks instead of polling</li>
                <li>Optimize request payloads</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Regularly review usage patterns to identify optimization opportunities. Small changes can significantly reduce usage.
                </div>
              </div>

              <h2 id="billing">Billing and Usage</h2>
              <p>Usage affects your billing:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Base plan includes certain limits</li>
                <li>Overage charges may apply beyond limits</li>
                <li>Usage resets at the start of each billing cycle</li>
                <li>View detailed billing in Settings</li>
              </ul>

              <h2 id="exporting-usage">Exporting Usage Data</h2>
              <p>Export usage data for analysis:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Select the time period</li>
                <li>Choose metrics to export</li>
                <li>Click &quot;Export&quot;</li>
                <li>Download as CSV or JSON</li>
              </ol>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Monitor usage regularly</li>
                <li>Set up usage alerts</li>
                <li>Review usage trends monthly</li>
                <li>Optimize before hitting limits</li>
                <li>Plan for growth and scale</li>
                <li>Archive old data regularly</li>
                <li>Remove unused resources</li>
                <li>Understand your plan limits</li>
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
                <Link href="/docs/workspace/settings" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
              { id: "usage-metrics", label: "Usage Metrics" },
              { id: "viewing-usage", label: "Viewing Usage" },
              { id: "usage-limits", label: "Understanding Limits" },
              { id: "usage-alerts", label: "Usage Alerts" },
              { id: "optimizing-usage", label: "Optimizing Usage" },
              { id: "billing", label: "Billing and Usage" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

