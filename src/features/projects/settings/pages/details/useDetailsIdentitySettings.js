/**
 * Path: src/features/projects/settings/hooks/useDetailsIdentitySettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetailsIdentitySettingsThunk,
  updateDetailsIdentitySettingsThunk,
} from "../../store/thunks/detailsIdentitySettings.thunks";

const DEFAULTS = {
  productionName:  "",
  codeName:        "",
  description:     "",
  country:         "",
  additionalNotes: "",
};

export function useDetailsIdentitySettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.detailsIdentitySettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchDetailsIdentitySettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = { ...DEFAULTS, ...(raw ?? {}) };

  const updateIdentity = useCallback(
    (updates) => dispatch(updateDetailsIdentitySettingsThunk({ projectId, updates })),
    [dispatch, projectId]
  );

  return { settings, isFetching, isUpdating, error, updateIdentity };
}