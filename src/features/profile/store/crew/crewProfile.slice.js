import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProfileThunk,
  updateContactInfoThunk,
  updateEmergencyContactThunk,
  updateHomeAddressThunk,
  updateNationalityProofThunk,
  updatePersonalDetailsThunk,
} from "./crewProfile.thunk";

const initialState = {
  crewProfile: null,

  isFetching: false,
  isUpdating: false,

  error: null,
};

const crewProfileSlice = createSlice({
  name: "crewProfile",
  initialState,

  reducers: {
    clearCrewProfileError(state) {
      state.error = null;
    },

    setCrewProfile(state, action) {
      state.crewProfile = action.payload;
    },

    updateCrewProfileLocal(state, action) {
      if (state.crewProfile) {
        state.crewProfile = {
          ...state.crewProfile,
          ...action.payload,
        };
      }
    },

    clearCrewProfile(state) {
      state.crewProfile = null;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchProfileThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.crewProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // UPDATE PERSONAL
      .addCase(updatePersonalDetailsThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updatePersonalDetailsThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.crewProfile = {
          ...state.crewProfile,
          ...action.payload,
        };
      })
      .addCase(updatePersonalDetailsThunk.rejected, (state, action) => {
        state.isUpdating = false;
      })

      // UPDATE NATIONALITY
      .addCase(updateNationalityProofThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateNationalityProofThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.crewProfile = {
          ...state.crewProfile,
          nationalityProof: action.payload?.nationalityProof,
          profileCompletionPercent: action.payload?.profileCompletionPercent,
        };
      })
      .addCase(updateNationalityProofThunk.rejected, (state, action) => {
        state.isUpdating = false;
      })

      // HOME ADDRESS
      .addCase(updateHomeAddressThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateHomeAddressThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.crewProfile = {
          ...state.crewProfile,
          ...action.payload,
        };
      })
      .addCase(updateHomeAddressThunk.rejected, (state) => {
        state.isUpdating = false;
      })

      // CONTACT INFO
      .addCase(updateContactInfoThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateContactInfoThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.crewProfile = {
          ...state.crewProfile,
          ...action.payload,
        };
      })
      .addCase(updateContactInfoThunk.rejected, (state) => {
        state.isUpdating = false;
      })

      // EMERGENCY CONTACT
      .addCase(updateEmergencyContactThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateEmergencyContactThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.crewProfile = {
          ...state.crewProfile,
          ...action.payload,
        };
      })
      .addCase(updateEmergencyContactThunk.rejected, (state) => {
        state.isUpdating = false;
      });
  },
});

export const {
  clearCrewProfileError,
  setCrewProfile,
  updateCrewProfileLocal,
  clearCrewProfile,
} = crewProfileSlice.actions;

export default crewProfileSlice.reducer;
