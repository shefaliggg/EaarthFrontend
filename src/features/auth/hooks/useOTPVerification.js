import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';

/**
 * Hook for OTP verification
 * Step 2: Verifies OTP and authenticates user
 */
export const useOTPVerification = (onSuccess, onError) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleInput = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (email) => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return false;
    }

    setError('');
    setLoading(true);
    
    try {
      // Call verify-otp endpoint which sets auth cookies
      const response = await authService.verifyLoginOtp({ 
        email, 
        otp: otpValue 
      });

      if (response?.success) {
        // User is now authenticated, cookies are set
        onSuccess?.(response.data?.user);
        return true;
      }

      return false;
    } catch (err) {
      const errorMsg = err?.message || 'Invalid verification code';
      setError(errorMsg);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      onError?.(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (email, password, rememberMe) => {
    setCanResend(false);
    setCountdown(30);
    setError('');
    setOtp(['', '', '', '', '', '']);
    
    try {
      // Resend by calling login again
      await authService.login({ email, password, rememberMe });
    } catch (err) {
      setError('Failed to resend OTP');
      setCanResend(true);
      onError?.(err?.message);
    }
  };

  return {
    otp,
    setOtp,
    loading,
    error,
    setError,
    canResend,
    countdown,
    inputRefs,
    handleInput,
    handleBackspace,
    handleSubmit,
    handleResend,
  };
};