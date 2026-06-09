/**
 * Path: src/features/projects/settings/store/thunks/datesSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchDatesSettingsThunk = createAsyncThunk(
  "projectSettings/dates/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getDatesSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateDatesScheduleThunk = createAsyncThunk(
  "projectSettings/dates/schedule/update",
  async ({ projectId, schedule }, { rejectWithValue }) => {
    try { return await api.updateDatesSchedule(projectId, { schedule }); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);