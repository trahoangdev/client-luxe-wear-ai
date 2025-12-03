'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Info, 
  Webhook,
  Code,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function WebhookActionsPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Webhook Actions</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Webhook actions allow your AI agent to trigger HTTP requests to external APIs and services. Perfect for integrating with third-party tools and your own backend systems.
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
              <h2 id="what-are-webhooks">What Are Webhook Actions?</h2>
              <p>
                Webhook actions are HTTP requests that your AI agent can trigger based on user interactions. They enable your agent to:
              </p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Send data to external APIs</li>
                <li>Trigger workflows in other services</li>
                <li>Create records in databases</li>
                <li>Send notifications via messaging platforms</li>
                <li>Integrate with CRM systems</li>
                <li>Process payments</li>
              </ul>

              <h2 id="configuration">Configuration</h2>
              
              <h3 id="endpoint-url">Endpoint URL</h3>
              <p>The URL where the webhook will be sent:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>https://api.example.com/webhook</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Must be a valid HTTPS URL (HTTP is not supported for security reasons).</p>

              <h3 id="http-method">HTTP Method</h3>
              <p>Choose the appropriate HTTP method:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>GET:</strong> Retrieve data (parameters sent as query string)</li>
                <li><strong>POST:</strong> Create or send data (parameters in request body)</li>
                <li><strong>PUT:</strong> Update existing resources</li>
                <li><strong>PATCH:</strong> Partial updates</li>
                <li><strong>DELETE:</strong> Remove resources</li>
              </ul>

              <h3 id="headers">Headers</h3>
              <p>Add custom headers for authentication or content type:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`Authorization: Bearer {{api_key}}
Content-Type: application/json
X-Custom-Header: {{custom_value}}`}</code></pre>
              </div>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Security:</strong> Use environment variables for sensitive headers like API keys. Never hardcode credentials in your action configuration.
                </div>
              </div>

              <h3 id="request-body">Request Body</h3>
              <p>For POST, PUT, and PATCH requests, define the request body template:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`{
  "user_email": "{{email}}",
  "message": "{{message}}",
  "timestamp": "{{timestamp}}",
  "metadata": {
    "source": "luxewear_ai",
    "agent_id": "{{agent_id}}"
  }
}`}</code></pre>
              </div>

              <h2 id="parameter-substitution">Parameter Substitution</h2>
              <p>Use double curly braces to insert parameter values:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><code>{`{{parameter_name}}`}</code> - Replaces with the parameter value</li>
                <li><code>{`{{timestamp}}`}</code> - Current Unix timestamp (automatic)</li>
                <li><code>{`{{agent_id}}`}</code> - Your agent ID (automatic)</li>
                <li><code>{`{{user_id}}`}</code> - Current user ID if available (automatic)</li>
              </ul>

              <h2 id="examples">Examples</h2>
              
              <h3 id="slack-notification">Example 1: Slack Notification</h3>
              <p>Send a message to a Slack channel:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Method: POST
Headers:
  Content-Type: application/json

Body:
{
  "text": "New lead: {{name}} ({{email}})",
  "channel": "#sales",
  "username": "LuxeWear AI"
}`}</code></pre>
              </div>

              <h3 id="crm-integration">Example 2: CRM Integration</h3>
              <p>Create a contact in your CRM:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`URL: https://api.crm.com/v1/contacts
Method: POST
Headers:
  Authorization: Bearer {{api_key}}
  Content-Type: application/json

Body:
{
  "name": "{{name}}",
  "email": "{{email}}",
  "phone": "{{phone}}",
  "source": "AI Agent",
  "notes": "{{message}}"
}`}</code></pre>
              </div>

              <h3 id="email-service">Example 3: Email Service</h3>
              <p>Send an email via an email API:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`URL: https://api.emailservice.com/send
Method: POST
Headers:
  Authorization: Bearer {{api_key}}
  Content-Type: application/json

Body:
{
  "to": "{{recipient_email}}",
  "subject": "{{subject}}",
  "body": "{{email_body}}",
  "from": "noreply@luxewear.com"
}`}</code></pre>
              </div>

              <h2 id="error-handling">Error Handling</h2>
              <p>Webhook actions handle errors automatically:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Network Errors:</strong> Retried up to 3 times with exponential backoff</li>
                <li><strong>HTTP Errors (4xx/5xx):</strong> Logged and returned to the agent</li>
                <li><strong>Timeout:</strong> Requests timeout after 30 seconds</li>
                <li><strong>Invalid Response:</strong> Non-JSON responses are handled gracefully</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Best Practice:</strong> Design your webhook endpoints to return meaningful error messages. This helps with debugging and provides better user feedback.
                </div>
              </div>

              <h2 id="testing">Testing Webhook Actions</h2>
              <p>Use the built-in test feature:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Click &quot;Test Action&quot; in the action configuration</li>
                <li>Enter sample parameter values</li>
                <li>Review the request that will be sent</li>
                <li>Check the response status and body</li>
                <li>Verify logs for any errors</li>
              </ol>

              <h2 id="security">Security Considerations</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Always use HTTPS endpoints</li>
                <li>Store API keys in environment variables, not in action config</li>
                <li>Validate webhook signatures when receiving data</li>
                <li>Use rate limiting on your endpoints</li>
                <li>Implement proper authentication (OAuth, API keys, etc.)</li>
                <li>Sanitize user inputs before sending to webhooks</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/actions/create" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Create Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Step-by-step guide to creating actions</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/actions/custom" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Custom Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">For more complex integrations</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "what-are-webhooks", label: "What Are Webhook Actions?" },
              { id: "configuration", label: "Configuration" },
              { id: "parameter-substitution", label: "Parameter Substitution" },
              { id: "examples", label: "Examples" },
              { id: "error-handling", label: "Error Handling" },
              { id: "testing", label: "Testing" },
              { id: "security", label: "Security Considerations" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

