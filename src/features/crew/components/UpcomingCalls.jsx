import React from 'react';
import { Clock, Calendar, Users, Video, Camera, FileText } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function UpcomingCalls({ isDarkMode }) {
  const upcomingCalls = [
    {
      id: 1,
      project: 'AVATAR 3',
      date: '2024-11-28',
      callTime: '06:00',
      location: 'Fox Studios - Stage 4',
      scene: 'Underwater Sequence',
      icon: Video
    },
    {
      id: 2,
      project: 'AVATAR 3',
      date: '2024-11-29',
      callTime: '07:00',
      location: 'Fox Studios - Stage 2',
      scene: 'Lab Interior',
      icon: Camera
    },
    {
      id: 3,
      project: 'The Crown',
      date: '2024-12-02',
      callTime: '08:00',
      location: 'Lancaster House',
      scene: 'Tech Scout',
      icon: FileText
    }
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <h2 className={cn(
        "text-lg font-black mb-4 flex items-center gap-2",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        <Clock className="w-5 h-5 text-blue-600" />
        Upcoming Calls
      </h2>

      <div className="space-y-3">
        {upcomingCalls.map((call) => {
          const Icon = call.icon;
          return (
            <div
              key={call.id}
              className={cn(
                "p-3 rounded-lg border",
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDarkMode ? "bg-blue-600/20" : "bg-blue-600/10"
                )}>
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                    {call.project}
                  </p>
                  <p className={cn(
                    "font-bold text-sm mb-1",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {call.scene}
                  </p>
                  <div className={cn(
                    "space-y-1 text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {call.date} at {call.callTime}
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Users className="w-3 h-3" />
                      {call.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}