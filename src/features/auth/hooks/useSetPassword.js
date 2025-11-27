import { useState } from "react";
import { authService } from "../services/auth.service";

const useSetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (userId, email) => {
    if (!password || !confirm) {
      setError("Please fill in all password fields.");
      return false;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }

    if (!validatePassword(password)) {
      setError("Password must meet all requirements.");
      return false;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authService.setNewPassword({
        userId,
        newPassword: password,
      });

      if (response?.success) {
        setSuccess(true);
        return { success: true, email, userId };
      }

      return false;
    } catch (err) {
      const errorMsg = err?.message || "Failed to set password.";
      setError(errorMsg);
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
    success,
    handleSubmit,
  };
};

export default useSetPassword;
