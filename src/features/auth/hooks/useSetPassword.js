// import { useState } from 'react';
// import { authApi } from '../api/auth.api';

// export const useSetPassword = (onSuccess, onError) => {
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const validatePassword = (pwd) =>
//     pwd.length >= 8 &&
//     /[A-Z]/.test(pwd) &&
//     /[a-z]/.test(pwd) &&
//     /[0-9]/.test(pwd) &&
//     /[!@#$%^&*]/.test(pwd);

//   const handleSubmit = async (userId, email) => {
//     setError('');

//     if (password !== confirm) {
//       setError('Passwords do not match!');
//       return false;
//     }

//     if (!validatePassword(password)) {
//       setError(
//         'Password must be 8+ characters with uppercase, lowercase, number, and special character'
//       );
//       return false;
//     }

//     setLoading(true);
//     try {
//       const response = await authApi.setNewPassword(userId, password);

//       if (response.success) {
//         setSuccess(true);

//         setTimeout(() => {
//           onSuccess?.({ userId, email, passwordSet: true });
//         }, 1200);

//         return true;
//       }

//       setError(response.message || 'Unable to set password.');
//       return false;

//     } catch (err) {
//       const msg = err.message || 'Something went wrong';
//       setError(msg);
//       onError?.(msg);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     password,
//     setPassword,
//     confirm,
//     setConfirm,
//     showPassword,
//     setShowPassword,
//     showConfirm,
//     setShowConfirm,
//     loading,
//     error,
//     setError,
//     success,
//     handleSubmit,
//   };
// };




