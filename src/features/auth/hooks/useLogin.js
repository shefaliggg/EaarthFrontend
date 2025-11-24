// import { useState, useCallback } from 'react';
// import { authApi } from '../api/auth.api';

// export const useLogin = (onSuccess, onError) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = useCallback(async () => {
//     if (!email || !password) {
//       setError('Email and password are required');
//       return false;
//     }

//     setError('');
//     setLoading(true);

//     try {
//       const response = await authApi.login(email, password);

//       if (response?.success) {
//         onSuccess?.({ email });
//         return true;
//       }

//       return false;
//     } catch (err) {
//       const errorMsg = err?.message || 'Something went wrong';
//       setError(errorMsg);
//       onError?.(errorMsg);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   }, [email, password, onSuccess, onError]);

//   return {
//     email,
//     setEmail,
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




