import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar, FileText, Users, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function NotificationsPanel({ isOpen, onClose }) {
  const [filter, setFilter] = useState('all');
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'document',
      title: 'DOCUMENT EXPIRING SOON',
      message: 'Your passport will expire in 4 months. Please update your documents.',
      timestamp: '5 minutes ago',
      read: false,
      icon: FileText,
      color: 'text-red-600',
    },
    {
      id: 2,
      type: 'calendar',
      title: 'NEW CALENDAR EVENT',
      message: 'Agent Shukla created event: Avatar shooting @ Mumbai, India',
      timestamp: '1 hour ago',
      read: false,
      icon: Calendar,
      color: 'text-[#9333ea]',
      project: 'AVATAR 1',
    }
  ]);

  console.log("first")

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#faf5ff] dark:bg-slate-950 p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#faf5ff] dark:bg-gray-900 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#9333ea] dark:text-[#e9d5ff]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">NOTIFICATIONS</h2>
                    <p className="text-sm text-gray-500">{unreadCount} unread</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white dark:bg-[#9333ea] text-[#9333ea] dark:text-[#faf5ff]'
                      : 'text-foreground hover:bg-white/50'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-white dark:bg-[#9333ea] text-[#9333ea] dark:text-[#faf5ff]'
                      : 'text-foreground hover:bg-white/50'
                  }`}
                >
                  UNREAD ({unreadCount})
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-3 py-2 bg-white dark:bg-gray-900 text-[#9333ea] dark:text-[#faf5ff] rounded-lg text-sm font-medium hover:bg-[#faf5ff] transition-colors"
                  >
                    MARK ALL READ
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border shadow-md transition-all cursor-pointer group ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-slate-950'
                          : 'bg-white dark:bg-slate-900'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.read ? 'bg-gray-200 dark:bg-gray-400' : 'bg-[#e9d5ff]'
                        }`}>
                          <Icon className={`w-5 h-5 ${notification.read ? 'text-gray-500 dark:text-gray-900' : notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-medium text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 dark:text-[#faf5ff]'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#a855f7] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500 dark:text-gray-800' : 'text-gray-700 dark:text-gray-400'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{notification.timestamp}</span>
                              {notification.project && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="px-2 py-0.5 bg-[#faf5ff] text-[#9333ea] rounded text-xs font-medium">
                                    {notification.project}
                                  </span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}











