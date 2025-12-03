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
  Globe,
  Code,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function WebflowIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Webflow Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Integrate your LuxeWear AI agent into your Webflow website. Add a chat widget or embed the chat directly into your Webflow pages.
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
                The Webflow integration allows you to seamlessly add your AI agent to any Webflow site. You can add a floating chat widget or embed the chat directly into specific pages.
              </p>

              <h2 id="installation">Installation</h2>
              
              <h3 id="embed-code">Method 1: Embed Code (Recommended)</h3>
              <p>Add the embed code to your Webflow site:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>In Webflow, go to Project Settings</li>
                <li>Navigate to Custom Code</li>
                <li>Find &quot;Footer Code&quot; section</li>
                <li>Paste your LuxeWear embed code</li>
                <li>Publish your site</li>
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

              <h3 id="embed-component">Method 2: Embed Component</h3>
              <p>Add as an embed component on specific pages:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Open the page where you want the chat</li>
                <li>Add an Embed component</li>
                <li>Paste the embed code</li>
                <li>Style the component as needed</li>
                <li>Publish the page</li>
              </ol>

              <h2 id="configuration">Configuration</h2>
              <p>Customize the widget appearance:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Match colors to your Webflow site</li>
                <li>Set widget position</li>
                <li>Customize button icon</li>
                <li>Configure widget size</li>
              </ul>

              <h2 id="testing">Testing</h2>
              <p>After adding the code:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Publish your Webflow site</li>
                <li>Visit the published site</li>
                <li>Look for the chat widget</li>
                <li>Test the chat functionality</li>
                <li>Test on mobile devices</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Use the Footer Code method for site-wide widget, or Embed Component for page-specific placement.
                </div>
              </div>

              <h2 id="troubleshooting">Troubleshooting</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Ensure code is in Footer Code, not Header Code</li>
                <li>Publish your site after adding code</li>
                <li>Clear browser cache</li>
                <li>Check browser console for errors</li>
                <li>Verify agent ID is correct</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              { id: "installation", label: "Installation" },
              { id: "embed-code", label: "Embed Code" },
              { id: "embed-component", label: "Embed Component" },
              { id: "configuration", label: "Configuration" },
              { id: "testing", label: "Testing" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

