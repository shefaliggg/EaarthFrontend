// src/features/auth/services/auth.service.js
import { axiosConfig } from "../config/axiosConfig";

export const authService = {
  /**
   * ✅ GET CURRENT USER - For persistent login
   * Uses accessToken from cookies
   */
  getCurrentUser: async () => {
    try {
      console.log("🔍 Fetching current user...");
      const { data } = await axiosConfig.get("/auth/me");
      
      console.log("📦 Response data:", data);
      
      if (!data?.success) {
        console.log("⚠️  No success flag in response");
        return null;
      }

      console.log("✅ User fetched successfully:", data?.data?.user?.email);
      return data?.data?.user || null;
    } catch (error) {
      console.error("❌ getCurrentUser error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data
      });
      
      // ✅ Return null for any auth errors (401, 403, 404, 500)
      if (error.response?.status === 401 || 
          error.response?.status === 403 ||
          error.response?.status === 404 ||
          error.response?.status === 500) {
        console.log("ℹ️  No valid session - returning null");
        return null;
      }
      
      throw error;
    }
  },

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

  logout: async () => {
    try {
      await axiosConfig.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
    return { success: true };
  },

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

  generateWebQr: async () => {
    try {
      const { data } = await axiosConfig.get("/auth/qr-code/web/init");
      return {
        qrId: data.qrId,
        expiresAt: data.expiresAt,
        socketRoom: data.socketRoom,
      };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to generate QR."
      );
    }
  },

  generateMobileQr: async () => {
    try {
      const { data } = await axiosConfig.get("/auth/qr-code/mobile/init");
      return {
        qrId: data.qrId,
        expiresAt: data.expiresAt,
        socketRoom: data.socketRoom,
      };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to generate QR."
      );
    }
  },

  getQrStatus: async (qrId) => {
    const { data } = await axiosConfig.get(`/auth/qr-code/status/${qrId}`);
    return data;
  },

  temporaryLogin: async ({ email, password }) => {
    const { data } = await axiosConfig.post("/auth/login/temporary", {
      email: email.toLowerCase().trim(),
      password,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Temporary login failed");
    }

    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await axiosConfig.post("/auth/password/forgot", {
      email: email.toLowerCase().trim(),
    });

    if (!data?.success) {
      throw new Error(data?.message || "Failed to send reset email");
    }

    return data;
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const { data } = await axiosConfig.post("/auth/password/reset", {
      email: email.toLowerCase().trim(),
      otp,
      newPassword,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Password reset failed");
    }

    return data;
  },
};

export default authService;