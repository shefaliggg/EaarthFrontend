import { Button } from "@/shared/components/ui/button";
import { Eye, Download, Trash2, Share2, FileText } from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";

export function DocumentListCard({ row }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-background hover:bg-muted/40 transition-all">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 flex-1">
        {/* Icon */}
        <div className="bg-primary/10 rounded-md p-2.5">
          <FileText className="w-4 h-4 text-primary" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          {/* Title + Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground leading-none">
              {row.documentName}
            </span>

            <StatusBadge
              status="highlight"
              label={row.type}
              size="xs"
              showIcon={false}
            />
          </div>

          {/* Meta (file size + dates) */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{row.fileSize}</span>
            <span>•</span>
            <span>Uploaded: {row.uploadDate}</span>
            <span>•</span>
            <span>Expiry: {row.expiryDate}</span>
          </div>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-2 mt-1">
        <StatusBadge status={row.status} size="sm" />

        <StatusBadge
          status={row.shared ? "highlight" : "private"}
          label={row.shared ? "Shared" : "Private"}
          size="sm"
        />
      </div>

      {/* RIGHT SECTION (Actions) */}
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
