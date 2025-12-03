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
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ActivityPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">Analytics & Monitoring</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Activity</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  View detailed activity logs, conversation history, and user interactions. Monitor all activity in real-time and search through historical data.
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
                The Activity page provides a comprehensive log of all interactions with your AI agent. View conversations, search through history, filter by various criteria, and export data for analysis.
              </p>

              <h2 id="viewing-activity">Viewing Activity</h2>
              <p>Access the Activity page:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Navigate to your Dashboard</li>
                <li>Click on &quot;Analytics&quot; in the navigation</li>
                <li>Select &quot;Activity&quot; from the submenu</li>
              </ol>

              <h2 id="activity-list">Activity List</h2>
              <p>The activity list shows:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Timestamp:</strong> When the activity occurred</li>
                <li><strong>User:</strong> User identifier or session ID</li>
                <li><strong>Type:</strong> Type of activity (conversation, action, error, etc.)</li>
                <li><strong>Status:</strong> Success, error, or pending</li>
                <li><strong>Duration:</strong> How long the activity took</li>
                <li><strong>Preview:</strong> Brief preview of the activity</li>
              </ul>

              <h2 id="viewing-conversations">Viewing Conversations</h2>
              <p>Click on any conversation to view details:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Full conversation transcript</li>
                <li>User messages and agent responses</li>
                <li>Actions triggered during the conversation</li>
                <li>Response times for each message</li>
                <li>Sources used for responses</li>
                <li>User feedback and ratings</li>
              </ul>

              <h2 id="search">Search</h2>
              <p>Search through activity logs:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Text Search:</strong> Search for keywords in messages or responses</li>
                <li><strong>User Search:</strong> Find all activity for a specific user</li>
                <li><strong>Date Range:</strong> Filter by specific date ranges</li>
                <li><strong>Status Filter:</strong> Filter by success, error, or pending</li>
                <li><strong>Type Filter:</strong> Filter by activity type</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Use search operators like quotes for exact phrases, or combine multiple filters for precise results.
                </div>
              </div>

              <h2 id="filters">Filters</h2>
              <p>Apply filters to narrow down results:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Date Range:</strong> Today, last 7 days, last 30 days, or custom range</li>
                <li><strong>Agent:</strong> Filter by specific agent (if you have multiple)</li>
                <li><strong>Status:</strong> Success, error, or pending</li>
                <li><strong>Type:</strong> Conversation, action, error, etc.</li>
                <li><strong>User:</strong> Filter by specific user or session</li>
                <li><strong>Source:</strong> Filter by deployment source (website, API, etc.)</li>
              </ul>

              <h2 id="export">Export Data</h2>
              <p>Export activity data for analysis:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>CSV Export:</strong> Download as CSV for spreadsheet analysis</li>
                <li><strong>JSON Export:</strong> Download as JSON for programmatic analysis</li>
                <li><strong>PDF Report:</strong> Generate formatted PDF reports</li>
                <li><strong>Date Range:</strong> Export specific date ranges</li>
                <li><strong>Filtered Export:</strong> Export only filtered results</li>
              </ul>

              <h2 id="real-time-updates">Real-time Updates</h2>
              <p>The Activity page updates in real-time:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>New conversations appear automatically</li>
                <li>Status updates refresh in real-time</li>
                <li>Live activity counter shows current activity</li>
                <li>Notifications for important events</li>
              </ul>

              <h2 id="conversation-details">Conversation Details</h2>
              <p>When viewing a conversation, you can see:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Full Transcript:</strong> Complete conversation history</li>
                <li><strong>Timestamps:</strong> Exact time for each message</li>
                <li><strong>Response Sources:</strong> Which knowledge base sources were used</li>
                <li><strong>Actions Executed:</strong> Any actions that were triggered</li>
                <li><strong>Performance Metrics:</strong> Response times and token usage</li>
                <li><strong>User Feedback:</strong> Ratings and comments from users</li>
                <li><strong>Metadata:</strong> User agent, IP, location, etc.</li>
              </ul>

              <h2 id="troubleshooting">Troubleshooting</h2>
              <p>Use Activity logs to troubleshoot issues:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Find conversations with errors</li>
                <li>Identify patterns in failed requests</li>
                <li>Review user complaints or issues</li>
                <li>Check action execution logs</li>
                <li>Analyze slow response times</li>
                <li>Investigate unexpected behavior</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Regularly review activity logs for issues</li>
                <li>Set up alerts for error patterns</li>
                <li>Export data regularly for backup</li>
                <li>Use filters to focus on specific areas</li>
                <li>Review user feedback to identify improvements</li>
                <li>Monitor response times for performance issues</li>
                <li>Keep activity logs for compliance and auditing</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4">
                <Link href="/docs/analytics/overview" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Analytics Overview</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn about other analytics features and metrics</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "viewing-activity", label: "Viewing Activity" },
              { id: "activity-list", label: "Activity List" },
              { id: "viewing-conversations", label: "Viewing Conversations" },
              { id: "search", label: "Search" },
              { id: "filters", label: "Filters" },
              { id: "export", label: "Export Data" },
              { id: "real-time-updates", label: "Real-time Updates" },
              { id: "conversation-details", label: "Conversation Details" },
              { id: "troubleshooting", label: "Troubleshooting" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

