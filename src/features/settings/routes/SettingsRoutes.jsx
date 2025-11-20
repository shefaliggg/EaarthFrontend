import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { Navigate } from 'react-router-dom';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const AccountSettings = lazy(() => import('@/features/settings/pages/AccountSettings'));

const SettingsRoutes = {
  path: "settings",
  children: [
    { index: true, element: <Navigate to="account" replace /> },
    { path: "account", element: <AccountSettings /> },
    // { path: "profile", element: <ProfileSettings /> },
    // { path: "security", element: <SecuritySettings /> },
    { path: "*", element: <NotFound /> }
  ],
};

export default SettingsRoutes;