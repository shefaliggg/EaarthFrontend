import {
  format,
  differenceInDays,
} from "date-fns";

/* ================= CONFIG ================= */

export const HOUR_HEIGHT = 48;
export const DAY_MINUTES = 1440;
export const MIN_EVENT_HEIGHT = 16;

/* ================= TIME ================= */

export function timeToMinutes(time) {
  if (!time) return null;
  const [clock, period] = time.split(" ");
  let [h, m] = clock.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

export const dateKey = (date) => format(date, "yyyy-MM-dd");

export const formatHour = (h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

/* ================= DAY VIEW LOGIC ================= */

export function normalizeDayEvents(events, date) {
  const key = dateKey(date);
  const output = [];

  for (const e of events) {
    if (!e.startDateTime) continue;

    // SKIP allDay events here so they don't appear in the hour grid
    if (e.allDay === true) continue;

    const start = new Date(e.startDateTime);
    const end = new Date(e.endDateTime);

    const startDateStr = format(start, "yyyy-MM-dd");
    const endDateStr = format(end, "yyyy-MM-dd");

    let current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < current || targetDate > endDate) continue;

    const isFirst = key === startDateStr;
    const isLast = key === endDateStr;

    const startTime = format(start, "h:mm a");
    const endTime = format(end, "h:mm a");

    let _start = 0;
    let _end = DAY_MINUTES;

    if (isFirst) _start = timeToMinutes(startTime) ?? 0;
    if (isLast) _end = timeToMinutes(endTime) ?? DAY_MINUTES;

    output.push({
      ...e,
      _start,
      _end,
      _startTime: startTime,
      _endTime: endTime,
    });
  }

  return output;
}

export function getAllDayEvents(events, date) {
  return events.filter((e) => {
    if (!e.startDateTime) return false;
    
    // ONLY include events marked explicitly as allDay
    if (e.allDay !== true) return false;

    const start = new Date(e.startDateTime);
    const end = new Date(e.endDateTime);

    let current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const isInRange = targetDate >= current && targetDate <= endDate;
    
    return isInRange;
  });
}

/* ================= LAYOUT ENGINE ================= */

export function layoutEvents(events) {
  const columns = [];
  for (const event of events) {
    let placed = false;
    for (const col of columns) {
      const last = col[col.length - 1];
      if (event._start >= last._end) {
        col.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([event]);
  }
  return columns;
}

export function getEventStyle(event, colIndex, colCount) {
  const rawHeight = ((event._end - event._start) / 60) * HOUR_HEIGHT;
  return {
    top: (event._start / 60) * HOUR_HEIGHT,
    height: Math.max(rawHeight, MIN_EVENT_HEIGHT),
    width: `${100 / colCount}%`,
    left: `${(100 / colCount) * colIndex}%`,
  };
}

/* ================= COLORS & STYLES ================= */

export const getEventColors = (eventType) => {
  switch (eventType) {
    case "shoot":
      return "bg-peach-100 dark:bg-peach-800 text-peach-800 dark:text-peach-100 border-peach-400 dark:border-peach-600";
    case "prep":
      return "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700";
    case "wrap":
      return "bg-mint-100 dark:bg-mint-900 text-mint-800 dark:text-mint-200 border-mint-300 dark:border-mint-700";
    default:
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700";
  }
};

export const getAllDayEventColors = (eventType) => {
  switch (eventType) {
    case "shoot":
      return "bg-peach-100 dark:bg-peach-800 text-peach-800 dark:text-peach-100 border-peach-400 dark:border-peach-600";
    case "prep":
      return "bg-sky-100 dark:bg-sky-800/80 text-sky-800 dark:text-sky-100 border-sky-400 dark:border-sky-600";
    case "wrap":
      return "bg-mint-200 dark:bg-mint-800 text-mint-900 dark:text-mint-100 border-mint-400 dark:border-mint-600";
    default:
      return "bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 border-purple-400 dark:border-purple-600";
  }
};

export function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e - s) / 86400000));
}

export function calculateProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(12, 0, 0, 0);

  if (today <= start) return 0;
  if (today >= end) return 100;

  const total = Math.ceil((end - start) / 86400000);
  const elapsed = Math.ceil((today - start) / 86400000);

  return Math.round((elapsed / total) * 100);
}

export function normalizeUpcomingEvents(events) {
  return events
    .map((e) => {
      const start = new Date(e.startDateTime);
      const end = new Date(e.endDateTime);

      const isMultiDay = start.toDateString() !== end.toDateString();
      const dayCount = differenceInDays(end, start) + 1;
      const isOngoing = new Date() >= start && new Date() <= end;

      return {
        ...e,
        _startDate: start,
        _endDate: end,
        isMultiDay,
        dayCount,
        isOngoing,
      };
    })
    .sort((a, b) => a._startDate - b._startDate);
}