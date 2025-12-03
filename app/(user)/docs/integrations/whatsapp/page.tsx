'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Info, 
  MessageCircle,
  Settings,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function WhatsAppIntegrationPage() {
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">Integrations</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">WhatsApp Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect your LuxeWear AI agent to WhatsApp Business API. Enable customers to chat with your AI agent directly through WhatsApp, providing 24/7 support and engagement.
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
                The WhatsApp integration allows your AI agent to communicate with customers through WhatsApp Business API. This enables automated customer support, lead generation, and engagement directly in WhatsApp, where billions of users are already active.
              </p>

              <h2 id="prerequisites">Prerequisites</h2>
              <p>Before setting up WhatsApp integration, you need:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>A WhatsApp Business API account (via Meta Business or approved provider)</li>
                <li>WhatsApp Business API credentials (Phone Number ID, Access Token, App ID)</li>
                <li>A verified business account</li>
                <li>Webhook URL for receiving messages</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> WhatsApp Business API requires approval from Meta. You can apply through Meta Business Manager or use an approved Business Solution Provider (BSP).
                </div>
              </div>

              <h2 id="setup">Setup Instructions</h2>
              
              <h3 id="step-1">Step 1: Get WhatsApp Business API Access</h3>
              <p>Choose one of these methods:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Meta Business Manager:</strong> Apply directly through Meta</li>
                <li><strong>Business Solution Provider:</strong> Use an approved BSP like Twilio, MessageBird, or 360dialog</li>
                <li><strong>Cloud API:</strong> Use Meta&apos;s Cloud API (recommended for new users)</li>
              </ul>

              <h3 id="step-2">Step 2: Configure WhatsApp Business API</h3>
              <p>In your WhatsApp Business API dashboard:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Create a new app or use an existing one</li>
                <li>Note your Phone Number ID</li>
                <li>Generate a permanent Access Token</li>
                <li>Set up a webhook URL (we&apos;ll provide this in the next step)</li>
                <li>Subscribe to message events</li>
              </ol>

              <h3 id="step-3">Step 3: Configure in LuxeWear</h3>
              <p>In your LuxeWear dashboard:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to <strong>Integrations → WhatsApp</strong></li>
                <li>Click <strong>Connect WhatsApp</strong></li>
                <li>Enter your credentials:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>Phone Number ID</li>
                    <li>Access Token</li>
                    <li>App ID (if using Cloud API)</li>
                    <li>App Secret (if using Cloud API)</li>
                  </ul>
                </li>
                <li>Copy the webhook URL provided</li>
                <li>Save your configuration</li>
              </ol>

              <h3 id="step-4">Step 4: Configure Webhook in Meta</h3>
              <p>In your Meta Business Manager or WhatsApp API dashboard:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to Webhook configuration</li>
                <li>Paste the webhook URL from LuxeWear</li>
                <li>Set verification token (provided by LuxeWear)</li>
                <li>Subscribe to <code>messages</code> event</li>
                <li>Save and verify the webhook</li>
              </ol>

              <h3 id="step-5">Step 5: Test the Integration</h3>
              <p>Test your integration:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Send a test message to your WhatsApp Business number</li>
                <li>Verify the message is received in LuxeWear</li>
                <li>Check that your AI agent responds</li>
                <li>Test various message types (text, images, etc.)</li>
                <li>Verify message delivery status</li>
              </ol>

              <h2 id="features">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Text Messages</h3>
                  <p className="text-sm text-muted-foreground">Send and receive text messages with full AI agent capabilities</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Media Support</h3>
                  <p className="text-sm text-muted-foreground">Handle images, documents, and other media types</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Rich Messages</h3>
                  <p className="text-sm text-muted-foreground">Send buttons, lists, and interactive messages</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Contact Sync</h3>
                  <p className="text-sm text-muted-foreground">Automatically sync WhatsApp contacts with your contact database</p>
                </div>
              </div>

              <h2 id="message-templates">Message Templates</h2>
              <p>WhatsApp requires message templates for outbound messages (messages you initiate):</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Templates must be approved by Meta before use</li>
                <li>Use templates for notifications, updates, and marketing</li>
                <li>Free-form messages are allowed within 24-hour customer service window</li>
                <li>Create templates in Meta Business Manager</li>
                <li>Use template variables for personalization</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Create message templates for common scenarios like order confirmations, shipping updates, and appointment reminders. This allows you to send proactive messages to customers.
                </div>
              </div>

              <h2 id="configuration">Configuration Options</h2>
              
              <h3 id="auto-reply">Auto-Reply Settings</h3>
              <p>Configure automatic responses:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Enable/disable auto-replies</li>
                <li>Set greeting message for new conversations</li>
                <li>Configure away messages</li>
                <li>Set business hours</li>
              </ul>

              <h3 id="routing">Message Routing</h3>
              <p>Control how messages are handled:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Route to specific agents based on keywords</li>
                <li>Set up escalation rules</li>
                <li>Configure fallback responses</li>
                <li>Handle multiple conversations</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Respond quickly to maintain 24-hour messaging window</li>
                <li>Use clear, concise messages (WhatsApp is mobile-first)</li>
                <li>Personalize messages with customer names</li>
                <li>Use media (images, documents) when helpful</li>
                <li>Set up proper message templates for common scenarios</li>
                <li>Monitor message delivery and read receipts</li>
                <li>Comply with WhatsApp Business Policy</li>
                <li>Respect opt-out requests immediately</li>
              </ul>

              <h2 id="troubleshooting">Troubleshooting</h2>
              
              <h3 id="messages-not-received">Messages Not Received</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Verify webhook is properly configured and verified</li>
                <li>Check webhook logs in Meta dashboard</li>
                <li>Ensure webhook URL is accessible (HTTPS required)</li>
                <li>Verify event subscriptions are enabled</li>
              </ul>

              <h3 id="messages-not-sent">Messages Not Sent</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Check API credentials are correct</li>
                <li>Verify phone number is verified</li>
                <li>Ensure message templates are approved (for outbound)</li>
                <li>Check rate limits and quotas</li>
                <li>Review error logs in LuxeWear dashboard</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/integrations/slack" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Slack Integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">Integrate with Slack workspace</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/integrations/telegram" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Telegram Integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">Connect to Telegram</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "prerequisites", label: "Prerequisites" },
              { id: "setup", label: "Setup Instructions" },
              { id: "features", label: "Features" },
              { id: "message-templates", label: "Message Templates" },
              { id: "configuration", label: "Configuration Options" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

