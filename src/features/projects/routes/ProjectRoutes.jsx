import { lazy } from 'react';
import GuardRoute from '../../../routes/GuardRoute';
import ProjectList from '../pages/ProjectList';
import CreateProject from '../components/CreateProject';
import EditProject from '../components/EditProject';
import ProjectDetails from '../pages/ProjectSettings/ProjectDetails';
import ProjectDetailsPage from '../pages/ProjectDetails';
import ProjectSettings from '../pages/ProjectSettings/ProjectSettings';
import ProjectGeneral from '../pages/ProjectSettings/ProjectGeneral';
import ProjectOnboarding from '../pages/ProjectSettings/ProjectOnboarding';
import ProjectTimesheet from '../pages/ProjectSettings/ProjectTimesheet';
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
import ProjectConstruction from '../pages/ProjectSettings/ProjectConstruction';
import ProjectRoles from '../pages/ProjectSettings/ProjectRoles';
import ProjectNotifications from '../pages/ProjectSettings/ProjectNotifications';
import SignersRecipients from '../pages/ProjectSettings/SignersRecipients';
import ApprovalWorkflows from '../pages/ProjectSettings/ApprovalWorkflows';
import Billing from '../pages/ProjectSettings/Billing';
import ProjectDetail from '../pages/ProjectSettings/ProjectDetail';

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
        { index: true, element: <ProjectSettings /> },          // default page for settings
        { path: 'details', element: <ProjectDetails /> },
        { path: 'detail', element: <ProjectDetail /> },
        { path: 'construction', element: <ProjectConstruction /> },
        { path: 'general', element: <ProjectGeneral /> },
        { path: 'onboarding', element: <ProjectOnboarding /> },
        { path: 'timesheet', element: <ProjectTimesheet /> },
        { path: 'roles', element: <ProjectRoles /> },
        { path: 'notifications', element: <ProjectNotifications /> },
        { path: 'signers-recipients', element: <SignersRecipients /> },
        { path: 'approval-workflows', element: <ApprovalWorkflows /> },
        { path: 'billing', element: <Billing /> },
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
