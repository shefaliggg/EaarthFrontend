/**
 * useConstructionSettings.js
 *
 * Path: src/features/projects/settings/construction/useConstructionSettings.js
 *
 * Custom hook — mirrors usePlacesSettings.js pattern exactly.
 *
 * Returns:
 *   settings       — full constructionSettings subdocument (or null while loading)
 *   isFetching     — true while initial load is in flight
 *   isUpdating     — true while a PATCH is in flight
 *   error          — last error payload or null
 *   updateSection  — (section, updates) → dispatches the correct thunk
 *   clearError     — clears the error from Redux state
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchConstructionSettingsThunk,
  updateDailyRateThunk,
  updateBreaksThunk,
  updateSixthDayThunk,
  updateSeventhDayThunk,
  updateOvertimeThunk,
  updateTravelTimeThunk,
  updateBrokenTurnaroundThunk,
} from "../../store/thunks/constructionSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

// Map section names to their thunks so updateSection stays generic
const SECTION_THUNKS = {
  dailyRate:        updateDailyRateThunk,
  breaks:           updateBreaksThunk,
  sixthDay:         updateSixthDayThunk,
  seventhDay:       updateSeventhDayThunk,
  overtime:         updateOvertimeThunk,
  travelTime:       updateTravelTimeThunk,
  brokenTurnaround: updateBrokenTurnaroundThunk,
};

export function useConstructionSettings(projectId) {
  const dispatch = useDispatch();

  const settings   = useSelector((s) => s.projectSettings?.constructionSettings ?? null);
  const isFetching = useSelector((s) => s.projectSettings?.isFetching  ?? false);
  const isUpdating = useSelector((s) => s.projectSettings?.isUpdating   ?? false);
  const error      = useSelector((s) => s.projectSettings?.error        ?? null);

  // Fetch on mount / projectId change
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchConstructionSettingsThunk(projectId));
  }, [projectId, dispatch]);

  /**
   * updateSection(section, updates)
   *
   * @param {string} section  — one of the SECTION_THUNKS keys
   * @param {object} updates  — partial update matching the section's schema
   * @returns Promise — resolves with dispatch result (use .unwrap() to throw on error)
   */
  const updateSection = useCallback(
    (section, updates) => {
      const thunk = SECTION_THUNKS[section];
      if (!thunk) throw new Error(`Unknown construction section: "${section}"`);
      return dispatch(thunk({ projectId, updates }));
    },
    [projectId, dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearProjectSettingsError()),
    [dispatch]
  );

  return {
    settings,
    isFetching,
    isUpdating,
    isLoading: isFetching || isUpdating,
    error,
    updateSection,
    clearError,
  };
}