import {
  FileText,
  CheckCircle,
  Download,
  CircleQuestionMark,
  FileXCorner,
  Eye,
  Dot,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SmartIcon } from "../SmartIcon";
import { InfoTooltip } from "../InfoTooltip";
import { StatusBadge } from "../badges/StatusBadge";
import { downloadFile } from "../../config/downloadFile";
import { cn, formatDate } from "../../config/utils";
import { Skeleton } from "../ui/skeleton";
import { getStatusBadge } from "../../config/statusBadgeConfig";

export default function EditableDocumentField({
  label,
  icon,
  isEditing = false,
  isLoading = false,

  fileName,
  fileUrl,
  isUploaded,
  status = "Pending",
  secondaryBadges = [],
  secondaryStatuses = [],

  uploadedOn,
  verifiedAt,
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

  secondaryActions,
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
        <div className="border rounded-lg p-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-card">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-17 h-17 shrink-0 rounded-md bg-muted/80 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Added flex-wrap and gap to handle multiple badges cleanly */}
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate max-w-[220px] sm:max-w-[360px]">
                  {fileName}
                </p>

                {/* Primary Overall Status */}
                <StatusBadge status={status?.toLowerCase()} size="sm" />

                {/* Secondary Check Statuses (AI, Gov) */}
                {secondaryBadges.map((badge, idx) => (
                  <StatusBadge
                    key={idx}
                    status={badge?.status?.toLowerCase()}
                    label={badge?.label || badge?.status?.toLowerCase()}
                    icon={badge?.icon || null}
                    showIcon={badge?.showIcon ?? true}
                    showLabel={badge?.showLabel ?? true}
                    size={badge?.size ?? "sm"}
                    className={cn(
                      "bg-muted/50 border-transparent", // Makes secondary badges subtler
                      badge.className,
                    )}
                  />
                ))}
              </div>
              {secondaryStatuses && secondaryStatuses.length > 0 && (
                <div className="flex items-center gap-2 my-1 text-primary text-xs">
                  {secondaryStatuses.map((item) => {
                    const { color } = getStatusBadge(item.value, item.label);

                    return (
                      <div className="flex items-center gap-1">
                        <SmartIcon icon={item.icon} size="sm" />
                        <span>{item.label}</span>
                        <span
                          className={cn("font-medium", color, "bg-transparent")}
                        >
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-xs flex items-center gap-0.5 text-muted-foreground">
                {meta && <span>{meta}</span>}

                {uploadedOn && (
                  <>
                    <Dot />
                    <span className={"text-muted-foreground"}>
                      Uploaded on {formatDate(uploadedOn)}
                    </span>
                  </>
                )}

                {verifiedAt && (
                  <>
                    <Dot />
                    <span className={"text-muted-foreground"}>
                      Verified on {formatDate(verifiedAt)}
                    </span>
                  </>
                )}

                {expiresAt && (
                  <>
                    <Dot />
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
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {secondaryActions &&
              secondaryActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || "outline"}
                  size={action.size || "sm"}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon && (
                    <SmartIcon
                      icon={action.icon}
                      size={action.iconSize || "md"}
                    />
                  )}
                  {action.label}
                </Button>
              ))}
            {onView && fileUrl && (
              <Button
                onClick={() => onView?.(fileUrl)}
                size="icon"
                variant="outline"
              >
                <Eye className="size-4" />
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
              <Download className="size-4" />
            </Button>
            {isEditing && isNewUpload && (
              <Button
                onClick={onRemove}
                size="icon"
                variant="outline"
                className="text-red-500 hover:bg-red-600 hover:border-red-600 dark:bg-red-600 hover:text-white"
              >
                <FileXCorner className="size-4" />
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
        <div className="space-y-2 mt-2">
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
