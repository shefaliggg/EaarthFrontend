import { FileText, Download, Share2, Star, BadgeCheck } from "lucide-react";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";
import {
  convertToPrettyText,
  formatDate,
  formatFileSize,
} from "../../../shared/config/utils";
import { resolveDocStatus } from "../../user-documents/store/document.selector";
import { downloadFile } from "../../../shared/config/downloadFile";
import { Button } from "@/shared/components/ui/button";
import ActionsMenu from "../../../shared/components/menus/ActionsMenu";
import { useDocumentActions } from "../../user-documents/hooks/useDocumentActions";

export const DocumentTableColumns = ({ onView } = {}) => {
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

  return [
    // ── Name + size ──────────────────────────────────────────────────────────────
    {
      key: "originalName",
      label: "Document Name",
      align: "left",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="mt-0.5 bg-primary/10 rounded-md p-2.5 shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground leading-none truncate">
                {convertToPrettyText(row.label || row.originalName)}
              </span>
              {row.isPrimary && (
                <BadgeCheck className="w-4 h-4 text-background fill-green-500 shrink-0" />
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(row.sizeBytes)}
            </div>
          </div>
        </div>
      ),
    },

    // ── Type ─────────────────────────────────────────────────────────────────────
    {
      key: "documentType",
      label: "Type",
      align: "center",
      render: (row) => (
        <StatusBadge
          status="highlight"
          label={row.documentType?.replace(/_/g, " ")}
          size="sm"
          showIcon={false}
        />
      ),
    },

    // ── Purpose ───────────────────────────────────────────────────────────────────
    {
      key: "documentPurpose",
      label: "Purpose",
      align: "center",
      render: (row) => (
        <StatusBadge
          status="default"
          label={row.documentPurpose}
          size="sm"
          showIcon={false}
        />
      ),
    },

    // ── Upload date ───────────────────────────────────────────────────────────────
    {
      key: "createdAt",
      label: "Uploaded",
      align: "center",
      render: (row) => (
        <span className="text-muted-foreground">
          {formatDate(row.createdAt)}
        </span>
      ),
    },

    // ── Expiry ────────────────────────────────────────────────────────────────────
    {
      key: "expiresAt",
      label: "Expires",
      align: "center",
      render: (row) =>
        row.expiresAt ? (
          <span
            className={
              row.status === "EXPIRED"
                ? "text-red-500 font-medium"
                : "text-muted-foreground"
            }
          >
            {formatDate(row.expiresAt)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },

    // ── Status (document.status + verificationStatus) ─────────────────────────────
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (row) => {
        const { status, label, icon } = resolveDocStatus(row);
        return <StatusBadge status={status} label={label} icon={icon} size="sm" />;
      },
    },

    // ── Usage count ───────────────────────────────────────────────────────────────
    {
      key: "usage",
      label: "Used In",
      align: "center",
      render: (row) => {
        const count = row.usage?.length ?? 0;
        return (
          <span className="text-muted-foreground text-sm">
            {count > 0 ? `${count} context${count > 1 ? "s" : ""}` : "—"}
          </span>
        );
      },
    },

    // ── Actions ───────────────────────────────────────────────────────────────────
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => {
        const usageCount = row.usage?.length ?? 0;
        const isUsed = usageCount > 0;
        const isArchived = row.status === "ARCHIVED";
        const isDeleted = row.isDeleted;

        return (
          <ActionsMenu
            actions={[
              // 👁 View
              {
                label: "View",
                icon: "Eye",
                onClick: () => onView?.(row),
              },

              // ⬇ Download
              {
                label: "Download",
                icon: "Download",
                onClick: async () => {
                  await downloadFile({
                    url: row.url,
                    fileName: row.originalName,
                    label: "document",
                  });
                },
              },

              // 📤 Share
              !isDeleted && {
                label: "Share",
                icon: "Share2",
                onClick: () => {},
              },

              // 📦 Archive / Unarchive
              !isDeleted &&
                (!isArchived
                  ? {
                      label: "Archive",
                      icon: "Archive",
                      onClick: () => archiveDocument(row),
                      disabled: isUsed || isArchiving(row._id),
                      loading: isArchiving(row._id),
                      description: isUsed
                        ? `Used in ${usageCount} ${
                            usageCount > 1 ? "contexts" : "context"
                          } — remove usage to archive`
                        : null,
                    }
                  : {
                      label: "Unarchive",
                      icon: "ArchiveRestore",
                      onClick: () => unarchiveDocument(row),
                      disabled: isUnarchiving(row._id),
                      loading: isUnarchiving(row._id),
                    }),

              // 🗑 Delete (only if archived + unused)
              isArchived &&
                !isUsed &&
                !isDeleted && {
                  label: "Delete",
                  icon: "Trash2",
                  destructive: true,
                  separatorBefore: true,
                  onClick: () => deleteDocument(row),
                  disabled: isDeleting(row._id),
                  loading: isDeleting(row._id),
                },

              // ♻ Restore from trash
              isDeleted && {
                label: "Restore",
                icon: "Undo2",
                onClick: () => restoreDocument(row),
                disabled: isRestoring(row._id),
                loading: isRestoring(row._id),
              },
            ].filter(Boolean)}
          />
        );
      },
    },
  ];
};
