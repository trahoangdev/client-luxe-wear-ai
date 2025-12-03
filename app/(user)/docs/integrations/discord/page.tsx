'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import DocsContent from "@/components/docs/DocsContent";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  MessageCircle,
  Info
} from 'lucide-react';

export default function DiscordIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Discord Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Add your AI agent as a Discord bot to interact with your community in Discord servers.
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
                The Discord integration allows you to add your LuxeWear AI agent as a Discord bot, enabling community members to interact with your AI agent directly in Discord servers. Perfect for community support, Q&amp;A, and engagement in Discord communities.
              </p>

              <h2 id="prerequisites" className="scroll-mt-20 mt-10">Prerequisites</h2>
              <p className="mb-4">Before setting up the Discord integration:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li>A Discord account</li>
                <li>Administrator or &quot;Manage Server&quot; permissions in your Discord server</li>
                <li>A LuxeWear account with an active AI agent</li>
              </ul>

              <h2 id="setup" className="scroll-mt-20 mt-10">Setup Instructions</h2>
              
              <h3 id="step-1" className="mt-6 mb-4">Step 1: Create a Discord Application</h3>
              <p className="mb-4">Create your Discord bot application:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Discord Developer Portal</a></li>
                <li>Click <strong>&quot;New Application&quot;</strong></li>
                <li>Enter a name for your application</li>
                <li>Click <strong>&quot;Create&quot;</strong></li>
              </ol>

              <h3 id="step-2" className="mt-6 mb-4">Step 2: Create a Bot</h3>
              <p className="mb-4">Add a bot to your application:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>In your application, go to the <strong>&quot;Bot&quot;</strong> section</li>
                <li>Click <strong>&quot;Add Bot&quot;</strong> and confirm</li>
                <li>Under <strong>&quot;Token&quot;</strong>, click <strong>&quot;Reset Token&quot;</strong> and copy the token</li>
                <li>Enable <strong>&quot;Message Content Intent&quot;</strong> under Privileged Gateway Intents</li>
                <li>Save changes</li>
              </ol>

              <div className="my-6 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Security:</strong> Keep your bot token secure. Never share it publicly. If exposed, reset it immediately.
                </div>
              </div>

              <h3 id="step-3" className="mt-6 mb-4">Step 3: Configure in LuxeWear</h3>
              <p className="mb-4">Connect your Discord bot to LuxeWear:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your LuxeWear Dashboard</li>
                <li>Navigate to <strong>Integrations → Discord</strong></li>
                <li>Click <strong>&quot;Connect Discord&quot;</strong></li>
                <li>Enter your bot token from Step 2</li>
                <li>Select which AI agent to use</li>
                <li>Configure bot settings (prefix, response mode, etc.)</li>
                <li>Save your configuration</li>
              </ol>

              <h3 id="step-4" className="mt-6 mb-4">Step 4: Invite Bot to Server</h3>
              <p className="mb-4">Add your bot to your Discord server:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>In Discord Developer Portal, go to <strong>&quot;OAuth2 → URL Generator&quot;</strong></li>
                <li>Select <strong>&quot;bot&quot;</strong> scope</li>
                <li>Select necessary permissions:
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>Send Messages</li>
                    <li>Read Message History</li>
                    <li>Use Slash Commands</li>
                    <li>Embed Links (optional)</li>
                  </ul>
                </li>
                <li>Copy the generated URL</li>
                <li>Open the URL in your browser and select your server</li>
                <li>Authorize the bot</li>
              </ol>

              <h3 id="step-5" className="mt-6 mb-4">Step 5: Test the Integration</h3>
              <p className="mb-4">Verify everything works:</p>
              <ol className="ml-4 mb-6 space-y-3">
                <li>Go to your Discord server</li>
                <li>Check that your bot appears in the member list</li>
                <li>Send a test message mentioning the bot or using a command</li>
                <li>Verify your AI agent responds correctly</li>
              </ol>

              <h2 id="features" className="scroll-mt-20 mt-10">Features</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Channel Support</h3>
                  <p className="text-sm text-muted-foreground">Respond to messages in any Discord channel</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Direct Messages</h3>
                  <p className="text-sm text-muted-foreground">Handle private messages from users</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Slash Commands</h3>
                  <p className="text-sm text-muted-foreground">Support Discord slash commands for quick actions</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Rich Embeds</h3>
                  <p className="text-sm text-muted-foreground">Send formatted messages with embeds</p>
                </div>
              </div>

              <h2 id="configuration" className="scroll-mt-20 mt-10">Configuration Options</h2>
              <p className="mb-4">Customize your Discord bot behavior:</p>
              <ul className="ml-4 mb-6 space-y-3">
                <li><strong>Command Prefix:</strong> Set a prefix for bot commands (e.g., <code className="px-1.5 py-0.5 rounded bg-muted text-sm">!</code>, <code className="px-1.5 py-0.5 rounded bg-muted text-sm">?</code>)</li>
                <li><strong>Response Mode:</strong> Always respond, respond to mentions only, or use commands</li>
                <li><strong>Channel Restrictions:</strong> Limit bot to specific channels</li>
                <li><strong>Role Permissions:</strong> Control who can interact with the bot</li>
              </ul>

              <h2 id="best-practices" className="scroll-mt-20 mt-10">Best Practices</h2>
              <ul className="ml-4 mb-6 space-y-3">
                <li>Use slash commands for better user experience</li>
                <li>Set clear bot permissions to avoid spam</li>
                <li>Train your AI agent with Discord-specific context</li>
                <li>Monitor bot activity and adjust response behavior</li>
                <li>Use embeds for better message formatting</li>
                <li>Handle rate limits gracefully</li>
              </ul>

              <h2 id="troubleshooting" className="scroll-mt-20 mt-10">Troubleshooting</h2>
              
              <h3 id="bot-offline" className="mt-6 mb-4">Bot Appears Offline</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Verify the bot token is correct</li>
                <li>Check that the bot is properly configured in LuxeWear</li>
                <li>Ensure the bot has necessary intents enabled</li>
              </ul>

              <h3 id="no-response" className="mt-6 mb-4">Bot Not Responding</h3>
              <ul className="ml-4 mb-6 space-y-2">
                <li>Check bot permissions in the server</li>
                <li>Verify response mode settings</li>
                <li>Check LuxeWear dashboard for error logs</li>
                <li>Ensure your AI agent is active</li>
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

