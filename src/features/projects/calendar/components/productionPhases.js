import { differenceInCalendarWeeks } from "date-fns";

export const PHASES = [
  { name: "Prep",  start: "2026-02-01", end: "2026-02-21" }, 
  { name: "Shoot", start: "2026-02-22", end: "2026-02-28" },  
  { name: "Wrap",  start: "2026-03-01", end: "2026-03-07" },  
];

export function getPhaseForDate(dateStr) {
  return PHASES.find(p => dateStr >= p.start && dateStr <= p.end);
}

export function getProductionWeekLabel(dateStr) {
  const phase = getPhaseForDate(dateStr);
  if (!phase) return "";

  const shootWeek1Start = new Date("2026-02-22");
  const current = new Date(dateStr + "T12:00:00"); 

  const diff = differenceInCalendarWeeks(current, shootWeek1Start, { weekStartsOn: 0 });

  if (phase.name === "Prep") {
    return `PREP WEEK ${diff}`;
  }

  if (phase.name === "Shoot") {
    return `SHOOT WEEK ${diff + 1}`;
  }

  if (phase.name === "Wrap") {
    return `WRAP WEEK ${diff}`;
  }

  return "";
}
