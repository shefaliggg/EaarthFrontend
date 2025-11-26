import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useSetPassword = (onSuccess) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[!@#$%^&*]/.test(pwd);

  const handleSubmit = async (userId) => {
    setError('');

    if (!userId) {
      setError('User ID is missing. Please try again.');
      return false;
    }

    if (password !== confirm) {
      setError('Passwords do not match!');
      return false;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be 8+ characters with uppercase, lowercase, number, and special character'
      );
      return false;
    }

    setLoading(true);
    try {
      const response = await authService.setNewPassword({ userId, newPassword: password });

      if (response.success) {
        setSuccess(true);

        setTimeout(() => {
          onSuccess?.({ 
            userId, 
            email: response.data?.email,
            passwordSet: true 
          });
        }, 1200);

        return true;
      }

      setError(response.message || 'Unable to set password.');
      return false;
    } catch (err) {
      const msg = err.message || 'Failed to set password';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    error,
    setError,
    success,
    handleSubmit,
  };
};