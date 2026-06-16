import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchAdminSettingsThunk = createAsyncThunk(
  "projectSettings/admin/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getAdminSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateAdminPresetThunk = createAsyncThunk(
  "projectSettings/admin/preset/update",
  async ({ projectId, preset }, { rejectWithValue }) => {
    try { return await api.updateAdminPreset(projectId, { preset }); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addRolePermissionThunk = createAsyncThunk(
  "projectSettings/admin/rolePermissions/add",
  async ({ projectId, data }, { rejectWithValue }) => {
    try { return await api.addRolePermission(projectId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateRolePermissionThunk = createAsyncThunk(
  "projectSettings/admin/rolePermissions/update",
  async ({ projectId, roleId, data }, { rejectWithValue }) => {
    try { return await api.updateRolePermission(projectId, roleId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteRolePermissionThunk = createAsyncThunk(
  "projectSettings/admin/rolePermissions/delete",
  async ({ projectId, roleId }, { rejectWithValue }) => {
    try { return await api.deleteRolePermission(projectId, roleId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const bulkUpdateRolePermissionsThunk = createAsyncThunk(
  "projectSettings/admin/rolePermissions/bulkUpdate",
  async ({ projectId, rolePermissions }, { rejectWithValue }) => {
    try { return await api.bulkUpdateRolePermissions(projectId, { rolePermissions }); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const restoreDefaultRolePermissionsThunk = createAsyncThunk(
  "projectSettings/admin/rolePermissions/restoreDefaults",
  async (projectId, { rejectWithValue }) => {
    try { return await api.restoreDefaultRolePermissions(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);