// src/features/chat/components/Dialogs/ImagePreviewDialog.jsx
// ✅ Full-screen image preview with zoom and download

import React from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";

export default function ImagePreviewDialog({ open, onOpenChange, imageUrl }) {
  const [zoom, setZoom] = React.useState(1);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  // Reset zoom when dialog closes
  React.useEffect(() => {
    if (!open) {
      setZoom(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Zoom out"
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-3 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Zoom in"
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="absolute top-4 right-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Download image"
          >
            <Download className="w-6 h-6" />
          </button>

          {/* Image */}
          {imageUrl && (
            <div className="overflow-auto max-w-full max-h-full p-8">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-auto h-auto transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                onError={(e) => {
                  console.error("Failed to load image:", imageUrl);
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' style='font-family:sans-serif;font-size:16px'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          )}

          {!imageUrl && (
            <div className="text-center text-white p-8">
              <p className="text-lg">No image to display</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}