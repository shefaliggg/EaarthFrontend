import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserNotificationsThunk = createAsyncThunk(
  "notification/getCurrentNotification",
  async (_, { rejectWithValue }) => {
    console.log("called get user notification api");
  },
);

export default { getUserNotificationsThunk };
