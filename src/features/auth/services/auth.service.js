import { axiosConfig } from "../config/axiosConfig";

export const authService = {
  // Verify invite link
  verifyInviteLink: async (token, email) => {
    try {
      const { data } = await axiosConfig.get('/invite/verify', {
        params: { token, email: email.toLowerCase() },
      });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Invitation link is invalid or expired.'
      );
    }
  },

  // Temporary login - NO TOKEN GENERATION
  temporaryLogin: async ({ email, password }) => {
    try {
      const { data } = await axiosConfig.post('/auth/login/temporary', {
        email: email.toLowerCase().trim(),
        password,
      });

      if (!data?.success) throw new Error(data?.message || 'Temporary login failed');
      
      return {
        success: true,
        userId: data.data?.userId || data.userId,
        email: data.data?.email || email,
        message: data.message,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Temporary login failed.'
      );
    }
  },

  // Normal login - sends OTP (NO TOKEN YET)
  login: async ({ email, password, rememberMe = false }) => {
    try {
      const { data } = await axiosConfig.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
        rememberMe,
      });

      if (!data?.success) throw new Error(data?.message || 'Login failed');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Login failed.'
      );
    }
  },

  // Verify OTP after login - GENERATES TOKENS HERE
  verifyLoginOtp: async ({ email, otp }) => {
    try {
      const { data } = await axiosConfig.post('/auth/login/verify-otp', {
        email: email.toLowerCase().trim(),
        otp,
      });

      if (!data?.success) throw new Error(data?.message || 'OTP verification failed');
      
      // Tokens are set in cookies by backend
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'OTP verification failed.'
      );
    }
  },

  // Set new password - NO TOKEN GENERATION
  setNewPassword: async ({ userId, newPassword }) => {
    try {
      const { data } = await axiosConfig.post('/auth/password/set-password', {
        userId,
        newPassword,
      });

      if (!data?.success) throw new Error(data?.message || 'Failed to set password');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to set password.'
      );
    }
  },

  // Face verification - NO TOKEN GENERATION
  verifyIdentity: async (formData) => {
    try {
      const { data } = await axiosConfig.post('/auth/face/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data) throw new Error('No response from server');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Identity verification failed.'
      );
    }
  },

 
 

  // Forgot password - send OTP
  sendResetPasswordOtp: async (email) => {
    try {
      const { data } = await axiosConfig.post('/auth/password/reset-password', {
        email: email.toLowerCase().trim(),
      });

      if (!data?.success) throw new Error(data?.message || 'Failed to send OTP');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to send reset OTP.'
      );
    }
  },

  // Verify OTP and reset password
  verifyResetPasswordOtp: async ({ email, otp, password }) => {
    try {
      const { data } = await axiosConfig.post('/auth/password/verify-otp', {
        email: email.toLowerCase().trim(),
        otp,
        password,
      });

      if (!data?.success) throw new Error(data?.message || 'Failed to reset password');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to reset password.'
      );
    }
  },

  // Get current user (requires valid access token)
  getCurrentUser: async () => {
    try {
      const { data } = await axiosConfig.get('/auth/me');
      if (data?.success) {
        return data.data?.user || data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    try {
      await axiosConfig.post('/auth/logout');
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed.');
    }
  },
};