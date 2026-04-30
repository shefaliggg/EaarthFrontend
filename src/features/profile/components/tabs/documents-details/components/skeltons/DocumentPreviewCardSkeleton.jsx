import { Skeleton } from "@/shared/components/ui/skeleton";

export function DocumentPreviewCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-background shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* ── PREVIEW AREA ── */}
      <div className="relative aspect-square bg-muted/30 flex items-center justify-center m-1.5 rounded-md overflow-hidden">
        {/* top-left badge */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* top-right badge */}
        <div className="absolute top-3 right-3 flex gap-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 space-y-3 flex-1">
        {/* title */}
        <Skeleton className="h-4 w-3/4 rounded" />

        {/* subtitle */}
        <Skeleton className="h-3 w-1/2 rounded" />

        {/* meta row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>

        {/* usage */}
        <Skeleton className="h-3 w-32 rounded" />

        {/* notes */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 mt-auto">
        {/* left button */}
        <Skeleton className="h-8 w-8 rounded-md" />

        {/* right actions */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
