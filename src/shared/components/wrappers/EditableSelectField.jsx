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
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-gray-500 dark:text-gray-500">
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
        <div className={cn(
          "h-10 flex items-center rounded-md px-3 text-sm font-medium shadow-none",
          "bg-gray-100 dark:bg-gray-800",
          "border border-transparent"
        )}>
          {selectedItem?.label ?? "Not set"}
        </div>
      )}
    </div>
  );
}

export default EditableSelectField;
