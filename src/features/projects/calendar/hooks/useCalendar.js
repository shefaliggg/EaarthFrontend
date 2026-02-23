import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setView as setViewAction,
  updateFilter as updateFilterAction,
  resetFilters as resetFiltersAction,
  setCurrentDate as setCurrentDateAction,
  clearMessages,
} from "../../store/calendar.slice";
import {
  fetchCalendarEvents,
  createCalendarEvent,
  fetchCrewMembers,
  fetchDepartments
} from "../../store/calendar.thunks";
import {
  addDays, addWeeks, addMonths, addYears, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear, format, parseISO, isValid
} from "date-fns";
import { normalizeUpcomingEvents } from "../utils/calendar.utils";

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
    return Math.max(new Date(a.event1.startDateTime), new Date(a.event2.startDateTime)) -
           Math.max(new Date(b.event1.startDateTime), new Date(b.event2.startDateTime));
  });
}

const getViewDateRange = (view, currentDate) => {
  const date = new Date(currentDate);
  if (view === "year" || view === "gantt") return { start: startOfYear(date), end: endOfYear(date) };
  if (view === "week") return { start: startOfWeek(date), end: endOfWeek(date) };
  if (view === "day") {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  return { start: startOfMonth(date), end: endOfMonth(date) };
};

function useCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar);
  
  const currentDate = useMemo(() => new Date(calendar.currentDate), [calendar.currentDate]);
  
  const { filters } = calendar;

  useEffect(() => {
    dispatch(fetchCalendarEvents());
    dispatch(fetchCrewMembers());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const allFilteredEvents = useMemo(() => {
    return calendar.events.filter((event) => {
      const matchesSearch = !filters.search || event.title?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.eventTypes.length === 0 || filters.eventTypes.includes(event.eventType);
      const matchesLocation = !filters.location || event.location?.toLowerCase().includes(filters.location.toLowerCase());
      
      const eventStatus = (event.status || "confirmed").toLowerCase();
      const matchesStatus = !filters.statuses || filters.statuses.length === 0 || filters.statuses.includes(eventStatus);

      const matchesDept = filters.departments.length === 0 || 
        (event.audience?.type === "DEPARTMENT" && event.audience.departments?.some(d => filters.departments.includes(d._id || d)));

      const matchesCrew = filters.crewMembers.length === 0 ||
        (event.audience?.type !== "ALL" && event.attendees?.some(a => {
            const uid = a.userId?._id || a.userId || a;
            return filters.crewMembers.includes(uid.toString());
        }));

      return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesDept && matchesCrew;
    });
  }, [calendar.events, filters]);

  const currentViewEvents = useMemo(() => {
    const { start, end } = getViewDateRange(calendar.view, currentDate);
    return allFilteredEvents.filter((event) => {
      if (!event.startDateTime) return false;
      const eventStart = new Date(event.startDateTime);
      const eventEnd = event.endDateTime ? new Date(event.endDateTime) : eventStart;
      return eventStart <= end && eventEnd >= start;
    });
  }, [allFilteredEvents, currentDate, calendar.view]);

  const upcomingEvents = useMemo(() => normalizeUpcomingEvents(allFilteredEvents), [allFilteredEvents]);
  const conflicts = useMemo(() => detectConflicts(allFilteredEvents), [allFilteredEvents]);
  const eventsCount = currentViewEvents.length;

  const analyticsData = useMemo(() => {
    if (calendar.view !== "analytics") return null;
    const typeCounts = {};
    const weekCounts = {};
    let filteredCount = 0;

    currentViewEvents.forEach((event) => {
      filteredCount++;
      const type = (event.eventType || event.type || "other").toLowerCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      if(event.startDateTime) {
         const date = parseISO(event.startDateTime);
         if(isValid(date)) {
             const weekKey = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
             weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
         }
      }
    });

    return {
      filteredEvents: currentViewEvents,
      typeCounts,
      weekCounts,
      stats: {
        total: filteredCount,
        shoot: typeCounts["shoot"] || 0,
        prep: typeCounts["prep"] || 0,
        wrap: typeCounts["wrap"] || 0,
        travel: typeCounts["travel"] || 0,
      },
    };

  }, [currentViewEvents, calendar.view]);

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
  const createEvent = useCallback((eventData) => dispatch(createCalendarEvent(eventData)), [dispatch]);
  const clearStatus = useCallback(() => dispatch(clearMessages()), [dispatch]);

  const updateFilter = useCallback((key, value) => dispatch(updateFilterAction({ key, value })), [dispatch]);
  const resetFilters = useCallback(() => dispatch(resetFiltersAction()), [dispatch]);

  return {
    events: currentViewEvents,
    allEvents: allFilteredEvents, 
    conflicts,
    upcomingEvents,
    eventsCount,
    analyticsData,
    view: calendar.view,
    currentDate,
    isLoading: calendar.isLoading,
    error: calendar.error,

    filters,
    updateFilter,
    resetFilters,
    crewMembers: calendar.crewMembers,
    departments: calendar.departments,

    isCreating: calendar.isCreating,
    createError: calendar.createError,
    successMessage: calendar.successMessage,

    prev, next, today,
    setView: (view) => dispatch(setViewAction(view)),
    setCurrentDate: setDate,
    createEvent, clearStatus,
  };
}

export default useCalendar;