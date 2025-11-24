// import { authApi } from "../api/auth.api";

// export const authService = {
//   /** ----------------------------------------
//    * Verify invitation link
//    * ---------------------------------------- */
//   verifyInviteLink: async (token, email) => {
//     try {
//       const { data } = await authApi.get("/invite/verify", {
//         params: { token, email: email.toLowerCase().trim() },
//       });
//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message ||
//           "Invitation link is invalid or expired."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Temporary login (set-password flow)
//    * ---------------------------------------- */
//   temporaryLogin: async ({ email, password }) => {
//     try {
//       const { data } = await authApi.post("/auth/login/temporary", {
//         email: email.toLowerCase().trim(),
//         password,
//       });

//       if (!data?.success)
//         throw new Error(data?.message || "Temporary login failed");

//       const userId = data.data?.userId || data.userId;
//       const emailFromServer = data.data?.email || email;

//       return {
//         success: true,
//         userId,
//         email: emailFromServer,
//         ...data,
//       };
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Temporary login failed."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Normal login (sends OTP)
//    * ---------------------------------------- */
//   login: async ({ email, password, rememberMe = false }) => {
//     try {
//       const { data } = await authApi.post("/auth/login", {
//         email: email.toLowerCase().trim(),
//         password,
//         rememberMe,
//       });

//       if (!data?.success) throw new Error(data?.message || "Login failed");

//       return data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Login failed.");
//     }
//   },

//   /** ----------------------------------------
//    * Verify login OTP
//    * ---------------------------------------- */
//   verifyLoginOtp: async ({ email, otp }) => {
//     try {
//       const { data } = await authApi.post("/auth/login/verify-otp", {
//         email: email.toLowerCase().trim(),
//         otp,
//       });

//       if (!data?.success)
//         throw new Error(data?.message || "OTP verification failed");

//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "OTP verification failed."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Set new password after temporary login
//    * ---------------------------------------- */
//   setNewPassword: async ({ userId, newPassword }) => {
//     try {
//       const { data } = await authApi.post("/auth/password/set-password", {
//         userId,
//         newPassword,
//       });

//       if (!data?.success)
//         throw new Error(data?.message || "Failed to set password");

//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Failed to set password."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Identity verification (Face ID + documents)
//    * ---------------------------------------- */
//   verifyIdentity: async (formData) => {
//     try {
//       const { data } = await authApi.post("/auth/face/verify", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!data) throw new Error("No response from server");

//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Identity verification failed."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Forgot password → send OTP
//    * ---------------------------------------- */
//   sendResetPasswordOtp: async (email) => {
//     try {
//       const { data } = await authApi.post(
//         "/auth/password/reset-password",
//         { email: email.toLowerCase().trim() }
//       );

//       if (!data?.success)
//         throw new Error(data?.message || "Failed to send OTP");

//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Failed to send reset OTP."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Verify OTP & reset password
//    * ---------------------------------------- */
//   verifyResetPasswordOtp: async ({ email, otp, password }) => {
//     try {
//       const { data } = await authApi.post("/auth/password/verify-otp", {
//         email: email.toLowerCase().trim(),
//         otp,
//         password,
//       });

//       if (!data?.success)
//         throw new Error(data?.message || "Failed to reset password");

//       return data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Failed to reset password."
//       );
//     }
//   },

//   /** ----------------------------------------
//    * Logout
//    * ---------------------------------------- */
//   logout: async () => {
//     try {
//       await authApi.post("/auth/logout");
//       return { success: true };
//     } catch (error) {
//       throw new Error("Logout failed.");
//     }
//   },
// };








