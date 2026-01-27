import { lazy } from 'react';
import GuardRoute from '../../../routes/GuardRoute';
import ProjectList from '../pages/ProjectList';
import CreateProject from '../components/CreateProject';
import EditProject from '../components/EditProject';
import ProjectDetails from '../components/ProjectDetails';
import ProjectDetailsPage from '../pages/ProjectDetails';
import ProjectGeneral from '../components/ProjectGeneral';
import ProjectOnboarding from '../components/ProjectOnboarding';
import ProjectTimesheet from '../components/ProjectTimesheet';
// import ProjectCalendarSettings from '../components/'; // your calendar settings page

import ProjectAppsRoutes from './ProjectAppsRoutes';
import ProjectDepartmentsRoutes from './ProjectDepartmentsRoutes';
import FuelAndMileageRoutes from './FuelAndMileageRoutes';
import pettyCashRoutes from './PettyCashRoutes';
import TimesheetsRoutes from './TimesheetsRoutes';
import ProjectCalendarRoutes from './ProjectCalendarRoutes';

import { ViewReports } from '../components/ViewReports';
import { ManageTeam } from '../components/ManageTeam';
import StudioAnalytics from '../components/StudioAnalytics';
import MyOffer from '../../crew/pages/Myoffer';

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

    // Project Settings Section
    {
      path: ':projectName/settings',
      children: [
        { index: true, element: <ProjectDetails /> },          // default page for settings
        { path: 'details', element: <ProjectDetails /> },
        { path: 'general', element: <ProjectGeneral /> },
        { path: 'onboarding', element: <ProjectOnboarding /> },
        { path: 'timesheet', element: <ProjectTimesheet /> },
        // { path: 'calendar', element: <ProjectCalendarSettings /> }, // your calendar settings
        { path: '*', element: <NotFound /> },
      ],
    },

    {
      path: ':projectName',
      children: [
        { index: true, element: <ProjectDetailsPage /> },          // default page for settings
        TimesheetsRoutes,
        FuelAndMileageRoutes,
        pettyCashRoutes,
        ProjectAppsRoutes,
        ProjectDepartmentsRoutes,
        ProjectCalendarRoutes,
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
};

export default ProjectRoutes;
