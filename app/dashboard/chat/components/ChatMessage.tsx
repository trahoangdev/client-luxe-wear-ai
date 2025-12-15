import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bot, User as UserIcon, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Markdown from "@/components/markdown";
import { toast } from "sonner";
import type { Msg } from "../types";

interface ChatMessageProps {
  message: Msg;
  index: number;
  isStreaming: boolean;
  streamingContent: string;
}

export function ChatMessage({ message, index, isStreaming, streamingContent }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "h-9 w-9 shrink-0 border-2",
        isUser
          ? "bg-primary text-primary-foreground border-primary/20"
          : "bg-muted border-muted-foreground/20"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-semibold",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-background border rounded-bl-sm"
        )}>
          {message.role === "assistant" ? (
            <div className="space-y-4">
              {
                isStreaming ? (
                  // Đang streaming: hiển thị plain text để tránh parse Markdown liên tục
                  <div className="whitespace-pre-wrap break-words text-base leading-7 text-foreground/90" >
                    {streamingContent}
                  </div>
                ) : (
                  <div className="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-base prose-p:leading-7 prose-p:my-3 prose-li:text-base prose-li:my-1 prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
              {!isStreaming &&
                message.citations &&
                Array.isArray(message.citations) &&
                message.citations.length > 0 &&
                message.citations.some(c => c && (c.score > 0 || c.title || c.fileName)) && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground/80">Nguồn tham khảo</span>
                    </div>
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                      {message.citations.map((citation, idx) => (
                        <div
                          key={citation.id || idx}
                          className="group/citation text-sm bg-muted/30 hover:bg-muted/60 transition-colors rounded-lg p-3 border border-border/40 hover:border-primary/20"
                        >
                          <div className="flex items-start gap-2.5">
                            <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover/citation:text-primary transition-colors" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground/90 mb-1 leading-snug line-clamp-1">
                                {citation.title || citation.fileName || `Nguồn ${idx + 1}`}
                              </div>
                              <div className="space-y-1">
                                {citation.fileName && citation.fileName !== citation.title && (
                                  <div className="text-xs text-muted-foreground break-all">📄 {citation.fileName}</div>
                                )}
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/80">
                                  {citation.page !== undefined && <span>📑 Trang {citation.page + 1}</span>}
                                  {citation.line !== undefined && <span>📍 Dòng {citation.line + 1}</span>}
                                </div>
                                {citation.content && (
                                  <div className="text-xs mt-2 pt-2 border-t border-border/30 italic line-clamp-2 text-muted-foreground/70">
                                    &quot;{citation.content}&quot;
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words text-base leading-7">{message.content}</div>
          )}
        </div>

        {/* Timestamp and Actions */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="opacity-70">{new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-muted"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div >
    </div >
  );
}

