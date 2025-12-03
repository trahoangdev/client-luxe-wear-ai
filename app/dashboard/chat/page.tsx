"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAgents } from "./hooks/useAgents";
import { useConversations } from "./hooks/useConversations";
import { useChat } from "./hooks/useChat";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessageList } from "./components/ChatMessageList";
import { ChatInput } from "./components/ChatInput";
import { ContextSidebar } from "./components/ContextSidebar";
import { DeleteConversationDialog } from "./components/DeleteConversationDialog";

export default function ChatPage() {
  const search = useSearchParams();
  const initialAgentId = search.get("agentId") || "";
  const lockedAgent = Boolean(initialAgentId);

  const [input, setInput] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const { agents, agentId, setAgentId } = useAgents(initialAgentId);
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    loadConversation,
    deleteConversation: deleteConv,
    saveCurrentConversation,
  } = useConversations(agentId);

  const {
    messages,
    setMessages,
    loading,
    streamingMessageId,
    streamingContent,
    send: sendMessage,
  } = useChat(agentId, context);

  // Load conversation messages when switching conversations
  useEffect(() => {
    if (currentConversationId) {
      const loadedMessages = loadConversation(currentConversationId);
      setMessages(loadedMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId]);

  // Save messages to current conversation
  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentConversation(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Reset when switching agent
  useEffect(() => {
    if (!agentId) return;
    setCurrentConversationId(null);
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const handleCreateNewConversation = () => {
    createNewConversation();
    setMessages([]);
  };

  const handleLoadConversation = (convId: string) => {
    const loadedMessages = loadConversation(convId);
    setMessages(loadedMessages);
  };

  const handleDeleteConversation = () => {
    if (!conversationToDelete) return;
    const conv = deleteConv(conversationToDelete);
    if (currentConversationId === conversationToDelete) {
      setMessages([]);
    }
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
    toast.success(`Conversation "${conv?.title || 'Untitled'}" deleted`);
  };

  const openDeleteDialog = (convId: string) => {
    setConversationToDelete(convId);
    setDeleteDialogOpen(true);
  };

  const exportMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# Chat with Agent ${agents.find((a) => a.id === agentId)?.name || ""}`);
    lines.push("");
    messages.forEach((m) => {
      lines.push(`**${m.role.toUpperCase()}**:`);
      lines.push("");
      lines.push(m.content);
      lines.push("");
      lines.push("---");
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${agentId}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    
    // Create new conversation if none exists
    if (!currentConversationId) {
      createNewConversation();
    }
    
    setInput("");
    await sendMessage(text);
  };

  const handleClear = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const conversationToDeleteData = conversations.find(c => c.id === conversationToDelete) || null;

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)] -ml-40">
      {/* Conversation History Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        sidebarOpen={sidebarOpen}
        onCreateNew={handleCreateNewConversation}
        onSelect={handleLoadConversation}
        onDelete={openDeleteDialog}
      />

      {/* Main Chat Area */}
      <div className="flex-1 space-y-4">
        <ChatHeader
          agents={agents}
          agentId={agentId}
          lockedAgent={lockedAgent}
          onAgentChange={setAgentId}
          onCreateNewChat={handleCreateNewConversation}
          onClear={handleClear}
          onExport={exportMarkdown}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          messagesCount={messages.length}
        />

        <ChatMessageList
          messages={messages}
          loading={loading}
          streamingMessageId={streamingMessageId}
          streamingContent={streamingContent}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          loading={loading}
          agentId={agentId}
          onSend={handleSend}
        />
      </div>

      {/* Context Sidebar */}
      <ContextSidebar context={context} setContext={setContext} />

      {/* Delete Conversation Dialog */}
      <DeleteConversationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversation={conversationToDeleteData}
        onConfirm={handleDeleteConversation}
      />
    </div>
  );
}
