import { type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_INPUT } from "../constants";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  agentId: string | null;
  onSend: () => void;
}

export function ChatInput({ input, setInput, loading, agentId, onSend }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      // Ctrl+Enter: chủ động chèn xuống dòng
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd, value } = target;
      const nextValue =
        value.slice(0, selectionStart ?? value.length) +
        "\n" +
        value.slice(selectionEnd ?? value.length);
      setInput(nextValue.slice(0, MAX_INPUT));
      // Đưa caret xuống dòng mới
      requestAnimationFrame(() => {
        const pos = (selectionStart ?? 0) + 1;
        target.selectionStart = target.selectionEnd = pos;
      });
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      // Enter: gửi tin nhắn
      e.preventDefault();
      if (!loading && agentId && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
          placeholder="Type your message... (Press Enter to send, Ctrl+Enter for new line)"
          className="pr-12 resize-none border-2 focus:border-primary/50 transition-colors"
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={onSend}
          disabled={loading || !agentId || !input.trim()}
          size="sm"
          className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className={cn(
          "transition-colors",
          input.length > MAX_INPUT * 0.9 && "text-orange-600",
          input.length >= MAX_INPUT && "text-red-600"
        )}>
          {input.length} / {MAX_INPUT}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            Enter to send
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            Ctrl+Enter for new line
          </Badge>
        </div>
      </div>
    </div>
  );
}

