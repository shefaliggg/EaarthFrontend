import { cn } from "@/shared/config/utils";

const stageColors = {
  "PRE-PRODUCTION": {
    bg: "bg-mint-400/15",
    text: "text-mint-300",
    border: "border-mint-400/20",
    dot: "bg-mint-300"
  },
  DEVELOPMENT: {
    bg: "bg-lavender-400/15",
    text: "text-lavender-300",
    border: "border-lavender-400/20",
    dot: "bg-lavender-300"
  },
  SHOOTING: {
    bg: "bg-sky-400/15",
    text: "text-sky-300",
    border: "border-sky-400/20",
    dot: "bg-sky-300"
  },
  "POST-PRODUCTION": {
    bg: "bg-peach-400/15",
    text: "text-peach-300",
    border: "border-peach-400/20",
    dot: "bg-peach-300"
  },
  WRAP: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/20",
    dot: "bg-red-300"
  },
};

const defaultColors = {
  bg: "bg-gray-500/15",
  text: "text-gray-300",
  border: "border-gray-500/20",
  dot: "bg-gray-300",
};

export default function StudioStageBadge({ stage }) {
  const style =
    stageColors[stage] ||
    stageColors[stage?.toUpperCase()] ||
    defaultColors;

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border inline-flex items-center gap-1.5",
        style.bg,
        style.text,
        style.border
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", style.dot)} />

      {stage}
    </span>
  );
}
