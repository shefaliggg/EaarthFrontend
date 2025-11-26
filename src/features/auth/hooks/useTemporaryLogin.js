import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useTemporaryLogin = (onSuccess) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email) => {
    if (!password || !email) {
      setError('Email and password are required');
      return false;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authService.temporaryLogin({ email, password });

      if (response.success) {
        onSuccess?.({
          userId: response.data?.userId,
          email: response.data?.email,
          isTemporary: true,
          tempPasswordRemoved: response.data?.tempPasswordRemoved,
        });
        return true;
      }

      setError(response.message || 'Login failed');
      return false;
    } catch (err) {
      const msg = err.message || 'Temporary login failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    setError,
    handleSubmit,
  };
};