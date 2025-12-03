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
  Globe,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CustomWebsiteIntegrationPage() {
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
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Custom Website Integration</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Integrate your LuxeWear AI agent into any website or web application. Use our embed code, JavaScript SDK, or REST API to add AI chat capabilities to your custom site.
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
                The custom website integration provides flexible options for adding your AI agent to any website, regardless of the platform or framework. Choose from embed code, JavaScript SDK, or REST API integration methods.
              </p>

              <h2 id="integration-methods">Integration Methods</h2>
              
              <h3 id="embed-code">Method 1: Embed Code (Easiest)</h3>
              <p>Add a simple script tag to your HTML:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<!-- Add before closing </body> tag -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.luxewear.ai/widget.js';
    script.setAttribute('data-agent-id', 'YOUR_AGENT_ID');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-theme', 'light');
    document.body.appendChild(script);
  })();
</script>`}</code></pre>
              </div>

              <h3 id="inline-embed">Method 2: Inline Embed</h3>
              <p>Embed the chat directly in your page:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<div id="luxewear-chat-container" 
     data-agent-id="YOUR_AGENT_ID"
     style="height: 600px; width: 100%;">
</div>
<script src="https://cdn.luxewear.ai/embed.js"></script>`}</code></pre>
              </div>

              <h3 id="javascript-sdk">Method 3: JavaScript SDK</h3>
              <p>For more control, use the JavaScript SDK:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<script src="https://cdn.luxewear.ai/sdk.js"></script>
<script>
  LuxeWear.init({
    agentId: 'YOUR_AGENT_ID',
    position: 'bottom-right',
    theme: 'light',
    onMessage: function(message) {
      console.log('Message received:', message);
    }
  });
</script>`}</code></pre>
              </div>

              <h3 id="rest-api">Method 4: REST API</h3>
              <p>For full control, use the REST API:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`// Send a message
fetch('https://api.luxewear.ai/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    agentId: 'YOUR_AGENT_ID',
    message: 'Hello!',
    sessionId: 'optional-session-id'
  })
})
.then(response => response.json())
.then(data => console.log(data));`}</code></pre>
              </div>

              <h2 id="configuration-options">Configuration Options</h2>
              
              <h3 id="widget-options">Widget Options</h3>
              <p>Configure the widget with data attributes:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><code>data-agent-id</code> - Your agent ID (required)</li>
                <li><code>data-position</code> - Widget position (bottom-right, bottom-left, top-right, top-left)</li>
                <li><code>data-theme</code> - Theme (light, dark, auto)</li>
                <li><code>data-button-text</code> - Custom button text</li>
                <li><code>data-button-color</code> - Button color (hex code)</li>
                <li><code>data-button-icon</code> - Custom button icon URL</li>
              </ul>

              <h3 id="sdk-options">SDK Options</h3>
              <p>JavaScript SDK configuration:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`LuxeWear.init({
  agentId: 'YOUR_AGENT_ID',
  position: 'bottom-right',
  theme: 'light',
  customStyles: {
    buttonColor: '#007bff',
    chatBackground: '#ffffff'
  },
  onOpen: function() { /* widget opened */ },
  onClose: function() { /* widget closed */ },
  onMessage: function(message) { /* message received */ }
});`}</code></pre>
              </div>

              <h2 id="styling">Custom Styling</h2>
              <p>Customize the widget appearance with CSS:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`/* Custom widget styles */
#luxewear-widget {
  /* Your custom styles */
}

#luxewear-widget-button {
  background-color: #007bff;
  border-radius: 50px;
  /* More custom styles */
}`}</code></pre>
              </div>

              <h2 id="api-integration">API Integration</h2>
              <p>For custom implementations, use the REST API:</p>
              
              <h3 id="authentication">Authentication</h3>
              <p>Authenticate using API keys:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`Authorization: Bearer YOUR_API_KEY`}</code></pre>
              </div>

              <h3 id="send-message">Send Message</h3>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`POST https://api.luxewear.ai/v1/chat
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "agentId": "YOUR_AGENT_ID",
  "message": "User message",
  "sessionId": "optional-session-id",
  "context": {
    "page": "/products",
    "userId": "user-123"
  }
}`}</code></pre>
              </div>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Add the script before the closing <code>&lt;/body&gt;</code> tag</li>
                <li>Use HTTPS for security</li>
                <li>Test on multiple browsers and devices</li>
                <li>Customize styling to match your brand</li>
                <li>Handle errors gracefully</li>
                <li>Use session IDs for conversation continuity</li>
                <li>Implement proper error handling</li>
                <li>Monitor API usage and rate limits</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start with the embed code method for quick setup, then move to SDK or API for more advanced customization needs.
                </div>
              </div>

              <h2 id="troubleshooting">Troubleshooting</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Check browser console for JavaScript errors</li>
                <li>Verify agent ID is correct</li>
                <li>Ensure script loads after DOM is ready</li>
                <li>Check CORS settings if using API</li>
                <li>Verify API key permissions</li>
                <li>Test with different browsers</li>
              </ul>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "overview", label: "Overview" },
              { id: "integration-methods", label: "Integration Methods" },
              { id: "embed-code", label: "Embed Code" },
              { id: "inline-embed", label: "Inline Embed" },
              { id: "javascript-sdk", label: "JavaScript SDK" },
              { id: "rest-api", label: "REST API" },
              { id: "configuration-options", label: "Configuration Options" },
              { id: "styling", label: "Custom Styling" },
              { id: "api-integration", label: "API Integration" },
              { id: "best-practices", label: "Best Practices" },
              { id: "troubleshooting", label: "Troubleshooting" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

