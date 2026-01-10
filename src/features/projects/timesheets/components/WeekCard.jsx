import {
    Timer,
    DollarSign,
    Fuel,
    Car,
    Eye,
    Plus,
    Zap,
    ArrowUpRight,
    Download,
    X,
    FileText,
    Calendar,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";
import { Card } from "../../../../shared/components/ui/card";
import { Progress } from "../../../../shared/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function WeekCard({
    fullWidth = false,
    week,
    view = "grid",
    mode = "timesheets",
    isCurrent,
    isFuture,
    weekDays = [],
}) {
    const navigate = useNavigate();
    const params = useParams();
    const displayStatus =
        mode === "expenses"
            ? week.expenseStatus || "not-started"
            : week.status;

    const isGrid = view === "grid";

    const handleCardClick = (e) => {
        e.stopPropagation();
        if (mode === "expenses") {
            if (displayStatus !== 'not-started') {
                navigate("FLCM-#284382");
            } else {
                navigate(`new?week=${week.weekEnding}`);
            }
        } else {
            navigate(week.weekEnding);
        }
    };

    const handleExpenseClick = (e) => {
        e.stopPropagation();
        navigate(`/projects/${params.projectName}/fuel-mileage/${week.weekEnding}?claim=#124322`);
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        toast.info("Printing Pdf intiated.", { description: "currently not exporting pdf temporarily due to mock data" })
    };

    const isToday = (day) => {
        const today = new Date();

        return (
            day.fullDate &&
            new Date(day.fullDate).toDateString() === today.toDateString()
        );
    };


    // Grid View
    if (isGrid) {
        return (
            <Card
                onClick={handleCardClick}
                className={cn(
                    "relative rounded-2xl border-2 transition-all group overflow-hidden p-0",
                    isCurrent
                        ? "border-purple-300 shadow-lg shadow-purple-500/10"
                        : "border",
                    "hover:bg-lavender-100/20 hover:-translate-y-1 dark:hover:bg-lavender-900/20 hover:shadow-xl"
                )}
            >

                <div className="p-5 relative flex flex-col gap-2 h-full">
                    {/* Week Range & Actions */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="text-lg font-black mb-1">
                                {week.range}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {mode === 'timesheets' && (
                            <div className="flex items-center gap-1.5">
                                {(week.status === 'approved' || week.status === 'submitted') && week.expenseType && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleExpenseClick}
                                        className="size-10"
                                        title="View Expenses"
                                    >
                                        {week.expenseType === 'fuel' ? (
                                            <Fuel className="w-4 h-4" />
                                        ) : (
                                            <Car className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}

                                {(week.status === 'approved' || week.status === 'submitted') && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleDownloadClick}
                                        className="size-10"
                                        title="Download PDF"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Expense Type Badge */}
                        {mode === 'expenses' && week.expenseType && displayStatus !== 'not-started' && (
                            <div className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-lg",
                                week.expenseType === 'fuel'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            )}>
                                {week.expenseType === 'fuel' ? (
                                    <>
                                        <Fuel className="w-3.5 h-3.5" />
                                        Fuel
                                    </>
                                ) : (
                                    <>
                                        <Car className="w-3.5 h-3.5" />
                                        Mileage
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        {isCurrent && (
                            <StatusBadge label={"Current"} icon={"Zap"} size={fullWidth ? "md" : "sm"} className={"bg-purple-100 text-purple-700 dark:bg-purple-900/40"} />
                        )}
                        {isFuture && (
                            <StatusBadge status={'future'} label={"Future"} size={fullWidth ? "md" : "sm"} />
                        )}
                        <StatusBadge status={displayStatus} size={fullWidth ? "md" : "sm"} />
                    </div>

                    {/* Mini Week Calendar */}
                    {weekDays.length > 0 && (
                        <div className={`grid grid-cols-7 mb-4 ${fullWidth ? "gap-3" : "gap-1"}`}>
                            {weekDays.map((day, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[9px] font-bold text-gray-400 mb-1">
                                        {day.day[0]}
                                    </div>
                                    <div
                                        className={cn(
                                            "w-full rounded-md flex items-center justify-center text-[10px] font-bold transition-all",
                                            fullWidth ? "h-10" : "aspect-square",

                                            isToday(day) &&
                                            "bg-purple-600 text-white ring-2 ring-purple-400",

                                            !isToday(day) &&
                                            ([5, 6].includes(i)
                                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")
                                        )}
                                    >
                                        {day.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Week Details */}
                    {displayStatus !== 'not-started' && (
                        <div className="space-y-2.5 py-4 border-t">
                            {mode === 'timesheets' ? (
                                <>
                                    {week.totalHours !== undefined && (
                                        <Detail icon={Timer} label="Hours" value={week.totalHours} />
                                    )}
                                    {week.totalAmount && (
                                        <Detail
                                            icon={DollarSign}
                                            label="Amount"
                                            value={week.totalAmount}
                                            highlight
                                        />
                                    )}
                                    {week.submittedDate && (
                                        <Detail
                                            label="Submitted"
                                            value={week.submittedDate}
                                            isDate
                                        />
                                    )}
                                    {week.approvedDate && (
                                        <Detail
                                            label="Approved"
                                            value={week.approvedDate}
                                            isDate
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    {week.expenseAmount && (
                                        <Detail
                                            icon={week.expenseType === 'fuel' ? Fuel : Car}
                                            label="Total"
                                            value={week.expenseAmount}
                                            highlight
                                        />
                                    )}
                                    {week.expenseType === 'mileage' && (
                                        <Detail
                                            label="Rate"
                                            value="£0.45/mile"
                                            isMonospace
                                        />
                                    )}
                                </>
                            )}

                            {/* Progress Bar for Hours */}
                            {mode === 'timesheets' && week.totalHours && (
                                <div className="pt-2">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-bold text-gray-400">Progress</span>
                                        <span className="text-[10px] font-bold text-purple-600">
                                            {((week.totalHours / 40) * 10).toFixed(0)}%
                                        </span>
                                    </div>
                                    <Progress value={((week.totalHours / 40) * 10).toFixed(0)} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Click Indicator */}
                    <div className="mt-auto pt-4 border-t text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
                            {mode === 'expenses' ? (
                                displayStatus === 'not-started' ? (
                                    <>
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Expenses
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3.5 h-3.5" />
                                        View or Edit
                                    </>
                                )
                            ) : (
                                <>
                                    {week.status === 'not-started' ? <Plus className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {week.status === 'not-started' ? 'Create' : 'View'} Timesheet
                                </>
                            )}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </Card>
        );
    }

    // List View
    return (
        <Card
            onClick={handleCardClick}
            className={cn(
                "relative rounded-xl border transition-all group cursor-pointer overflow-hidden p-2",
                isCurrent
                    ? "border-purple-300 shadow-lg shadow-purple-500/10"
                    : "border",
                "hover:bg-lavender-200 dark:hover:bg-lavender-900/20"
            )}
        >
            <div className="p-4 pl-6 flex items-center gap-8">
                {/* LEFT: Week */}
                <div className="w-28 shrink-0">
                    <div className="text-sm font-black leading-tight">
                        {week.range.toUpperCase()}
                    </div>
                </div>

                {/* CENTER: Status + Metrics */}
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {isCurrent && (
                                    <StatusBadge label={"Current"} icon={"Zap"} size={"md"} className={"bg-purple-100 text-purple-700 dark:bg-purple-900/40"} />
                                )}
                                {isFuture && (
                                    <StatusBadge status={'information'} label={"Future"} size={"md"} />
                                )}
                                <StatusBadge status={displayStatus} size={"md"} />
                            </div>
                            {mode === "timesheets" && displayStatus !== "not-started" && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {week.submittedDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Submitted {week.submittedDate}
                                        </span>
                                    )}

                                    {week.approvedDate && (
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            Approved {week.approvedDate}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {weekDays.length > 0 && (
                    <div className={`grid grid-cols-7 mb-4 gap-2`}>
                        {weekDays.map((day, i) => (
                            <div key={i} className="text-center">
                                <div className="text-[9px] font-bold text-gray-400 mb-1">
                                    {day.day[0]}
                                </div>
                                <div
                                    className={cn(
                                        "w-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all",
                                        "aspect-square",

                                        isToday(day) &&
                                        "bg-purple-600 text-white ring-2 ring-purple-400",

                                        !isToday(day) &&
                                        ([5, 6].includes(i)
                                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")
                                    )}
                                >
                                    {day.date}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-8">
                    <div className="space-y-1">
                        {mode === "expenses" && displayStatus !== "not-started" && (
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1 font-semibold">
                                    {week.expenseType === "fuel" ? (
                                        <Fuel className="w-3.5 h-3.5" />
                                    ) : (
                                        <Car className="w-3.5 h-3.5" />
                                    )}
                                    {week.expenseType}
                                </span>

                                {week.expenseAmount && (
                                    <span className="font-bold text-purple-600">
                                        {week.expenseAmount}
                                    </span>
                                )}

                                {week.expenseType === "mileage" && (
                                    <span className="font-mono text-muted-foreground">
                                        £0.45 / mile
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            {mode === "timesheets" && week.totalHours !== undefined && (
                                <span className="flex items-center gap-1.5 text-sm font-semibold">
                                    <Timer className="w-4 h-4 text-muted-foreground" />
                                    {week.totalHours}h
                                </span>
                            )}

                            {week.totalAmount && (
                                <span className="flex items-center gap-1.5 text-sm font-black text-purple-600">
                                    {/* <DollarSign className="w-4 h-4" /> */}
                                    {week.totalAmount}
                                </span>
                            )}
                        </div>
                        {/* Progress (timesheets only) */}
                        {mode === "timesheets" && week.totalHours && (
                            <div className="flex items-center gap-2">
                                <Progress
                                    value={Math.min((week.totalHours / 40) * 100, 100)}
                                    className="h-1.5 w-40"
                                />
                                <span className="text-[10px] font-bold text-muted-foreground">
                                    {Math.round((week.totalHours / 40) * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                    {mode === "timesheets" &&
                        (week.status === "approved" || week.status === "submitted") && (
                            <>
                                {week.expenseType && (
                                    <button
                                        onClick={handleExpenseClick}
                                        className="p-2 rounded-lg border hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                    >
                                        {week.expenseType === "fuel" ? (
                                            <Fuel className="w-4 h-4 text-purple-600" />
                                        ) : (
                                            <Car className="w-4 h-4 text-purple-600" />
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={handleDownloadClick}
                                    className="p-2 rounded-lg border hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                >
                                    <Download className="w-4 h-4 text-purple-600" />
                                </button>
                            </>
                        )}

                    <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </Card>
    );
}

function Detail({ icon: Icon, label, value, highlight, isDate = false, isMonospace = false }) {
    return (
        <div className="flex justify-between items-center">
            <span className={cn(
                "text-xs font-semibold text-muted-foreground",
                Icon && "flex items-center gap-2"
            )}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}:
            </span>
            <span className={cn(
                isDate ? "text-xs text-muted-foreground" : "font-bold",
                isMonospace && "font-mono",
                highlight && "text-purple-600 dark:text-purple-400"
            )}>
                {value}
            </span>
        </div>
    );
}