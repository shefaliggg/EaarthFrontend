import { useState, useCallback } from 'react';
import { authService } from '../services/auth.service';

export const useResetPassword = (onSuccess, onError) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = useCallback((pwd) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[!@#$%^&*]/.test(pwd)
    );
  }, []);

  const handleSubmit = useCallback(async (email) => {

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return false;
    }

    if (!email || !email.trim()) {
      setError('Email is required');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!validatePassword(newPassword)) {
      setError(
        'Password must be 8+ characters with uppercase, lowercase, number, and special character (!@#$%^&*)'
      );
      return false;
    }

    setError('');
    setLoading(true);

    try {
      console.log('🔐 Submitting password reset:', {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
        passwordLength: newPassword.length
      });

      // Call the authService method
      const response = await authService.verifyResetPasswordOtp({
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
        password: newPassword,
      });

      console.log('Password reset response:', response);

      if (response.success) {
        setSuccess(true);

        setTimeout(() => {
          onSuccess?.(response);
        }, 1500);

        return true;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (err) {
      console.error('❌ Password reset error:', err);

      const errorMsg = err.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [otp, newPassword, confirmPassword, validatePassword, onSuccess, onError]);

  return {
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    setError,
    success,
    handleSubmit,
  };
};