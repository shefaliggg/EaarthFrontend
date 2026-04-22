import { useLocation } from "react-router-dom";
import AnimatedCircularProgress from "@/features/projects/settings/components/shared/AnimatedCircularProgress";
import * as FramerMotion from "framer-motion";

export default function SettingsStatusHeader({ tabs }) {
  const location = useLocation();

  const segments = new Set(location.pathname.split("/"));

  const activeIndexRaw = tabs.findIndex((tab) => segments.has(tab.path));

  const activeIndex = activeIndexRaw === -1 ? 0 : activeIndexRaw;

  const currentTab = tabs[activeIndex];

  return (
    <>
      <div className="p-4 rounded-3xl border bg-background shadow-sm">
        <div className="flex items-center gap-4">
          <AnimatedCircularProgress
            progressPercentage={currentTab.progress}
            size={40}
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-foreground font-medium text-[0.95rem]">
              {currentTab.label}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] text-muted-foreground">
              <FramerMotion.motion.div
                className="w-1.5 h-1.5 rounded-full bg-mint-400"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Auto-saving changes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
