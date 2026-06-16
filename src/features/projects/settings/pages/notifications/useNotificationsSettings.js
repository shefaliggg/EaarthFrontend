import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationsSettingsThunk,
  updateNotificationsOffersThunk,
  updateNotificationsTimecardsThunk,
  updateNotificationsGeneralThunk,
  updateNotificationsSummaryEmailsThunk,
} from "../../store/thunks/notificationsSettings.thunks";

const DEFAULTS = {
  offers: {
    notifyOfferSent:     true,
    notifyOfferAccepted: true,
    notifyOfferDeclined: true,
    notifyOfferExpired:  false,
    reminderAfterDays:   "3",
    ccAccounts:          false,
    ccProduction:        false,
  },
  timecards: {
    notifySubmission: true,
    notifyApproval:   true,
    notifyRejection:  true,
    notifyExport:     false,
    weeklyDigest:     true,
    digestDay:        "monday",
  },
  general: {
    crewJoins:         true,
    crewLeaves:        true,
    documentUploaded:  true,
    calendarChange:    true,
    settingsChanges:   true,
    systemMaintenance: false,
  },
  summaryEmails: {
    dailySummary:          false,
    weeklySummary:         true,
    summaryDay:            "monday",
    summaryTime:           "06:00",
    includeFinancials:     true,
    includeCrewChanges:    true,
    includeTimecardStatus: true,
    recipients:            "Production Supervisor, Accounts Supervisor",
  },
};

export function useNotificationsSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.notificationsSettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchNotificationsSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    offers:        { ...DEFAULTS.offers,        ...(raw?.offers        ?? {}) },
    timecards:     { ...DEFAULTS.timecards,     ...(raw?.timecards     ?? {}) },
    general:       { ...DEFAULTS.general,       ...(raw?.general       ?? {}) },
    summaryEmails: { ...DEFAULTS.summaryEmails, ...(raw?.summaryEmails ?? {}) },
  };

  const updateOffers        = useCallback((updates) => dispatch(updateNotificationsOffersThunk({ projectId, updates })),        [dispatch, projectId]);
  const updateTimecards     = useCallback((updates) => dispatch(updateNotificationsTimecardsThunk({ projectId, updates })),     [dispatch, projectId]);
  const updateGeneral       = useCallback((updates) => dispatch(updateNotificationsGeneralThunk({ projectId, updates })),       [dispatch, projectId]);
  const updateSummaryEmails = useCallback((updates) => dispatch(updateNotificationsSummaryEmailsThunk({ projectId, updates })), [dispatch, projectId]);

  return {
    settings,
    isFetching,
    isUpdating,
    error,
    updateOffers,
    updateTimecards,
    updateGeneral,
    updateSummaryEmails,
  };
}