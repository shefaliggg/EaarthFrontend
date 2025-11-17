import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import DashboardLayout from '../../../layouts/DashboardLayout';
import LoginForm from '../../auth/components/forms/LoginForm';
import { Navigate } from 'react-router-dom';

// const LoginForm = lazy(() => import('../components/forms/LoginForm'));
// const TempLogin = lazy(() => import('../components/forms/TempLogin'));
// const ResetPassword = lazy(() => import('../components/forms/ResetPassword'));

const StudioRoutes = {
  path: '/studio',
  element: (
    <ErrorBoundary>
      <DashboardLayout/>
    </ErrorBoundary>
  ),
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    // { path: '', element: <LoginForm /> },
    // { path: 'temp-login', element: <TempLogin /> },
    // { path: 'reset-password', element: <ResetPassword /> },
  ],
};

export default StudioRoutes;
