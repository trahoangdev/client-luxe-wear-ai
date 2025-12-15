import { useState, useRef, useEffect } from "react";
import { chat as chatApi } from "@/services/chatService";
import { toast } from "sonner";
import { trackEvent, reportError } from "@/services/observabilityService";
import type { Msg, Citation } from "../types";

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
      const citations = (res as { data?: { citations?: Citation[] } }).data?.citations || [];

      // Create placeholder message for streaming
      const assistantMsg: Msg = {
        role: "assistant",
        content: "",
        ts: Date.now(),
        citations: citations.length > 0 ? citations : undefined
      };
      let messageIndex: number;
      setMessages((prev) => {
        const newMessages = [...prev, assistantMsg];
        messageIndex = newMessages.length - 1;
        setStreamingMessageId(messageIndex);
        return newMessages;
      });
      // Do NOT set loading false here, wait for streaming to finish

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
                citations: citations.length > 0 ? citations : undefined,
              };
            }
            return updated;
          });
          setStreamingMessageId(null);
          setStreamingContent("");
          setLoading(false); // Set loading false ONLY when streaming is done
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
      setLoading(false); // Ensure loading is reset on error

      if (err?.message === "CHAT_TIMEOUT") {
        toast.error("Phản hồi mất hơn 20 giây, vui lòng thử lại.");
      } else {
        toast.error(err.response?.data?.message || err.message || "Chat failed");
      }
      void reportError(err, {
        component: "DashboardChatPage",
        extra: { agentId },
      });
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

  const stop = () => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }
    // Update message with current streaming content
    if (streamingMessageId !== null) {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[streamingMessageId]) {
          updated[streamingMessageId] = {
            ...updated[streamingMessageId],
            content: streamingContent, // Save partial content
          };
        }
        return updated;
      });
      setStreamingMessageId(null);
      setStreamingContent("");
      setLoading(false);
    }
  };

  const reload = async () => {
    const lastUserMsgIndex = messages.findLastIndex(m => m.role === "user");
    if (lastUserMsgIndex === -1) return;

    const lastUserMsg = messages[lastUserMsgIndex];

    // Remove all messages after the last user message
    setMessages(prev => prev.slice(0, lastUserMsgIndex + 1));

    // Re-send logic (copied from send but without adding user message)
    if (!agentId) return toast.error("Please select an agent");
    const text = lastUserMsg.content;
    setLoading(true);

    try {
      const res = await chatApi(agentId, { message: text, context: context || undefined });
      const reply =
        (res as { data?: { response?: string; message?: string }; message?: string }).data?.response ||
        (res as { data?: { response?: string; message?: string }; message?: string }).data?.message ||
        (res as { data?: { response?: string; message?: string }; message?: string }).message ||
        "(no response)";
      const citations = (res as { data?: { citations?: Citation[] } }).data?.citations || [];

      const assistantMsg: Msg = {
        role: "assistant",
        content: "",
        ts: Date.now(),
        citations: citations.length > 0 ? citations : undefined
      };

      let messageIndex: number;
      setMessages((prev) => {
        const newMessages = [...prev, assistantMsg];
        messageIndex = newMessages.length - 1;
        setStreamingMessageId(messageIndex);
        return newMessages;
      });
      // Do NOT set loading false here

      let currentIndex = 0;
      const typeNextChar = () => {
        if (currentIndex < reply.length) {
          setStreamingContent(reply.slice(0, currentIndex + 1));
          currentIndex++;
          streamingTimeoutRef.current = setTimeout(typeNextChar, 30);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            if (messageIndex !== undefined && updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                content: reply,
                citations: citations.length > 0 ? citations : undefined,
              };
            }
            return updated;
          });
          setStreamingMessageId(null);
          setStreamingContent("");
          setLoading(false); // Set loading false ONLY when streaming is done
        }
      };
      typeNextChar();

      void trackEvent("chat_message_regenerated", {
        agentId,
        hasContext: Boolean(context),
        page: "dashboard_chat",
      });
    } catch (e) {
      const err = e as { message?: string; response?: { data?: { message?: string } } };
      if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);
      setStreamingMessageId(null);
      setStreamingContent("");
      setLoading(false); // Ensure loading is reset on error
      toast.error(err.response?.data?.message || err.message || "Regenerate failed");
    }
  };

  return {
    messages,
    setMessages,
    loading,
    streamingMessageId,
    streamingContent,
    send,
    stop,
    reload,
  };
}

