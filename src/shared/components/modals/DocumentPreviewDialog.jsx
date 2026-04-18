import { X, Download, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "sonner";
import { downloadFile } from "../../config/downloadFile";
import { InfoPanel } from "../panels/InfoPanel";
import { cn } from "../../config/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DocumentPreviewDialog({
  open,
  onOpenChange,
  fileUrl,
  fileName = "Document.pdf",
  banner,
}) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const handleZoomIn = () =>
    setScale((p) => Math.min(+(p + 0.25).toFixed(2), 3));
  const handleZoomOut = () =>
    setScale((p) => Math.max(+(p - 0.25).toFixed(2), 0.5));
  const handleReset = () => setScale(1);

  const handleDownload = async () => {
    setDownloading(true);

    await downloadFile({
      url: fileUrl,
      fileName,
      label: "document",
    });

    setDownloading(false);
  };

  useEffect(() => {
    if (!open) {
      setScale(1);
      setNumPages(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>Document Preview</DialogTitle>
        <DialogDescription>
          Preview and download the selected document
        </DialogDescription>
      </VisuallyHidden>
      <DialogContent className="w-screen max-w-screen! h-screen! max-h-screen! m-0! p-0! bg-transparent border-0 shadow-none overflow-hidden rounded-none">
        <div className="relative w-full h-full bg-black/75">
          {/* Controls */}
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
            <span className="text-sm font-medium w-12 text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleReset}
              disabled={scale === 1}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
            >
              Reset
            </button>
          </div>

          {/* Close */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/70 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="absolute top-4 right-20 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/70 transition-colors z-50 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
          </button>

          {banner && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full! max-w-2xl">
              <InfoPanel
                title={banner.title}
                icon={banner.icon}
                variant={banner.variant}
                className={
                  " backdrop-blur-md from-amber-50/90 to-white/90 dark:from-amber-950/40 dark:to-gray-950"
                }
              >
                {banner.content}
              </InfoPanel>
            </div>
          )}

          {/* PDF — fully your DOM, fully your control */}
          <div className="w-full h-screen overflow-auto">
            <div
              className={cn(
                "min-h-full min-w-fit flex flex-col items-center justify-center gap-4 py-15 px-4",
                banner && "pt-40",
              )}
            >
              {open && fileUrl && (
                <Document
                  file={fileUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <p className="text-white/60 text-sm flex items-center gap-1 justify-center">
                      <Loader2 className="size-4 animate-spin" />
                      Loading document...
                    </p>
                  }
                  error={
                    <p className="text-red-400 text-sm">
                      Failed to load document.
                    </p>
                  }
                >
                  {Array.from({ length: numPages ?? 0 }, (_, i) => (
                    <Page
                      key={i + 1}
                      pageNumber={i + 1}
                      scale={scale}
                      renderAnnotationLayer={true}
                      renderTextLayer={true}
                      className="shadow-2xl"
                    />
                  ))}
                </Document>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
