import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProjectSettingsThunk,
  initialiseProjectSettingsThunk,
  deleteProjectSettingsThunk,
} from "./projectSettings.thunks";

import {
  fetchTimecardSettingsThunk,
  updateTimecardSettingsThunk,
} from "./thunks/timecardSettings.thunks";

import {
  fetchCustomSettingsThunk,
  addDayTypeThunk, updateDayTypeThunk, deleteDayTypeThunk,
  addUpgradeRoleThunk, updateUpgradeRoleThunk, deleteUpgradeRoleThunk,
  fetchPennyContractCrewThunk, setPennyContractThunk,
  addAllowanceOverrideThunk, deleteAllowanceOverrideThunk,
} from "./thunks/customSettings.thunks";

import {
  fetchPlacesSettingsThunk,
  addUnitThunk,
  updateUnitThunk,
  deleteUnitThunk,
  addWorkplaceThunk,
  updateWorkplaceThunk,
  deleteWorkplaceThunk,
} from "./thunks/placesSettings.thunks";

import {
  fetchConstructionSettingsThunk,
  updateDailyRateThunk,
  updateBreaksThunk,
  updateSixthDayThunk,
  updateSeventhDayThunk,
  updateOvertimeThunk,
  updateTravelTimeThunk,
  updateBrokenTurnaroundThunk,
} from "./thunks/constructionSettings.thunks";

import {
  fetchStandardCrewSettingsThunk,
  updateSixthSeventhDayThunk,
  updateStandardCrewOvertimeThunk,
  updateStandardCrewDepartmentsThunk,
} from "./thunks/standardCrewSettings.thunks";

import {
  fetchDetailsSettingsThunk,
  updateIdentityThunk,
  updateBasicThunk,
  updateProjectInformationThunk,
  updateOfferHandlingThunk,
  updateAllowancesThunk,
  updateMealPenaltiesThunk,
  updateNoticeThunk,
} from "./thunks/detailsSettings.thunks";

import {
  fetchDatesSettingsThunk,
  updateDatesScheduleThunk,
} from "./thunks/datesSettings.thunks";

import {
  fetchContactsSettingsThunk,
  addCompanyThunk,
  updateCompanyThunk,
  deleteCompanyThunk,
  updateProductionBaseThunk,
  updateProjectCreatorThunk,
  updateBillingThunk,
} from "./thunks/contactsSettings.thunks";

import {
  fetchChatSettingsThunk,
  updateChatGeneralThunk,
  updateChatChannelsThunk,
  updateChatNotificationsThunk,
  updateChatModerationThunk,
} from "./thunks/chatSettings.thunks";

const DEFAULT_PLACES = {
  units: [
    { _id: "default-1", name: "Main",            startDate: null, endDate: null, isPrimary: true,  isActive: true },
    { _id: "default-2", name: "Splinter Camera", startDate: null, endDate: null, isPrimary: false, isActive: true },
    { _id: "default-3", name: "VFX Elements",    startDate: null, endDate: null, isPrimary: false, isActive: true },
  ],
  workplaces: [],
  sites: ["OFF SET", "ON SET"],
};

const initialState = {
  projectSettings:      null,
  timecardSettings:     null,
  customSettings:       null,
  placesSettings:       DEFAULT_PLACES,
  constructionSettings: null,
  pennyContractCrew:    null,
  standardCrewSettings: null,
  detailsSettings:      null,
  datesSettings:        null,
  contactsSettings:     null,
  chatSettings:         null,
  isFetching:           false,
  isUpdating:           false,
  isSubmitting:         false,
  error:                null,
};

