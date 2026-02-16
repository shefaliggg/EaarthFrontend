import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCalendarEventsAPI,
  createCalendarEventAPI,
  updateCalendarEventAPI,
  deleteCalendarEventAPI,
  getCrewMembersAPI,
} from "../service/calendar.service";

// Fetch Events
export const fetchCalendarEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await getCalendarEventsAPI();
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch calendar events",
      );
    }
  },
);

// Create Event
export const createCalendarEvent = createAsyncThunk(
  "calendar/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await createCalendarEventAPI(eventData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create event",
      );
    }
  },
);

// NEW: Update Event
export const updateCalendarEvent = createAsyncThunk(
  "calendar/updateEvent",
  async ({ eventCode, eventData }, { rejectWithValue }) => {
    try {
      const response = await updateCalendarEventAPI(eventCode, eventData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update event",
      );
    }
  },
);

// NEW: Delete Event
export const deleteCalendarEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (eventCode, { rejectWithValue }) => {
    try {
      await deleteCalendarEventAPI(eventCode);
      return eventCode; // Return the ID so we can remove it from state
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete event",
      );
    }
  },
);

// Fetch Crew
export const fetchCrewMembers = createAsyncThunk(
  "calendar/fetchCrew",
  async (_, { rejectWithValue }) => {
    try {
      return await getCrewMembersAPI();
    } catch (err) {
      return rejectWithValue([]);
    }
  },
);