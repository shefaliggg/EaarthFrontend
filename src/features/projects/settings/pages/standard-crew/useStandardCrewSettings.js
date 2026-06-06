/**
 * useStandardCrewSettings.js
 * Path: src/features/projects/settings/hooks/useStandardCrewSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStandardCrewSettingsThunk,
  updateSixthSeventhDayThunk,
  updateStandardCrewOvertimeThunk,
} from "../../store/thunks/standardCrewSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

const DEFAULTS = {
  sixthSeventhDay: { sixthDayMultiplier: "1.0", seventhDayMultiplier: "1.0", showMinHours: false },
  overtime:        { other: "", cameraStandard: "", cameraContinuous: "", cameraSemiContinuous: "" },
};

export function useStandardCrewSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings?.standardCrewSettings);
  const isFetching = useSelector((s) => s.projectSettings?.isFetching  ?? false);
  const isUpdating = useSelector((s) => s.projectSettings?.isUpdating  ?? false);
  const error      = useSelector((s) => s.projectSettings?.error       ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchStandardCrewSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    sixthSeventhDay: { ...DEFAULTS.sixthSeventhDay, ...(raw?.sixthSeventhDay ?? {}) },
    overtime:        { ...DEFAULTS.overtime,        ...(raw?.overtime        ?? {}) },
  };

  const updateSixthSeventhDay = useCallback(
    (updates) => dispatch(updateSixthSeventhDayThunk({ projectId, updates })),
    [projectId, dispatch]
  );

  const updateOvertime = useCallback(
    (updates) => dispatch(updateStandardCrewOvertimeThunk({ projectId, updates })),
    [projectId, dispatch]
  );

  const clearError = useCallback(() => dispatch(clearProjectSettingsError()), [dispatch]);

  return {
    settings,
    isFetching,
    isUpdating,
    isLoading: isFetching || isUpdating,
    error,
    updateSixthSeventhDay,
    updateOvertime,
    clearError,
  };
}