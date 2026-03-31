import { motion } from "framer-motion";
import { Settings } from "lucide-react";

function SettingsHeader() {
  const projectColor = "#7c3aed";
  return (
    <div
      className="flex justify-between rounded-xl p-4"
      style={{
        background: `linear-gradient(135deg, ${projectColor}15 0%, ${projectColor}17 100%)`,
      }}
    >
      <div className="flex gap-3 items-center">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${projectColor}26` }}
          whileHover={{ scale: 1.05 }}
        >
          <Settings className="w-5 h-5" style={{ color: projectColor }} />
        </motion.div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold">Project Settings</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>AVATAR 1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <span>11 / 22</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsHeader;
