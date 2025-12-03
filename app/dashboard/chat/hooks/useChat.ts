import { useState, useRef, useEffect } from "react";
import { chat as chatApi } from "@/services/chatService";
import { toast } from "sonner";
import { trackEvent, reportError } from "@/services/observabilityService";
import type { Msg } from "../types";

export function useChat(agentId: string, context: string) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const send = async (text: string) => {
    if (!agentId) return toast.error("Please select an agent");
    if (!text.trim()) return;
    
    const userMsg: Msg = { role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    
    try {
      const res = await chatApi(agentId, { message: text, context: context || undefined });
      const reply =
        (res as { data?: { response?: string; message?: string }; message?: string }).data?.response ||
        (res as { data?: { response?: string; message?: string }; message?: string }).data?.message ||
        (res as { data?: { response?: string; message?: string }; message?: string }).message ||
        "(no response)";
      
      // Create placeholder message for streaming
      const assistantMsg: Msg = { role: "assistant", content: "", ts: Date.now() };
      let messageIndex: number;
      setMessages((prev) => {
        const newMessages = [...prev, assistantMsg];
        messageIndex = newMessages.length - 1;
        setStreamingMessageId(messageIndex);
        return newMessages;
      });
      setLoading(false);
      
      // Start typing animation
      let currentIndex = 0;
      const typeNextChar = () => {
        if (currentIndex < reply.length) {
          setStreamingContent(reply.slice(0, currentIndex + 1));
          currentIndex++;
          streamingTimeoutRef.current = setTimeout(typeNextChar, 30); // 30ms per character
        } else {
          // Animation complete, update the actual message
          setMessages((prev) => {
            const updated = [...prev];
            if (messageIndex !== undefined && updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                content: reply,
              };
            }
            return updated;
          });
          setStreamingMessageId(null);
          setStreamingContent("");
        }
      };
      typeNextChar();
      
      void trackEvent("chat_message_sent", {
        agentId,
        hasContext: Boolean(context),
        length: text.length,
        page: "dashboard_chat",
      });
    } catch (e) {
      const err = e as { message?: string; response?: { data?: { message?: string } } };
      // Clear streaming state on error
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      setStreamingMessageId(null);
      setStreamingContent("");
      if (err?.message === "CHAT_TIMEOUT") {
        toast.error("Phản hồi mất hơn 20 giây, vui lòng thử lại.");
      } else {
        toast.error(err.response?.data?.message || err.message || "Chat failed");
      }
      void reportError(err, {
        component: "DashboardChatPage",
        extra: { agentId },
      });
    } finally {
      // Don't set loading to false here if streaming is active
      if (!streamingMessageId) {
        setLoading(false);
      }
    }
  };

  // Cleanup streaming timeout on unmount
  useEffect(() => {
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    setMessages,
    loading,
    streamingMessageId,
    streamingContent,
    send,
  };
}

