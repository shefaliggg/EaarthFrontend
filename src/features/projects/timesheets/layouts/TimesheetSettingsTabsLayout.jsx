import React from 'react'
import FilterPillTabs from '../../../../shared/components/FilterPillTabs'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

function TimesheetSettingsTabsLayout() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    return (
        <div className='space-y-6'>
            <FilterPillTabs
                options={[
                    {
                        label: "General",
                        icon: "Settings",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings`,
                    },
                    {
                        label: "Notifications",
                        icon: "Bell",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/notifications`,
                    },
                    {
                        label: "Custom",
                        icon: "Bell",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/custom`,
                    },
                    {
                        label: "Penny Contracts",
                        icon: "Bell",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/penny-contracts`,
                    },
                    {
                        label: "PACT Calculator",
                        icon: "Calculator",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/pact-calculator`,
                    },
                    {
                        label: "Contact Comparison",
                        icon: "FileText",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/contract-comparison`,
                    },
                    {
                        label: "AI & Automation",
                        icon: "brain",
                        route: `/projects/${params.projectName}/timesheets/${params.week}/settings/ai-automation`,
                    },
                ]}
                value={pathname}
                navigatable
                fullWidth={true}
            transparentBg={false}
            />
            <Outlet />
        </div>
    )
}

export default TimesheetSettingsTabsLayout