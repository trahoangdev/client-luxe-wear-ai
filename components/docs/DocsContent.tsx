import React from 'react';
import { cn } from "@/lib/utils";

interface DocsContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function DocsContent({ children, className }: DocsContentProps) {
  return (
    <div className={cn(
      "mt-8 prose prose-gray dark:prose-invert max-w-none",
      // Override prose styles for better spacing and readability
      "prose-headings:scroll-mt-20",
      "prose-h2:mt-10 prose-h2:mb-6 prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight",
      "prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight",
      "prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-lg prose-h4:font-semibold",
      "prose-p:mb-6 prose-p:leading-7 prose-p:text-base",
      "prose-ul:mb-6 prose-ul:ml-6 prose-ul:space-y-2",
      "prose-ol:mb-6 prose-ol:ml-6 prose-ol:space-y-2",
      "prose-li:leading-7 prose-li:text-base",
      "prose-strong:font-semibold",
      "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground",
      "prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
      "prose-pre:bg-muted/40 prose-pre:border prose-pre:rounded-lg prose-pre:p-4",
      "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
      className
    )}>
      {children}
    </div>
  );
}

