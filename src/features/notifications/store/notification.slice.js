import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: action.payload.id,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        conversationId: action.payload.conversationId || null,
        createdAt: new Date().toISOString(),
        read: false,
      };

      state.items.unshift(notification);
      state.unreadCount += 1;
    },

    markAsRead: (state, action) => {
      const id = action.payload;

      const notif = state.items.find((n) => n.id === id);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        if (!n.read) {
          n.read = true;
        }
      });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
