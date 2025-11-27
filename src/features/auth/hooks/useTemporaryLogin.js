import { useState } from "react";
import { authService } from "../services/auth.service";

const useTemporaryLogin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (email) => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authService.temporaryLogin({
        email,
        password,
      });

      if (response?.success) {
        return {
          success: true,
          userId: response.userId || response.data?.userId,
          email: response.email || response.data?.email,
        };
      }

      return false;
    } catch (err) {
      const errorMsg =
        err?.message || "Temporary login failed. Please try again.";
      setError(errorMsg);
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
    handleSubmit,
  };
};

export default useTemporaryLogin;
