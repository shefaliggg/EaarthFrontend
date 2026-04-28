import {
  Eye,
  Download,
  Trash2,
  Share2,
  FileText,
  Star,
  BadgeCheck,
  Archive,
  Loader,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  convertToPrettyText,
  formatDate,
  formatFileSize,
} from "../../../../../../shared/config/utils";
import { resolveDocStatus } from "../../../../../user-documents/store/document.selector";
import { downloadFile } from "../../../../../../shared/config/downloadFile";
import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";

export function DocumentPreviewCard({ row, onView }) {
  const { status, label } = resolveDocStatus(row);
  const usageCount = row.usage?.length ?? 0;

  const isImage = row.mimeType?.startsWith("image/");
  const isPdf = row.mimeType === "application/pdf";

  const containerRef = useRef(null);
  const [width, setWidth] = useState(200);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="group rounded-2xl border bg-background shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* ── PREVIEW AREA ── */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-400/5 flex items-center justify-center m-1.5 rounded-md overflow-hidden shadow">
        {/* Top-left: doc status */}
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={status} label={label} size="xs" />
        </div>

        {/* Top-right: primary star OR doc type */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          {row.isPrimary && (
            <BadgeCheck className="w-5 h-5 text-background fill-green-500" />
          )}
          <StatusBadge
            status="highlight"
            label={row.documentType?.replace(/_/g, " ")}
            size="xs"
            showIcon={false}
            // className={"bg-primary! text-background!"}
          />
        </div>

        {/* Thumbnail or icon */}
        {isImage && (
          <img
            src={row.url}
            alt={row.originalName}
            className="h-full w-full object-center object-contain rounded-md"
          />
        )}

        {isPdf && row.url && (
          <div ref={containerRef} className="h-full w-[75%]">
            <Document
              file={row.url}
              loading={<Loader className="size-4" />}
              error={<div className="text-red-400">Failed to load PDF</div>}
            >
              <Page pageNumber={1} width={width}/>
            </Document>
          </div>
        )}

        {!isImage && !isPdf && (
          <div className="bg-purple-500/10 p-4 rounded-xl">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-sm text-foreground truncate">
            {convertToPrettyText(row.label || row.originalName)}
          </h3>
          <p className="text-xs text-muted-foreground">
            {row.documentPurpose} · {row.documentType?.replace(/_/g, " ")}
          </p>
        </div>

        {/* Size + dates */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(row.sizeBytes)}</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>{formatDate(row.createdAt)}</span>
          {row.expiresAt && (
            <>
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span
                className={
                  row.status === "EXPIRED" ? "text-red-500 font-medium" : ""
                }
              >
                {formatDate(row.expiresAt)}
              </span>
            </>
          )}
        </div>

        {/* Usage contexts */}
        {usageCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Used in{" "}
            <span className="font-medium text-foreground">
              {usageCount} context{usageCount > 1 ? "s" : ""}
            </span>
          </p>
        )}

        {/* Notes */}
        {row.notes && (
          <p className="text-xs text-muted-foreground italic line-clamp-2">
            {row.notes}
          </p>
        )}
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
        <Button variant="outline" size="sm" className="text-primary">
          <Share2 className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
          <Button variant="outline" size="icon" onClick={() => onView?.(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={async () =>
              await downloadFile({
                url: row.url,
                fileName: row.originalName,
                label: "document",
              })
            }
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Archive className="w-4 h-4" />
          </Button>
          <Button variant="outline_destructive" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
