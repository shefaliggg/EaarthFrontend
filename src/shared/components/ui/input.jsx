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
        rounded-3xl px-3 py-1.5
        border
        bg-muted dark:bg-muted
        text-foreground
        dark:text-foreground
        placeholder:text-muted-foreground

        shadow-none
        transition-all duration-200 ease-out

        focus-visible:outline-none
        focus:border-primary/30

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
