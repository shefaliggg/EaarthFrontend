/**
 * timecardSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/timecardSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith, isNotFound } from "./thunkHelpers.js";

export const fetchTimecardSettingsThunk = createAsyncThunk(
  "projectSettings/timecard/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getTimecardSettings(projectId); }
    catch (err) {
      if (isNotFound(err)) return null;
      return rejectWith(err, rejectWithValue);
    }
  }
);

export const updateTimecardSettingsThunk = createAsyncThunk(
  "projectSettings/timecard/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateTimecardSettings(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);