import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { SmartIcon } from "../SmartIcon";
import { cn } from "@/shared/config/utils";

function EditableRadioField({
  label,
  value,
  options = [], // [{ label, value }]
  isEditing = false,
  onChange,
  icon,
}) {
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="flex flex-col gap-1.5 rounded-xl">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon && <SmartIcon icon={icon} size="md" />}
        <span>{label}</span>
      </div>

      {/* View Mode */}
      {!isEditing ? (
        <div className="text-sm font-medium text-foreground">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-muted-foreground">
              Not Available
            </span>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <RadioGroup
          value={value}
          onValueChange={onChange}
        >
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <RadioGroupItem value={option.value} />
              <span className="text-sm font-medium">
                {option.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}

export default EditableRadioField;
