import * as LucideIcons from "lucide-react";
import { convertToPrettyText, cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SmartIcon } from "../SmartIcon";
import { InfoTooltip } from "../InfoTooltip";

function EditableTextDataField({
  label,
  value,
  icon,
  isEditing = false,
  onChange,
  multiline = false,
  placeholder = "Enter value",
  type,
  inputClassName,
  infoPillDescription,
  isRequired = true,
  error,
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {icon && <SmartIcon icon={icon} size="md" />}
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

      {/* Value */}
      {!isEditing ? (
        <div className="text-sm font-medium text-foreground">
          {value === null || value === undefined || value === "" ? (
            <span className="text-muted-foreground">Not Available</span>
          ) : typeof value === "string" ? (
            convertToPrettyText(value)
          ) : (
            value
          )}
        </div>
      ) : (
        <div>
          {multiline ? (
            <>
              <Textarea
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  "resize-none rounded-md shadow-none",
                  "border border-transparent",
                  "focus:outline-none",
                  "min-h-[80px]",
                  inputClassName,
                )}
              />
              {error && (
                <span className="text-destructive text-xs pl-2">{error}</span>
              )}
            </>
          ) : (
            <>
              <Input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  "rounded-md shadow-none h-8 text-sm font-medium text-gray-900",
                  "border border-transparent",
                  "focus:outline-none",
                  inputClassName,
                )}
              />
              {error && (
                <span className="text-destructive text-xs pl-2">{error}</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EditableTextDataField;
