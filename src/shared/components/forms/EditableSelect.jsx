import { cn } from "@/shared/config/utils";

/**
 * EditableSelect Component
 * 
 * A select/dropdown that switches between read-only display mode and editable mode.
 * In read-only mode, displays the selected value as text.
 * In edit mode, shows the full select dropdown.
 */
function EditableSelect({
  isEditing = false,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className,
  required = false,
  error,
  ...props
}) {
  // Get the label for the current value
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || value || "";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!isEditing ? (
        // Read-only mode - display as text
        <div
          className={cn(
            "w-full px-3 py-2 rounded-md text-sm",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "border border-transparent shadow-none",
            "flex items-center",
            className
          )}
        >
          {displayValue || <span className="text-gray-500">{placeholder}</span>}
        </div>
      ) : (
        // Edit mode - show select dropdown
        <select
          value={value}
          onChange={onChange}
          className={cn(
            "w-full px-3 py-2 rounded-md text-sm transition-all duration-200",
            "bg-gray-100 dark:bg-gray-800",
            "border border-transparent shadow-none",
            "text-foreground dark:text-gray-100",
            "focus:outline-none",
            "cursor-pointer",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default EditableSelect;
