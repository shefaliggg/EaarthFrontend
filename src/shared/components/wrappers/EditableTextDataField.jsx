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
}) {

    return (
        <div className="flex flex-col gap-1.5 rounded-xl">
            {/* Label */}
            <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                {icon && <SmartIcon icon={icon} size="md" />}
                <span>{label}</span>
            </div>

            {/* Value */}
            {!isEditing ? (
                <div className="text-sm font-medium text-foreground bg-gray-100 dark:bg-gray-800 uppercase p-2.5 rounded-md border border-transparent shadow-none">
                    {value === null || value === undefined || value === "" ? (
                        <span className="italic text-muted-foreground">
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
                            value={value ?? ""}
                            onChange={(e) => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            className={cn(
                                "rounded-md shadow-none",
                                "bg-gray-100 dark:bg-gray-800",
                                "border border-transparent",
                                "focus:outline-none"
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default EditableTextDataField;
