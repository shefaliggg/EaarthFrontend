/**
 * standardCrewSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/standardCrewSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchStandardCrewSettingsThunk = createAsyncThunk(
  "projectSettings/standardCrew/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getStandardCrewSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateSixthSeventhDayThunk = createAsyncThunk(
  "projectSettings/standardCrew/sixthSeventhDay/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateSixthSeventhDay(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateStandardCrewOvertimeThunk = createAsyncThunk(
  "projectSettings/standardCrew/overtime/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateStandardCrewOvertime(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

// ── NEW ───────────────────────────────────────────────────────────────────────
export const updateStandardCrewDepartmentsThunk = createAsyncThunk(
  "projectSettings/standardCrew/departments/update",
  async ({ projectId, departments }, { rejectWithValue }) => {
    try { return await api.updateStandardCrewDepartments(projectId, { departments }); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);