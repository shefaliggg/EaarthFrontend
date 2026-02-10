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
    const response = await axiosConfig.get(`/chats/${conversationId}/messages`, {
      params: { limit, cursor },
    });
    return response.data.data;
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    const response = await axiosConfig.post(
      `/chats/${conversationId}/messages`,
      messageData
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

  // Add/remove favorite - ✅ UPDATED with conversationId in path
  toggleFavorite: async (conversationId, messageId, addToFavorite) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/favorite`,
      { addToFavorite }
    );
    return response.data;
  },

  // Add/remove reaction - ✅ UPDATED with conversationId in path
  toggleReaction: async (conversationId, messageId, emoji) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/react`,
      { emoji }
    );
    return response.data;
  },

  // Edit message - ✅ UPDATED with conversationId in path
  editMessage: async (conversationId, messageId, text) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/edit`,
      { text }
    );
    return response.data.data;
  },

  // Delete message for me - ✅ UPDATED with conversationId in path
  deleteMessageForMe: async (conversationId, messageId) => {
    const response = await axiosConfig.delete(
      `/chats/${conversationId}/messages/${messageId}/me`
    );
    return response.data;
  },

  // Delete message for everyone - ✅ UPDATED with conversationId in path
  deleteMessageForEveryone: async (conversationId, messageId) => {
    const response = await axiosConfig.delete(
      `/chats/${conversationId}/messages/${messageId}/all`
    );
    return response.data;
  },

  // Pin message in chat - ✅ UPDATED with conversationId in path
  pinMessage: async (conversationId, messageId) => {
    const response = await axiosConfig.patch(
      `/chats/${conversationId}/messages/${messageId}/pin`
    );
    return response.data.data;
  },
};

export default chatApi;