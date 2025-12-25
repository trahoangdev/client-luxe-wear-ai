import { useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import type { Msg } from "../types";

interface ChatMessageListProps {
  messages: Msg[];
  loading: boolean;
  streamingMessageId: number | null;
  streamingContent: string;
  onPromptClick?: (text: string) => void;
  agentName?: string;
}

export function ChatMessageList({ messages, loading, streamingMessageId, streamingContent, onPromptClick, agentName }: ChatMessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll khi có message mới
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll khi streaming content update
  useEffect(() => {
    if (streamingMessageId !== null && streamingContent) {
      scrollToBottom();
    }
  }, [streamingContent, streamingMessageId, scrollToBottom]);

  return (
    <div ref={listRef} className="h-[calc(100vh-20rem)] sm:h-[calc(100vh-18rem)] md:h-[520px] overflow-y-auto rounded-xl md:rounded-2xl border bg-gradient-to-b from-background to-muted/20 p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth">
      {messages.length === 0 ? (
        <EmptyState onPromptClick={onPromptClick} agentName={agentName} />
      ) : (
        <div className="space-y-6">
          {messages.map((m, i) => (
            <ChatMessage
              key={i}
              message={m}
              index={i}
              isStreaming={streamingMessageId === i}
              streamingContent={streamingContent}
            />
          ))}

          {/* Typing Indicator */}
          {loading && streamingMessageId === null && <TypingIndicator />}
        </div>
      )}
    </div>
  );
}

