import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { Navigate } from 'react-router-dom';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
<<<<<<< HEAD
const AccountSettings = lazy(() => import('@/features/settings/pages/AccountSettings.jsx'));
=======
const AccountSettings = lazy(() => import('@/features/settings/pages/AccountSettings'));
>>>>>>> bc8daad (refactor(routes) : refactor routes and add new routes and their pages)

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