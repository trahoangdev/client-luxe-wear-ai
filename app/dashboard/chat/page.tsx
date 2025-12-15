"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useAgents } from "./hooks/useAgents";
import { useConversations } from "./hooks/useConversations";
import { useChat } from "./hooks/useChat";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessageList } from "./components/ChatMessageList";
import { ChatInput } from "./components/ChatInput";
import { ContextSidebar } from "./components/ContextSidebar";
import { DeleteConversationDialog } from "./components/DeleteConversationDialog";

import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function ChatPage() {
  const search = useSearchParams();
  const initialAgentId = search.get("agentId") || "";
  const lockedAgent = Boolean(initialAgentId);

  const [input, setInput] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const isCreatingConvRef = useRef(false);

  const { agents, agentId, setAgentId } = useAgents(initialAgentId);
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    loadConversation,
    deleteConversation: deleteConv,
    saveCurrentConversation,
    updateConversationTitle,
  } = useConversations(agentId);

  const {
    messages,
    setMessages,
    loading,
    streamingMessageId,
    streamingContent,
    send: sendMessage,
    stop,
    reload,
  } = useChat(agentId, context);

  // Load conversation messages when switching conversations
  useEffect(() => {
    if (currentConversationId) {
      // Skip loading if we just created this conversation (to preserve the new message being sent)
      if (isCreatingConvRef.current) {
        isCreatingConvRef.current = false;
        return;
      }
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

    // Create new conversation if none exists - do this BEFORE sending message
    // so the conversation appears in sidebar immediately
    if (!currentConversationId) {
      isCreatingConvRef.current = true;
      const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
      createNewConversation(title);
    }

    setInput("");
    await sendMessage(text);
  };

  const handleClear = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const conversationToDeleteData = conversations.find(c => c.id === conversationToDelete) || null;

  const handlePromptClick = async (text: string) => {
    if (!currentConversationId) {
      isCreatingConvRef.current = true;
      const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
      createNewConversation(title);
    }
    await sendMessage(text);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Conversation History Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        sidebarOpen={sidebarOpen}
        onCreateNew={handleCreateNewConversation}
        onSelect={handleLoadConversation}
        onDelete={openDeleteDialog}
        onRename={updateConversationTitle}
      />

      {/* Main Chat Area */}
      <div className="flex-1 space-y-4">
        <ErrorBoundary name="ChatArea">
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
            onPromptClick={handlePromptClick}
            agentName={agents.find(a => a.id === agentId)?.name}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            loading={loading}
            agentId={agentId}
            onSend={handleSend}
            onStop={stop}
          />
          {!loading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div className="flex justify-center pb-2">
              <Button variant="ghost" size="sm" onClick={reload} className="text-xs text-muted-foreground gap-1 hover:text-foreground">
                <RotateCcw className="h-3 w-3" /> Regenerate Response
              </Button>
            </div>
          )}
        </ErrorBoundary>
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
