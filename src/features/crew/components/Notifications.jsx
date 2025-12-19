import React, { useState } from 'react';
import { 
  Bell, Clock, Briefcase, Eye, CheckCircle2, 
  Calendar, DollarSign, AlertCircle, Film, Users 
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';
import FilterPillTabs from '../../../shared/components/FilterPillTabs';

export default function Notifications({ isDarkMode }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'call_time',
      title: 'Call Time Confirmed',
      message: 'Call time confirmed for AVATAR 3 - Nov 28 at 6:00 AM',
      project: 'AVATAR 3',
      time: '3 hours ago',
      timestamp: '2024-11-27T15:00:00',
      unread: true,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-500/20'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'New Job Opportunity',
      message: 'DoP needed for Warner Bros Sci-Fi Thriller starting Feb 2025',
      project: 'Warner Bros',
      time: '5 hours ago',
      timestamp: '2024-11-27T13:00:00',
      unread: true,
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary/20'
    },
    {
      id: 3,
      type: 'profile',
      title: 'Profile View',
      message: 'Your profile was viewed by "Universal Pictures Crew Casting"',
      project: 'Universal Pictures',
      time: '1 day ago',
      timestamp: '2024-11-26T18:00:00',
      unread: false,
      icon: Eye,
      color: 'text-purple-600',
      bg: 'bg-purple-500/20'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $12,500 for Week 46 has been processed',
      project: 'AVATAR 3',
      time: '1 day ago',
      timestamp: '2024-11-26T10:00:00',
      unread: false,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-500/20'
    },
    {
      id: 5,
      type: 'schedule',
      title: 'Schedule Update',
      message: 'Shoot schedule updated for Week 49 - check new call times',
      project: 'AVATAR 3',
      time: '2 days ago',
      timestamp: '2024-11-25T14:00:00',
      unread: false,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-500/20'
    },
    {
      id: 6,
      type: 'task',
      title: 'Task Reminder',
      message: 'Equipment list submission due tomorrow for underwater sequence',
      project: 'AVATAR 3',
      time: '2 days ago',
      timestamp: '2024-11-25T09:00:00',
      unread: false,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-500/20'
    },
    {
      id: 7,
      type: 'contract',
      title: 'Contract Ready',
      message: 'Your contract for The Crown Season 7 is ready for review',
      project: 'The Crown',
      time: '3 days ago',
      timestamp: '2024-11-24T11:00:00',
      unread: false,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/20'
    },
    {
      id: 8,
      type: 'crew',
      title: 'Crew Update',
      message: 'New crew members added to AVATAR 3 Camera Department',
      project: 'AVATAR 3',
      time: '4 days ago',
      timestamp: '2024-11-23T16:00:00',
      unread: false,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-500/20'
    },
    {
      id: 9,
      type: 'opportunity',
      title: 'Job Opportunity',
      message: 'Camera Operator needed for Netflix Limited Series',
      project: 'Netflix',
      time: '5 days ago',
      timestamp: '2024-11-22T13:00:00',
      unread: false,
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary/20'
    },
    {
      id: 10,
      type: 'project',
      title: 'Project Milestone',
      message: 'AVATAR 3 has completed 50% of principal photography',
      project: 'AVATAR 3',
      time: '1 week ago',
      timestamp: '2024-11-20T10:00:00',
      unread: false,
      icon: Film,
      color: 'text-green-600',
      bg: 'bg-green-500/20'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: Bell },
    { value: 'call_time', label: 'Call Times', icon: Clock },
    { value: 'opportunity', label: 'Opportunities', icon: Briefcase },
    { value: 'payment', label: 'Payments', icon: DollarSign },
    { value: 'schedule', label: 'Schedule', icon: Calendar },
    { value: 'task', label: 'Tasks', icon: AlertCircle },
    { value: 'profile', label: 'Profile', icon: Eye },
    { value: 'contract', label: 'Contracts', icon: CheckCircle2 },
    { value: 'crew', label: 'Crew', icon: Users },
    { value: 'project', label: 'Projects', icon: Film }
  ];

  const filteredNotifications = notifications.filter(notification => {
    // Status filter
    if (statusFilter === 'unread' && !notification.unread) return false;
    if (statusFilter === 'read' && notification.unread) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-lg font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Bell className="w-5 h-5 text-primary" />
          NOTIFICATIONS
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
              {unreadCount}
            </Badge>
          )}
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Status Filter */}
        <div>
          <p className={cn(
            "text-xs font-bold uppercase tracking-wider mb-2",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Status
          </p>
          <FilterPillTabs
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {/* Type Filter */}
        <div>
          <p className={cn(
            "text-xs font-bold uppercase tracking-wider mb-2",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Type
          </p>
          <FilterPillTabs
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                notification.unread 
                  ? isDarkMode 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-primary/5 border-primary/20"
                  : isDarkMode 
                    ? "bg-gray-800/50 border-gray-700" 
                    : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  notification.bg
                )}>
                  <Icon className={cn("w-4 h-4", notification.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-black text-sm",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      
                      {notification.project && (
                        <Badge className="bg-primary/20 text-primary text-xs font-bold border-primary/30 mt-1">
                          {notification.project}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
                    </p>
                  </div>
                  
                  <p className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}