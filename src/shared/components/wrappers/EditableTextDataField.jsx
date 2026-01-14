import * as LucideIcons from "lucide-react";
import { convertToPrettyText } from "@/shared/config/utils";
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
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
                {icon && <SmartIcon icon={icon} size="md" />}
                <span>{label}</span>
            </div>

            {/* Value */}
            {!isEditing ? (
                <div className="text-sm font-medium text-foreground bg-muted/30 uppercase p-2 rounded-md pl-4 border">
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
                            className="resize-none pl-4 border-border"
                        />
                    ) : (
                        <Input
                            value={value ?? ""}
                            onChange={(e) => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            className={"rounded-md pl-4"}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default EditableTextDataField;
