import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar, FileText, Users, CheckCircle, Clock, Trash2, MessageSquare, AtSign, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapConversationType } from '../../features/projects/project-chat/utils/Chattypemapper';

export function NotificationsPanel({ isOpen, onClose, projectId = 'avatar-1' }) {
  const [filter, setFilter] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const navigate = useNavigate();
  const observerRef = useRef(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'document',
      title: 'DOCUMENT EXPIRING SOON',
      message: 'Your passport will expire in 4 months. Please update your documents.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      icon: FileText,
      color: 'text-red-600',
      priority: 'high',
      group: 'documents',
    },
    {
      id: 2,
      type: 'calendar',
      title: 'NEW CALENDAR EVENT',
      message: 'Agent Shukla created event: Avatar shooting @ Mumbai, India',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      icon: Calendar,
      color: 'text-lavender-600',
      project: 'AVATAR 1',
      priority: 'medium',
      sender: { name: 'Agent Shukla', avatar: null, initials: 'AS', department: 'Production' },
      group: 'calendar',
    },
    {
      id: 3,
      type: 'team-message',
      title: 'NEW MESSAGE IN PRODUCTION TEAM',
      message: 'Sarah: Budget review meeting at 3 PM',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      icon: Users,
      color: 'text-blue-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "production",
      conversationType: "DEPARTMENT",
      department: "Production",
      projectId: projectId,
      sender: { name: 'Sarah Mitchell', avatar: null, initials: 'SM', department: 'Production' },
      group: 'production-team',
    },
    {
      id: 7,
      type: 'team-message',
      title: 'NEW MESSAGE IN PRODUCTION TEAM',
      message: 'Mike: Updated the budget spreadsheet',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      icon: Users,
      color: 'text-blue-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "production",
      conversationType: "DEPARTMENT",
      department: "Production",
      projectId: projectId,
      sender: { name: 'Mike Chen', avatar: null, initials: 'MC', department: 'Production' },
      group: 'production-team',
    },
    {
      id: 8,
      type: 'team-message',
      title: 'NEW MESSAGE IN PRODUCTION TEAM',
      message: 'Lisa: Meeting moved to 4 PM',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      read: false,
      icon: Users,
      color: 'text-blue-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "production",
      conversationType: "DEPARTMENT",
      department: "Production",
      projectId: projectId,
      sender: { name: 'Lisa Wang', avatar: null, initials: 'LW', department: 'Production' },
      group: 'production-team',
    },
    {
      id: 4,
      type: 'dm-message',
      title: 'NEW DIRECT MESSAGE',
      message: 'Marcus Johnson: Can we discuss the script changes?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: false,
      icon: User,
      color: 'text-green-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "marcus",
      conversationType: "DIRECT",
      userId: "marcus",
      userName: "Marcus Johnson",
      projectId: projectId,
      sender: { name: 'Marcus Johnson', avatar: null, initials: 'MJ', department: 'Script' },
      group: 'direct-messages',
    },
    {
      id: 9,
      type: 'dm-message',
      title: 'NEW DIRECT MESSAGE',
      message: 'Emma: The new designs are ready for review',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      icon: User,
      color: 'text-green-600',
      project: 'AVATAR 1',
      priority: 'medium',
      conversationId: "emma",
      conversationType: "DIRECT",
      userId: "emma",
      userName: "Emma Davis",
      projectId: projectId,
      sender: { name: 'Emma Davis', avatar: null, initials: 'ED', department: 'Design' },
      group: 'direct-messages',
    },
    {
      id: 5,
      type: 'team-message',
      title: 'MENTION IN STUNT TEAM',
      message: 'Ryan mentioned you: Need your approval on safety protocols',
      timestamp: new Date(Date.now() - 70 * 60 * 1000),
      read: false,
      icon: Users,
      color: 'text-orange-600',
      project: 'AVATAR 1',
      mention: true,
      priority: 'high',
      conversationId: "stunts",
      conversationType: "DEPARTMENT",
      department: "Stunt Team",
      projectId: projectId,
      sender: { name: 'Ryan Cooper', avatar: null, initials: 'RC', department: 'Stunts' },
      group: 'stunts-team',
    },
    {
      id: 6,
      type: 'team-message',
      title: 'PROJECT-WIDE ANNOUNCEMENT',
      message: 'New safety protocols have been added to the handbook',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
      read: false,
      icon: Users,
      color: 'text-purple-600',
      project: 'AVATAR 1',
      priority: 'low',
      conversationId: "all-departments",
      conversationType: "PROJECT_ALL",
      projectId: projectId,
      sender: { name: 'Admin', avatar: null, initials: 'AD', department: 'System' },
      group: 'announcements',
    },
  ]);

  // Smart auto-read: Mark as read after 6 seconds of visibility
  const timeoutRefs = useRef(new Map());

  useEffect(() => {
    if (!isOpen) {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const notificationId = parseInt(entry.target.dataset.notificationId);
          
          if (entry.isIntersecting) {
            if (timeoutRefs.current.has(notificationId)) {
              clearTimeout(timeoutRefs.current.get(notificationId));
            }
            
            const timeout = setTimeout(() => {
              markAsRead(notificationId);
              timeoutRefs.current.delete(notificationId);
            }, 6000);
            
            timeoutRefs.current.set(notificationId, timeout);
          } else {
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

  const getUserAvatarColor = (sender) => {
    if (!sender?.name) return 'from-lavender-500 to-lavender-600';
    
    const hash = sender.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      'from-lavender-400 to-lavender-600',
      'from-pastel-pink-400 to-pastel-pink-600',
      'from-mint-400 to-mint-600',
      'from-peach-400 to-peach-600',
      'from-sky-400 to-sky-600',
    ];
    return colors[hash % colors.length];
  };

  // 🎯 Smart grouping logic
  const groupNotifications = (notifs) => {
    const filtered = notifs.filter(n => filter === 'all' || !n.read);
    
    const groups = {
      mentions: [],
      teamGrouped: {},
      directGrouped: {},
      individual: [],
    };

    filtered.forEach(n => {
      if (n.mention) {
        groups.mentions.push(n);
      } else if (n.group && n.type === 'team-message') {
        if (!groups.teamGrouped[n.group]) {
          groups.teamGrouped[n.group] = [];
        }
        groups.teamGrouped[n.group].push(n);
      } else if (n.group && n.type === 'dm-message') {
        if (!groups.directGrouped[n.group]) {
          groups.directGrouped[n.group] = [];
        }
        groups.directGrouped[n.group].push(n);
      } else {
        groups.individual.push(n);
      }
    });

    return groups;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const groupedNotifications = groupNotifications(notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasNotifications = groupedNotifications.mentions.length > 0 || 
                          Object.keys(groupedNotifications.teamGrouped).length > 0 ||
                          Object.keys(groupedNotifications.directGrouped).length > 0 ||
                          groupedNotifications.individual.length > 0;

  const NotificationCard = ({ notification, index }) => {
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
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group ${
          notification.read
            ? 'bg-gradient-to-br from-gray-50/30 to-gray-50/50 dark:from-slate-950/30 dark:to-slate-950/50 border-gray-200/40 dark:border-slate-800/40'
            : 'bg-gradient-to-br from-white to-lavender-50/20 dark:from-slate-900 dark:to-slate-900/80 border-lavender-200/40 dark:border-lavender-800/30 shadow-sm hover:shadow-lg'
        } ${isChatNotification ? 'cursor-pointer hover:scale-[1.01] hover:border-lavender-400/60 dark:hover:border-lavender-600/60' : ''}`}
        onClick={() => {
          if (isChatNotification) {
            handleNotificationClick(notification);
          } else {
            markAsRead(notification.id);
          }
        }}
      >
        {!notification.read && (
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            notification.mention 
              ? 'bg-gradient-to-b from-orange-400 via-red-500 to-orange-400' 
              : 'bg-gradient-to-b from-lavender-400 via-lavender-600 to-lavender-400'
          }`} />
        )}

        <div className="p-3 pl-4">
          <div className="flex items-start gap-2.5">
            <div className="relative flex-shrink-0">
              {sender ? (
                <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br ${getUserAvatarColor(sender)} shadow-md ring-2 ring-white dark:ring-slate-900`}>
                  {sender.initials}
                  
                  {!notification.read && (
                    <div 
                      className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getPriorityColor(notification.priority)} ring-2 ring-white dark:ring-slate-900`}
                    />
                  )}
                  
                  {isChatNotification && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm">
                      <Icon className="w-2.5 h-2.5 text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              ) : (
                <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  notification.read 
                    ? 'bg-gray-100 dark:bg-slate-800' 
                    : 'bg-gradient-to-br from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 shadow-md'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    notification.read 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : notification.color
                  }`} />
                  
                  {!notification.read && (
                    <div 
                      className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getPriorityColor(notification.priority)} ring-2 ring-white dark:ring-slate-900`}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {sender && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[11px] font-bold ${
                    notification.read 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {sender.name}
                  </span>
                  {sender.department && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 font-medium">
                      {sender.department}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className={`font-bold text-[11px] leading-tight ${
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
                      className="inline-flex items-center gap-0.5 text-[9px] bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-md font-bold shadow-sm"
                    >
                      <AtSign className="w-2.5 h-2.5" />
                      MENTION
                    </motion.span>
                  )}
                </div>
              </div>

              <p className={`text-[11px] mb-2 line-clamp-2 leading-relaxed ${
                notification.read 
                  ? 'text-gray-500 dark:text-gray-500' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {notification.message}
              </p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-gray-400" />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  {notification.project && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600 text-[8px]">•</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 text-lavender-700 dark:text-lavender-300 rounded-md text-[9px] font-bold shadow-sm">
                        {notification.project}
                      </span>
                    </>
                  )}
                  
                  {isChatNotification && !notification.read && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-bold transition-all shadow-sm"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      Open
                    </motion.button>
                  )}
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {!notification.read && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-transparent via-lavender-100/10 dark:via-lavender-500/5 to-transparent" />
        )}
      </motion.div>
    );
  };

  const GroupedNotificationCard = ({ groupId, notifications, index, isDirect = false }) => {
    const isExpanded = expandedGroups.has(groupId);
    const unreadInGroup = notifications.filter(n => !n.read).length;
    const firstNotification = notifications[0];
    const sender = firstNotification.sender;
    const Icon = isDirect ? User : Users;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="space-y-2"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => toggleGroup(groupId)}
          className={`relative overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all cursor-pointer p-3 ${
            isDirect 
              ? 'border-green-200/50 dark:border-green-800/40' 
              : 'border-lavender-200/50 dark:border-lavender-800/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg ring-2 ring-white dark:ring-slate-900 ${
              isDirect ? 'bg-green-600' : 'bg-lavender-600'
            }`}>
              <Icon className="w-5 h-5" />
              {unreadInGroup > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 ring-2 ring-white dark:ring-slate-900">
                  {unreadInGroup}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                  {notifications.length} {isDirect ? 'Direct Messages' : `from ${sender?.department}`}
                </h3>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                Latest: {notifications[0].message.substring(0, 40)}...
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 pl-3"
            >
              {notifications.map((notification, i) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const NotificationSection = ({ title, children, icon: Icon }) => {
    if (!children || (Array.isArray(children) && children.length === 0)) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          {Icon && <Icon className="w-3 h-3 text-gray-400" />}
          <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>
        {children}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            onClick={onClose}
          />

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
            <div className="relative overflow-hidden bg-gradient-to-br from-lavender-50 via-white to-lavender-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-3 border-b border-lavender-200/60 dark:border-slate-800">
              <div className="relative">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 bg-gradient-to-br from-lavender-500 via-lavender-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-lavender-300/50 dark:shadow-lavender-900/30">
                      <Bell className="w-4.5 h-4.5 text-white" />
                      {unreadCount > 0 && (
                        <motion.div 
                          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-slate-900 shadow-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                          {unreadCount}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight">Notifications</h2>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                        {unreadCount > 0 ? (
                          <span className="text-lavender-600 dark:text-lavender-400">{unreadCount} new</span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">All caught up!</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </div>

                <div className="flex gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filter === 'all'
                        ? 'bg-white dark:bg-lavender-600 text-lavender-600 dark:text-white shadow-md ring-1 ring-lavender-300 dark:ring-lavender-500'
                        : 'bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filter === 'unread'
                        ? 'bg-white dark:bg-lavender-600 text-lavender-600 dark:text-white shadow-md ring-1 ring-lavender-300 dark:ring-lavender-500'
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
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 text-lavender-600 dark:text-lavender-300 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-lavender-300 dark:scrollbar-thumb-lavender-800 scrollbar-track-transparent">
              {!hasNotifications ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-lavender-100 via-lavender-200 to-purple-200 dark:from-lavender-900/30 dark:via-lavender-800/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Bell className="w-10 h-10 text-lavender-500 dark:text-lavender-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    New mentions, messages, and updates will appear here.
                  </p>
                </motion.div>
              ) : (
                <>
                  <NotificationSection title="Mentions" icon={AtSign}>
                    <div className="space-y-2">
                      {groupedNotifications.mentions.map((notification, index) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          index={index}
                        />
                      ))}
                    </div>
                  </NotificationSection>

                  <NotificationSection title="Team Messages" icon={Users}>
                    <div className="space-y-2">
                      {Object.entries(groupedNotifications.teamGrouped).map(([groupId, notifs], index) => (
                        notifs.length > 2 ? (
                          <GroupedNotificationCard
                            key={groupId}
                            groupId={groupId}
                            notifications={notifs}
                            index={index}
                            isDirect={false}
                          />
                        ) : (
                          notifs.map((notification, i) => (
                            <NotificationCard
                              key={notification.id}
                              notification={notification}
                              index={index + i}
                            />
                          ))
                        )
                      ))}
                    </div>
                  </NotificationSection>

                  <NotificationSection title="Direct Messages" icon={User}>
                    <div className="space-y-2">
                      {Object.entries(groupedNotifications.directGrouped).map(([groupId, notifs], index) => (
                        notifs.length > 1 ? (
                          <GroupedNotificationCard
                            key={groupId}
                            groupId={groupId}
                            notifications={notifs}
                            index={index}
                            isDirect={true}
                          />
                        ) : (
                          notifs.map((notification, i) => (
                            <NotificationCard
                              key={notification.id}
                              notification={notification}
                              index={index + i}
                            />
                          ))
                        )
                      ))}
                    </div>
                  </NotificationSection>

                  <NotificationSection title="Other" icon={Bell}>
                    <div className="space-y-2">
                      {groupedNotifications.individual.map((notification, index) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          index={index}
                        />
                      ))}
                    </div>
                  </NotificationSection>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}