import * as React from "react";

import { cn } from "@/shared/config/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        " bg-gray-50/50 dark:bg-gray-800/30 placeholder:text-muted-foreground border border-border shadow-none flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base transition-[color,box-shadow] outline-none focus:outline-none focus:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.72rem]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
