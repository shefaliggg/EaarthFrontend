import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjectSettings,
  updateProjectDetails,
} from "@/features/projects/settings/service/projectSettings.service.js";

export const fetchProjectSettingsThunk = createAsyncThunk(
  "projectSettings/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectSettings(projectId);
      console.log("✅ fetchProjectSettingsThunk success:", response);
      return response;
    } catch (err) {
      console.error("❌ fetchProjectSettingsThunk error:", err.message);
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: "Failed to fetch project settings. Please try again later.",
      });
    }
  },
);

// UPDATE DETAILS
export const updateProjectDetailsThunk = createAsyncThunk(
  "projectSettings/updateDetails",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      console.log("called update project details thunk");

      const response = await updateProjectDetails(projectId, payload);

      console.log("✅ updateProjectDetailsThunk success:", response);

      return response;
    } catch (err) {
      console.error(
        "❌ updateProjectDetailsThunk error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);
