import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

export default function HistorySignatureSkelton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="py-0 overflow-hidden border-muted/60">
          <div className="p-5 space-y-4">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-muted rounded-md" />
                  <div className="h-5 w-14 bg-muted rounded-full" />
                </div>
                <div className="h-3 w-32 bg-muted rounded-md" />
              </div>

              <div className="h-5 w-20 bg-muted rounded-full" />
            </div>

            {/* SIGNATURE PREVIEW */}
            <div className="rounded-xl p-6 border-2 border-dashed bg-muted/20">
              <div className="h-28 w-full bg-muted rounded-lg" />
            </div>

            {/* METADATA */}
            <div className="space-y-2 px-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>

              <div className="flex justify-between">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>

            {/* CHANGE REASON (optional block placeholder always shown in skeleton) */}
            <div className="space-y-2">
              <Separator />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
              </div>
            </div>

            {/* CERTIFICATE BLOCK */}
            <div className="rounded-lg border border-muted bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <div className="h-8 w-28 bg-muted rounded-md" />
              <div className="h-8 w-28 bg-muted rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
