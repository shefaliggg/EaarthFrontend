import React from 'react';
import {
  Film, Calendar, Eye, CheckCircle2,
  Download, DollarSign, Clock, Users
} from 'lucide-react';
import { cn } from '@/shared/config/utils';
// import { PageHeader } from '@/shared/components/PageHeader';
import { Card, CardContent } from '@/shared/components/ui/card';
import { PageHeader } from '../../../shared/components/PageHeader';
// import { StatCard } from '../components/StatCard';
import UpcomingSchedule from '../components/UpcomingSchedule';
import Notifications from '../components/Notifications';
import RecentTasks from '../components/RecentTasks';

function StatCard({ label, value, icon: Icon, color, trend, trendLabel, isDarkMode }) {
  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <div className="flex items-end justify-between">
          <p className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>↑ {trend}%</span>
              {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CrewDashboard({ isDarkMode = false }) {
  const userData = {
    name: 'Welcome Back, Muhammed',
    role: 'Director of Photography',
    department: 'Camera',
    memberSince: 'February 2024',
    profileCompletion: 92,
    lastUpdated: '1 week ago'
  };

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
    <div className>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
  title={userData.name}
  subtitle={`${userData.role} • ${userData.department}`}
  initials="MO"  // Or use image if you have a profile photo
  extraContents={
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span>Member since {userData.memberSince}</span>
      <span>•</span>
      <span>Profile {userData.profileCompletion}% complete</span>
    </div>
  }
  primaryAction={{
    label: "Edit Profile",
    icon: "Edit",
    clickAction: () => console.log("Edit profile")
  }}
  secondaryActions={[
    {
      label: "View Portfolio",
      icon: "ExternalLink",
      variant: "outline",
      clickAction: () => console.log("View portfolio")
    }
  ]}
/>

        {/* Stats Grid - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Active Projects" 
            value={stats.activeProjects} 
            icon={Film}
            color="text-primary"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            label="Upcoming Calls" 
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

        {/* Main Grid Layout - 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Upcoming Schedule */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}>
              <UpcomingSchedule isDarkMode={isDarkMode} />
            </div>

            {/* Recent Notifications */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}>
              <Notifications isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Tasks */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}>
              <RecentTasks isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}