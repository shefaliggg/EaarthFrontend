import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/config/utils"
import { Minus, Plus } from "lucide-react"
import { Button } from "../../../../../shared/components/ui/button"

export function TimesheetMiniField({
    label,
    value = 0,
    fieldKey,
    type = "number", // "number" | "bool" | "derived"
    isEditing = false,
    disabled = false,
    step = 1,
    min = 0,
    onChange,
}) {
    const isEditable = isEditing && !disabled && type !== "derived"

    const numValue = Number(value) || 0

    const increment = () => onChange(fieldKey, numValue + step)
    const decrement = () =>
        onChange(fieldKey, Math.max(min, numValue - step))

    return (
        <div
            className={cn(
                "group flex items-center justify-between h-5 rounded px-1 transition-colors",
                isEditable
                    ? "bg-purple-200 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:ring-purple-700"
                    : "bg-lavender-100/30 dark:bg-muted"
            )}
        >
            {/* LABEL */}
            <span className="text-[9px] font-medium text-muted-foreground truncate">
                {label}
            </span>

            {/* VALUE / INPUT */}
            {isEditing && isEditable ? (
                type === "bool" ? (
                    <Checkbox
                        checked={!!value}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                            onChange(fieldKey, checked ? 1 : 0)
                        }
                        className="scale-[0.7] border-primary"
                    />
                ) : (
                    <div className="flex items-center gap-[1px]">
                        {/* INPUT */}
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={numValue || ""}
                            onChange={(e) =>
                                onChange(fieldKey, Number(e.target.value) || 0)
                            }
                            className={cn(
                                "h-4 w-7 px-0.5 text-xs font-mono text-right",
                                "bg-transparent border-none shadow-none",
                                "focus-visible:ring-0 focus-visible:outline-none"
                            )}
                        />

                        {/* STEPPER */}
                        <div className="flex flex-col opacity-50 group-hover:opacity-100 transition-opacity space-y-[1px]">
                            <Button
                                size={"icon"}
                                type="button"
                                onClick={increment}
                                className="h-2 w-2 flex items-center justify-center rounded hover:bg-purple-200/60 dark:hover:bg-purple-800/60"
                            >
                                <Plus className="size-2" />
                            </Button>
                            <Button
                                size={"icon"}
                                onClick={decrement}
                                className="h-2 w-2 flex items-center justify-center rounded hover:bg-purple-200/60 dark:hover:bg-purple-800/60"
                            >
                                <Minus className="size-2" />
                            </Button>
                        </div>
                    </div>
                )
            ) : (
                <span className="text-[10px] text-primary">
                    {numValue ? numValue : <Minus className="size-3 opacity-50" />}
                </span>
            )}
        </div>
    )
}
