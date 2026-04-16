import React from "react";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { Skeleton } from "../../../../shared/components/ui/skeleton";
import { History } from "lucide-react";

function SignatureLoadingSkelton() {
  return (
    <CardWrapper
      title={"My Signature"}
      icon={"PenTool"}
      actions={
        <div className="flex gap-2">
          <Skeleton className="h-8 w-30 rounded-md" />
          <Skeleton className="h-8 w-30 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Signature Card Skeleton */}
        <div className="rounded-2xl bg-card border border-muted overflow-hidden shadow-sm mt-4">
          <div className="text-muted-foreground/70 text-sm p-3 px-6 flex items-center justify-end gap-2">
            <History className="size-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          {/* Signature Image Area */}
          <div className="p-8 pb-10 flex justify-center items-center min-h-[216px]">
            <div className="w-full max-w-[320px] flex justify-center">
              <p
                className="text-7xl text-primary/20 animate-pulse"
                style={{
                  fontFamily: "Qwitcher Grypen",
                  fontWeight: 700,
                }}
              >
                Your Signature
              </p>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between text-xs">
              {/* Left Side (Calendar + User) */}
              <div className="flex items-center gap-4">
                {/* Calendar row */}
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* User row */}
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Active status */}
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Verified */}
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

export default SignatureLoadingSkelton;
