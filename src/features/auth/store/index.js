// src/features/auth/store/index.js

// Export reducer as default and named export
export { default as userReducer } from "./user.slice";
export { default } from "./user.slice";

// Export all thunks
export {
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

// Export all actions from slice
export {
  clearUserError,
  clearUserSuccess,
  clearUserData,
  setCurrentUser,
  updateCurrentUser,
} from "./user.slice";