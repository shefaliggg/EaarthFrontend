import { PhoneMissed, PhoneOff } from "lucide-react";

/* ─── Grid helpers ─────────────────────────────────────────────────────────── */
export function getGridClass(count) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 9) return "grid-cols-3";
  return "grid-cols-4";
}

/* ─── Draggable size / position helpers ────────────────────────────────────── */
export const MODE_SIZE = {
  compact: { width: 660, height: 521 },
  minimized: { width: 220, height: 100 },
};

export function getDefaultPosition(mode) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (mode === "minimized") return { x: vw - 240, y: vh - 120 };
  const { width, height } = MODE_SIZE.compact;
  return {
    x: Math.max(0, (vw - width) / 2),
    y: Math.max(0, (vh - height) / 2),
  };
}

/* ─── End-state config ──────────────────────────────────────────────────────── */
export const END_CONFIG = {
  declined: {
    icon: PhoneOff,
    iconColor: "text-red-400",
    bg: "bg-red-500/20",
    title: "Call Declined",
    sub: "The other person declined your call.",
  },
  missed: {
    icon: PhoneMissed,
    iconColor: "text-yellow-400",
    bg: "bg-yellow-500/20",
    title: "No Answer",
    sub: "No one joined the call.",
  },
  left: {
    icon: PhoneOff,
    iconColor: "text-purple-400",
    bg: "bg-purple-500/20",
    title: "You Left",
    sub: "You have exited the call.",
  },
  ended: {
    icon: PhoneOff,
    iconColor: "text-zinc-400",
    bg: "bg-zinc-700/40",
    title: "Call Ended",
    sub: "The call has ended.",
  },
  error: {
    icon: PhoneOff,
    iconColor: "text-red-400",
    bg: "bg-red-500/20",
    title: "Call Failed",
    sub: "Something went wrong. Please try again.",
  },
};
