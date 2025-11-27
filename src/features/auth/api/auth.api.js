// import { axiosConfig } from "../config/axiosConfig";

// // Centralized error handler
// const handleError = (error, fallback = "Something went wrong.") => {
//   throw new Error(error?.response?.data?.message || fallback);
// };

// // Helper to clean email
// const cleanEmail = (email) => email?.toLowerCase().trim();

// export const authApi = {
//   /** ----------------------------------------
//    * Verify Invitation Link
//    -----------------------------------------*/
//   verifyInviteLink: async (token, email) => {
//     try {
//       const { data } = await axiosConfig.get("/invite/verify", {
//         params: { token, email: cleanEmail(email) },
//       });
//       return data;
//     } catch (error) {
//       handleError(error, "Invitation link is invalid or expired.");
//     }
//   },

//   /** ----------------------------------------
//    * TEMPORARY LOGIN (using temp password)
//    -----------------------------------------*/
//   temporaryLogin: async ({ email, password }) => {
//     try {
//       const cleaned = cleanEmail(email);

//       const { data } = await axiosConfig.post("/auth/login/temporary", {
//         email: cleaned,
//         password,
//       });

//       if (!data?.success) throw new Error(data?.message || "Temporary login failed");

//       return {
//         success: true,
//         userId: data?.data?.userId,
//         email: data?.data?.email || cleaned,
//         data,
//       };
//     } catch (error) {
//       handleError(error, "Temporary login failed.");
//     }
//   },

//   /** ----------------------------------------
//    * NORMAL LOGIN (send OTP)
//    -----------------------------------------*/
//   login: async ({ email, password, rememberMe = false }) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/login", {
//         email: cleanEmail(email),
//         password,
//         rememberMe,
//       });

//       if (!data?.success) throw new Error(data?.message || "Login failed");
//       return data;
//     } catch (error) {
//       handleError(error, "Login failed.");
//     }
//   },

//   /** ----------------------------------------
//    * VERIFY LOGIN OTP
//    -----------------------------------------*/
//   verifyLoginOtp: async ({ email, otp }) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/login/verify-otp", {
//         email: cleanEmail(email),
//         otp,
//       });

//       if (!data?.success) throw new Error(data?.message || "OTP verification failed");
//       return data;
//     } catch (error) {
//       handleError(error, "OTP verification failed.");
//     }
//   },

//   /** ----------------------------------------
//    * SET NEW PASSWORD (after temp login)
//    -----------------------------------------*/
//   setNewPassword: async ({ userId, newPassword }) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/password/set-password", {
//         userId,
//         newPassword,
//       });

//       if (!data?.success) throw new Error(data?.message || "Failed to set password");
//       return data;
//     } catch (error) {
//       handleError(error, "Failed to set password.");
//     }
//   },

//   /** ----------------------------------------
//    * FACE VERIFICATION
//    -----------------------------------------*/
//   verifyIdentity: async (formData) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/face/verify", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!data) throw new Error("No response from server");
//       return data;
//     } catch (error) {
//       handleError(error, "Identity verification failed.");
//     }
//   },

//   /** ----------------------------------------
//    * SEND RESET PASSWORD OTP
//    -----------------------------------------*/
//   sendResetPasswordOtp: async (email) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/password/reset-password", {
//         email: cleanEmail(email),
//       });

//       if (!data?.success) throw new Error(data?.message || "Failed to send OTP");
//       return data;
//     } catch (error) {
//       handleError(error, "Failed to send reset OTP.");
//     }
//   },

//   /** ----------------------------------------
//    * VERIFY RESET OTP + SET NEW PASSWORD
//    -----------------------------------------*/
//   verifyResetPasswordOtp: async ({ email, otp, password }) => {
//     try {
//       const { data } = await axiosConfig.post("/auth/password/verify-otp", {
//         email: cleanEmail(email),
//         otp,
//         password,
//       });

//       if (!data?.success) throw new Error(data?.message || "Failed to reset password");
//       return data;
//     } catch (error) {
//       handleError(error, "Failed to reset password.");
//     }
//   },

//   /** ----------------------------------------
//    * GET CURRENT USER
//    -----------------------------------------*/
//   getCurrentUser: async () => {
//     try {
//       const { data } = await axiosConfig.get("/auth/me");
//       return data?.user || null;
//     } catch (error) {
//       if (error?.response?.status === 401) return null; // auto logout silently
//       throw error;
//     }
//   },

//   /** ----------------------------------------
//    * LOGOUT
//    -----------------------------------------*/
//   logout: async () => {
//     try {
//       await axiosConfig.post("/auth/logout");
//       return { success: true };
//     } catch (error) {
//       handleError(error, "Logout failed.");
//     }
//   },
// };
