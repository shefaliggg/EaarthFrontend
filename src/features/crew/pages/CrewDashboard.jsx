import React from 'react';
import {
  Film, Calendar, Eye, AlertCircle, CheckCircle2,
  Download, DollarSign, Clock, TrendingUp, Users
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';
import { toast } from 'sonner';
import { PageHeader } from '../../../shared/components/PageHeader';

// Import the full pages
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

  const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    trend,
    trendLabel,
    color = 'text-primary'
  }) => (
    <div className={cn(
      "p-6 rounded-xl border transition-all hover:shadow-md",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-3 rounded-xl",
          isDarkMode ? "bg-primary/20" : "bg-primary/10"
        )}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend >= 0 
              ? "text-green-600 bg-green-500/10" 
              : "text-red-600 bg-red-500/10"
          )}>
            <TrendingUp className={cn("w-3 h-3", trend < 0 && "rotate-180")} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className={cn(
          "text-3xl font-black mb-1",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {value}
        </p>
        <p className={cn(
          "text-xs uppercase font-bold tracking-wider",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {label}
        </p>
        {trendLabel && (
          <p className={cn(
            "text-xs mt-1",
            isDarkMode ? "text-gray-500" : "text-gray-400"
          )}>
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="px-4">
      <div className="space-y-6">
        
        {/* Page Header */}
        <PageHeader 
          title="CREW DASHBOARD"
          subtitle={`Welcome back, ${userData.name} • ${userData.role}`}
          icon="Users"
        />

        {/* Profile Completion Alert */}
        {userData.profileCompletion < 100 && (
          <div className={cn(
            "p-4 rounded-xl border flex items-center justify-between",
            isDarkMode
              ? "bg-amber-900/20 border-amber-500/30"
              : "bg-amber-50 border-amber-200"
          )}>
            <div className="flex items-center gap-3">
              <AlertCircle className={cn(
                "w-5 h-5",
                isDarkMode ? "text-amber-400" : "text-amber-600"
              )} />
              <div>
                <p className={cn(
                  "font-bold text-sm",
                  isDarkMode ? "text-amber-300" : "text-amber-900"
                )}>
                  Profile {userData.profileCompletion}% Complete
                </p>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to receive more job opportunities
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.info('Opening profile editor...')}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              COMPLETE PROFILE
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Active Projects" 
            value={stats.activeProjects} 
            icon={Film}
            color="text-primary"
          />
          <StatCard 
            label="Upcoming Call Times" 
            value={stats.upcomingCalls} 
            icon={Clock}
            color="text-green-600"
          />
          <StatCard 
            label="Profile Views" 
            value={stats.profileViews} 
            icon={Eye}
            trend={22}
            trendLabel="vs. last month"
            color="text-purple-600"
          />
          <StatCard 
            label="Days Booked" 
            value={stats.daysBooked} 
            icon={Calendar}
            trend={18}
            trendLabel="vs. last year"
            color="text-orange-600"
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

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Projects Completed" 
            value={stats.projectsCompleted} 
            icon={CheckCircle2}
            trendLabel="Career total"
            color="text-green-600"
          />
          <StatCard 
            label="Portfolio Downloads" 
            value={stats.portfolioDownloads} 
            icon={Download}
            trendLabel="This month"
            color="text-blue-600"
          />
          <StatCard 
            label="Monthly Income" 
            value={`$${stats.monthlyIncome.toLocaleString()}`} 
            icon={DollarSign}
            trend={8}
            trendLabel="vs. last month"
            color="text-green-600"
          />
          <StatCard 
            label="Available Days" 
            value={stats.availabilityDays} 
            icon={Calendar}
            trendLabel="Next 30 days"
            color="text-purple-600"
          />
        </div>

      </div>
    </div>
  );
}