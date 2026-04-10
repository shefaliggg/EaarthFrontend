import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Download, Trash2, Share2, FileText } from "lucide-react";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";

export const DocumentTableColumns = () => [
  {
    key: "documentName",
    label: "Document Name",
    align: "left",
    render: (row) => (
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div className="mt-0.5 bg-primary/10 rounded-md p-2.5">
          <FileText className="w-4 h-4 text-primary" />
        </div>

        {/* Text */}
        <div>
          <div className="font-medium text-foreground leading-none">
            {row.documentName}
          </div>
          <div className="text-xs text-muted-foreground">{row.fileSize}</div>
        </div>
      </div>
    ),
  },

  {
    key: "type",
    label: "Type",
    align: "center",
    render: (row) => (
      <StatusBadge
        status={"highlight"}
        label={row.type}
        size="sm"
        showIcon={false}
      />
    ),
  },

  {
    key: "uploadDate",
    label: "Upload Date",
    align: "center",
    render: (row) => (
      <span className="text-muted-foreground">{row.uploadDate}</span>
    ),
  },

  {
    key: "expiryDate",
    label: "Expiry Date",
    align: "center",
    render: (row) => (
      <span className="text-muted-foreground">{row.expiryDate}</span>
    ),
  },

  {
    key: "status",
    label: "Status",
    align: "center",
    render: (row) => <StatusBadge status={row.status} size="sm" />,
  },

  {
    key: "shared",
    label: "Shared",
    align: "center",
    render: (row) => (
      <StatusBadge
        status={row.shared ? "highlight" : "private"}
        label={row.shared ? "Shared" : "Private"}
        size="sm"
      />
    ),
  },

  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: (row) => (
      <div className="flex items-center justify-center gap-2">
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
    ),
  },
];
