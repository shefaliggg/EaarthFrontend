import { lazy } from 'react';
import TimesheetDetailsLayout from '../layouts/TimesheetDetailsLayout';

const CrewTimesheetsAndExpensesOverview = lazy(() => import('../timesheets/pages/CrewTimesheetsAndExpensesOverview'));
const TimesheetTable = lazy(() => import('../timesheets/pages/TimesheetTable'));
const TimesheetCalender = lazy(() => import('../timesheets/pages/TimesheetCalender'));
const TimesheetSettings = lazy(() => import('../timesheets/pages/TimesheetSettings'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const TimesheetsRoutes = {
    path: "timesheets",
    children: [
        { index: true, element: <CrewTimesheetsAndExpensesOverview /> },
        {
            path: ':week',
            element: <TimesheetDetailsLayout />,
            children: [
                { index: true, element: <TimesheetTable /> },
                { path: 'calender', element: <TimesheetCalender /> },
                { path: 'settings', element: <TimesheetSettings /> },
            ]
        },

        { path: '*', element: <NotFound /> }
    ],
};

export default TimesheetsRoutes;











