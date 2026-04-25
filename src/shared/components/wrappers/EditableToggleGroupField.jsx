import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/shared/config/utils";
import { InfoTooltip } from "../InfoTooltip";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

function EditableToggleGroupField({
  label,
  icon,
  value,
  items = [],
  type = "single",
  isEditing = false,
  onChange,
  variant = "outline",
  size = "sm",
  spacing = 2,
  infoPillDescription,
  isRequired = true,
  error,
  disabled = false,
  itemClassName,
  className,
}) {
  const Icon = icon && LucideIcons[icon];

  const selectedValues =
    type === "multiple"
      ? Array.isArray(value)
        ? value
        : []
      : value
        ? [value]
        : [];

  const selectedItems = items.filter((item) => selectedValues.includes(item.value));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
        {infoPillDescription && (
          <InfoTooltip content={infoPillDescription}>
            <LucideIcons.CircleQuestionMark className="size-4" />
          </InfoTooltip>
        )}
        {isRequired && isEditing && (
          <span className="text-destructive text-xs">*</span>
        )}
      </div>

      {isEditing ? (
        <>
          <ToggleGroup
            type={type}
            value={value}
            onValueChange={onChange}
            variant={variant}
            size={size}
            spacing={spacing}
            disabled={disabled}
            className={cn(
              "flex flex-wrap",
              error && "rounded-md ring-1 ring-destructive"
            )}
          >
            {items.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                aria-label={item.label}
                className={cn(
                  "rounded-full px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
                  itemClassName
                )}
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {error && (
            <span className="text-destructive text-xs pl-2">{error}</span>
          )}
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
              >
                {item.label}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Not Available</span>
          )}
        </div>
      )}
    </div>
  );
}

export default EditableToggleGroupField;
