import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCalendarEventsAPI,
  createCalendarEventAPI,
  updateCalendarEventAPI,
  deleteCalendarEventAPI,
  getCrewMembersAPI,
  getDepartmentsAPI,
} from "../service/calendar.service";

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

export const deleteCalendarEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (eventCode, { rejectWithValue }) => {
    try {
      await deleteCalendarEventAPI(eventCode);
      return eventCode; 
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete event",
      );
    }
  },
);

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

export const fetchDepartments = createAsyncThunk(
  "calendar/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      return await getDepartmentsAPI();
    } catch (err) {
      return rejectWithValue([]);
    }
  },
);
