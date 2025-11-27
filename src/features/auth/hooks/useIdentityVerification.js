import { useState } from "react";
import { authService } from "../services/auth.service";

const useIdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyIdentity = async ({ userId, idFile, selfieFile }) => {
    try {
      setLoading(true);
      setError("");
      setVerificationResult(null);

      if (!idFile || !selfieFile) {
        throw new Error("Both ID document and selfie are required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Build FormData
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("idDocument", idFile);
      formData.append("selfiePhoto", selfieFile);

      console.log("Submitting identity verification:", {
        userId,
        idDocument: idFile.name,
        selfiePhoto: selfieFile.name,
      });

      // Call authService.verifyIdentity
      const response = await authService.verifyIdentity(formData);
      console.log("Verification response:", response);

      const result = {
        verified: response?.verified || false,
        confidence: response?.confidence || 0,
        message: response?.message || "",
        user: response?.user || null,
      };

      setVerificationResult(result);

      if (!result.verified) {
        setError(
          result.message ||
            "Face verification failed. Your account is under review."
        );
      }

      return result;
    } catch (err) {
      console.error("Identity verification error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed. Please try again.";
      setError(errorMessage);
      setVerificationResult({ verified: false, confidence: 0 });
      return { verified: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleVerifyIdentity,
    loading,
    error,
    verificationResult,
    setError,
  };
};

export default useIdentityVerification;
