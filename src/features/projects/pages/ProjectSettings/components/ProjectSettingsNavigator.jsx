import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

function ProjectSettingsNavigator({
  activeTab,
  onTabChange,
  locks,
  tabProgressById,
  color,
  tabs,
}) {
  const [hoveredTab, setHoveredTab] = useState(null);

  const totalTabs = tabs.length;
  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const hoveredTabIndex = tabs.findIndex((t) => t.id === hoveredTab);
  const displayTabIndex =
    hoveredTabIndex >= 0 ? hoveredTabIndex : currentTabIndex;

  const displayTabId = hoveredTab || activeTab;
  const displayLabel = tabs[displayTabIndex]?.label ?? "";

  const displayIsLocked = !!locks[displayTabId];
  const displayProgressPct = tabProgressById[displayTabId] || 0;

  const prevTab = tabs[currentTabIndex - 1]?.id;
  const nextTab = tabs[currentTabIndex + 1]?.id;

  return (
    <>
      <div className="rounded-xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center justify-center py-2 gap-2">
          {prevTab ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(prevTab)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          ) : (
            <div className="w-5" />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={displayLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {/* Tab number circle */}
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full font-semibold text-[0.55rem]"
                style={{
                  backgroundColor: displayIsLocked ? "#22c55e" : `${color}15`,
                  color: displayIsLocked ? "#fff" : color,
                }}
              >
                {displayIsLocked ? (
                  <Check style={{ width: 10, height: 10 }} />
                ) : (
                  displayTabIndex + 1
                )}
              </span>

              {/* Tab label (Details / Contacts / etc) */}
              <span
                className="text-[0.8rem]"
                style={{
                  color: displayIsLocked ? "#22c55e" : color,
                }}
              >
                {displayLabel}
              </span>

              {/* Progress Badge (e.g. 40%) */}
              {!displayIsLocked && displayProgressPct > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-md text-[0.6rem]"
                  style={{
                    backgroundColor: `${color}08`,
                    color: `${color}90`,
                  }}
                >
                  {displayProgressPct}%
                </span>
              )}

              {/* Locked badge */}
              {displayIsLocked && (
                <span className="px-1.5 py-0.5 rounded-md text-[0.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                  Locked
                </span>
              )}

              {/* Tab counter e.g. 3/21 */}
              <span className="text-muted-foreground text-[0.55rem]">
                {currentTabIndex + 1}/{totalTabs}
              </span>
            </motion.div>
          </AnimatePresence>
          {nextTab ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(nextTab)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </motion.button>
          ) : (
            <div className="w-5" />
          )}
        </div>
        {/* ── Timeline Progress Navigator ── */}
        <div className="flex flex-col px-5 pb-5 pt-1">
          {/* Step nodes */}
          <div
            className="flex items-center justify-between mb-1.5"
            style={{ height: 32 }}
          >
            {tabs.map((tab, index) => {
              /* ────────────── Step state ────────────── */

              const stepId = tab.id;
              const isCurrentStep = stepId === activeTab;
              const isStepLocked = Boolean(locks[stepId]);
              const stepProgress = tabProgressById[stepId] ?? 0;

              /* ────────────── Ring sizing ────────────── */

              const ringDiameter = isCurrentStep ? 32 : 26;
              const ringStroke = isCurrentStep ? 2.5 : 2;

              /* ────────────── Circle geometry ────────────── */

              const circleRadius = (ringDiameter - ringStroke) / 2;
              const circleCircumference = 2 * Math.PI * circleRadius;

              /* ────────────── Progress arc  ────────────── */

              const progressOffset =
                circleCircumference -
                (stepProgress / 100) * circleCircumference;

              /* ────────────── Ring colors ────────────── */

              const progressColor = isStepLocked
                ? "#22c55e"
                : stepProgress > 0
                  ? color
                  : "transparent";

              const trackColor = isStepLocked
                ? "#22c55e20"
                : stepProgress > 0
                  ? `${color}15`
                  : "#e5e7eb40";

              /* ────────────── Inner circle size  ────────────── */

              const innerSize = ringDiameter - ringStroke * 2 - 4;

              /* ────────────── Inner colors ────────────── */

              const innerBackground = isStepLocked
                ? "#22c55e"
                : isCurrentStep
                  ? color
                  : stepProgress > 0
                    ? `${color}20`
                    : "var(--color-muted)";

              const innerTextColor =
                isStepLocked || isCurrentStep
                  ? "#fff"
                  : stepProgress > 0
                    ? color
                    : "var(--color-muted-foreground)";

              const innerFontSize = isCurrentStep ? "0.56rem" : "0.48rem";
              const innerFontWeight = isCurrentStep ? 600 : 500;

              const activeShadow = isCurrentStep
                ? `0 0 0 2px ${isStepLocked ? "#22c55e25" : color + "20"}`
                : "none";

              return (
                <motion.button
                  key={stepId}
                  onClick={() => onTabChange(stepId)}
                  onMouseEnter={() => setHoveredTab(stepId)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative flex items-center justify-center w-8 h-8"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Progress ring */}
                  <svg
                    width={ringDiameter}
                    height={ringDiameter}
                    className="absolute -rotate-90"
                  >
                    {/* ring track */}
                    <circle
                      cx={ringDiameter / 2}
                      cy={ringDiameter / 2}
                      r={circleRadius}
                      fill="none"
                      stroke={trackColor}
                      strokeWidth={ringStroke}
                    />

                    {/* progress arc */}
                    {stepProgress > 0 && (
                      <motion.circle
                        cx={ringDiameter / 2}
                        cy={ringDiameter / 2}
                        r={circleRadius}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth={ringStroke}
                        strokeLinecap="round"
                        strokeDasharray={circleCircumference}
                        initial={{ strokeDashoffset: circleCircumference }}
                        animate={{ strokeDashoffset: progressOffset }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}
                  </svg>

                  {/* Step circle */}
                  <div
                    className="rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      width: innerSize,
                      height: innerSize,
                      backgroundColor: innerBackground,
                      color: innerTextColor,
                      fontSize: innerFontSize,
                      fontWeight: innerFontWeight,
                      boxShadow: activeShadow,
                    }}
                  >
                    {isStepLocked ? (
                      <Check style={{ width: 10, height: 10 }} />
                    ) : (
                      index + 1
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Step connector bars */}
          <div className="flex items-center gap-0.5">
            {tabs.map((tab, index) => {
              if (index === tabs.length - 1) return null;

              const currentProgress = tabProgressById[tab.id] ?? 0;
              const nextProgress = tabProgressById[tabs[index + 1].id] ?? 0;

              const segmentProgress = Math.round(
                (currentProgress + nextProgress) / 2,
              );

              const segmentBackground =
                segmentProgress >= 100
                  ? "linear-gradient(90deg,#22c55e,#16a34a)"
                  : segmentProgress > 0
                    ? "linear-gradient(90deg,#4ade80,#22c55e)"
                    : "transparent";

              return (
                <div
                  key={`segment-${tab.id}`}
                  className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: segmentBackground }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${segmentProgress}%` }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectSettingsNavigator;
