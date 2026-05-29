import { lazy } from 'react'

const CrewTimesheetsAndExpensesOverview = lazy(() => import('../pages/CrewTimesheetsAndExpensesOverview'));
const CrewTimsheetManagmentDashboard = lazy(() => import('../pages/CrewTimsheetManagmentDashboard'));

function TimesheetLayout() {
    // const crewUserRole = user?.crewUserRole ?? "";
    const crewUserRole = "crew" //temporary for development

    const renderTimsheetDashboard = () => {
        switch (crewUserRole) {
            case "crew":
                return <CrewTimesheetsAndExpensesOverview />;

            default:
                return <CrewTimsheetManagmentDashboard />;
        }
    };

    return renderTimsheetDashboard();
}

export default TimesheetLayout