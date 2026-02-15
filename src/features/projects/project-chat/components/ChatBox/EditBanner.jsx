// src/features/chat/components/ChatBox/EditBanner.jsx
// ✅ EXACT UI: Edit banner matching original design

import React from "react";
import { Edit3, X } from "lucide-react";

export default function EditBanner({ onClose }) {
  return (
    <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
      <Edit3 className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <div className="flex-1 text-xs text-blue-600 font-medium">
        Editing message
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-blue-500/20 rounded flex-shrink-0"
        aria-label="Cancel editing"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}