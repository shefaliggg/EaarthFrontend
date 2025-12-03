import { useState } from 'react';
import { authService } from '../services/auth.service';

const useIdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyIdentity = async ({ userId, idFile, selfieFile }) => {
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('idDocument', idFile);
      formData.append('selfiePhoto', selfieFile);

      // Call the backend API
      const response = await authService.verifyIdentity(formData);

      if (response.verified) {
        setVerificationResult({
          verified: true,
          confidence: response.confidence,
          message: response.message,
          user: response.user,
        });

        return {
          success: true,
          verified: true,
          confidence: response.confidence,
          user: response.user,
        };
      } else {
        setError(response.message || 'Face verification failed. Your account is pending review.');
        setVerificationResult({
          verified: false,
          confidence: response.confidence,
          message: response.message,
          user: response.user,
        });

        return {
          success: false,
          verified: false,
          confidence: response.confidence,
          message: response.message,
        };
      }
    } catch (err) {
      const errorMessage = err.message || 'Identity verification failed. Please try again.';
      setError(errorMessage);
      setVerificationResult({
        verified: false,
        confidence: 0,
        message: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleVerifyIdentity,
    loading,
    error,
    verificationResult,
  };
};

export default useIdentityVerification;