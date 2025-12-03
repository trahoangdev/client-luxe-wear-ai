import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import type { Msg } from "../types";

interface ChatMessageListProps {
  messages: Msg[];
  loading: boolean;
  streamingMessageId: number | null;
  streamingContent: string;
}

export function ChatMessageList({ messages, loading, streamingMessageId, streamingContent }: ChatMessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={listRef} className="h-[520px] overflow-y-auto rounded-2xl border bg-gradient-to-b from-background to-muted/20 p-6 space-y-6">
      {messages.length === 0 ? (
        <EmptyState />
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

