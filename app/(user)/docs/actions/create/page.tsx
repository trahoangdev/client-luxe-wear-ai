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
  Zap,
  Code,
  Webhook,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CreateActionsPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">Actions</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Create Actions</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Learn how to create and configure actions for your AI agent. Follow this step-by-step guide to add functionality beyond simple Q&amp;A.
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
              <h2 id="prerequisites">Prerequisites</h2>
              <p>Before creating an action, make sure you have:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>An active AI agent created in your dashboard</li>
                <li>Access to the agent&apos;s Settings page</li>
                <li>API credentials or endpoints for external services (if using webhooks)</li>
                <li>Basic understanding of HTTP requests (for webhook actions)</li>
              </ul>

              <h2 id="step-1">Step 1: Navigate to Actions</h2>
              <p>To access the Actions section:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to your Dashboard</li>
                <li>Select the agent you want to add actions to</li>
                <li>Click on &quot;Settings&quot; in the navigation</li>
                <li>Find and click on the &quot;Actions&quot; tab</li>
              </ol>

              <h2 id="step-2">Step 2: Choose Action Type</h2>
              <p>You&apos;ll see two main options:</p>
              
              <div className="my-4 space-y-4">
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Webhook className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Webhook Action</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Best for: Simple API integrations, triggering external services, sending data to webhooks
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Use when:</strong> You need to call an external API endpoint or trigger a webhook URL
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Custom Action</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Best for: Complex logic, data transformations, multiple API calls, conditional workflows
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Use when:</strong> You need custom JavaScript code to perform complex operations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 id="step-3">Step 3: Configure Action Details</h2>
              
              <h3 id="basic-info">Basic Information</h3>
              <p>Fill in the following required fields:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Name:</strong> A descriptive name for your action (e.g., &quot;Send Slack Notification&quot;)</li>
                <li><strong>Description:</strong> Explain what the action does - this helps the AI understand when to use it</li>
                <li><strong>Category:</strong> Optional category for organization</li>
              </ul>

              <h3 id="action-parameters">Action Parameters</h3>
              <p>Define the inputs your action expects:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Parameter Name:</strong> The variable name (e.g., &quot;email&quot;, &quot;message&quot;)</li>
                <li><strong>Type:</strong> Data type (string, number, boolean, object, array)</li>
                <li><strong>Required:</strong> Whether the parameter is mandatory</li>
                <li><strong>Description:</strong> What the parameter represents</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Be descriptive with parameter names and descriptions. The AI uses this information to understand when and how to call your action.
                </div>
              </div>

              <h2 id="step-4-webhook">Step 4a: Configure Webhook Action</h2>
              <p>If you chose Webhook Action, configure:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>URL:</strong> The endpoint URL to call</li>
                <li><strong>Method:</strong> HTTP method (GET, POST, PUT, DELETE, PATCH)</li>
                <li><strong>Headers:</strong> Custom headers (e.g., Authorization, Content-Type)</li>
                <li><strong>Body:</strong> Request body template using parameter placeholders</li>
              </ul>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`{
  "email": "{{email}}",
  "message": "{{message}}",
  "timestamp": "{{timestamp}}"
}`}</code></pre>
              </div>

              <h2 id="step-4-custom">Step 4b: Write Custom Action Code</h2>
              <p>If you chose Custom Action, write your JavaScript function:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use the provided function template</li>
                <li>Access parameters via the <code>params</code> object</li>
                <li>Return a result object with <code>success</code> and <code>data</code> properties</li>
                <li>Handle errors appropriately</li>
              </ul>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  try {
    // Your custom logic here
    const result = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: params.email,
        message: params.message
      })
    });
    
    const data = await result.json();
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`}</code></pre>
              </div>

              <h2 id="step-5">Step 5: Test Your Action</h2>
              <p>Before deploying, test your action:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Click &quot;Test Action&quot; button</li>
                <li>Provide sample parameter values</li>
                <li>Review the response and logs</li>
                <li>Fix any errors or issues</li>
                <li>Test again until it works correctly</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Important:</strong> Always test actions thoroughly before enabling them in production. Test with various inputs to ensure robustness.
                </div>
              </div>

              <h2 id="step-6">Step 6: Enable and Deploy</h2>
              <p>Once tested:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Toggle the action to &quot;Enabled&quot;</li>
                <li>Save your changes</li>
                <li>Test in the Playground with natural language</li>
                <li>Monitor action usage in Analytics</li>
              </ol>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use clear, descriptive names and descriptions</li>
                <li>Validate input parameters in your code</li>
                <li>Handle errors gracefully with meaningful messages</li>
                <li>Use environment variables for sensitive data (API keys, secrets)</li>
                <li>Document your actions for team members</li>
                <li>Test with edge cases and error scenarios</li>
                <li>Monitor action performance and usage</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/actions/webhook" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Webhook className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Webhook Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Deep dive into webhook configuration</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/actions/custom" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Custom Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Advanced JavaScript action development</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "prerequisites", label: "Prerequisites" },
              { id: "step-1", label: "Step 1: Navigate to Actions" },
              { id: "step-2", label: "Step 2: Choose Action Type" },
              { id: "step-3", label: "Step 3: Configure Action Details" },
              { id: "step-4-webhook", label: "Step 4a: Configure Webhook" },
              { id: "step-4-custom", label: "Step 4b: Write Custom Code" },
              { id: "step-5", label: "Step 5: Test Your Action" },
              { id: "step-6", label: "Step 6: Enable and Deploy" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

