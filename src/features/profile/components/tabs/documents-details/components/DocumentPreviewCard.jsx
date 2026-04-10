import { Eye, Download, Trash2, Share2, FileText } from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Button } from "@/shared/components/ui/button";

export function DocumentPreviewCard({ row }) {
  return (
    <div className="group rounded-2xl border bg-background shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* 🔝 TOP PREVIEW */}
      <div className="relative h-36 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-400/5 flex items-center justify-center m-1.5 rounded-md">
        {/* Status (top-left) */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={row.status} size="xs" />
        </div>

        {/* File Type (top-right) */}
        <div className="absolute top-3 right-3">
           <StatusBadge
              status={row.shared ? "highlight" : "private"}
              label={row.shared ? "Shared" : "Private"}
              size="xs"
            />
        </div>

        {/* Center Icon */}
        <div className="bg-purple-500/10 p-4 rounded-xl">
          <FileText className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* 📄 CONTENT */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-sm text-foreground truncate">
            {row.documentName}
          </h3>
          <p className="text-xs text-muted-foreground">{row.type}</p>
        </div>

        {/* Meta */}

        <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
          <span>{row.fileSize}</span>

          <span className="w-1 h-1 bg-muted-foreground rounded-full" />

          <span>{row.uploadDate}</span>

          <span className="w-1 h-1 bg-muted-foreground rounded-full" />

          <span className={row.isExpired ? "text-red-500 font-medium" : ""}>
            {row.expiryDate}
          </span>
        </div>
      </div>

      {/* ⚡ ACTIONS */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left action (primary) */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-primary"
        >
          <Share2 className="w-4 h-4" />
        </Button>

        {/* Right actions */}
        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
          <Button variant="outline" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className={"hover:bg-red-100 dark:hover:bg-red-900/40"}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
