'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  MessageCircle,
  Settings,
  Info,
  Lightbulb
} from 'lucide-react';

export default function TelegramIntegrationPage() {
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Integrations</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Telegram Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect your AI agent to Telegram. Create a Telegram bot and enable users to chat with your AI agent through Telegram.
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
              <h2 id="overview" className="scroll-mt-20">Overview</h2>
              <p className="text-base leading-7 mb-6">
                The Telegram integration allows you to connect your LuxeWear AI agent to Telegram, enabling users to interact with your AI agent directly through Telegram messages. This is perfect for customer support, community engagement, or providing instant assistance to your Telegram audience.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up the Telegram integration, you&apos;ll need:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Telegram account</li>
                <li>Access to @BotFather on Telegram</li>
                <li>A LuxeWear account with an active AI agent</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Create a Telegram Bot</h3>
              <p className="mb-4">Create your Telegram bot using BotFather:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Open Telegram and search for <code className="px-1.5 py-0.5 rounded bg-muted text-sm">@BotFather</code></li>
                <li>Start a conversation and send <code className="px-1.5 py-0.5 rounded bg-muted text-sm">/newbot</code></li>
                <li>Follow the prompts to name your bot</li>
                <li>Choose a username for your bot (must end in &quot;bot&quot;)</li>
                <li>Copy the bot token provided by BotFather</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Important:</strong> Keep your bot token secure. Never share it publicly or commit it to version control.
                </div>
              </div>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Configure in LuxeWear</h3>
              <p className="mb-4">Connect your Telegram bot to LuxeWear:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your LuxeWear Dashboard</li>
                <li>Navigate to <strong>Integrations → Telegram</strong></li>
                <li>Click <strong>&quot;Connect Telegram&quot;</strong></li>
                <li>Enter your bot token from Step 1</li>
                <li>Configure webhook settings (LuxeWear will handle this automatically)</li>
                <li>Select which AI agent to use</li>
                <li>Save your configuration</li>
              </ol>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Test the Integration</h3>
              <p className="mb-4">Verify everything works correctly:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Open Telegram and find your bot</li>
                <li>Start a conversation with your bot</li>
                <li>Send a test message</li>
                <li>Verify your AI agent responds correctly</li>
                <li>Test various message types (text, questions, etc.)</li>
              </ol>

              <h2 id="features" className="scroll-mt-20 mt-10">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Text Messages</h3>
                  <p className="text-sm text-muted-foreground">Send and receive text messages with full AI agent capabilities</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Media Support</h3>
                  <p className="text-sm text-muted-foreground">Handle images, documents, and other media types</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Group Chats</h3>
                  <p className="text-sm text-muted-foreground">Add your bot to Telegram groups for community support</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Commands</h3>
                  <p className="text-sm text-muted-foreground">Support custom bot commands for quick actions</p>
                </div>
              </div>

              <h2 id="configuration" className="scroll-mt-20 mt-10">Configuration Options</h2>
              <p className="mb-4">Customize your Telegram integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Auto-Reply:</strong> Enable automatic responses to messages</li>
                <li><strong>Greeting Message:</strong> Set a welcome message for new users</li>
                <li><strong>Response Mode:</strong> Configure how the bot responds (always, on mention, etc.)</li>
                <li><strong>Error Handling:</strong> Set up fallback responses for errors</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Set a clear bot description in BotFather to help users understand what your bot does</li>
                <li>Use commands for common actions (e.g., <code className="px-1.5 py-0.5 rounded bg-muted text-sm">/help</code>, <code className="px-1.5 py-0.5 rounded bg-muted text-sm">/start</code>)</li>
                <li>Train your AI agent with Telegram-specific context</li>
                <li>Monitor conversations to improve responses</li>
                <li>Handle errors gracefully with helpful error messages</li>
              </ul>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="bot-not-responding" className="mt-6 mb-4">Bot Not Responding</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify the bot token is correct</li>
                <li>Check that the webhook is properly configured</li>
                <li>Ensure your AI agent is active and working</li>
                <li>Check LuxeWear dashboard for error logs</li>
              </ul>

              <h3 id="webhook-issues" className="mt-6 mb-4">Webhook Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>LuxeWear automatically configures webhooks, but you can verify in BotFather</li>
                <li>Use <code className="px-1.5 py-0.5 rounded bg-muted text-sm">/getWebhookInfo</code> in BotFather to check webhook status</li>
                <li>If needed, delete and recreate the webhook in LuxeWear</li>
              </ul>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "prerequisites", label: "Prerequisites" },
              { id: "setup", label: "Setup Instructions" },
              { id: "features", label: "Features" },
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

