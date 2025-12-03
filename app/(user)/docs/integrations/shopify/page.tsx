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
  ShoppingBag,
  Code,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ShopifyIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Shopify Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Integrate your LuxeWear AI agent into your Shopify store. Add a chat widget to help customers find products, answer questions, and provide 24/7 support.
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
                The Shopify integration allows you to add your AI agent to your Shopify store, providing customers with instant support, product recommendations, and assistance throughout their shopping journey.
              </p>

              <h2 id="installation-methods">Installation Methods</h2>
              
              <h3 id="shopify-app">Method 1: Shopify App (Recommended)</h3>
              <p>Install the official LuxeWear AI app from Shopify App Store:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to your Shopify Admin</li>
                <li>Navigate to Apps → Visit Shopify App Store</li>
                <li>Search for &quot;LuxeWear AI&quot;</li>
                <li>Click &quot;Add app&quot; and install</li>
                <li>Connect your LuxeWear account</li>
                <li>Configure settings and customize appearance</li>
                <li>The chat widget will appear on your store</li>
              </ol>

              <h3 id="theme-code">Method 2: Theme Code</h3>
              <p>Add the code directly to your theme:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Go to Online Store → Themes</li>
                <li>Click &quot;Actions&quot; → &quot;Edit code&quot;</li>
                <li>Open <code>theme.liquid</code></li>
                <li>Find the <code>&lt;/body&gt;</code> tag</li>
                <li>Paste your embed code before the closing tag</li>
                <li>Save the file</li>
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

              <h2 id="configuration">Configuration</h2>
              
              <h3 id="widget-appearance">Widget Appearance</h3>
              <p>Customize the chat widget:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Match colors to your store theme</li>
                <li>Customize button icon and text</li>
                <li>Set widget position (bottom-right, bottom-left, etc.)</li>
                <li>Configure widget size and styling</li>
              </ul>

              <h3 id="page-rules">Page Rules</h3>
              <p>Control where the widget appears:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Show on all pages</li>
                <li>Show only on product pages</li>
                <li>Show only on cart/checkout</li>
                <li>Hide on specific pages</li>
              </ul>

              <h3 id="shopify-context">Shopify Context</h3>
              <p>Your AI agent can access Shopify context:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Current product information</li>
                <li>Cart contents</li>
                <li>Customer information (if logged in)</li>
                <li>Store information</li>
              </ul>

              <h2 id="use-cases">Use Cases</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Product Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Help customers find the right products based on their needs</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Order Support</h3>
                  <p className="text-sm text-muted-foreground">Answer questions about orders, shipping, and returns</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Size Guides</h3>
                  <p className="text-sm text-muted-foreground">Help customers choose the right size</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Lead Capture</h3>
                  <p className="text-sm text-muted-foreground">Collect customer information for marketing</p>
                </div>
              </div>

              <h2 id="testing">Testing</h2>
              <p>After installation, test your integration:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Visit your Shopify store</li>
                <li>Look for the chat widget</li>
                <li>Test on different pages (home, product, cart)</li>
                <li>Test on mobile devices</li>
                <li>Verify the agent responds correctly</li>
                <li>Test with Shopify context (product pages)</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Train your AI agent with your product catalog, policies, and FAQs to provide accurate, helpful responses to customers.
                </div>
              </div>

              <h2 id="troubleshooting">Troubleshooting</h2>
              
              <h3 id="widget-not-appearing">Widget Not Appearing</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Clear Shopify cache (Online Store → Themes → Actions → Clear cache)</li>
                <li>Verify embed code is correctly placed</li>
                <li>Check browser console for errors</li>
                <li>Ensure your agent ID is correct</li>
                <li>Check page rules aren&apos;t hiding the widget</li>
              </ul>

              <h3 id="styling-issues">Styling Issues</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Check for CSS conflicts with your theme</li>
                <li>Use custom CSS to override styles if needed</li>
                <li>Test with a default Shopify theme</li>
              </ul>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Use the Shopify app for easier maintenance</li>
                <li>Customize widget to match your brand</li>
                <li>Train agent with product information</li>
                <li>Test on mobile devices</li>
                <li>Monitor conversations and improve responses</li>
                <li>Use Shopify context for personalized responses</li>
                <li>Set up lead collection for marketing</li>
              </ul>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/integrations/webflow" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Webflow Integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">Integrate with Webflow sites</p>
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
              { id: "installation-methods", label: "Installation Methods" },
              { id: "shopify-app", label: "Shopify App" },
              { id: "theme-code", label: "Theme Code" },
              { id: "configuration", label: "Configuration" },
              { id: "widget-appearance", label: "Widget Appearance" },
              { id: "page-rules", label: "Page Rules" },
              { id: "shopify-context", label: "Shopify Context" },
              { id: "use-cases", label: "Use Cases" },
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

