import { lazy } from 'react';

const CrewTimesheetsAndExpensesOverview = lazy(() => import('../timesheets/pages/CrewTimesheetsAndExpensesOverview'));
const PettyCashForm = lazy(() => import('../petty-cash/pages/PettyCashForm'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const pettyCashRoutes = {
    path: "petty-cash",
    children: [
        { index: true, element: <CrewTimesheetsAndExpensesOverview /> },
        { path: ':week', element: <PettyCashForm />, },
        { path: 'new', element: <PettyCashForm />, },

        { path: '*', element: <NotFound /> }
    ],
};

export default pettyCashRoutes;











