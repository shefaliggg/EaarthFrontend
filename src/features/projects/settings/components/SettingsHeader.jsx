import AnimatedCircularProgress from "@/features/projects/settings/components/shared/AnimatedCircularProgress";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { StatusBadge } from "../../../../shared/components/badges/StatusBadge";

export default function SettingsHeader({ currentTab }) {
  return (
    <>
      <div className="p-4 rounded-3xl border bg-background shadow-sm">
        <div className="flex items-center gap-4">
          <AnimatedCircularProgress
            progressPercentage={currentTab.progress}
            color={currentTab.locked ? "var(--mint-500)" : "var(--primary)"}
            size={43}
            textSize="text-[0.7rem]"
            locked={currentTab.locked}
          />
          <div className="flex flex-col gap-0.5">
            <h2 className="text-foreground font-medium text-[0.95rem]">
              {currentTab.label}
            </h2>
            {currentTab.locked && (
              <motion.div>
                <StatusBadge
                  label="Locked & verified"
                  icon={Shield}
                  size="sm"
                  className="bg-mint-500/12 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
