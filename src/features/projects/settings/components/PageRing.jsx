import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_COLOR = "#7c3aed";

function getCircumference(radius) {
  return 2 * Math.PI * radius;
}

function getDashOffset(circumference, percent) {
  return circumference - (percent / 100) * circumference;
}

const PageRing = memo(({ isActive, pageNumber }) => {
  if (isActive) {
    const size = 32;
    const strokeWidth = 2.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = getCircumference(radius);
    const center = size / 2;

    return (
      <>
        <svg width={size} height={size} className="absolute -rotate-90">
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={`${PROJECT_COLOR}20`}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={PROJECT_COLOR}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: getDashOffset(circumference, 20),
            }}
            transition={{ duration: 0.6 }}
          />
        </svg>
        <div
          className="rounded-full flex items-center justify-center text-white text-[0.56rem] font-semibold"
          style={{ width: 20, height: 20, backgroundColor: PROJECT_COLOR }}
        >
          {pageNumber}
        </div>
      </>
    );
  }

  // Inactive state
  const size = 26;
  const strokeWidth = 2;
  const radius = 11;
  const circumference = getCircumference(radius);
  const center = size / 2;

  return (
    <>
      <svg width={size} height={size} className="absolute -rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`${PROJECT_COLOR}15`}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={PROJECT_COLOR}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: getDashOffset(circumference, 20),
          }}
          transition={{ duration: 0.6 }}
        />
      </svg>
      <div
        className="rounded-full flex items-center justify-center text-[0.48rem]"
        style={{
          width: 18,
          height: 18,
          backgroundColor: `${PROJECT_COLOR}15`,
          color: PROJECT_COLOR,
        }}
      >
        {pageNumber}
      </div>
    </>
  );
});

PageRing.displayName = "PageRing";

export default PageRing;
