import React, { useState, useRef, useEffect, useCallback } from "react";
import { Smile, Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/shared/config/utils";
import EmojiPicker from "emoji-picker-react";
import useChatStore from "../../store/chat.store";
import FileAttachmentMenu from "./FileAttachmentMenu";
import { buildReplyPayload } from "../../utils/messageHelpers";

const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

const MessageInput = React.memo(
  ({
    selectedChat,
    replyTo,
    editingMessage,
    onClearReply,
    onClearEdit,
    onStartRecording,
    messagesEndRef,
    attachments,
    setAttachments,
  }) => {
    const [messageInput, setMessageInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const sendMessage = useChatStore((state) => state.sendMessage);
    const isSendingMessage = useChatStore((state) => state.isSendingMessage);
    const emitTypingStart = useChatStore((state) => state.emitTypingStart);
    const emitTypingStop = useChatStore((state) => state.emitTypingStop);

    // ═══════════════════════════════════════
    // TYPING INDICATOR (DEBOUNCED)
    // ═══════════════════════════════════════
    const handleTyping = useCallback(() => {
      if (!selectedChat?.id) return;

      emitTypingStart(selectedChat.id);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStop(selectedChat.id);
      }, 1200);
    }, [selectedChat?.id, emitTypingStart, emitTypingStop]);

    // ═══════════════════════════════════════
    // CLEANUP ON UNMOUNT OR CHAT CHANGE
    // ═══════════════════════════════════════
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (selectedChat?.id) {
          emitTypingStop(selectedChat.id);
        }
      };
    }, [selectedChat?.id, emitTypingStop]);

    // ═══════════════════════════════════════
    // RESET INPUT WHEN CHAT CHANGES
    // ═══════════════════════════════════════
    useEffect(() => {
      if (selectedChat?.id) {
        const draft = localStorage.getItem(`chat-draft-${selectedChat.id}`);
        setMessageInput(draft || "");
      }
    }, [selectedChat?.id]);

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
    // SAVE DRAFT
    // ═══════════════════════════════════════
    useEffect(() => {
      if (selectedChat?.id && messageInput) {
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
        if (
          !e.target.closest(".emoji-picker-container") &&
          !e.target.closest(".emoji-button")
        ) {
          setShowEmojiPicker(false);
        }
        if (
          !e.target.closest(".attach-menu-container") &&
          !e.target.closest(".attach-button")
        ) {
          setShowAttachMenu(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // ═══════════════════════════════════════
    // SEND MESSAGE
    // ═══════════════════════════════════════
    const handleSendMessage = useCallback(async () => {
      const trimmedMessage = messageInput.trim();
      const hasText = trimmedMessage.length > 0;
      const hasAttachments = attachments.length > 0;

      if (!hasText && !hasAttachments) return;
      if (!selectedChat?.id) return;

      const projectId =
        selectedChat?.projectId ||
        selectedChat?._raw?.projectId ||
        DEFAULT_PROJECT_ID;

      const normalizedReply = replyTo ? buildReplyPayload(replyTo) : null;

      try {
        emitTypingStop(selectedChat.id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (hasAttachments) {
          const formData = new FormData();

          attachments.forEach((att) => {
            formData.append("attachments", att.file);
          });

          formData.append("projectId", projectId);
          formData.append(
            "type",
            attachments.length > 1 ? "IMAGE" : attachments[0].type,
          );

          console.log("trimmed message", trimmedMessage);

          if (hasText) {
            formData.append("caption", trimmedMessage);
          }
          
          if (normalizedReply) {
            formData.append("replyTo[messageId]", normalizedReply.messageId);
            formData.append("replyTo[senderId]", normalizedReply.senderId);
            formData.append("replyTo[preview]", normalizedReply.preview || "");
            formData.append("replyTo[type]", normalizedReply.type);
          }

          // cleanup
          setMessageInput("");
          onClearReply();

          console.log("caption:", formData.get("caption"));

          await sendMessage(selectedChat.id, projectId, { formData });

          setAttachments([]);
        } else {
          // cleanup
          setMessageInput("");
          onClearReply();

          await sendMessage(selectedChat.id, projectId, {
            text: trimmedMessage,
            type: "TEXT",
            replyTo: normalizedReply,
          });
        }
        localStorage.removeItem(`chat-draft-${selectedChat.id}`);

        // scroll
        if (messagesEndRef?.current) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }
      } catch (error) {
        console.error("❌ Failed to send message:", error);
      }
    }, [
      messageInput,
      attachments,
      selectedChat,
      replyTo,
      sendMessage,
      emitTypingStop,
      onClearReply,
      messagesEndRef,
    ]);

    // ═══════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (editingMessage) {
            console.log("Update message");
          } else {
            handleSendMessage();
          }
        }
        if (e.key === "Escape") {
          onClearReply();
          onClearEdit();
          if (selectedChat?.id) {
            emitTypingStop(selectedChat.id);
          }
        }
      },
      [
        editingMessage,
        handleSendMessage,
        onClearReply,
        onClearEdit,
        selectedChat?.id,
        emitTypingStop,
      ],
    );

    // ═══════════════════════════════════════
    // EMOJI PICKER
    // ═══════════════════════════════════════
    const handleEmojiClick = useCallback(
      (emojiData) => {
        const cursorPos =
          textareaRef.current?.selectionStart || messageInput.length;
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
      },
      [messageInput],
    );

    // ═══════════════════════════════════════
    // FILE UPLOAD
    // ═══════════════════════════════════════
    const handleFileUpload = useCallback((e, uploadType) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      e.target.value = "";
      setShowAttachMenu(false);

      const typeMap = {
        image: "IMAGE",
        video: "VIDEO",
        document: "FILE",
      };

      const newAttachments = files.map((file) => ({
        file,
        type: typeMap[uploadType] || "FILE",
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
    }, []);

    const showSendButton =
      messageInput.trim().length > 0 || attachments.length > 0;

    return (
      <div className="flex rounded-xl items-end gap-2">
        {/* Attachment Button */}
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFileUpload(e, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={(e) => handleFileUpload(e, "video")}
          />
          <input
            ref={documentInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => handleFileUpload(e, "document")}
          />
        </div>

        {/* Emoji Picker */}
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

        {/* Text Input */}
        <div className="flex-1 relative -mb-1.5">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
            aria-label="Message input"
          />
        </div>

        {/* Send Button / Voice Button */}
        {!showSendButton ? (
          <button
            onClick={onStartRecording}
            className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
            aria-label="Record voice message"
          >
            <Mic className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <button
            onClick={
              editingMessage ? () => console.log("Update") : handleSendMessage
            }
            disabled={
              messageInput.trim().length === 0 && attachments.length === 0
            }
            className={cn(
              "h-11 px-5 rounded-xl text-sm flex items-center gap-2 transition-all flex-shrink-0",
              messageInput.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
            aria-label={editingMessage ? "Update message" : "Send message"}
          >
            <Send className="w-4 h-4" />
            {editingMessage ? "Update" : "Send"}
          </button>
        )}
      </div>
    );
  },
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
