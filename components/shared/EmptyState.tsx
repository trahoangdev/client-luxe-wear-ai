import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed rounded-3xl bg-muted/10 hover:bg-muted/20 transition-colors space-y-6">
      {icon && (
        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-background to-muted shadow-sm border mb-2">
          {icon}
        </div>
      )}
      <div className="space-y-2 max-w-md">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      </div>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          {actionLabel && onAction && (
            <Button onClick={onAction} size="lg" className="min-w-[140px] shadow-md hover:shadow-lg transition-all">{actionLabel}</Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction} size="lg">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}


