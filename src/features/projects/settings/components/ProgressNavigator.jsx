import * as FramerMotion from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Progress } from "@/shared/components/ui/progress";
import { memo } from "react";

function getCircumference(radius) {
  return 2 * Math.PI * radius;
}

function getDashOffset(circumference, percent) {
  return circumference - (percent / 100) * circumference;
}

const PageRing = memo(({ isActive, tabNumber, progress, locked }) => {
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
            stroke="rgb(from var(--primary) r g b / 0.12)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <FramerMotion.motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={locked ? "var(--mint-500)" : "var(--primary)"}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: getDashOffset(circumference, progress),
            }}
            transition={{ duration: 0.6 }}
          />
        </svg>
        <div
          className="rounded-full flex items-center justify-center text-white text-[0.56rem] font-semibold"
          style={{
            width: 20,
            height: 20,
            backgroundColor: locked ? "var(--mint-500)" : "var(--primary)",
          }}
        >
          {locked ? (
            <Check size={12} />
          ) : (
            <span className="text-[0.48rem]">{tabNumber}</span>
          )}
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
          stroke="rgb(from var(--primary) r g b / 0.082)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <FramerMotion.motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={locked ? "var(--mint-500)" : "var(--primary)"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: getDashOffset(circumference, progress),
          }}
          transition={{ duration: 0.6 }}
        />
      </svg>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 18,
          height: 18,
          backgroundColor: locked
            ? "var(--mint-500)"
            : `rgb(from var(--primary) r g b / 0.082)`,
          color: locked ? "#fff" : "var(--primary)",
        }}
      >
        {locked ? (
          <Check size={12} />
        ) : (
          <span className="text-[0.48rem]">{tabNumber}</span>
        )}
      </div>
    </>
  );
});

function ProgressNavigator({ tabs, activeIndex, currentTab, goPrev, goNext }) {
  return (
    <>
      <div className="rounded-3xl border bg-background shadow-sm mt-7">
        <div className="flex items-center justify-center py-2 gap-2">
          <FramerMotion.motion.button
            className="flex items-center justify-center w-5 h-5 rounded-full transition-colors hover:bg-muted/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
          >
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          </FramerMotion.motion.button>
          <FramerMotion.AnimatePresence mode="wait">
            <FramerMotion.motion.div
              key={currentTab.path}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <span
                style={{
                  backgroundColor: currentTab.locked
                    ? `var(--mint-500)`
                    : `rgb(from var(--primary) r g b / 0.15)`,
                  color: currentTab.locked ? "#fff" : "var(--primary)",
                }}
                className="flex items-center justify-center w-5 h-5 text-[0.55rem] font-semibold leading-none rounded-full"
              >
                {currentTab.locked ? (
                  <Check size={11} />
                ) : (
                  <>{activeIndex + 1}</>
                )}
              </span>
              <span
                style={{
                  color: currentTab.locked
                    ? "var(--mint-500)"
                    : "var(--primary)",
                }}
                className="text-[0.8rem] text-primary"
              >
                {currentTab.label}
              </span>
              <span
                className="px-1.5 py-0.5 text-[0.6rem] rounded-md"
                style={{
                  backgroundColor: currentTab.locked
                    ? `rgb(from var(--mint-500) r g b / 0.08)`
                    : `rgb(from var(--primary) r g b / 0.08)`,
                  color: currentTab.locked
                    ? "rgb(from var(--mint-500) r g b / 0.90)"
                    : "rgb(from var(--primary) r g b / 0.90)",
                }}
              >
                {currentTab.locked ? "Locked" : currentTab.progress + "%"}
              </span>
              <span className="text-muted-foreground text-[0.55rem] mr-1">
                {activeIndex + 1}/{tabs.length}
              </span>
            </FramerMotion.motion.div>
          </FramerMotion.AnimatePresence>
          <FramerMotion.motion.button
            className="flex items-center justify-center w-5 h-5 rounded-full transition-colors hover:bg-muted/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
          >
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </FramerMotion.motion.button>
        </div>
        <div className="flex flex-col px-5 pb-5 pt-1 gap-1">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => (
              <FramerMotion.motion.div
                key={tab.path}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-8 h-8 flex items-center justify-center"
              >
                <NavLink to={tab.path} className="contents">
                  {({ isActive }) => (
                    <PageRing
                      isActive={isActive}
                      tabNumber={index + 1}
                      progress={tab.progress}
                      locked={tab.locked}
                    />
                  )}
                </NavLink>
              </FramerMotion.motion.div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {tabs.slice(0, -1).map((tab) => (
              <div key={tab.path} className="flex-1">
                <Progress
                  progressColor="bg-mint-500"
                  trackColor="bg-muted"
                  value={tab.progress}
                  className="h-1.25"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgressNavigator;
