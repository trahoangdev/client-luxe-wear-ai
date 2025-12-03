interface LoadingGridProps {
  /** Number of placeholder cards to render */
  count?: number;
}

export function LoadingGrid({ count = 4 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border overflow-hidden animate-pulse">
          <div className="h-56 bg-muted" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}


