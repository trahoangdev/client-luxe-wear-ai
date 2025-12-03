"use client";

import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * TableSkeleton component for loading states
 * Displays a skeleton table with animated loading bars
 */
export function TableSkeleton({ 
  rows = 5, 
  cols = 4, 
  className,
  showHeader = true 
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        {showHeader && (
          <div className="border-b bg-muted/50">
            <div className="flex gap-4 p-4">
              {Array.from({ length: cols }).map((_, i) => (
                <div
                  key={`header-${i}`}
                  className="h-4 flex-1 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        )}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cn(
                    "h-5 flex-1 bg-muted rounded animate-pulse",
                    colIndex === 0 && "w-24", // First column slightly smaller
                    colIndex === cols - 1 && "w-32" // Last column slightly larger
                  )}
                  style={{
                    animationDelay: `${(rowIndex * cols + colIndex) * 50}ms`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact table skeleton for smaller tables
 */
export function CompactTableSkeleton({ 
  rows = 3, 
  cols = 3,
  className 
}: Omit<TableSkeletonProps, "showHeader">) {
  return (
    <TableSkeleton 
      rows={rows} 
      cols={cols} 
      className={className}
      showHeader={false}
    />
  );
}

