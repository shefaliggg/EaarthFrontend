import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { AuthProvider } from "@/features/auth/context/AuthContext";

import DashboardLayout from '../layouts/DashboardLayout';

import ProjectRoutes from '../features/projects/routes/ProjectRoutes';
import SettingsRoutes from '../features/settings/routes/SettingsRoutes';
import RoleBasedDashboard from '../shared/components/RoleBasedDashboard';
import ProfileRoutes from '../features/profile/routes/ProfileRoutes';
import StudioRoutes from '../features/studio/routes/StudioRoutes';
import SupportDashboard from '../features/support/pages/SupportDashboard';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const DashboardRoutes = {
  path: '/',
  element: (
    <AuthProvider>
      <ErrorBoundary>
        <DashboardLayout />
      </ErrorBoundary>
    </AuthProvider>
  ),
  children: [
    { path: 'home', element: <RoleBasedDashboard /> },

    StudioRoutes,
    ProjectRoutes,
    SettingsRoutes,
    ProfileRoutes,

    { path: 'support', element: <SupportDashboard /> },
    { path: '*', element: <NotFound /> },
  ],
};

export default DashboardRoutes;
