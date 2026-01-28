import { cn } from "@/shared/config/utils";

/**
 * EditableTextarea Component
 * 
 * A textarea that switches between read-only display mode and editable mode.
 * Similar to EditableInput but for multi-line text content.
 */
function EditableTextarea({
  isEditing = false,
  label,
  value,
  onChange,
  placeholder = "",
  className,
  required = false,
  error,
  rows = 4,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={!isEditing}
        rows={rows}
        className={cn(
          "w-full px-3 py-2 rounded-md text-sm transition-all duration-200 resize-none",
          "border border-transparent shadow-none",
          
          // Read-only mode (disabled)
          !isEditing && [
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "cursor-default",
            "border-transparent",
            "placeholder:text-gray-500 dark:placeholder:text-gray-600",
          ],

          // Edit mode (enabled)
          isEditing && [
            "bg-gray-100 dark:bg-gray-800",
            "text-foreground dark:text-gray-100",
            "placeholder:text-muted-foreground dark:placeholder:text-gray-500",
            "focus:outline-none",
          ],

          // Error state
          error && "border-red-500 focus:ring-red-500/40",

          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default EditableTextarea;
