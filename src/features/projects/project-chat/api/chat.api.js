import { toast } from "sonner";
import { axiosConfig, uploadConfig } from "../../../auth/config/axiosConfig";

const chatApi = {
  // Get conversations for a project
  getConversations: async (projectId, search, type) => {
    try {
      console.log("📡 API: Fetching conversations", { projectId, type });

      const params = { projectId, search };
      if (type) params.type = type;

      const response = await axiosConfig.get("/chats", { params });

      console.log(
        "✅ API: Conversations fetched:",
        response.data.data?.length || 0,
        "items",
      );
      return response.data.data;
    } catch (error) {
      console.error("❌ getConversations failed:");
      console.error("  Status:", error.response?.status);
      console.error(
        "  Message:",
        error.response?.data?.message || error.message,
      );
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
      console.error(
        "❌ getConversationById failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  downloadMessageAttachments: async (
    conversationId,
    messageId,
    attachementId,
  ) => {
    const response = await axiosConfig.get(
      `/chats/${conversationId}/messages/${messageId}/attachments/${attachementId}/download`,
      {
        responseType: "blob", // VERY IMPORTANT
      },
    );
    return response;
  },

  // Get messages for a conversation
  getMessages: async (conversationId, limit = 20, cursor = null) => {
    try {
      console.log("📡 API: Fetching messages", {
        conversationId,
        limit,
        cursor,
      });

      const params = { limit };
      if (cursor) params.cursor = cursor;

      const response = await axiosConfig.get(
        `/chats/${conversationId}/messages`,
        { params },
      );

      console.log(
        "✅ API: Messages fetched:",
        response.data.data.messages?.length || 0,
        "items",
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ getMessages failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Send message - handles both JSON and FormData
  sendMessage: async (conversationId, messageData) => {
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
          console.log(
            `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`,
          );
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
      uploadConfig,
    );

    console.log("✅ API: Message sent successfully:", response.data.data);
    return response.data.data;
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    try {
      const response = await axiosConfig.post(`/chats/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ markAsRead failed:",
        error.response?.data || error.message,
      );
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
      console.error(
        "❌ pinConversation failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Add/remove favorite
  toggleFavorite: async (conversationId, messageId, addToFavorite) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/favorite`,
        { addToFavorite },
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ toggleFavorite failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Add/remove reaction
  toggleReaction: async (conversationId, messageId, emoji) => {
    console.log("reaction emoji", emoji);
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/react`,
        { emoji },
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ toggleReaction failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Edit message
  editMessage: async (conversationId, messageId, text) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/edit`,
        { text },
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ editMessage failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Delete message for me
  deleteMessageForMe: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.delete(
        `/chats/${conversationId}/messages/${messageId}/me`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ deleteMessageForMe failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Delete message for everyone
  deleteMessageForEveryone: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.delete(
        `/chats/${conversationId}/messages/${messageId}/all`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ deleteMessageForEveryone failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Pin message in chat
  pinMessage: async (conversationId, messageId) => {
    try {
      const response = await axiosConfig.patch(
        `/chats/${conversationId}/messages/${messageId}/pin`,
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ pinMessage failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  createDirectConversation: async (projectId, targetUserId) => {
    try {
      const response = await axiosConfig.post("/chats/direct", {
        projectId,
        targetUserId,
      });

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ createDirectConversation failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  createSubjectConversation: async (projectId, title, targetUserIds) => {
    try {
      const response = await axiosConfig.post("/chats/subject", {
        projectId,
        title,
        targetUserIds,
      });

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ create Subject Conversation failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Initiate call
  initiateCall: async ({ conversationId, callType, clientTempId }) => {
    try {
      console.log("📡 API: Intiating Call", {
        conversationId,
        callType,
        clientTempId,
      });

      const response = await axiosConfig.post(
        `/chats/${conversationId}/call/initiate`,
        { callType, clientTempId },
      );

      console.log("✅ API: Call Initiated:", response.data);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to Initiate the Call.");
      console.error(
        "❌ Initiate Call failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  joinCall: async (conversationId) => {
    try {
      console.log("📡 API: join Call", {
        conversationId,
      });

      const response = await axiosConfig.post(
        `/chats/${conversationId}/call/join`,
      );

      console.log("✅ API: Call Joined:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ join Call failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  leaveCall: async (conversationId) => {
    try {
      console.log("📡 API: Leave Call", {
        conversationId,
      });

      const response = await axiosConfig.post(
        `/chats/${conversationId}/call/leave`,
      );

      console.log("✅ API: leave Call:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ leave Call failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  endCall: async (conversationId) => {
    try {
      console.log("📡 API: Leave Call", {
        conversationId,
      });

      const response = await axiosConfig.post(
        `/chats/${conversationId}/call/end`,
      );

      console.log("✅ API: end Call:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ end Call failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default chatApi;
