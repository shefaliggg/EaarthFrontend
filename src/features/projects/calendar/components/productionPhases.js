import { differenceInCalendarWeeks } from "date-fns";

export const PHASES = [
  { name: "Prep",  start: "2026-03-01", end: "2026-03-21" }, 
  { name: "Shoot", start: "2026-03-22", end: "2026-03-28" },  
  { name: "Wrap",  start: "2026-03-29", end: "2026-04-04" },  
];

export function getPhaseForDate(dateStr) {
  return PHASES.find(p => dateStr >= p.start && dateStr <= p.end);
}

export function getProductionWeekLabel(dateStr) {
  const phase = getPhaseForDate(dateStr);
  if (!phase) return "";

  const current = new Date(dateStr + "T12:00:00"); 

  if (phase.name === "Prep") {

    const shootPhase = PHASES.find(p => p.name === "Shoot");
    const shootStart = new Date(shootPhase.start + "T12:00:00");
    
    const diff = differenceInCalendarWeeks(current, shootStart, { weekStartsOn: 0 });
    return `PREP WEEK ${diff}`; 
  }

  if (phase.name === "Shoot") {
    const shootStart = new Date(phase.start + "T12:00:00");
    const diff = differenceInCalendarWeeks(current, shootStart, { weekStartsOn: 0 });
    return `SHOOT WEEK ${diff + 1}`; 
  }

  if (phase.name === "Wrap") {
    const wrapStart = new Date(phase.start + "T12:00:00");
    const diff = differenceInCalendarWeeks(current, wrapStart, { weekStartsOn: 0 });
    return `WRAP WEEK ${diff + 1}`; 
  }

  return "";
}