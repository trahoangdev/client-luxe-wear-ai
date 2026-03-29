import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bot, User as UserIcon, FileText, BookOpen, ChevronDown } from "lucide-react";
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
  const [sourcesOpen, setSourcesOpen] = useState(false);
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
        "group flex gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "h-7 w-7 sm:h-9 sm:w-9 shrink-0 border-2",
        isUser
          ? "bg-primary text-primary-foreground border-primary/20"
          : "bg-muted border-muted-foreground/20"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-semibold",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-1 sm:gap-2 max-w-[85%] sm:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm transition-all hover:shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-background border rounded-bl-sm"
        )}>
          {message.role === "assistant" ? (
            <div className="space-y-4">
              {
                isStreaming ? (
                  // Streaming: render Markdown real-time để format ngay khi nhận được
                  <div className="prose max-w-none dark:prose-invert">
                    <Markdown>{streamingContent}</Markdown>
                    <span className="inline-flex items-center gap-0.5 ml-1 align-middle">
                      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" />
                    </span>
                  </div>
                ) : (
                  <div className="prose max-w-none dark:prose-invert">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
              {!isStreaming &&
                message.citations &&
                Array.isArray(message.citations) &&
                message.citations.length > 0 &&
                message.citations.some(c => c && (c.score > 0 || c.title || c.fileName)) && (
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setSourcesOpen(!sourcesOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    >
                      <BookOpen className="h-3 w-3" />
                      Nguồn
                      <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                        {message.citations.filter(c => c && (c.score > 0 || c.title || c.fileName)).length}
                      </span>
                      <ChevronDown className={cn("h-3 w-3 transition-transform", sourcesOpen && "rotate-180")} />
                    </button>
                    {sourcesOpen && (
                      <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {message.citations.filter(c => c && (c.score > 0 || c.title || c.fileName)).map((citation, idx) => (
                          <div
                            key={citation.id || idx}
                            className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors group/citation"
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover/citation:text-primary transition-colors" />
                            <span className="font-medium text-foreground/80 truncate">
                              {citation.title || citation.fileName || `Nguồn ${idx + 1}`}
                            </span>
                            {citation.content && (
                              <span className="text-muted-foreground/60 truncate hidden sm:inline italic">
                                — {citation.content.slice(0, 60)}…
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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

