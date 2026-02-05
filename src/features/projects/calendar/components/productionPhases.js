import { differenceInCalendarWeeks } from "date-fns";

// CORRECTED PHASES - Sequential dates
export const PHASES = [
  { name: "Prep",  start: "2026-02-01", end: "2026-02-21" },  // Feb 1-21
  { name: "Shoot", start: "2026-02-22", end: "2026-02-28" },  // Feb 22-28
  { name: "Wrap",  start: "2026-03-01", end: "2026-03-07" },  // Mar 1-7
];

export function getPhaseForDate(dateStr) {
  return PHASES.find(p => dateStr >= p.start && dateStr <= p.end);
}

export function getProductionWeekLabel(dateStr) {
  const phase = getPhaseForDate(dateStr);
  if (!phase) return "";

  // SHOOT WEEK 1 starts on Feb 22, 2026 (Sunday)
  const shootWeek1Start = new Date("2026-02-22");
  const current = new Date(dateStr + "T12:00:00"); // Add time to avoid timezone issues

  const diff = differenceInCalendarWeeks(current, shootWeek1Start, { weekStartsOn: 0 });

  if (phase.name === "Prep") {
    // Prep weeks count backward from Shoot Week 1
    // Week of Feb 15: diff = -1 → PREP WEEK -1
    // Week of Feb 8:  diff = -2 → PREP WEEK -2
    // Week of Feb 1:  diff = -3 → PREP WEEK -3
    return `PREP WEEK ${diff}`;
  }

  if (phase.name === "Shoot") {
    // Shoot weeks count forward from 1
    // Week of Feb 22: diff = 0 → SHOOT WEEK 1
    return `SHOOT WEEK ${diff + 1}`;
  }

  if (phase.name === "Wrap") {
    // Wrap weeks continue counting from where Shoot ended
    // Week of Mar 1: diff = 1 → WRAP WEEK 1
    return `WRAP WEEK ${diff}`;
  }

  return "";
}
