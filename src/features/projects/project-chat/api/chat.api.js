// src/features/chat/api/chat.api.js
// ✅ FIXED: Complete API layer with better error handling

import { axiosConfig } from "../../../auth/config/axiosConfig";

const chatApi = {
  // Get conversations for a project
  getConversations: async (projectId, type) => {
    try {
      console.log("📡 API: Fetching conversations", { projectId, type });
      
      const params = { projectId };
      if (type) params.type = type;
      
      const response = await axiosConfig.get("/chats", { params });
      
      console.log("✅ API: Conversations fetched:", response.data.data?.length || 0, "items");
      return response.data.data;
    } catch (error) {
      console.error("❌ getConversations failed:");
      console.error("  Status:", error.response?.status);
      console.error("  Message:", error.response?.data?.message || error.message);
      console.error("  Full error:", error.response?.data || error);
      
      // Log the full request details for debugging
      if (error.config) {
        console.error("  Request URL:", error.config.url);
        console.error("  Request params:", error.config.params);
      }
      
      throw error;
    }
  },

  // Get conversation details
  getConversationById: async (conversationId) => {
    try {
      console.log("📡 API: Fetching conversation by ID:", conversationId);
      const response = await axiosConfig.get(`/chats/${conversationId}`);
      console.log("✅ API: Conversation fetched:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ getConversationById failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get messages for a conversation
  getMessages: async (conversationId, limit = 20, cursor = null) => {
    try {
      console.log("📡 API: Fetching messages", { conversationId, limit, cursor });
      
      const params = { limit };
      if (cursor) params.cursor = cursor;
      
      const response = await axiosConfig.get(
        `/chats/${conversationId}/messages`,
        { params }
      );
      
      console.log("✅ API: Messages fetched:", response.data.data.messages?.length || 0, "items");
      return response.data.data;
    } catch (error) {
      console.error("❌ getMessages failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Send message - handles both JSON and FormData
  sendMessage: async (conversationId, messageData) => {
    try {
      const isFormData = messageData instanceof FormData;

      console.log("📤 API: Sending message:", {
        conversationId,
        isFormData,
        type: isFormData ? messageData.get("type") : messageData.type,
      });

      if (isFormData) {

        // Debug: Log FormData contents
        console.log("📋 FormData contents:");
        for (let [key, value] of messageData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }
      } else {
        console.log("📋 JSON payload:", JSON.stringify(messageData, null, 2));
      }

      const response = await axiosConfig.post(
        `/chats/${conversationId}/messages`,
        messageData,
      );

      console.log("✅ API: Message sent successfully:", response.data.data);
      // return response.data.data;
    } catch (error) {
      console.error("❌ sendMessage failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    try {
      const response = await axiosConfig.post(`/chats/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error("❌ markAsRead failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Pin/unpin conversation
  pinConversation: async (conversationId, pin) => {
    try {
      const response = await axiosConfig.patch(`/chats/${conversationId}/pin`, {
        pin,
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ pinConversation failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Add/remove favorite
  toggleFavorite: async (conversationId, messageId, addToFavorite) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/favorite`,
        { addToFavorite }
      );
      return response.data;
    } catch (error) {
      console.error("❌ toggleFavorite failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Add/remove reaction
  toggleReaction: async (conversationId, messageId, emoji) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/react`,
        { emoji }
      );
      return response.data;
    } catch (error) {
      console.error("❌ toggleReaction failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Edit message
  editMessage: async (conversationId, messageId, text) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/edit`,
        { text }
      );
      return response.data.data;
    } catch (error) {
      console.error("❌ editMessage failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete message for me
  deleteMessageForMe: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.delete(
        `/chats/${conversationId}/messages/${messageId}/me`
      );
      return response.data;
    } catch (error) {
      console.error("❌ deleteMessageForMe failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete message for everyone
  deleteMessageForEveryone: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.delete(
        `/chats/${conversationId}/messages/${messageId}/all`
      );
      return response.data;
    } catch (error) {
      console.error("❌ deleteMessageForEveryone failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Pin message in chat
  pinMessage: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/pin`
      );
      return response.data.data;
    } catch (error) {
      console.error("❌ pinMessage failed:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default chatApi;