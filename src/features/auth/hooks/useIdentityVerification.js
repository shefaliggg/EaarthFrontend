import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useIdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyIdentity = async ({ userId, idDocument, selfiePhoto }) => {
    try {
      setLoading(true);
      setError('');
      setVerificationResult(null);

      if (!idDocument || !selfiePhoto) {
        throw new Error('Both ID document and selfie are required');
      }

      if (!userId) {
        throw new Error('User ID is missing');
      }

      // Build FormData
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('idDocument', idDocument);
      formData.append('selfiePhoto', selfiePhoto);

      console.log('Submitting identity verification:', {
        userId,
        idDocument: idDocument.name,
        selfiePhoto: selfiePhoto.name,
      });

      const response = await authService.verifyIdentity(formData);

      console.log('Verification response:', response);

      const result = {
        verified: response?.verified || false,
        confidence: response?.confidence || 0,
        message: response?.message || '',
        user: response?.user || null,
      };

      setVerificationResult(result);

      return result;
    } catch (err) {
      console.error('Identity verification error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Verification failed. Please try again.';
      setError(errorMessage);
      setVerificationResult({
        verified: false,
        confidence: 0,
        message: errorMessage,
      });
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