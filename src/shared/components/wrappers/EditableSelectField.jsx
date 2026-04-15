import * as LucideIcons from "lucide-react";
import { SelectMenu } from "../menus/SelectMenu";
import { cn } from "@/shared/config/utils";
import { InfoTooltip } from "../InfoTooltip";

function EditableSelectField({
  label,
  icon,
  placeholder = "Select",
  value,
  items,
  isEditing,
  onChange,
  selectClassName,
  infoPillDescription,
  isRequired = true,
  error,
}) {
  const Icon = icon && LucideIcons[icon];
  const selectedItem = items.find((i) => i.value === value);

  return (
    <div className="flex flex-col gap-1.5">
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
          <SelectMenu
            items={items}
            selected={value}
            label={placeholder}
            onSelect={onChange}
            className={cn("w-full shadow-none", selectClassName)}
          />
          {error && (
            <span className="text-destructive text-xs pl-2">{error}</span>
          )}
        </>
      ) : (
        <div className="text-sm font-medium text-foreground">
          {selectedItem?.label ?? (
            <span className="text-muted-foreground">Not Available</span>
          )}
        </div>
      )}
    </div>
  );
}

export default EditableSelectField;
