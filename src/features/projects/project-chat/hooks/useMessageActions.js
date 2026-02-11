// src/features/chat/hooks/useMessageActions.js
// ✅ Hook for message actions (reply, edit, delete, forward, etc.)

import { useState, useCallback } from "react";
import chatApi from "../api/chat.api";
import useChatStore from "../store/chat.store";

export const useMessageActions = (conversationId) => {
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);

  const { loadMessages } = useChatStore();

  // Handle reply
  const handleReply = useCallback((message) => {
    const senderId = message._raw?.senderId?._id || message._raw?.senderId || null;
    
    if (!senderId) {
      console.error("❌ Cannot reply: senderId missing");
      return;
    }

    setReplyTo({
      messageId: message.id,
      senderId: senderId,
      preview: (message.content || "").substring(0, 200),
      type: (message.type || "text").toUpperCase(),
      senderName: message.sender || "Unknown",
    });
  }, []);

  const clearReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  // Handle edit
  const handleEdit = useCallback((message) => {
    setEditingMessage(message);
  }, []);

  const clearEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const updateMessage = useCallback(async (messageId, newText) => {
    try {
      await chatApi.editMessage(conversationId, messageId, newText);
      await loadMessages(conversationId);
      clearEdit();
      return true;
    } catch (error) {
      console.error("Failed to edit message:", error);
      throw error;
    }
  }, [conversationId, loadMessages, clearEdit]);

  // Handle delete
  const handleDeleteForMe = useCallback(async (messageId) => {
    try {
      await chatApi.deleteMessageForMe(conversationId, messageId);
      await loadMessages(conversationId);
      return true;
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }, [conversationId, loadMessages]);

  const handleDeleteForEveryone = useCallback(async (messageId) => {
    try {
      await chatApi.deleteMessageForEveryone(conversationId, messageId);
      await loadMessages(conversationId);
      return true;
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }, [conversationId, loadMessages]);

  // Handle forward
  const handleForward = useCallback((message) => {
    setForwardingMessage(message);
  }, []);

  const clearForward = useCallback(() => {
    setForwardingMessage(null);
  }, []);

  const forwardMessage = useCallback(async (targetConversationIds) => {
    if (!forwardingMessage) return false;

    try {
      const senderId = forwardingMessage._raw?.senderId?._id || 
                      forwardingMessage._raw?.senderId;

      for (const targetId of targetConversationIds) {
        const messageData = {
          projectId: forwardingMessage._raw?.projectId || "697c899668977a7ca2b27462",
          text: forwardingMessage.content || "",
          type: (forwardingMessage.type || "TEXT").toUpperCase(),
          forwardedFrom: {
            conversationId: conversationId,
            senderId: senderId,
          },
        };

        await chatApi.sendMessage(targetId, messageData);
      }

      clearForward();
      return true;
    } catch (error) {
      console.error("Failed to forward message:", error);
      throw error;
    }
  }, [forwardingMessage, conversationId, clearForward]);

  // Handle favorite/star
  const handleToggleFavorite = useCallback(async (messageId, isFavorited) => {
    try {
      await chatApi.toggleFavorite(conversationId, messageId, !isFavorited);
      await loadMessages(conversationId);
      return true;
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  }, [conversationId, loadMessages]);

  // Handle reaction
  const handleToggleReaction = useCallback(async (messageId, emoji) => {
    try {
      await chatApi.toggleReaction(conversationId, messageId, emoji);
      await loadMessages(conversationId);
      return true;
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      throw error;
    }
  }, [conversationId, loadMessages]);

  // Handle copy
  const handleCopy = useCallback((message) => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      return true;
    }
    return false;
  }, []);

  // Check permissions
  const canEditMessage = useCallback((message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  }, []);

  const canDeleteForEveryone = useCallback((message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  }, []);

  return {
    // State
    replyTo,
    editingMessage,
    forwardingMessage,
    deletingMessage,

    // Reply actions
    handleReply,
    clearReply,

    // Edit actions
    handleEdit,
    clearEdit,
    updateMessage,

    // Delete actions
    handleDeleteForMe,
    handleDeleteForEveryone,

    // Forward actions
    handleForward,
    clearForward,
    forwardMessage,

    // Other actions
    handleToggleFavorite,
    handleToggleReaction,
    handleCopy,

    // Permissions
    canEditMessage,
    canDeleteForEveryone,
  };
};