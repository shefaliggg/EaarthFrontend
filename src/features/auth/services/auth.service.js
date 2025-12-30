// src/features/auth/services/auth.service.js
import { axiosConfig } from "../config/axiosConfig";

export const authService = {
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

    // Backend should set cookies here
    return data?.data?.user || null;
  },

  // GET CURRENT USER
  getCurrentUser: async () => {
    try {
      const { data } = await axiosConfig.get("/auth/me");
      return data?.data?.user || null;
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
    const { data } = await axiosConfig.post("/auth/qr/generate/web");
    
    if (!data?.success) {
      throw new Error(data?.message || "Failed to generate QR");
    }
    
    return data?.data || data;
  },

  /**
   * Generate QR for mobile login
   */
  generateMobileQr: async () => {
    const { data } = await axiosConfig.post("/auth/qr/generate/mobile");
    
    if (!data?.success) {
      throw new Error(data?.message || "Failed to generate QR");
    }
    
    return data?.data || data;
  },

  /**
   * Get QR status (for polling fallback)
   */
  getQrStatus: async (qrId) => {
    const { data } = await axiosConfig.get(`/auth/qr/status/${qrId}`);
    return data?.data || data;
  },
};

export default authService;