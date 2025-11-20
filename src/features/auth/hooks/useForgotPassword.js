import { useState, useCallback } from 'react';
import { authApi } from '../api/auth.api';

export const useForgotPassword = (onSuccess, onError) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!email) {
      setError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return false;
    }

    setError('');
    setLoading(true);

    try {
      await authApi.sendResetPasswordOtp(email);

      setSuccess(true);

      // Delay finishing logic without UI delay
      setTimeout(() => {
        onSuccess?.({ email });
      }, 1500);

      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to send OTP. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [email, onSuccess, onError, validateEmail]);

  return {
    email,
    setEmail,
    loading,
    error,
    setError,
    success,
    handleSubmit,
  };
};
