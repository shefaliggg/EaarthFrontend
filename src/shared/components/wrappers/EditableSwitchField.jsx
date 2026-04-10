import { Switch } from "@/shared/components/ui/switch";
import { StatusBadge } from "../badges/StatusBadge";
import { cn } from "@/shared/config/utils";

function EditableSwitchField({
  label,
  checked = false,
  onChange,
  isEditing = false,
  switchSize = "lg",
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
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <StatusBadge
          status={checked ? "enabled" : "inactive"}
          showIcon={false}
          size="sm"
        />

        <Switch
          size={switchSize}
          checked={checked}
          onCheckedChange={onChange}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}

export default EditableSwitchField;
