import React, { useMemo, useState } from 'react'
import { PageHeader } from '../../../../shared/components/PageHeader'
import { Award, CircleDollarSign, Timer } from 'lucide-react';
import MiniInfoPills from '../../../../shared/components/badges/MiniInfoPills';

function ProjectTimesheets() {
  const [expandedYears, setExpandedYears] = useState([new Date().getFullYear()]);
  const [activeTab, setActiveTab] = useState('timesheets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

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

  const quickStats = [
    {
      key: "approved",
      value: weeks.filter(w => w.status === "approved").length,
      valueText: "Approved",
      icon: "Award",
      color: "purple",
    },
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
  ];

  return (
    <div className='space-y-6 container mx-auto'>
      <PageHeader
        icon="Film"
        title={"MY TIMESHEETS & EXPENSES"}
        initials={"LK"}
        subtitle={`LUKE GREENAN - ELECTRICAL - SHOOTING ELECTRICAL`}
      />
      <div className="flex items-center gap-3">
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
    </div>
  )
}

export default ProjectTimesheets







