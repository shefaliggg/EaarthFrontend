import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/shared/config/utils';
import { Badge } from '../../../shared/components/ui/badge';

export function RecentTasks({ isDarkMode }) {
  const tasks = [
    {
      id: 1,
      title: 'Submit timesheet for Week 47',
      project: 'AVATAR 3',
      dueDate: 'Today',
      priority: 'High Priority',
      completed: false
    },
    {
      id: 2,
      title: 'Review and sign safety protocols',
      project: 'AVATAR 3',
      dueDate: 'Tomorrow',
      priority: 'High Priority',
      completed: false
    },
    {
      id: 3,
      title: 'Update equipment checklist',
      project: 'WARWULF',
      dueDate: 'Dec 3',
      priority: null,
      completed: false
    },
    {
      id: 4,
      title: 'Complete orientation module',
      project: 'AVATAR 3',
      dueDate: 'Nov 20',
      priority: null,
      completed: true
    }
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn(
          "text-lg font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <CheckCircle2 className="w-5 h-5 text-purple-600" />
          Recent Tasks
        </h2>
        <button className="text-xs font-bold text-purple-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
              task.completed
                ? isDarkMode
                  ? "bg-gray-800/30 border-gray-700 opacity-60"
                  : "bg-gray-50 border-gray-200 opacity-60"
                : isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex items-start gap-3">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className={cn(
                  "w-5 h-5 flex-shrink-0 mt-0.5",
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                )} />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={cn(
                    "font-bold text-sm",
                    task.completed
                      ? "line-through"
                      : "",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {task.title}
                  </p>
                  {task.priority && !task.completed && (
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30 text-xs flex-shrink-0">
                      {task.priority}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-purple-600 font-bold uppercase tracking-wider">
                    {task.project}
                  </span>
                  <span className={cn(
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  )}>
                    •
                  </span>
                  <span className={cn(
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {task.dueDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}