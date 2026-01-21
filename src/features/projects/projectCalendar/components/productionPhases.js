import { differenceInCalendarWeeks, addWeeks } from "date-fns";

export const PHASES = [
  { name: "Prep",  start: "2026-01-01", end: "2026-01-24" },
  { name: "Shoot", start: "2026-01-25", end: "2026-01-31" },
  { name: "Wrap",  start: "2026-02-01", end: "2026-02-07" },
];

export function getPhaseForDate(dateStr) {
  return PHASES.find(p => dateStr >= p.start && dateStr <= p.end);
}

export function getProductionWeekLabel(dateStr) {
  const phase = getPhaseForDate(dateStr);
  if (!phase) return "";

  const shootWeek1Start = new Date("2026-01-25"); // SHOOT WEEK 1
  const current = new Date(dateStr);

  const diff = differenceInCalendarWeeks(current, shootWeek1Start);

  if (phase.name === "Prep") {
    return `PREP WEEK ${diff}`;   // -4, -3, -2, -1
  }

  if (phase.name === "Shoot") {
    return `SHOOT WEEK ${diff + 1}`; // 1, 2, 3...
  }

  if (phase.name === "Wrap") {
    return `WRAP WEEK ${diff + 1}`;
  }

  return "";
}
