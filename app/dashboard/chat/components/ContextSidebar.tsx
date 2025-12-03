import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_CONTEXT } from "../constants";

interface ContextSidebarProps {
  context: string;
  setContext: (value: string) => void;
}

export function ContextSidebar({ context, setContext }: ContextSidebarProps) {
  return (
    <div className="w-64 border-l bg-muted/30 p-4 space-y-3 hidden lg:block">
      <div className="text-sm font-semibold">Advanced</div>
      <div className="space-y-2">
        <Label htmlFor="ctx">Context (optional)</Label>
        <Textarea 
          id="ctx" 
          rows={8} 
          value={context} 
          onChange={(e) => setContext(e.target.value.slice(0, MAX_CONTEXT))} 
          placeholder="Provide extra context for the model..." 
        />
        <div className="text-xs text-muted-foreground">{context.length} / {MAX_CONTEXT}</div>
      </div>
    </div>
  );
}

