import * as Icons from "lucide-react";
import UrlBasedBreadcrumbs from "./UrlBasedBreadcrumb";
import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";
import { convertToPrettyText } from "../config/utils";


export function PageHeader({
  title,
  subtitle,
  image,
  initials,
  icon,
  extraContents,
  extraActions,
  primaryAction,
  secondaryActions,
}) {
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  const renderIdentity = () => {
    // 1️⃣ Image
    if (image) {
      return (
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // 2️⃣ Initials
    if (initials) {
      return (
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center",
            "bg-primary text-background font-bold text-lg shadow-lg shrink-0"
          )}
        >
          {initials}
        </div>
      );
    }

    // 3️⃣ Icon
    if (IconComponent) {
      return (
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0",
            "bg-primary text-primary-foreground"
          )}
        >
          <IconComponent className="w-7 h-7" />
        </div>
      );
    }

    return null;
  };

  const renderTitle = (title) => {
    if (typeof title === "string") {
      return convertToPrettyText(title);
    }

    return title; // JSX / ReactNode / anything else
  };


  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
        <div className="flex items-start gap-6">
          {renderIdentity()}

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold! mt-0.5 leading-none text-foreground">
              {renderTitle(title)}
            </h1>

            {subtitle && (
              <p className="text-muted-foreground mb-2">{subtitle}</p>
            )}

            <UrlBasedBreadcrumbs />

            {extraContents}
          </div>
        </div>

        {/* ✅ Actions */}
        <div className="flex items-center gap-2 self-start md:self-center">

          {extraActions}

          {/* ✅ Secondary Buttons (STRING ICON SUPPORT) */}
          {secondaryActions &&
            secondaryActions?.map((action, index) => {
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
                disabled={primaryAction.disabled}
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