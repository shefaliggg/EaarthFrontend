import { axiosConfig } from "../../../auth/config/axiosConfig";

const chatApi = {
  // Get conversations for a project
  getConversations: async (projectId, type) => {
    const response = await axiosConfig.get("/chats", {
      params: { projectId, type },
    });
    return response.data.data;
  },

  // Get conversation details
  getConversationById: async (conversationId) => {
    const response = await axiosConfig.get(`/chats/${conversationId}`);
    return response.data.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId, limit = 20, cursor = null) => {
    const response = await axiosConfig.get(
      `/chats/${conversationId}/messages`,
      { params: { limit, cursor } }
    );
    return response.data.data;
  },

  // ✅ FIXED: Send a message — handles both JSON (text) and FormData (files)
  //
  // For text messages, pass a plain object:
  //   { projectId, type: "TEXT", text, replyTo?, forwardedFrom? }
  //
  // For file messages, pass a FormData instance directly.
  // The FormData must already contain:
  //   attachments (File), projectId, type, and optional replyTo[*] fields.
  //
  // axios automatically sets Content-Type: multipart/form-data with the correct
  // boundary when the body is a FormData instance, so do NOT set it manually.
  sendMessage: async (conversationId, messageData) => {
    const isFormData = messageData instanceof FormData;

    const response = await axiosConfig.post(
      `/chats/${conversationId}/messages`,
      messageData,
      isFormData
        ? {
            headers: {
              // Let axios/browser set the boundary automatically
              // Explicitly deleting prevents a missing-boundary bug
              "Content-Type": undefined,
            },
          }
        : {} // JSON — axios default Content-Type: application/json is correct
    );
    return response.data.data;
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    const response = await axiosConfig.post(`/chats/${conversationId}/read`);
    return response.data;
  },

  // Pin/unpin conversation
  pinConversation: async (conversationId, pin) => {
    const response = await axiosConfig.patch(`/chats/${conversationId}/pin`, {
      pin,
    });
    return response.data.data;
  },

  // Add/remove favorite
  toggleFavorite: async (conversationId, messageId, addToFavorite) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/favorite`,
      { addToFavorite }
    );
    return response.data;
  },

  // Add/remove reaction
  toggleReaction: async (conversationId, messageId, emoji) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/react`,
      { emoji }
    );
    return response.data;
  },

  // Edit message
  editMessage: async (conversationId, messageId, text) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/edit`,
      { text }
    );
    return response.data.data;
  },

  // Delete message for me
  deleteMessageForMe: async (conversationId, messageId) => {
    const response = await axiosConfig.delete(
      `/chats/${conversationId}/messages/${messageId}/me`
    );
    return response.data;
  },

  // Delete message for everyone
  deleteMessageForEveryone: async (conversationId, messageId) => {
    const response = await axiosConfig.delete(
      `/chats/${conversationId}/messages/${messageId}/all`
    );
    return response.data;
  },

  // Pin message in chat
  pinMessage: async (conversationId, messageId) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/pin`
    );
    return response.data.data;
  },
};

export default chatApi;