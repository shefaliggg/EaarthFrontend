import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSettingsThunk,
  updateAdminPresetThunk,
  addRolePermissionThunk,
  updateRolePermissionThunk,
  deleteRolePermissionThunk,
  bulkUpdateRolePermissionsThunk,
  restoreDefaultRolePermissionsThunk,
} from "../../store/thunks/adminSettings.thunks";

const DEFAULTS = {
  rolePermissions: [],
  preset:          "default",
};

export function useAdminSettings(projectId) {
  const dispatch = useDispatch();

  const raw          = useSelector((s) => s.projectSettings.adminSettings);
  const isFetching   = useSelector((s) => s.projectSettings.isFetching   ?? false);
  const isUpdating   = useSelector((s) => s.projectSettings.isUpdating   ?? false);
  const isSubmitting = useSelector((s) => s.projectSettings.isSubmitting ?? false);
  const error        = useSelector((s) => s.projectSettings.error        ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchAdminSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    rolePermissions: raw?.rolePermissions ?? DEFAULTS.rolePermissions,
    preset:          raw?.preset          ?? DEFAULTS.preset,
  };

  const updatePreset              = useCallback((preset)                   => dispatch(updateAdminPresetThunk({ projectId, preset })),                           [dispatch, projectId]);
  const addRolePermission         = useCallback((data)                     => dispatch(addRolePermissionThunk({ projectId, data })),                             [dispatch, projectId]);
  const updateRolePermission      = useCallback((roleId, data)             => dispatch(updateRolePermissionThunk({ projectId, roleId, data })),                  [dispatch, projectId]);
  const deleteRolePermission      = useCallback((roleId)                   => dispatch(deleteRolePermissionThunk({ projectId, roleId })),                        [dispatch, projectId]);
  const bulkUpdateRolePermissions = useCallback((rolePermissions)          => dispatch(bulkUpdateRolePermissionsThunk({ projectId, rolePermissions })),           [dispatch, projectId]);
  const restoreDefaults           = useCallback(()                         => dispatch(restoreDefaultRolePermissionsThunk(projectId)),                            [dispatch, projectId]);

  return {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    updatePreset,
    addRolePermission,
    updateRolePermission,
    deleteRolePermission,
    bulkUpdateRolePermissions,
    restoreDefaults,
  };
}