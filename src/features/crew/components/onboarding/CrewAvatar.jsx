// ─── CrewAvatar ──────────────────────────────────────────────────────────────
// Deterministic colour from name hash — matches old Dashboard exactly.

const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-cyan-600",
];

function nameHash(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CrewAvatar({ name = "", size = "md" }) {
  const color = AVATAR_COLORS[nameHash(name) % AVATAR_COLORS.length];
  const sz = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-[12px]";

  return (
    <div
      className={`
        ${sz} ${color}
        rounded-full flex items-center justify-center
        text-white font-semibold shrink-0
      `}
    >
      {initials(name) || "?"}
    </div>
  );
}