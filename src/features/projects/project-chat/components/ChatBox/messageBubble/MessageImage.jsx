import { Download, Image } from "lucide-react";
import { useState } from "react";

function MessageImage({ file, url, onClick, single = true }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`overflow-hidden relative  w-full ${single ? " max-w-[260px]" : "min-w-[160px] max-w-[160px] max-h-[160px]"} bg-muted/90 rounded-sm relative ${!loaded ? "aspect-4/3" : ""}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-200 dark:bg-purple-800 animate-pulse">
          <Image className="w-6 h-6 text-primary" />
        </div>
      )}
      <img
        src={url}
        alt={file.name || "Shared image"}
        onClick={() => onClick(file)}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        className={`cursor-pointer rounded-sm w-full h-auto object-cover ${single ? "" : "aspect-square"} transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Image..")}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

export default MessageImage;
