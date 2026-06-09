/**
 * Path: src/features/projects/settings/hooks/useDatesSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDatesSettingsThunk,
  updateDatesScheduleThunk,
} from "../../store/thunks/datesSettings.thunks";

// Default schedule shown before backend data loads
const DEFAULT_SCHEDULE = [
  { description: "Prep",     start: null, end: null, isDefault: true },
  { description: "Shoot",    start: null, end: null, isDefault: true },
  { description: "Wrap",     start: null, end: null, isDefault: true },
  { description: "Hiatus 1", start: null, end: null, isDefault: true },
];

export function useDatesSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.datesSettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchDatesSettingsThunk(projectId));
  }, [projectId, dispatch]);

  // Use backend data if loaded, otherwise show defaults
  const schedule = raw?.schedule?.length ? raw.schedule : DEFAULT_SCHEDULE;

  const updateSchedule = useCallback(
    (schedule) => dispatch(updateDatesScheduleThunk({ projectId, schedule })),
    [dispatch, projectId]
  );

  return { schedule, isFetching, isUpdating, error, updateSchedule };
}