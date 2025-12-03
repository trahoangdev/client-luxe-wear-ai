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
  Tag,
  Users,
  Plus,
  Filter,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function SegmentsPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Segments</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Organize your contacts into segments based on criteria like demographics, behavior, engagement, or custom fields. Use segments for targeted campaigns and personalized experiences.
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
                Segments allow you to group contacts based on shared characteristics, behaviors, or attributes. Use segments to organize your audience, send targeted messages, analyze specific groups, and personalize experiences.
              </p>

              <h2 id="what-are-segments">What Are Segments?</h2>
              <p>Segments are dynamic or static groups of contacts that share common criteria:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Dynamic Segments:</strong> Automatically update as contacts meet or no longer meet criteria</li>
                <li><strong>Static Segments:</strong> Manually created groups that don&apos;t change automatically</li>
                <li><strong>Smart Segments:</strong> Use complex rules and conditions</li>
              </ul>

              <h2 id="creating-segments">Creating Segments</h2>
              <p>To create a new segment:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to Contacts → Segments</li>
                <li>Click &quot;Create Segment&quot;</li>
                <li>Enter a segment name and description</li>
                <li>Define segment criteria (see below)</li>
                <li>Choose segment type (dynamic or static)</li>
                <li>Save the segment</li>
              </ol>

              <h2 id="segment-criteria">Segment Criteria</h2>
              <p>Define segments using various criteria:</p>
              
              <h3 id="demographic-criteria">Demographic Criteria</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Location:</strong> Country, state, city</li>
                <li><strong>Company:</strong> Company name, industry, size</li>
                <li><strong>Job Title:</strong> Specific job titles or roles</li>
                <li><strong>Custom Fields:</strong> Any custom field values</li>
              </ul>

              <h3 id="behavioral-criteria">Behavioral Criteria</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Engagement Level:</strong> Active, inactive, new</li>
                <li><strong>Conversation Count:</strong> Number of interactions</li>
                <li><strong>Last Contact:</strong> Date of last interaction</li>
                <li><strong>Actions Taken:</strong> Specific actions completed</li>
                <li><strong>Topics Discussed:</strong> Conversation topics</li>
              </ul>

              <h3 id="tag-criteria">Tag-Based Criteria</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Has Tag:</strong> Contacts with specific tags</li>
                <li><strong>Doesn&apos;t Have Tag:</strong> Contacts without specific tags</li>
                <li><strong>Multiple Tags:</strong> Contacts with any or all of multiple tags</li>
              </ul>

              <h3 id="date-criteria">Date-Based Criteria</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Created Date:</strong> When contact was added</li>
                <li><strong>Last Contact:</strong> Last interaction date</li>
                <li><strong>Date Ranges:</strong> Specific time periods</li>
              </ul>

              <h2 id="segment-examples">Segment Examples</h2>
              
              <h3 id="example-1">Example 1: High-Value Leads</h3>
              <p>Contacts who:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Have tag &quot;qualified lead&quot;</li>
                <li>Have had 3+ conversations</li>
                <li>Contacted in the last 30 days</li>
              </ul>

              <h3 id="example-2">Example 2: Inactive Users</h3>
              <p>Contacts who:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Last contact was more than 90 days ago</li>
                <li>Have had at least 1 conversation</li>
                <li>Don&apos;t have tag &quot;do not contact&quot;</li>
              </ul>

              <h3 id="example-3">Example 3: Enterprise Customers</h3>
              <p>Contacts who:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Company size is &quot;Enterprise&quot;</li>
                <li>Have tag &quot;customer&quot;</li>
                <li>Located in specific regions</li>
              </ul>

              <h2 id="managing-segments">Managing Segments</h2>
              
              <h3 id="editing-segments">Editing Segments</h3>
              <p>To edit a segment:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Click on the segment name</li>
                <li>Click &quot;Edit&quot;</li>
                <li>Modify criteria or settings</li>
                <li>Save changes</li>
              </ol>

              <h3 id="viewing-segment-contacts">Viewing Segment Contacts</h3>
              <p>View all contacts in a segment:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Click on the segment to view contacts</li>
                <li>See segment size and member count</li>
                <li>Export segment contacts</li>
                <li>Perform bulk actions on segment members</li>
              </ul>

              <h3 id="deleting-segments">Deleting Segments</h3>
              <p>To delete a segment:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Click on the segment</li>
                <li>Click &quot;Delete&quot;</li>
                <li>Confirm deletion</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> Deleting a segment does not delete the contacts. It only removes the segment grouping.
                </div>
              </div>

              <h2 id="using-segments">Using Segments</h2>
              <p>Segments can be used for:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Targeted Campaigns:</strong> Send messages to specific segments</li>
                <li><strong>Analytics:</strong> Analyze performance by segment</li>
                <li><strong>Personalization:</strong> Customize experiences for different segments</li>
                <li><strong>Automation:</strong> Trigger workflows based on segment membership</li>
                <li><strong>Reporting:</strong> Generate reports for specific segments</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use clear, descriptive segment names</li>
                <li>Keep segments focused and specific</li>
                <li>Use dynamic segments for frequently changing groups</li>
                <li>Review and update segments regularly</li>
                <li>Combine multiple criteria for precise targeting</li>
                <li>Document segment purposes and use cases</li>
                <li>Avoid creating too many overlapping segments</li>
                <li>Test segment criteria before using in campaigns</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with a few key segments and expand as needed. Focus on segments that provide clear business value.
                </div>
              </div>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4">
                <Link href="/docs/contacts/manage" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Manage Contacts</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn how to manage individual contacts</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "what-are-segments", label: "What Are Segments?" },
              { id: "creating-segments", label: "Creating Segments" },
              { id: "segment-criteria", label: "Segment Criteria" },
              { id: "demographic-criteria", label: "Demographic Criteria" },
              { id: "behavioral-criteria", label: "Behavioral Criteria" },
              { id: "tag-criteria", label: "Tag-Based Criteria" },
              { id: "date-criteria", label: "Date-Based Criteria" },
              { id: "segment-examples", label: "Segment Examples" },
              { id: "managing-segments", label: "Managing Segments" },
              { id: "using-segments", label: "Using Segments" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

