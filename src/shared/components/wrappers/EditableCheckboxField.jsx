import * as LucideIcons from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { SmartIcon } from "../SmartIcon";
import { StatusBadge } from "../badges/StatusBadge";
import { cn } from "@/shared/config/utils";

function EditableCheckboxField({
    label,
    checked = false,
    onChange,
    isEditing = false,
    icon = "CheckSquare",
    description,
}) {

    return (
        <div className="flex flex-col gap-1.5 rounded-xl">
            {/* <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
                {icon && <SmartIcon icon={icon} size="md" />}
                <span>{label}</span>
            </div> */}

            <div className={cn(
                "flex items-center gap-2 rounded-md p-2.5 shadow-none",
                "bg-gray-100 dark:bg-gray-800"
            )}>
                {isEditing ? (
                    <Checkbox
                        checked={checked}
                        onCheckedChange={onChange}
                    />
                ) : (
                    <StatusBadge status={checked ? "enabled" : "disabled"} size="sm"/>
                )}

                {label && (
                    <p className="text-xs text-muted-foreground leading-snug">
                        {label}
                    </p>
                )}
            </div>
        </div>
    );
}

export default EditableCheckboxField;
