import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const ProjectApps = lazy(() => import('../pages/ProjectApps/ProjectApps'));

const ProjectAppsRoutes = {
    path: "apps",
    element: <ProjectApps />,
    children: [
        // { index: true, element: <Navigate to="props" replace /> },

        // { path: 'props', element: <Props /> },
        // { path: 'costume', element: <Costume /> },
        // { path: 'catering', element: <Catering /> },
        // { path: 'accounts', element: <Accounts /> },
        // { path: 'script', element: <Script /> },
        // { path: 'market', element: <Market /> },
        // { path: 'stocks', element: <Stocks /> },
        // { path: 'transport', element: <Transport /> },
        // { path: 'e-player', element: <EPlayer /> },
        // { path: 'forms', element: <Forms /> },
        // { path: 'animals', element: <Animals /> },
        // { path: 'vehicles', element: <Vehicles /> },
        // { path: 'locations', element: <Locations /> },
        // { path: 'approval', element: <Approval /> },
        // { path: 'timesheets', element: <Timesheets /> },
        // { path: 'cloud', element: <Cloud /> },

        { path: '*', element: <NotFound /> }
    ],
};

export default ProjectAppsRoutes;



