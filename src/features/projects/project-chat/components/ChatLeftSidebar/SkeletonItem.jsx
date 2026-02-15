// src/features/chat/components/ChatLeftSidebar/SkeletonItem.jsx
// ✅ Skeleton loader for conversation items during loading state

import React from "react";

export default function SkeletonItem() {
  return (
    <div className="w-full px-3 py-2.5 rounded-md animate-pulse">
      <div className="flex items-center gap-2.5">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            {/* Name skeleton */}
            <div className="h-3 bg-muted rounded w-24" />
            {/* Time skeleton */}
            <div className="h-2 bg-muted rounded w-12" />
          </div>
          
          {/* Message preview skeleton */}
          <div className="space-y-1">
            <div className="h-2.5 bg-muted rounded w-full" />
            <div className="h-2.5 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}