import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProjectSettingsThunk,
  updateProjectDetailsThunk,
} from "./projectSettings.thunks";

const initialState = {
  projectSettings: null,

  isFetching: false,
  isUpdating: false,

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
        state.projectSettings = {
          ...state.projectSettings,
          ...action.payload,
        };
      }
    },

    clearProjectSettings(state) {
      state.projectSettings = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProjectSettingsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchProjectSettingsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.projectSettings = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectSettingsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // UPDATE DETAILS
      .addCase(updateProjectDetailsThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateProjectDetailsThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.projectSettings = {
          ...state.projectSettings,
          ...action.payload,
        };
      })
      .addCase(updateProjectDetailsThunk.rejected, (state, action) => {
        state.isUpdating = false;
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
