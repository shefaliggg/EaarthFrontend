import { createSlice } from "@reduxjs/toolkit";
import {
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
} from "./user.thunks";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isFetching: false,
  isLoggingIn: false,
  isVerifying: false,
  isUpdating: false,
  error: null,
  successMessage: null,
  activityLog: [],
  studios: [],
  agencies: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearUserSuccess(state) {
      state.successMessage = null;
    },
    clearUserData(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      state.activityLog = [];
      state.studios = [];
      state.agencies = [];
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateCurrentUser(state, action) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== GET CURRENT USER ====================
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ==================== LOGIN (Send OTP) ====================
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })

      // ==================== VERIFY OTP ====================
      .addCase(verifyLoginOtpThunk.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyLoginOtpThunk.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.successMessage = "Login successful";
      })
      .addCase(verifyLoginOtpThunk.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      })

      // ==================== QR LOGIN ====================
      .addCase(getUserAndSetCookiesThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getUserAndSetCookiesThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserAndSetCookiesThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // ==================== LOGOUT ====================
      .addCase(logoutUserThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isFetching = false;
        state.error = null;
        state.successMessage = null;
        state.activityLog = [];
        state.studios = [];
        state.agencies = [];
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isFetching = false;
      })

      // ==================== UPDATE PROFILE ====================
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // ==================== UPDATE USER TYPE ====================
      .addCase(updateUserTypeThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserTypeThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.successMessage = "User type updated successfully";
      })
      .addCase(updateUserTypeThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // ==================== GET ACTIVITY LOG ====================
      .addCase(getUserActivityLogThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getUserActivityLogThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.activityLog = action.payload;
      })
      .addCase(getUserActivityLogThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // ==================== GET STUDIOS ====================
      .addCase(getUserStudiosThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getUserStudiosThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.studios = action.payload;
      })
      .addCase(getUserStudiosThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // ==================== GET AGENCIES ====================
      .addCase(getUserAgenciesThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getUserAgenciesThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.agencies = action.payload;
      })
      .addCase(getUserAgenciesThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearUserError,
  clearUserSuccess,
  clearUserData,
  setCurrentUser,
  updateCurrentUser,
} = userSlice.actions;

export default userSlice.reducer;
