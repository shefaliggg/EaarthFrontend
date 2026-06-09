/**
 * Path: src/features/projects/settings/store/thunks/appSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchAppSettingsThunk = createAsyncThunk(
  "projectSettings/app/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getAppSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateAppThunk = createAsyncThunk(
  "projectSettings/app/update",
  async ({ projectId, appName, field, value }, { rejectWithValue }) => {
    try { return await api.updateApp(projectId, { appName, [field]: value }); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);