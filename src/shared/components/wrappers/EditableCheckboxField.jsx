import { Checkbox } from "@/shared/components/ui/checkbox";

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
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={checked}
                        onCheckedChange={onChange}
                    />
                    {label && (
                        <p className="text-sm font-medium text-foreground leading-snug">
                            {label}
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {label && (
                        <div className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                            {label}
                        </div>
                    )}
                    <div className="text-sm font-medium text-foreground">
                        {checked ? "Enabled" : "Disabled"}
                    </div>
                </>
            )}
        </div>
    );
}

export default EditableCheckboxField;
