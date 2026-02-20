import React from "react";
import {
  Reply,
  X,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
} from "lucide-react";

export default function ReplyToMessagePreview({ replyTo, onClose }) {
  if (!replyTo) return null;

  const isMedia = replyTo.type?.toLowerCase() === "media";
  const files = replyTo.files || [];
  const visibleFiles = files.slice(0, 5);
  const remainingCount = files.length - 5;

  const renderAttachment = (file, index) => {
    const mime = file.mime || "";

    // IMAGE
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

    // VIDEO
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

    // AUDIO
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

    // DOCUMENT / OTHER
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
    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border-l-4 border-primary">
      <Reply className="w-4 h-4 text-primary flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-primary mb-1 truncate">
          Replying to {replyTo.sender}
        </div>

        {/* ================= TEXT MESSAGE ================= */}
        {!isMedia && (
          <div className="text-xs text-muted-foreground truncate">
            {replyTo.preview}
          </div>
        )}

        {/* ================= MEDIA MESSAGE ================= */}
        {isMedia && (
          <div className="flex flex-col gap-1">
            {/* Attachment List */}
            <div className="flex gap-1 flex-wrap">
              {visibleFiles.map(renderAttachment)}

              {remainingCount > 0 && (
                <div className="w-10 h-10 flex items-center justify-center text-xs bg-muted rounded-md border">
                  +{remainingCount}
                </div>
              )}
            </div>

            {/* Caption */}
            {replyTo.caption && (
              <div className="text-xs text-muted-foreground truncate">
                {replyTo.caption}
              </div>
            )}
          </div>
        )}
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