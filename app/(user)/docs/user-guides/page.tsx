'use client';

import { useState } from 'react';
import Image from 'next/image';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Plug, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  Rocket,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "Smart & Trainable",
    desc: "Train your AI Agent with your own documents, websites, or databases for accurate, relevant responses.",
    icon: Brain,
  },
  {
    title: "Easy Integration",
    desc: "Embed anywhere with simple copy-paste code - no technical expertise required.",
    icon: Plug,
  },
  {
    title: "Interactive Actions",
    desc: "Pre-built actions for Slack, Stripe, Calendly, lead collection, and web search - Plus custom actions for any API integration.",
    icon: Zap,
  },
  {
    title: "Powerful Analytics",
    desc: "Track conversations, monitor performance, and continuously improve your AI Agent.",
    icon: BarChart3,
  },
  {
    title: "Lead Generation",
    desc: "Capture and manage leads automatically through intelligent conversations.",
    icon: Users,
  },
  {
    title: "Deploy Everywhere",
    desc: "Experience our lush integrations across 15+ platforms including WordPress, Shopify, WhatsApp, Slack, Zendesk, and more.",
    icon: Globe,
  },
];

export default function UserGuidesPage() {
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
          {/* Left Sidebar */}
          <DocsLeftSidebar />

          {/* Main Content */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Quick Start</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome to LuxeWear</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-2xl">
                  Get started with LuxeWear and discover how to build intelligent agents trained on your business data.
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

            {/* Logo Box */}
            <div className="mt-6 rounded-2xl border bg-muted/40 p-12 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-foreground/10 flex items-center justify-center relative">
                  <Image 
                    src="/logoGobal.png" 
                    alt="LuxeWear" 
                    width={40}
                    height={40}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-2xl font-bold tracking-tight">LuxeWear</div>
              </div>
            </div>

            {/* Why Choose Section */}
            <h2 id="why-choose" className="mt-12 text-2xl md:text-3xl font-bold tracking-tight">
              Why Choose LuxeWear?
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border bg-background p-6 hover:border-foreground/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ready to Get Started Section */}
            <div id="ready-to-start" className="mt-12 rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/20 p-3 shrink-0">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Let&apos;s build your first AI agent! The entire process takes less than 10 minutes.
                  </p>
                  <Link href="/docs/your-first-agent">
                    <Button size="lg" className="group">
                      Build Your First AI Agent
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Aside */}
          <DocsOnThisPage />
        </div>
      </div>
    </section>
  );
}
