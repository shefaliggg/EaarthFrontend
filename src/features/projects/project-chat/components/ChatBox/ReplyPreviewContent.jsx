import React from "react";
import { Image as ImageIcon, Video, FileText, Music, Mic } from "lucide-react";

function ReplyPreviewContent({ reply }) {
  if (!reply) {
    return (
      <span className="text-xs italic text-muted-foreground">
        Original message unavailable
      </span>
    );
  }

  if (reply.deleted) {
    return (
      <span className="text-xs italic text-muted-foreground">
        Message deleted
      </span>
    );
  }

  const type = reply.type?.toLowerCase();
  const files = reply.files || [];
  const firstFile = files[0];

  // =========================
  // TEXT MESSAGE
  // =========================
  if (type === "text") {
    return (
      <span className="text-[11px] truncate">
        {reply.preview || "Text message"}
      </span>
    );
  }

  // =========================
  // VOICE MESSAGE
  // =========================
  if (type === "audio") {
    return (
      <div className="flex items-center gap-1 text-[11px]">
        <Mic size={14} />
        <span>Voice message</span>
        {firstFile?.duration && (
          <span className="opacity-70">{firstFile.duration}</span>
        )}
      </div>
    );
  }

  // =========================
  // MEDIA MESSAGE
  // =========================
  if (type === "media") {
    const visibleFiles = files.slice(0, 5);
    const remainingCount = files.length - 5;

    const renderAttachment = (file, index) => {
      const mime = file.mime || "";

      // IMAGE
      if (mime.startsWith("image/")) {
        return (
          <div
            key={index}
            className="w-8 h-8 flex items-center justify-center bg-muted rounded-sm border"
          >
            <ImageIcon size={14} className="text-primary" />
          </div>
        );
      }

      // VIDEO
      if (mime.startsWith("video/")) {
        return (
          <div
            key={index}
            className="w-8 h-8 flex items-center justify-center bg-muted rounded-sm border"
          >
            <Video size={14} className="text-primary" />
          </div>
        );
      }

      // AUDIO FILE
      if (mime.startsWith("audio/")) {
        return (
          <div
            key={index}
            className="w-8 h-8 flex items-center justify-center bg-muted rounded-sm border"
          >
            <Music size={14} className="text-primary" />
          </div>
        );
      }

      // DOCUMENT / OTHER
      return (
        <div
          key={index}
          className="w-8 h-8 flex items-center justify-center bg-muted rounded-sm border"
        >
          <FileText size={14} className="text-primary" />
        </div>
      );
    };

    // Single file → richer preview
    if (files.length === 1 && firstFile) {
      const mime = firstFile.mime || "";
      const duration = firstFile.duration;

      const FileRow = ({ icon, label }) => (
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            {icon}
            <span className="truncate max-w-[140px]">
              {firstFile.name || label}
            </span>
            {duration && (
              <span className="opacity-60 text-[10px]">{duration}</span>
            )}
          </div>

          {reply.caption && (
            <span className="truncate text-muted-foreground">
              {reply.caption}
            </span>
          )}
        </div>
      );

      // IMAGE
      if (mime.startsWith("image/")) {
        return <FileRow icon={<ImageIcon size={14} />} label="Photo" />;
      }

      // VIDEO
      if (mime.startsWith("video/")) {
        return <FileRow icon={<Video size={14} />} label="Video" />;
      }

      // AUDIO FILE
      if (mime.startsWith("audio/")) {
        return <FileRow icon={<Music size={14} />} label="Audio file" />;
      }

      // DOCUMENT / OTHER
      return <FileRow icon={<FileText size={14} />} label="Document" />;
    }

    // Multiple files → show mini strip
    return (
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {visibleFiles.map(renderAttachment)}
          {remainingCount > 0 && (
            <div className="w-8 h-8 flex items-center justify-center text-[10px] bg-muted rounded border">
              +{remainingCount}
            </div>
          )}
        </div>

        {reply.caption && (
          <span className="text-[11px] truncate text-muted-foreground">
            {reply.caption}
          </span>
        )}
      </div>
    );
  }

  // =========================
  // FALLBACK
  // =========================
  return (
    <span className="text-xs italic text-muted-foreground">
      Unsupported message
    </span>
  );
}

export default ReplyPreviewContent;
