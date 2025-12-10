import * as Icons from "lucide-react";
import UrlBasedBreadcrumbs from "./UrlBasedBreadcrumb";
import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";

export function PageHeader({
  title,
  subtitle,
  icon,
  extraActions,
  primaryAction,
  secondaryActions,
}) {
  // ✅ Convert main icon string → component
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">

        <div className="flex items-center gap-6">
          {IconComponent && (
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0",
                "bg-primary text-primary-foreground"
              )}
            >
              <IconComponent className="w-7 h-7" />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-2xl uppercase font-extrabold leading-none mb-2 text-foreground">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}

            <UrlBasedBreadcrumbs />
          </div>
        </div>

        {/* ✅ Actions */}
        <div className="flex items-center gap-2 self-start md:self-center">

          {extraActions}

          {/* ✅ Secondary Buttons (STRING ICON SUPPORT) */}
          {secondaryActions?.map((action, index) => {
            const ActionIcon =
              action.icon && Icons[action.icon]
                ? Icons[action.icon]
                : null;

            return (
              <Button
                key={index}
                onClick={action.clickAction}
                variant={action.variant || "outline"}
                size={action.size || "default"}
                className="gap-2"
              >
                {ActionIcon && <ActionIcon className="w-4 h-4" />}
                {action.label}
              </Button>
            );
          })}

          {/* ✅ Primary Button (STRING ICON SUPPORT) */}
          {primaryAction && (() => {
            const PrimaryIcon =
              primaryAction.icon && Icons[primaryAction.icon]
                ? Icons[primaryAction.icon]
                : null;

            return (
              <Button
                onClick={primaryAction.clickAction}
                variant={primaryAction.variant || "default"}
                size={primaryAction.size || "default"}
                className="gap-2"
              >
                {PrimaryIcon && <PrimaryIcon className="w-4 h-4" />}
                {primaryAction.label}
              </Button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
