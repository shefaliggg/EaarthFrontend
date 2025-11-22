import { lazy } from 'react';
// import ErrorBoundary from '@/shared/components/ErrorBoundary';
// import { Navigate } from 'react-router-dom';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const SettingsDashboard = lazy(() => import('@/features/settings/pages/SettingsDashboard'));

const SettingsRoutes = {
  path: "settings",
  children: [
    { index: true, element: <SettingsDashboard /> },

    // Allow tab navigation
    { path: ":tab", element: <SettingsDashboard /> },

    // 404
    { path: "*", element: <NotFound /> },
  ],
};

export default SettingsRoutes;