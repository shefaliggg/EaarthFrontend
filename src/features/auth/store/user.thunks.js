// src/features/auth/store/user.thunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import * as userService from "../services/user.service";

/**
 * 🔐 Get current logged-in user
 * Handles persistent login by checking cookies or token
 */
export const getCurrentUserThunk = createAsyncThunk(
  "user/getCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      console.error("❌ Get current user error:", err);
      return rejectWithValue(err?.message || "Failed to fetch user");
    }
  }
);

/**
 * 🔑 Login (email + password) - Sends OTP
 */
export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password, rememberMe });
      return response; // Could be { success, message }
    } catch (err) {
      console.error("❌ Login error:", err);
      return rejectWithValue(err?.message || "Login failed");
    }
  }
);

/**
 * 🔢 Verify OTP - Completes login
 */
export const verifyLoginOtpThunk = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const user = await authService.verifyLoginOtp({ email, otp });
      if (!user) throw new Error("No user returned after OTP verification");
      return user;
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      return rejectWithValue(err?.message || "Invalid OTP");
    }
  }
);

/**
 * 📲 QR / Token login - Set cookies and get user
 */
export const getUserAndSetCookiesThunk = createAsyncThunk(
  "user/qrLogin",
  async (tokenPayload, { rejectWithValue }) => {
    try {
      const user = await authService.getUserAndSetCookies(tokenPayload);
      if (!user) throw new Error("No user returned from QR login");
      return user;
    } catch (err) {
      console.error("❌ QR login error:", err);
      return rejectWithValue(err?.message || "QR login failed");
    }
  }
);

/**
 * 🚪 Logout user
 * Force logout on frontend even if API fails
 */
export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (err) {
      console.error("❌ Logout API error:", err);
      return true;
    }
  }
);

/**
 * 👤 Update user profile
 */
export const updateUserProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUserProfile(payload);
      return updatedUser;
    } catch (err) {
      console.error("❌ Update profile error:", err);
      return rejectWithValue(err?.message || "Failed to update profile");
    }
  }
);

/**
 * 🏷️ Update user type
 * Ensures userType is a string (frontend normalization)
 */
export const updateUserTypeThunk = createAsyncThunk(
  "user/updateType",
  async (userType, { rejectWithValue }) => {
    try {
      let normalizedUserType = userType;

      if (Array.isArray(userType)) {
        normalizedUserType = userType[0];
      }

      if (!normalizedUserType || typeof normalizedUserType !== "string") {
        throw new Error("Invalid user type. Must be a string");
      }

      const validUserTypes = [
        "studio_admin",
        "agency_admin",
        "crew",
        "cast",
        "individual",
        "admin",
        "signer",
        "none",
      ];

      if (!validUserTypes.includes(normalizedUserType)) {
        throw new Error(`Invalid user type. Must be one of: ${validUserTypes.join(", ")}`);
      }

      const updatedUser = await userService.updateUserType(normalizedUserType);
      return updatedUser;
    } catch (err) {
      console.error("❌ Update user type error:", err);
      return rejectWithValue(err?.message || "Failed to update user type");
    }
  }
);

/**
 * 📋 Get user activity log
 */
export const getUserActivityLogThunk = createAsyncThunk(
  "user/getActivityLog",
  async (_, { rejectWithValue }) => {
    try {
      const activityLog = await userService.getUserActivityLog();
      return activityLog;
    } catch (err) {
      console.error("❌ Get activity log error:", err);
      return rejectWithValue(err?.message || "Failed to fetch activity log");
    }
  }
);

/**
 * 🏢 Get user studios
 */
export const getUserStudiosThunk = createAsyncThunk(
  "user/getStudios",
  async (_, { rejectWithValue }) => {
    try {
      const studios = await userService.getUserStudios();
      return studios;
    } catch (err) {
      console.error("❌ Get studios error:", err);
      return rejectWithValue(err?.message || "Failed to fetch studios");
    }
  }
);

/**
 * 🏢 Get user agencies
 */
export const getUserAgenciesThunk = createAsyncThunk(
  "user/getAgencies",
  async (_, { rejectWithValue }) => {
    try {
      const agencies = await userService.getUserAgencies();
      return agencies;
    } catch (err) {
      console.error("❌ Get agencies error:", err);
      return rejectWithValue(err?.message || "Failed to fetch agencies");
    }
  }
);

export default {
  getCurrentUserThunk,
  loginUserThunk,
  verifyLoginOtpThunk,
  getUserAndSetCookiesThunk,
  logoutUserThunk,
  updateUserProfileThunk,
  updateUserTypeThunk,
  getUserActivityLogThunk,
  getUserStudiosThunk,
  getUserAgenciesThunk,
};
