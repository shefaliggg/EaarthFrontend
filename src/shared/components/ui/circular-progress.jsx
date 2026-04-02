import { cn } from "@/shared/config/utils";

export function CircularProgress({
  value,
  size = 64,
  strokeWidth = 6,
  className,
  labelClass = "text-xs",
  color,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-300 ease-out motion-reduce:transition-none",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={color ? { stroke: color } : undefined}
          className={cn(
            "fill-none transition-[stroke-dashoffset] duration-300 ease-out",
            !color && "stroke-primary",
          )}
        />
      </svg>

      {/* Center label */}
      <span className={cn("absolute font-medium tabular-nums text-xs", labelClass)}>
        {progress}%
      </span>
    </div>
  );
}
