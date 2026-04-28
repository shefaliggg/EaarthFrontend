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
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { resolveDocStatus } from "../../../../../user-documents/store/document.selector";
import {
  convertToPrettyText,
  formatDate,
  formatFileSize,
} from "../../../../../../shared/config/utils";
import { downloadFile } from "../../../../../../shared/config/downloadFile";

export function DocumentListCard({ row, onView }) {
  const { status, label } = resolveDocStatus(row);
  const usageCount = row.usage?.length ?? 0;

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-background hover:bg-muted/40 transition-all">
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
              <BadgeCheck className="w-4 h-4 text-background fill-green-500 shrink-0" />
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
        <Button variant="outline" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
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
  );
}
