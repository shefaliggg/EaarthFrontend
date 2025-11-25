import { useState, useCallback } from 'react';
import { authService } from '../services/auth.service';

export const useLogin = (onSuccess, onError) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ 
        email, 
        password, 
        rememberMe 
      });

      if (response?.success) {
        // The login endpoint only sends OTP, no tokens yet
        // Tokens will be set when OTP is verified
        onSuccess?.({ 
          email, 
          rememberMe,
          otpSend: response.data?.otpSend,
          otp: response.data?.otp // only in dev mode
        });

        return true;
      }

      return false;
    } catch (err) {
      const errorMsg = err?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, onSuccess, onError]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    setError,
    handleSubmit,
  };
};