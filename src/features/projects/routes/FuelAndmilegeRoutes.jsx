import { lazy } from 'react';

const CrewTimesheetsAndExpensesOverview = lazy(() => import('../timesheets/pages/CrewTimesheetsAndExpensesOverview'));
const FuelAndMileageForm = lazy(() => import('../fuel-and-mileage/pages/FuelAndMileageForm'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const FulesAndMilegeRoutes = {
    path: "fuel-mileage",
    children: [
        { index: true, element: <CrewTimesheetsAndExpensesOverview /> },
        { path: ':week', element: <FuelAndMileageForm />, },
        { path: 'new', element: <FuelAndMileageForm />, },

        { path: '*', element: <NotFound /> }
    ],
};

export default FulesAndMilegeRoutes;











