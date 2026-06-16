import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchNotificationsSettingsThunk = createAsyncThunk(
  "projectSettings/notifications/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getNotificationsSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateNotificationsOffersThunk = createAsyncThunk(
  "projectSettings/notifications/offers/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateNotificationsOffers(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateNotificationsTimecardsThunk = createAsyncThunk(
  "projectSettings/notifications/timecards/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateNotificationsTimecards(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateNotificationsGeneralThunk = createAsyncThunk(
  "projectSettings/notifications/general/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateNotificationsGeneral(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateNotificationsSummaryEmailsThunk = createAsyncThunk(
  "projectSettings/notifications/summaryEmails/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateNotificationsSummaryEmails(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);