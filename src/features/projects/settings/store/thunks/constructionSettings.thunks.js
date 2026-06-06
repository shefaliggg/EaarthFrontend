/**
 * constructionSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/constructionSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchConstructionSettingsThunk = createAsyncThunk(
  "projectSettings/construction/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getConstructionSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

// Factory — all section updates have identical shape
const makeSectionThunk = (section, apiFn) =>
  createAsyncThunk(
    `projectSettings/construction/${section}/update`,
    async ({ projectId, updates }, { rejectWithValue }) => {
      try { return await apiFn(projectId, updates); }
      catch (err) { return rejectWith(err, rejectWithValue); }
    }
  );

export const updateDailyRateThunk        = makeSectionThunk("dailyRate",        api.updateDailyRate);
export const updateBreaksThunk           = makeSectionThunk("breaks",           api.updateBreaks);
export const updateSixthDayThunk         = makeSectionThunk("sixthDay",         api.updateSixthDay);
export const updateSeventhDayThunk       = makeSectionThunk("seventhDay",       api.updateSeventhDay);
export const updateOvertimeThunk         = makeSectionThunk("overtime",         api.updateOvertime);
export const updateTravelTimeThunk       = makeSectionThunk("travelTime",       api.updateTravelTime);
export const updateBrokenTurnaroundThunk = makeSectionThunk("brokenTurnaround", api.updateBrokenTurnaround);