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
  Brain,
  Zap,
  DollarSign,
  Clock,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ModelsComparisonPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Models Comparison</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Compare different AI models available in LuxeWear. Understand the strengths, weaknesses, and best use cases for each model to choose the right one for your needs.
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
                LuxeWear supports multiple AI models, each with different strengths. Understanding the differences helps you choose the best model for your specific use case, balancing performance, cost, and speed.
              </p>

              <h2 id="model-factors">Factors to Consider</h2>
              <p>When choosing a model, consider:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Performance:</strong> Response quality and accuracy</li>
                <li><strong>Speed:</strong> Response time and latency</li>
                <li><strong>Cost:</strong> Token pricing and usage costs</li>
                <li><strong>Context Window:</strong> Maximum input/output length</li>
                <li><strong>Use Case:</strong> Best suited for specific tasks</li>
              </ul>

              <h2 id="available-models">Available Models</h2>
              
              <h3 id="gpt-5">GPT-5 (Recommended for Most Use Cases)</h3>
              <div className="my-4 rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Best For:</strong> General purpose, high-quality responses
                  </div>
                  <div>
                    <strong>Speed:</strong> Fast
                  </div>
                  <div>
                    <strong>Cost:</strong> Medium
                  </div>
                  <div>
                    <strong>Context:</strong> 128K tokens
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  GPT-5 provides excellent balance of quality, speed, and cost. Ideal for most customer support, Q&amp;A, and general conversation use cases.
                </p>
              </div>

              <h3 id="gpt-4">GPT-4 Turbo</h3>
              <div className="my-4 rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Best For:</strong> Complex reasoning, detailed analysis
                  </div>
                  <div>
                    <strong>Speed:</strong> Medium
                  </div>
                  <div>
                    <strong>Cost:</strong> Higher
                  </div>
                  <div>
                    <strong>Context:</strong> 128K tokens
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  GPT-4 Turbo excels at complex tasks requiring deep reasoning and analysis. Use for technical support, research, and complex problem-solving.
                </p>
              </div>

              <h3 id="claude">Claude 3.5 Sonnet</h3>
              <div className="my-4 rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Best For:</strong> Long documents, creative writing
                  </div>
                  <div>
                    <strong>Speed:</strong> Medium
                  </div>
                  <div>
                    <strong>Cost:</strong> Medium
                  </div>
                  <div>
                    <strong>Context:</strong> 200K tokens
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Claude is excellent for handling long context, creative tasks, and nuanced conversations. Great for content generation and document analysis.
                </p>
              </div>

              <h3 id="gemini">Gemini Pro</h3>
              <div className="my-4 rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Best For:</strong> Multimodal tasks, cost-effective
                  </div>
                  <div>
                    <strong>Speed:</strong> Fast
                  </div>
                  <div>
                    <strong>Cost:</strong> Lower
                  </div>
                  <div>
                    <strong>Context:</strong> 32K tokens
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Gemini Pro offers good performance at a lower cost. Suitable for high-volume use cases where cost efficiency is important.
                </p>
              </div>

              <h2 id="comparison-table">Quick Comparison</h2>
              <div className="my-4 overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Model</th>
                      <th className="border p-2 text-center">Speed</th>
                      <th className="border p-2 text-center">Cost</th>
                      <th className="border p-2 text-center">Quality</th>
                      <th className="border p-2 text-center">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">GPT-5</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">128K</td>
                    </tr>
                    <tr>
                      <td className="border p-2">GPT-4 Turbo</td>
                      <td className="border p-2 text-center">⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">128K</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Claude 3.5</td>
                      <td className="border p-2 text-center">⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">200K</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Gemini Pro</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                      <td className="border p-2 text-center">32K</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 id="use-case-recommendations">Use Case Recommendations</h2>
              
              <h3 id="customer-support">Customer Support</h3>
              <p><strong>Recommended:</strong> GPT-5 or Gemini Pro</p>
              <p>Fast responses and good quality at reasonable cost. GPT-5 for premium support, Gemini Pro for high-volume scenarios.</p>

              <h3 id="technical-support">Technical Support</h3>
              <p><strong>Recommended:</strong> GPT-4 Turbo or Claude 3.5</p>
              <p>Better reasoning capabilities for complex technical questions and troubleshooting.</p>

              <h3 id="content-generation">Content Generation</h3>
              <p><strong>Recommended:</strong> Claude 3.5 or GPT-4 Turbo</p>
              <p>Superior creative writing and content quality. Claude excels at longer-form content.</p>

              <h3 id="high-volume">High-Volume Use Cases</h3>
              <p><strong>Recommended:</strong> Gemini Pro or GPT-5</p>
              <p>Balance of cost and performance for scenarios with many conversations.</p>

              <h3 id="long-context">Long Context Needs</h3>
              <p><strong>Recommended:</strong> Claude 3.5</p>
              <p>Best for processing long documents or maintaining very long conversation history.</p>

              <h2 id="testing-models">Testing Models</h2>
              <p>To find the best model for your use case:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Test multiple models with your actual use cases</li>
                <li>Compare response quality and relevance</li>
                <li>Measure response times</li>
                <li>Calculate costs based on your usage</li>
                <li>Consider user feedback</li>
                <li>Choose the model that best balances your priorities</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with GPT-5 for most use cases, then test other models if you need specific capabilities or cost optimization.
                </div>
              </div>

              <h2 id="switching-models">Switching Models</h2>
              <p>You can switch models at any time:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to your agent settings</li>
                <li>Select the model dropdown</li>
                <li>Choose a different model</li>
                <li>Save changes</li>
                <li>Test in Playground</li>
              </ol>

              <h2 id="cost-optimization">Cost Optimization</h2>
              <p>To optimize costs:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use GPT-5 or Gemini Pro for high-volume scenarios</li>
                <li>Reserve GPT-4 Turbo for complex queries only</li>
                <li>Optimize prompts to reduce token usage</li>
                <li>Use caching for common questions</li>
                <li>Monitor usage and costs regularly</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4">
                <Link href="/docs/performance/response-quality" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Response Quality</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn how to measure and improve response quality</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "model-factors", label: "Factors to Consider" },
              { id: "available-models", label: "Available Models" },
              { id: "gpt-5", label: "GPT-5" },
              { id: "gpt-4", label: "GPT-4 Turbo" },
              { id: "claude", label: "Claude 3.5" },
              { id: "gemini", label: "Gemini Pro" },
              { id: "comparison-table", label: "Quick Comparison" },
              { id: "use-case-recommendations", label: "Use Case Recommendations" },
              { id: "testing-models", label: "Testing Models" },
              { id: "switching-models", label: "Switching Models" },
              { id: "cost-optimization", label: "Cost Optimization" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

