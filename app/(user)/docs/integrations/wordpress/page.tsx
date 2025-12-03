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
  Code,
  Plug,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function WordPressIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">WordPress Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Integrate your LuxeWear AI agent into your WordPress website. Add a chat widget, embed on specific pages, or create a dedicated chat page.
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
                The WordPress integration allows you to seamlessly add your AI agent to any WordPress site. Choose from multiple integration methods including a floating chat widget, inline embed, or full-page chat.
              </p>

              <h2 id="integration-methods">Integration Methods</h2>
              
              <h3 id="chat-widget">Method 1: Floating Chat Widget</h3>
              <p>The easiest way to add your AI agent - a floating chat button that appears on all pages:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to your agent&apos;s deployment settings</li>
                <li>Copy the embed code</li>
                <li>In WordPress, go to <strong>Appearance → Theme Editor</strong> or use a plugin</li>
                <li>Add the code to your theme&apos;s footer.php file (before <code>&lt;/body&gt;</code>)</li>
              </ol>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.luxewear.ai/widget.js';
    script.setAttribute('data-agent-id', 'YOUR_AGENT_ID');
    script.setAttribute('data-position', 'bottom-right');
    document.body.appendChild(script);
  })();
</script>`}</code></pre>
              </div>

              <h3 id="shortcode">Method 2: WordPress Shortcode</h3>
              <p>Use a shortcode to embed the chat widget anywhere:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Install the LuxeWear AI WordPress plugin (if available)</li>
                <li>Configure your agent ID in plugin settings</li>
                <li>Use the shortcode: <code>[luxewear-chat]</code></li>
                <li>Add to any page, post, or widget area</li>
              </ol>

              <h3 id="inline-embed">Method 3: Inline Embed</h3>
              <p>Embed the chat directly in page content:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<div id="luxewear-chat-container" 
     data-agent-id="YOUR_AGENT_ID"
     data-theme="light"
     style="height: 600px; width: 100%;">
</div>
<script src="https://cdn.luxewear.ai/embed.js"></script>`}</code></pre>
              </div>

              <h2 id="configuration">Configuration Options</h2>
              
              <h3 id="widget-position">Widget Position</h3>
              <p>Control where the floating widget appears:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><code>bottom-right</code> - Bottom right corner (default)</li>
                <li><code>bottom-left</code> - Bottom left corner</li>
                <li><code>top-right</code> - Top right corner</li>
                <li><code>top-left</code> - Top left corner</li>
              </ul>

              <h3 id="customization">Customization</h3>
              <p>Customize the widget appearance:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>Theme:</strong> Light or dark theme</li>
                <li><strong>Colors:</strong> Customize button and chat colors</li>
                <li><strong>Icon:</strong> Custom chat button icon</li>
                <li><strong>Size:</strong> Adjust widget dimensions</li>
                <li><strong>Language:</strong> Set widget language</li>
              </ul>

              <h3 id="page-rules">Page Rules</h3>
              <p>Control where the widget appears:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Show on all pages (default)</li>
                <li>Show only on specific pages</li>
                <li>Hide on specific pages</li>
                <li>Show based on URL patterns</li>
              </ul>

              <h2 id="plugin-installation">Plugin Installation (Recommended)</h2>
              <p>For the best experience, use the official WordPress plugin:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Download the LuxeWear AI plugin from your dashboard</li>
                <li>In WordPress, go to <strong>Plugins → Add New</strong></li>
                <li>Click <strong>Upload Plugin</strong> and select the ZIP file</li>
                <li>Activate the plugin</li>
                <li>Go to <strong>Settings → LuxeWear AI</strong></li>
                <li>Enter your agent ID and configure settings</li>
                <li>Save and the widget will appear on your site</li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> The plugin method is recommended as it handles updates, caching, and performance optimizations automatically.
                </div>
              </div>

              <h2 id="manual-installation">Manual Installation</h2>
              <p>If you prefer not to use a plugin, add the code manually:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Copy your embed code from the dashboard</li>
                <li>In WordPress, go to <strong>Appearance → Theme Editor</strong></li>
                <li>Select <strong>Theme Footer (footer.php)</strong></li>
                <li>Paste the code just before the <code>&lt;/body&gt;</code> tag</li>
                <li>Click <strong>Update File</strong></li>
              </ol>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> Manual installation requires theme file editing. If you update your theme, you may need to re-add the code. Consider using a child theme or the plugin method instead.
                </div>
              </div>

              <h2 id="testing">Testing</h2>
              <p>After installation, test your integration:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Visit your WordPress site</li>
                <li>Look for the chat widget (floating button or inline)</li>
                <li>Click to open the chat</li>
                <li>Send a test message</li>
                <li>Verify the agent responds correctly</li>
                <li>Test on different pages and devices</li>
              </ul>

              <h2 id="troubleshooting">Troubleshooting</h2>
              
              <h3 id="widget-not-appearing">Widget Not Appearing</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Check that the embed code is correctly placed</li>
                <li>Verify your agent ID is correct</li>
                <li>Clear WordPress cache and browser cache</li>
                <li>Check browser console for JavaScript errors</li>
                <li>Ensure your theme loads scripts in the footer</li>
              </ul>

              <h3 id="styling-issues">Styling Issues</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Check for CSS conflicts with your theme</li>
                <li>Add custom CSS to override styles if needed</li>
                <li>Test with a default WordPress theme</li>
                <li>Use browser developer tools to inspect elements</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use the plugin method for easier maintenance</li>
                <li>Test on mobile devices to ensure responsiveness</li>
                <li>Configure page rules to show widget where it&apos;s most useful</li>
                <li>Customize colors to match your brand</li>
                <li>Monitor analytics to see how users interact with the widget</li>
                <li>Keep the plugin updated for latest features and security</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/integrations/shopify" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Plug className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Shopify Integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">Integrate with Shopify stores</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/integrations/custom" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Custom Website</h3>
                      <p className="text-sm text-muted-foreground mt-1">Integrate with any website</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "integration-methods", label: "Integration Methods" },
              { id: "configuration", label: "Configuration Options" },
              { id: "plugin-installation", label: "Plugin Installation" },
              { id: "manual-installation", label: "Manual Installation" },
              { id: "testing", label: "Testing" },
              { id: "troubleshooting", label: "Troubleshooting" },
              { id: "best-practices", label: "Best Practices" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

