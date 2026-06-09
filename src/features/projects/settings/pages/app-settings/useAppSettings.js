/**
 * Path: src/features/projects/settings/hooks/useAppSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppSettingsThunk,
  updateAppThunk,
} from "../../store/thunks/appSettings.thunks";

const APP_NAMES = [
  "CALENDAR", "CALL_SHEETS", "SHOOTING_SCHEDULE", "ASSET", "COSTUME",
  "CATERING", "ACCOUNTS", "SCRIPT", "MARKET", "TRANSPORT", "E_PLAYER",
  "FORMS", "PROPS", "ANIMALS", "VEHICLES", "LOCATIONS", "CLOUD",
  "TIMESHEETS", "NOTICE_BOARD", "PROJECT_CHAT", "SCRIPT_BREAKDOWN",
  "PRODUCTION_REPORTS", "CASTING_CALLS", "CREW", "CAST", "SCHEDULE",
  "BUDGET", "DOCUMENTS", "EAARTH_SIGN",
];

const DEFAULT_APPS = APP_NAMES.map((appName) => ({
  appName, enabled: true, notifs: true, access: "ALL",
}));

export function useAppSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.appSettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchAppSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const apps = raw?.apps?.length ? raw.apps : DEFAULT_APPS;

  const updateApp = useCallback(
    (appName, field, value) =>
      dispatch(updateAppThunk({ projectId, appName, field, value })),
    [dispatch, projectId]
  );

  return { apps, isFetching, isUpdating, error, updateApp };
}