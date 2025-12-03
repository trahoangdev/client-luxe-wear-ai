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
  Target,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ResponseQualityPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">AI Performance & Quality</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Response Quality</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Learn how to measure, monitor, and improve the quality of your AI agent&apos;s responses. Ensure your agent provides accurate, relevant, and helpful answers to users.
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
                Response quality is crucial for a successful AI agent. High-quality responses lead to better user satisfaction, increased engagement, and improved business outcomes. This guide covers how to measure and improve response quality.
              </p>

              <h2 id="quality-metrics">Quality Metrics</h2>
              <p>Measure response quality using these key metrics:</p>
              
              <h3 id="accuracy">Accuracy</h3>
              <p>How correct and factual the responses are:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Factual correctness</li>
                <li>Information accuracy</li>
                <li>Error rate</li>
                <li>Hallucination detection</li>
              </ul>

              <h3 id="relevance">Relevance</h3>
              <p>How well responses match user queries:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Query-response alignment</li>
                <li>Topic relevance</li>
                <li>Context understanding</li>
                <li>Answer completeness</li>
              </ul>

              <h3 id="helpfulness">Helpfulness</h3>
              <p>How useful responses are to users:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>User satisfaction ratings</li>
                <li>Problem resolution rate</li>
                <li>Follow-up question rate</li>
                <li>User feedback scores</li>
              </ul>

              <h3 id="clarity">Clarity</h3>
              <p>How clear and understandable responses are:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Readability scores</li>
                <li>Language complexity</li>
                <li>Structure and formatting</li>
                <li>Conciseness</li>
              </ul>

              <h2 id="measuring-quality">Measuring Quality</h2>
              
              <h3 id="user-feedback">User Feedback</h3>
              <p>Collect feedback directly from users:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Thumbs up/down ratings</li>
                <li>Star ratings (1-5)</li>
                <li>Written feedback and comments</li>
                <li>Follow-up questions</li>
                <li>Conversation completion rates</li>
              </ul>

              <h3 id="automated-scoring">Automated Scoring</h3>
              <p>Use automated methods to assess quality:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Semantic similarity to expected answers</li>
                <li>Source citation quality</li>
                <li>Response length appropriateness</li>
                <li>Language model confidence scores</li>
                <li>A/B testing comparisons</li>
              </ul>

              <h3 id="manual-review">Manual Review</h3>
              <p>Regularly review conversations manually:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Sample conversations for review</li>
                <li>Identify patterns in poor responses</li>
                <li>Document common issues</li>
                <li>Create quality guidelines</li>
              </ul>

              <h2 id="improving-quality">Improving Response Quality</h2>
              
              <h3 id="improve-sources">Improve Knowledge Sources</h3>
              <p>Better sources lead to better responses:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Add high-quality, accurate content</li>
                <li>Remove outdated or incorrect information</li>
                <li>Organize sources by topic</li>
                <li>Use Q&amp;A format for specific answers</li>
                <li>Keep sources up-to-date</li>
              </ul>

              <h3 id="refine-instructions">Refine Agent Instructions</h3>
              <p>Clear instructions guide better responses:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Define agent personality and tone</li>
                <li>Specify response format preferences</li>
                <li>Set guidelines for handling edge cases</li>
                <li>Clarify when to say &quot;I don&apos;t know&quot;</li>
                <li>Provide examples of good responses</li>
              </ul>

              <h3 id="optimize-settings">Optimize Agent Settings</h3>
              <p>Fine-tune technical settings:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Adjust temperature for creativity vs. accuracy</li>
                <li>Set appropriate max tokens</li>
                <li>Configure top-k and top-p parameters</li>
                <li>Optimize retrieval settings</li>
                <li>Test different AI models</li>
              </ul>

              <h3 id="add-context">Add Context and Examples</h3>
              <p>Provide context to improve understanding:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Include relevant conversation history</li>
                <li>Add examples in instructions</li>
                <li>Provide domain-specific context</li>
                <li>Use suggestable links and images</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Regularly review low-rated responses to identify patterns. Common issues include outdated information, unclear instructions, or missing context.
                </div>
              </div>

              <h2 id="quality-checklist">Quality Checklist</h2>
              <p>Use this checklist to evaluate responses:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>✓ Response directly answers the question</li>
                <li>✓ Information is accurate and up-to-date</li>
                <li>✓ Response is clear and easy to understand</li>
                <li>✓ Tone matches brand voice</li>
                <li>✓ Response is appropriately detailed</li>
                <li>✓ Sources are cited when relevant</li>
                <li>✓ Response handles edge cases gracefully</li>
                <li>✓ No hallucinations or made-up information</li>
                <li>✓ Response is helpful and actionable</li>
                <li>✓ Formatting is clean and readable</li>
              </ul>

              <h2 id="monitoring">Continuous Monitoring</h2>
              <p>Monitor quality over time:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Track quality metrics in Analytics</li>
                <li>Set up alerts for quality drops</li>
                <li>Review feedback regularly</li>
                <li>Compare quality across different topics</li>
                <li>Monitor quality by user segment</li>
                <li>Track improvements after changes</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Start with high-quality, well-organized sources</li>
                <li>Write clear, specific agent instructions</li>
                <li>Test responses before deploying</li>
                <li>Collect and act on user feedback</li>
                <li>Regularly update knowledge base</li>
                <li>Monitor quality metrics continuously</li>
                <li>Iterate and improve based on data</li>
                <li>Document quality standards and guidelines</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4">
                <Link href="/docs/performance/models-comparison" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Models Comparison</h3>
                      <p className="text-sm text-muted-foreground mt-1">Compare different AI models for your use case</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "quality-metrics", label: "Quality Metrics" },
              { id: "accuracy", label: "Accuracy" },
              { id: "relevance", label: "Relevance" },
              { id: "helpfulness", label: "Helpfulness" },
              { id: "clarity", label: "Clarity" },
              { id: "measuring-quality", label: "Measuring Quality" },
              { id: "user-feedback", label: "User Feedback" },
              { id: "improving-quality", label: "Improving Response Quality" },
              { id: "quality-checklist", label: "Quality Checklist" },
              { id: "monitoring", label: "Continuous Monitoring" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

