/**
 * useCustomSettings.js
 *
 * Path: customSettings/hooks/useCustomSettings.js
 *
 * Centralises all Redux selector + dispatch wiring for the CustomSettings page.
 * Each sub-component imports ONLY what it needs from this hook, keeping
 * component bodies free of boilerplate.
 *
 * Returned API
 * ────────────
 *   state
 *     customSettings   – the full customSettings sub-document (or null)
 *     isFetching       – true while the initial GET is in flight
 *     isSubmitting     – true while any add/delete write is in flight
 *     error            – { message, code, errors } | null
 *
 *   thunks (all pre-bound with dispatch)
 *     fetchCustomSettings(projectId)
 *     addDayType({ projectId, data })
 *     deleteDayType({ projectId, dayTypeId })
 *     addUpgradeRole({ projectId, data })
 *     deleteUpgradeRole({ projectId, roleId })
 *     setPennyContract({ projectId, crewMemberId, enabled })
 *     addAllowanceOverride({ projectId, data })
 *     deleteAllowanceOverride({ projectId, overrideId })
 */

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import {
  fetchCustomSettingsThunk,
  addDayTypeThunk,
  deleteDayTypeThunk,
  addUpgradeRoleThunk,
  deleteUpgradeRoleThunk,
  setPennyContractThunk,
  addAllowanceOverrideThunk,
  deleteAllowanceOverrideThunk,
} from "../../store/thunks/customSettings.thunks";

export function useCustomSettings() {
  const dispatch = useDispatch();

  // ── Selectors ──────────────────────────────────────────────────────────────
  const customSettings = useSelector((s) => s.projectSettings.customSettings);
  const isFetching     = useSelector((s) => s.projectSettings.isFetching);
  const isSubmitting   = useSelector((s) => s.projectSettings.isSubmitting);
  const error          = useSelector((s) => s.projectSettings.error);

  // ── Bound thunks ───────────────────────────────────────────────────────────
  const fetchCustomSettings    = useCallback((projectId)            => dispatch(fetchCustomSettingsThunk(projectId)),          [dispatch]);
  const addDayType             = useCallback((args)                 => dispatch(addDayTypeThunk(args)),                        [dispatch]);
  const deleteDayType          = useCallback((args)                 => dispatch(deleteDayTypeThunk(args)),                     [dispatch]);
  const addUpgradeRole         = useCallback((args)                 => dispatch(addUpgradeRoleThunk(args)),                    [dispatch]);
  const deleteUpgradeRole      = useCallback((args)                 => dispatch(deleteUpgradeRoleThunk(args)),                 [dispatch]);
  const setPennyContract       = useCallback((args)                 => dispatch(setPennyContractThunk(args)),                  [dispatch]);
  const addAllowanceOverride   = useCallback((args)                 => dispatch(addAllowanceOverrideThunk(args)),              [dispatch]);
  const deleteAllowanceOverride = useCallback((args)                => dispatch(deleteAllowanceOverrideThunk(args)),           [dispatch]);

  return {
    // state
    customSettings,
    isFetching,
    isSubmitting,
    error,
    // thunks
    fetchCustomSettings,
    addDayType,
    deleteDayType,
    addUpgradeRole,
    deleteUpgradeRole,
    setPennyContract,
    addAllowanceOverride,
    deleteAllowanceOverride,
  };
}