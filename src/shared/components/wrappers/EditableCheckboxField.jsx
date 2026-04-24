import { Checkbox } from "@/shared/components/ui/checkbox";
import { CheckCircle2, CircleQuestionMark, XCircle } from "lucide-react";
import { InfoTooltip } from "../InfoTooltip";

function EditableCheckboxField({
  label,
  checked = false,
  onChange,
  isEditing = false,
  icon = "CheckSquare",
  infoPillDescription,
  isRequired = true,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
          />
          {label && (
            <p className="text-sm font-medium text-foreground leading-snug">
              {label}
            </p>
          )}
          {infoPillDescription && (
            <InfoTooltip content={infoPillDescription}>
              <CircleQuestionMark className="size-4" />
            </InfoTooltip>
          )}
          {isRequired && isEditing && (
            <span className="text-destructive text-xs">*</span>
          )}
        </div>
      ) : (
        <>
          {label && (
            <div className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
          )}
          <div className="text-sm font-medium text-foreground">
            {checked ? (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2
                  className="inline-block text-green-500"
                  size={16}
                />
                Enabled
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="inline-block text-red-500" size={16} />
                Disabled
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EditableCheckboxField;
