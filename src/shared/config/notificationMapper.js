export function mapNotificationToUI(notification) {
  const base = {
    id: notification._id,
    title: notification.title,
    message: notification.body,
    timestamp: notification.createdAt,
    read: notification.status === "READ",
  };

  switch (notification.category) {
    case "CHAT":
      return mapChatNotification(notification, base);

    case "PROJECT":
      return mapProjectNotification(notification, base);

    case "CONTRACT":
      return mapContractNotification(notification, base);

    default:
      return base;
  }
}
