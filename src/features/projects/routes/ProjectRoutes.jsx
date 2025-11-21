import { lazy } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import ProjectAppsRoutes from './ProjectAppsRoutes';

const ProjectList = lazy(() => import('../pages/ProjectList'));
const ProjectActivities = lazy(() => import('../pages/ProjectActivities'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetails'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectRoutes = {
    path: '/projects',
    children: [
        { index: true, element: <ProjectList /> },
        {
            path: ":projectId",
            element: <ProjectDetail />,
            children: [
                { path: 'activities', element: <ProjectActivities /> },
                ProjectAppsRoutes,
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




