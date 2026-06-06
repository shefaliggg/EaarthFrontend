/**
 * useTimecardSettings.js
 *
 * Path: src/features/projects/settings/timecard/useTimecardSettings.js
 *
 * Redux wiring hook for the Timecard Settings section.
 * Mirrors the pattern used by useCustomSettings.
 *
 * Exposes:
 *   timecardSettings  — the section slice from Redux state
 *   isFetching        — true while fetchTimecardSettingsThunk is in flight
 *   isUpdating        — true while updateTimecardSettingsThunk is in flight
 *   error             — last error payload (or null)
 *   fetchTimecardSettings(projectId)        — dispatch wrapper
 *   updateTimecardSettings(projectId, updates) — dispatch wrapper; returns the thunk result
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTimecardSettingsThunk, updateTimecardSettingsThunk }
  from "../../store/thunks/timecardSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

export function useTimecardSettings() {
  const dispatch = useDispatch();

  // ── Selectors ──────────────────────────────────────────────────────────────
  const timecardSettings = useSelector((s) => s.projectSettings?.timecardSettings ?? null);
  const isFetching       = useSelector((s) => s.projectSettings?.isFetching  ?? false);
  const isUpdating       = useSelector((s) => s.projectSettings?.isUpdating   ?? false);
  const error            = useSelector((s) => s.projectSettings?.error        ?? null);

  // ── Actions ────────────────────────────────────────────────────────────────

  const fetchTimecardSettings = useCallback(
    (projectId) => dispatch(fetchTimecardSettingsThunk(projectId)),
    [dispatch]
  );

  /**
   * Sends a partial update to the backend and returns the thunk result.
   * The caller can await this and check `.meta.requestStatus === "fulfilled"`.
   *
   * @param {string} projectId
   * @param {object} updates — any subset of the timecardSettings schema
   */
  const updateTimecardSettings = useCallback(
    (projectId, updates) =>
      dispatch(updateTimecardSettingsThunk({ projectId, updates })),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearProjectSettingsError()),
    [dispatch]
  );

  return {
    timecardSettings,
    isFetching,
    isUpdating,
    error,
    fetchTimecardSettings,
    updateTimecardSettings,
    clearError,
  };
}