import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../components/context/AuthContext';
import { ROUTES } from '../../../shared/constants/routes';

const useIdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [faceMatchScore, setFaceMatchScore] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const handleVerifyIdentity = useCallback(async ({ idFile, selfieFile }) => {
    try {
      setLoading(true);
      setError('');

      if (!idFile || !selfieFile) {
        throw new Error('Both ID document and selfie are required');
      }

      const userId = location.state?.userId;
      const email = location.state?.email;

      if (!userId) {
        throw new Error('Session expired. Please log in again.');
      }

      // Build FormData
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('idDocument', idFile);
      formData.append('selfiePhoto', selfieFile);

      console.log('Submitting identity verification:', {
        userId,
        idDocument: idFile.name,
        selfiePhoto: selfieFile.name,
      });

      // Call authService.verifyIdentity
      const response = await authService.verifyIdentity(formData);

      console.log('Verification response:', response);

      const confidence = response?.confidence || 0;
      setFaceMatchScore(confidence);

      // Update user context if returned
      if (response?.user) {
        updateUser(response.user);
      }

      // Success → Navigate to Accept Terms
      if (response?.verified) {
        setTimeout(() => {
          navigate(ROUTES.AUTH.ACCEPT_TERMS, {
            replace: true,
            state: {
              message: 'Identity verified successfully!',
              confidence,
              email,
              userId,
            },
          });
        }, 500);
      } else {
        setError(response?.message || 'Face verification failed. Your account is under review.');
      }

    } catch (err) {
      console.error('Identity verification error:', err);
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      setFaceMatchScore(0);
    } finally {
      setLoading(false);
    }
  }, [location.state, updateUser, navigate]);

  return {
    handleVerifyIdentity,
    loading,
    error,
    faceMatchScore,
    setError,
  };
};

export default useIdentityVerification;



