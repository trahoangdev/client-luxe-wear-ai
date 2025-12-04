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
            <div className="space-y-3">
              {isStreaming ? (
                // Đang streaming: hiển thị plain text để tránh parse Markdown liên tục
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {streamingContent}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
              {!isStreaming && 
               message.citations && 
               Array.isArray(message.citations) &&
               message.citations.length > 0 && 
               message.citations.some(c => c && (c.score > 0 || c.title || c.fileName)) && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Nguồn tham khảo:</span>
                  </div>
                  <div className="space-y-1.5">
                    {message.citations.map((citation, idx) => (
                      <div
                        key={citation.id || idx}
                        className="text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5 border border-border/40"
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground/70" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground/90 mb-0.5">
                              {citation.title || citation.fileName || `Nguồn ${idx + 1}`}
                            </div>
                            <div className="space-y-0.5">
                              {citation.fileName && citation.fileName !== citation.title && (
                                <div className="text-[10px]">📄 File: {citation.fileName}</div>
                              )}
                              {citation.page !== undefined && (
                                <div className="text-[10px]">📑 Trang: {citation.page + 1}</div>
                              )}
                              {citation.line !== undefined && (
                                <div className="text-[10px]">📍 Dòng: {citation.line + 1}</div>
                              )}
                              {citation.content && (
                                <div className="text-[10px] mt-1 italic line-clamp-2 text-muted-foreground/80">
                                  "{citation.content}"
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
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</div>
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
      </div>
    </div>
  );
}

