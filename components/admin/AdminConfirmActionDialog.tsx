import { useCallback } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export type AdminActionType = "delete" | "suspend" | "activate" | "reset";

export interface AdminActionState<T = any> {
  type: AdminActionType;
  target: T | null;
  title?: string;
  description?: string;
}

interface AdminConfirmActionDialogProps<T = any> {
  action: AdminActionState<T> | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (action: AdminActionState<T>) => Promise<void> | void;
}

export function AdminConfirmActionDialog<T>({
  action,
  onOpenChange,
  onConfirm,
}: AdminConfirmActionDialogProps<T>) {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onOpenChange(false);
      }
    },
    [onOpenChange],
  );

  if (!action || !action.target) return null;

  const { type, title, description } = action;

  const defaultTitleMap: Record<AdminActionType, string> = {
    delete: "Bạn có chắc chắn muốn xoá?",
    suspend: "Tạm dừng đối tượng này?",
    activate: "Kích hoạt lại đối tượng này?",
    reset: "Thực hiện thao tác này?",
  };

  const defaultConfirmLabelMap: Record<AdminActionType, string> = {
    delete: "Xoá",
    suspend: "Tạm dừng",
    activate: "Kích hoạt",
    reset: "Xác nhận",
  };

  const finalTitle = title || defaultTitleMap[type];
  const finalConfirmLabel = defaultConfirmLabelMap[type];

  return (
    <ConfirmDialog
      open={!!action}
      onOpenChange={handleOpenChange}
      title={finalTitle}
      description={description}
      confirmLabel={finalConfirmLabel}
      confirmVariant={type === "delete" || type === "suspend" ? "destructive" : "default"}
      onConfirm={async () => {
        await onConfirm(action);
        onOpenChange(false);
      }}
    />
  );
}


