import { create } from "zustand";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notification.service";
import { getNotificationSocket } from "../../../shared/config/socketConfig";
import { soundManager } from "../../../shared/config/soundManager";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import React from "react";
import { cn } from "../../../shared/config/utils";

const durationMap = {
  LOW: 4000,
  NORMAL: 5000,
  HIGH: 7000,
  CRITICAL: 10000,
};

const useNotificationStore = create((set, get) => ({
  notifications: [],

  unreadCount: 0,

  loading: false,

  attachSocketListeners: (navigate) => {
    const socket = getNotificationSocket();
    if (!socket) return;

    socket.removeAllListeners();

    socket.on("notification:new", (notification) => {
      console.log("📨 New notification received:", {
        notification,
      });

      get().addNotification(notification);

      soundManager.playNotification(notification?.priority ?? "NORMAL");

      toast(notification.title, {
        description: notification.body,
        duration: durationMap[notification.priority] ?? 5000,

        action: notification.actionUrl
          ? {
              label: "View",
              onClick: () => {
                navigate(notification.actionUrl);
              },
            }
          : undefined,
        icon: React.createElement(Bell, {
          className: cn(
            "h-4 w-4 fill-background",
            notification.priority === "HIGH" && "text-amber-500 fill-amber-500",
            notification.priority === "CRITICAL" && "text-red-500 fill-red-500",
          ),
        }),
      });
    });
  },

  fetchNotifications: async (filter = "all") => {
    try {
      set({ loading: true });

      const data = await getNotifications(filter);

      set({
        notifications: data.notifications,
        unreadCount: data.unreadCount,
      });
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notificationId && !n.readAt
          ? {
              ...n,
              readAt: new Date().toISOString(),
            }
          : n,
      ),

      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error(error);

      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
    }
  },

  markAllAsRead: async () => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    }));

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error(error);

      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
    }
  },

  removeNotification: async (notificationId) => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    const removedNotification = previousNotifications.find(
      (n) => n._id === notificationId,
    );

    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n._id !== notificationId,
      ),

      unreadCount:
        !removedNotification?.readAt && state.unreadCount > 0
          ? state.unreadCount - 1
          : state.unreadCount,
    }));

    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error(error);

      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
    }
  },
  clearAll: async () => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    set({
      notifications: [],
      unreadCount: 0,
    });

    try {
      await clearAllNotifications();
    } catch (error) {
      console.error(error);

      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],

      unreadCount: state.unreadCount + 1,
    }));
  },
}));

export default useNotificationStore;
