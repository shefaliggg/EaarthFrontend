import { differenceInCalendarWeeks } from "date-fns";

export const PHASES = [
  { name: "Prep", start: "2026-01-01", end: "2026-01-14" },
  { name: "Shoot", start: "2026-01-15", end: "2026-01-31" },
  { name: "Wrap", start: "2026-02-01", end: "2026-02-07" },
];

export function getPhaseForDate(dateStr) {
  return PHASES.find(
    (p) => dateStr >= p.start && dateStr <= p.end
  );
}

export function getProductionWeekLabel(dateStr) {
  const phase = getPhaseForDate(dateStr);
  if (!phase) return "";

  const week =
    differenceInCalendarWeeks(
      new Date(dateStr),
      new Date(phase.start)
    ) + 1;

  return `${phase.name.toUpperCase()} WEEK ${week}`;
}
