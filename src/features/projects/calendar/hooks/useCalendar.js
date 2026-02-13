import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setView as setViewAction,
  setSearch as setSearchAction,
  setEventType as setEventTypeAction,
  setCurrentDate as setCurrentDateAction,
} from "../../store/calendar.slice";
import { fetchCalendarEvents } from "../../store/calendar.thunks";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
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
    const aOverlap = Math.max(new Date(a.event1.startDateTime), new Date(a.event2.startDateTime));
    const bOverlap = Math.max(new Date(b.event1.startDateTime), new Date(b.event2.startDateTime));
    return aOverlap - bOverlap;
  });
}

function useCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar);

  const currentDate = new Date(calendar.currentDate);

  useEffect(() => {
    dispatch(fetchCalendarEvents());
  }, [dispatch]);

  const events = calendar.events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(calendar.filters.search.toLowerCase());
    const matchesType =
      calendar.filters.eventType === "all" ||
      event.eventType === calendar.filters.eventType;
    return matchesSearch && matchesType;
  });

  const upcomingEvents = normalizeUpcomingEvents(events);

  const conflicts = useMemo(() => detectConflicts(events), [events]);

  const getViewSpecificEventCount = useMemo(() => {
    const view = calendar.view;

    // Added 'analytics' here so the count updates correctly in the toolbar
    if (view === "month" || view === "timeline" || view === "conflicts" || view === "analytics") {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

      return events.filter(e => {
        if (!e.startDateTime) return false;
        const eventStart = new Date(e.startDateTime);
        const eventEnd = e.endDateTime ? new Date(e.endDateTime) : eventStart;
        return eventStart <= monthEnd && eventEnd >= monthStart;
      }).length;
    }

    if (view === "year" || view === "gantt") {
      const yearStart = new Date(currentDate.getFullYear(), 0, 1);
      const yearEnd = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

      return events.filter(e => {
        if (!e.startDateTime) return false;
        const eventStart = new Date(e.startDateTime);
        const eventEnd = e.endDateTime ? new Date(e.endDateTime) : eventStart;
        return eventStart <= yearEnd && eventEnd >= yearStart;
      }).length;
    }

    if (view === "week") {
      const weekStart = new Date(currentDate);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return events.filter(e => {
        if (!e.startDateTime) return false;
        const eventStart = new Date(e.startDateTime);
        const eventEnd = e.endDateTime ? new Date(e.endDateTime) : eventStart;
        return eventStart <= weekEnd && eventEnd >= weekStart;
      }).length;
    }

    if (view === "day") {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      return events.filter(e => {
        if (!e.startDateTime) return false;
        const eventStart = new Date(e.startDateTime);
        const eventEnd = e.endDateTime ? new Date(e.endDateTime) : eventStart;
        return eventStart <= dayEnd && eventEnd >= dayStart;
      }).length;
    }

    return events.length;
  }, [events, currentDate, calendar.view]);

  // --- NAVIGATION FIX ---
  const prev = () => {
    if (calendar.view === "day") setDate(addDays(currentDate, -1));
    else if (calendar.view === "week") setDate(addWeeks(currentDate, -1));
    else if (calendar.view === "year" || calendar.view === "gantt") setDate(addYears(currentDate, -1));
    // Fallback for month, timeline, conflicts, AND analytics
    else setDate(addMonths(currentDate, -1));
  };

  const next = () => {
    if (calendar.view === "day") setDate(addDays(currentDate, 1));
    else if (calendar.view === "week") setDate(addWeeks(currentDate, 1));
    else if (calendar.view === "year" || calendar.view === "gantt") setDate(addYears(currentDate, 1));
    // Fallback for month, timeline, conflicts, AND analytics
    else setDate(addMonths(currentDate, 1));
  };

  const today = () => setDate(new Date());

  const setDate = (date) => dispatch(setCurrentDateAction(date.toISOString()));

  return {
    events,
    conflicts,
    upcomingEvents,
    eventsCount: getViewSpecificEventCount,
    view: calendar.view,
    currentDate,
    search: calendar.filters.search,
    period: calendar.filters.eventType,
    isLoading: calendar.isLoading,
    error: calendar.error,
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