// import { api } from "../api/apiClient"; 
// import { ROUTES } from "../constants/routes";

// export const authUtils = {
//   // -----------------------------------------------------------------------
//   // AUTH LOGIN
//   // -----------------------------------------------------------------------
//   login: async (email, password) => {
//     const res = await api.post(ROUTES.AUTH.LOGIN, { email, password });

//     if (!res?.data?.success) {
//       throw new Error(res.data?.message || "Login failed");
//     }

//     return res.data.user;
//   },

//   temporaryLogin: async (email) => {
//     const res = await api.post(ROUTES.AUTH.TEMPORARY_LOGIN, { email });

//     if (!res?.data?.success) {
//       throw new Error(res.data?.message || "Temporary login failed");
//     }

//     return res.data;
//   },

//   verifyLoginOTP: async ({ email, otp }) => {
//     const res = await api.post(ROUTES.AUTH.VERIFY_LOGIN_OTP, { email, otp });

//     if (!res?.data?.success) {
//       throw new Error(res.data?.message || "Invalid OTP");
//     }

//     return res.data;
//   },

//   // -----------------------------------------------------------------------
//   // PASSWORD HANDLING
//   // -----------------------------------------------------------------------
//   setPassword: async ({ userId, password }) => {
//     const res = await api.post(ROUTES.AUTH.SET_PASSWORD, { userId, password });

//     if (!res?.data?.success) {
//       throw new Error(res.data?.message || "Set password failed");
//     }

//     return res.data;
//   },

//   sendResetPasswordOTP: async (email) => {
//     const res = await api.post(ROUTES.AUTH.RESET_PASSWORD_SEND_OTP, { email });
//     return res.data;
//   },

//   verifyResetPasswordOTP: async ({ email, otp }) => {
//     const res = await api.post(ROUTES.AUTH.VERIFY_RESET_PASSWORD_OTP, {
//       email,
//       otp,
//     });
//     return res.data;
//   },

//   // -----------------------------------------------------------------------
//   // IDENTITY VERIFICATION
//   // -----------------------------------------------------------------------
//   verifyIdentity: async (formData) => {
//     const res = await api.post(ROUTES.AUTH.VERIFY_IDENTITY, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   // -----------------------------------------------------------------------
//   // INVITATION EMAIL VERIFICATION
//   // -----------------------------------------------------------------------
//   verifyEmailInvitation: async (token) => {
//     const res = await api.get(`${ROUTES.AUTH.VERIFY_EMAIL_LINK}?token=${token}`);
//     return res.data;
//   },

//   // -----------------------------------------------------------------------
//   // USER SESSION MANAGEMENT
//   // -----------------------------------------------------------------------
//   getCurrentUser: async () => {
//     try {
//       const res = await api.get(ROUTES.AUTH.ME);

//       if (!res.data.success) return null;

//       return res.data.user;
//     } catch (e) {
//       return null;
//     }
//   },

//   logout: async () => {
//     try {
//       await api.post(ROUTES.AUTH.LOGOUT);
//       return true;
//     } catch (err) {
//       console.error("Logout failed:", err);
//       return false;
//     }
//   },

//   refreshToken: async () => {
//     const res = await api.post(ROUTES.AUTH.REFRESH_TOKEN);
//     return res.data;
//   },
// };
