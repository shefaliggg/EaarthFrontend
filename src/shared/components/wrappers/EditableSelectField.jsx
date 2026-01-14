import * as LucideIcons from "lucide-react";
import { SelectMenu } from "../menus/SelectMenu";

function EditableSelectField({
  label,
  icon,
  value,
  items,
  isEditing,
  onChange,
}) {
  const Icon = icon && LucideIcons[icon];
  const selectedItem = items.find(i => i.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>

      {isEditing ? (
        <SelectMenu
          items={items}
          selected={value}
          onSelect={onChange}
          className="w-full"
        />
      ) : (
        <div className="h-9 flex items-center rounded-md border bg-muted/30 px-3 text-sm font-medium">
          {selectedItem?.label ?? "Not set"}
        </div>
      )}
    </div>
  );
}

export default EditableSelectField;
