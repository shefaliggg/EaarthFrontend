import { lazy } from 'react';
import ProjectAppsRoutes from './ProjectAppsRoutes';
import ProjectDepartmentsRoutes from './ProjectDepartmentsRoutes';

// Dashboard and Main Pages
import ProjectList  from '../pages/ProjectList'
import  CreateProject  from '../components/CreateProject';
import { ViewReports } from '../components/ViewReports';
import { ManageTeam } from '../components/ManageTeam';
import  StudioAnalytics  from '../components/StudioAnalytics';
import  ProjectDetails  from '../pages/ProjectDetails';
import EditProject from '../components/EditProject';

// const ProjectList = lazy(() => import('../pages/ProjectList'));
// const ProjectDetail = lazy(() => import('../pages/ProjectDetails'));

// const ProjectActivities = lazy(() => import('../pages/ProjectActivities'));
// const ProjectCalendar = lazy(() => import('../pages/ProjectCalendar'));
// const ProjectCallSheets = lazy(() => import('../pages/ProjectCallSheets'));
// const ProjectCastCrew = lazy(() => import('../pages/ProjectCastCrew'));
// const ProjectCloudStorage = lazy(() => import('../pages/ProjectCloudStorage'));
// const ProjectDepartments = lazy(() => import('../pages/ProjectDepartments/ProjectDepartments'));
// const ProjectNoticeBoard = lazy(() => import('../pages/ProjectNoticeBoard'));
// const ProjectOnboarding = lazy(() => import('../pages/ProjectOnboarding'));
// const ProjectChat = lazy(() => import('../pages/ProjectChat'));
// const ProjectShootingSchedule = lazy(() => import('../pages/ProjectShootingSchedule'));
// const ProjectTasks = lazy(() => import('../pages/ProjectTasks'));
// const ProjectTimeline = lazy(() => import('../pages/ProjectTimeline'));
// const ProjectSettings = lazy(() => import('../pages/ProjectSettings'));

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
                // Project Details Dashboard - shows when you click on a project
                { index: true, element: <ProjectDetails /> },
        
                // { path: 'activities', element: <ProjectActivities /> },
                // { path: 'calendar', element: <ProjectCalendar /> },
                // { path: 'call-sheets', element: <ProjectCallSheets /> },
                // { path: 'cast-crew', element: <ProjectCastCrew /> },
                // { path: 'cloud-storage', element: <ProjectCloudStorage /> },
                // { path: 'notice-board', element: <ProjectNoticeBoard /> },
                // { path: 'onboarding', element: <ProjectOnboarding /> },
                // { path: 'chat', element: <ProjectChat /> },
                // { path: 'shooting-schedule', element: <ProjectShootingSchedule /> },
                // { path: 'tasks', element: <ProjectTasks /> },
                // { path: 'timeline', element: <ProjectTimeline /> },
                // { path: 'settings', element: <ProjectSettings /> },

                ProjectAppsRoutes,
                ProjectDepartmentsRoutes,

                { path: '*', element: <NotFound /> }

            ],
        }
    ]
};

export default ProjectRoutes;