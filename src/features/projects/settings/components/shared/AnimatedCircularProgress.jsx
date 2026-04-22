import { motion } from "framer-motion";

function AnimatedCircularProgress({
  progressPercentage,
  color = "var(--primary)",
  size = 50
}) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size} className="-rotate-90">
        
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          initial={false}
          animate={{
            strokeDashoffset:
              circumference - (progressPercentage / 100) * circumference,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      <span className="absolute text-xs font-medium tabular-nums">
        {progressPercentage}%
      </span>
    </div>
  );
}

export default AnimatedCircularProgress;
