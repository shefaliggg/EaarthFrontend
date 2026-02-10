import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Settings2,
  Reply,
  Edit3,
  Forward,
  Star,
  Trash,
  CheckCheck,
  Check,
  Mic,
  Sparkles,
  Smile,
  Send,
  Paperclip,
  ChevronDown,
  X,
  Clock,
  Copy,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  CornerDownRight,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { AutoHeight } from "../../../../shared/components/wrappers/AutoHeight";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import useChatStore from "../store/chat.store";
import chatApi from "../api/chat.api";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// ⚠️ TEMPORARY: Hardcoded project ID
const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

// ✅ Helper to get full S3 URL from key
const getFileUrl = (fileKey) => {
  if (!fileKey) return null;
  
  // If already a full URL, return as is
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }
  
  // Otherwise, construct S3 URL
  const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL || "https://your-bucket.s3.amazonaws.com";
  return `${S3_BASE_URL}/${fileKey}`;
};

export default function EnhancedChatUI({ selectedChat }) {
  const [messageInput, setMessageInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Forward dialog states
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState(null);
  const [selectedConversations, setSelectedConversations] = useState([]);

  // New feature states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Image preview dialog
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // Get data from Zustand
  const {
    messagesByConversation,
    conversations,
    loadMessages,
    sendMessage: sendMessageToStore,
    markAsRead,
    isLoadingMessages,
    isSendingMessage,
  } = useChatStore();

  // Get messages from store
  const messagesData =
    selectedChat?.id && messagesByConversation[selectedChat.id]
      ? messagesByConversation[selectedChat.id]
      : { messages: [], hasMore: false, cursor: null };

  const messages = messagesData.messages || [];

  // Scroll to bottom function
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    setIsUserAtBottom(true);
    setNewMessagesCount(0);
  }, []);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false);
  }, []);

  // Load messages when chat changes
  useEffect(() => {
    if (selectedChat?.id) {
      loadMessages(selectedChat.id);
      markAsRead(selectedChat.id);

      // Reset UI state
      setReplyTo(null);
      setEditingMessage(null);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSelectedMessage(null);
      setShowReactionPicker(null);
      setShowAttachMenu(false);
      setShowEmojiPicker(false);

      setTimeout(() => {
        scrollToBottom(false);
        setIsUserAtBottom(true);
      }, 150);
    }
  }, [selectedChat?.id, loadMessages, markAsRead, scrollToBottom]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const results = messages.filter(
      (m) =>
        m.content &&
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
    setActiveResultIndex(0);
  }, [searchQuery, messages]);

  const goToSearchResult = useCallback(
    (index) => {
      const msg = searchResults[index];
      if (!msg) return;
      scrollToMessage(msg.id);
      setActiveResultIndex(index);
    },
    [searchResults]
  );

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      setIsUserAtBottom(isNearBottom);

      if (isNearBottom) {
        setNewMessagesCount(0);
      }

      if (scrollTop < 100 && messagesData.hasMore && !isLoadingMessages) {
        loadMessages(selectedChat.id, true);
      }
    },
    [messagesData.hasMore, isLoadingMessages, selectedChat, loadMessages]
  );

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [messageInput]);

  // Load draft from localStorage
  useEffect(() => {
    if (selectedChat?.id) {
      const draft = localStorage.getItem(`chat-draft-${selectedChat.id}`);
      if (draft) setMessageInput(draft);
    }
  }, [selectedChat?.id]);

  // Save draft to localStorage
  useEffect(() => {
    if (selectedChat?.id) {
      localStorage.setItem(`chat-draft-${selectedChat.id}`, messageInput);
    }
  }, [messageInput, selectedChat?.id]);

  // Close pickers on outside click
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

  const handleSendMessage = async () => {
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage) return;
    if (!selectedChat?.id) return;

    const messageData = {
      text: trimmedMessage,
      type: "TEXT",
      ...(replyTo && { replyTo }),
    };

    const projectId =
      selectedChat?.projectId ||
      selectedChat?._raw?.projectId ||
      DEFAULT_PROJECT_ID;

    try {
      await sendMessageToStore(selectedChat.id, projectId, messageData);

      setMessageInput("");
      setReplyTo(null);
      localStorage.removeItem(`chat-draft-${selectedChat.id}`);

      if (isUserAtBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to send message: ${errorMessage}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        handleUpdateMessage();
      } else {
        handleSendMessage();
      }
    }
    if (e.key === "Escape") {
      setReplyTo(null);
      setEditingMessage(null);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Reaction handler
  const handleReaction = async (messageId, emoji) => {
    try {
      await chatApi.toggleReaction(selectedChat.id, messageId, emoji);
      await loadMessages(selectedChat.id);
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      alert(
        `Failed to add reaction: ${error.response?.data?.message || error.message}`
      );
    }
    setShowReactionPicker(null);
  };

  // ✅ FIXED: Delete message handlers
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteForMe = async () => {
    if (!messageToDelete) return;

    try {
      await chatApi.deleteMessageForMe(selectedChat.id, messageToDelete.id);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      // Reload messages to update UI
      await loadMessages(selectedChat.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert(
        `Failed to delete message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleDeleteForEveryone = async () => {
    if (!messageToDelete) return;

    try {
      await chatApi.deleteMessageForEveryone(selectedChat.id, messageToDelete.id);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      // Reload messages to update UI
      await loadMessages(selectedChat.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete message. Please try again."
      );
    }
  };

  // Edit message handlers
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    textareaRef.current?.focus();
  };

  const handleUpdateMessage = async () => {
    if (editingMessage && messageInput.trim() && selectedChat?.id) {
      try {
        await chatApi.editMessage(
          selectedChat.id,
          editingMessage.id,
          messageInput
        );
        setMessageInput("");
        setEditingMessage(null);
        localStorage.removeItem(`chat-draft-${selectedChat.id}`);
        await loadMessages(selectedChat.id);
      } catch (error) {
        console.error("Failed to edit message:", error);
        alert(
          error.response?.data?.message ||
            "Failed to edit message. Please try again."
        );
      }
    }
  };

  // Forward message handlers
  const handleForwardClick = (message) => {
    setMessageToForward(message);
    setSelectedConversations([]);
    setForwardDialogOpen(true);
  };

  const handleForwardMessage = async () => {
    if (!messageToForward || selectedConversations.length === 0) {
      alert("Please select at least one conversation");
      return;
    }

    try {
      const senderId =
        messageToForward._raw?.senderId?._id ||
        messageToForward._raw?.senderId;

      for (const convId of selectedConversations) {
        const messageData = {
          projectId:
            selectedChat.projectId ||
            selectedChat._raw?.projectId ||
            DEFAULT_PROJECT_ID,
          text: messageToForward.content || "",
          type: (messageToForward.type || "TEXT").toUpperCase(),
          forwardedFrom: {
            conversationId: selectedChat.id,
            senderId: senderId,
          },
        };

        await chatApi.sendMessage(convId, messageData);
      }

      setForwardDialogOpen(false);
      setMessageToForward(null);
      setSelectedConversations([]);
      alert(`Message forwarded to ${selectedConversations.length} conversation(s)!`);
    } catch (error) {
      console.error("Failed to forward message:", error);
      alert(
        `Failed to forward message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleReply = (message) => {
    const senderId =
      message._raw?.senderId?._id ||
      message._raw?.senderId ||
      null;

    if (!senderId) {
      console.error("❌ Cannot reply: senderId missing from message", message);
      alert("Cannot reply to this message. Sender information is missing.");
      return;
    }

    setReplyTo({
      messageId: message.id,
      senderId: senderId,
      preview: (message.content || "").substring(0, 200),
      type: (message.type || "text").toUpperCase(),
      senderName: message.sender || "Unknown",
    });

    textareaRef.current?.focus();
  };

  // Star/Favorite handler
  const handleToggleFavorite = async (messageId, isFavorited) => {
    try {
      await chatApi.toggleFavorite(selectedChat.id, messageId, !isFavorited);
      await loadMessages(selectedChat.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      alert(
        `Failed to star message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const canEditMessage = (message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  };

  const canDeleteForEveryone = (message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSelectedMessage(messageId);
    setTimeout(() => setSelectedMessage(null), 2000);
  };

  const handleCopyMessage = (message) => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      alert("Message copied to clipboard!");
    }
  };

  // ✅ FIXED: File upload with proper FormData construction
  const handleFileUpload = async (e, uploadType) => {
    if (!selectedChat?.id) return;
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = "";
    setShowAttachMenu(false);

    const projectId =
      selectedChat?.projectId ||
      selectedChat?._raw?.projectId ||
      DEFAULT_PROJECT_ID;

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
      await sendMessageToStore(selectedChat.id, projectId, {
        formData,
      });

      setReplyTo(null);
      if (isUserAtBottom) setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
      alert(
        `Failed to send file: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
      audioChunksRef.current = [];
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEmojiClick = (emojiData) => {
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
  };

  // ✅ Image preview handler
  const handleImageClick = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setImagePreviewOpen(true);
  };

  if (!selectedChat) {
    return (
      <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[900px] sticky top-5 flex items-center justify-center">
        <div className="text-center space-y-3 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            Select a chat to start messaging
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Choose a department group or individual member from the sidebar to
            begin your conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[900px] sticky top-5 flex flex-col mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b rounded-t-3xl backdrop-blur-sm flex-shrink-0">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-2.5">
                {selectedChat.type === "dm" ? (
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
                      {selectedChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="p-2 rounded-full bg-primary/10">
                    {selectedChat.icon && (
                      <selectedChat.icon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    {selectedChat.type === "dm" ? (
                      <>
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            selectedChat.status === "online" &&
                              "bg-green-500 animate-pulse",
                            selectedChat.status === "away" && "bg-yellow-500",
                            selectedChat.status === "offline" && "bg-gray-400"
                          )}
                        />
                        <span>{selectedChat.role}</span>
                      </>
                    ) : (
                      <>
                        <span>{selectedChat.members || 0} members</span>
                        {selectedChat.online > 0 && (
                          <>
                            <span className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                            <span className="flex items-center gap-1 text-green-500 font-medium">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              {selectedChat.online} online
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  className="h-8 px-2.5 rounded-md text-[10px] flex items-center gap-1.5 border bg-background hover:bg-accent transition-colors"
                  aria-label="Summarize conversation"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Summarize</span>
                </button>

                <div className="w-px h-8 bg-border mx-0.5" />

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  aria-label="Search messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  aria-label="Settings"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 h-8"
                autoFocus
              />

              {searchResults.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>
                    {activeResultIndex + 1} / {searchResults.length}
                  </span>
                  <button
                    onClick={() =>
                      goToSearchResult(Math.max(0, activeResultIndex - 1))
                    }
                    disabled={activeResultIndex === 0}
                    className="p-1 rounded hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      goToSearchResult(
                        Math.min(searchResults.length - 1, activeResultIndex + 1)
                      )
                    }
                    disabled={activeResultIndex === searchResults.length - 1}
                    className="p-1 rounded hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-1.5 relative"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {isLoadingMessages && messagesData.hasMore && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoadingMessages && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="text-4xl">💬</div>
                <p className="text-sm text-muted-foreground">No messages yet</p>
                <p className="text-xs text-muted-foreground">
                  Start the conversation!
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];
            const isGroupStart =
              !prevMsg ||
              prevMsg.sender !== msg.sender ||
              prevMsg.type === "date-separator" ||
              prevMsg.type === "system";
            const isGroupEnd =
              !nextMsg ||
              nextMsg.sender !== msg.sender ||
              nextMsg.type === "date-separator" ||
              nextMsg.type === "system";

            if (msg.type === "date-separator") {
              return (
                <div
                  key={msg.id}
                  className="flex justify-center my-4"
                  role="separator"
                >
                  <div className="bg-muted/50 px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
                    {msg.date}
                  </div>
                </div>
              );
            }

            if (msg.type === "system") {
              return (
                <div
                  key={msg.id}
                  className="flex justify-center my-3"
                  role="status"
                >
                  <div className="bg-muted/30 px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {msg.content}
                    <span className="text-[10px]">{msg.time}</span>
                  </div>
                </div>
              );
            }

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isGroupStart={isGroupStart}
                isGroupEnd={isGroupEnd}
                isSelected={selectedMessage === msg.id}
                onSelect={() => setSelectedMessage(msg.id)}
                onReply={handleReply}
                onEdit={handleEditMessage}
                onDelete={handleDeleteClick}
                onForward={handleForwardClick}
                onCopy={handleCopyMessage}
                onToggleFavorite={handleToggleFavorite}
                canEdit={canEditMessage(msg)}
                canDeleteForEveryone={canDeleteForEveryone(msg)}
                showReactionPicker={showReactionPicker}
                setShowReactionPicker={setShowReactionPicker}
                onReaction={handleReaction}
                onScrollToReply={scrollToMessage}
                hoveredMessageId={hoveredMessageId}
                setHoveredMessageId={setHoveredMessageId}
                searchQuery={searchQuery}
                onImageClick={handleImageClick}
              />
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 space-y-2.5 rounded-b-3xl backdrop-blur-sm flex-shrink-0 relative">
          {showScrollButton && !newMessagesCount && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 p-2 rounded-full bg-primary/50 backdrop-blur-sm text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}

          {!isUserAtBottom && newMessagesCount > 0 && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => scrollToBottom()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium"
                aria-label={`${newMessagesCount} new messages`}
              >
                <ChevronDown className="w-4 h-4" />
                {newMessagesCount} new message{newMessagesCount > 1 ? "s" : ""}
              </button>
            </div>
          )}

          {replyTo && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border-l-4 border-primary">
              <Reply className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-primary mb-0.5 truncate">
                  Replying to {replyTo.senderName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {replyTo.preview}
                </div>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="p-1 hover:bg-muted rounded flex-shrink-0"
                aria-label="Cancel reply"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {editingMessage && (
            <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
              <Edit3 className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 text-xs text-blue-600 font-medium">
                Editing message
              </div>
              <button
                onClick={() => {
                  setEditingMessage(null);
                  setMessageInput("");
                }}
                className="p-1 hover:bg-blue-500/20 rounded flex-shrink-0"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-600">
                  Recording: {formatTime(recordingTime)}
                </span>
              </div>
              <button
                onClick={cancelRecording}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                aria-label="Cancel recording"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                aria-label="Send recording"
              >
                Send
              </button>
            </div>
          )}

          {!isRecording && (
            <div className="flex rounded-xl items-end gap-2">
              <div className="relative attach-menu-container">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="attach-button p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-14 left-0 bg-card border rounded-xl shadow-xl p-2 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <AttachmentButton
                      icon={ImageIcon}
                      label="Photo"
                      onClick={() => fileInputRef.current?.click()}
                    />
                    <AttachmentButton
                      icon={VideoIcon}
                      label="Video"
                      onClick={() => videoInputRef.current?.click()}
                    />
                    <AttachmentButton
                      icon={FileText}
                      label="File"
                      onClick={() => documentInputRef.current?.click()}
                    />
                    <AttachmentButton
                      icon={MapPin}
                      label="Location"
                      onClick={() => alert("Location sharing coming soon!")}
                    />
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileUpload(e, "image")}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => handleFileUpload(e, "video")}
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  hidden
                  onChange={(e) => handleFileUpload(e, "document")}
                />
              </div>

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

              <div className="flex-1 relative -mb-1.5">
                <textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-2 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-11!"
                  aria-label="Message input"
                />
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
                aria-label={
                  isRecording ? "Stop recording" : "Record voice message"
                }
              >
                <Mic
                  className={cn(
                    "w-5 h-5",
                    isRecording ? "text-red-500" : "text-primary"
                  )}
                />
              </button>

              <button
                onClick={editingMessage ? handleUpdateMessage : handleSendMessage}
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
          )}
        </div>
      </div>

      {/* ✅ Delete Message Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to delete this message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={handleDeleteForMe}
              className="w-full sm:w-auto"
            >
              Delete for me
            </Button>
            {messageToDelete?.isOwn &&
              canDeleteForEveryone(messageToDelete) && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteForEveryone}
                  className="w-full sm:w-auto"
                >
                  Delete for everyone
                </Button>
              )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forward Message Dialog */}
      <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
            <DialogDescription>
              Select conversations to forward this message to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {conversations
              .filter((conv) => conv.id !== selectedChat?.id)
              .map((conv) => {
                const isSelected = selectedConversations.includes(conv.id);

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversations((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== conv.id)
                          : [...prev, conv.id]
                      );
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-all",
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{conv.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.type === "dm" ? "Direct Message" : "Group Chat"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setForwardDialogOpen(false);
                setMessageToForward(null);
                setSelectedConversations([]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleForwardMessage}
              disabled={selectedConversations.length === 0}
              className="flex-1"
            >
              Forward ({selectedConversations.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <button
              onClick={() => setImagePreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AttachmentButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-primary/20 transition-colors min-w-[60px]"
      title={label}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// ✅ FIXED: MessageBubble with proper media rendering
function MessageBubble({
  message,
  hoveredMessageId,
  setHoveredMessageId,
  isGroupStart,
  isGroupEnd,
  isSelected,
  onSelect,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onCopy,
  onToggleFavorite,
  canEdit,
  canDeleteForEveryone,
  showReactionPicker,
  setShowReactionPicker,
  onReaction,
  onScrollToReply,
  searchQuery,
  onImageClick,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const showActions = hoveredMessageId === message.id;
  const isOwn = message.isOwn;
  const isFavorited = message._raw?.starredBy?.length > 0;
  const isForwarded = !!message._raw?.forwardedFrom?.conversationId;

  useEffect(() => {
    if (isPlaying && message.type === "voice") {
      const interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 100 / message.totalDuration;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPlaying) {
      setPlayProgress(0);
    }
  }, [isPlaying, message.type, message.totalDuration]);

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (message.deleted) {
    return (
      <div
        id={`message-${message.id}`}
        className={cn(
          "flex gap-3 group transition-all",
          isOwn ? "flex-row-reverse" : "flex-row",
          isGroupStart ? "mt-4" : "mt-1"
        )}
      >
        {!isOwn && <div className="w-8" />}
        <div
          className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
        >
          <div className="bg-muted/50 px-3 py-2 rounded-xl italic text-sm text-muted-foreground flex items-center gap-2">
            <Trash className="w-4 h-4" />
            This message was deleted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`message-${message.id}`}
      className={cn(
        "flex gap-3 group transition-all",
        isOwn ? "flex-row-reverse" : "flex-row",
        isGroupStart ? "mt-4" : "mt-1"
      )}
      role="article"
      aria-label={`Message from ${message.sender} at ${message.time}`}
    >
      {!isOwn && (
        <div className={cn("w-8", isGroupStart ? "" : "invisible")}>
          {isGroupStart && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-xs">
                {message.avatar}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div
        onMouseEnter={() => setHoveredMessageId(message.id)}
        onMouseLeave={() => setHoveredMessageId(null)}
        className={cn("flex flex-col max-w-[60%]")}
      >
        {!isOwn && isGroupStart && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="font-semibold text-xs text-foreground">
              {message.sender}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {message.time}
            </span>
            {message.readBy && (
              <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                Read by {message.readBy}
              </Badge>
            )}
          </div>
        )}

        <AutoHeight className="w-full">
          <div
            className={cn(
              "relative p-1 transition-all break-words max-w-full w-fit ml-auto",
              isOwn ? "bg-primary/50 text-primary-foreground" : "bg-muted",
              isOwn && "rounded-[20px] rounded-br-none",
              !isOwn && "rounded-[20px] rounded-tl-none",
              isSelected && "ring-2 ring-primary/50 scale-[1.02]"
            )}
          >
            <div className="p-2 py-1">
              {/* Forwarded indicator */}
              {isForwarded && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 mb-2 pb-2 border-b",
                    isOwn
                      ? "border-primary-foreground/20"
                      : "border-border"
                  )}
                >
                  <CornerDownRight
                    className={cn(
                      "w-3 h-3",
                      isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] italic font-medium",
                      isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    Forwarded
                  </span>
                </div>
              )}

              {/* Reply preview */}
              {message.replyTo && (
                <div
                  onClick={() =>
                    onScrollToReply(message.replyTo.messageId)
                  }
                  className={cn(
                    "mb-2 px-3 py-2 rounded-2xl border-l-4 cursor-pointer transition-colors max-w-full",
                    isOwn
                      ? "bg-primary/20 border-primary-foreground/50 hover:bg-primary/30"
                      : "bg-background/60 border-primary hover:bg-background/80"
                  )}
                >
                  <div className="text-[10px] font-semibold text-primary mb-0.5 truncate">
                    {message.replyTo.sender || "Unknown"}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] truncate",
                      isOwn
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.replyTo.content || message.replyTo.preview || ""}
                  </div>
                </div>
              )}

              {/* ✅ FIXED: Message Content with proper media handling */}
              {(message.type === "text" || !message.type) && message.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {highlightText(message.content)}
                </p>
              )}

              {/* ✅ Image rendering */}
              {message.type === "image" && message.url && (
                <div className="cursor-pointer" onClick={() => onImageClick(getFileUrl(message.url))}>
                  <img
                    src={getFileUrl(message.url)}
                    alt="Shared image"
                    className="rounded-lg max-w-[300px] max-h-[300px] object-cover hover:opacity-90 transition-opacity border border-primary/10"
                    onError={(e) => {
                      console.error("Failed to load image:", message.url);
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ccc' width='300' height='300'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}

              {/* ✅ Video rendering */}
              {message.type === "video" && message.url && (
                <video
                  ref={videoRef}
                  src={getFileUrl(message.url)}
                  controls
                  className="rounded-lg max-w-[300px] max-h-[300px]"
                  onError={(e) => {
                    console.error("Failed to load video:", message.url);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* ✅ Audio rendering */}
              {message.type === "audio" && message.url && (
                <div className="flex items-center gap-3 min-w-[200px] bg-muted/50 p-3 rounded-lg">
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-primary" />
                    ) : (
                      <Play className="w-5 h-5 text-primary" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${playProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Audio message
                    </p>
                  </div>
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <audio
                    ref={audioRef}
                    src={getFileUrl(message.url)}
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error("Failed to load audio:", message.url);
                    }}
                  />
                </div>
              )}

              {/* ✅ Document/File rendering */}
              {(message.type === "file" || message.type === "document") && message.url && (
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {message.fileName || "Document"}
                    </p>
                    {message.fileSize && (
                      <p className="text-xs text-muted-foreground">
                        {message.fileSize}
                      </p>
                    )}
                  </div>
                  <a
                    href={getFileUrl(message.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )}

              {isOwn && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  {message.edited && (
                    <span
                      className={cn(
                        "text-[10px] italic mr-1",
                        isOwn
                          ? "text-primary-foreground/50"
                          : "text-muted-foreground"
                      )}
                    >
                      (edited)
                    </span>
                  )}
                  <span className="text-[10px] text-primary-foreground/70">
                    {message.time}
                  </span>
                  <MessageStateIcon state={message.state} />
                </div>
              )}
            </div>
          </div>

          {message.reactions &&
            Object.keys(message.reactions).length > 0 && (
              <div
                className={cn(
                  "flex gap-1 mt-1",
                  isOwn ? "flex-row-reverse" : "flex-row"
                )}
              >
                {Object.entries(message.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => onReaction(message.id, emoji)}
                    className="bg-primary/20 hover:bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all hover:scale-110"
                  >
                    <span>{emoji}</span>
                    <span className="text-[10px] font-medium">{count}</span>
                  </button>
                ))}
              </div>
            )}

          {showActions && (
            <div
              className={cn(
                "flex gap-1 mt-1.5 transition-all duration-300 ease-out",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              <ActionButton
                icon={Reply}
                tooltip="Reply"
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(message);
                }}
              />
              <ActionButton
                icon={Star}
                tooltip={isFavorited ? "Unstar" : "Star"}
                className={isFavorited ? "text-yellow-500" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(message.id, isFavorited);
                }}
              />
              <ActionButton
                icon={Forward}
                tooltip="Forward"
                onClick={(e) => {
                  e.stopPropagation();
                  onForward(message);
                }}
              />
              <ActionButton
                icon={Copy}
                tooltip="Copy"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(message);
                }}
              />
              <ActionButton
                icon={Smile}
                tooltip="React"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionPicker(
                    showReactionPicker === message.id ? null : message.id
                  );
                }}
              />
              {isOwn && canEdit && (
                <ActionButton
                  icon={Edit3}
                  tooltip="Edit"
                  className="text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(message);
                  }}
                />
              )}
              <ActionButton
                icon={Trash2}
                tooltip="Delete"
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(message);
                }}
              />
            </div>
          )}
        </AutoHeight>

        {showReactionPicker === message.id && (
          <div
            className={cn(
              "flex gap-1.5 mt-2 p-2 bg-card border rounded-xl shadow-lg z-10 transition-all duration-200 ease-out",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  onReaction(message.id, emoji);
                }}
                className="text-xl hover:scale-125 transition-transform p-1"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, tooltip, className, onClick }) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-lg bg-muted/80 hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95",
        className
      )}
      aria-label={tooltip}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function MessageStateIcon({ state }) {
  switch (state) {
    case "sending":
      return (
        <Clock className="w-3 h-3 text-primary-foreground/50 animate-pulse" />
      );
    case "sent":
      return <Check className="w-3 h-3 text-primary-foreground/70" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-primary-foreground/70" />;
    case "seen":
      return <CheckCheck className="w-3 h-3 text-green-400" />;
    case "failed":
      return <X className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
}