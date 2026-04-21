import { Switch } from "@/shared/components/ui/switch";
import { StatusBadge } from "../badges/StatusBadge";
import { cn } from "@/shared/config/utils";
import { InfoTooltip } from "../InfoTooltip";
import { CircleQuestionMark } from "lucide-react";

function EditableSwitchField({
  label,
  badge,
  icon,
  checked = false,
  onChange,
  isEditing = false,
  switchSize = "lg",
  infoPillDescription,
  isRequired = true,
  error,
  disabled = false,
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3",
        "border border-muted",
        "transition-all duration-200",
        isEditing && "hover:bg-muted/60",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <SmartIcon icon={icon} size="md" />}

        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
        {badge && <span className="text-amber-600">({badge})</span>}
        {infoPillDescription && (
          <InfoTooltip content={infoPillDescription}>
            <CircleQuestionMark className="size-4" />
          </InfoTooltip>
        )}
        {isRequired && isEditing && (
          <span className="text-destructive text-xs">*</span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <StatusBadge
          status={checked ? "enabled" : "disabled"}
          showIcon={false}
          size="sm"
        />

        <Switch
          size={switchSize}
          checked={checked}
          onCheckedChange={onChange}
          disabled={!isEditing || disabled}
        />
      </div>
    </div>
  );
}

export default EditableSwitchField;
