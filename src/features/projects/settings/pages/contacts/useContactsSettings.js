/**
 * Path: src/features/projects/settings/hooks/useContactsSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactsSettingsThunk,
  addCompanyThunk,
  updateCompanyThunk,
  deleteCompanyThunk,
  updateProductionBaseThunk,
  updateProjectCreatorThunk,
  updateBillingThunk,
} from "../../store/thunks/contactsSettings.thunks";

const DEFAULTS = {
  companies:      [],
  productionBase: { addressLine1: "", addressLine2: "", city: "", postcode: "", telephone: "", email: "", country: "GB" },
  projectCreator: { name: "", email: "" },
  billing:        { name: "", email: "", vatNumber: "", sameAsSpv: false, addressLine1: "", addressLine2: "", city: "", postcode: "", country: "GB" },
};

export function useContactsSettings(projectId) {
  const dispatch = useDispatch();

  const raw          = useSelector((s) => s.projectSettings.contactsSettings);
  const isFetching   = useSelector((s) => s.projectSettings.isFetching   ?? false);
  const isUpdating   = useSelector((s) => s.projectSettings.isUpdating   ?? false);
  const isSubmitting = useSelector((s) => s.projectSettings.isSubmitting ?? false);
  const error        = useSelector((s) => s.projectSettings.error        ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchContactsSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    companies:      raw?.companies?.filter((c) => c.isActive) ?? DEFAULTS.companies,
    productionBase: { ...DEFAULTS.productionBase, ...(raw?.productionBase ?? {}) },
    projectCreator: { ...DEFAULTS.projectCreator, ...(raw?.projectCreator ?? {}) },
    billing:        { ...DEFAULTS.billing,        ...(raw?.billing        ?? {}) },
  };

  const addCompany         = useCallback((data)                   => dispatch(addCompanyThunk({ projectId, data })),                   [dispatch, projectId]);
  const updateCompany      = useCallback((companyId, data)        => dispatch(updateCompanyThunk({ projectId, companyId, data })),      [dispatch, projectId]);
  const removeCompany      = useCallback((companyId)              => dispatch(deleteCompanyThunk({ projectId, companyId })),            [dispatch, projectId]);
  const updateProductionBase = useCallback((updates)              => dispatch(updateProductionBaseThunk({ projectId, updates })),       [dispatch, projectId]);
  const updateProjectCreator = useCallback((updates)              => dispatch(updateProjectCreatorThunk({ projectId, updates })),       [dispatch, projectId]);
  const updateBilling        = useCallback((updates)              => dispatch(updateBillingThunk({ projectId, updates })),              [dispatch, projectId]);

  return {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    addCompany,
    updateCompany,
    removeCompany,
    updateProductionBase,
    updateProjectCreator,
    updateBilling,
  };
}