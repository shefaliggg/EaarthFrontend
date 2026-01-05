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

export function WeekCard({
    week,
    view = "grid",
    mode = "timesheets",
    isCurrent,
    isFuture,
    weekDays = [],
    onClick,
    onDownloadPDF,
    onViewExpenses,
    onEditExpenses,
}) {
    const displayStatus =
        mode === "expenses"
            ? week.expenseStatus || "not-started"
            : week.status;

    const isGrid = view === "grid";

    const handleCardClick = (e) => {
        e.stopPropagation();
        if (mode === "expenses" && onEditExpenses) {
            onEditExpenses(week.weekEnding);
        } else if (onClick) {
            onClick(week.weekEnding);
        }
    };

    const handleExpenseClick = (e) => {
        e.stopPropagation();
        if (onViewExpenses) {
            onViewExpenses(week.weekEnding);
        }
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        if (onDownloadPDF) {
            onDownloadPDF(week.weekEnding);
        }
    };

    // Grid View
    if (isGrid) {
        return (
            <Card
                onClick={handleCardClick}
                className={cn(
                    "relative rounded-2xl border-2 transition-all group overflow-hidden p-0",
                    isCurrent
                        ? "border-purple-500 shadow-xl shadow-purple-500/20"
                        : "border",
                    "hover:bg-lavender-100/30 dark:hover:bg-lavender-900/20 hover:shadow-lg"
                )}
            >

                {/* Current Week Indicator */}
                {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />
                )}

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
                                    <button
                                        onClick={handleExpenseClick}
                                        className="p-2.5 rounded-xl border transition-all hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-600/20 dark:hover:border-purple-500 hover:scale-110"
                                        title="View Expenses"
                                    >
                                        {week.expenseType === 'fuel' ? (
                                            <Fuel className="w-4 h-4 text-purple-600" />
                                        ) : (
                                            <Car className="w-4 h-4 text-purple-600" />
                                        )}
                                    </button>
                                )}

                                {(week.status === 'approved' || week.status === 'submitted') && (
                                    <button
                                        onClick={handleDownloadClick}
                                        className="p-2.5 rounded-xl border transition-all hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-600/20 dark:hover:border-purple-500 hover:scale-110"
                                        title="Download PDF"
                                    >
                                        <Download className="w-4 h-4 text-purple-600" />
                                    </button>
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
                            <StatusBadge label={"Current"} icon={"Zap"} size="sm" className={"text-primary bg-purple-200"} />
                        )}
                        {isFuture && (
                            <StatusBadge status={'future'} label={"Future"} size="sm" />
                        )}
                        <StatusBadge status={displayStatus} size="sm" />
                    </div>

                    {/* Mini Week Calendar */}
                    {weekDays.length > 0 && (
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {weekDays.map((day, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[9px] font-bold text-gray-400 mb-1">
                                        {day.day[0]}
                                    </div>
                                    <div className={cn(
                                        "w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-bold",
                                        [5, 6].includes(i)
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    )}>
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
                                        View/Edit
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
                "relative rounded-xl border-2 transition-all group cursor-pointer overflow-hidden",
                isCurrent
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : "border",
                "bg-card hover:bg-lavender-200 dark:hover:bg-lavender-900/20 hover:shadow-xl"
            )}
        >
            <div className="p-5 flex items-center gap-6">
                {/* Week Info */}
                <div className="flex-1 flex items-center gap-6">
                    <div className="w-24">
                        <div className="text-sm font-black">
                            {week.range}
                        </div>
                        {isCurrent && (
                            <div className="flex items-center gap-1 mt-1">
                                <Zap className="w-3 h-3 text-purple-600" />
                                <span className="text-[9px] font-bold uppercase text-purple-600">
                                    Current
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <StatusBadge status={displayStatus} size="sm" />

                    {/* Details */}
                    {displayStatus !== 'not-started' && (
                        <div className="flex items-center gap-6">
                            {mode === 'timesheets' ? (
                                <>
                                    {week.totalHours !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <Timer className="w-4 h-4 text-gray-400" />
                                            <span className="font-bold">{week.totalHours}h</span>
                                        </div>
                                    )}
                                    {week.totalAmount && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="font-black text-purple-600 dark:text-purple-400">
                                                {week.totalAmount}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {week.expenseType && (
                                        <div className={cn(
                                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase",
                                            week.expenseType === 'fuel'
                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        )}>
                                            {week.expenseType}
                                        </div>
                                    )}
                                    {week.expenseAmount && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="font-black text-purple-600 dark:text-purple-400">
                                                {week.expenseAmount}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {mode === 'timesheets' && (week.status === 'approved' || week.status === 'submitted') && (
                        <>
                            {week.expenseType && (
                                <button
                                    onClick={handleExpenseClick}
                                    className="p-2 rounded-lg border transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                    title="View Expenses"
                                >
                                    {week.expenseType === 'fuel' ? (
                                        <Fuel className="w-4 h-4 text-purple-600" />
                                    ) : (
                                        <Car className="w-4 h-4 text-purple-600" />
                                    )}
                                </button>
                            )}
                            {onDownloadPDF && (
                                <button
                                    onClick={handleDownloadClick}
                                    className="p-2 rounded-lg border transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                    title="Download PDF"
                                >
                                    <Download className="w-4 h-4 text-purple-600" />
                                </button>
                            )}
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