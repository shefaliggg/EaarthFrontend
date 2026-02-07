import * as LucideIcons from "lucide-react";
import { convertToPrettyText, cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SmartIcon } from "../SmartIcon";

function EditableTextDataField({
    label,
    value,
    icon,
    isEditing = false,
    onChange,
    multiline = false,
    placeholder = "Enter value",
    type,
    required,
    inputClassName,
}) {

    return (
        <div className="flex flex-col gap-1.5 rounded-xl">
            {/* Label */}
            <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                {icon && <SmartIcon icon={icon} size="md" />}
                <span>{label}</span>
            </div>

            {/* Value */}
            {!isEditing ? (
                <div className="text-sm font-medium text-foreground">
                    {value === null || value === undefined || value === "" ? (
                        <span className="text-muted-foreground">
                            Not Available
                        </span>
                    ) : typeof value === "string" ? (
                        convertToPrettyText(value)
                    ) : (
                        value
                    )}
                </div>
            ) : (
                <div>
                    {multiline ? (
                        <Textarea
                            value={value ?? ""}
                            onChange={(e) => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            className={cn(
                                "resize-none rounded-md shadow-none",
                                "bg-gray-100 dark:bg-gray-800",
                                "border border-transparent",
                                "focus:outline-none"
                            )}
                        />
                    ) : (
                        <Input
                            type={type}
                            value={value ?? ""}
                            onChange={(e) => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            className={cn(
                                "rounded-md shadow-none h-8 text-sm font-medium text-gray-900",
                                "bg-gray-100 dark:bg-gray-800",
                                "border border-transparent",
                                "focus:outline-none",
                                inputClassName
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default EditableTextDataField;
