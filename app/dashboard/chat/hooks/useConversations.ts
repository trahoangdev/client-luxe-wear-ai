import { useState, useEffect } from "react";
import type { Conversation, Msg } from "../types";

export function useConversations(agentId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage
  const loadConversations = (agentId: string) => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(`conversations:${agentId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(Array.isArray(parsed) ? parsed : []);
      } else {
        setConversations([]);
      }
    } catch {
      setConversations([]);
    }
  };

  // Save conversations to localStorage
  const saveConversations = (agentId: string, convs: Conversation[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`conversations:${agentId}`, JSON.stringify(convs));
    } catch (e) {
      console.error("Failed to save conversations:", e);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    if (!agentId) return;
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(agentId, updated);
    setCurrentConversationId(newConv.id);
    return newConv;
  };

  // Load conversation
  const loadConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConversationId(convId);
      return conv.messages;
    }
    return [];
  };

  // Delete conversation
  const deleteConversation = (convId: string) => {
    if (!agentId) return null;
    const conv = conversations.find(c => c.id === convId);
    const updated = conversations.filter(c => c.id !== convId);
    setConversations(updated);
    saveConversations(agentId, updated);
    if (currentConversationId === convId) {
      setCurrentConversationId(null);
    }
    return conv;
  };

  // Update conversation
  const updateConversation = (convId: string, updates: Partial<Conversation>) => {
    const updated = conversations.map(c => 
      c.id === convId ? { ...c, ...updates, updatedAt: Date.now() } : c
    );
    setConversations(updated);
    if (agentId) saveConversations(agentId, updated);
  };

  // Update conversation title
  const updateConversationTitle = (convId: string, title: string) => {
    updateConversation(convId, { title });
  };

  // Update conversation messages
  const updateConversationMessages = (convId: string, messages: Msg[]) => {
    updateConversation(convId, { messages });
  };

  // Save current conversation messages
  const saveCurrentConversation = (messages: Msg[]) => {
    if (agentId && currentConversationId && messages.length > 0) {
      const updated = conversations.map(c => {
        if (c.id === currentConversationId) {
          // Update title from first user message if it's still "New Conversation"
          let title = c.title;
          if (title === "New Conversation" || title === "") {
            const firstUserMsg = messages.find(m => m.role === "user");
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "");
            }
          }
          return {
            ...c,
            messages,
            updatedAt: Date.now(),
            title,
          };
        }
        return c;
      });
      setConversations(updated);
      saveConversations(agentId, updated);
    }
  };

  useEffect(() => {
    if (agentId) {
      loadConversations(agentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    updateConversationMessages,
    saveCurrentConversation,
  };
}

