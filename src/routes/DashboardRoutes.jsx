import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/wrappers/ErrorBoundary';
import { Navigate } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';

import ProjectRoutes from '../features/projects/routes/ProjectRoutes';
import SettingsRoutes from '../features/settings/routes/SettingsRoutes';
import RoleBasedDashboard from '../shared/components/RoleBasedDashboard';
import ProfileRoutes from '../features/profile/routes/ProfileRoutes';
import StudioRoutes from '../features/studio/routes/StudioRoutes';
import SupportDashboard from '../features/support/pages/SupportDashboard';
import CrewRoutes from '../features/crew/routes/CrewRoutes';
import GuardRoute from './GuardRoute';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const DashboardRoutes = {
    path: '/', element: <GuardRoute allowedRoles='all'><DashboardLayout /></GuardRoute>,
    children: [
        { index: true, element: <Navigate to="home" replace /> },
        { path: 'home', element: <RoleBasedDashboard /> },

        StudioRoutes,
        ProjectRoutes,
        SettingsRoutes,
        ProfileRoutes,
        CrewRoutes,

        { path: 'support', element: <SupportDashboard /> },
        { path: '*', element: <NotFound /> },
    ],
};

export default DashboardRoutes;












