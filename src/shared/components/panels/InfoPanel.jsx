import React from "react"
import { cn } from "@/shared/config/utils"

export function InfoPanel({
  title,
  icon: Icon,
  variant = "info",
  children,
  className,
}) {
  const variants = {
    info: {
      container:
      "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-gray-950 border-blue-200/60 dark:border-blue-500/20 ring-blue-400/10",
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-300",
    text: "text-blue-800/90 dark:text-blue-200/80",
  },
    warning: {
      container:
  "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-gray-950 border-amber-200/60 dark:border-amber-500/20 ring-amber-400/10",
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
        title: "text-amber-900 dark:text-amber-300",
          text: "text-amber-800/90 dark:text-amber-200/80",
    },
success: {
  container:
  "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-gray-950 border-emerald-200/60 dark:border-emerald-500/20 ring-emerald-400/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
        title: "text-emerald-900 dark:text-emerald-300",
          text: "text-emerald-800/90 dark:text-emerald-200/80",
    },
danger: {
  container:
  "bg-gradient-to-br from-red-50 to-white dark:from-red-950/40 dark:to-gray-950 border-red-200/60 dark:border-red-500/20 ring-red-400/10",
    iconBg: "bg-red-100 dark:bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
        title: "text-red-900 dark:text-red-300",
          text: "text-red-800/90 dark:text-red-200/80",
    },
  }

const styles = variants[variant]

return (
  <div
    className={cn(
      "relative rounded-xl border p-5 shadow-sm ring-1 backdrop-blur-sm",
      styles.container,
      className
    )}
  >
    <div className="flex items-start gap-4">
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg shadow-inner",
            styles.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", styles.iconColor)} />
        </div>
      )}

      <div className="flex-1">
        {title && (
          <h4 className={cn("text-sm font-semibold tracking-tight mb-2", styles.title)}>
            {title}
          </h4>
        )}

        <div className={cn("text-xs leading-relaxed space-y-2", styles.text)}>
          {children}
        </div>
      </div>
    </div>
  </div>
)
}
