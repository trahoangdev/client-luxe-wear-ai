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
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ManageContactsPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Manage Contacts</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  View, edit, organize, and manage your contacts. Search, filter, export, and maintain your contact database effectively.
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
                The Contacts management interface allows you to view, search, edit, and organize all contacts collected through your AI agent interactions. Manage your contact database efficiently with powerful search, filter, and export capabilities.
              </p>

              <h2 id="viewing-contacts">Viewing Contacts</h2>
              <p>To access your contacts:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Navigate to your Dashboard</li>
                <li>Click on &quot;Contacts&quot; in the navigation menu</li>
                <li>View the contacts list with key information displayed</li>
              </ol>

              <h2 id="contact-list">Contact List</h2>
              <p>The contact list displays:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Name:</strong> Contact&apos;s full name</li>
                <li><strong>Email:</strong> Email address</li>
                <li><strong>Phone:</strong> Phone number (if available)</li>
                <li><strong>Company:</strong> Company name (if provided)</li>
                <li><strong>Tags:</strong> Applied tags and labels</li>
                <li><strong>Last Contact:</strong> Date of last interaction</li>
                <li><strong>Status:</strong> Active, inactive, or lead status</li>
              </ul>

              <h2 id="searching-contacts">Searching Contacts</h2>
              <p>Search for contacts using:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Name:</strong> Search by full name or partial name</li>
                <li><strong>Email:</strong> Search by email address</li>
                <li><strong>Phone:</strong> Search by phone number</li>
                <li><strong>Company:</strong> Search by company name</li>
                <li><strong>Tags:</strong> Search by tags or labels</li>
                <li><strong>Notes:</strong> Search within contact notes</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Use advanced search operators like quotes for exact phrases, or combine multiple search terms for precise results.
                </div>
              </div>

              <h2 id="filtering-contacts">Filtering Contacts</h2>
              <p>Filter contacts by:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Tags:</strong> Filter by specific tags</li>
                <li><strong>Status:</strong> Active, inactive, new, qualified, etc.</li>
                <li><strong>Date Range:</strong> Created date or last contact date</li>
                <li><strong>Source:</strong> Where the contact came from</li>
                <li><strong>Segment:</strong> Filter by contact segment</li>
                <li><strong>Custom Fields:</strong> Filter by custom field values</li>
              </ul>

              <h2 id="editing-contacts">Editing Contacts</h2>
              <p>To edit a contact:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Click on a contact to open the detail view</li>
                <li>Click the &quot;Edit&quot; button</li>
                <li>Update any fields (name, email, phone, company, etc.)</li>
                <li>Add or remove tags</li>
                <li>Update notes</li>
                <li>Save your changes</li>
              </ol>

              <h3 id="contact-fields">Contact Fields</h3>
              <p>You can edit the following fields:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Basic Information:</strong> Name, email, phone, company</li>
                <li><strong>Custom Fields:</strong> Any custom fields you&apos;ve defined</li>
                <li><strong>Tags:</strong> Add or remove tags</li>
                <li><strong>Notes:</strong> Add internal notes about the contact</li>
                <li><strong>Status:</strong> Update contact status</li>
              </ul>

              <h2 id="deleting-contacts">Deleting Contacts</h2>
              <p>To delete a contact:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Select the contact(s) you want to delete</li>
                <li>Click the &quot;Delete&quot; button</li>
                <li>Confirm the deletion</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Warning:</strong> Deleting a contact is permanent and cannot be undone. The contact&apos;s conversation history will also be removed.
                </div>
              </div>

              <h2 id="bulk-operations">Bulk Operations</h2>
              <p>Perform actions on multiple contacts at once:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Bulk Tag:</strong> Add or remove tags from multiple contacts</li>
                <li><strong>Bulk Status Update:</strong> Change status for multiple contacts</li>
                <li><strong>Bulk Delete:</strong> Delete multiple contacts</li>
                <li><strong>Bulk Export:</strong> Export selected contacts</li>
                <li><strong>Bulk Assign:</strong> Assign contacts to team members</li>
              </ul>

              <h2 id="exporting-contacts">Exporting Contacts</h2>
              <p>Export contacts for use in other tools:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Select contacts to export (or export all)</li>
                <li>Click &quot;Export&quot; button</li>
                <li>Choose export format (CSV, Excel, JSON)</li>
                <li>Select which fields to include</li>
                <li>Download the exported file</li>
              </ol>

              <h2 id="importing-contacts">Importing Contacts</h2>
              <p>Import contacts from external sources:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Prepare your contact file (CSV or Excel format)</li>
                <li>Click &quot;Import Contacts&quot;</li>
                <li>Upload your file</li>
                <li>Map columns to contact fields</li>
                <li>Review and confirm import</li>
                <li>Contacts will be added to your database</li>
              </ol>

              <h2 id="contact-details">Contact Details View</h2>
              <p>When viewing a contact&apos;s details, you can see:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Contact Information:</strong> All contact details</li>
                <li><strong>Conversation History:</strong> All interactions with your AI agent</li>
                <li><strong>Activity Timeline:</strong> Chronological activity log</li>
                <li><strong>Tags and Segments:</strong> Applied tags and segment memberships</li>
                <li><strong>Notes:</strong> Internal notes and comments</li>
                <li><strong>Custom Fields:</strong> Any custom field values</li>
                <li><strong>Metadata:</strong> Source, creation date, last updated</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Regularly review and update contact information</li>
                <li>Use tags consistently for easy organization</li>
                <li>Add notes after important interactions</li>
                <li>Keep contact data clean and up-to-date</li>
                <li>Use segments to organize contacts logically</li>
                <li>Export backups regularly</li>
                <li>Respect privacy and data protection regulations</li>
                <li>Remove duplicate contacts</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/contacts/overview" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Contacts Overview</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn about the contacts system</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/contacts/segments" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Filter className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
              { id: "viewing-contacts", label: "Viewing Contacts" },
              { id: "contact-list", label: "Contact List" },
              { id: "searching-contacts", label: "Searching Contacts" },
              { id: "filtering-contacts", label: "Filtering Contacts" },
              { id: "editing-contacts", label: "Editing Contacts" },
              { id: "contact-fields", label: "Contact Fields" },
              { id: "deleting-contacts", label: "Deleting Contacts" },
              { id: "bulk-operations", label: "Bulk Operations" },
              { id: "exporting-contacts", label: "Exporting Contacts" },
              { id: "importing-contacts", label: "Importing Contacts" },
              { id: "contact-details", label: "Contact Details View" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

