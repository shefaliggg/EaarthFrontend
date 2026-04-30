import { Button } from "@/shared/components/ui/button";
import {
  Eye,
  Download,
  Trash2,
  Share2,
  FileText,
  Star,
  BadgeCheck,
  Archive,
  Loader2,
  ArchiveRestore,
  Undo2,
  Circle,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { resolveDocStatus } from "../../../../../user-documents/store/document.selector";
import {
  cn,
  convertToPrettyText,
  formatDate,
  formatFileSize,
} from "../../../../../../shared/config/utils";
import { downloadFile } from "../../../../../../shared/config/downloadFile";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";
import { useDocumentActions } from "../../../../../user-documents/hooks/useDocumentActions";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../../shared/stores/useModalStore";
import {
  archiveDocumentConfirmConfig,
  deleteDocumentConfirmConfig,
} from "../../../../../../shared/config/ConfirmActionsConfig";

export function DocumentListCard({ row, onView }) {
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
  const isArchived = row.status === "ARCHIVED";
  const isUsed = usageCount > 0;
  const isDeleted = row.isDeleted;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border rounded-xl transition-all",
        isDeleted
          ? "bg-red-50/50 border-red-200 hover:bg-red-300/10"
          : "bg-background hover:bg-muted/40",
      )}
    >
      {/* ── LEFT ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="bg-primary/10 rounded-md p-2.5 shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground leading-none truncate pb-0.5">
              {convertToPrettyText(row.label || row.originalName)}
            </span>

            {row.isPrimary && (
              <InfoTooltip content={"Currently active document"}>
                <Circle className="w-2.5 h-2.5 fill-current text-green-500 animate-pulse" />
              </InfoTooltip>
            )}

            <StatusBadge
              status="highlight"
              label={row.documentType?.replace(/_/g, " ")}
              size="xs"
              showIcon={false}
            />
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{formatFileSize(row.sizeBytes)}</span>
            <span>•</span>
            <span>{row.documentPurpose}</span>
            <span>•</span>
            <span>Uploaded: {formatDate(row.createdAt)}</span>

            {row.expiresAt && (
              <>
                <span>•</span>
                <span
                  className={
                    row.status === "EXPIRED" ? "text-red-500 font-medium" : ""
                  }
                >
                  Expires: {formatDate(row.expiresAt)}
                </span>
              </>
            )}

            {usageCount > 0 && (
              <>
                <span>•</span>
                <span>
                  Used in {usageCount} context{usageCount > 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── STATUS ── */}
      <div className="flex items-center gap-2 mx-4 shrink-0">
        <StatusBadge status={status} label={label} size="sm" />
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex items-center gap-2 shrink-0">
        {!isDeleted && (
          <InfoTooltip content={"Share to Chat"}>
            <Button
              variant="outline"
              size="sm"
              className="text-primary"
              onClick={() =>
                openModal(MODAL_TYPES.SHARE_DOCUMENT, {
                  document: row,
                })
              }
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </InfoTooltip>
        )}
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
  );
}
