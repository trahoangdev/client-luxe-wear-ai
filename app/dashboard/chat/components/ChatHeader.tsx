import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, History, Bot } from "lucide-react";
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
  sidebarOpen,
  onToggleSidebar,
  messagesCount,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 pb-3 sm:pb-4 border-b">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
        {/* Mobile toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden h-8 w-8 p-0 shrink-0"
          title={sidebarOpen ? "Close conversations" : "Open conversations"}
        >
          <History className="h-4 w-4" />
        </Button>
        
        <Label className="text-sm font-medium hidden sm:block">Agent</Label>
        {!lockedAgent ? (
          <Select value={agentId} onValueChange={onAgentChange}>
            <SelectTrigger className="w-full sm:w-[200px] lg:w-[260px] border-2">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted flex-1 sm:flex-initial">
            <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium truncate">
              {agents.find((a) => a.id === agentId)?.name || agentId}
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <Button variant="outline" size="sm" onClick={onCreateNewChat} className="flex-1 sm:flex-initial">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={messagesCount === 0}
          className="flex-1 sm:flex-initial"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

