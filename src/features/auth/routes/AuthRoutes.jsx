import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import ErrorBoundary from '../../../shared/components/ErrorBoundary';

const LoginForm = lazy(() => import('../components/forms/LoginForm'));
// const TempLogin = lazy(() => import('../components/forms/TempLogin'));
// const ResetPassword = lazy(() => import('../components/forms/ResetPassword'));

const AuthRoutes = {
  path: '/auth',
  element: (
    <ErrorBoundary>
      <AuthLayout />
    </ErrorBoundary>
  ),
  children: [
    { path: 'login', element: <LoginForm /> },
      {
        path: "/temp-login",
        element: <TemporaryLogin/>,
      },
      {
        path: "/set-password",
        element: <SetPassword/>,
      },
      {
        path: "terms",
        element: <TermsAndConditions/>,
      },
      {
        path: "identity-verification",
        element: <IdentityVerificationScreen/>,
      },
      {
        path: "otp-verification",
        element: <OTPVerification/>,
      },
      {
        path: "create-password",
        element: <CreatePasswordScreenUI/>,
      },
    // { path: 'temp-login', element: <TempLogin /> },
    // { path: 'reset-password', element: <ResetPassword /> },
  ],
};

export default AuthRoutes;
