import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  MessageSquare,
  AtSign,
  User,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mapConversationType } from "../../features/projects/project-chat/utils/Chattypemapper";
import { Button } from "./ui/button";
import FilterPillTabs from "./FilterPillTabs";
import { InfoTooltip } from "./InfoTooltip";
import useNotificationStore from "../../features/notifications/stores/notification.store";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./badges/StatusBadge";

export function NotificationsPanel({ isOpen, onClose }) {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const deleteNotification = (id) => {
    removeNotification(id);
  };

  const handleNotificationClick = ({ notificationId, actionUrl }) => {
    markAsRead(notificationId);

    if (actionUrl) {
      navigate(actionUrl);
      onClose();
    }
  };

  function groupByDay(notifications) {
    const today = [];
    const yesterday = [];
    const earlier = [];

    const now = new Date();

    notifications.forEach((notification) => {
      const created = new Date(notification?.createdAt);

      const diff = Math.floor((now - created) / 86400000);

      if (diff === 0) {
        today.push(notification);
      } else if (diff === 1) {
        yesterday.push(notification);
      } else {
        earlier.push(notification);
      }
    });

    return {
      today,
      yesterday,
      earlier,
    };
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || !n.readAt,
  );

  const hasNotifications = filteredNotifications.length > 0;
  const hasUnReadNotifications = filteredNotifications.some(
    (notification) => !notification.readAt,
  );

  const groupedNotifications = groupByDay(notifications);

  const todayNotifications = groupedNotifications?.today;
  const yesterdayNotifications = groupedNotifications?.yesterday;
  const earlierNotifications = groupedNotifications?.earlier;

  // console.log("grouped notification", groupedNotifications);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-gradient-to-br from-background via-background to-lavender-50 dark:to-slate-950 z-50 flex flex-col shadow-2xl border-l border-lavender-100 dark:border-slate-800"
          >
            <div className="relative overflow-hidden bg-background px-4 py-3 border-b border-lavender-200/60 dark:border-slate-800">
              <div className="relative">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 bg-gradient-to-br from-lavender-500 via-lavender-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-lavender-300/50 dark:shadow-lavender-900/30">
                      <Bell className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                        Notifications
                      </h2>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                        {unreadCount > 0 ? (
                          <span className="text-lavender-600 dark:text-lavender-400">
                            {unreadCount} new
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">
                            All caught up!
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FilterPillTabs
                      options={[
                        {
                          label: "All",
                          value: "all",
                        },
                        {
                          label: `Unread ${unreadCount > 0 ? `(${unreadCount})` : ""}`,
                          value: "unread",
                        },
                      ]}
                      value={filter}
                      onChange={(value) => setFilter(value)}
                      size="md"
                      transparentBg={false}
                      // variant="modern"
                      // fullWidth
                    />
                    {/* 
                    <Button
                      onClick={onClose}
                      variant={"outline"}
                      size={"icon"}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-lavender-300 dark:scrollbar-thumb-lavender-800 scrollbar-track-transparent">
              {!hasNotifications ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-lavender-50 via-lavender-100 to-purple-200 dark:from-lavender-900/30 dark:via-lavender-800/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                    <Bell className="w-8 h-8 text-lavender-500 dark:text-lavender-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    New mentions, messages, and updates will appear here.
                  </p>
                </motion.div>
              ) : (
                <>
                  {todayNotifications.map((notification, index) => (
                    <NotificationSection title="Today">
                      <div className="space-y-2">
                        <NotificationCard
                          key={notification._id}
                          notification={notification}
                          index={index}
                          onRead={handleNotificationClick}
                          onRemove={removeNotification}
                        />
                      </div>
                    </NotificationSection>
                  ))}

                  {yesterdayNotifications.map((notification, index) => (
                    <NotificationSection title="Yesterday">
                      <div className="space-y-2">
                        <NotificationCard
                          key={notification._id}
                          notification={notification}
                          index={index}
                          onRead={handleNotificationClick}
                          onRemove={removeNotification}
                        />
                      </div>
                    </NotificationSection>
                  ))}

                  {earlierNotifications.map((notification, index) => (
                    <NotificationSection title="Earlier">
                      <div className="space-y-2">
                        <NotificationCard
                          key={notification._id}
                          notification={notification}
                          index={index}
                          onRead={handleNotificationClick}
                          onRemove={removeNotification}
                        />
                      </div>
                    </NotificationSection>
                  ))}
                </>
              )}
            </div>

            {hasNotifications && (
              <div className="flex gap-1.5 items-center bg-background p-3 border-t border-lavender-200/60 dark:border-slate-800">
                {hasUnReadNotifications && (
                  <Button
                    onClick={markAllAsRead}
                    size={"sm"}
                    variant={"outline"}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark All As Read
                  </Button>
                )}

                <Button
                  onClick={clearAll}
                  size={"sm"}
                  variant={"outline_destructive"}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NotificationCard({ notification, index, onRead, onRemove }) {
  const getSmartIcon = (notification) => {
    switch (notification.type) {
      case "DOCUMENT_EXPIRING":
        return FileText;

      case "DOCUMENT_EXPIRED":
        return FileText;

      case "MESSAGE_RECEIVED":
        return MessageSquare;

      case "TASK_ASSIGNED":
        return CheckCircle;

      case "CALENDAR_UPDATED":
        return Calendar;

      default:
        return Bell;
    }
  };

  const getPriorityBorder = (priority, read) => {
    if (read) {
      return "border-gray-300/40 dark:border-slate-700/40";
    }

    switch (priority) {
      case "CRITICAL":
        return "border-l-red-500/50";
      case "HIGH":
        return "border-l-orange-400/50";
      case "NORMAL":
        return "border-l-primary/50";
      case "LOW":
        return "border-gray-300 dark:border-slate-600";
      default:
        return "border-l-primary/50";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const Icon = getSmartIcon(notification);
  const sender = notification.sender;

  return (
    <motion.div
      data-notification-id={notification._id}
      initial={{ opacity: 0, y: 5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={`relative overflow-hidden rounded-2xl border border-l-3 transition-all duration-300 group
          ${
            notification.readAt
              ? "bg-muted/60 border-gray-200/40 dark:border-slate-800/40"
              : "bg-card border-border shadow-sm hover:shadow-lg"
          }
          ${getPriorityBorder(notification.priority, notification.readAt)}
          cursor-pointer hover:-translate-y-0.5`}
      onClick={() => {
        onRead({
          notificationId: notification._id,
          actionUrl: notification.actionUrl,
        });
      }}
    >
      <div className="p-3.5 px-3">
        <div className="flex items-start gap-2.5">
          <div className="relative flex-shrink-0">
            {sender ? (
              <div
                className={`relative w-8.5 h-8.5 rounded-xl flex items-center justify-center font-bold text-primary text-sm 
                    ${
                      notification.readAt
                        ? "bg-gray-200 dark:bg-slate-800"
                        : "bg-gradient-to-br from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 shadow-sm"
                    }`}
              >
                {sender.initials}
              </div>
            ) : (
              <div
                className={`relative w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all   ${
                  notification.readAt
                    ? "bg-gray-200 dark:bg-slate-800"
                    : "bg-gradient-to-br from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 shadow-sm"
                }`}
              >
                <Icon
                  className={`w-4 h-4 stroke-2 ${
                    notification.readAt
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-primary"
                  }`}
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {sender && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`text-[11px] font-bold ${
                    notification.readAt
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
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
                <h3
                  className={`font-bold text-[11px] leading-tight ${
                    notification.readAt
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {notification.title?.toUpperCase()}
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

            <p
              className={`text-[11px] mb-2 line-clamp-2 leading-relaxed ${
                notification.readAt
                  ? "text-gray-500 dark:text-gray-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {notification.body}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {notification.project && (
                  <Badge>{notification.project}</Badge>
                  // <>
                  //   <span className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 text-lavender-700 dark:text-lavender-300 rounded-md text-[9px] font-bold shadow-sm">
                  //   </span>

                  //   <span className="text-gray-300 dark:text-gray-600 text-[8px]">
                  //     •
                  //   </span>
                  // </>
                )}

                {notification.target?.entityType && (
                  <StatusBadge
                    showIcon={false}
                    label={notification.target?.entityType}
                    className={"text-primary bg-primary/10"}
                    size="sm"
                  />
                  // <>
                  //   <span className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-lavender-50 to-lavender-100 dark:from-lavender-900/30 dark:to-lavender-800/30 text-lavender-700 dark:text-lavender-300 rounded-md text-[9px] font-bold shadow-sm">
                  //   </span>

                  //   <span className="text-gray-300 dark:text-gray-600 text-[8px]">
                  //     •
                  //   </span>
                  // </>
                )}

                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(notification._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationSection({ title, children, icon: Icon }) {
  if (!children || (Array.isArray(children) && children?.length === 0))
    return null;

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
}
