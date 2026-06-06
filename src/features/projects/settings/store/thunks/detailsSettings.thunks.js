/**
 * detailsSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/detailsSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchDetailsSettingsThunk = createAsyncThunk(
  "projectSettings/details/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getDetailsSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateBasicThunk = createAsyncThunk(
  "projectSettings/details/basic/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateBasic(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateProjectInformationThunk = createAsyncThunk(
  "projectSettings/details/projectInformation/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateProjectInformation(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateOfferHandlingThunk = createAsyncThunk(
  "projectSettings/details/offerHandling/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateOfferHandling(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateAllowancesThunk = createAsyncThunk(
  "projectSettings/details/allowances/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateAllowances(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateMealPenaltiesThunk = createAsyncThunk(
  "projectSettings/details/mealPenalties/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateMealPenalties(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateNoticeThunk = createAsyncThunk(
  "projectSettings/details/notice/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateNotice(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);