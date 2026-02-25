import { configureStore } from "@reduxjs/toolkit";
import { projectReducer, calendarReducer } from "../features/projects/store";
import { userReducer } from "../features/auth/store";
import { notificationReducer } from "../features/notifications/store";

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    calendar: calendarReducer,
    contracts: (state = {}, action) => {
      return state;
    },
    notification: notificationReducer,
  },
});
