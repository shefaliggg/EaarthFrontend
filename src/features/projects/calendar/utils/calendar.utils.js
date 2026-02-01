import {
  format,
  addDays,
  startOfWeek,
  parseISO,
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

/* ================= DAY ================= */

export function normalizeDayEvents(events, date) {
  const key = dateKey(date);

  return events
    .filter((e) => e.startDate === key && !e.isAllDay)
    .map((e) => ({
      ...e,
      _start: timeToMinutes(e.startTime) ?? 0,
      _end: timeToMinutes(e.endTime) ?? DAY_MINUTES,
    }));
}

export function getAllDayEvents(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e.startDate === key && e.isAllDay);
}

/* ================= WEEK ================= */

export function getWeek(date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i));
}

export function normalizeEvents(events) {
  const output = [];

  for (const e of events) {
    const start = timeToMinutes(e.startTime);
    const end = timeToMinutes(e.endTime);

    const startDate = parseISO(e.startDate);
    const endDate = e.endDate ? parseISO(e.endDate) : startDate;

    let current = startDate;

    while (current <= endDate) {
      const isFirst = format(current, "yyyy-MM-dd") === e.startDate;
      const isLast = format(current, "yyyy-MM-dd") === e.endDate;

      let _start = 0;
      let _end = DAY_MINUTES;

      if (!e.isAllDay) {
        if (isFirst) _start = start ?? 0;
        if (isLast) _end = end ?? DAY_MINUTES;
      }

      output.push({
        ...e,
        startDate: format(current, "yyyy-MM-dd"),
        _start,
        _end,
      });

      current = addDays(current, 1);
    }
  }

  return output;
}

export function getEventsForDay(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e.startDate === key && !e.isAllDay);
}

/* ================= LAYOUT ================= */

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

/* ================= GANTT ================= */

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
