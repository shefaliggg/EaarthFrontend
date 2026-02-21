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
      msg.senderId !== currentUserId && !msg.seenBy?.includes(currentUserId),
  ).length;
};

export function getReadByCount(message) {
  if (!message?.seenBy?.length) return 0;

  const senderId = message?.senderId?._id || message?.senderId;

  return message.seenBy.filter(
    (entry) => entry.userId?.toString() !== senderId.toString(),
  ).length;
}

export const formatDuration = (seconds = 0) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const padded = (n) => String(n).padStart(2, "0");

  if (hrs > 0) {
    return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
  }

  return `${padded(mins)}:${padded(secs)}`;
};

export function transformMessage(
  msg,
  { currentUserId, conversationMembersCount },
) {
  if (!msg) return null;

  const senderId = msg.senderId?._id?.toString() || msg.senderId?.toString();
  const currentUser = currentUserId?.toString();

  const isOwn = senderId === currentUser;

  const createdAt = msg.createdAt ? new Date(msg.createdAt) : new Date();

  // =========================
  // REPLY
  // =========================
  let replyTo = null;
  if (msg.replyTo?.messageId) {
    const original = msg.replyTo.messageId; // populated message document
    const replySender = original.senderId;

    replyTo = {
      messageId: original._id.toString(),
      clientId: original.clientTempId,
      senderId: replySender?._id?.toString() || replySender?.toString(),
      sender: replySender?.displayName || "Unknown",
      preview: original.content?.text || original.content?.caption || "", // for text or caption
      type: original.type?.toLowerCase() || "text",
      caption: original.content?.caption || "",
      files: original.content?.files || [],
      deleted: original.status?.deletedForEveryone || false,
    };
  }

  // =========================
  // FORWARDED
  // =========================
  let forwardedFrom = null;
  if (msg.forwardedFrom?.conversationId) {
    forwardedFrom = {
      conversationId: msg.forwardedFrom.conversationId.toString(),
      senderId:
        msg.forwardedFrom.senderId?._id?.toString() ||
        msg.forwardedFrom.senderId?.toString(),
    };
  }

  // =========================
  // REACTIONS NORMALIZED
  // =========================
  const reactions = (msg.reactions || []).reduce((acc, r) => {
    const emoji = r.emoji;
    const userId = r.userId?._id?.toString() || r.userId?.toString();

    if (!acc[emoji]) acc[emoji] = [];

    acc[emoji].push(userId);

    return acc;
  }, {});

  // =========================
  // READ / DELIVERY
  // =========================
  const seenBy = Array.isArray(msg.seenBy) ? msg.seenBy : [];
  const deliveredTo = Array.isArray(msg.deliveredTo) ? msg.deliveredTo : [];

  // =========================
  // SYSTEM MESSAGE
  // =========================
  const system = msg.type === "SYSTEM" ? msg.system : null;

  return {
    id: msg._id?.toString(),
    clientTempId: msg.clientTempId || null,

    conversationId: msg.conversationId?.toString(),
    projectId: msg.projectId?.toString(),

    sender: msg.senderId?.displayName || "System",
    senderId,

    avatar: msg.senderId?.displayName?.charAt(0)?.toUpperCase() || "S",

    time: createdAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),

    timestamp: createdAt.getTime(),

    content: msg.content?.text || "",
    caption: msg.content?.caption || "",
    type: msg.type?.toLowerCase() || "text",

    files: msg.content?.files || [],

    isOwn,

    state: computeMessageState(msg, conversationMembersCount),

    seenBy, // full array, needed for real-time updates
    deliveredTo, // full array, needed for real-time updates

    edited: msg.status?.edited || false,
    editedAt: msg.status?.editedAt || null,
    deleted: msg.status?.deletedForEveryone || false,

    reactions,
    replyTo,
    forwardedFrom,
    isForwarded: !!forwardedFrom,
    isStarred:
      msg.starredBy?.some((id) => id.toString() === currentUser) || false,
    system,

    _raw: msg, // keep temporarily, but UI should stop using it
  };
}

export function computeMessageState(message, memberCount) {
  if (!message.senderId) return null;

  // Number of recipients excluding sender
  const recipientsCount = Math.max(memberCount - 1, 1);

  // Count how many OTHER users have delivered / seen
  const deliveredCount = Array.isArray(message.deliveredTo)
    ? message.deliveredTo.filter(
        (d) => d.userId?.toString() !== message.senderId?.toString(),
      ).length
    : 0;

  const seenCount = Array.isArray(message.seenBy)
    ? message.seenBy.filter(
        (s) => s.userId?.toString() !== message.senderId?.toString(),
      ).length
    : 0;

  if (seenCount >= recipientsCount) return "seen";
  if (deliveredCount >= recipientsCount) return "delivered";

  return "sent";
}

export function buildReplyPayload(message) {
  if (!message) return null;

  return {
    messageId: message.id,
    senderId: message.senderId,
    preview:
      message.content ||
      message.caption ||
      (message.files?.length ? "Attachment" : ""),
    type: message.type?.toUpperCase() || "TEXT",
  };
}
