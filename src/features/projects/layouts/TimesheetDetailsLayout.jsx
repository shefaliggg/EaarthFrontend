import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";
import { Calendar, Settings } from "lucide-react";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import { Button } from "../../../shared/components/ui/button";

const TimesheetsDetailsLayout = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const canEdit = true;

    const currentTab = location.pathname
    const isFinancialSummaryPage = currentTab === `/projects/${params.projectName}/timesheets/${params.week}/financial-summary`
    const isShootingcalendarPage = currentTab === `/projects/${params.projectName}/timesheets/${params.week}/calender`

    return (
        <div className='space-y-6 container mx-auto'>
            <PageHeader
                icon={isFinancialSummaryPage ? "Wallet" : "CalendarClock"}
                title={isFinancialSummaryPage
                    ? <span className='flex items-center gap-3'>
                        Financial Summary
                        <StatusBadge status={"information"} label={"Accounts Use Only"} size="sm" />
                        {/* <StatusBadge status={"information"} label={`${canEdit ? '(Can Edit)' : '(View Only)'}`} size="sm" /> */}
                    </span>
                    : <span className='flex items-center gap-3'>
                        AVATAR 1
                        <StatusBadge status={"draft"} size="sm" />
                    </span>
                }
                // initials={"LK"}
                subtitle={isFinancialSummaryPage
                    ? "Breakdown of all earnings, budget codes, and paid-to-date totals."
                    : <span className='flex items-center gap-3'>
                        <Calendar className="w-3 h-3" />
                        Week Ending 2025-NOV-16
                    </span>
                }

                extraActions={!isFinancialSummaryPage && !isShootingcalendarPage &&
                    <Button variant={"outline"} size={"lg"} className={"gap-0 w-11 group"} onClick={() => navigate("settings")}>
                        <Settings className="w-4 h-4 text-primary group-hover:text-background" strokeWidth={3} />
                    </Button>
                }

                secondaryActions={[

                ]}

                primaryAction={!isFinancialSummaryPage && !isShootingcalendarPage ? {
                    label: "Submit Timsheet",
                    clickAction: () => console.log("AI insight clicked"),
                    icon: "Check",
                    variant: "default",
                    size: "lg"
                } : !isFinancialSummaryPage && isShootingcalendarPage && {
                    label: "Export Calendar",
                    clickAction: () => console.log("Export calendar clicked"),
                    icon: "Download",
                    variant: "default",
                    size: "lg"
                }}
            />
            {!isFinancialSummaryPage &&
                <FilterPillTabs
                    options={[
                        { label: "My timesheets", route: `/projects/${params.projectName}/timesheets/${params.week}` },
                        { label: "Shooting Calender", route: `/projects/${params.projectName}/timesheets/${params.week}/calender` },
                    ]}
                    value={currentTab}
                    navigatable
                />
            }

            <Outlet />
        </div>
    )
};

export default TimesheetsDetailsLayout;











