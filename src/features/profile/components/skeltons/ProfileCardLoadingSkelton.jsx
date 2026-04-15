import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProfileCardLoadingSkelton({
  fields = 6,
  columns = 3,
  hasActions = true,
}) {
  return (
    <div className="rounded-3xl bg-card border p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <Skeleton className="h-8 w-8 rounded-md" />

          {/* Title skeleton */}
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Actions skeleton */}
        {hasActions && (
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        )}
      </div>

      {/* BODY */}
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
