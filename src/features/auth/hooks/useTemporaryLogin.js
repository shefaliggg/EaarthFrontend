// import { useState } from 'react';
// import { authApi } from '../api/auth.api';

// export const useTemporaryLogin = (onSuccess, onError) => {
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (email) => {
//     if (!password) {
//       setError('Password is required');
//       return false;
//     }

//     setError('');
//     setLoading(true);

//     try {
//       const res = await authApi.temporaryLogin(email, password);

//       if (res.success) {
//         onSuccess?.({
//           userId: res.data.userId,
//           email,
//           isTemporary: true,
//         });

//         return true;
//       }

//       setError(res.message || 'Login failed');
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
//     showPassword,
//     setShowPassword,
//     loading,
//     error,
//     setError,
//     handleSubmit,
//   };
// };
