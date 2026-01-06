import { Outlet, useLocation, useParams } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";
import { Calendar } from "lucide-react";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";

const TimesheetsLayout = () => {
    const params = useParams();
    const location = useLocation();
    console.log("params", params)

    const currentTab = location.pathname

    return (
        <div className='space-y-6 container mx-auto'>
            <PageHeader
                icon="Clock"
                title={
                    <span className='flex items-center gap-3'>
                        AVATAR 1
                        <StatusBadge status={"draft"} size="sm" />
                    </span>
                }
                // initials={"LK"}
                subtitle={
                    <span className='flex items-center gap-3'>
                        <Calendar className="w-3 h-3" />
                        Week Ending 2025-NOV-16
                    </span>
                }

                primaryAction={{
                    label: "Submit Timsheet",
                    clickAction: () => console.log("AI insight clicked"),
                    icon: "Check",
                    variant: "default",
                    size: "lg"
                }}
            />
            <FilterPillTabs
                options={[
                    { label: "My timesheets", route: `/projects/${params.projectName}/timesheets/${params.week}` },
                    { label: "Shooting Calender", route: `/projects/${params.projectName}/timesheets/${params.week}/calender` },
                    { label: "Timesheet settings", route: `/projects/${params.projectName}/timesheets/${params.week}/settings` },
                ]}
                value={currentTab}
                navigatable
            />

            <Outlet />
        </div>
    )
};

export default TimesheetsLayout;











