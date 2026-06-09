/**
 * useDetailsSettings.js
 * Path: src/features/projects/settings/hooks/useDetailsSettings.js
 *
 * Merged: useDetailsIdentitySettings.js → identity section
 * Deleted: useDetailsIdentitySettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDetailsSettingsThunk,
  updateIdentityThunk,
  updateBasicThunk,
  updateProjectInformationThunk,
  updateOfferHandlingThunk,
  updateAllowancesThunk,
  updateMealPenaltiesThunk,
  updateNoticeThunk,
} from "../../store/thunks/detailsSettings.thunks";
import { clearProjectSettingsError } from "../../store/projectSettings.slice";

const DEFAULTS = {
  // ── merged from useDetailsIdentitySettings ─────────────────────────────────
  identity: {
    productionName:  "",
    codeName:        "",
    description:     "",
    country:         "",
    additionalNotes: "",
  },
  // ──────────────────────────────────────────────────────────────────────────
  basic: {
    workingWeek:  "5_days",
    showPrepWrap: true,
  },
  projectInformation: {
    projectType:                         "Feature Film",
    showProjectTypeInOffers:             true,
    unionAgreement:                      "None",
    constructionUnionAgreement:          "None",
    budget:                              "Low (under £10 million)",
    showBudgetToCrew:                    false,
    holidayPayPercentage:                "0%",
    differentHolidayPayForDailies:       false,
    withholdHolidayPayOn6th7th:          false,
    overtimeEnabled:                     false,
    showWeeklyRateForDailiesInOffer:     false,
    showWeeklyRateForDailiesInDocuments: false,
    payrollCompany:                      "dataplan",
    offerEndDateRequirement:             "Optional",
    crewCsvExportLayout:                 "eaarth",
    payrollCsvExportLayout:              "dataplan",
    defaultWorkingHours:                 "12_continuous",
  },
  offerHandling: {
    shareStatusDetermination: false,
    taxStatusQueryEmail:      "",
    taxStatusHandling:        "no_loan_outs",
    offerApproval:            "accounts",
  },
  allowances: {
    box: false, computer: false, software: false, equipment: false,
    mobile: false, vehicleAllowance: false, vehicleHire: false,
    perDiem: false, living: false,
  },
  perDiemItems:  [],
  mealPenalties: { breakfast: 6, lunch: 5, dinner: 10 },
  notice:        { noticeDays: "2", emailWording: "" },
};

export function useDetailsSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.detailsSettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchDetailsSettingsThunk(projectId));
  }, [projectId, dispatch]);

  // Merge Redux data over defaults so the UI always has a full shape
  const settings = {
    identity:           { ...DEFAULTS.identity,           ...(raw?.identity           ?? {}) },
    basic:              { ...DEFAULTS.basic,              ...(raw?.basic              ?? {}) },
    projectInformation: { ...DEFAULTS.projectInformation, ...(raw?.projectInformation ?? {}) },
    offerHandling:      { ...DEFAULTS.offerHandling,      ...(raw?.offerHandling      ?? {}) },
    allowances:         { ...DEFAULTS.allowances,         ...(raw?.allowances         ?? {}) },
    perDiemItems:       raw?.perDiemItems  ?? DEFAULTS.perDiemItems,
    mealPenalties:      { ...DEFAULTS.mealPenalties,      ...(raw?.mealPenalties      ?? {}) },
    notice:             { ...DEFAULTS.notice,             ...(raw?.notice             ?? {}) },
  };

  const updateIdentity = useCallback(
  (updates) => dispatch(updateIdentityThunk({ projectId, updates })),
  [dispatch, projectId]
);
  const updateBasic              = useCallback((updates) => dispatch(updateBasicThunk({ projectId, updates })),              [dispatch, projectId]);
  const updateProjectInformation = useCallback((updates) => dispatch(updateProjectInformationThunk({ projectId, updates })), [dispatch, projectId]);
  const updateOfferHandling      = useCallback((updates) => dispatch(updateOfferHandlingThunk({ projectId, updates })),      [dispatch, projectId]);
  const updateAllowances         = useCallback((updates) => dispatch(updateAllowancesThunk({ projectId, updates })),         [dispatch, projectId]);
  const updateMealPenalties      = useCallback((updates) => dispatch(updateMealPenaltiesThunk({ projectId, updates })),      [dispatch, projectId]);
  const updateNotice             = useCallback((updates) => dispatch(updateNoticeThunk({ projectId, updates })),             [dispatch, projectId]);
  const clearError               = useCallback(() => dispatch(clearProjectSettingsError()),                                  [dispatch]);

  return {
    settings,
    isFetching,
    isUpdating,
    error,
    updateIdentity,
    updateBasic,
    updateProjectInformation,
    updateOfferHandling,
    updateAllowances,
    updateMealPenalties,
    updateNotice,
    clearError,
  };
}