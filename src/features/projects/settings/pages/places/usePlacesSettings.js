/**
 * usePlacesSettings.js
 *
 * Path: src/features/projects/settings/places/usePlacesSettings.js
 *
 * FIX: addUnit and updateUnit now RETURN the dispatch result.
 * PlacesSettings.jsx needs result.payload._id after addUnit to track
 * which real mongo _id was assigned to a promoted default unit.
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPlacesSettingsThunk,
  addUnitThunk,
  updateUnitThunk,
  deleteUnitThunk,
  addWorkplaceThunk,
  updateWorkplaceThunk,
  deleteWorkplaceThunk,
} from "../../store/thunks/placesSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

export function usePlacesSettings(projectId) {
  const dispatch = useDispatch();

  const placesSettings = useSelector((s) => s.projectSettings?.placesSettings);
  const isFetching     = useSelector((s) => s.projectSettings?.isFetching  ?? false);
  const isSubmitting   = useSelector((s) => s.projectSettings?.isSubmitting ?? false);
  const isUpdating     = useSelector((s) => s.projectSettings?.isUpdating   ?? false);
  const error          = useSelector((s) => s.projectSettings?.error        ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchPlacesSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const units      = (placesSettings?.units      ?? []).filter((u) => u.isActive !== false);
  const workplaces = (placesSettings?.workplaces ?? []).filter((w) => w.isActive !== false);
  const sites      = placesSettings?.sites ?? ["OFF SET", "ON SET"];

  // ── Units ──────────────────────────────────────────────────────────────────

  /**
   * addUnit — returns the full dispatch result so callers can read
   * result.payload._id to track promoted default units.
   */
  const addUnit = useCallback(
    (data) => dispatch(addUnitThunk({ projectId, data })),
    [projectId, dispatch]
  );

  /**
   * updateUnit — accepts (unitId, updates) signature (not the raw thunk object).
   * Returns dispatch result for consistency.
   */
  const updateUnit = useCallback(
    (unitId, updates) => dispatch(updateUnitThunk({ projectId, unitId, updates })),
    [projectId, dispatch]
  );

  const deleteUnit = useCallback(
    (unitId) => dispatch(deleteUnitThunk({ projectId, unitId })),
    [projectId, dispatch]
  );

  // ── Workplaces ─────────────────────────────────────────────────────────────

  const addWorkplace = useCallback(
    (data) => dispatch(addWorkplaceThunk({ projectId, data })),
    [projectId, dispatch]
  );

  const updateWorkplace = useCallback(
    (workplaceId, updates) => dispatch(updateWorkplaceThunk({ projectId, workplaceId, updates })),
    [projectId, dispatch]
  );

  const deleteWorkplace = useCallback(
    (workplaceId) => dispatch(deleteWorkplaceThunk({ projectId, workplaceId })),
    [projectId, dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearProjectSettingsError()),
    [dispatch]
  );

  return {
    units,
    workplaces,
    sites,
    isFetching,
    isSubmitting,
    isUpdating,
    isLoading: isFetching || isSubmitting || isUpdating,
    error,
    addUnit,
    updateUnit,
    deleteUnit,
    addWorkplace,
    updateWorkplace,
    deleteWorkplace,
    clearError,
  };
}