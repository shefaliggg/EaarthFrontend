import { Download, FileText } from "lucide-react";
import { convertToPrettyText } from "../../../../../../shared/config/utils";

function MessageFile({ file, url, single, isOwn }) {
  return (
    <div
      className={`flex items-center gap-1 w-full col-span-2 ${single ? "min-w-[260px] max-w-[260px]" : "min-w-[260px] max-w-[260px]"} ${isOwn ? "bg-muted/90 ml-auto" : "bg-primary/10"} p-3 px-2 rounded-md`}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <FileText className="w-4 h-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0 pl-1">
        <p className="text-xs font-medium truncate text-foreground">
          {convertToPrettyText(file.name) || "Document"}
        </p>
        {file.size && (
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        )}
      </div>

      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Document")}
        className="p-2 hover:bg-muted rounded-lg"
      >
        <Download className="w-4 h-4 text-muted-foreground" />
      </a>
    </div>
  );
}

export default MessageFile;
