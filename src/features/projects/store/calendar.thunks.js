import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCalendarEventsAPI } from "../service/calendar.service";

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
