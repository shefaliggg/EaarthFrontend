// src/features/auth/hooks/useOTPVerification.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyLoginOtpThunk, loginUserThunk } from "../store/user.thunks";
import { clearUserError } from "../store/user.slice";
import { toast } from "sonner";

export const useOTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, rememberMe, password, devOtp } = location.state || {};

  const { isLoggingIn, error } = useSelector((state) => state.user);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please login again.");
      navigate("/auth/login", { replace: true });
    }
  }, [email, navigate]);

  // Auto-fill OTP in development
  useEffect(() => {
    if (devOtp && import.meta.env.VITE_APP_ENV === "development") {
      const otpArray = devOtp.toString().split("");
      if (otpArray.length === 6) {
        setOtp(otpArray);
        console.log("🔧 Dev OTP auto-filled:", devOtp);
      }
    }
  }, [devOtp]);

  // Countdown timer
  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) setCanResend(true);
  }, [countdown, canResend]);

  // OTP input handling
  const handleInput = useCallback(
    (index, value) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    },
    [otp]
  );

  const handleBackspace = useCallback((index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
  }, []);

  // Verify OTP
  const handleSubmit = useCallback(async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    dispatch(clearUserError());

    try {
      const resultAction = await dispatch(
        verifyLoginOtpThunk({ email, otp: otpValue })
      );

      if (verifyLoginOtpThunk.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/home", { replace: true });
      } else {
        toast.error(resultAction.payload || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.message || "OTP verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }, [dispatch, otp, email, navigate]);

  // Resend OTP
  const handleResend = useCallback(async () => {
    if (!canResend || !password) {
      toast.warning("Please wait before resending");
      return;
    }

    setCanResend(false);
    setCountdown(30);
    setOtp(["", "", "", "", "", ""]);

    try {
      const resultAction = await dispatch(
        loginUserThunk({ email, password, rememberMe })
      );

      if (loginUserThunk.fulfilled.match(resultAction)) {
        toast.success("OTP resent successfully");
        inputRefs.current[0]?.focus();
      } else {
        toast.error("Failed to resend OTP");
        setCanResend(true);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend OTP");
      setCanResend(true);
    }
  }, [dispatch, email, password, rememberMe, canResend]);

  return {
    otp,
    setOtp,
    loading: isLoggingIn,
    error,
    canResend,
    countdown,
    inputRefs,
    handleInput,
    handleBackspace,
    handlePaste,
    handleSubmit,
    handleResend,
  };
};

export default useOTPVerification;
