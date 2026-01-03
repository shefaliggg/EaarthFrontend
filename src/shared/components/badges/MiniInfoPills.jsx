import * as Icons from "lucide-react";
import { cn } from "../../config/utils";

function MiniInfoPills({ value, valueText, icon, color }) {
    const PILL_COLORS = {
        purple: {
            bg: "bg-purple-100 dark:bg-purple-900/30",
            border: "border-purple-200 dark:border-purple-800",
            icon: "text-purple-600 dark:text-purple-400",
            text: "text-purple-700 dark:text-purple-400",
        },
        blue: {
            bg: "bg-blue-100 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800",
            icon: "text-blue-600 dark:text-blue-400",
            text: "text-blue-700 dark:text-blue-400",
        },
        emerald: {
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            border: "border-emerald-200 dark:border-emerald-800",
            icon: "text-emerald-600 dark:text-emerald-400",
            text: "text-emerald-700 dark:text-emerald-400",
        },
    };

    const IconComponent = icon && Icons[icon] ? Icons[icon] : null;
    const styles = PILL_COLORS[color];

    if (!styles) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                styles.bg,
                styles.border
            )}
        >
            {IconComponent && (
                <IconComponent className={cn("w-4 h-4", styles.icon)} />
            )}

            <span className={cn("text-sm font-bold", styles.text)}>
                {value} {valueText}
            </span>
        </div>
    );
}

export default MiniInfoPills