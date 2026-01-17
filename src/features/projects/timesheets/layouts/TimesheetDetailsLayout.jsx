import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Calendar, Settings } from "lucide-react";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import { Button } from "@/shared/components/ui/button";
import { useMemo } from "react";

const TimesheetsDetailsLayout = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname;

    const section = (() => {
        if (pathname.includes("/settings")) return "settings";
        if (pathname.includes("/financial-summary")) return "financial";
        return "timesheet";
    })();

    const headerConfig = useMemo(() => {
        switch (section) {
            case "financial":
                return {
                    icon: "Wallet",
                    title: (
                        <span className="flex items-center gap-3">
                            Financial Summary
                            <StatusBadge
                                status="information"
                                label="Accounts Use Only"
                                size="sm"
                            />
                        </span>
                    ),
                    subtitle:
                        "Breakdown of all earnings, budget codes, and paid-to-date totals.",
                };

            default:
                return {
                    icon: "CalendarClock",
                    title: (
                        <span className="flex items-center gap-3">
                            Avatar 1 Timesheet
                            <StatusBadge status="draft" size="sm" />
                        </span>
                    ),
                    subtitle: (
                        <span className="flex items-center gap-3">
                            <Calendar className="w-3 h-3" />
                            Week Ending 2025-NOV-16
                        </span>
                    ),
                };
        }
    }, [section]);

    const primaryAction = useMemo(() => {
        if (section === "financial") return null;

        return {
            label: "Submit Timesheet",
            clickAction: () => console.log("Submit clicked"),
            icon: "Check",
            size: "lg",
        };
    }, [section]);


    return (
        <div className='space-y-6 container mx-auto'>
            {section !== "settings" && (
                <PageHeader
                    {...headerConfig}
                    primaryAction={primaryAction}
                    extraActions={
                        section === "timesheet" && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="gap-0 w-11 group"
                                onClick={() => navigate("settings")}
                            >
                                <Settings
                                    className="w-4 h-4 text-primary group-hover:text-background"
                                    strokeWidth={3}
                                />
                            </Button>
                        )
                    }

                />
            )}

            <Outlet />
        </div>
    )
};

export default TimesheetsDetailsLayout;











