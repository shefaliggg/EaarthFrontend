import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProjectSettingsThunk,
  initialiseProjectSettingsThunk,
  deleteProjectSettingsThunk,
  updateProjectDetailsThunk,
  updateProjectDatesThunk,
  fetchTimecardSettingsThunk,
  updateTimecardSettingsThunk,
  fetchCustomSettingsThunk,
  addDayTypeThunk,
  updateDayTypeThunk,
  deleteDayTypeThunk,
  addUpgradeRoleThunk,
  updateUpgradeRoleThunk,
  deleteUpgradeRoleThunk,
  fetchPennyContractCrewThunk,
  setPennyContractThunk,
  addAllowanceOverrideThunk,
  deleteAllowanceOverrideThunk,
} from "./projectSettings.thunks";

const initialState = {
  // Full document
  projectSettings: null,

  // Section slices (populated individually when fetched by section)
  timecardSettings: null,
  customSettings: null,
  pennyContractCrew: null,

  // Loading flags
  isFetching:  false,
  isUpdating:  false,
  isSubmitting: false,

  error: null,
};

const projectSettingsSlice = createSlice({
  name: "projectSettings",
  initialState,
  reducers: {
    clearProjectSettingsError(state) {
      state.error = null;
    },
    setProjectSettings(state, action) {
      state.projectSettings = action.payload;
    },
    updateProjectSettingsLocal(state, action) {
      if (state.projectSettings) {
        state.projectSettings = { ...state.projectSettings, ...action.payload };
      }
    },
    clearProjectSettings(state) {
      state.projectSettings    = null;
      state.timecardSettings   = null;
      state.customSettings     = null;
      state.pennyContractCrew  = null;
      state.error              = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ─── ROOT ───────────────────────────────────────────────────────────────

      .addCase(fetchProjectSettingsThunk.pending, (state) => {
        state.isFetching = true;
        state.error      = null;
      })
      .addCase(fetchProjectSettingsThunk.fulfilled, (state, action) => {
        state.isFetching      = false;
        state.projectSettings = action.payload;
        // Hydrate section caches from the full document
        state.timecardSettings  = action.payload?.timecardSettings  ?? null;
        state.customSettings    = action.payload?.customSettings    ?? null;
      })
      .addCase(fetchProjectSettingsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error      = action.payload;
      })

      .addCase(initialiseProjectSettingsThunk.fulfilled, (state, action) => {
        state.projectSettings = action.payload;
      })

      .addCase(deleteProjectSettingsThunk.fulfilled, (state) => {
        state.projectSettings   = null;
        state.timecardSettings  = null;
        state.customSettings    = null;
        state.pennyContractCrew = null;
      })

      // ─── DETAILS ────────────────────────────────────────────────────────────

      .addCase(updateProjectDetailsThunk.pending, (state) => {
        state.isUpdating = true;
        state.error      = null;
      })
      .addCase(updateProjectDetailsThunk.fulfilled, (state, action) => {
        state.isUpdating      = false;
        state.projectSettings = { ...state.projectSettings, ...action.payload };
      })
      .addCase(updateProjectDetailsThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error      = action.payload;
      })

      // ─── DATES ──────────────────────────────────────────────────────────────

      .addCase(updateProjectDatesThunk.pending, (state) => {
        state.isUpdating = true;
        state.error      = null;
      })
      .addCase(updateProjectDatesThunk.fulfilled, (state, action) => {
        state.isUpdating      = false;
        state.projectSettings = { ...state.projectSettings, ...action.payload };
      })
      .addCase(updateProjectDatesThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error      = action.payload;
      })

      // ─── TIMECARD ───────────────────────────────────────────────────────────

      .addCase(fetchTimecardSettingsThunk.pending, (state) => {
        state.isFetching = true;
        // FIX: clear stale data immediately so the previous project's form
        // is never shown while the new fetch is in flight, and so
        // seededRef in the component resets correctly on project switch.
        state.timecardSettings = null;
        state.error            = null;
      })
      .addCase(fetchTimecardSettingsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        // FIX: action.payload is null when the project has no settings doc yet
        // (thunk returns null for 404).  null tells the component to use
        // DEFAULT_STATE — the form seeds to clean defaults, not stale data.
        state.timecardSettings = action.payload ?? null;
      })
      .addCase(fetchTimecardSettingsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error      = action.payload;
      })

      .addCase(updateTimecardSettingsThunk.pending, (state) => {
        state.isUpdating = true;
        state.error      = null;
      })
      .addCase(updateTimecardSettingsThunk.fulfilled, (state, action) => {
        state.isUpdating       = false;
        state.timecardSettings = action.payload;
      })
      .addCase(updateTimecardSettingsThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error      = action.payload;
      })

      // ─── CUSTOM — section ───────────────────────────────────────────────────

      .addCase(fetchCustomSettingsThunk.pending, (state) => {
        state.isFetching = true;
        state.error      = null;
      })
      .addCase(fetchCustomSettingsThunk.fulfilled, (state, action) => {
        state.isFetching     = false;
        state.customSettings = action.payload;
      })
      .addCase(fetchCustomSettingsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error      = action.payload;
      })

      // ─── DAY TYPES ──────────────────────────────────────────────────────────

      .addCase(addDayTypeThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error        = null;
      })
      .addCase(addDayTypeThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.customSettings?.customDayTypes?.push(action.payload);
      })
      .addCase(addDayTypeThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error        = action.payload;
      })

      .addCase(updateDayTypeThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        const idx = state.customSettings.customDayTypes.findIndex(
          (d) => d._id === action.payload._id
        );
        if (idx !== -1) state.customSettings.customDayTypes[idx] = action.payload;
      })

      .addCase(deleteDayTypeThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        // Soft delete — set isActive false to match backend behaviour
        const item = state.customSettings.customDayTypes.find(
          (d) => d._id === action.payload.dayTypeId
        );
        if (item) item.isActive = false;
      })

      // ─── UPGRADE ROLES ──────────────────────────────────────────────────────

      .addCase(addUpgradeRoleThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error        = null;
      })
      .addCase(addUpgradeRoleThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.customSettings?.upgradeRoles?.push(action.payload);
      })
      .addCase(addUpgradeRoleThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error        = action.payload;
      })

      .addCase(updateUpgradeRoleThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        const idx = state.customSettings.upgradeRoles.findIndex(
          (r) => r._id === action.payload._id
        );
        if (idx !== -1) state.customSettings.upgradeRoles[idx] = action.payload;
      })

      .addCase(deleteUpgradeRoleThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        const item = state.customSettings.upgradeRoles.find(
          (r) => r._id === action.payload.roleId
        );
        if (item) item.isActive = false;
      })

      // ─── PENNY CONTRACTS ────────────────────────────────────────────────────

      .addCase(fetchPennyContractCrewThunk.pending, (state) => {
        state.isFetching = true;
        state.error      = null;
      })
      .addCase(fetchPennyContractCrewThunk.fulfilled, (state, action) => {
        state.isFetching        = false;
        state.pennyContractCrew = action.payload;
      })
      .addCase(fetchPennyContractCrewThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error      = action.payload;
      })

      .addCase(setPennyContractThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        const { crewMemberId, enabled } = action.payload;
        const crew = state.customSettings.pennyContractCrew;
        if (enabled) {
          // Add if not already present
          const exists = crew.some(
            (e) => e.crewMemberId?._id === crewMemberId || e.crewMemberId === crewMemberId
          );
          if (!exists) crew.push({ crewMemberId });
        } else {
          // Remove
          state.customSettings.pennyContractCrew = crew.filter(
            (e) => e.crewMemberId?._id !== crewMemberId && e.crewMemberId !== crewMemberId
          );
        }
      })

      // ─── ALLOWANCE OVERRIDES ────────────────────────────────────────────────

      .addCase(addAllowanceOverrideThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error        = null;
      })
      .addCase(addAllowanceOverrideThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.customSettings?.allowanceOverrides?.push(action.payload);
      })
      .addCase(addAllowanceOverrideThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error        = action.payload;
      })

      .addCase(deleteAllowanceOverrideThunk.fulfilled, (state, action) => {
        if (!state.customSettings) return;
        state.customSettings.allowanceOverrides =
          state.customSettings.allowanceOverrides.filter(
            (o) => o._id !== action.payload.overrideId
          );
      });
  },
});

export const {
  clearProjectSettingsError,
  setProjectSettings,
  updateProjectSettingsLocal,
  clearProjectSettings,
} = projectSettingsSlice.actions;

export default projectSettingsSlice.reducer;