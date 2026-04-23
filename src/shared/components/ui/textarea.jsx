import * as React from "react";
import { cn } from "@/shared/config/utils";

function Textarea({ className, textCase = "upper", ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `
        w-full min-w-0
        ${textCase === "upper" ? "uppercase" : "normal-case"}
        placeholder:normal-case
        rounded-md px-3.5 py-1.5
        border border-border
        bg-muted
        text-foreground
        placeholder:text-muted-foreground

        shadow-sm
        transition-all duration-200 ease-out

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring/40
        focus-visible:border-ring

        hover:border-muted-foreground/60

        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
