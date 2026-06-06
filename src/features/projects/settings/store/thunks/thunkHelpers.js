/**
 * thunkHelpers.js
 * Path: src/features/projects/settings/store/thunks/thunkHelpers.js
 *
 * Shared utilities for all thunk files.
 * No imports from any thunk/slice/service — zero circular dep risk.
 */

export const rejectWith = (err, rejectWithValue) =>
  rejectWithValue({
    message: err.response?.data?.message || err.message,
    code:    err.response?.data?.code    || null,
    errors:  err.response?.data?.errors  || null,
  });

export const isNotFound = (err) =>
  err.response?.status === 404 || err.response?.data?.code === "SETTINGS_NOT_FOUND";

export const isAlreadyExists = (err) =>
  err.response?.status === 409 || err.response?.data?.code === "SETTINGS_ALREADY_EXIST";

export const withAutoInit = async (projectId, fn, { getState, rejectWithValue }) => {
  try {
    return await fn();
  } catch (err) {
    if (!isNotFound(err)) return rejectWith(err, rejectWithValue);

    try {
      const state       = getState();
      const allProjects = state.project?.projects ?? [];
      const current     = state.project?.currentProject ?? null;
      const project     =
        allProjects.find((p) => p._id?.toString() === projectId) ??
        (current?._id?.toString() === projectId ? current : null);
      const raw      = project?.studioId ?? project?.studio ?? null;
      const studioId = raw?._id ? raw._id.toString() : raw?.toString() ?? null;

      const { initialiseProjectSettings } = await import("../../service/projectSettings.service.js");
      await initialiseProjectSettings(projectId, studioId);
    } catch (initErr) {
      if (!isAlreadyExists(initErr)) return rejectWith(initErr, rejectWithValue);
    }

    try {
      return await fn();
    } catch (retryErr) {
      return rejectWith(retryErr, rejectWithValue);
    }
  }
};