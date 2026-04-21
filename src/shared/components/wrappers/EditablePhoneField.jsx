import { CircleQuestionMark } from "lucide-react";
import { InfoTooltip } from "../InfoTooltip";
import { SmartIcon } from "../SmartIcon";
import EditableSelectField from "./EditableSelectField";
import EditableTextDataField from "./EditableTextDataField";

function EditablePhoneField({
  label = "Phone",
  badge,
  icon,
  value = { countryCode: "", phoneNumber: "" },
  isEditing = false,
  onChange,
  codeOptions = [],
  infoPillDescription,
  isRequired = true,
  error,
  disabled = false,
}) {
  const handleCodeChange = (code) => {
    onChange?.({
      ...value,
      countryCode: code,
    });
  };

  const handleNumberChange = (number) => {
    onChange?.({
      ...value,
      phoneNumber: number,
    });
  };

  const isEmpty = !value?.countryCode && !value?.phoneNumber;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {icon && <SmartIcon icon={icon} size="md" />}
        <span>{label}</span>
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

      {/* View Mode */}
      {!isEditing ? (
        <div className="text-sm font-medium text-foreground">
          {isEmpty ? (
            <span className="text-muted-foreground">Not Available</span>
          ) : (
            `${value.countryCode || ""} ${value.phoneNumber || ""}`
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div className="flex gap-2">
          {/* Country Code */}
          <div className="w-[140px]">
            <EditableSelectField
              value={value.countryCode}
              items={codeOptions}
              isEditing={true}
              onChange={handleCodeChange}
              selectClassName="h-8! text-sm"
              isRequired={false}
              disabled={disabled}
            />
          </div>

          {/* Phone Number */}
          <div className="flex-1">
            <EditableTextDataField
              value={value.phoneNumber}
              isEditing={true}
              onChange={handleNumberChange}
              placeholder="Enter number"
              type="tel"
              inputClassName="h-8"
              isRequired={false}
              disabled={disabled}
            />
          </div>
        </div>
      )}
      {error && <span className="text-destructive text-xs pl-2">{error}</span>}
    </div>
  );
}

export default EditablePhoneField;
