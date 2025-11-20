import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { Navigate } from 'react-router-dom';

import ProjectAppsRoutes from './ProjectAppsRoutes';

const ProjectList = lazy(() => import('../pages/ProjectList'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'));
const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const ProjectActivities = lazy(() => import('../pages/ProjectActivities'));

const ProjectRoutes = {
    path: '/projects',
    children: [
        { index: true, element: <ProjectList /> },
        {
            path: ":projectName",
            element: <ProjectDetails />,
            children: [
                { path: 'activities', element: <ProjectActivities /> },
                // ProjectAppsRoutes,
                // { path: 'calendar', element: <Calendar /> },
                // { path: 'call-sheets', element: <CallSheets /> },
                // { path: 'cast-crew', element: <CastCrew /> },
                // { path: 'cloud-storage', element: <CloudStorage /> },
                // { path: 'departments', element: <Departments /> },
                // { path: 'notice-board', element: <NoticeBoard /> },
                // { path: 'onboarding', element: <Onboarding /> },
                // { path: 'chat', element: <ProjectChat /> },
                // { path: 'shooting-schedule', element: <ShootingSchedule /> },
                // { path: 'tasks', element: <Tasks /> },
                // { path: 'timeline', element: <Timeline /> },
                // { path: 'settings', element: <ProjectSettings /> },

                { path: '*', element: <NotFound /> }

            ],
        }
    ]
};

export default ProjectRoutes;
