import React from "react";
import {
  Edit3,
  X,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
} from "lucide-react";

export default function EditBanner({ message, onClose }) {
  if (!message) return null;

  const files = message.files || [];
  const visibleFiles = files.slice(0, 5);
  const remainingCount = files.length - 5;

  const renderAttachment = (file, index) => {
    const mime = file.mime || "";

    if (mime.startsWith("image/")) {
      if (file.url) {
        return (
          <img
            key={index}
            src={file.url}
            alt="preview"
            className="w-10 h-10 object-cover rounded-md border"
          />
        );
      }

      return (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center bg-muted rounded-md border"
        >
          <ImageIcon size={16} />
        </div>
      );
    }

    if (mime.startsWith("video/")) {
      return (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center bg-muted rounded-md border"
        >
          <Video size={16} />
        </div>
      );
    }

    if (mime.startsWith("audio/")) {
      return (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center bg-muted rounded-md border"
        >
          <Music size={16} />
        </div>
      );
    }

    return (
      <div
        key={index}
        className="w-10 h-10 flex items-center justify-center bg-muted rounded-md border"
      >
        <FileText size={16} />
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-xl border-l-4 border-primary">
      <Edit3 className="w-4 h-4 text-primary flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-primary mb-1 truncate">
          Editing message
        </div>

        {/* TEXT MESSAGE */}
        {message.content && (
          <div className="text-xs text-muted-foreground truncate">
            {message.content}
          </div>
        )}

        {/* ATTACHMENTS */}
        {files.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {visibleFiles.map(renderAttachment)}

            {remainingCount > 0 && (
              <div className="w-10 h-10 flex items-center justify-center text-xs bg-muted rounded-md border">
                +{remainingCount}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-muted rounded flex-shrink-0"
        aria-label="Cancel editing"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}