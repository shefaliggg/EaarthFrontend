import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const StudioDashboard = lazy(() => import('../pages/StudioDashboard'));

const StudioRoutes = {
  path: '/studio',
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












