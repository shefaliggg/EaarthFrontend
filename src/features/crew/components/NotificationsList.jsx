import React from 'react';
import { Bell, Calendar, FileText, MessageSquare } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';

export function Notifications({ isDarkMode }) {
  const notifications = [
    {
      id: 1,
      type: 'call_time',
      icon: Calendar,
      project: 'AVATAR 1',
      message: 'Call time updated for tomorrow: 7:30 AM',
      time: '2h ago',
      unread: true
    },
    {
      id: 2,
      type: 'document',
      icon: FileText,
      project: 'AVATAR 1',
      message: 'New call sheet available for review',
      time: '5h ago',
      unread: true
    },
    {
      id: 3,
      type: 'message',
      icon: MessageSquare,
      project: 'AVATAR 1',
      message: 'Director posted update in project chat',
      time: '1d ago',
      unread: false
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
          <Bell className="w-5 h-5 text-purple-600" />
          Recent Notifications
          {notifications.filter(n => n.unread).length > 0 && (
            <Badge className="bg-red-500 text-white text-xs border-red-500">
              {notifications.filter(n => n.unread).length}
            </Badge>
          )}
        </h2>
        <button className="text-xs font-bold text-purple-600 hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                notification.unread 
                  ? isDarkMode 
                    ? "bg-purple-600/10 border-purple-500/30" 
                    : "bg-purple-50 border-purple-200"
                  : isDarkMode 
                    ? "bg-gray-800/50 border-gray-700" 
                    : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  notification.unread
                    ? isDarkMode 
                      ? "bg-purple-500/20" 
                      : "bg-purple-500/10"
                    : isDarkMode 
                      ? "bg-gray-700" 
                      : "bg-gray-200"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    notification.unread ? "text-purple-600" : isDarkMode ? "text-gray-400" : "text-gray-500"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className="bg-purple-600 text-white text-xs font-bold border-purple-600 px-2 py-0.5 mb-2">
                    {notification.project}
                  </Badge>
                </div>
              </div>
              
              <p className={cn(
                "text-sm mb-2 font-medium",
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
          );
        })}
      </div>
    </div>
  );
}