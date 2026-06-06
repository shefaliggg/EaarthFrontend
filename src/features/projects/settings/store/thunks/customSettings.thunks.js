/**
 * customSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/customSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith, isNotFound, withAutoInit } from "./thunkHelpers.js";

export const EMPTY_CUSTOM_SETTINGS = {
  customDayTypes: [], upgradeRoles: [], pennyContractCrew: [], allowanceOverrides: [],
};

export const fetchCustomSettingsThunk = createAsyncThunk(
  "projectSettings/custom/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getCustomSettings(projectId); }
    catch (err) {
      if (isNotFound(err)) return EMPTY_CUSTOM_SETTINGS;
      return rejectWith(err, rejectWithValue);
    }
  }
);

export const addDayTypeThunk = createAsyncThunk(
  "projectSettings/custom/dayTypes/add",
  async ({ projectId, data }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.addDayType(projectId, data), { getState, rejectWithValue })
);

export const updateDayTypeThunk = createAsyncThunk(
  "projectSettings/custom/dayTypes/update",
  async ({ projectId, dayTypeId, updates }, { rejectWithValue }) => {
    try { return await api.updateDayType(projectId, dayTypeId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteDayTypeThunk = createAsyncThunk(
  "projectSettings/custom/dayTypes/delete",
  async ({ projectId, dayTypeId }, { rejectWithValue }) => {
    try { await api.deleteDayType(projectId, dayTypeId); return { dayTypeId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addUpgradeRoleThunk = createAsyncThunk(
  "projectSettings/custom/upgradeRoles/add",
  async ({ projectId, data }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.addUpgradeRole(projectId, data), { getState, rejectWithValue })
);

export const updateUpgradeRoleThunk = createAsyncThunk(
  "projectSettings/custom/upgradeRoles/update",
  async ({ projectId, roleId, updates }, { rejectWithValue }) => {
    try { return await api.updateUpgradeRole(projectId, roleId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteUpgradeRoleThunk = createAsyncThunk(
  "projectSettings/custom/upgradeRoles/delete",
  async ({ projectId, roleId }, { rejectWithValue }) => {
    try { await api.deleteUpgradeRole(projectId, roleId); return { roleId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const fetchPennyContractCrewThunk = createAsyncThunk(
  "projectSettings/custom/pennyContracts/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getPennyContractCrew(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const setPennyContractThunk = createAsyncThunk(
  "projectSettings/custom/pennyContracts/set",
  async ({ projectId, crewMemberId, enabled }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.setPennyContract(projectId, crewMemberId, enabled), { getState, rejectWithValue })
);

export const addAllowanceOverrideThunk = createAsyncThunk(
  "projectSettings/custom/allowanceOverrides/add",
  async ({ projectId, data }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.addAllowanceOverride(projectId, data), { getState, rejectWithValue })
);

export const deleteAllowanceOverrideThunk = createAsyncThunk(
  "projectSettings/custom/allowanceOverrides/delete",
  async ({ projectId, overrideId }, { rejectWithValue }) => {
    try { await api.deleteAllowanceOverride(projectId, overrideId); return { overrideId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);