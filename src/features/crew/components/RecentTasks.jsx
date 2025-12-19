import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';

export default function RecentTasks({ isDarkMode }) {
  const [filter, setFilter] = useState('all');

  const tasks = [
    {
      id: 1,
      title: 'Submit Equipment List',
      project: 'AVATAR 3',
      description: 'Provide detailed equipment requirements for underwater sequence',
      dueDate: '2024-11-27',
      status: 'completed',
      completedDate: '2024-11-26',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Review Call Sheet',
      project: 'AVATAR 3',
      description: 'Review and confirm call sheet for Nov 28 shoot',
      dueDate: '2024-11-27',
      status: 'completed',
      completedDate: '2024-11-27',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Tech Scout Prep',
      project: 'The Crown',
      description: 'Prepare measurement tools and notes for Lancaster House scout',
      dueDate: '2024-12-01',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Update Availability',
      project: 'General',
      description: 'Update calendar availability for Q1 2025',
      dueDate: '2024-11-25',
      status: 'overdue',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Insurance Documents',
      project: 'AVATAR 3',
      description: 'Submit proof of liability insurance',
      dueDate: '2024-11-30',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 6,
      title: 'Equipment Maintenance',
      project: 'General',
      description: 'Service camera equipment before next shoot',
      dueDate: '2024-12-05',
      status: 'pending',
      priority: 'low'
    },
    {
      id: 7,
      title: 'Timesheet Submission',
      project: 'AVATAR 3',
      description: 'Submit timesheet for Week 46',
      dueDate: '2024-11-24',
      status: 'completed',
      completedDate: '2024-11-24',
      priority: 'high'
    },
    {
      id: 8,
      title: 'Contract Review',
      project: 'The Crown',
      description: 'Review and sign contract for Season 7',
      dueDate: '2024-11-28',
      status: 'pending',
      priority: 'high'
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30'
    },
    pending: {
      icon: Clock,
      color: 'text-primary',
      bg: 'bg-primary/20',
      border: 'border-primary/30'
    },
    overdue: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30'
    }
  };

  const priorityConfig = {
    high: { color: 'text-red-600', label: 'HIGH', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    medium: { color: 'text-amber-600', label: 'MEDIUM', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    low: { color: 'text-gray-600', label: 'LOW', bg: 'bg-gray-500/10', border: 'border-gray-500/30' }
  };


  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-lg font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <CheckCircle2 className="w-5 h-5 text-primary" />
          RECENT TASKS
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'completed'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold text-xs transition-all",
              filter === filterOption
                ? "bg-primary text-white"
                : isDarkMode
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white"
                  : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-900"
            )}
          >
            {filterOption.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const StatusIcon = statusConfig[task.status].icon;
          return (
            <div
              key={task.id}
              className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-md",
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  statusConfig[task.status].bg,
                  statusConfig[task.status].border,
                  "border"
                )}>
                  <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className="bg-primary/20 text-primary text-xs font-bold border-primary/30">
                      {task.project}
                    </Badge>
                    <Badge 
                      className={cn(
                        "text-xs font-bold border",
                        priorityConfig[task.priority].color,
                        priorityConfig[task.priority].bg,
                        priorityConfig[task.priority].border
                      )}
                    >
                      {priorityConfig[task.priority].label}
                    </Badge>
                  </div>
                  
                  <h3 className={cn(
                    "font-black mb-1 text-sm",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {task.title}
                  </h3>
                  
                  <p className={cn(
                    "text-xs mb-2",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>{task.dueDate}</span>
                    </div>
                    {task.status === 'completed' && task.completedDate && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        {task.completedDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {task.status === 'pending' && (
                <button 
                  className="w-full mt-3 px-3 py-1.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors text-xs"
                >
                  MARK COMPLETE
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}