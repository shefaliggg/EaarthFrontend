import {
  FileText,
  CheckCircle,
  Download,
  CircleQuestionMark,
  FileXCorner,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SmartIcon } from "../SmartIcon";
import { InfoTooltip } from "../InfoTooltip";
import { StatusBadge } from "../badges/StatusBadge";
import { downloadFile } from "../../config/downloadFile";
import { cn, formatDate } from "../../config/utils";
import { Skeleton } from "../ui/skeleton";

export default function EditableDocumentField({
  label,
  icon,
  isEditing = false,
  isLoading = false,

  fileName,
  fileUrl,
  isUploaded,
  status = "Pending",
  expiresAt,
  meta,

  onUpload,
  onView,
  onRemove,

  isNewUpload = false,
  isRequired = false,
  error,
  showErrorDescription = true,
  disabled = false,

  actionSlot,
  infoPillDescription,
}) {
  const handleUpload = () => {
    if (!isEditing || disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) onUpload?.(file);
    };

    input.click();
  };

  const getExpiryState = (expiresAt) => {
    if (!expiresAt) return null;

    const now = new Date();
    const diffDays = (new Date(expiresAt) - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "expired";
    if (diffDays < 30) return "expiringSoon";
    return "valid";
  };

  const expiryState = getExpiryState(expiresAt);

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      {(label || icon) && (
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {icon && <SmartIcon icon={icon} size="md" />}
          <span>{label}</span>

          {infoPillDescription && (
            <InfoTooltip content={infoPillDescription}>
              <CircleQuestionMark className="size-4" />
            </InfoTooltip>
          )}

          {isRequired && isEditing && (
            <span className="text-destructive">*</span>
          )}
        </div>
      )}

      {/* VIEW MODE */}
      {isLoading ? (
        <div className="border rounded-lg p-3 flex items-center gap-3 animate-pulse bg-card">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-2 w-24 rounded" />
          </div>
        </div>
      ) : !isLoading && isUploaded ? (
        <div className="border rounded-lg p-3 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium mb-0.5">{fileName}</p>
                <StatusBadge status={status.toLowerCase()} size="xs" />
              </div>
              <div className="text-xs flex items-center gap-3 text-muted-foreground">
                {meta && <span>{meta}</span>}

                {expiresAt && (
                  <span
                    className={
                      expiryState === "expired"
                        ? "text-destructive font-semibold"
                        : expiryState === "expiringSoon"
                          ? "text-yellow-600"
                          : "text-muted-foreground"
                    }
                  >
                    {expiryState === "expired"
                      ? "Expired"
                      : `Expires on ${formatDate(expiresAt)}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onView && fileUrl && (
              <Button
                onClick={() => onView?.(fileUrl)}
                size="icon"
                variant="outline"
              >
                <Eye />
              </Button>
            )}
            <Button
              onClick={() =>
                downloadFile({
                  url: fileUrl,
                  fileName,
                  label: "document",
                })
              }
              size="icon"
              variant="outline"
            >
              <Download />
            </Button>
            {isEditing && isNewUpload && (
              <Button
                onClick={onRemove}
                size="icon"
                variant="outline"
                className={
                  "text-red-500 hover:bg-red-600 hover:border-red-600 dark:bg-red-600"
                }
              >
                <FileXCorner />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border border-dashed rounded-xl p-5 flex items-center justify-center gap-2 text-sm text-muted-foreground",
            error && "border-2 border-destructive/40",
          )}
        >
          <FileXCorner className="size-4 text-muted-foreground" />
          No document uploaded
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="space-y-2">
          {actionSlot}

          <Button onClick={handleUpload} disabled={disabled} className="w-full">
            {isUploaded ? "Replace Document" : "Upload Document"}
          </Button>
        </div>
      )}

      {error && showErrorDescription && (
        <span className="text-xs text-destructive pl-2">{error}</span>
      )}
    </div>
  );
}
