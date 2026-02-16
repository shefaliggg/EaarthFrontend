import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  fetchCrewMembers,
} from "./calendar.thunks";

const initialState = {
  events: [],
  crewMembers: [],
  view: "month",
  currentDate: new Date().toISOString(),
  filters: {
    search: "",
    eventType: "all",
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false, // New state
  isDeleting: false, // New state
  error: null,
  createError: null,
  successMessage: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setView(state, action) {
      state.view = action.payload;
    },
    setCurrentDate(state, action) {
      state.currentDate = action.payload;
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setEventType(state, action) {
      state.filters.eventType = action.payload;
    },
    clearMessages(state) {
      state.successMessage = null;
      state.createError = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      // Create
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.events.push(action.payload);
        state.successMessage = "Event created successfully!";
      })
      // Update
      .addCase(updateCalendarEvent.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.events.findIndex(
          (e) => (e.eventCode || e._id) === (action.payload.eventCode || action.payload._id)
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.successMessage = "Event updated successfully!";
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCalendarEvent.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.events = state.events.filter(
          (e) => (e.eventCode || e._id) !== action.payload
        );
        state.successMessage = "Event deleted successfully";
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      // Crew
      .addCase(fetchCrewMembers.fulfilled, (state, action) => {
        state.crewMembers = action.payload;
      });
  },
});

export const {
  setView,
  setCurrentDate,
  setSearch,
  setEventType,
  clearMessages,
} = calendarSlice.actions;

export default calendarSlice.reducer;