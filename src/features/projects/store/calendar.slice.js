import { createSlice } from "@reduxjs/toolkit";
import { fetchCalendarEvents } from "./calendar.thunks";

const initialState = {
  events: [],
  view: "month",
  currentDate: new Date().toISOString(),
  filters: {
    search: "",
    eventType: "all",
  },
  isLoading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setView(state, action) {
      state.view = action.payload;
      console.log(action)
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const {
  setView,
  setCurrentDate,
  setSearch,
  setEventType,
} = calendarSlice.actions;

export default calendarSlice.reducer;
