import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { Navigate } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';

import ProjectRoutes from '../features/projects/routes/ProjectRoutes';
import SettingsRoutes from '../features/settings/routes/SettingsRoutes';
import RoleBasedDashboard from '../shared/components/RoleBasedDashboard';
import ProfileRoutes from '../features/profile/routes/ProfileRoutes';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const DashboardRoutes = {path: '/', element: <ErrorBoundary><DashboardLayout /></ErrorBoundary>,
    children: [
        { index: true, element: <Navigate to="home" replace /> },
        { path: 'home', element: <RoleBasedDashboard /> },

        ProjectRoutes,
        SettingsRoutes,
        ProfileRoutes,

        { path: '*', element: <ErrorBoundary><NotFound /></ErrorBoundary> },
    ],
};

export default DashboardRoutes;
