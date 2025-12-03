import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function ErrorState({
  title = "Đã xảy ra lỗi",
  description = "Vui lòng thử tải lại trang hoặc thử lại sau.",
  actionLabel = "Thử lại",
  onAction,
  icon,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4">
      {icon && (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 text-destructive">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-md">
        <h2 className="text-base md:text-lg font-semibold text-destructive">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onAction && (
        <Button variant="destructive" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}


