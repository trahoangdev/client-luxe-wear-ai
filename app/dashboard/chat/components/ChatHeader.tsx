import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus, History, X, Bot } from "lucide-react";
import type { Agent } from "../types";

interface ChatHeaderProps {
  agents: Agent[];
  agentId: string;
  lockedAgent: boolean;
  onAgentChange: (agentId: string) => void;
  onCreateNewChat: () => void;
  onClear: () => void;
  onExport: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  messagesCount: number;
}

export function ChatHeader({
  agents,
  agentId,
  lockedAgent,
  onAgentChange,
  onCreateNewChat,
  onClear,
  onExport,
  sidebarOpen,
  onToggleSidebar,
  messagesCount,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-4 pb-4 border-b">
      <div className="flex items-center gap-3 flex-1">
        <Label className="text-sm font-medium">Agent</Label>
        {!lockedAgent ? (
          <Select value={agentId} onValueChange={onAgentChange}>
            <SelectTrigger className="w-[260px] border-2">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {agents.find((a) => a.id === agentId)?.name || agentId}
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <History className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={onCreateNewChat}>
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClear}
          disabled={messagesCount === 0}
        >
          Clear
        </Button>
        <Button 
          size="sm"
          onClick={onExport} 
          disabled={messagesCount === 0}
          variant="secondary"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Export .md
        </Button>
      </div>
    </div>
  );
}

