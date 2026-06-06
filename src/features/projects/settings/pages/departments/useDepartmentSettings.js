/**
 * useDepartmentSettings.js
 * Path: src/features/projects/settings/hooks/useDepartmentSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStandardCrewSettingsThunk,
  updateStandardCrewDepartmentsThunk,
} from "../../store/thunks/standardCrewSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

export function useDepartmentSettings(projectId) {
  const dispatch = useDispatch();

  const departments = useSelector(
    (s) => s.projectSettings.standardCrewSettings?.departmentOvertimeSettings ?? null
  );
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    // Only fetch if not already loaded (standardCrewSettings covers all sub-sections)
    dispatch(fetchStandardCrewSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const saveDepartments = useCallback(
    (rows) => dispatch(updateStandardCrewDepartmentsThunk({ projectId, departments: rows })),
    [dispatch, projectId]
  );

  const clearError = useCallback(() => dispatch(clearProjectSettingsError()), [dispatch]);

  return {
    departments,
    isFetching,
    isUpdating,
    error,
    saveDepartments,
    clearError,
  };
}