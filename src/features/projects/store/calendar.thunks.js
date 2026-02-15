import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCalendarEventsAPI,
  createCalendarEventAPI,
  getCrewMembersAPI, // Import the new service
} from "../service/calendar.service";

// Fetch Events Thunk
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

// Create Event Thunk
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

// NEW: Fetch Crew Thunk
export const fetchCrewMembers = createAsyncThunk(
  "calendar/fetchCrew",
  async (_, { rejectWithValue }) => {
    try {
      return await getCrewMembersAPI();
    } catch (err) {
      // Return empty array on failure so it doesn't break the UI
      return rejectWithValue([]);
    }
  },
);
