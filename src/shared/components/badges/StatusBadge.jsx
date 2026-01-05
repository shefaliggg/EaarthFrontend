import { cn } from "../../config/utils";
import { Badge } from "../ui/badge";
import { getStatusBadge } from "../../config/statusBadgeConfig";
import { SmartIcon } from "../SmartIcon";

export function StatusBadge({
    status,
    label,
    showIcon = true,
    size = "md",
    className,
}) {
    const { color, Icon, label: text } = getStatusBadge(status, label);

    const sizes = {
        sm: "px-2 py-1 text-[10px] rounded-lg",
        md: "px-3 py-1.5 text-xs rounded-xl",
        lg: "px-4 py-2 text-sm rounded-xl",
    };

    return (
        <Badge
            className={cn(
                "inline-flex items-center gap-1 font-medium",
                sizes[size],
                color,
                className
            )}
        >
            {showIcon && Icon && <SmartIcon icon={Icon} />}
            {text}
        </Badge>
    );
}
