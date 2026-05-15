import * as LucideIcons from "lucide-react";

import PermissionCheckboxMenu from "./PermissionCheckboxMenu";
import { InfoTooltip } from "../../../../../shared/components/InfoTooltip";

function EditablePermissionCheckboxField({
  label,
  value = [],
  items = [],
  isEditing = false,
  onChange,
  icon,
  infoPillDescription,
  isRequired = true,
  disabled = false,
}) {
  const Icon = icon && LucideIcons[icon];

  const selectedLabels = items
    .filter((item) => value.includes(item.value))
    .map((item) => item.label)
    .join(", ");

  return (
    <div className="flex flex-col gap-1.5">
      {/*✅ LABEL */}
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

      {/*✅ VALUE */}
      {isEditing ? (
        <PermissionCheckboxMenu
          items={items}
          selected={value}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <div className="text-primary text-xs">
          {selectedLabels || (
            <span className="text-muted-foreground">
              Not Available
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default EditablePermissionCheckboxField;