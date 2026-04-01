import { SmartIcon } from "../SmartIcon";
import EditableSelectField from "./EditableSelectField";
import EditableTextDataField from "./EditableTextDataField";

function EditablePhoneField({
  label = "Phone",
  icon,
  value = { countryCode: "", phoneNumber: "" },
  isEditing = false,
  onChange,
  codeOptions = [],
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
          <div className="w-[110px]">
            <EditableSelectField
              value={value.countryCode}
              items={codeOptions}
              isEditing={true}
              onChange={handleCodeChange}
              selectClassName="h-8 text-sm"
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EditablePhoneField;
