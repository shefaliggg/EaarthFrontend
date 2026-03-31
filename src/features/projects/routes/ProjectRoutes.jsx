import { lazy } from 'react';
import GuardRoute from '../../../routes/GuardRoute';
import ProjectList from '../pages/ProjectList';
import CreateProject from '../components/CreateProject';
import EditProject from '../components/EditProject';
import ProjectDashboard from '../pages/ProjectDashboard';


import ProjectAppsRoutes from './ProjectAppsRoutes';
import ProjectDepartmentsRoutes from './ProjectDepartmentsRoutes';
import FuelAndMileageRoutes from './FuelAndMileageRoutes';
import pettyCashRoutes from './PettyCashRoutes';
import TimesheetsRoutes from './TimesheetsRoutes';
import ProjectCalendarRoutes from './ProjectCalendarRoutes';
// import ContractRoutes from './ContractRoutes';

import { ViewReports } from '../components/ViewReports';
import { ManageTeam } from '../components/ManageTeam';
import StudioAnalytics from '../components/StudioAnalytics';
import MyOffer from '../../crew/pages/Myoffer';
import SettingsRoutes from '../settings/routes/SettingsRoutes';

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectRoutes = {
  path: '/projects',
  element: <GuardRoute allowedRoles="all" />,
  children: [
    
    { index: true, element: <ProjectList /> },

    // studio_admin only
    {
      element: <GuardRoute allowedRoles={['studio_admin']} />,
      children: [
        { path: 'create', element: <CreateProject /> },
        { path: ':id/edit', element: <EditProject /> },
      ],
    },

    // crew only
    {
      element: <GuardRoute allowedRoles={['crew']} />,
      children: [
        { path: 'Myoffers', element: <MyOffer /> },
      ],
    },

    // everyone else
    { path: 'reports', element: <ViewReports /> },
    { path: 'team', element: <ManageTeam /> },
    { path: 'analytics', element: <StudioAnalytics /> },

    {
      path: ':projectName',
      children: [
        { index: true, element: <ProjectDashboard /> },
        TimesheetsRoutes,
        FuelAndMileageRoutes,
        pettyCashRoutes,
        ProjectAppsRoutes,
        ProjectDepartmentsRoutes,
        ProjectCalendarRoutes,
        SettingsRoutes,
        // ContractRoutes, // 🆕 ADD THIS
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
};

export default ProjectRoutes;