"use client";

import React from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function simpleMarkdownToHtml(input: string): string {
  let text = input.replace(/\r\n/g, "\n");

  // Code blocks ``` (process first to avoid interfering with other patterns)
  text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    const trimmed = code.trim();
    return `<pre class="rounded-md bg-muted p-3 overflow-auto my-3"><code class="text-sm">${escapeHtml(trimmed)}</code></pre>`;
  });

  // Headers (###, ##, #)
  text = text.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  text = text.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>');
  text = text.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, (_, code) => `<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">${escapeHtml(code)}</code>`);

  // Bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong class='font-semibold'>$1</strong>");

  // Italic *text* (but not if it's part of **bold**)
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80">$1</a>');

  // Process lists line by line to avoid conflicts
  const lines = text.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const tag = listType === 'ul' ? 'ul' : 'ol';
      const className = listType === 'ul'
        ? 'list-disc space-y-2 my-3 ml-6'
        : 'list-decimal space-y-2 my-3 ml-6';
      processedLines.push(`<${tag} class="${className}">${listItems.join('')}</${tag}>`);
      listItems = [];
      listType = null;
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for unordered list item
    const ulMatch = line.match(/^[\-\*]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li class="ml-4 pl-1 mb-2 text-[15px]">${ulMatch[1]}</li>`);
      continue;
    }

    // Check for ordered list item
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li class="ml-4 pl-1 mb-2 text-[15px]">${olMatch[1]}</li>`);
      continue;
    }

    // Not a list item, flush any pending list
    flushList();
    processedLines.push(line);
  }

  // Flush any remaining list
  flushList();
  text = processedLines.join('\n');

  // Paragraphs (split by double newlines)
  const paragraphs = text.split(/\n\n+/);
  text = paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    // Don't wrap if it's already a block element
    if (p.startsWith('<') && (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul') || p.startsWith('<ol'))) {
      return p;
    }
    return `<p class="mb-4 leading-7 whitespace-pre-line text-[15px]">${p}</p>`;
  }).join('\n');

  // Single newlines to <br/> (but not inside code blocks or lists)
  text = text.replace(/(?<!<\/code>|<\/li>|<\/p>|<\/h[1-6]>)\n(?!<)/g, '<br/>');

  return text;
}

// function escapeHtml is already defined above

function CodeBlock({ code, language }: { code: string, language?: string }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-md bg-muted border overflow-hidden group/code">
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted-foreground/10 text-xs text-muted-foreground border-b border-border/50">
        <span className="font-mono">{language || "code"}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors p-1 rounded-sm hover:bg-background/50"
          title="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="sr-only">Copy</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function Markdown({ children }: { children: string }) {
  // Simple parser to separate code blocks from text
  // We use useMemo to avoid re-parsing on every render if content hasn't changed
  const parts = React.useMemo(() => {
    if (!children) return [];
    return children.split(/```([\s\S]*?)```/g);
  }, [children]);

  if (!children) return null;

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // Odd index is code block because split separates by delimiter capturing group
          // Try to extract language if present "ts\n..."
          const match = part.match(/^([a-zA-Z0-9_-]+)\n([\s\S]*)/);
          let lang = "";
          let code = part;
          if (match) {
            lang = match[1];
            code = match[2];
          }
          return <CodeBlock key={index} code={code.trim()} language={lang} />;
        }

        // Even index is normal text
        if (!part.trim()) return null;

        // We reuse simpleMarkdownToHtml but we need to remove the code block processing from it 
        // to avoid double processing if any somehow slipped through (unlikely with this split)
        // actually simpleMarkdownToHtml handles headers/lists etc so we keep it.
        // But we should ensure simpleMarkdownToHtml doesn't try to handle ``` blocks again if they exist in `part` (they shouldn't)
        const html = simpleMarkdownToHtml(part);
        return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}


