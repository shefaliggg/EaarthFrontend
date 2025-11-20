// import { useState, useEffect, useRef } from 'react';
// import { authApi } from '../api/auth.api';

// export const useOTPVerification = (onSuccess, onError) => {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [canResend, setCanResend] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const inputRefs = useRef([]);

//   useEffect(() => {
//     if (countdown > 0 && !canResend) {
//       const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
//       return () => clearInterval(timer);
//     } else if (countdown === 0) {
//       setCanResend(true);
//     }
//   }, [countdown, canResend]);

//   const handleInput = (index, value) => {
//     const newOtp = [...otp];
//     newOtp[index] = value.slice(-1);
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleBackspace = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = async (email) => {
//     const otpValue = otp.join('');
//     if (otpValue.length !== 6) {
//       setError('Please enter all 6 digits');
//       return;
//     }

//     setError('');
//     setLoading(true);
//     try {
//       const response = await authApi.verifyLoginOtp(email, otpValue);
//       if (response.success) {
//         onSuccess(response.data?.user);
//       }
//     } catch (err) {
//       const errorMsg = err.message;
//       setError(errorMsg);
//       setOtp(['', '', '', '', '', '']);
//       onError?.(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async (email) => {
//     setCanResend(false);
//     setCountdown(30);
//     setError('');
//     try {
//       await authApi.sendResetPasswordOtp(email);
//     } catch (err) {
//       setError('Failed to resend OTP');
//       onError?.(err.message);
//     }
//   };

//   return {
//     otp,
//     setOtp,
//     loading,
//     error,
//     setError,
//     canResend,
//     countdown,
//     inputRefs,
//     handleInput,
//     handleBackspace,
//     handleSubmit,
//     handleResend,
//   };
// };