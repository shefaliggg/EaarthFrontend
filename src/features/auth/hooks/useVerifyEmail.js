import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const useVerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [inviteData, setInviteData] = useState(null);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyInvite = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid invitation link.');
        return;
      }

      try {
        const response = await authService.verifyInviteLink(token, email);

        if (response.success) {
          setStatus('success');
          setInviteData({
            email: response.data?.email || email,
            userType: response.data?.userType,
            isLinkVerified: response.data?.isLinkVerified,
            firstLogin: response.data?.firstLogin,
          });

          setTimeout(() => {
            navigate('/auth/temp-login', {
              replace: true,
              state: {
                email: response.data?.email || email,
                fromInvite: true,
              },
            });
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed.');
      }
    };

    verifyInvite();
  }, [searchParams, navigate]);

  return { status, message, inviteData };
};