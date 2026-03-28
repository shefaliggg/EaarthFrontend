import { Download } from "lucide-react";
import React from "react";

function MessageVideo({ file, url, single = true }) {
  return (
    <div className="relative group">
      <video
        src={url}
        controls
        className={`rounded-lg  w-full  bg-muted/90 ${single ? "max-w-[260px]" : "aspect-square min-w-[160px] max-w-[160px] max-h-[160px]"}`}
      >
        Your browser does not support the video tag.
      </video>
      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Video..")}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

export default MessageVideo;
