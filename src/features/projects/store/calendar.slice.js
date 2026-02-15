import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchCalendarEvents, 
  createCalendarEvent, 
  fetchCrewMembers // Import the new thunk
} from "./calendar.thunks";

const initialState = {
  events: [],
  crewMembers: [], // NEW: Store crew list here
  view: "month",
  currentDate: new Date().toISOString(),
  filters: {
    search: "",
    eventType: "all",
  },
  isLoading: false,
  isCreating: false,
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
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Events ---
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Create Event ---
      .addCase(createCalendarEvent.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.successMessage = null;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.events.push(action.payload);
        state.successMessage = "Event created successfully!";
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
      })

      // --- NEW: Fetch Crew ---
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
  clearMessages
} = calendarSlice.actions;

export default calendarSlice.reducer;