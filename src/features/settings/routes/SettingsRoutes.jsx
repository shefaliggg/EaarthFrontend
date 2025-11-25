import { lazy } from 'react';
// import ErrorBoundary from '@/shared/components/ErrorBoundary';
// import { Navigate } from 'react-router-dom';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const SettingsDashboard = lazy(() => import('@/features/settings/pages/SettingsDashboard'));

const SettingsRoutes = {
  path: "settings",
  children: [
    { index: true, element: <SettingsDashboard /> },
    { path: ":tab", element: <SettingsDashboard /> },
    
    { path: "*", element: <NotFound /> },
  ],
};

export default SettingsRoutes;







