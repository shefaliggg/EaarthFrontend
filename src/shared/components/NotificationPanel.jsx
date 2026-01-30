import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar, FileText, Users, CheckCircle, AlertCircle, Clock, Trash2, MessageSquare, Briefcase, Zap, AtSign, User, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapConversationType } from '../../features/projects/project-chat/components/Chattypemapper';

export function NotificationsPanel({ isOpen, onClose, projectId = 'avatar-1' }) {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const observerRef = useRef(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'document',
      title: 'DOCUMENT EXPIRING SOON',
      message: 'Your passport will expire in 4 months. Please update your documents.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      icon: FileText,
      color: 'text-red-600',
      priority: 'high',
    },
    {
      id: 2,
      type: 'calendar',
      title: 'NEW CALENDAR EVENT',
      message: 'Agent Shukla created event: Avatar shooting @ Mumbai, India',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      read: false,
      icon: Calendar,
      color: 'text-[#9333ea]',
      project: 'AVATAR 1',
      priority: 'medium',
      sender: { name: 'Agent Shukla', avatar: null, initials: 'AS', department: 'Production' },
    },
    {
      id: 3,
      type: 'team-message',
      title: 'NEW MESSAGE IN PRODUCTION TEAM',
      message: 'Sarah: Budget review meeting at 3 PM',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      read: false,
      icon: MessageSquare,
      color: 'text-blue-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "production",
      conversationType: "DEPARTMENT",
      department: "Production",
      projectId: projectId,
      sender: { name: 'Sarah Mitchell', avatar: null, initials: 'SM', department: 'Production', color: 'bg-blue-500' },
    },
    {
      id: 4,
      type: 'dm-message',
      title: 'NEW DIRECT MESSAGE',
      message: 'Marcus Johnson: Can we discuss the script changes?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      read: false,
      icon: Users,
      color: 'text-green-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "marcus",
      conversationType: "DIRECT",
      userId: "marcus",
      userName: "Marcus Johnson",
      projectId: projectId,
      sender: { name: 'Marcus Johnson', avatar: null, initials: 'MJ', department: 'Script', color: 'bg-green-500' },
    },
    {
      id: 5,
      type: 'team-message',
      title: 'MENTION IN STUNT TEAM',
      message: 'Ryan mentioned you: Need your approval on safety protocols',
      timestamp: new Date(Date.now() - 70 * 60 * 1000), // 70 minutes ago
      read: false,
      icon: MessageSquare,
      color: 'text-orange-600',
      project: 'AVATAR 1',
      mention: true,
      priority: 'high',
      conversationId: "stunts",
      conversationType: "DEPARTMENT",
      department: "Stunt Team",
      projectId: projectId,
      sender: { name: 'Ryan Cooper', avatar: null, initials: 'RC', department: 'Stunts', color: 'bg-orange-500' },
    },
    {
      id: 6,
      type: 'team-message',
      title: 'PROJECT-WIDE ANNOUNCEMENT',
      message: 'New safety protocols have been added to the handbook',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday
      read: false,
      icon: MessageSquare,
      color: 'text-purple-600',
      project: 'AVATAR 1',
      priority: 'low',
      conversationId: "all-departments",
      conversationType: "PROJECT_ALL",
      projectId: projectId,
      sender: { name: 'Admin', avatar: null, initials: 'AD', department: 'System', color: 'bg-purple-500' },
    },
  ]);

  // Smart auto-read: Mark as read after 6 seconds of visibility
  const timeoutRefs = useRef(new Map());

  useEffect(() => {
    if (!isOpen) {
      // Clear all timeouts when panel closes
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const notificationId = parseInt(entry.target.dataset.notificationId);
          
          if (entry.isIntersecting) {
            // Clear any existing timeout for this notification
            if (timeoutRefs.current.has(notificationId)) {
              clearTimeout(timeoutRefs.current.get(notificationId));
            }
            
            // Set new timeout to mark as read after 6 seconds
            const timeout = setTimeout(() => {
              markAsRead(notificationId);
              timeoutRefs.current.delete(notificationId);
            }, 6000);
            
            timeoutRefs.current.set(notificationId, timeout);
          } else {
            // Clear timeout if notification goes out of view
            if (timeoutRefs.current.has(notificationId)) {
              clearTimeout(timeoutRefs.current.get(notificationId));
              timeoutRefs.current.delete(notificationId);
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Clear all timeouts on cleanup
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, [isOpen, notifications]);

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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.type === 'team-message' || notification.type === 'dm-message') {
      onClose();
      
      const frontendType = mapConversationType(notification.conversationType);
      
      navigate(`/projects/${notification.projectId}/chat`, {
        state: {
          selectedChat: {
            id: notification.conversationId,
            type: frontendType,
            name: notification.department || notification.userName || "Project Chat",
            department: notification.department,
            userId: notification.userId,
            userName: notification.userName,
            projectId: notification.projectId,
          },
        },
      });
    }
  };

  // Advanced time formatting with Today/Yesterday
  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get time category for grouping
  const getTimeCategory = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffHours = Math.floor((now - date) / 3600000);
    
    if (diffHours < 24) return 'today';
    if (diffHours < 48) return 'yesterday';
    return 'earlier';
  };

  const getSmartIcon = (notification) => {
    if (notification.mention) return AtSign;
    if (notification.conversationType === "DIRECT") return User;
    if (notification.conversationType === "DEPARTMENT") return Users;
    return notification.icon;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-lavender-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-lavender-500';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Production': 'from-blue-500 to-blue-600',
      'Script': 'from-green-500 to-green-600',
      'Stunts': 'from-orange-500 to-orange-600',
      'System': 'from-purple-500 to-purple-600',
    };
    return colors[department] || 'from-lavender-500 to-lavender-600';
  };

  // Advanced grouping: Mentions → Today → Yesterday → Earlier
  const groupNotificationsByTime = (notifs) => {
    const groups = {
      mentions: [],
      today: [],
      yesterday: [],
      earlier: []
    };

    notifs.forEach(n => {
      if (n.mention && (filter === 'all' || !n.read)) {
        groups.mentions.push(n);
      } else if (filter === 'all' || !n.read) {
        const category = getTimeCategory(n.timestamp);
        groups[category].push(n);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByTime(notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasNotifications = Object.values(groupedNotifications).some(group => group.length > 0);

  const NotificationCard = ({ notification, index, category }) => {
    const Icon = getSmartIcon(notification);
    const isChatNotification = notification.type === 'team-message' || notification.type === 'dm-message';
    const sender = notification.sender;
    const cardRef = useRef(null);
    
    useEffect(() => {
      const element = cardRef.current;
      if (element && observerRef.current && !notification.read) {
        observerRef.current.observe(element);
        
        return () => {
          if (observerRef.current && element) {
            observerRef.current.unobserve(element);
          }
        };
      }
    }, [notification.read]);
    
    return (
      <motion.div
        ref={cardRef}
        data-notification-id={notification.id}
        initial={{ opacity: 0, x: isChatNotification ? -20 : 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          delay: index * 0.04,
          type: 'spring',
          stiffness: 400,
          damping: 25
        }}
        className={`relative overflow-hidden rounded-3xl border transition-all duration-300 group ${
          notification.read
            ? 'bg-gradient-to-br from-gray-50/30 to-gray-50/50 dark:from-slate-950/30 dark:to-slate-950/50 border-gray-200/40 dark:border-slate-800/40'
            : 'bg-gradient-to-br from-white to-lavender-50/20 dark:from-slate-900 dark:to-slate-900/80 border-lavender-200/40 dark:border-lavender-800/30 shadow-sm hover:shadow-xl'
        } ${isChatNotification ? 'cursor-pointer hover:scale-[1.02] hover:border-lavender-400/60 dark:hover:border-lavender-600/60' : ''}`}
        onClick={() => {
          if (isChatNotification) {
            handleNotificationClick(notification);
          } else {
            markAsRead(notification.id);
          }
        }}
      >
        {/* Animated gradient border for unread */}
        {!notification.read && (
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            notification.mention 
              ? 'bg-gradient-to-b from-orange-400 via-red-500 to-orange-400' 
              : 'bg-gradient-to-b from-lavender-400 via-lavender-600 to-lavender-400'
          }`} />
        )}

        <div className="p-4 pl-5">
          <div className="flex items-start gap-3.5">
            {/* Avatar with sender identity */}
            <div className="relative flex-shrink-0">
              {sender ? (
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${sender.color || 'from-lavender-500 to-lavender-600'} shadow-lg ring-2 ring-white dark:ring-slate-900`}>
                  {sender.initials}
                  
                  {/* Status indicator */}
                  {!notification.read && (
                    <div 
                      className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${getPriorityColor(notification.priority)} ring-2 ring-white dark:ring-slate-900`}
                    />
                  )}
                </div>
              ) : (
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  notification.read 
                    ? 'bg-gray-100 dark:bg-slate-800' 
                    : 'bg-gradient-to-br from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 shadow-md'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    notification.read 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : notification.color
                  }`} />
                  
                  {!notification.read && (
                    <div 
                      className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${getPriorityColor(notification.priority)} ring-2 ring-white dark:ring-slate-900`}
                    />
                  )}
                </div>
              )}
              
              {/* Department color indicator */}
              {sender?.department && (
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-gradient-to-br ${getDepartmentColor(sender.department)} ring-2 ring-white dark:ring-slate-900 shadow-sm`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Sender name for chat notifications */}
              {sender && (
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold ${
                    notification.read 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {sender.name}
                  </span>
                  {sender.department && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 font-medium">
                      {sender.department}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-bold text-sm leading-tight ${
                    notification.read 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {notification.title}
                  </h3>
                  
                  {notification.mention && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full font-bold shadow-sm"
                    >
                      <AtSign className="w-3 h-3" />
                      MENTION
                    </motion.span>
                  )}
                </div>
              </div>

              <p className={`text-sm mb-3 line-clamp-2 leading-relaxed ${
                notification.read 
                  ? 'text-gray-500 dark:text-gray-500' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {notification.message}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  {notification.project && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 text-lavender-700 dark:text-lavender-300 rounded-xl text-[11px] font-bold shadow-sm">
                        {notification.project}
                      </span>
                    </>
                  )}
                  
                  {isChatNotification && !notification.read && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-bold transition-all shadow-md shadow-lavender-200 dark:shadow-lavender-900/30"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Open
                    </motion.button>
                  )}
                </div>

                {/* Delete button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        {!notification.read && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-transparent via-lavender-100/10 dark:via-lavender-500/5 to-transparent" />
        )}
      </motion.div>
    );
  };

  const NotificationSection = ({ title, notifications, icon: Icon }) => {
    if (notifications.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
          <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
              index={index}
              category={title}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 35, 
              stiffness: 400,
              mass: 0.8
            }}
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-gradient-to-br from-background via-background to-lavender-50/10 dark:to-slate-950 z-50 flex flex-col shadow-2xl border-l border-lavender-100 dark:border-slate-800"
          >
            {/* Header with gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-lavender-50 via-white to-lavender-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 border-b border-lavender-200/60 dark:border-slate-800">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-40 h-40 bg-lavender-300 dark:bg-lavender-800 rounded-full mix-blend-multiply filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="relative w-14 h-14 bg-gradient-to-br from-lavender-500 via-lavender-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-lavender-300/50 dark:shadow-lavender-900/30"
                    >
                      <Bell className="w-7 h-7 text-white" />
                      {unreadCount > 0 && (
                        <motion.div 
                          className="absolute -top-1.5 -right-1.5 min-w-[24px] h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-full flex items-center justify-center px-1.5 ring-4 ring-white dark:ring-slate-900 shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                          {unreadCount}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notifications</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                        {unreadCount > 0 ? (
                          <span className="text-lavender-600 dark:text-lavender-400">{unreadCount} new updates</span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">All caught up! 🎉</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-3 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl transition-all backdrop-blur-sm"
                  >
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </div>

                {/* Advanced Filters */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all backdrop-blur-sm ${
                      filter === 'all'
                        ? 'bg-white dark:bg-lavender-600 text-lavender-600 dark:text-white shadow-lg shadow-lavender-200/50 dark:shadow-lavender-900/30 ring-2 ring-lavender-300 dark:ring-lavender-500'
                        : 'bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all backdrop-blur-sm ${
                      filter === 'unread'
                        ? 'bg-white dark:bg-lavender-600 text-lavender-600 dark:text-white shadow-lg shadow-lavender-200/50 dark:shadow-lavender-900/30 ring-2 ring-lavender-300 dark:ring-lavender-500'
                        : 'bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </motion.button>
                  {unreadCount > 0 && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={markAllAsRead}
                      className="px-4 py-3 bg-white dark:bg-slate-800 text-lavender-600 dark:text-lavender-300 rounded-2xl shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List with custom scrollbar */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-lavender-300 dark:scrollbar-thumb-lavender-800 scrollbar-track-transparent">
              {!hasNotifications ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-center py-20"
                >
                  <div 
                    className="w-28 h-28 bg-gradient-to-br from-lavender-100 via-lavender-200 to-purple-200 dark:from-lavender-900/30 dark:via-lavender-800/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  >
                    <Bell className="w-14 h-14 text-lavender-500 dark:text-lavender-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">You're All Caught Up! 🎉</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Mentions, messages, and important updates will appear here when you receive them.
                  </p>
                </motion.div>
              ) : (
                <>
                  <NotificationSection 
                    title="Mentions" 
                    notifications={groupedNotifications.mentions}
                    icon={AtSign}
                  />
                  <NotificationSection 
                    title="Today" 
                    notifications={groupedNotifications.today}
                    icon={Clock}
                  />
                  <NotificationSection 
                    title="Yesterday" 
                    notifications={groupedNotifications.yesterday}
                    icon={Calendar}
                  />
                  <NotificationSection 
                    title="Earlier" 
                    notifications={groupedNotifications.earlier}
                    icon={FileText}
                  />
                </>
              )}
            </div>

            {/* Sticky Action Bar */}
            {unreadCount > 0 && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-lavender-200/60 dark:border-slate-800 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAllAsRead}
                  className="w-full px-5 py-4 bg-gradient-to-r from-lavender-500 via-lavender-600 to-purple-600 hover:from-lavender-600 hover:via-lavender-700 hover:to-purple-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-lavender-300/50 dark:shadow-lavender-900/30 flex items-center justify-center gap-2.5"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark All as Read
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}