import React, { useRef, useState, useEffect } from "react";
import {
  FileText,
  Pencil,
  Download,
  Plane,
  Plus,
  Loader2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/config/utils";
import { toast } from "sonner";

import TmoDocument from "./TmoDocument";
import { exportCalendarPdf } from "../preview/useCalendarPdfExport";
import { downloadTmoAttachmentAPI } from "../../../service/tmo.service";


const getStatusColor = (status = "DRAFT") => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    case "DRAFT":
      return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
    case "CANCELLED":
      return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export default function TmoPreview({ selectedTmo, onEditTmo, onCreateNew }) {
  const printRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAtt, setIsDownloadingAtt] = useState(null);
  const [scale, setScale] = useState(1);
  const A4_WIDTH = 794;

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScaleFromContainerWidth = () => {
      const containerWidth = container.clientWidth;
      const newScale = Math.min(1, (containerWidth - 40) / A4_WIDTH);
      setScale(newScale);
    };

    updateScaleFromContainerWidth();

    const resizeObserver = new ResizeObserver(updateScaleFromContainerWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [selectedTmo]);

  const handleExportPDF = async () => {
    if (!printRef.current || !selectedTmo) return;

    setIsExporting(true);
    try {
      await exportCalendarPdf({
        ref: printRef,
        fileName: `TMO_${selectedTmo.tmoCode || selectedTmo.tmoNumber}_${selectedTmo.name.replace(/\s+/g, "_")}.pdf`,
        orientation: "portrait",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAttachment = async (attachment) => {
    const attachmentId = attachment._id || attachment.id;
    const tmoId = selectedTmo._id || selectedTmo.id;

    try {
      setIsDownloadingAtt(attachmentId);
      
      const res = await downloadTmoAttachmentAPI(tmoId, attachmentId);
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachment.name || "download");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download attachment");
    } finally {
      setIsDownloadingAtt(null);
    }
  };

  if (!selectedTmo) {
    return (
      <>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 border-4 border-card shadow-sm">
            <Plane className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">
            Select a Travel Order
          </h3>
          <p className="text-sm max-w-xs text-center mb-8 opacity-80">
            Select an existing TMO from the sidebar to view logistics details,
            or create a new movement order.
          </p>
          <Button onClick={onCreateNew} size="lg" className="shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Create New Order
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-primary/20 shadow-sm bg-card">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-foreground leading-none">
                  {selectedTmo.tmoCode || selectedTmo.tmoNumber}
                </h2>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 px-2 font-bold tracking-wider border",
                    getStatusColor(selectedTmo.status),
                  )}
                >
                  {selectedTmo.status || "DRAFT"}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {selectedTmo.name} • {selectedTmo.department}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => onEditTmo(selectedTmo, e)}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit Order
            </Button>
            <Button
              onClick={handleExportPDF}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Download PDF"}
            </Button>
          </div>
        </div>
        
        <div
          ref={previewContainerRef}
          className="flex-1 overflow-auto"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0, rgba(0,0,0,0.02) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
            padding: "24px 20px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: `${A4_WIDTH}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              marginBottom: `${A4_WIDTH * (scale - 1)}px`,
              boxShadow: [
                "0 1px 3px rgba(0,0,0,0.07)",
                "0 4px 14px rgba(0,0,0,0.10)",
                "0 18px 44px rgba(0,0,0,0.09)",
                "0 0 0 1px rgba(0,0,0,0.05)",
              ].join(", "),
              borderRadius: "4px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div ref={printRef}>
              <TmoDocument tmo={selectedTmo} />
            </div>
          </div>
          
          {selectedTmo.attachments?.length > 0 && (
            <div
              className="w-full mt-6 flex-shrink-0"
              style={{ maxWidth: `${A4_WIDTH * scale}px` }}
            >
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-primary/10" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-wider text-foreground">
                    Attached Documents
                    <span className="ml-2 text-muted-foreground font-semibold">
                      ({selectedTmo.attachments.length})
                    </span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTmo.attachments.map((att) => (
                    <div
                      key={att.id || att._id}
                      className="group flex items-center p-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-md hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-primary shrink-0 mr-3 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {att.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 uppercase tracking-widest bg-muted text-muted-foreground border-transparent"
                          >
                            {att.type || att.mime?.split('/')[1] || "DOC"}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-medium">
                            {att.size ? (att.size / 1024).toFixed(1) + " KB" : "Unknown Size"}
                          </span>
                        </div>
                      </div>

                      {/* 🚀 CRITICAL FIX: The button now calls the download function! */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownloadAttachment(att)}
                        disabled={isDownloadingAtt === (att._id || att.id)}
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors ml-2"
                      >
                        {isDownloadingAtt === (att._id || att.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}