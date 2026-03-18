import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";

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
  const displayTabIndex = hoveredTabIndex >= 0 ? hoveredTabIndex : currentTabIndex;
  const displayTabId = hoveredTab || activeTab;
  const displayLabel = tabs[displayTabIndex]?.label ?? "";
  const displayIsLocked = !!locks[displayTabId];
  const displayProgressPct = tabProgressById[displayTabId] || 0;

  const prevTab = tabs[currentTabIndex - 1]?.id;
  const nextTab = tabs[currentTabIndex + 1]?.id;

  return (
    <div className="rounded-xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm">
      {/* ── Top label row ── */}
      <div className="flex items-center justify-center py-2 gap-2">
        {prevTab ? (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(prevTab)}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          </motion.button>
        ) : <div className="w-5" />}

        <AnimatePresence mode="wait">
          <motion.div
            key={displayLabel}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full font-semibold text-[0.55rem]"
              style={{ backgroundColor: displayIsLocked ? "#22c55e" : `${color}15`, color: displayIsLocked ? "#fff" : color }}
            >
              {displayIsLocked ? <Check style={{ width: 10, height: 10 }} /> : displayTabIndex + 1}
            </span>
            <span className="text-[0.8rem]" style={{ color: displayIsLocked ? "#22c55e" : color }}>
              {displayLabel}
            </span>
            {!displayIsLocked && displayProgressPct > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[0.6rem]" style={{ backgroundColor: `${color}08`, color: `${color}90` }}>
                {displayProgressPct}%
              </span>
            )}
            {displayIsLocked && (
              <span className="px-1.5 py-0.5 rounded-md text-[0.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                Locked
              </span>
            )}
            <span className="text-muted-foreground text-[0.55rem]">{currentTabIndex + 1}/{totalTabs}</span>
          </motion.div>
        </AnimatePresence>

        {nextTab ? (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(nextTab)}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </motion.button>
        ) : <div className="w-5" />}
      </div>

      {/* ── Timeline ── */}
      <div className="flex flex-col px-5 pb-5 pt-1">

        {/* Step nodes */}
        <div className="flex items-center justify-between mb-1.5" style={{ height: 32 }}>
          {tabs.map((tab, index) => {
            const stepId = tab.id;
            const isCurrentStep = stepId === activeTab;
            const isStepLocked = Boolean(locks[stepId]);
            const stepProgress = tabProgressById[stepId] ?? 0;

            const ringDiameter = isCurrentStep ? 32 : 26;
            const ringStroke = isCurrentStep ? 2.5 : 2;
            const circleRadius = (ringDiameter - ringStroke) / 2;
            const circleCircumference = 2 * Math.PI * circleRadius;
            const progressOffset = circleCircumference - (stepProgress / 100) * circleCircumference;

            const progressColor = isStepLocked ? "#22c55e" : stepProgress > 0 ? color : "transparent";
            const trackColor = isStepLocked ? "#22c55e20" : stepProgress > 0 ? `${color}15` : "#e5e7eb40";
            const innerSize = ringDiameter - ringStroke * 2 - 4;
            const innerBackground = isStepLocked ? "#22c55e" : isCurrentStep ? color : stepProgress > 0 ? `${color}20` : "var(--color-muted)";
            const innerTextColor = isStepLocked || isCurrentStep ? "#fff" : stepProgress > 0 ? color : "var(--color-muted-foreground)";
            const activeShadow = isCurrentStep ? `0 0 0 2px ${isStepLocked ? "#22c55e25" : color + "20"}` : "none";

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
                <svg width={ringDiameter} height={ringDiameter} className="absolute -rotate-90">
                  <circle
                    cx={ringDiameter / 2} cy={ringDiameter / 2} r={circleRadius}
                    fill="none" stroke={trackColor} strokeWidth={ringStroke}
                  />
                  {stepProgress > 0 && (
                    <circle
                      cx={ringDiameter / 2} cy={ringDiameter / 2} r={circleRadius}
                      fill="none" stroke={progressColor} strokeWidth={ringStroke}
                      strokeLinecap="round"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={progressOffset}
                      style={{ transition: "stroke-dashoffset 0.6s ease-in-out, stroke 0.3s ease" }}
                    />
                  )}
                </svg>
                <div
                  className="rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    width: innerSize, height: innerSize,
                    backgroundColor: innerBackground, color: innerTextColor,
                    fontSize: isCurrentStep ? "0.56rem" : "0.48rem",
                    fontWeight: isCurrentStep ? 600 : 500,
                    boxShadow: activeShadow,
                  }}
                >
                  {isStepLocked ? <Check style={{ width: 10, height: 10 }} /> : index + 1}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Connector bars ──
            Each bar uses ONLY the left tab's own progress.
            Tab 5 = 100% → bar after tab 5 = 100% green. Simple & correct.
        ── */}
        <div className="flex items-center gap-0.5">
          {tabs.map((tab, index) => {
            if (index === tabs.length - 1) return null;

            const isTabLocked = Boolean(locks[tab.id]);
            const tabProgress = tabProgressById[tab.id] ?? 0;

            // Locked tab → always full green bar
            const barValue = isTabLocked ? 100 : tabProgress;

            const indicatorClass =
              barValue >= 100
                ? "[&>[data-slot=progress-indicator]]:bg-green-500"
                : barValue > 0
                  ? "[&>[data-slot=progress-indicator]]:bg-green-400"
                  : "[&>[data-slot=progress-indicator]]:bg-transparent";

            return (
              <Progress
                key={`segment-${tab.id}`}
                value={barValue}
                className={`flex-1 h-1.5 rounded-full bg-muted ${indicatorClass}`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default ProjectSettingsNavigator;