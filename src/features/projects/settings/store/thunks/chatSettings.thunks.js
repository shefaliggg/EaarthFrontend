/**
 * Path: src/features/projects/settings/store/thunks/chatSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchChatSettingsThunk = createAsyncThunk(
  "projectSettings/chat/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getChatSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateChatGeneralThunk = createAsyncThunk(
  "projectSettings/chat/general/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateChatGeneral(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateChatChannelsThunk = createAsyncThunk(
  "projectSettings/chat/channels/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateChatChannels(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateChatNotificationsThunk = createAsyncThunk(
  "projectSettings/chat/notifications/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateChatNotifications(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateChatModerationThunk = createAsyncThunk(
  "projectSettings/chat/moderation/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateChatModeration(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);