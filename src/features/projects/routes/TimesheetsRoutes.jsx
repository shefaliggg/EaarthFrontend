import { lazy } from 'react';
import TimesheetDetailsLayout from '../timesheets/layouts/TimesheetDetailsLayout';
import TimesheetSettingsRoutes from './TimesheetSettingsRoutes';
import TimesheetLayout from '../timesheets/layouts/TimsheetLayout';

const TimesheetTable = lazy(() => import('../timesheets/pages/TimesheetTable'));
const FinancialSummary = lazy(() => import('../timesheets/pages/FinancialSummary'));
const ShootingCalender = lazy(() => import('../timesheets/pages/ShootingCalender'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const TimesheetsRoutes = {
    path: "timesheets",
    children: [
        { index: true, element: <TimesheetLayout /> },
        {
            path: ':week',
            element: <TimesheetDetailsLayout />,
            children: [
                { index: true, element: <TimesheetTable /> },
                { path: 'financial-summary', element: <FinancialSummary /> },
                { path: 'calender', element: <ShootingCalender /> },
                TimesheetSettingsRoutes,
            ]
        },

        { path: '*', element: <NotFound /> }
    ],
};

export default TimesheetsRoutes;











