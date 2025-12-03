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
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function SlackIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Slack Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Connect your LuxeWear AI agent to Slack. Enable team members to interact with your AI agent directly in Slack channels or via direct messages.
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
                The Slack integration allows your team to interact with your AI agent directly within Slack. Use it for internal support, knowledge sharing, or as a team assistant. Your AI agent can respond to messages in channels, handle direct messages, and provide instant answers to team questions.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up the Slack integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Slack workspace where you have admin or owner permissions</li>
                <li>A LuxeWear account with an active AI agent</li>
                <li>Ability to install apps in your Slack workspace</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Connect Slack Workspace</h3>
              <p className="mb-4">Authorize LuxeWear to access your Slack workspace:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your LuxeWear Dashboard</li>
                <li>Navigate to <strong>Integrations → Slack</strong></li>
                <li>Click <strong>&quot;Connect Slack&quot;</strong></li>
                <li>You&apos;ll be redirected to Slack to authorize</li>
                <li>Select your workspace</li>
                <li>Review and approve the requested permissions</li>
                <li>You&apos;ll be redirected back to LuxeWear</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-500/10 flex gap-3">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Permissions:</strong> LuxeWear requests permissions to read messages, send messages, and manage channels. These are necessary for the bot to function properly.
                </div>
              </div>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Configure Bot Settings</h3>
              <p className="mb-4">Set up how your bot behaves in Slack:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Select which AI agent to use</li>
                <li>Choose response mode (see Configuration below)</li>
                <li>Select channels to monitor (or allow all channels)</li>
                <li>Enable or disable direct messages</li>
                <li>Configure bot name and icon (optional)</li>
                <li>Save your configuration</li>
              </ol>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Invite Bot to Channels</h3>
              <p className="mb-4">Add the bot to channels where you want it to respond:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>In Slack, go to the channel where you want the bot</li>
                <li>Type <code className="px-1.5 py-0.5 rounded bg-muted text-sm">/invite @LuxeWear</code> (or your bot name)</li>
                <li>The bot will join the channel</li>
                <li>Test by mentioning the bot or sending a message</li>
              </ol>

              <h2 id="features" className="scroll-mt-20 mt-10">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Channel Support</h3>
                  <p className="text-sm text-muted-foreground">Respond to messages in any Slack channel</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Direct Messages</h3>
                  <p className="text-sm text-muted-foreground">Handle private messages from team members</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Thread Replies</h3>
                  <p className="text-sm text-muted-foreground">Maintain conversation context in threads</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Rich Formatting</h3>
                  <p className="text-sm text-muted-foreground">Support Slack&apos;s rich message formatting</p>
                </div>
              </div>

              <h2 id="configuration" className="scroll-mt-20 mt-10">Configuration Options</h2>
              
              <h3 id="response-modes" className="mt-6 mb-4">Response Modes</h3>
              <p className="mb-4">Choose how the bot responds:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Mention Only:</strong> Bot only responds when mentioned (recommended)</li>
                <li><strong>Always Respond:</strong> Bot responds to all messages (use with caution)</li>
                <li><strong>Keyword Triggers:</strong> Bot responds to specific keywords</li>
                <li><strong>Command Mode:</strong> Bot responds only to slash commands</li>
              </ul>

              <h3 id="channel-settings" className="mt-6 mb-4">Channel Settings</h3>
              <p className="mb-4">Control where the bot is active:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Select specific channels to monitor</li>
                <li>Exclude certain channels</li>
                <li>Allow all channels (default)</li>
                <li>Enable/disable direct messages</li>
              </ul>

              <h2 id="use-cases" className="scroll-mt-20 mt-10">Use Cases</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Internal Support:</strong> Provide instant answers to team questions</li>
                <li><strong>Knowledge Base:</strong> Access company knowledge and documentation</li>
                <li><strong>Onboarding:</strong> Help new team members with common questions</li>
                <li><strong>Team Assistant:</strong> Assist with tasks and information retrieval</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Use &quot;Mention Only&quot; mode to avoid spam and unnecessary responses</li>
                <li>Train your AI agent with team-specific knowledge and context</li>
                <li>Monitor conversations regularly to improve responses</li>
                <li>Set clear expectations for team members about when to use the bot</li>
                <li>Use threads for longer conversations to keep channels clean</li>
                <li>Customize the bot&apos;s name and icon to match your team&apos;s style</li>
              </ul>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with &quot;Mention Only&quot; mode and specific channels. You can always expand later based on usage and feedback.
                </div>
              </div>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="bot-not-responding" className="mt-6 mb-4">Bot Not Responding</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check that the bot is invited to the channel</li>
                <li>Verify response mode settings</li>
                <li>Ensure the bot is mentioned (if using mention mode)</li>
                <li>Check LuxeWear dashboard for error logs</li>
                <li>Verify your AI agent is active</li>
              </ul>

              <h3 id="permission-issues" className="mt-6 mb-4">Permission Issues</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify Slack app permissions are still valid</li>
                <li>Re-authorize the connection if needed</li>
                <li>Check workspace admin settings</li>
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
              { id: "use-cases", label: "Use Cases" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

