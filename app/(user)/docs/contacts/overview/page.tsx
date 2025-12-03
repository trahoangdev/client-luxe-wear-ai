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
  Tag,
  Mail,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ContactsOverviewPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contacts Overview</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Manage contacts collected through your AI agent interactions. Track leads, organize users, create segments, and build relationships with your audience.
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
                The Contacts system automatically captures and organizes information from users who interact with your AI agent. Use contacts to build your customer database, track leads, send follow-ups, and personalize future interactions.
              </p>

              <h2 id="how-contacts-work">How Contacts Work</h2>
              <p>Contacts are automatically created when:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Users provide their email address during conversations</li>
                <li>Users fill out lead collection forms</li>
                <li>Actions collect contact information</li>
                <li>You manually add contacts</li>
                <li>Contacts are imported from external sources</li>
              </ul>

              <h2 id="contact-information">Contact Information</h2>
              <p>Each contact can store:</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Basic Info</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Name</li>
                    <li>• Email address</li>
                    <li>• Phone number</li>
                    <li>• Company</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Additional Data</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Custom fields</li>
                    <li>• Tags and labels</li>
                    <li>• Notes</li>
                    <li>• Interaction history</li>
                  </ul>
                </div>
              </div>

              <h2 id="features">Key Features</h2>
              
              <h3 id="automatic-capture">Automatic Capture</h3>
              <p>Contacts are automatically captured when users provide information during conversations. No manual data entry required.</p>

              <h3 id="lead-tracking">Lead Tracking</h3>
              <p>Track leads from first interaction through conversion. See the full conversation history and engagement timeline for each contact.</p>

              <h3 id="segmentation">Segmentation</h3>
              <p>Organize contacts into segments based on criteria like:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Demographics (location, company size, etc.)</li>
                <li>Behavior (pages visited, actions taken)</li>
                <li>Engagement level (active, inactive, new)</li>
                <li>Custom tags and labels</li>
                <li>Conversation topics or interests</li>
              </ul>

              <h3 id="integration">Integration</h3>
              <p>Sync contacts with external systems:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Export to CSV for use in other tools</li>
                <li>Connect to CRM systems via webhooks</li>
                <li>Send to email marketing platforms</li>
                <li>Integrate with sales tools</li>
              </ul>

              <h2 id="use-cases">Use Cases</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Lead Generation</h3>
                  <p className="text-sm text-muted-foreground">Capture leads from website visitors who interact with your AI agent</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Customer Support</h3>
                  <p className="text-sm text-muted-foreground">Track support requests and maintain customer history</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Sales Pipeline</h3>
                  <p className="text-sm text-muted-foreground">Qualify leads and track them through your sales process</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Marketing</h3>
                  <p className="text-sm text-muted-foreground">Build email lists and segment audiences for campaigns</p>
                </div>
              </div>

              <h2 id="getting-started">Getting Started</h2>
              <p>To start collecting contacts:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Enable contact collection in your agent settings</li>
                <li>Configure what information to collect</li>
                <li>Set up lead collection actions (optional)</li>
                <li>View contacts in the Contacts dashboard</li>
                <li>Create segments and organize your contacts</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Make contact collection natural and valuable. Offer something in return (like a resource or follow-up) to encourage users to share their information.
                </div>
              </div>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/contacts/manage" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Manage Contacts</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn how to view, edit, and organize contacts</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/contacts/segments" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Segments</h3>
                      <p className="text-sm text-muted-foreground mt-1">Create and manage contact segments</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "how-contacts-work", label: "How Contacts Work" },
              { id: "contact-information", label: "Contact Information" },
              { id: "features", label: "Key Features" },
              { id: "automatic-capture", label: "Automatic Capture" },
              { id: "lead-tracking", label: "Lead Tracking" },
              { id: "segmentation", label: "Segmentation" },
              { id: "integration", label: "Integration" },
              { id: "use-cases", label: "Use Cases" },
              { id: "getting-started", label: "Getting Started" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

