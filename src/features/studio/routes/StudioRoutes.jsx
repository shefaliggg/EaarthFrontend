import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import StudioLayout from '../../../layouts/StudioLayout';
import { Navigate } from 'react-router-dom';
import StudioDashboard from '../pages/StudioDashboard';

// const LoginForm = lazy(() => import('../components/forms/LoginForm'));
// const TempLogin = lazy(() => import('../components/forms/TempLogin'));
// const ResetPassword = lazy(() => import('../components/forms/ResetPassword'));

const StudioRoutes = {
  path: '/studio',
  element: (
    <ErrorBoundary>
      <StudioLayout/>
    </ErrorBoundary>
  ),
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <StudioDashboard/> },
    { path: 'projects', element: <StudioDashboard/> },
    { path: 'projects/1', element: <StudioDashboard/> },
    { path: 'settings', element: <StudioDashboard/> },
    { path: 'settings/account', element: <StudioDashboard/> },
  ],
};

export default StudioRoutes;
