import { Skeleton } from "@/shared/components/ui/skeleton";

export function DocumentListCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-background">
      {/* ── LEFT ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon placeholder */}
        <Skeleton className="w-10 h-10 rounded-md shrink-0" />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-4 rounded-full" /> {/* primary badge */}
            <Skeleton className="h-5 w-20 rounded-full" /> {/* type badge */}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </div>

      {/* ── STATUS ── */}
      <div className="mx-4 shrink-0">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}
