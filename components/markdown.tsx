"use client";

import React from "react";

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
        ? 'list-disc space-y-1 my-2 ml-6' 
        : 'list-decimal space-y-1 my-2 ml-6';
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
      listItems.push(`<li class="ml-4 mb-1">${ulMatch[1]}</li>`);
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
      listItems.push(`<li class="ml-4 mb-1">${olMatch[1]}</li>`);
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
    return `<p class="mb-3 leading-relaxed">${p}</p>`;
  }).join('\n');
  
  // Single newlines to <br/> (but not inside code blocks or lists)
  text = text.replace(/(?<!<\/code>|<\/li>|<\/p>|<\/h[1-6]>)\n(?!<)/g, '<br/>');
  
  return text;
}

export default function Markdown({ children }: { children: string }) {
  const html = React.useMemo(() => simpleMarkdownToHtml(children || ""), [children]);
  // eslint-disable-next-line react/no-danger
  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}


