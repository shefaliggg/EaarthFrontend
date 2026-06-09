/**
 * Path: src/features/projects/settings/store/thunks/detailsIdentitySettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchDetailsIdentitySettingsThunk = createAsyncThunk(
  "projectSettings/detailsIdentity/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getDetailsIdentitySettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateDetailsIdentitySettingsThunk = createAsyncThunk(
  "projectSettings/detailsIdentity/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateDetailsIdentitySettings(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);