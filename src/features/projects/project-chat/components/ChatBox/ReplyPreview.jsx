// src/features/chat/components/ChatBox/ReplyPreview.jsx
// ✅ EXACT UI: Reply preview matching original design

import React from "react";
import { Reply, X } from "lucide-react";

export default function ReplyPreview({ replyTo, onClose }) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border-l-4 border-primary">
      <Reply className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-primary mb-0.5 truncate">
          Replying to {replyTo.senderName}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {replyTo.preview}
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-muted rounded flex-shrink-0"
        aria-label="Cancel reply"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}