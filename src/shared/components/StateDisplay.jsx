import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import * as Icons from "lucide-react";

export default function StateDisplay({
  type = "empty", // "empty" | "error"
  title,
  description,
  icon = "FileText",
  actionLabel,
  onAction,
  className,
}) {
  const Icon = Icons[icon] || Icons.FileText;

  const isError = type === "error";

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center text-center py-16 px-6",
        isError ? "border-red-100" : "border-border",
        className,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-4",
          isError ? "bg-red-50" : "bg-muted/40",
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6",
            isError ? "text-red-500" : "text-muted-foreground",
          )}
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {title || (isError ? "Something went wrong" : "No records found")}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground max-w-xs mb-4">
        {description ||
          (isError
            ? "We couldn’t load the data. Try again."
            : "Nothing matches your current filters.")}
      </p>

      {/* Action */}
      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
