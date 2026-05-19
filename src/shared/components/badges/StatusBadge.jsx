import { cn } from "../../config/utils";
import { Badge } from "../ui/badge";
import { getStatusBadge } from "../../config/statusBadgeConfig";
import { SmartIcon } from "../SmartIcon";

export function StatusBadge({
  status = "information",
  label,
  icon,
  showIcon = true,
  showLabel = true,
  size = "md",
  className,
}) {
  const { color, Icon, label: text } = getStatusBadge(status, label);

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px] rounded-md",
    sm: "px-2.5 py-1 text-[11px] rounded-lg",
    md: "px-3 py-1.5 text-xs rounded-xl",
    lg: "px-4 py-2 text-sm rounded-2xl",
  };

  const iconSizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const FinalIcon = icon ?? Icon;

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold tracking-wide leading-none",
        "transition-all duration-200",
        "hover:scale-[1.02]",
        "select-none",
        sizes[size],
        color,
        className,
      )}
    >
      {showIcon && FinalIcon && (
        <SmartIcon icon={FinalIcon} className={iconSizes[size]} />
      )}
      {showLabel && <span className="leading-none">{text}</span>}
    </Badge>
  );
}