const projectSettingsSlice = createSlice({
  name: "projectSettings",
  initialState,
  reducers: {
    clearProjectSettingsError(state)               { state.error = null; },
    clearProjectSettings(state)                    { Object.assign(state, initialState); },
    setProjectSettings(state, { payload })         { state.projectSettings = payload; },
    updateProjectSettingsLocal(state, { payload }) {
      if (state.projectSettings) state.projectSettings = { ...state.projectSettings, ...payload };
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchProjectSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchProjectSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching           = false;
        state.projectSettings      = payload;
        state.timecardSettings     = payload?.timecardSettings     ?? null;
        state.customSettings       = payload?.customSettings       ?? null;
        state.constructionSettings = payload?.constructionSettings ?? null;
        if (payload?.placesSettings?.units?.length) {
          state.placesSettings = payload.placesSettings;
        }
      })
      .addCase(fetchProjectSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(initialiseProjectSettingsThunk.fulfilled, (state, { payload }) => {
        state.projectSettings = payload;
      })

      .addCase(deleteProjectSettingsThunk.fulfilled, (state) => {
        Object.assign(state, initialState);
      })

      .addCase(fetchTimecardSettingsThunk.pending, (state) => {
        state.isFetching = true; state.timecardSettings = null; state.error = null;
      })
      .addCase(fetchTimecardSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching       = false;
        state.timecardSettings = payload ?? null;
      })
      .addCase(fetchTimecardSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateTimecardSettingsThunk.pending, (state) => {
        state.isUpdating = true; state.error = null;
      })
      .addCase(updateTimecardSettingsThunk.fulfilled, (state, { payload }) => {
        state.isUpdating       = false;
        state.timecardSettings = payload;
      })
      .addCase(updateTimecardSettingsThunk.rejected, (state, { payload }) => {
        state.isUpdating = false; state.error = payload;
      })

      .addCase(fetchCustomSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchCustomSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching     = false;
        state.customSettings = payload;
      })
      .addCase(fetchCustomSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(addDayTypeThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addDayTypeThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting = false;
        state.customSettings?.customDayTypes?.push(payload);
      })
      .addCase(addDayTypeThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(updateDayTypeThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        const idx = state.customSettings.customDayTypes.findIndex((d) => d._id === payload._id);
        if (idx !== -1) state.customSettings.customDayTypes[idx] = payload;
      })

      .addCase(deleteDayTypeThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        const item = state.customSettings.customDayTypes.find((d) => d._id === payload.dayTypeId);
        if (item) item.isActive = false;
      })

      .addCase(addUpgradeRoleThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addUpgradeRoleThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting = false;
        state.customSettings?.upgradeRoles?.push(payload);
      })
      .addCase(addUpgradeRoleThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(updateUpgradeRoleThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        const idx = state.customSettings.upgradeRoles.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.customSettings.upgradeRoles[idx] = payload;
      })

      .addCase(deleteUpgradeRoleThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        const item = state.customSettings.upgradeRoles.find((r) => r._id === payload.roleId);
        if (item) item.isActive = false;
      })

      .addCase(fetchPennyContractCrewThunk.pending,   (state) => { state.isFetching = true;  state.error = null; })
      .addCase(fetchPennyContractCrewThunk.fulfilled, (state, { payload }) => {
        state.isFetching        = false;
        state.pennyContractCrew = payload;
      })
      .addCase(fetchPennyContractCrewThunk.rejected,  (state, { payload }) => { state.isFetching = false; state.error = payload; })

      .addCase(setPennyContractThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        const { crewMemberId, enabled } = payload;
        const crew = state.customSettings.pennyContractCrew;
        if (enabled) {
          const exists = crew.some((e) => e.crewMemberId?._id === crewMemberId || e.crewMemberId === crewMemberId);
          if (!exists) crew.push({ crewMemberId });
        } else {
          state.customSettings.pennyContractCrew = crew.filter(
            (e) => e.crewMemberId?._id !== crewMemberId && e.crewMemberId !== crewMemberId
          );
        }
      })

      .addCase(addAllowanceOverrideThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addAllowanceOverrideThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting = false;
        state.customSettings?.allowanceOverrides?.push(payload);
      })
      .addCase(addAllowanceOverrideThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(deleteAllowanceOverrideThunk.fulfilled, (state, { payload }) => {
        if (!state.customSettings) return;
        state.customSettings.allowanceOverrides =
          state.customSettings.allowanceOverrides.filter((o) => o._id !== payload.overrideId);
      })

      .addCase(fetchPlacesSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchPlacesSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching     = false;
        state.placesSettings = payload;
      })
      .addCase(fetchPlacesSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(addUnitThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addUnitThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting = false;
        if (!state.placesSettings) return;
        if (payload.isPrimary) state.placesSettings.units.forEach((u) => { u.isPrimary = false; });
        state.placesSettings.units.push(payload);
      })
      .addCase(addUnitThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(updateUnitThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateUnitThunk.fulfilled, (state, { payload }) => {
        state.isUpdating = false;
        if (!state.placesSettings) return;
        if (payload.isPrimary) state.placesSettings.units.forEach((u) => { u.isPrimary = false; });
        const idx = state.placesSettings.units.findIndex((u) => u._id === payload._id);
        if (idx !== -1) state.placesSettings.units[idx] = payload;
      })
      .addCase(updateUnitThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(deleteUnitThunk.fulfilled, (state, { payload }) => {
        if (!state.placesSettings) return;
        const item = state.placesSettings.units.find((u) => u._id === payload.unitId);
        if (item) {
          const wasPrimary = item.isPrimary;
          item.isActive = false; item.isPrimary = false;
          if (wasPrimary) {
            const next = state.placesSettings.units.find((u) => u._id !== payload.unitId && u.isActive);
            if (next) next.isPrimary = true;
          }
        }
      })

      .addCase(addWorkplaceThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addWorkplaceThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting = false;
        state.placesSettings?.workplaces?.push(payload);
      })
      .addCase(addWorkplaceThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(updateWorkplaceThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateWorkplaceThunk.fulfilled, (state, { payload }) => {
        state.isUpdating = false;
        if (!state.placesSettings) return;
        const idx = state.placesSettings.workplaces.findIndex((w) => w._id === payload._id);
        if (idx !== -1) state.placesSettings.workplaces[idx] = payload;
      })
      .addCase(updateWorkplaceThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(deleteWorkplaceThunk.fulfilled, (state, { payload }) => {
        if (!state.placesSettings) return;
        const item = state.placesSettings.workplaces.find((w) => w._id === payload.workplaceId);
        if (item) item.isActive = false;
      })

      .addCase(fetchConstructionSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchConstructionSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching           = false;
        state.constructionSettings = payload;
      })
      .addCase(fetchConstructionSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateDailyRateThunk.pending,          (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateDailyRateThunk.fulfilled,        (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateDailyRateThunk.rejected,         (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateBreaksThunk.pending,             (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateBreaksThunk.fulfilled,           (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateBreaksThunk.rejected,            (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateSixthDayThunk.pending,           (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateSixthDayThunk.fulfilled,         (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateSixthDayThunk.rejected,          (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateSeventhDayThunk.pending,         (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateSeventhDayThunk.fulfilled,       (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateSeventhDayThunk.rejected,        (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateOvertimeThunk.pending,           (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateOvertimeThunk.fulfilled,         (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateOvertimeThunk.rejected,          (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateTravelTimeThunk.pending,         (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateTravelTimeThunk.fulfilled,       (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateTravelTimeThunk.rejected,        (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateBrokenTurnaroundThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateBrokenTurnaroundThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.constructionSettings = payload; })
      .addCase(updateBrokenTurnaroundThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(fetchStandardCrewSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchStandardCrewSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching           = false;
        state.standardCrewSettings = payload;
      })
      .addCase(fetchStandardCrewSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateSixthSeventhDayThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateSixthSeventhDayThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.standardCrewSettings = payload; })
      .addCase(updateSixthSeventhDayThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateStandardCrewOvertimeThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateStandardCrewOvertimeThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.standardCrewSettings = payload; })
      .addCase(updateStandardCrewOvertimeThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateStandardCrewDepartmentsThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateStandardCrewDepartmentsThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.standardCrewSettings = payload; })
      .addCase(updateStandardCrewDepartmentsThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(fetchDetailsSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchDetailsSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching      = false;
        state.detailsSettings = payload;
      })
      .addCase(fetchDetailsSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateIdentityThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateIdentityThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateIdentityThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateBasicThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateBasicThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateBasicThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateProjectInformationThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateProjectInformationThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateProjectInformationThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateOfferHandlingThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateOfferHandlingThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateOfferHandlingThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateAllowancesThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateAllowancesThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateAllowancesThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateMealPenaltiesThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateMealPenaltiesThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateMealPenaltiesThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateNoticeThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateNoticeThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.detailsSettings = payload; })
      .addCase(updateNoticeThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(fetchDatesSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchDatesSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching    = false;
        state.datesSettings = payload;
      })
      .addCase(fetchDatesSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateDatesScheduleThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateDatesScheduleThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.datesSettings = payload; })
      .addCase(updateDatesScheduleThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(fetchContactsSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchContactsSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching       = false;
        state.contactsSettings = payload;
      })
      .addCase(fetchContactsSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(addCompanyThunk.pending,   (state) => { state.isSubmitting = true;  state.error = null; })
      .addCase(addCompanyThunk.fulfilled, (state, { payload }) => { state.isSubmitting = false; state.contactsSettings = payload; })
      .addCase(addCompanyThunk.rejected,  (state, { payload }) => { state.isSubmitting = false; state.error = payload; })

      .addCase(updateCompanyThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateCompanyThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.contactsSettings = payload; })
      .addCase(updateCompanyThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(deleteCompanyThunk.fulfilled, (state, { payload }) => {
        state.contactsSettings = payload;
      })

      .addCase(updateProductionBaseThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateProductionBaseThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.contactsSettings = payload; })
      .addCase(updateProductionBaseThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateProjectCreatorThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateProjectCreatorThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.contactsSettings = payload; })
      .addCase(updateProjectCreatorThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateBillingThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateBillingThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.contactsSettings = payload; })
      .addCase(updateBillingThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(fetchChatSettingsThunk.pending, (state) => {
        state.isFetching = true; state.error = null;
      })
      .addCase(fetchChatSettingsThunk.fulfilled, (state, { payload }) => {
        state.isFetching   = false;
        state.chatSettings = payload;
      })
      .addCase(fetchChatSettingsThunk.rejected, (state, { payload }) => {
        state.isFetching = false; state.error = payload;
      })

      .addCase(updateChatGeneralThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateChatGeneralThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.chatSettings = payload; })
      .addCase(updateChatGeneralThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateChatChannelsThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateChatChannelsThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.chatSettings = payload; })
      .addCase(updateChatChannelsThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateChatNotificationsThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateChatNotificationsThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.chatSettings = payload; })
      .addCase(updateChatNotificationsThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; })

      .addCase(updateChatModerationThunk.pending,   (state) => { state.isUpdating = true;  state.error = null; })
      .addCase(updateChatModerationThunk.fulfilled, (state, { payload }) => { state.isUpdating = false; state.chatSettings = payload; })
      .addCase(updateChatModerationThunk.rejected,  (state, { payload }) => { state.isUpdating = false; state.error = payload; });
  },
});

export const {
  clearProjectSettingsError,
  clearProjectSettings,
  setProjectSettings,
  updateProjectSettingsLocal,
} = projectSettingsSlice.actions;

export default projectSettingsSlice.reducer;