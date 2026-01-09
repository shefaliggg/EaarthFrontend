import { lazy } from 'react';

const CrewTimesheetsOverview = lazy(() => import('../timesheets/pages/CrewTimesheetsOverview'));
const FuelAndMileageForm = lazy(() => import('../fuel-and-mileage/pages/FuelAndMileageForm'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const FulesAndMilegeRoutes = {
    path: "fuel-mileage",
    children: [
        { index: true, element: <CrewTimesheetsOverview /> },
        { path: ':claimId', element: <FuelAndMileageForm />,},

        { path: '*', element: <NotFound /> }
    ],
};

export default FulesAndMilegeRoutes;











