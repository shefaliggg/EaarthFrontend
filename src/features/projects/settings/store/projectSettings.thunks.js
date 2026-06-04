/**
 * projectSettings.thunks.js
 *
 * Path: src/features/projects/settings/store/projectSettings.thunks.js
 *
 * KEY FIX: All write thunks (add/update/delete on custom sub-resources) now
 * use withAutoInit() — if the backend returns 404/SETTINGS_NOT_FOUND it means
 * the project settings document doesn't exist yet.  We auto-initialise it
 * first then replay the original request, transparently to the UI.
 *
 * TIMECARD FIX: fetchTimecardSettingsThunk now returns null (instead of
 * rejecting) when no settings doc exists yet.  This lets the UI fall back
 * to DEFAULT_STATE cleanly instead of showing a stale previous-project form.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "@/features/projects/settings/service/projectSettings.service.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rejectWith = (err, rejectWithValue) =>
  rejectWithValue({
    message: err.response?.data?.message || err.message,
    code:    err.response?.data?.code    || null,
    errors:  err.response?.data?.errors  || null,
  });

const isNotFound = (err) => {
  const status = err.response?.status;
  const code   = err.response?.data?.code;
  return status === 404 || code === "SETTINGS_NOT_FOUND";
};

/**
 * withAutoInit
 *
 * Wraps any API call that mutates custom settings sub-resources.
 * If the call fails with 404/SETTINGS_NOT_FOUND it means the top-level
 * project settings document hasn't been created yet.  We:
 *   1. Call initialise (POST /settings/:projectId/initialise)
 *   2. Replay the original fn()
 *
 * studioId is read from Redux state so callers don't have to pass it.
 */
const withAutoInit = async (projectId, fn, { getState, rejectWithValue }) => {
  try {
    return await fn();
  } catch (err) {
    if (!isNotFound(err)) return rejectWith(err, rejectWithValue);

    // ── Auto-initialise ────────────────────────────────────────────────────
    try {
      // Resolve studioId from the Redux projects list
      const state       = getState();
      const allProjects = state.project?.projects ?? [];
      const current     = state.project?.currentProject ?? null;

      const project = allProjects.find((p) => p._id?.toString() === projectId)
                   ?? (current?._id?.toString() === projectId ? current : null);

      // studioId may be a populated object or a plain string/ObjectId
      const raw      = project?.studioId ?? project?.studio ?? null;
      const studioId = raw?._id ? raw._id.toString() : raw?.toString() ?? null;

      await api.initialiseProjectSettings(projectId, studioId);
    } catch (initErr) {
      // If initialise itself fails, surface that error
      return rejectWith(initErr, rejectWithValue);
    }

    // ── Replay the original request ────────────────────────────────────────
    try {
      return await fn();
    } catch (retryErr) {
      return rejectWith(retryErr, rejectWithValue);
    }
  }
};

// ─── Empty custom settings shape ──────────────────────────────────────────────
// Returned by fetchCustomSettingsThunk when no doc exists yet — lets the UI
// render all four sections with empty tables and Add buttons.
const EMPTY_CUSTOM_SETTINGS = {
  customDayTypes:     [],
  upgradeRoles:       [],
  pennyContractCrew:  [],
  allowanceOverrides: [],
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

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

// ─── DETAILS ──────────────────────────────────────────────────────────────────

export const updateProjectDetailsThunk = createAsyncThunk(
  "projectSettings/details/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateProjectDetails(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

// ─── DATES ────────────────────────────────────────────────────────────────────

export const updateProjectDatesThunk = createAsyncThunk(
  "projectSettings/dates/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateProjectDates(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

// ─── TIMECARD ─────────────────────────────────────────────────────────────────

export const fetchTimecardSettingsThunk = createAsyncThunk(
  "projectSettings/timecard/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      return await api.getTimecardSettings(projectId);
    } catch (err) {
      // FIX: 404 = no settings doc yet — totally normal for new projects.
      // Return null so the UI falls back to DEFAULT_STATE instead of
      // showing a stale error or keeping the previous project's data.
      if (isNotFound(err)) return null;
      return rejectWith(err, rejectWithValue);
    }
  }
);

export const updateTimecardSettingsThunk = createAsyncThunk(
  "projectSettings/timecard/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateTimecardSettings(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

// ─── CUSTOM — fetch ───────────────────────────────────────────────────────────

export const fetchCustomSettingsThunk = createAsyncThunk(
  "projectSettings/custom/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      return await api.getCustomSettings(projectId);
    } catch (err) {
      // 404 = no doc yet — totally normal for new projects.
      // Return an empty shape so the UI shows Add buttons, not an error.
      if (isNotFound(err)) return EMPTY_CUSTOM_SETTINGS;
      return rejectWith(err, rejectWithValue);
    }
  }
);

// ─── DAY TYPES ────────────────────────────────────────────────────────────────

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

// ─── UPGRADE ROLES ────────────────────────────────────────────────────────────

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

// ─── PENNY CONTRACTS ──────────────────────────────────────────────────────────

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
    withAutoInit(
      projectId,
      () => api.setPennyContract(projectId, crewMemberId, enabled),
      { getState, rejectWithValue }
    )
);

// ─── ALLOWANCE OVERRIDES ──────────────────────────────────────────────────────

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