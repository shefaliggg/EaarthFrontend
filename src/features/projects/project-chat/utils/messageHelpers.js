// src/features/chat/utils/messageHelpers.js
// ✅ Helper functions for message operations

/**
 * Format timestamp to readable time
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Format timestamp to relative time (e.g., "2h ago")
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Check if message can be edited (within 15 minutes)
 */
export const canEditMessage = (message, currentUserId) => {
  if (!message.isOwn || message.senderId !== currentUserId) return false;
  const fifteenMinutes = 15 * 60 * 1000;
  return Date.now() - message.timestamp < fifteenMinutes;
};

/**
 * Check if message can be deleted for everyone (within 15 minutes)
 */
export const canDeleteForEveryone = (message, currentUserId) => {
  if (!message.isOwn || message.senderId !== currentUserId) return false;
  const fifteenMinutes = 15 * 60 * 1000;
  return Date.now() - message.timestamp < fifteenMinutes;
};

/**
 * Group messages by date
 */
export const groupMessagesByDate = (messages) => {
  const grouped = [];
  let currentDate = null;

  messages.forEach((msg) => {
    const msgDate = new Date(msg.timestamp).toDateString();
    
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      grouped.push({
        type: "date-separator",
        id: `date-${msg.timestamp}`,
        date: formatDateSeparator(msg.timestamp),
      });
    }
    
    grouped.push(msg);
  });

  return grouped;
};

/**
 * Format date for separator (e.g., "Today", "Yesterday", "Jan 15")
 */
export const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Get file type from MIME type
 */
export const getFileType = (mimeType) => {
  if (!mimeType) return "file";
  
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  
  return "file";
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  
  const kb = bytes / 1024;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }
  
  return `${kb.toFixed(2)} KB`;
};

/**
 * Highlight search query in text
 */
export const highlightText = (text, query) => {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts;
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId, onlineUsers) => {
  return onlineUsers.has(userId);
};

/**
 * Get unread count for conversation
 */
export const getUnreadCount = (conversation, currentUserId) => {
  if (!conversation.messages) return 0;
  
  return conversation.messages.filter(
    (msg) => 
      msg.senderId !== currentUserId && 
      !msg.seenBy?.includes(currentUserId)
  ).length;
};