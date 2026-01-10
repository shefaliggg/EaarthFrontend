import { cn } from "@/shared/config/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        w-full min-w-0
        placeholder:normal-case
        rounded-3xl px-3.5 py-1.5
        border border-border
        bg-background
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

        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };
