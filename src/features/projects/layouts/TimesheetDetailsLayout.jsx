import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";
import { Calendar, Settings } from "lucide-react";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import { Button } from "../../../shared/components/ui/button";

const TimesheetsLayout = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = location.pathname

    return (
        <div className='space-y-6 container mx-auto'>
            <PageHeader
                icon="CalendarClock"
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

                extraActions={
                    <Button variant={"outline"} size={"lg"} className={"gap-0 w-11 group"} onClick={() => navigate("settings")}>
                        <Settings className="w-4 h-4 text-primary group-hover:text-background" strokeWidth={3} />
                    </Button>
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
                ]}
                value={currentTab}
                navigatable
            />

            <Outlet />
        </div>
    )
};

export default TimesheetsLayout;











