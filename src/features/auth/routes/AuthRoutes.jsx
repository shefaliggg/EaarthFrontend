import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import ErrorBoundary from '../../../shared/components/ErrorBoundary';
import Login from '../pages/Login';
// import { TemporaryLogin } from '../pages/TemporaryLogin';
// import SetPassword from '../pages/SetPassword';
// import TermsAndConditions from '../pages/TermsAndConditions';
// import IdentityVerificationScreen from '../pages/IdentityVerification';
// import OTPVerification from '../pages/OTPVerification';
// import CreatePasswordScreenUI from '../pages/ResetPassword';

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
    { path: 'login', element: <Login /> },
      // {
      //   path: "/temp-login",
      //   element: <TemporaryLogin/>,
      // },
      // {
      //   path: "/set-password",
      //   element: <SetPassword/>,
      // },
      // {
      //   path: "terms",
      //   element: <TermsAndConditions/>,
      // },
      // {
      //   path: "identity-verification",
      //   element: <IdentityVerificationScreen/>,
      // },
      // {
      //   path: "otp-verification",
      //   element: <OTPVerification/>,
      // },
      // {
      //   path: "create-password",
      //   element: <CreatePasswordScreenUI/>,
      // },
    // { path: 'temp-login', element: <TempLogin /> },
    // { path: 'reset-password', element: <ResetPassword /> },
  ],
};

export default AuthRoutes;
