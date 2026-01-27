import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { SmartIcon } from "../SmartIcon";

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
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
        {icon && <SmartIcon icon={icon} size="md" />}
        <span>{label}</span>
      </div>

      {/* View Mode */}
      {!isEditing ? (
        <div className="h-9 flex items-center rounded-md border bg-muted/30 px-4 text-sm font-medium uppercase">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="italic text-muted-foreground">
              Not Available
            </span>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <RadioGroup
          value={value}
          onValueChange={onChange}
          className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3"
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
