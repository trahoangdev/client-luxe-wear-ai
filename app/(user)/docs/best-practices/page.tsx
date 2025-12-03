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
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function BestPracticesPage() {
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    instructions: false,
    badProduct: false,
    goodProduct: false,
    badDescription: false,
    goodDescription: false,
  });

  const handleCopyPage = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
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
                <div className="text-xs font-semibold text-muted-foreground mb-2">Quick Start</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Best Practices</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  This page offers tips to help you improve your AI agent&apos;s performance and user experience. It covers improving the instructions, teaching the bot how to send links.
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
              {/* Section 1: Refine Instructions */}
              <h2 id="refine-instructions">Refine the AI agent&apos;s Instructions</h2>
              <p>
                Instructions shape your AI agent&apos;s behavior and responses. They allow you to set a persona, define tone, or specify question types. Clear and precise instructions ensure your agent aligns with your goals.
              </p>
              <p className="mt-2">
                Use the example below after customization to guide your agent&apos;s behavior.
              </p>

              <Collapsible open={openSections.instructions} onOpenChange={() => toggleSection('instructions')} className="my-4">
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors">
                  <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.instructions && "rotate-90")} />
                  <span className="font-semibold">Friendly Support Agent Instructions</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 rounded-lg border bg-muted/20 p-4">
                  <pre className="text-sm whitespace-pre-wrap">
{`You are a friendly and helpful customer support agent for LuxeWear. 
Your goal is to assist customers with their questions about our products and services.

Guidelines:
- Always greet customers warmly
- Be concise but thorough in your responses
- If you don't know the answer, direct them to our support team
- Use a professional but friendly tone
- Provide accurate information based on our knowledge base`}
                  </pre>
                </CollapsibleContent>
              </Collapsible>

              <p className="mt-4">
                You can find more detailed information about refining your instruction <Link className="underline hover:text-foreground" href="/docs">here</Link>.
              </p>

              {/* Section 2: Improve Readability */}
              <h2 id="improve-readability" className="mt-12">Improve Readability of Sources</h2>
              <p>
                The quality of your AI agent&apos;s responses depends on the readability of your data sources. LuxeWear relies on readable text from websites or PDFs to train your agent effectively.
              </p>
              <p className="mt-2">
                Some websites might not be &quot;scraper-friendly&quot;. If you encounter issues, try copying and pasting information as text or uploading it as a PDF to overcome this limitation.
              </p>

              <div className="my-6 space-y-3">
                <Collapsible open={openSections.badProduct} onOpenChange={() => toggleSection('badProduct')}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-left rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors">
                    <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.badProduct && "rotate-90")} />
                    <span className="font-semibold">Bad Product Example</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-lg border bg-red-50/50 dark:bg-red-500/10 p-4">
                    <p className="text-sm">
                      Product XYZ - $99.99 - Buy now - Limited time offer - Free shipping - Add to cart - Reviews: 4.5 stars
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ❌ Too cluttered with UI elements, hard to extract meaningful information
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.goodProduct} onOpenChange={() => toggleSection('goodProduct')}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-left rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors">
                    <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.goodProduct && "rotate-90")} />
                    <span className="font-semibold">Good Product Example</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-lg border bg-emerald-50/50 dark:bg-emerald-500/10 p-4">
                    <div className="text-sm space-y-2">
                      <p><strong>Product Name:</strong> Premium Wireless Headphones</p>
                      <p><strong>Price:</strong> $99.99</p>
                      <p><strong>Description:</strong> High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.</p>
                      <p><strong>Features:</strong> Active noise cancellation, Bluetooth 5.0, Comfortable over-ear design, Quick charge support</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ✅ Clear structure, easy to understand and extract information
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.badDescription} onOpenChange={() => toggleSection('badDescription')}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-left rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors">
                    <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.badDescription && "rotate-90")} />
                    <span className="font-semibold">Bad Description Example</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-lg border bg-red-50/50 dark:bg-red-500/10 p-4">
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ❌ Placeholder text, no actual information
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.goodDescription} onOpenChange={() => toggleSection('goodDescription')}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-left rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors">
                    <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.goodDescription && "rotate-90")} />
                    <span className="font-semibold">Good Description Example</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-lg border bg-emerald-50/50 dark:bg-emerald-500/10 p-4">
                    <div className="text-sm space-y-2">
                      <p><strong>Service Overview:</strong> Our premium subscription service provides unlimited access to all features, priority support, and advanced analytics.</p>
                      <p><strong>Key Benefits:</strong></p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Unlimited AI agent interactions</li>
                        <li>24/7 priority customer support</li>
                        <li>Advanced analytics and reporting</li>
                        <li>Custom integrations and API access</li>
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ✅ Detailed, structured, and informative
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-zinc-50/50 dark:bg-zinc-500/10">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> LuxeWear currently cannot process images, videos, or non-textual elements in documents. Ensure your sources contain readable text content.
                </div>
              </div>

              {/* Section 3: Add Suggestable Links */}
              <h2 id="suggestable-links" className="mt-12">Add Suggestable Links</h2>
              <p>
                Links must be explicitly included in your AI agent&apos;s training data. The bot uses links from the webpages section of the sources to gather information but does not learn the URL itself, meaning it cannot directly share the link with the user.
              </p>
              <p className="mt-2">
                This mechanism helps prevent the bot from generating non-existent or 404-error-prone URLs. The best practice is to add a document that maps URLs to descriptive page names, aiding the AI agent in understanding user queries related to different pages.
              </p>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <div className="text-sm font-semibold mb-2">Example: URL Mapping Document</div>
                <pre className="text-xs bg-background p-4 rounded border overflow-x-auto">
{`https://www.luxewear.com/ Home Page
The main landing page showcasing our latest fashion collections and featured products.

https://www.luxewear.com/discover Discover Page
A page where users can explore and discover a wide range of fashion items across various categories.

https://www.luxewear.com/collections Collections
This page allows users to browse products by themes, seasons, or special occasions. Users can explore these collections to find items that match their style.

https://www.luxewear.com/support Support
Our customer support page with FAQs, contact information, and help resources.`}
                </pre>
              </div>

              {/* Section 4: Add Suggestable Images */}
              <h2 id="suggestable-images" className="mt-12">Add Suggestable Images</h2>
              <p>
                To enable image display in the chat widget, agents can use markdown format when sending image links.
              </p>
              <p className="mt-2">
                <strong>Ensure the URL ends with .png or .jpg for the image to render correctly.</strong>
              </p>
              <p className="mt-2">
                You can include a line like the following in your instructions to display an example image after each response.
              </p>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <div className="text-sm font-semibold mb-2">Markdown Example:</div>
                <pre className="text-xs bg-background p-4 rounded border overflow-x-auto">
{`Always end your reply with ![Example Image](https://upload.wikimedia.org/wikipedia/commons/thumb/example.png)`}
                </pre>
              </div>

              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Chat interface with image example screenshot</p>
                </div>
              </div>

              {/* Section 5: Choose AI Model */}
              <h2 id="choose-model" className="mt-12">Choose the suitable AI model</h2>
              <p>
                Selecting the right AI model is crucial for optimal performance. Consider factors such as your use case, task complexity, data availability, response time needs, scalability requirements, and adaptability to your specific domain.
              </p>
              <p className="mt-2">
                Different models excel in different scenarios: structured data models for data analysis, conversational models for customer support, and specialized models for real-time interactions versus batch processing.
              </p>

              {/* Section 6: Model Recommendations */}
              <h2 id="model-recommendations" className="mt-12">AI Model Recommendations Based on Use Cases</h2>

              <div className="space-y-6 mt-6">
                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-2">Customer Support & FAQ</h3>
                  <p className="text-sm text-muted-foreground mb-4">For quick, clear responses to general inquiries.</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gpt-5-mini</code>
                      <span className="text-sm">Delivers fast, concise answers.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gemini-2.5-flash</code>
                      <span className="text-sm">Ideal for real-time, simple queries.</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-2">Content Creation & Marketing</h3>
                  <p className="text-sm text-muted-foreground mb-4">For crafting creative, engaging content like blogs or marketing materials.</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">claude-4-sonnet</code>
                      <span className="text-sm">Excels at poetic and creative content.</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-2">E-commerce & Lead Generation</h3>
                  <p className="text-sm text-muted-foreground mb-4">For product suggestions or moderately complex questions.</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gpt-5</code>
                      <span className="text-sm">Balances speed and precision in customer interactions.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gemini-2.0-pro</code>
                      <span className="text-sm">Effective for product recommendations and medium-complexity queries.</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-2">Advanced Research & Technical Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">For in-depth research, troubleshooting, and solving complex issues.</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gpt-5</code>
                      <span className="text-sm">Advanced model for complex research and deep problem-solving.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">gemini-2.0-pro</code>
                      <span className="text-sm">Highly accurate, advanced technical support.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-emerald-50/50 dark:bg-emerald-500/10">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> If you are still unsure which model to choose, refer to our <Link className="underline hover:text-foreground" href="/docs">models comparison page</Link>.
                </div>
              </div>

              {/* Section 7: Revise Feature */}
              <h2 id="revise-feature" className="mt-12">Utilize the &quot;Revise&quot; Feature and Q&amp;A Data Type</h2>
              <p>
                Monitor your AI agent&apos;s responses in the Activity tab. When you find a response that needs improvement, use the revise button to modify the answer. Revised answers are automatically added as a Q&amp;A data type to improve future responses.
              </p>
              <p className="mt-2">
                These revised Q&amp;A pairs can be found in the Q&amp;A tab under Sources, where you can further edit or manage them. This feature helps continuously improve your agent&apos;s accuracy and relevance.
              </p>

              <div className="my-4 rounded-2xl overflow-hidden border bg-muted/40 p-2">
                <div className="aspect-video bg-muted/60 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Revise feature modal screenshot</p>
                </div>
              </div>

              <div className="my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border bg-zinc-50/50 dark:bg-zinc-500/10">
                <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Regularly review and revise responses to build a comprehensive Q&amp;A knowledge base that improves your agent&apos;s performance over time.
                </div>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "refine-instructions", label: "Refine the AI agent's Instructions" },
              { id: "improve-readability", label: "Improve Readability of Sources" },
              { id: "suggestable-links", label: "Add Suggestable Links" },
              { id: "suggestable-images", label: "Add Suggestable Images" },
              { id: "choose-model", label: "Choose the suitable AI model" },
              { id: "model-recommendations", label: "AI Model Recommendations Based on Use Cases" },
              { id: "revise-feature", label: 'Utilize the "Revise" Feature and Q&A Data Type' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

