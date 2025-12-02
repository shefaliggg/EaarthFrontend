import * as React from "react";
import { cn } from "@/shared/config/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
          w-full min-w-0 h-12 flex rounded-xl px-3 py-2
          border border-[var(--border)]
          bg-[var(--input-bg)] dark:bg-[var(--input-bg-dark)]
          text-[var(--foreground)] dark:text-[var(--foreground-dark)]
          placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground-dark)]
          selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]
          outline-none transition-colors shadow-sm
          focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-opacity-50
          disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
          file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };
