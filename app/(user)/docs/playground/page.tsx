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
  MessageSquare,
  Settings,
  Zap,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function PlaygroundPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Playground</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Test and interact with your AI agents in real-time. The Playground provides a safe environment to experiment with different prompts, models, and settings before deploying to production.
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
                The Playground is your interactive testing environment where you can chat with your AI agents, test different configurations, and evaluate response quality. It&apos;s the perfect place to fine-tune your agents before making them live.
              </p>

              <h2 id="features">Key Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Real-time Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with your agents and see responses instantly</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Model Selection</h3>
                      <p className="text-sm text-muted-foreground">Test different AI models and compare results</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Parameter Tuning</h3>
                      <p className="text-sm text-muted-foreground">Adjust temperature, max tokens, and other settings</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Response Analysis</h3>
                      <p className="text-sm text-muted-foreground">Evaluate response quality and performance metrics</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="getting-started">Getting Started</h2>
              <p>To access the Playground:</p>
              <ol className="ml-4 mt-4 space-y-3">
                <li>
                  <div className="font-semibold">Navigate to Dashboard</div>
                  <div>Go to your <Link className="underline hover:text-foreground" href="/dashboard/chat">Dashboard</Link> and select an agent</div>
                </li>
                <li>
                  <div className="font-semibold">Open Playground</div>
                  <div>Click on the &quot;Playground&quot; tab or navigate directly to the chat interface</div>
                </li>
                <li>
                  <div className="font-semibold">Start Testing</div>
                  <div>Begin chatting with your agent and experiment with different prompts</div>
                </li>
              </ol>

              <h2 id="configuration">Configuration Options</h2>
              <p>In the Playground, you can adjust various settings to optimize your agent&apos;s performance:</p>
              
              <h3 id="model-settings">Model Settings</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Model Selection:</strong> Choose from available AI models (GPT-5, Gemini, Claude, etc.)</li>
                <li><strong>Temperature:</strong> Control creativity (0 = deterministic, 1 = creative)</li>
                <li><strong>Max Tokens:</strong> Set the maximum length of responses</li>
                <li><strong>Top P:</strong> Control diversity via nucleus sampling</li>
              </ul>

              <h3 id="agent-settings">Agent Settings</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>System Prompt:</strong> Define your agent&apos;s personality and behavior</li>
                <li><strong>Instructions:</strong> Add specific guidelines for responses</li>
                <li><strong>Context Window:</strong> Manage how much conversation history to include</li>
                <li><strong>RAG Settings:</strong> Configure knowledge base retrieval parameters</li>
              </ul>

              <h2 id="testing-tips">Testing Tips</h2>
              <div className="my-4 space-y-3">
                <div className="px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                  <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong>Test Edge Cases:</strong> Try unusual or complex queries to see how your agent handles them
                  </div>
                </div>
                <div className="px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                  <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong>Compare Models:</strong> Test the same prompt with different models to find the best fit
                  </div>
                </div>
                <div className="px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                  <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong>Iterate Quickly:</strong> Make small changes and test immediately to see the impact
                  </div>
                </div>
              </div>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Test with realistic user queries that match your use case</li>
                <li>Document successful configurations for future reference</li>
                <li>Use the compare feature to evaluate multiple responses side-by-side</li>
                <li>Save your favorite prompts and settings for quick access</li>
                <li>Review response quality metrics to identify areas for improvement</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> Changes made in the Playground are saved to your agent configuration. Make sure to test thoroughly before deploying to production.
                </div>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "features", label: "Key Features" },
              { id: "getting-started", label: "Getting Started" },
              { id: "configuration", label: "Configuration Options" },
              { id: "model-settings", label: "Model Settings" },
              { id: "agent-settings", label: "Agent Settings" },
              { id: "testing-tips", label: "Testing Tips" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

