import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import getApiUrl from "../../../../shared/config/enviroment";
import chatApi from "../api/chat.api";

export default function ImagePreviewDialog({
  open,
  onOpenChange,
  message,
  imageFile,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const zoomPercentage = Math.round(zoom * 100);

  console.log("message in preview", message);
  console.log("message image in preview", imageFile);

  const baseUrl = getApiUrl();

  const handleDownload = async () => {
    if (!message?.id || !imageFile?._id) return;

    const downloadPromise = chatApi.downloadMessageAttachments(
      message.conversationId,
      message.id,
      imageFile._id,
    );

    toast.promise(downloadPromise, {
      loading: "Downloading file...",
      success: async (response) => {
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = imageFile.name || "file";
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);

        return "Download complete";
      },
      error: (err) => {
        console.error("Download failed:", err);
        return err?.response?.data?.message || "Download failed";
      },
    });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-screen! h-screen p-0 bg-transparent border-0 shadow-none overflow-hidden rounded-none">
        <div className="relative w-full h-full flex items-center justify-center bg-black/75">
          <div className="absolute top-4 left-6 flex items-center gap-3 z-50 bg-black/40 backdrop-blur-md rounded-3xl px-3 py-1.5 text-white">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Zoom % */}
            <span className="text-sm font-medium w-12 text-center select-none">
              {zoomPercentage}%
            </span>

            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={zoom === 1}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
            >
              Reset
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="absolute top-4 right-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Download image"
          >
            <Download className="w-6 h-6" />
          </button>

          {/* Image */}
          {imageFile?.url && (
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={imageFile?.url}
                alt="Preview"
                onMouseDown={handleMouseDown}
                draggable={false}
                className={`select-none transition-transform duration-200 rounded-sm ${
                  zoom > 1
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                }`}
                style={{
                  maxWidth: zoom === 1 ? "95vw" : "none",
                  maxHeight: zoom === 1 ? "90vh" : "none",
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          )}

          {!imageFile?.url && (
            <div className="text-center text-white p-8">
              <p className="text-lg">No image to display</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
