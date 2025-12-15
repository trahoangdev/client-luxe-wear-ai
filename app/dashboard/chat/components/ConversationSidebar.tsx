import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, History, Trash2, Search, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  sidebarOpen: boolean;
  onCreateNew: () => void;
  onSelect: (convId: string) => void;
  onDelete: (convId: string) => void;
  onRename: (convId: string, title: string) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  sidebarOpen,
  onCreateNew,
  onSelect,
  onDelete,
  onRename,
}: ConversationSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  };

  const saveEditing = (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditing(e);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };
  return (
    <div className={cn(
      "w-80 border-r bg-gradient-to-b from-background to-muted/30 transition-all duration-300 flex flex-col",
      !sidebarOpen && "hidden lg:block"
    )}>
      <div className="px-3 py-2.5 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Conversations</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateNew}
          className="h-7 w-7 p-0 hover:bg-primary/10"
          title="New Conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 h-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-1.5 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-xs text-muted-foreground p-3 text-center">
              No conversations yet. Start chatting to create one.
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-xs text-muted-foreground p-3 text-center">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv, index) => (
              <div
                key={conv.id}
                className={cn(
                  "group relative px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted/80 transition-all border border-transparent hover:border-muted-foreground/20",
                  "animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both",
                  currentConversationId === conv.id && "bg-primary/5 border-primary/20 shadow-sm"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSelect(conv.id)}
              >
                <div className="flex items-start justify-between gap-1.5 min-h-[40px]">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {editingId === conv.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={inputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-1 h-6 text-sm bg-background border rounded px-1 min-w-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={saveEditing}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={cancelEditing}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "text-sm font-medium truncate mb-0.5 block",
                            currentConversationId === conv.id && "text-primary"
                          )}
                          title={conv.title}
                        >
                          {conv.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{conv.messages.length} messages</span>
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== conv.id && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => startEditing(e, conv)}
                        title="Rename"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

