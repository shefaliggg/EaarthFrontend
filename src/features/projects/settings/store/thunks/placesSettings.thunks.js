/**
 * placesSettings.thunks.js
 * Path: src/features/projects/settings/store/thunks/placesSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith, isNotFound, withAutoInit } from "./thunkHelpers.js";

export const EMPTY_PLACES_SETTINGS = {
  units: [
    { _id: "default-1", name: "Main",            startDate: null, endDate: null, isPrimary: true,  isActive: true },
    { _id: "default-2", name: "Splinter Camera", startDate: null, endDate: null, isPrimary: false, isActive: true },
    { _id: "default-3", name: "VFX Elements",    startDate: null, endDate: null, isPrimary: false, isActive: true },
  ],
  workplaces: [],
  sites: ["OFF SET", "ON SET"],
};

export const fetchPlacesSettingsThunk = createAsyncThunk(
  "projectSettings/places/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await api.getPlacesSettings(projectId);
      if (!data?.units?.length) return { ...data, units: EMPTY_PLACES_SETTINGS.units };
      return data;
    } catch (err) {
      if (isNotFound(err)) return EMPTY_PLACES_SETTINGS;
      return rejectWith(err, rejectWithValue);
    }
  }
);

export const addUnitThunk = createAsyncThunk(
  "projectSettings/places/units/add",
  async ({ projectId, data }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.addUnit(projectId, data), { getState, rejectWithValue })
);

export const updateUnitThunk = createAsyncThunk(
  "projectSettings/places/units/update",
  async ({ projectId, unitId, updates }, { rejectWithValue }) => {
    try { return await api.updateUnit(projectId, unitId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteUnitThunk = createAsyncThunk(
  "projectSettings/places/units/delete",
  async ({ projectId, unitId }, { rejectWithValue }) => {
    try { await api.deleteUnit(projectId, unitId); return { unitId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addWorkplaceThunk = createAsyncThunk(
  "projectSettings/places/workplaces/add",
  async ({ projectId, data }, { rejectWithValue, getState }) =>
    withAutoInit(projectId, () => api.addWorkplace(projectId, data), { getState, rejectWithValue })
);

export const updateWorkplaceThunk = createAsyncThunk(
  "projectSettings/places/workplaces/update",
  async ({ projectId, workplaceId, updates }, { rejectWithValue }) => {
    try { return await api.updateWorkplace(projectId, workplaceId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteWorkplaceThunk = createAsyncThunk(
  "projectSettings/places/workplaces/delete",
  async ({ projectId, workplaceId }, { rejectWithValue }) => {
    try { await api.deleteWorkplace(projectId, workplaceId); return { workplaceId }; }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);