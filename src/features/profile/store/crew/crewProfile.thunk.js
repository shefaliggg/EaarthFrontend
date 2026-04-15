import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  updatePersonalDetails,
  updateNationalityProof,
} from "../../services/profile.service";

export const fetchProfileThunk = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      console.log("✅ fetchProfileThunk success:", response);
      return response;
    } catch (err) {
      console.error("❌ fetchProfileThunk error:", err.message);
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: "Failed to fetch profile data. Please try again later.",
      });
    }
  },
);

// 🔥 UPDATE PERSONAL
export const updatePersonalDetailsThunk = createAsyncThunk(
  "profile/updatePersonalDetails",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("called update profile personal detials thunk");
      const response = await updatePersonalDetails(payload);
      console.log("✅ updatePersonalDetailsThunk success:", response);
      return response;
    } catch (err) {
      console.error(
        "❌ updatePersonalDetailsThunk error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// 🔥 UPDATE NATIONALITY PROOF
export const updateNationalityProofThunk = createAsyncThunk(
  "profile/updateNationalityProof",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateNationalityProof(formData);
      console.log("✅ updateNationalityProofThunk success:", response);
      return response;
    } catch (err) {
      console.error("❌ updateNationalityProofThunk error:", err.message);
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

export default {
  getProfile,
  updatePersonalDetails,
  updateNationalityProof,
};
