import * as LucideIcons from "lucide-react";
import { SelectMenu } from "../menus/SelectMenu";
import { cn } from "@/shared/config/utils";

function EditableSelectField({
  label,
  icon,
  value,
  items,
  isEditing,
  onChange,
  selectClassName,
}) {
  const Icon = icon && LucideIcons[icon];
  const selectedItem = items.find(i => i.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>

      {isEditing ? (
        <SelectMenu
          items={items}
          selected={value}
          onSelect={onChange}
          className={cn("w-full shadow-none", selectClassName)}
        />
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
