/**
 * projectSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/projectSettings.thunks.js
 *
 * Root-level thunks only — document lifecycle.
 * Section thunks live in their own files.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../service/projectSettings.service.js";
import { rejectWith }       from "../store/thunks/thunkHelpers.js";

export const fetchProjectSettingsThunk = createAsyncThunk(
  "projectSettings/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getProjectSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const initialiseProjectSettingsThunk = createAsyncThunk(
  "projectSettings/initialise",
  async ({ projectId, studioId }, { rejectWithValue }) => {
    try { return await api.initialiseProjectSettings(projectId, studioId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteProjectSettingsThunk = createAsyncThunk(
  "projectSettings/delete",
  async (projectId, { rejectWithValue }) => {
    try { await api.deleteProjectSettings(projectId); return { projectId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);



export const updateProjectDetailsThunk = createAsyncThunk(
  "projectSettings/details/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateTimecardSettings(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);
