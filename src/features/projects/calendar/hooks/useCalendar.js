import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setView as setViewAction,
  setSearch as setSearchAction,
  setEventType as setEventTypeAction,
  setCurrentDate as setCurrentDateAction,
  clearMessages,
} from "../../store/calendar.slice";
import {
  fetchCalendarEvents,
  createCalendarEvent,
  fetchCrewMembers,
} from "../../store/calendar.thunks";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  parseISO,
  isValid,
  isSameMonth,
  isSameYear,
  isWithinInterval,
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
      if (
        !a.startDateTime ||
        !a.endDateTime ||
        !b.startDateTime ||
        !b.endDateTime
      )
        continue;
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
    const aOverlap = Math.max(
      new Date(a.event1.startDateTime),
      new Date(a.event2.startDateTime),
    );
    const bOverlap = Math.max(
      new Date(b.event1.startDateTime),
      new Date(b.event2.startDateTime),
    );
    return aOverlap - bOverlap;
  });
}

// --- Helper: Get Date Range for Current View ---
const getViewDateRange = (view, currentDate) => {
  const date = new Date(currentDate);
  
  if (view === "year" || view === "gantt") {
    return {
      start: startOfYear(date),
      end: endOfYear(date),
    };
  }
  if (view === "week") {
    return {
      start: startOfWeek(date),
      end: endOfWeek(date),
    };
  }
  if (view === "day") {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  // Default to Month view
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

function useCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar);
  const currentDate = new Date(calendar.currentDate);

  // Load Data on Mount
  useEffect(() => {
    dispatch(fetchCalendarEvents());
    dispatch(fetchCrewMembers());
  }, [dispatch]);

  // 1. ALL Events (Filtered only by Search & Type Dropdown)
  // This is useful for "Year View" or global searches, but usually not what we want for stats
  const allFilteredEvents = useMemo(() => {
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

  // 2. VIEW SPECIFIC Events (Filtered by Search, Type AND Date Range of current view)
  // This is the fix: We calculate the range based on if we are looking at a Month, Year, etc.
  const currentViewEvents = useMemo(() => {
    const { start, end } = getViewDateRange(calendar.view, currentDate);

    return allFilteredEvents.filter((event) => {
      if (!event.startDateTime) return false;
      
      const eventStart = new Date(event.startDateTime);
      const eventEnd = event.endDateTime
        ? new Date(event.endDateTime)
        : eventStart;

      // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
      return eventStart <= end && eventEnd >= start;
    });
  }, [allFilteredEvents, currentDate, calendar.view]);

  // 3. Derived Data
  const upcomingEvents = useMemo(
    () => normalizeUpcomingEvents(allFilteredEvents),
    [allFilteredEvents],
  );
  const conflicts = useMemo(
    () => detectConflicts(allFilteredEvents),
    [allFilteredEvents],
  );

  // 4. View Count Logic (Simply length of view specific events)
  const eventsCount = currentViewEvents.length;

  // 5. Analytics Data
  const analyticsData = useMemo(() => {
    if (calendar.view !== "analytics") return null;
    const targetDate = isValid(currentDate) ? currentDate : new Date();
    const typeCounts = {};
    const weekCounts = {};
    let filteredCount = 0;

    // Use currentViewEvents ensures analytics only show data for the selected month/year
    const validEvents = currentViewEvents; 

    validEvents.forEach((event) => {
      filteredCount++;
      const type = (event.eventType || event.type || "other").toLowerCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      
      if(event.startDateTime) {
         const date = parseISO(event.startDateTime);
         if(isValid(date)) {
             const weekKey = format(
                startOfWeek(date, { weekStartsOn: 1 }),
                "yyyy-MM-dd",
             );
             weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
         }
      }
    });

    return {
      filteredEvents: validEvents,
      typeCounts,
      weekCounts,
      stats: {
        total: filteredCount,
        shoot: typeCounts["shoot"] || 0,
        prep: typeCounts["prep"] || 0,
        wrap: typeCounts["wrap"] || 0, // Added wrap
        travel: typeCounts["travel"] || 0,
      },
    };
  }, [currentViewEvents, currentDate, calendar.view]);

  // 6. Actions
  const setDate = useCallback(
    (date) => dispatch(setCurrentDateAction(date.toISOString())),
    [dispatch],
  );
  
  const prev = useCallback(() => {
    const view = calendar.view;
    if (view === "day") setDate(addDays(currentDate, -1));
    else if (view === "week") setDate(addWeeks(currentDate, -1));
    else if (view === "year" || view === "gantt")
      setDate(addYears(currentDate, -1));
    else setDate(addMonths(currentDate, -1));
  }, [calendar.view, currentDate, setDate]);

  const next = useCallback(() => {
    const view = calendar.view;
    if (view === "day") setDate(addDays(currentDate, 1));
    else if (view === "week") setDate(addWeeks(currentDate, 1));
    else if (view === "year" || view === "gantt")
      setDate(addYears(currentDate, 1));
    else setDate(addMonths(currentDate, 1));
  }, [calendar.view, currentDate, setDate]);

  const today = useCallback(() => setDate(new Date()), [setDate]);

  const createEvent = useCallback(
    (eventData) => {
      return dispatch(createCalendarEvent(eventData));
    },
    [dispatch],
  );

  const clearStatus = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  return {
    // State
    events: currentViewEvents, // <--- CRITICAL CHANGE: Return view-specific events
    allEvents: allFilteredEvents, // Option to access everything if needed
    conflicts,
    upcomingEvents,
    eventsCount,
    analyticsData,
    view: calendar.view,
    currentDate,
    search: calendar.filters.search,
    period: calendar.filters.eventType,
    isLoading: calendar.isLoading,
    error: calendar.error,

    // Creation State
    isCreating: calendar.isCreating,
    createError: calendar.createError,
    successMessage: calendar.successMessage,
    crewMembers: calendar.crewMembers,

    // Actions
    prev,
    next,
    today,
    setView: (view) => dispatch(setViewAction(view)),
    setSearch: (searchText) => dispatch(setSearchAction(searchText)),
    setPeriod: (eventType) => dispatch(setEventTypeAction(eventType)),
    setCurrentDate: setDate,
    createEvent,
    clearStatus,
  };
}

export default useCalendar;