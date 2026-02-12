// src/features/chat/components/ChatBox/FileAttachmentMenu.jsx
// ✅ EXACT UI: File attachment menu matching original design

import React from "react";
import { Image as ImageIcon, Video as VideoIcon, FileText, MapPin } from "lucide-react";

function AttachmentButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-primary/20 transition-colors min-w-[60px]"
      title={label}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default function FileAttachmentMenu({ onImageClick, onVideoClick, onFileClick }) {
  return (
    <div className="absolute bottom-14 left-0 bg-card border rounded-xl shadow-xl p-2 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <AttachmentButton icon={ImageIcon} label="Photo" onClick={onImageClick} />
      <AttachmentButton icon={VideoIcon} label="Video" onClick={onVideoClick} />
      <AttachmentButton icon={FileText} label="File" onClick={onFileClick} />
      <AttachmentButton
        icon={MapPin}
        label="Location"
        onClick={() => alert("Location sharing coming soon!")}
      />
    </div>
  );
}