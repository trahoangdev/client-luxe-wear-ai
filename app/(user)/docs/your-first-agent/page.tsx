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
  CheckCircle2, 
  Lightbulb, 
  AlertCircle,
  BarChart3,
  Zap,
  MapPin,
  Code,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function YourFirstAgentPage() {
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
            <header>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Quick Start</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Build Your First AI Agent</h1>
                  <div className="items-center shrink-0 justify-end ml-auto hidden sm:flex">
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
              </div>
              <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                Create, train, and deploy your first AI Agent in under 5 minutes. Follow this step-by-step guide to get your intelligent assistant live on your website.
              </p>
              <div className="items-center shrink-0 mt-3 flex sm:hidden">
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
            </header>

            {/* Content */}
            <DocsContent>
              <p>
                In just a few minutes, you’ll have a fully functional AI Agent answering questions about your business and engaging with your website visitors. Let’s get started!
              </p>

              <h2 id="prerequisites">Prerequisites</h2>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-zinc-50/50 dark:bg-zinc-500/10">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  You&apos;ll need an active LuxeWear account to follow this guide. <Link className="underline hover:text-foreground" href="/auth/register">Sign up here</Link> if you haven&apos;t already.
                </div>
              </div>

              <h2 id="overview">Overview</h2>
              <p>Here’s what we’ll accomplish in this guide:</p>
              <ol className="ml-4 mt-4 space-y-4">
                <li>
                  <div className="font-semibold">Create & Train Your Agent</div>
                  <div>Set up a new AI Agent and train it using your website or documents</div>
                </li>
                <li>
                  <div className="font-semibold">Test & Optimize</div>
                  <div>Use the Playground to test responses and fine-tune performance using the Compare feature</div>
                </li>
                <li>
                  <div className="font-semibold">Deploy to your Website</div>
                  <div>Add your AI Agent to your website with a simple embed code</div>
                </li>
              </ol>

              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Estimated time:</strong> 5 minutes from start to finish
                </div>
              </div>

              <h2 id="step-1">Step 1: Create &amp; Train Your AI Agent</h2>
              
              <h3 id="dashboard">Navigate to Your Dashboard</h3>
              <p>After signing into your LuxeWear account, go to your main dashboard. Click the <strong>&quot;New AI Agent&quot;</strong> button to get started.</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Dashboard screenshot placeholder</p>
                </div>
              </div>

              <h3 id="training">Choose Your Training Data</h3>
              <p>Your AI Agent needs information to learn from. You can train it using various data sources:</p>
              
              {/* Tabs */}
              <div className="mt-4 border-b">
                <div className="flex gap-6 text-sm overflow-x-auto">
                  <div className="border-b-2 border-foreground pb-2 font-semibold whitespace-nowrap">Files</div>
                  <div className="text-muted-foreground pb-2 hover:text-foreground cursor-pointer whitespace-nowrap">Raw Text</div>
                  <div className="text-muted-foreground pb-2 hover:text-foreground cursor-pointer whitespace-nowrap">Website</div>
                  <div className="text-muted-foreground pb-2 hover:text-foreground cursor-pointer whitespace-nowrap">Q&amp;A</div>
                  <div className="text-muted-foreground pb-2 hover:text-foreground cursor-pointer whitespace-nowrap">Notion</div>
                </div>
              </div>
              
              <p className="mt-4"><strong>Upload your documents</strong></p>
              <p>Train your agent on your documents. <strong>Best for:</strong> Business documents, manuals, FAQs, product information, etc.</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">File upload interface screenshot</p>
                </div>
              </div>

              <h3 id="review-train">Review &amp; Start Training</h3>
              <p>Click <strong>&quot;Create Agent&quot;</strong> to begin the training process.</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Create Agent interface screenshot</p>
                </div>
              </div>

              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">Training typically takes 2-5 minutes depending on the amount of data. You can proceed to the next step while training completes.</div>
              </div>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-zinc-50/50 dark:bg-zinc-500/10">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm"><strong>Character Limits:</strong> Different plans have different character limits for training data. Check your plan if you hit any limits.</div>
              </div>

              <h2 id="step-2">Step 2: Test &amp; Optimize Your AI Agent</h2>
              
              <h3 id="playground">Access the Playground</h3>
              <p>
                Once training begins, you&apos;ll automatically be taken to the <Link className="underline hover:text-foreground" href="/dashboard/chat"><strong>Playground</strong></Link> - your testing environment where you can chat with your AI Agent and fine-tune it before making it live.
              </p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Playground interface screenshot</p>
                </div>
              </div>

              <h3 id="evaluate-quality">Evaluate Response Quality</h3>
              <p>As you test, look for:</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Accuracy</strong> - Are responses factually correct?
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Relevance</strong> - Does it answer what was asked?
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Completeness</strong> - Are responses comprehensive but concise?
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Tone</strong> - Does it match your brand&apos;s voice?
                  </div>
                </li>
              </ul>

              <h3 id="fine-tune">Fine-tune Settings</h3>
              <p>Adjust the following settings to optimize your agent&apos;s performance:</p>
              <ul className="mt-4 space-y-2 ml-4">
                <li><strong>Temperature:</strong> Control creativity vs consistency (0 = more consistent, 1 = more creative)</li>
                <li><strong>System Prompt:</strong> Define your agent&apos;s personality and behavior</li>
                <li><strong>Instructions:</strong> Add specific guidelines for how your agent should respond</li>
              </ul>

              <h3 id="models">Test responses with different models</h3>
              <ol className="ml-4 mt-4 space-y-4">
                <li>
                  <div className="font-semibold">Test with different models</div>
                  <div>Ask the same questions to different models and compare:</div>
                  <ul className="mt-2 ml-4 space-y-1 list-disc">
                    <li>Response quality and accuracy</li>
                    <li>Response time and speed</li>
                    <li>Tone and personality</li>
                    <li>Handling of edge cases</li>
                  </ul>
                  <div className="mt-3 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                    <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Model selection interface screenshot</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="font-semibold">Make Your Decision</div>
                  <div>Based on the comparison, select the model that best fits your specific use case and brand voice.</div>
                </li>
              </ol>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">For detailed model comparisons and advanced testing strategies, check out our comprehensive model comparison guide.</div>
              </div>

              <h2 id="step-3">Step 3: Deploy to Your Website</h2>
              
              <h3 id="deploy">Navigate to the Deploy Section</h3>
              <p>
                Once you&apos;re satisfied with your AI Agent&apos;s responses, navigate to the <strong>Deploy</strong> tab and toggle the switch to make it public.
              </p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Deploy section screenshot</p>
                </div>
              </div>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-zinc-50/50 dark:bg-zinc-500/10">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm"><strong>Private vs Public:</strong> Private agents are only accessible to workspace members. Public agents can be embedded on websites and accessed by anyone with the link.</div>
              </div>

              <h3 id="deployment-method">Choose Your Deployment Method</h3>
              <p>LuxeWear offers various deployment methods including chat widgets, help pages, and integrations with platforms like WhatsApp and WordPress.</p>
              <p className="mt-2">In this guide, we&apos;ll use the <strong>Chat widget</strong> option as it&apos;s most common. Click on <strong>Manage</strong> on chat widget then select <strong>Embed</strong>.</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Deployment methods screenshot</p>
                </div>
              </div>

              <h3 id="embed">Get Your Embed Code</h3>
              <p>Copy the provided JavaScript code snippet:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4 overflow-x-auto">
                <pre className="text-xs">
                  <code>{`<script>
  (function(){
    window.luxeWear=window.luxeWear||function(){
      (luxeWear.q=luxeWear.q||[]).push(arguments)
    };
    luxeWear.l=+new Date;
    var s=document.createElement('script');
    s.async=true;
    s.src='https://your-domain.com/embed.min.js';
    var x=document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s,x);
  })();
</script>`}</code>
                </pre>
              </div>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <div><strong>For fast loading:</strong> Place the script just before the closing <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag to ensure your page content loads first, then the chat widget appears.</div>
                  <div><strong>For immediate availability:</strong> Place the script in the <code className="bg-muted px-1 rounded">&lt;head&gt;</code> section to load the chat widget as early as possible, though this may slightly delay your page&apos;s initial render.</div>
                </div>
              </div>

              <h3 id="add-code">Add Code to Your Website</h3>
              <ol className="ml-4 mt-4 space-y-4">
                <li>
                  <div className="font-semibold">Locate Your Site&apos;s HTML</div>
                  <div>Find where you can add JavaScript code to your website. This is usually in the <code className="bg-muted px-1 rounded">&lt;head&gt;</code> section or before the closing <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag.</div>
                </li>
                <li>
                  <div className="font-semibold">Paste the Code</div>
                  <div>Copy and paste the embed script into your website&apos;s HTML or CMS custom HTML area (e.g., WordPress custom HTML widget).</div>
                </li>
                <li>
                  <div className="font-semibold">Save and Publish</div>
                  <div>Save your changes and publish your website updates.</div>
                </li>
              </ol>

              <h3 id="verify">Verify Installation</h3>
              <p>Visit your website and look for the chat bubble. Click it to test the integration!</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Live chat widget on website screenshot</p>
                </div>
              </div>
              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm"><strong>Success!</strong> Your AI Agent is now live and ready to help your website visitors.</div>
              </div>

              <h3 id="customize">Customize Appearance (Optional)</h3>
              <p>Want to match your brand? You can customize the chat widget&apos;s appearance including colors, theme (light/dark), profile picture, and chat icon in the Deploy settings.</p>
              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Customization options screenshot</p>
                </div>
              </div>

              <h2 id="congrats" className="flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Congratulations!
              </h2>
              <p>You&apos;ve successfully created, trained, tested, and deployed your first AI Agent! Here&apos;s what you&apos;ve accomplished:</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Created an intelligent AI Agent trained on your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tested and validated response quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deployed it live on your website</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Made it accessible to your visitors 24/7</span>
                </li>
              </ul>

              <h3 id="whats-next">What&apos;s Next?</h3>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <Link className="block rounded-2xl border p-5 hover:border-foreground transition-colors group" href="/dashboard/analytics">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-base font-semibold group-hover:text-primary transition-colors">Monitor Performance</div>
                      <p className="mt-1 text-sm text-muted-foreground">Track conversations and optimize your AI Agent&apos;s performance</p>
                    </div>
                  </div>
                </Link>
                <Link className="block rounded-2xl border p-5 hover:border-foreground transition-colors group" href="/dashboard">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-base font-semibold group-hover:text-primary transition-colors">Advanced Features</div>
                      <p className="mt-1 text-sm text-muted-foreground">Add actions like lead capture, appointment booking, and more</p>
                    </div>
                  </div>
                </Link>
                <Link className="block rounded-2xl border p-5 hover:border-foreground transition-colors group" href="/pricing">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-base font-semibold group-hover:text-primary transition-colors">Best Practices</div>
                      <p className="mt-1 text-sm text-muted-foreground">Learn proven strategies to maximize your AI Agent&apos;s effectiveness</p>
                    </div>
                  </div>
                </Link>
                <Link className="block rounded-2xl border p-5 hover:border-foreground transition-colors group" href="/docs">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-base font-semibold group-hover:text-primary transition-colors">API Integration</div>
                      <p className="mt-1 text-sm text-muted-foreground">Build custom integrations with our powerful API</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "prerequisites", label: "Prerequisites" },
              { id: "overview", label: "Overview" },
              { id: "step-1", label: "Step 1: Create & Train Your AI Agent" },
              { id: "dashboard", label: "Navigate to Your Dashboard" },
              { id: "training", label: "Choose Your Training Data" },
              { id: "review-train", label: "Review & Start Training" },
              { id: "step-2", label: "Step 2: Test & Optimize Your AI Agent" },
              { id: "playground", label: "Access the Playground" },
              { id: "evaluate-quality", label: "Evaluate Response Quality" },
              { id: "fine-tune", label: "Fine-tune Settings" },
              { id: "models", label: "Test responses with different models" },
              { id: "step-3", label: "Step 3: Deploy to Your Website" },
              { id: "deploy", label: "Navigate to the Deploy Section" },
              { id: "deployment-method", label: "Choose Your Deployment Method" },
              { id: "embed", label: "Get Your Embed Code" },
              { id: "add-code", label: "Add Code to Your Website" },
              { id: "verify", label: "Verify Installation" },
              { id: "customize", label: "Customize Appearance (Optional)" },
              { id: "congrats", label: "Congratulations!" },
              { id: "whats-next", label: "What's Next?" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
