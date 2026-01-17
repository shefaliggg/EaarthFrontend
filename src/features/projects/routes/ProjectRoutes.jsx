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
import FuelAndMileageRoutes from './FuelAndMileageRoutes';
import pettyCashRoutes from './PettyCashRoutes';
import TimesheetsRoutes from './TimesheetsRoutes';
import ProjectCalendarRoutes from './ProjectCalendarRoutes';
import MyOffer from '../../crew/pages/Myoffer';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectRoutes = {
    path: '/projects',
    children: [
        { index: true, element: <ProjectList /> },
        { path: 'create', element: <CreateProject /> },
        { path: 'reports', element: <ViewReports /> },
        { path: 'Myoffers', element: <MyOffer /> },
        { path: 'team', element: <ManageTeam /> },
        { path: 'analytics', element: <StudioAnalytics /> },
        { path: ':id/edit', element: <EditProject /> },
        { path: 'details/:projectId', element: <ProjectDetails /> },
        {
            path: ":projectName",
            children: [
                { index: true, element: <ProjectDetails /> },

                TimesheetsRoutes,
                FuelAndMileageRoutes,
                pettyCashRoutes,
                
                ProjectAppsRoutes,
                ProjectDepartmentsRoutes,
                ProjectCalendarRoutes,

                { path: '*', element: <NotFound /> }

            ],
        }
    ]
};

export default ProjectRoutes;