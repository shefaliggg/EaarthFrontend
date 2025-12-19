import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';
import { toast } from 'sonner';

export function NotificationsList({ isDarkMode }) {
  const notifications = [
    {
      id: 1,
      type: 'call_time',
      message: 'Call time confirmed for AVATAR 3 - Nov 28 at 6:00 AM',
      time: '3 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'opportunity',
      message: 'New job opportunity: DoP for Warner Bros project',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'profile',
      message: 'Your profile was viewed by "Universal Pictures Crew Casting"',
      time: '1 day ago',
      unread: false
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
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
          {notifications.filter(n => n.unread).length > 0 && (
            <Badge className="bg-red-500 text-white text-xs border-red-500">
              {notifications.filter(n => n.unread).length}
            </Badge>
          )}
        </h2>
        <button className="text-xs font-bold text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
              notification.unread 
                ? isDarkMode 
                  ? "bg-blue-600/10 border-blue-500/30" 
                  : "bg-blue-50 border-blue-200"
                : isDarkMode 
                  ? "bg-gray-800/50 border-gray-700" 
                  : "bg-gray-50 border-gray-200"
            )}
            onClick={() => toast.info('Opening notification...')}
          >
            <p className={cn(
              "text-sm mb-1",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {notification.message}
            </p>
            <p className={cn(
              "text-xs",
              isDarkMode ? "text-gray-500" : "text-gray-400"
            )}>
              {notification.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}