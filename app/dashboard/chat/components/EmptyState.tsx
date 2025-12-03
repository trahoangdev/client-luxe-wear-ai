import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">Start a conversation</h3>
        <p className="text-sm text-muted-foreground">Send a message to begin chatting with your AI agent</p>
      </div>
    </div>
  );
}

