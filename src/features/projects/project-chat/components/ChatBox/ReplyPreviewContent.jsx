import React from "react";
import { Image, Video, FileText, Music, MessageSquare } from "lucide-react";

function ReplyPreviewContent({ reply }) {
  if (!reply)
    return (
      <span className="text-xs italic text-muted-foreground">
        Original message unavailable
      </span>
    );

  if (reply.deleted) {
    return (
      <span className="text-xs italic text-muted-foreground">
        Message deleted
      </span>
    );
  }

  const contentCaption = reply.caption;

  switch (reply.type?.toLowerCase()) {
    case "text":
      return (
        <span className="text-[11px] truncate">{reply.preview}</span>
      );

    case "image":
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            <Image size={14} /> <span>Photo</span>
          </div>
          {contentCaption && (
            <span className="truncate text-muted-foreground">
              {contentCaption}
            </span>
          )}
        </div>
      );

    case "video":
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            <Video size={14} /> <span>Video</span>
          </div>
          {contentCaption && (
            <span className="truncate text-muted-foreground">
              {contentCaption}
            </span>
          )}
        </div>
      );

    case "audio":
      return (
        <div className="flex items-center gap-1 text-[11px]">
          <Music size={14} /> <span>Voice message</span>
        </div>
      );

    case "file":
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{reply?.files?.[0]?.name || "Document"}</span>
          </div>
          {contentCaption && (
            <span className="truncate text-muted-foreground">
              {contentCaption}
            </span>
          )}
        </div>
      );

    default:
      return (
        <span className="text-xs italic text-muted-foreground">
          Unsupported
        </span>
      );
  }
}

export default ReplyPreviewContent;
