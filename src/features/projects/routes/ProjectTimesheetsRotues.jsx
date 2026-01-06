import { lazy } from 'react';
import TimesheetsLayout from '../layouts/TimesheetsLayout';

const TimesheetsDashboard = lazy(() => import('../timesheets/pages/TimesheetsDashboard'));
const TimesheetTable = lazy(() => import('../timesheets/pages/TimesheetTable'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectTimesheetsRoutes = {
    path: "timesheets",
    children: [
        { index: true, element: <TimesheetsDashboard /> },
        {
            path: ':week',
            element: <TimesheetsLayout />,
            children: [
                { index: true, element: <TimesheetTable /> },
                { path: 'calender', element: <TimesheetTable /> },
                { path: 'settings', element: <TimesheetTable /> },
            ]
        },

        { path: '*', element: <NotFound /> }
    ],
};

export default ProjectTimesheetsRoutes;











