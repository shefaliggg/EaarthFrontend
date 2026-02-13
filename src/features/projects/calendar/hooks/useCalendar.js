import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setView as setViewAction,
  setSearch as setSearchAction,
  setEventType as setEventTypeAction,
  setCurrentDate as setCurrentDateAction,
} from "../../store/calendar.slice";
import { fetchCalendarEvents } from "../../store/calendar.thunks";
import { 
  addDays, addWeeks, addMonths, addYears, 
  startOfWeek, format, parseISO, isValid, isSameMonth, isSameYear 
} from "date-fns";
import { normalizeUpcomingEvents } from "../utils/calendar.utils";

// --- Helper: Conflict Detection ---
function detectConflicts(events) {
  const conflicts = [];
  const seen = new Set();

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      if (!a.startDateTime || !a.endDateTime || !b.startDateTime || !b.endDateTime) continue;

      const key = [a.id || a._id, b.id || b._id].sort().join("_");
      if (seen.has(key)) continue;

      const aStart = new Date(a.startDateTime);
      const aEnd = new Date(a.endDateTime);
      const bStart = new Date(b.startDateTime);
      const bEnd = new Date(b.endDateTime);

      if (aStart < bEnd && aEnd > bStart) {
        seen.add(key);
        conflicts.push({ event1: a, event2: b });
      }
    }
  }

  return conflicts.sort((a, b) => {
    const aOverlap = Math.max(new Date(a.event1.startDateTime), new Date(a.event2.startDateTime));
    const bOverlap = Math.max(new Date(b.event1.startDateTime), new Date(b.event2.startDateTime));
    return aOverlap - bOverlap;
  });
}

// --- Helper: View Count Logic ---
const getViewDateRange = (view, currentDate) => {
  if (view === "year" || view === "gantt") {
    return {
      start: new Date(currentDate.getFullYear(), 0, 1),
      end: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999)
    };
  }
  if (view === "week") {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Adjust based on week start preference
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (view === "day") {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(currentDate);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  // Default: Month, Timeline, Analytics, Conflicts
  return {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
  };
};

function useCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar);
  const currentDate = new Date(calendar.currentDate);

  useEffect(() => {
    dispatch(fetchCalendarEvents());
  }, [dispatch]);

  // 1. Basic Filtering
  const events = useMemo(() => {
    return calendar.events.filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(calendar.filters.search.toLowerCase());
      const matchesType =
        calendar.filters.eventType === "all" ||
        event.eventType === calendar.filters.eventType;
      return matchesSearch && matchesType;
    });
  }, [calendar.events, calendar.filters]);

  // 2. Derived Data
  const upcomingEvents = useMemo(() => normalizeUpcomingEvents(events), [events]);
  const conflicts = useMemo(() => detectConflicts(events), [events]);

  // 3. View Specific Count
  const eventsCount = useMemo(() => {
    const { start, end } = getViewDateRange(calendar.view, currentDate);
    return events.filter(e => {
      if (!e.startDateTime) return false;
      const eventStart = new Date(e.startDateTime);
      const eventEnd = e.endDateTime ? new Date(e.endDateTime) : eventStart;
      return eventStart <= end && eventEnd >= start;
    }).length;
  }, [events, currentDate, calendar.view]);

  // 4. Analytics Data Calculation (Moved from View to Hook)
  const analyticsData = useMemo(() => {
    // Only calculate if needed
    if (calendar.view !== 'analytics') return null;

    const targetDate = isValid(currentDate) ? currentDate : new Date();
    const typeCounts = {};
    const weekCounts = {};
    let filteredCount = 0;

    const validEvents = events.filter(event => {
      const dateStr = event.startDateTime || event.date;
      if (!dateStr) return false;
      const date = parseISO(dateStr);
      if (!isValid(date)) return false;

      // Filter for current month view
      if (!isSameMonth(date, targetDate) || !isSameYear(date, targetDate)) return false;

      filteredCount++;
      
      // Aggregations
      const type = (event.eventType || event.type || 'other').toLowerCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      const weekKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;

      return true;
    });

    return {
      filteredEvents: validEvents,
      typeCounts,
      weekCounts,
      stats: {
        total: filteredCount,
        shoot: typeCounts['shoot'] || 0,
        prep: typeCounts['prep'] || 0,
        travel: typeCounts['travel'] || 0
      }
    };
  }, [events, currentDate, calendar.view]);


  // 5. Navigation Actions
  const setDate = useCallback((date) => dispatch(setCurrentDateAction(date.toISOString())), [dispatch]);

  const prev = useCallback(() => {
    const view = calendar.view;
    if (view === "day") setDate(addDays(currentDate, -1));
    else if (view === "week") setDate(addWeeks(currentDate, -1));
    else if (view === "year" || view === "gantt") setDate(addYears(currentDate, -1));
    else setDate(addMonths(currentDate, -1));
  }, [calendar.view, currentDate, setDate]);

  const next = useCallback(() => {
    const view = calendar.view;
    if (view === "day") setDate(addDays(currentDate, 1));
    else if (view === "week") setDate(addWeeks(currentDate, 1));
    else if (view === "year" || view === "gantt") setDate(addYears(currentDate, 1));
    else setDate(addMonths(currentDate, 1));
  }, [calendar.view, currentDate, setDate]);

  const today = useCallback(() => setDate(new Date()), [setDate]);

  return {
    // State
    events,
    conflicts,
    upcomingEvents,
    eventsCount,
    analyticsData, // New exposed data
    view: calendar.view,
    currentDate,
    search: calendar.filters.search,
    period: calendar.filters.eventType,
    isLoading: calendar.isLoading,
    error: calendar.error,

    // Actions
    prev,
    next,
    today,
    setView: (view) => dispatch(setViewAction(view)),
    setSearch: (searchText) => dispatch(setSearchAction(searchText)),
    setPeriod: (eventType) => dispatch(setEventTypeAction(eventType)),
    setCurrentDate: setDate,
  };
}

export default useCalendar;