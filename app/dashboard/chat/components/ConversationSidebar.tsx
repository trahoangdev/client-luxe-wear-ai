import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, History, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  sidebarOpen: boolean;
  onCreateNew: () => void;
  onSelect: (convId: string) => void;
  onDelete: (convId: string) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  sidebarOpen,
  onCreateNew,
  onSelect,
  onDelete,
}: ConversationSidebarProps) {
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
      <ScrollArea className="flex-1">
        <div className="px-2 py-1.5 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-xs text-muted-foreground p-3 text-center">
              No conversations yet. Start chatting to create one.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group relative px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted/80 transition-all border border-transparent hover:border-muted-foreground/20",
                  currentConversationId === conv.id && "bg-primary/5 border-primary/20 shadow-sm"
                )}
                onClick={() => onSelect(conv.id)}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex-1 min-w-0 overflow-hidden">
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
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

