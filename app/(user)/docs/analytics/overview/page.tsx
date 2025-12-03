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
  Users,
  MessageSquare,
  Clock,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsOverviewPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Analytics</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Track and analyze your AI agent&apos;s performance. Monitor conversations, user engagement, response quality, and key metrics to continuously improve your agent.
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
                Analytics provides comprehensive insights into how your AI agent is performing. Track key metrics, understand user behavior, identify areas for improvement, and measure the impact of your AI agent on your business.
              </p>

              <h2 id="key-metrics">Key Metrics</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Total Conversations</h3>
                      <p className="text-sm text-muted-foreground">Number of conversations your agent has handled</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Active Users</h3>
                      <p className="text-sm text-muted-foreground">Unique users who interacted with your agent</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Average Response Time</h3>
                      <p className="text-sm text-muted-foreground">Time taken for your agent to respond</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Satisfaction Rate</h3>
                      <p className="text-sm text-muted-foreground">User satisfaction with agent responses</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="dashboard-features">Dashboard Features</h2>
              
              <h3 id="conversation-analytics">Conversation Analytics</h3>
              <p>Track conversation metrics over time:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Daily, weekly, and monthly conversation volumes</li>
                <li>Peak usage times and patterns</li>
                <li>Conversation length and duration</li>
                <li>Message count per conversation</li>
                <li>Completion rates</li>
              </ul>

              <h3 id="user-analytics">User Analytics</h3>
              <p>Understand your users:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>New vs. returning users</li>
                <li>User engagement patterns</li>
                <li>Geographic distribution</li>
                <li>Device and browser statistics</li>
                <li>User journey analysis</li>
              </ul>

              <h3 id="performance-metrics">Performance Metrics</h3>
              <p>Monitor agent performance:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Response time trends</li>
                <li>Error rates and types</li>
                <li>Action execution success rates</li>
                <li>Token usage and costs</li>
                <li>Model performance comparison</li>
              </ul>

              <h3 id="quality-metrics">Quality Metrics</h3>
              <p>Assess response quality:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>User feedback and ratings</li>
                <li>Response relevance scores</li>
                <li>Accuracy metrics</li>
                <li>Helpful vs. unhelpful responses</li>
                <li>Common issues and complaints</li>
              </ul>

              <h2 id="reports">Reports</h2>
              <p>Generate detailed reports:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Daily Reports:</strong> Summary of daily activity and performance</li>
                <li><strong>Weekly Reports:</strong> Weekly trends and insights</li>
                <li><strong>Monthly Reports:</strong> Comprehensive monthly analysis</li>
                <li><strong>Custom Reports:</strong> Create reports for specific date ranges or metrics</li>
                <li><strong>Export:</strong> Download reports as CSV or PDF</li>
              </ul>

              <h2 id="filters-and-segments">Filters and Segments</h2>
              <p>Analyze specific subsets of data:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Filter by date range</li>
                <li>Filter by agent or deployment</li>
                <li>Segment by user type or source</li>
                <li>Filter by conversation outcome</li>
                <li>Compare different time periods</li>
              </ul>

              <h2 id="real-time-monitoring">Real-time Monitoring</h2>
              <p>Monitor your agent in real-time:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Live conversation feed</li>
                <li>Active user count</li>
                <li>Current response times</li>
                <li>Error alerts and notifications</li>
                <li>System health status</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Set up alerts for key metrics to be notified of significant changes or issues. This helps you respond quickly to problems.
                </div>
              </div>

              <h2 id="using-analytics">Using Analytics to Improve</h2>
              <p>Use analytics data to:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li><strong>Identify Issues:</strong> Find common problems or areas where users struggle</li>
                <li><strong>Optimize Responses:</strong> Improve responses based on user feedback</li>
                <li><strong>Enhance Sources:</strong> Add or update knowledge base content based on gaps</li>
                <li><strong>Adjust Settings:</strong> Fine-tune agent settings for better performance</li>
                <li><strong>Measure ROI:</strong> Track business impact and value delivered</li>
              </ol>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Review analytics regularly (daily or weekly)</li>
                <li>Set up key performance indicators (KPIs)</li>
                <li>Compare metrics over time to identify trends</li>
                <li>Focus on actionable insights, not just numbers</li>
                <li>Share reports with your team</li>
                <li>Use A/B testing to measure improvements</li>
                <li>Monitor for anomalies or unusual patterns</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4">
                <Link href="/docs/analytics/activity" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Activity</h3>
                      <p className="text-sm text-muted-foreground mt-1">View detailed activity logs and conversation history</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "key-metrics", label: "Key Metrics" },
              { id: "dashboard-features", label: "Dashboard Features" },
              { id: "reports", label: "Reports" },
              { id: "filters-and-segments", label: "Filters and Segments" },
              { id: "real-time-monitoring", label: "Real-time Monitoring" },
              { id: "using-analytics", label: "Using Analytics to Improve" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

