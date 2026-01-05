import React, { useMemo, useState } from 'react'
import { PageHeader } from '../../../../shared/components/PageHeader'
import { ArrowUpRight, Award, Calendar, Car, ChevronDown, CircleDollarSign, DollarSign, Download, Eye, Fuel, Plus, Timer, X, Zap } from 'lucide-react';
import MiniInfoPills from '../../../../shared/components/badges/MiniInfoPills';
import FilterPillTabs from '../../../../shared/components/FilterPillTabs';
import PrimaryStats from '../../../../shared/components/wrappers/PrimaryStats';
import SearchBar from '../../../../shared/components/SearchBar';
import ViewToggleButton from '../../../../shared/components/buttons/ViewToggleButton';
import { Button } from '../../../../shared/components/ui/button';
import { motion, AnimatePresence } from "framer-motion"
import { getStatusBadge } from '../../../../shared/config/statusBadgeConfig';
import { StatusBadge } from '../../../../shared/components/badges/StatusBadge';
import { WeekCard } from '../../components/projectTimesheets/WeekCard';

function ProjectTimesheets() {
  const [expandedYears, setExpandedYears] = useState([new Date().getFullYear()]);
  const [activeTab, setActiveTab] = useState('timesheets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const [viewingExpensesForWeek, setViewingExpensesForWeek] = useState(null);

  const generateMockWeekData = () => {
    const weeks = [];
    const currentDate = new Date();

    for (let i = -8; i <= 11; i++) {
      const weekEnd = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      weekEnd.setDate(currentDate.getDate() + daysUntilSunday + (i * 7));

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);

      let status = 'submitted';
      let expenseStatus = 'submitted' | 'approved' | 'draft' | 'not-started';

      if (i < -2) {
        status = 'approved';
        expenseStatus = Math.random() > 0.3 ? 'approved' : 'not-started'; // 70% have expenses
      } else if (i === -2 || i === -1) {
        status = 'submitted';
        expenseStatus = Math.random() > 0.5 ? 'submitted' : 'draft'; // Mix of submitted/draft
      } else if (i === 0) {
        status = 'draft';
        expenseStatus = Math.random() > 0.5 ? 'draft' : 'not-started';
      } else {
        status = 'not-started';
        expenseStatus = 'not-started';
      }

      const expenseType = i % 2 === 0 ? 'mileage' : 'fuel';
      const hasMileageExpense = expenseStatus !== 'not-started' && expenseType === 'mileage';
      const hasFuelExpense = expenseStatus !== 'not-started' && expenseType === 'fuel';

      weeks.push({
        weekEnding: weekEnd.toISOString().split('T')[0],
        weekStart: weekStart.toISOString().split('T')[0],
        status,
        totalHours: status !== 'not-started' ? Math.floor(Math.random() * 20) + 40 : undefined,
        totalAmount: status !== 'not-started' ? `£${(Math.random() * 2000 + 2000).toFixed(2)}` : undefined,
        submittedDate: status === 'submitted' || status === 'approved' ? new Date(weekEnd.getTime() + 86400000).toLocaleDateString('en-GB') : undefined,
        approvedDate: status === 'approved' ? new Date(weekEnd.getTime() + 172800000).toLocaleDateString('en-GB') : undefined,
        year: weekEnd.getFullYear(),
        expenseType,
        expenseStatus,
        expenseAmount: hasMileageExpense
          ? `£${(Math.random() * 100 + 50).toFixed(2)}`
          : hasFuelExpense
            ? `£${(Math.random() * 150 + 80).toFixed(2)}`
            : undefined
      });
    }

    return weeks;
  };

  const weeks = generateMockWeekData();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthWeeks = weeks.filter(w => {
    const weekDate = new Date(w.weekEnding);
    return weekDate.getMonth() === currentMonth && weekDate.getFullYear() === currentYear;
  });

  const parseAmount = (amount) => {
    if (!amount) return 0;
    return parseFloat(amount.replace(/[£,]/g, '')) || 0;
  };

  const totalEarnings = weeks
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.totalAmount), 0);

  const thisMonthEarnings = thisMonthWeeks
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.totalAmount), 0);

  const totalHours = weeks
    .filter(w => w.status === 'approved' || w.status === 'submitted')
    .reduce((sum, w) => sum + (w.totalHours || 0), 0);

  const thisMonthHours = thisMonthWeeks
    .filter(w => w.status === 'approved' || w.status === 'submitted')
    .reduce((sum, w) => sum + (w.totalHours || 0), 0);

  const totalExpenses = weeks
    .filter(w => w.expenseStatus === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0);

  const thisMonthExpenses = thisMonthWeeks
    .filter(w => w.expenseStatus === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0);

  // Helper function for formatting week ranges
  const formatWeekRange = (weekStart, weekEnding) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnding);

    const startDay = start.getDate();
    const endDay = end.getDate();

    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const endMonth = end.toLocaleString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${endMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  // Filter weeks based on search and status
  const filteredWeeks = useMemo(() => {
    return weeks.filter(week => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        formatWeekRange(week.weekStart, week.weekEnding).toLowerCase().includes(searchQuery.toLowerCase()) ||
        week.weekEnding.includes(searchQuery);

      // Status filter
      const weekStatus = activeTab === 'expenses' ? (week.expenseStatus || 'not-started') : week.status;
      const matchesStatus = statusFilter === 'all' || weekStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [weeks, searchQuery, statusFilter, activeTab]);

  // Group filtered weeks by year
  const weeksByYear = filteredWeeks.reduce((acc, week) => {
    if (!acc[week.year]) {
      acc[week.year] = [];
    }
    acc[week.year].push(week);
    return acc;
  }, {});

  const sortedYears = Object.keys(weeksByYear).map(Number).sort((a, b) => b - a);

  const commonStats = useMemo(() => [
    {
      key: "hours",
      value: totalHours.toFixed(1),
      valueText: "Hours",
      icon: "Timer",
      color: "blue",
    },
    {
      key: "earnings",
      value: `£${totalEarnings.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      valueText: "",
      icon: "CircleDollarSign",
      color: "emerald",
    },
  ], [totalHours, totalEarnings]);

  const tabSpecificStats = useMemo(() => {
    if (activeTab === "timesheets") {
      return [
        {
          key: "submitted",
          value: weeks.filter(w => w.status !== "not-started").length,
          valueText: "Submitted",
          icon: "Clock",
          color: "purple",
        },
        {
          key: "approved",
          value: weeks.filter(w => w.status === "approved").length,
          valueText: "Approved",
          icon: "Award",
          color: "purple",
        },
      ];
    }

    // expenses
    return [
      {
        key: "claimed",
        value: totalExpenses.toFixed(2),
        valueText: "Claimed",
        icon: "Fuel",
        color: "purple",
      },
      {
        key: "approved-expenses",
        value: weeks.filter(w => w.expenseStatus === "approved").length,
        valueText: "Approved",
        icon: "Award",
        color: "purple",
      },
    ];
  }, [activeTab, weeks, totalExpenses]);

  const quickStats = useMemo(
    () => [...tabSpecificStats, ...commonStats],
    [tabSpecificStats, commonStats]
  );

  // these stats should come from backend in fututre 
  const getTimesheetStats = ({
    weeks,
    thisMonthWeeks,
    thisMonthEarnings,
    thisMonthHours,
    totalEarnings,
  }) => [
      {
        label: "This Month",
        value: `£${thisMonthEarnings.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: "DollarSign",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        subLabel: `${thisMonthWeeks.filter(w => w.status === "approved").length} weeks approved`,
      },

      {
        label: "This Month Hours",
        value: thisMonthHours.toFixed(1),
        icon: "Timer",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subLabel: `${(thisMonthHours / 40).toFixed(1)} weeks equivalent`,
      },

      {
        label: "Pending Approval",
        value: weeks.filter(w => w.status === "submitted").length,
        icon: "Clock",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subLabel: `${weeks
          .filter(w => w.status === "submitted")
          .reduce((sum, w) => sum + (w.totalHours || 0), 0)
          .toFixed(1)} hours pending`,
      },

      {
        label: "All Time",
        value: `£${totalEarnings.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: "Award",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        subLabel: `${weeks.filter(w => w.status === "approved").length} weeks approved`,
      },
    ];

  const getExpenseStats = ({
    weeks,
    thisMonthWeeks,
    thisMonthExpenses,
    parseAmount,
  }) => [
      {
        label: "This Month",
        value: `£${thisMonthExpenses.toFixed(2)}`,
        icon: "Fuel",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        subLabel: `${thisMonthWeeks.filter(w => w.expenseStatus === "approved").length} claims approved`,
      },

      {
        label: "Fuel Claims",
        value: weeks.filter(w => w.expenseType === "fuel").length,
        icon: "Fuel",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        subLabel: `£${weeks
          .filter(w => w.expenseType === "fuel")
          .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
          .toFixed(2)} total`,
      },

      {
        label: "Mileage Claims",
        value: weeks.filter(w => w.expenseType === "mileage").length,
        icon: "Car",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subLabel: `£${weeks
          .filter(w => w.expenseType === "mileage")
          .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
          .toFixed(2)} total`,
      },

      {
        label: "Pending Approval",
        value: weeks.filter(w => w.expenseStatus === "submitted").length,
        icon: "Clock",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subLabel: `£${weeks
          .filter(w => w.expenseStatus === "submitted")
          .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
          .toFixed(2)} pending`,
      },
    ];

  const primaryStats =
    activeTab === "timesheets"
      ? getTimesheetStats({
        weeks,
        thisMonthWeeks,
        thisMonthEarnings,
        thisMonthHours,
        totalEarnings,
      })
      : getExpenseStats({
        weeks,
        thisMonthWeeks,
        thisMonthExpenses,
        parseAmount,
      });

  const isCurrentWeek = (weekEnding) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const currentWeekEnding = new Date(today);
    currentWeekEnding.setDate(today.getDate() + daysUntilSunday);
    currentWeekEnding.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekEnding);
    weekEnd.setHours(0, 0, 0, 0);

    return weekEnd.getTime() === currentWeekEnding.getTime();
  };

  const isFutureWeek = (weekEnding) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekEnding);
    weekEnd.setHours(0, 0, 0, 0);
    return weekEnd > today;
  };

  // Get mini calendar for week
  const getWeekDays = (weekStart, weekEnding) => {
    const days = [];
    const start = new Date(weekStart);
    const end = new Date(weekEnding);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        day: d.toLocaleString('en-US', { weekday: 'short' }),
        date: d.getDate()
      });
    }
    return days;
  };

  return (
    <div className='space-y-6 container mx-auto'>
      <PageHeader
        icon="Film"
        title={"My Timesheet and Expenses"}
        initials={"LK"}
        subtitle={`Luke green - Electrical`}
      />
      <div className="flex items-center gap-3 mt-2">
        {quickStats.map(stat => (
          <MiniInfoPills
            key={stat.key}
            value={stat.value}
            valueText={stat.valueText}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      <FilterPillTabs
        options={[
          { value: "timesheets", label: "Timesheets", icon: "Clock" },
          { value: "expenses", label: "Fuel and Mileage", icon: "Fuel" },
        ]}
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
      />
      <PrimaryStats stats={primaryStats} gridColumns={4} />

      <div>
        <div className='grid grid-cols-[1fr_auto_auto] gap-3'>
          <SearchBar placeholder={"Search weeks"} value={searchQuery} onValueChange={(e) => setSearchQuery(e.target.value)} className={"w-full"} />
          <FilterPillTabs
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "approved",
                label: "Approved",
              },
              {
                value: "submitted",
                label: "Pending",
              },
              {
                value: "draft",
                label: "Draft",
              },
              {
                value: "not-started",
                label: "New",
              },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            transparentBg={false}
          />
          <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
        </div>
        <div className='flex flex-row items-center justify-between py-2 border-b'>
          {filteredWeeks.length !== weeks.length && (
            <div className="text-center">
              <span className={`text-sm text-muted-foreground`}>
                Showing <span className="font-bold text-purple-600">{filteredWeeks.length}</span> of {weeks.length} weeks
              </span>
            </div>
          )}

          {(searchQuery || statusFilter !== 'all') && (
            <div className="flex items-center gap-2 pt-4">
              <span className="text-xs font-bold text-gray-500">Active filters:</span>
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Search: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-200 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400 capitalize">Status: {statusFilter}</span>
                  <button onClick={() => setStatusFilter('all')} className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              // className="ml-2 text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        {sortedYears.length > 0 ? (
          <div className="space-y-6">
            {sortedYears.map((year, yearIdx) => {
              const yearWeeks = weeksByYear[year].sort((a, b) =>
                new Date(b.weekEnding).getTime() - new Date(a.weekEnding).getTime()
              );
              const isExpanded = expandedYears.includes(year);

              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: yearIdx * 0.1 }}
                  className={`bg-card rounded-2xl border shadow-xl overflow-hidden`}
                >
                  {/* Year Header */}
                  <button
                    // onClick={() => toggleYear(year)}
                    className={`w-full px-8 py-6 flex items-center justify-between transition-all bg-background hover:bg-gray-100 dark:bg-gray-950 border-b group`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h2 className={`text-2xl font-black`}>{year}</h2>
                        <span className={`text-sm text-muted-foreground font-semibold`}>
                          {yearWeeks.length} week{yearWeeks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className={`w-6 h-6 text-muted-foreground`} />
                    </motion.div>
                  </button>

                  {/* Week Cards */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {viewMode === 'grid' ? (
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {yearWeeks.map((week, idx) => (
                              <WeekCard
                                key={idx}
                                week={{
                                  ...week,
                                  range: formatWeekRange(week.weekStart, week.weekEnding),
                                }}
                                view={viewMode}
                                mode={activeTab}
                                isCurrent={isCurrentWeek(week.weekEnding)}
                                isFuture={isFutureWeek(week.weekEnding)}
                                weekDays={getWeekDays(week.weekStart, week.weekEnding)}
                                onClick={(weekEnding) => {
                                  // Handle week click
                                  console.log('Week clicked:', weekEnding);
                                }}
                                onDownloadPDF={(weekEnding) => {
                                  // Handle PDF download
                                  console.log('Download PDF for:', weekEnding);
                                }}
                                onViewExpenses={(weekEnding) => {
                                  // Handle view expenses
                                  console.log('View expenses for:', weekEnding);
                                }}
                                onEditExpenses={(weekEnding) => {
                                  // Handle edit expenses
                                  console.log('Edit expenses for:', weekEnding);
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 space-y-3">
                            {yearWeeks.map((week, idx) => (
                              <WeekCard
                                key={idx}
                                week={{
                                  ...week,
                                  range: formatWeekRange(week.weekStart, week.weekEnding),
                                }}
                                view={viewMode}
                                mode={activeTab}
                                isCurrent={isCurrentWeek(week.weekEnding)}
                                isFuture={isFutureWeek(week.weekEnding)}
                                onClick={(weekEnding) => {
                                  // Handle week click
                                  console.log('Week clicked:', weekEnding);
                                }}
                                onDownloadPDF={(weekEnding) => {
                                  // Handle PDF download
                                  console.log('Download PDF for:', weekEnding);
                                }}
                                onViewExpenses={(weekEnding) => {
                                  // Handle view expenses
                                  console.log('View expenses for:', weekEnding);
                                }}
                                onEditExpenses={(weekEnding) => {
                                  // Handle edit expenses
                                  console.log('Edit expenses for:', weekEnding);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card rounded-2xl border  p-16 text-center shadow-xl`}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <FileText className={`w-12 h-12 text-muted-foreground`} />
            </div>
            <h3 className={`text-xl font-black  mb-3`}>
              {searchQuery || statusFilter !== 'all' ? 'No Results Found' : 'No Timesheets Yet'}
            </h3>
            <p className={`text-muted-foreground mb-6 max-w-md mx-auto`}>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Your timesheets will appear here once you start creating them.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProjectTimesheets







