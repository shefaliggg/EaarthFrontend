// src/features/auth/hooks/useLogin.js
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserThunk } from "../store/user.thunks";
import { clearUserError } from "../store/user.slice";
import { toast } from "sonner";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggingIn, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Clear any previous errors
    dispatch(clearUserError());

    try {
      const resultAction = await dispatch(
        loginUserThunk({ email, password, rememberMe })
      );

      if (loginUserThunk.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        
        console.log("✅ Login successful, navigating to OTP");

        // Navigate to OTP screen with required state
        navigate("/auth/otp-verification", {
          state: {
            email: email.toLowerCase().trim(),
            password, // Keep password for resend OTP
            rememberMe,
            otpSend: response?.data?.otpSend || false,
            devOtp: response?.data?.otp, // Only in development
          },
        });
      } else {
        // Handle error from thunk
        const errorMessage = resultAction.payload || "Login failed";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "An error occurred during login");
    }
  }, [dispatch, email, password, rememberMe, navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    loading: isLoggingIn,
    error,
    handleSubmit,
  };
};

export default useLogin;