import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import ErrorBoundary from '../../../shared/components/ErrorBoundary';
import { TemporaryLogin } from '../pages/TemporaryLogin';
import SetPassword from '../pages/SetPassword';
import TermsAndConditions from '../pages/TermsAndConditions';
import IdentityVerification from '../pages/IdentityVerification';
import OTPVerification from '../pages/OTPVerification';
import CreatePassword from '../pages/ForgotPassword';
import Login from '../pages/Login';

const LoginForm = lazy(() => import('../components/forms/LoginForm'));

const AuthRoutes = {
  path: '/auth',
  element: (
    <ErrorBoundary>
      <AuthLayout />
    </ErrorBoundary>
  ),
  children: [
    { path: 'login', element: <Login /> },

    { path: 'temp-login', element: <TemporaryLogin /> },

    { path: 'set-password', element: <SetPassword /> },

    { path: 'terms', element: <TermsAndConditions /> },

    { path: 'identity-verification', element: <IdentityVerification /> },

    { path: 'otp-verification', element: <OTPVerification /> },

    { path: 'create-password', element: <CreatePassword /> },
  ],
};

export default AuthRoutes;
