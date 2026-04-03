import { motion } from "framer-motion";

function AnimatedCircularProgress({
  progressPercentage,
  projectColor,
  size = 40
}) {
  const locked = false;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={locked ? "#22c55e" : projectColor}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              circumference - (progressPercentage / 100) * circumference,
          }}
          transition={{ duration: 0.8 }}
        />
      </svg>

      <div className="absolute flex items-center justify-center">
        {locked ? (
          <span className="text-xs font-medium tabular-nums">
            {progressPercentage}%
          </span>
        ) : (
          <span className="text-xs font-medium tabular-nums">
            {progressPercentage}%
          </span>
        )}
      </div>
    </div>
  );
}

export default AnimatedCircularProgress;
