import axiosConfig from "../../auth/config/axiosConfig";

export const getNotifications = async (filter = "all") => {
  console.log("fetching notifications");

  const res = await axiosConfig.get("/notifications", {
    params: { filter },
  });

  console.log(" 🔔 notifications fetched successfully:", res.data.data);
  return res.data.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await axiosConfig.patch(`/notifications/${notificationId}/read`);

  return res.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axiosConfig.patch("/notifications/read-all");

  return res.data.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await axiosConfig.delete(`/notifications/${notificationId}`);

  return res.data.data;
};

export const clearAllNotifications = async () => {
  const res = await axiosConfig.delete("/notifications/clear-all");

  return res.data.data;
};
