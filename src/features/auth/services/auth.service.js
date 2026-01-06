// src/features/auth/services/auth.service.js
import { axiosConfig } from "../config/axiosConfig";

export const authService = {
  verifyInviteLink: async (token, email) => {
    try {
      const { data } = await axiosConfig.get("/invite/verify", {
        params: { token, email: email.toLowerCase().trim() },
      });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Invitation link is invalid or expired."
      );
    }
  },

  temporaryLogin: async ({ email, password }) => {
    try {
      const { data } = await axiosConfig.post("/auth/login/temporary", {
        email: email.toLowerCase().trim(),
        password,
      });

      if (!data?.success)
        throw new Error(data?.message || "Temporary login failed");

      return {
        success: true,
        userId: data.data?.userId || data.userId,
        email: data.data?.email || email,
        message: data.message,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Temporary login failed."
      );
    }
  },

  /**
   * Login - Verify credentials and send OTP
   */
  login: async ({ email, password, rememberMe = false }) => {
    const { data } = await axiosConfig.post("/auth/login", {
      email: email.toLowerCase().trim(),
      password,
      rememberMe,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Login failed");
    }

    return data;
  },

  // VERIFY OTP
  verifyLoginOtp: async ({ email, otp }) => {
    const { data } = await axiosConfig.post("/auth/login/verify-otp", {
      email: email.toLowerCase().trim(),
      otp,
    });

    if (!data?.success) {
      throw new Error(data?.message || "OTP verification failed");
    }
    return data?.data?.user || null;
  },

  // GET CURRENT USER
  getCurrentUser: async () => {
    try {
      const response = await axiosConfig.get("/auth/me");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) return null;
      throw error;
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await axiosConfig.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
    return { success: true };
  },

  // QR LOGIN (cookies set in backend)
  getUserAndSetCookies: async ({ accessToken, refreshToken, userId }) => {
    const { data } = await axiosConfig.post("/auth/set-user-credential", {
      accessToken,
      refreshToken,
      userId,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Failed to set credentials");
    }

    return data?.data?.user || null;
  },

  /**
   * Generate QR for web login
   */
  generateWebQr: async () => {
    try {
      const { data } = await axiosConfig.get("/auth/qr-code/web/init");
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to generate QR.");
    }
  },

  /**
   * Generate QR for mobile login
   */
  generateMobileQr: async () => {
    try {
      const { data } = await axiosConfig.get("/auth/qr-code/mobile/init");
      console.log("generate mobile qr response in auth service", data);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to generate QR.");
    }
  },

  /**
   * Get QR status (for polling fallback)
   */
  getQrStatus: async (qrId) => {
    const { data } = await axiosConfig.get(`/auth/qr-code/status/${qrId}`);
    return data?.data || data;
  },
};

export default authService;
