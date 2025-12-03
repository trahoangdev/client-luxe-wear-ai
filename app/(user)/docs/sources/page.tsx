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
  FileText,
  Upload,
  Globe,
  Database,
  Link as LinkIcon,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function SourcesPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sources</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Manage your knowledge base by adding sources. Sources are the foundation of your AI agent&apos;s knowledge and determine how well it can answer questions.
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
                Sources are the data that train your AI agent. You can add various types of sources including documents, websites, raw text, and Q&amp;A pairs. Each source is processed, chunked, and stored in your knowledge base for retrieval during conversations.
              </p>

              <h2 id="source-types">Source Types</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Files</h3>
                      <p className="text-sm text-muted-foreground mb-2">Upload PDF, DOCX, TXT, or MD files</p>
                      <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Manuals, FAQs, product documentation</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Website</h3>
                      <p className="text-sm text-muted-foreground mb-2">Crawl websites or submit sitemaps</p>
                      <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Public documentation, blog posts</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Raw Text</h3>
                      <p className="text-sm text-muted-foreground mb-2">Paste text directly into the editor</p>
                      <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Quick additions, custom content</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <LinkIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Q&amp;A</h3>
                      <p className="text-sm text-muted-foreground mb-2">Add question-answer pairs manually</p>
                      <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Specific answers, curated knowledge</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="adding-sources">Adding Sources</h2>
              
              <h3 id="upload-files">Upload Files</h3>
              <p>To upload files:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Navigate to <Link className="underline hover:text-foreground" href="/dashboard/knowledge">Sources</Link> in your dashboard</li>
                <li>Click &quot;Upload Files&quot; or drag and drop files</li>
                <li>Select PDF, DOCX, TXT, or MD files (max 10MB per file)</li>
                <li>Files are automatically processed and chunked</li>
                <li>Each chunk is vectorized and stored in your knowledge base</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Supported Formats:</strong> PDF, DOCX, TXT, MD. For PDFs, ensure text is selectable (not scanned images).
                </div>
              </div>

              <h3 id="add-website">Add Website</h3>
              <p>To crawl a website:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Enter the website URL or sitemap URL</li>
                <li>Configure crawl settings (include/exclude paths)</li>
                <li>Click &quot;Fetch Links&quot; to preview pages</li>
                <li>Review and select pages to include</li>
                <li>Click &quot;Create Agent&quot; to start processing</li>
              </ol>

              <h3 id="add-text">Add Raw Text</h3>
              <p>For quick additions or custom content:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Select &quot;Raw Text&quot; tab</li>
                <li>Enter a title for your text snippet</li>
                <li>Paste or type your content</li>
                <li>Click &quot;Add text snippet&quot; to save</li>
              </ol>

              <h2 id="managing-sources">Managing Sources</h2>
              <p>Once sources are added, you can:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>View:</strong> See all sources in a searchable list</li>
                <li><strong>Edit:</strong> Update source content or metadata</li>
                <li><strong>Delete:</strong> Remove sources that are no longer needed</li>
                <li><strong>Search:</strong> Use semantic or full-text search to find specific content</li>
                <li><strong>Filter:</strong> Filter sources by agent, type, or date</li>
              </ul>

              <h2 id="processing">How Sources Are Processed</h2>
              <p>When you add a source, LuxeWear automatically:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li><strong>Extracts Text:</strong> Extracts readable text from files or websites</li>
                <li><strong>Chunks Content:</strong> Splits text into smaller chunks (default: 1000 characters)</li>
                <li><strong>Generates Embeddings:</strong> Creates vector embeddings for each chunk</li>
                <li><strong>Stores Vectors:</strong> Saves embeddings in Pinecone vector database</li>
                <li><strong>Indexes Metadata:</strong> Stores metadata in Supabase for fast retrieval</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Processing typically takes 2-5 minutes depending on the amount of content. You can continue working while processing completes.
                </div>
              </div>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Keep source content well-structured and readable</li>
                <li>Use descriptive titles for easy identification</li>
                <li>Organize sources by topic or category using metadata</li>
                <li>Regularly update sources to keep knowledge current</li>
                <li>Remove outdated or irrelevant content</li>
                <li>Use Q&amp;A format for specific, curated answers</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Character Limits:</strong> Different plans have different character limits. Check your plan details to ensure you stay within limits.
                </div>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "source-types", label: "Source Types" },
              { id: "adding-sources", label: "Adding Sources" },
              { id: "upload-files", label: "Upload Files" },
              { id: "add-website", label: "Add Website" },
              { id: "add-text", label: "Add Raw Text" },
              { id: "managing-sources", label: "Managing Sources" },
              { id: "processing", label: "How Sources Are Processed" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

