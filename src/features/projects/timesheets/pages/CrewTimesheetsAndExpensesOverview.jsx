import React, { useMemo, useState } from 'react'
import { PageHeader } from '../../../../shared/components/PageHeader'
import { ArrowUpRight, Award, Calendar, Car, ChevronDown, CircleDollarSign, DollarSign, Download, Eye, Fuel, Plus, Timer, X, Zap } from 'lucide-react';
import MiniInfoPills from '../../../../shared/components/badges/MiniInfoPills';
import FilterPillTabs from '../../../../shared/components/FilterPillTabs';
import PrimaryStats from '../../../../shared/components/wrappers/PrimaryStats';
import SearchBar from '../../../../shared/components/SearchBar';
import ViewToggleButton from '../../../../shared/components/buttons/ViewToggleButton';
import { Button } from '../../../../shared/components/ui/button';
import { WeekCard } from '../components/WeekCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { StatusBadge } from '../../../../shared/components/badges/StatusBadge';
import { useLocation, useMatch, useParams } from 'react-router-dom';
import { AutoHeight } from '../../../../shared/components/wrappers/AutoHeight';


function CrewTimesheetsOverview() {
  const params = useParams();
  const location = useLocation();
  const isFuelAndMileageRoute = useMatch(`/projects/${params.projectName}/fuel-mileage`);
  const isPettyCashRoute = useMatch(`/projects/${params.projectName}/petty-cash`);
  const activeTab = isFuelAndMileageRoute ? "expenses" : isPettyCashRoute ? "petty-cash" : "timesheets";
  const currentTab = location.pathname

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const generateMockWeekData = () => {
    const weeks = [];
    const currentDate = new Date();

    // Generate 20 weeks of data (8 past, current, 11 future)
    for (let i = -8; i <= 11; i++) {
      const weekEnd = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      weekEnd.setDate(currentDate.getDate() + daysUntilSunday + (i * 7));

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);

      let status = 'not-started';
      let expenseStatus = 'not-started';

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

      // Add Petty Cash Data
      let pettyCashStatus = 'not-started';
      if (i < -2) {
        pettyCashStatus = Math.random() > 0.4 ? 'approved' : 'not-started';
      } else if (i === -2 || i === -1) {
        pettyCashStatus = Math.random() > 0.6 ? 'submitted' : 'draft';
      } else if (i === 0) {
        pettyCashStatus = 'not-started';
      }

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
            : undefined,
        pettyCashStatus,
        pettyCashAmount: pettyCashStatus !== 'not-started' ? `£${(Math.random() * 200 + 20).toFixed(2)}` : undefined
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

  const totalPettyCash = weeks
    .filter(w => w.pettyCashStatus === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.pettyCashAmount), 0);

  const thisMonthPettyCash = thisMonthWeeks
    .filter(w => w.pettyCashStatus === 'approved')
    .reduce((sum, w) => sum + parseAmount(w.pettyCashAmount), 0);

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

  const commonPrimaryStats = [
    {
      label: "Total Hours",
      value: `${totalHours.toFixed(1)} h`,
      icon: "Timer",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      // subLabel: "All time",
    },
    {
      label: "Total Earnings",
      value: `£${totalEarnings.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: "PoundSterling",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      // subLabel: "All time",
    },
  ];

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
        // subLabel: `${thisMonthWeeks.filter(w => w.status === "approved").length} weeks approved`,
      },

      {
        label: "This Month",
        value: `${thisMonthHours.toFixed(1)} h`,
        icon: "Timer",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        // subLabel: `${(thisMonthHours / 40).toFixed(1)} weeks equivalent`,
      },

      {
        label: "Submitted",
        value: weeks.filter(w => w.status !== "not-started").length,
        icon: "Clock",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },

      {
        label: "Approved",
        value: weeks.filter(w => w.status === "approved").length,
        icon: "Award",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },

      {
        label: "Pending Approval",
        value: weeks.filter(w => w.status === "submitted").length,
        icon: "Clock",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        // subLabel: `${weeks
        //   .filter(w => w.status === "submitted")
        //   .reduce((sum, w) => sum + (w.totalHours || 0), 0)
        //   .toFixed(1)} hours pending`,
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
        // subLabel: `${weeks.filter(w => w.status === "approved").length} weeks approved`,
      },

      ...commonPrimaryStats,
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
        // subLabel: `${thisMonthWeeks.filter(w => w.expenseStatus === "approved").length} claims approved`,
      },

      {
        label: "Fuel Claims",
        value: weeks.filter(w => w.expenseType === "fuel").length,
        icon: "Fuel",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        // subLabel: `£${weeks
        //   .filter(w => w.expenseType === "fuel")
        //   .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
        //   .toFixed(2)} total`,
      },

      {
        label: "Mileage Claims",
        value: weeks.filter(w => w.expenseType === "mileage").length,
        icon: "Car",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        // subLabel: `£${weeks
        //   .filter(w => w.expenseType === "mileage")
        //   .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
        //   .toFixed(2)} total`,
      },

      {
        label: "Pending Approval",
        value: weeks.filter(w => w.expenseStatus === "submitted").length,
        icon: "Clock",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        // subLabel: `£${weeks
        //   .filter(w => w.expenseStatus === "submitted")
        //   .reduce((sum, w) => sum + parseAmount(w.expenseAmount), 0)
        //   .toFixed(2)} pending`,
      },

      {
        label: "Approved Claims",
        value: weeks.filter(w => w.expenseStatus === "approved").length,
        icon: "Award",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },
      {
        label: "Total Claimed",
        value: totalExpenses.toFixed(2),
        icon: "Fuel",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },
      ...commonPrimaryStats,
    ];

  const getPettyCashStats = ({
    claims,            // all petty cash claims
    thisMonthClaims,   // claims in current month
    parseAmount,
  }) => {

    const thisMonthTotal = thisMonthClaims.reduce(
      (sum, c) => sum + parseAmount(c.amount),
      0
    );

    const approvedClaims = claims.filter(c => c.status === "approved");
    const pendingClaims = claims.filter(c => c.status === "submitted");

    const approvedTotal = approvedClaims.reduce(
      (sum, c) => sum + parseAmount(c.amount),
      0
    );

    const pendingTotal = pendingClaims.reduce(
      (sum, c) => sum + parseAmount(c.amount),
      0
    );

    return [
      {
        label: "This Month",
        value: `£${thisMonthTotal.toFixed(2)}`,
        icon: "Wallet",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: `${thisMonthClaims.length} claims submitted`,
      },

      {
        label: "Approved",
        value: approvedClaims.length,
        icon: "CheckCircle2",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        // subLabel: `£${approvedTotal.toFixed(2)} reimbursed`,
      },

      {
        label: "Pending",
        value: pendingClaims.length,
        icon: "Clock",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        // subLabel: `£${pendingTotal.toFixed(2)} awaiting approval`,
      },

      {
        label: "Average Claim",
        value: `£${claims.length
          ? (claims.reduce((s, c) => s + parseAmount(c.amount), 0) / claims.length).toFixed(2)
          : "0.00"
          }`,
        icon: "BarChart3",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        // subLabel: "Typical purchase size",
      },
      {
        label: "Petty Cash Claimed",
        value: totalPettyCash.toFixed(2),
        icon: "Wallet",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },
      {
        label: "Approved Claims",
        value: claims.filter(c => c.status === "approved").length,
        icon: "Award",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        // subLabel: "All time",
      },

      ...commonPrimaryStats,
    ];
  };

  const primaryStats =
    activeTab === "timesheets"
      ? getTimesheetStats({
        weeks,
        thisMonthWeeks,
        thisMonthEarnings,
        thisMonthHours,
        totalEarnings,
      })
      : activeTab === "timesheets"
        ? getPettyCashStats({
          claims: totalPettyCash,
          thisMonthClaims: thisMonthPettyCash,
          parseAmount,
        })
        : getExpenseStats({
          weeks,
          thisMonthWeeks,
          thisMonthExpenses,
          parseAmount,
        });

  const getCurrentWeekEnding = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const weekEnding = new Date(today);
    weekEnding.setDate(today.getDate() + daysUntilSunday);
    weekEnding.setHours(0, 0, 0, 0);

    return weekEnding;
  };

  const isCurrentWeek = (weekEnding) => {
    const currentWeekEnding = getCurrentWeekEnding();

    const weekEnd = new Date(weekEnding);
    weekEnd.setHours(0, 0, 0, 0);

    return weekEnd.getTime() === currentWeekEnding.getTime();
  };

  const isFutureWeek = (weekEnding) => {
    const currentWeekEnding = getCurrentWeekEnding();

    const weekEnd = new Date(weekEnding);
    weekEnd.setHours(0, 0, 0, 0);

    return weekEnd > currentWeekEnding;
  };

  // Get mini calendar for week
  const getWeekDays = (weekStart, weekEnding) => {
    const days = [];
    const start = new Date(weekStart);
    const end = new Date(weekEnding);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        day: d.toLocaleString("en-US", { weekday: "short" }),
        date: d.getDate(),

        // ✅ real date for comparisons (today highlight, etc.)
        fullDate: new Date(d).toISOString().split("T")[0],
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
      <FilterPillTabs
        options={[
          { label: "Timesheets", icon: "Clock", route: `/projects/${params.projectName}/timesheets` },
          { label: "Fuel and Mileage", icon: "Fuel", route: `/projects/${params.projectName}/fuel-mileage` },
          { label: "Petty Cash", icon: "Banknote", route: `/projects/${params.projectName}/petty-cash` },
        ]}
        value={currentTab}
        navigatable
      />

      <PrimaryStats stats={primaryStats} gridColumns={8} gridGap={2} useSecondaryCard={true} />

      <AutoHeight>
        <div className='grid grid-cols-[1fr_auto_auto] items-center gap-3'>
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
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </AutoHeight>

      <Accordion
        type="single"
        defaultValue={String(new Date().getFullYear())}
        className="space-y-3"
      >
        {sortedYears.map((year) => {
          const yearWeeks = weeksByYear[year]

          const futureWeeks = yearWeeks.filter(w => isFutureWeek(w.weekEnding)).sort(
            (a, b) =>
              new Date(a.weekEnding).getTime() -
              new Date(b.weekEnding).getTime()
          );

          const currentWeek = yearWeeks.find(w => isCurrentWeek(w.weekEnding))
          const pastWeeks = yearWeeks.filter(
            w => !isFutureWeek(w.weekEnding) && !isCurrentWeek(w.weekEnding)
          ).sort(
            (a, b) =>
              new Date(b.weekEnding).getTime() -
              new Date(a.weekEnding).getTime()
          );

          const spotlightPast = pastWeeks[0] || null;       // most recent past
          const spotlightFuture = futureWeeks.slice(0, 2); // next 2 weeks

          const spotlightWeeks = [
            spotlightPast,
            currentWeek,
            ...spotlightFuture,
          ].filter(Boolean);

          // remove spotlight from accordions
          const remainingPastWeeks = spotlightPast
            ? pastWeeks.slice(1)
            : pastWeeks;

          const remainingFutureWeeks = futureWeeks.slice(2);

          let defaultInnerSection = undefined;
          if (currentWeek) {
            defaultInnerSection = "current";
          } else if (pastWeeks.length > 0) {
            defaultInnerSection = "past";
          } else if (futureWeeks.length > 0) {
            defaultInnerSection = "future";
          }

          return (
            <AccordionItem
              key={year}
              value={String(year)}
              className="bg-background rounded-2xl border shadow-xl overflow-hidden"
            >
              {/* Year Header */}
              <AccordionTrigger className="px-8 py-6 hover:no-underline bg-background border-b group">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>

                    <div className="text-left">
                      <h2 className="text-2xl font-black">{year}</h2>
                      <span className="text-sm text-muted-foreground font-semibold">
                        {yearWeeks.length} week
                        {yearWeeks.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/* Year Content */}
              <AccordionContent className="p-6 space-y-4">
                {/* spotlight weeks */}
                {spotlightWeeks.length > 0 && (
                  <div className={`grid grid-cols-1 gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 " : ""}`}>
                    {spotlightWeeks.map((week, idx) => {
                      const isCurrent = isCurrentWeek(week.weekEnding);
                      const isFuture = isFutureWeek(week.weekEnding);

                      return (
                        <WeekCard
                          key={idx}
                          week={{
                            ...week,
                            range: formatWeekRange(week.weekStart, week.weekEnding),
                          }}
                          view={viewMode}
                          mode={activeTab}
                          isCurrent={isCurrent}
                          isFuture={isFuture}
                          weekDays={getWeekDays(week.weekStart, week.weekEnding)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* future weeks */}
                <Accordion type="single" collapsible defaultValue={defaultInnerSection}>
                  {remainingFutureWeeks.length > 0 && (

                    <AccordionItem value="future">
                      <AccordionTrigger
                        className="hover:no-underline hover:text-primary cursor-pointer"
                      >
                        <span className='flex gap-2 items-center'>
                          Future Weeks
                          <StatusBadge status={'information'} label={`Total ${remainingFutureWeeks.length}`} size="sm" />
                          <StatusBadge status={'pending'} label={`${remainingFutureWeeks.filter(week => {
                            const displayStatus =
                              activeTab === "expenses"
                                ? week.expenseStatus || "not-started"
                                : activeTab === "petty-cash"
                                  ? week.pettyCashStatus || 'not-started'
                                  : week.status

                            return displayStatus === "draft"
                          }).length} Draft`} size="sm" />
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="py-4 space-y-2">
                        <div className={`grid grid-cols-1 gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 " : ""}`}>
                          {remainingFutureWeeks.map((week, idx) => (
                            <WeekCard
                              key={idx}
                              week={{
                                ...week,
                                range: formatWeekRange(
                                  week.weekStart,
                                  week.weekEnding
                                ),
                              }}
                              view={viewMode}
                              mode={activeTab}
                              isFuture
                              weekDays={getWeekDays(
                                week.weekStart,
                                week.weekEnding
                              )}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Past weeks */}
                  {remainingPastWeeks.length > 0 && (
                    <AccordionItem value="past">
                      <AccordionTrigger
                        className="hover:no-underline hover:text-primary cursor-pointer"
                      >
                        <span className='flex gap-2 items-center'>
                          Past Weeks
                          <StatusBadge status={'information'} label={`Total ${remainingPastWeeks.length}`} size="sm" />
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="py-4 space-y-2">
                        <div className={`grid grid-cols-1 gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 " : ""}`}>
                          {remainingPastWeeks.map((week, idx) => (
                            <WeekCard
                              key={idx}
                              week={{
                                ...week,
                                range: formatWeekRange(
                                  week.weekStart,
                                  week.weekEnding
                                ),
                              }}
                              view={viewMode}
                              mode={activeTab}
                              weekDays={getWeekDays(
                                week.weekStart,
                                week.weekEnding
                              )}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  )
}

export default CrewTimesheetsOverview