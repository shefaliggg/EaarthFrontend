// import { useState } from 'react';
// import { authApi } from '../api/auth.api';

// export const useResetPassword = (onSuccess, onError) => {
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const validatePassword = (pwd) => {
//     return (
//       pwd.length >= 8 &&
//       /[A-Z]/.test(pwd) &&
//       /[a-z]/.test(pwd) &&
//       /[0-9]/.test(pwd) &&
//       /[!@#$%^&*]/.test(pwd)
//     );
//   };

//   const handleSubmit = async (email) => {
//     setError('');

//     if (!otp || otp.length !== 6) {
//       setError('Please enter valid OTP');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       setError(
//         'Password must be 8+ characters with uppercase, lowercase, number, and special character'
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await authApi.verifyResetPasswordOtp(email, otp, newPassword);
//       if (response.success) {
//         setSuccess(true);
//         setTimeout(() => {
//           onSuccess();
//         }, 2000);
//       }
//     } catch (err) {
//       const errorMsg = err.message;
//       setError(errorMsg);
//       onError?.(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     otp,
//     setOtp,
//     newPassword,
//     setNewPassword,
//     confirmPassword,
//     setConfirmPassword,
//     showNewPassword,
//     setShowNewPassword,
//     showConfirmPassword,
//     setShowConfirmPassword,
//     loading,
//     error,
//     setError,
//     success,
//     handleSubmit,
//   };
// };








