// src/features/chat/components/ChatBox/MessageInput.jsx
// ✅ COMPLETE Message input with file upload, emoji picker, typing indicator

import React, { useState, useRef, useEffect } from "react";
import { Smile, Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/shared/config/utils";
import EmojiPicker from "emoji-picker-react";
import useChatStore from "../../store/chat.store";
import FileAttachmentMenu from "./FileAttachmentMenu";

const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

export default function MessageInput({
  selectedChat,
  replyTo,
  editingMessage,
  onClearReply,
  onClearEdit,
  onStartRecording,
  isUserAtBottom,
  scrollToBottom,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSendingMessage, socket } = useChatStore();

  // ═══════════════════════════════════════
  // TYPING INDICATOR
  // ═══════════════════════════════════════
  const handleTyping = () => {
    if (!socket || !selectedChat?.id) return;

    // Emit typing start
    socket.emit("typing:start", { conversationId: selectedChat.id });

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Set timeout to emit typing stop after 1.2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId: selectedChat.id });
    }, 1200);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && selectedChat?.id) {
        socket.emit("typing:stop", { conversationId: selectedChat.id });
      }
    };
  }, [socket, selectedChat?.id]);

  // ═══════════════════════════════════════
  // AUTO-GROW TEXTAREA
  // ═══════════════════════════════════════
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [messageInput]);

  // ═══════════════════════════════════════
  // LOAD/SAVE DRAFT
  // ═══════════════════════════════════════
  useEffect(() => {
    if (selectedChat?.id) {
      const draft = localStorage.getItem(`chat-draft-${selectedChat.id}`);
      if (draft) setMessageInput(draft);
    }
  }, [selectedChat?.id]);

  useEffect(() => {
    if (selectedChat?.id) {
      localStorage.setItem(`chat-draft-${selectedChat.id}`, messageInput);
    }
  }, [messageInput, selectedChat?.id]);

  // ═══════════════════════════════════════
  // SET EDITING MESSAGE
  // ═══════════════════════════════════════
  useEffect(() => {
    if (editingMessage) {
      setMessageInput(editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // ═══════════════════════════════════════
  // CLOSE PICKERS ON OUTSIDE CLICK
  // ═══════════════════════════════════════
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".emoji-picker-container") && !e.target.closest(".emoji-button")) {
        setShowEmojiPicker(false);
      }
      if (!e.target.closest(".attach-menu-container") && !e.target.closest(".attach-button")) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ═══════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════
  const handleSendMessage = async () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;
    if (!selectedChat?.id) return;

    const messageData = {
      text: trimmedMessage,
      type: "TEXT",
      ...(replyTo && { replyTo }),
    };

    const projectId = selectedChat?.projectId || selectedChat?._raw?.projectId || DEFAULT_PROJECT_ID;

    try {
      // Stop typing indicator
      if (socket && selectedChat?.id) {
        socket.emit("typing:stop", { conversationId: selectedChat.id });
      }
      
      await sendMessage(selectedChat.id, projectId, messageData);
      setMessageInput("");
      onClearReply();
      localStorage.removeItem(`chat-draft-${selectedChat.id}`);

      if (isUserAtBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  };

  // ═══════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        // Handle update message
        console.log("Update message");
      } else {
        handleSendMessage();
      }
    }
    if (e.key === "Escape") {
      onClearReply();
      onClearEdit();
    }
  };

  // ═══════════════════════════════════════
  // EMOJI PICKER
  // ═══════════════════════════════════════
  const handleEmojiClick = (emojiData) => {
    const cursorPos = textareaRef.current?.selectionStart || messageInput.length;
    const textBefore = messageInput.substring(0, cursorPos);
    const textAfter = messageInput.substring(cursorPos);
    setMessageInput(textBefore + emojiData.emoji + textAfter);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = cursorPos + emojiData.emoji.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // ═══════════════════════════════════════
  // FILE UPLOAD
  // ═══════════════════════════════════════
  const handleFileUpload = async (e, uploadType) => {
    if (!selectedChat?.id) return;
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = "";
    setShowAttachMenu(false);

    const projectId = selectedChat?.projectId || selectedChat?._raw?.projectId || DEFAULT_PROJECT_ID;

    const typeMap = {
      image: "IMAGE",
      video: "VIDEO",
      document: "FILE",
    };
    const messageType = typeMap[uploadType] || "FILE";

    const formData = new FormData();
    formData.append("attachments", file);
    formData.append("projectId", projectId);
    formData.append("type", messageType);
    formData.append("text", "");

    if (replyTo) {
      formData.append("replyTo[messageId]", replyTo.messageId);
      formData.append("replyTo[senderId]", replyTo.senderId);
      formData.append("replyTo[preview]", replyTo.preview || "");
      formData.append("replyTo[type]", replyTo.type || "TEXT");
    }

    try {
      await sendMessage(selectedChat.id, projectId, { formData });
      onClearReply();
      if (isUserAtBottom) setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
      alert(`Failed to send file: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex rounded-xl items-end gap-2">
      {/* Attachment button */}
      <div className="relative attach-menu-container">
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className="attach-button p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </button>

        {showAttachMenu && (
          <FileAttachmentMenu
            onImageClick={() => fileInputRef.current?.click()}
            onVideoClick={() => videoInputRef.current?.click()}
            onFileClick={() => documentInputRef.current?.click()}
          />
        )}

        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, "image")} />
        <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={(e) => handleFileUpload(e, "video")} />
        <input ref={documentInputRef} type="file" hidden onChange={(e) => handleFileUpload(e, "document")} />
      </div>

      {/* Emoji picker */}
      <div className="relative emoji-picker-container">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="emoji-button p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
          aria-label="Add emoji"
        >
          <Smile className="w-5 h-5 text-muted-foreground" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="auto"
              searchDisabled={false}
              emojiStyle="native"
              width={350}
              height={400}
            />
          </div>
        )}
      </div>

      {/* Text input */}
      <div className="flex-1 relative -mb-1.5">
        <textarea
          ref={textareaRef}
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping(); // Emit typing indicator
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="w-full px-4 py-2 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-11!"
          aria-label="Message input"
        />
      </div>

      {/* Voice message */}
      <button
        onClick={onStartRecording}
        className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
        aria-label="Record voice message"
      >
        <Mic className="w-5 h-5 text-primary" />
      </button>

      {/* Send button */}
      <button
        onClick={editingMessage ? () => console.log("Update") : handleSendMessage}
        disabled={!messageInput.trim() || isSendingMessage}
        className={cn(
          "h-11 px-5 rounded-xl text-sm flex items-center gap-2 transition-all flex-shrink-0",
          messageInput.trim() && !isSendingMessage
            ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
        aria-label={editingMessage ? "Update message" : "Send message"}
      >
        <Send className="w-4 h-4" />
        {editingMessage ? "Update" : "Send"}
      </button>
    </div>
  );
}