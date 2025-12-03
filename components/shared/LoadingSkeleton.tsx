import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  /** Optional text shown under the skeletons, e.g. \"Đang tải dữ liệu...\" */
  label?: string;
  /** Number of skeleton rows/cards */
  count?: number;
}

export function LoadingSkeleton({ label, count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border bg-background/40 p-4 space-y-3"
        >
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
      {label && (
        <p className="text-xs text-muted-foreground text-center">{label}</p>
      )}
    </div>
  );
}


