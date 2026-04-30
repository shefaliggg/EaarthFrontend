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
  File,
  ArchiveRestore,
  Loader2,
  Undo2,
  Zap,
  Circle,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  cn,
  convertToPrettyText,
  formatDate,
  formatFileSize,
} from "../../../../../../shared/config/utils";
import { resolveDocStatus } from "../../../../../user-documents/store/document.selector";
import { downloadFile } from "../../../../../../shared/config/downloadFile";
import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";
import { useDocumentActions } from "../../../../../user-documents/hooks/useDocumentActions";
import { MODAL_TYPES, useModalStore } from "../../../../../../shared/stores/useModalStore";
import {
  archiveDocumentConfirmConfig,
  deleteDocumentConfirmConfig,
} from "../../../../../../shared/config/ConfirmActionsConfig";

export function DocumentPreviewCard({ row, onView }) {
  const {
    archiveDocument,
    unarchiveDocument,
    deleteDocument,
    restoreDocument,
    isArchiving,
    isDeleting,
    isRestoring,
    isUnarchiving,
  } = useDocumentActions();

  const { openModal } = useModalStore();

  const { status, label } = resolveDocStatus(row);
  const usageCount = row.usage?.length ?? 0;

  const isImage = row.mimeType?.startsWith("image/");
  const isPdf = row.mimeType === "application/pdf";

  const isArchived = row.status === "ARCHIVED";
  const isUsed = usageCount > 0;
  const isDeleted = row.isDeleted;

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
    <div
      className={cn(
        "group rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full",
        isDeleted ? "bg-red-50/50 border-red-200" : "bg-background",
      )}
    >
      {/* ── PREVIEW AREA ── */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-400/5 flex items-center justify-center m-1.5 rounded-md overflow-hidden shadow">
        {/* Top-left: doc status */}
        <div className="absolute top-2 right-3 z-10">
          <StatusBadge status={status} label={label} size="xs" />
        </div>

        {/* Top-right: primary star OR doc type */}
        <div className="absolute top-2 left-3 z-10">
          <StatusBadge
            status="highlight"
            label={row.documentType?.replace(/_/g, " ")}
            size="xs"
            showIcon={false}
            className={
              "bg-primary/80 backdrop-blur-2xl text-background text-[9px]"
            }
          />
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          {row.isPrimary && (
            <InfoTooltip content={"Currently active document"}>
              <div className="flex items-center gap-1.5">
                <Circle className="w-2.5 h-2.5 fill-current text-green-500 animate-pulse" />
                <p className="text-[11px] text-green-500">Active</p>
              </div>
            </InfoTooltip>
          )}
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
              loading={
                <div className="w-full h-full flex justify-center items-center py-24">
                  <Loader className="size-6 animate-spin" />
                </div>
              }
            >
              <Page pageNumber={1} width={width} />
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
      <div className="p-4 space-y-2 flex-1">
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
            <span className="font-medium text-primary">
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
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 mt-auto">
        {!isDeleted && (
          <InfoTooltip content={"Share to Chat"}>
            <Button variant="outline" size="sm" className="text-primary">
              <Share2 className="w-4 h-4" />
            </Button>
          </InfoTooltip>
        )}
        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition ml-auto">
          <InfoTooltip content={"View Document"}>
            <Button variant="outline" size="icon" onClick={() => onView?.(row)}>
              <Eye className="w-4 h-4" />
            </Button>
          </InfoTooltip>
          <InfoTooltip content={"Download Document"}>
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
          </InfoTooltip>
          {!isDeleted &&
            (!isArchived ? (
              <InfoTooltip
                content={
                  isUsed
                    ? `Used in ${usageCount} context(s) — remove usage to archive`
                    : "Archive Document"
                }
              >
                <span className="inline-flex">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isUsed || isArchiving(row._id)}
                    onClick={() =>
                      openModal(MODAL_TYPES.CONFIRM_ACTION, {
                        config: archiveDocumentConfirmConfig,
                        autoClose: true,
                        onConfirm: async () => {
                          await archiveDocument(row);
                        },
                      })
                    }
                  >
                    {isArchiving(row._id) ? (
                      <Loader2 className="animate-spin text-muted-foreground" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </Button>
                </span>
              </InfoTooltip>
            ) : (
              <InfoTooltip content="Restore Document">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isUnarchiving(row._id)}
                  onClick={() => unarchiveDocument(row)}
                >
                  {isUnarchiving(row._id) ? (
                    <Loader2 className="animate-spin text-muted-foreground" />
                  ) : (
                    <ArchiveRestore className="w-4 h-4" />
                  )}
                </Button>
              </InfoTooltip>
            ))}

          {isArchived && !isUsed && !isDeleted && (
            <InfoTooltip content="Move to trash">
              <Button
                variant="outline_destructive"
                size="icon"
                disabled={isDeleting(row._id)}
                onClick={() =>
                  openModal(MODAL_TYPES.CONFIRM_ACTION, {
                    config: deleteDocumentConfirmConfig,
                    autoClose: true,
                    onConfirm: async () => {
                      await deleteDocument(row);
                    },
                  })
                }
              >
                {isDeleting(row._id) ? (
                  <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </InfoTooltip>
          )}

          {isDeleted && (
            <InfoTooltip content="Restore document (undo delete)">
              <Button
                variant="outline_success"
                size="icon"
                disabled={isRestoring(row._id)}
                onClick={() => restoreDocument(row)}
              >
                {isRestoring(row._id) ? (
                  <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                  <Undo2 className="w-4 h-4" />
                )}
              </Button>
            </InfoTooltip>
          )}
        </div>
      </div>
    </div>
  );
}
