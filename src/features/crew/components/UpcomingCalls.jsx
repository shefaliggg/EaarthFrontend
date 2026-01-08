import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/shared/config/utils';
import { Badge } from '../../../shared/components/ui/badge';

export function UpcomingCalls({ isDarkMode }) {
  const scheduleItems = [
    {
      id: 1,
      project: 'AVATAR 1',
      title: 'On Set',
      location: 'Studio A - Stage 5',
      date: 'Today',
      time: '08:00 AM - 6:00 PM',
      status: 'confirmed',
      statusLabel: 'confirmed'
    },
    {
      id: 2,
      project: 'AVATAR 1',
      title: 'Crew Meeting',
      location: 'Virtual - Zoom',
      date: 'Tomorrow',
      time: '10:00 AM - 11:00 AM',
      status: 'confirmed',
      statusLabel: 'confirmed'
    },
    {
      id: 3,
      project: 'WARWULF',
      title: 'Technical Rehearsal',
      location: 'Location B',
      date: 'Dec 2',
      time: '02:00 PM - 5:00 PM',
      status: 'pending',
      statusLabel: 'Pending'
    }
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn(
          "text-xl font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Calendar className="w-5 h-5 text-purple-600" />
          Upcoming Schedule
        </h2>
        <button className="text-xs font-bold text-purple-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {scheduleItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
              isDarkMode
                ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white text-xs font-bold border-purple-600 px-2 py-0.5">
                    {item.project}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-xs font-bold border px-2 py-0.5",
                      item.status === 'confirmed'
                        ? "bg-green-500/20 text-green-600 border-green-500/30"
                        : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                    )}
                  >
                    {item.statusLabel}
                  </Badge>
                </div>

                <h3 className={cn(
                  "font-black text-base mb-1",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {item.title}
                </h3>

                <p className={cn(
                  "text-sm mb-2",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {item.location}
                </p>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-4 text-xs",
              isDarkMode ? "text-gray-500" : "text-gray-400"
            )}>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{item.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}