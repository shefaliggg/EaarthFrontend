import { lazy } from 'react';
import ProjectAppsRoutes from './ProjectAppsRoutes';
import ProjectDepartmentsRoutes from './ProjectDepartmentsRoutes';

import ProjectList from '../pages/ProjectList'
import CreateProject from '../components/CreateProject';
import { ViewReports } from '../components/ViewReports';
import { ManageTeam } from '../components/ManageTeam';
import StudioAnalytics from '../components/StudioAnalytics';
import ProjectDetails from '../pages/ProjectDetails';
import EditProject from '../components/EditProject';
import TimesheetsRoutes from './TimesheetsRoutes';
import FulesAndMilegeRoutes from './FuelAndmilegeRoutes';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectRoutes = {
    path: '/projects',
    children: [
        { index: true, element: <ProjectList /> },
        { path: 'create', element: <CreateProject /> },
        { path: 'reports', element: <ViewReports /> },
        { path: 'team', element: <ManageTeam /> },
        { path: 'analytics', element: <StudioAnalytics /> },
        { path: ':id/edit', element: <EditProject /> },
        { path: 'details/:projectId', element: <ProjectDetails /> },
        {
            path: ":projectName",
            children: [
                { index: true, element: <ProjectDetails /> },

                TimesheetsRoutes,
                FulesAndMilegeRoutes,
                ProjectAppsRoutes,
                ProjectDepartmentsRoutes,

                { path: '*', element: <NotFound /> }

            ],
        }
    ]
};

export default ProjectRoutes;