import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import * as userService from "../services/user.service";

/**
 * ✅ GET CURRENT USER - For persistent login
 * Returns null on error to prevent infinite loops
 */
export const getCurrentUserThunk = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 getCurrentUserThunk - Starting...");

      const user = await authService.getCurrentUser();

      if (!user) {
        console.log("ℹ️ No user session found");
        return null;
      }

      console.log("✅ getCurrentUserThunk - Success:", user.email);
      return user;

    } catch (err) {
      console.error("❌ getCurrentUserThunk error:", err.message);
      return null;
    }
  }
);

/**
 * ✅ LOGIN - Send credentials and get OTP
 */
export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password, rememberMe });
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);

/**
 * ✅ VERIFY OTP - Complete login
 */
export const verifyLoginOtpThunk = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const user = await authService.verifyLoginOtp({ email, otp });
      
      if (!user) {
        throw new Error("No user returned after OTP verification");
      }
      
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Invalid OTP"
      );
    }
  }
);

/**
 * ✅ LOGOUT
 */
export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      // Always succeed logout on frontend even if API fails
      return true;
    }
  }
);

/**
 * QR CODE LOGIN
 */
export const getUserAndSetCookiesThunk = createAsyncThunk(
  "user/qrLogin",
  async (tokenPayload, { rejectWithValue }) => {
    try {
      const user = await authService.getUserAndSetCookies(tokenPayload);
      
      if (!user) {
        throw new Error("No user returned from QR login");
      }
      
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "QR login failed"
      );
    }
  }
);

/**
 * TEMPORARY LOGIN
 */
export const temporaryLoginThunk = createAsyncThunk(
  "user/temporaryLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.temporaryLogin({ email, password });
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Temporary login failed"
      );
    }
  }
);

/**
 * UPDATE PROFILE
 */
export const updateUserProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUserProfile(payload);
      return updatedUser;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
    }
  }
);

/**
 * UPDATE USER TYPE
 */
export const updateUserTypeThunk = createAsyncThunk(
  "user/updateType",
  async (userType, { rejectWithValue }) => {
    try {
      let normalizedUserType = Array.isArray(userType) ? userType[0] : userType;

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
        throw new Error(
          `Invalid user type. Must be one of: ${validUserTypes.join(", ")}`
        );
      }

      const updatedUser = await userService.updateUserType(normalizedUserType);
      return updatedUser;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update user type"
      );
    }
  }
);

/**
 * GET ACTIVITY LOG
 */
export const getUserActivityLogThunk = createAsyncThunk(
  "user/getActivityLog",
  async (_, { rejectWithValue }) => {
    try {
      const activityLog = await userService.getUserActivityLog();
      return activityLog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch activity log"
      );
    }
  }
);

/**
 * GET STUDIOS
 */
export const getUserStudiosThunk = createAsyncThunk(
  "user/getStudios",
  async (_, { rejectWithValue }) => {
    try {
      const studios = await userService.getUserStudios();
      return studios;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch studios"
      );
    }
  }
);

/**
 * GET AGENCIES
 */
export const getUserAgenciesThunk = createAsyncThunk(
  "user/getAgencies",
  async (_, { rejectWithValue }) => {
    try {
      const agencies = await userService.getUserAgencies();
      return agencies;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch agencies"
      );
    }
  }
);

export default {
  getCurrentUserThunk,
  loginUserThunk,
  verifyLoginOtpThunk,
  getUserAndSetCookiesThunk,
  temporaryLoginThunk,
  logoutUserThunk,
  updateUserProfileThunk,
  updateUserTypeThunk,
  getUserActivityLogThunk,
  getUserStudiosThunk,
  getUserAgenciesThunk,
};