import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/config/utils";

export default function ChatLoaderSkeleton({ count = 2 }) {
  return (
    <div className="flex flex-col gap-3 p-2">
      {Array.from({ length: count }).map((_, i) => {
        const isOwn = i % 2 === 0; // alternate left/right

        return (
          <div
            key={i}
            className={cn(
              "flex gap-1",
              isOwn ? "flex-row-reverse" : "flex-row",
            )}
          >
            {/* Avatar */}
            {!isOwn && <Skeleton className="w-8 h-8 rounded-full" />}
            <div className="flex flex-col max-w-[60%] gap-1">
              {/* Message bubble */}
              <Skeleton
                className={cn(
                  "p-2 rounded-2xl h-10 w-42",
                  isOwn ? "ml-auto bg-primary/30" : "bg-muted",
                  isOwn ? "rounded-tr-none" : "rounded-tl-none",
                )}
              />
              {/* Timestamp */}
              <Skeleton
                className={cn("h-3 w-10 bg-primary/30", isOwn ? "ml-auto" : "")}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
