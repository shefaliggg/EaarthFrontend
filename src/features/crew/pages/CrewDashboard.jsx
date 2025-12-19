import React from 'react';
import {
  Film, Calendar, Eye, CheckCircle2,
  Download, DollarSign, Clock, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '../../../shared/components/PageHeader';
import { StatCard } from '../components/StatCard';
import UpcomingSchedule from '../components/UpcomingSchedule';
import Notifications from '../components/Notifications';
import RecentTasks from '../components/RecentTasks';

export default function CrewDashboard({ isDarkMode = false }) {

  // 🔹 MOCK USER DATA
  const userData = {
    name: 'Michael Chen',
    role: 'Director of Photography',
    department: 'Camera',
    memberSince: 'February 2024',
    profileCompletion: 92,
    lastUpdated: '1 week ago'
  };

  // 🔹 MOCK STATS
  const stats = {
    activeProjects: 2,
    upcomingCalls: 5,
    projectsCompleted: 18,
    profileViews: 456,
    portfolioDownloads: 34,
    daysBooked: 45,
    monthlyIncome: 12500,
    availabilityDays: 15
  };

  return (
    <div className="px-4">
      <div className="space-y-6">
        
        {/* Page Header */}
        <PageHeader 
          title="CREW DASHBOARD"
          subtitle={`Welcome back, ${userData.name} • ${userData.role}`}
          icon="Users"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Active Projects" 
            value={stats.activeProjects} 
            icon={Film}
            color="text-primary"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            label="Upcoming Call Times" 
            value={stats.upcomingCalls} 
            icon={Clock}
            color="text-green-600"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            label="Profile Views" 
            value={stats.profileViews} 
            icon={Eye}
            trend={22}
            trendLabel="vs. last month"
            color="text-purple-600"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            label="Days Booked" 
            value={stats.daysBooked} 
            icon={Calendar}
            trend={18}
            trendLabel="vs. last year"
            color="text-orange-600"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* TWO COLUMN GRID: Upcoming Schedule + Recent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UPCOMING SCHEDULE */}
          <div className={cn(
            "rounded-xl border overflow-hidden",
            isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          )}>
            <UpcomingSchedule isDarkMode={isDarkMode} />
          </div>

          {/* RECENT TASKS */}
          <div className={cn(
            "rounded-xl border overflow-hidden",
            isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          )}>
            <RecentTasks isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* NOTIFICATIONS - Full Width */}
        <div className={cn(
          "rounded-xl border overflow-hidden",
          isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
          <Notifications isDarkMode={isDarkMode} />
        </div>

        

      </div>
    </div>
  );
}