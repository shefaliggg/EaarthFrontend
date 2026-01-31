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
  Play,
  Pause,
  Sparkles,
  Smile,
  Send,
  Paperclip,
  MoreVertical,
  ChevronDown,
  X,
  Clock,
  Copy,
  Pin,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { AutoHeight } from "../../../../shared/components/wrappers/AutoHeight";
import EmojiPicker from "emoji-picker-react";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function EnhancedChatUI({ selectedChat }) {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  
  // New feature states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // 🔥 Store messages by chat ID to maintain conversation history
  const [messagesByChat, setMessagesByChat] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);

  // 🔥 KEY FEATURE: Scroll to bottom function (from first code)
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto"
    });
    setIsUserAtBottom(true);
    setNewMessagesCount(0);
  }, []);

  // 🔥 CRITICAL: Initial mount - scroll to bottom on first load AND on refresh
  useEffect(() => {
    // Delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      scrollToBottom(false); // Use instant scroll for initial mount
    }, 150);
    return () => clearTimeout(timer);
  }, [scrollToBottom]);

  // 🔥 Update messages when selectedChat changes - PREVENTS SCROLL JUMP
  useEffect(() => {
    if (selectedChat?.id) {
      console.log("💬 Chat changed to:", selectedChat);
      setCurrentChatId(selectedChat.id);
      
      // Initialize messages for new chat if not exists
      if (!messagesByChat[selectedChat.id]) {
        const initialMessages = generateInitialMessages(selectedChat);
        setMessagesByChat(prev => ({
          ...prev,
          [selectedChat.id]: initialMessages
        }));
      }
      
      // Reset UI state when switching chats
      setReplyTo(null);
      setEditingMessage(null);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSelectedMessage(null);
      setShowReactionPicker(null);
      setShowAttachMenu(false);
      setShowEmojiPicker(false);
      
      // 🔥 CRITICAL: Scroll to bottom AFTER messages load to prevent jump
      setTimeout(() => {
        scrollToBottom(false); // Use instant scroll for chat switching
        setIsUserAtBottom(true);
      }, 150);
    }
  }, [selectedChat?.id, scrollToBottom]);

  // Get current messages for the active chat
  const messages = currentChatId ? (messagesByChat[currentChatId] || []) : [];

  // 🔥 Function to generate initial messages based on chat type
  const generateInitialMessages = (chat) => {
    const baseMessages = [
      {
        id: "date-sep-1",
        type: "date-separator",
        date: "Yesterday",
      },
    ];

    if (chat.type === "all") {
      return [
        ...baseMessages,
        {
          id: "system-1",
          type: "system",
          content: "Welcome to All Departments chat - Company-wide announcements",
          time: "9:00 AM",
        },
        {
          id: 1,
          sender: "Admin",
          avatar: "AD",
          time: "10:30 AM",
          timestamp: Date.now() - 7200000,
          content: "Welcome everyone! This is the main communication channel for all departments.",
          isOwn: false,
          state: "seen",
          readBy: 125,
        },
      ];
    }

    if (chat.type === "group") {
      return [
        ...baseMessages,
        {
          id: "system-1",
          type: "system",
          content: `${chat.name} group chat`,
          time: "9:15 AM",
        },
        {
          id: 1,
          sender: "Team Lead",
          avatar: "TL",
          time: "10:30 AM",
          timestamp: Date.now() - 7200000,
          content: `Hey ${chat.name} team, just reviewed the latest updates. Looks great!`,
          isOwn: false,
          state: "seen",
          readBy: chat.members || 12,
        },
      ];
    }

    if (chat.type === "dm") {
      return [
        ...baseMessages,
        {
          id: 1,
          sender: chat.name,
          avatar: chat.avatar,
          time: "10:30 AM",
          timestamp: Date.now() - 7200000,
          content: "Hey! How's the project going?",
          isOwn: false,
          state: "seen",
        },
        {
          id: 2,
          sender: "You",
          avatar: "YO",
          time: "10:35 AM",
          timestamp: Date.now() - 6900000,
          content: "Going well! Just finished reviewing the latest updates.",
          isOwn: true,
          state: "seen",
        },
      ];
    }

    return baseMessages;
  };

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

  const goToSearchResult = useCallback((index) => {
    const msg = searchResults[index];
    if (!msg) return;
    scrollToMessage(msg.id);
    setActiveResultIndex(index);
  }, [searchResults]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    setIsUserAtBottom(isNearBottom);

    if (isNearBottom) {
      setNewMessagesCount(0);
    }
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [messageInput]);

  // Load draft from localStorage
  useEffect(() => {
    if (currentChatId) {
      const draft = localStorage.getItem(`chat-draft-${currentChatId}`);
      if (draft) setMessageInput(draft);
    }
  }, [currentChatId]);

  // Save draft to localStorage
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(`chat-draft-${currentChatId}`, messageInput);
    }
  }, [messageInput, currentChatId]);

  // Simulate new message arrival
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isUserAtBottom) {
        setNewMessagesCount(prev => prev + 1);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isUserAtBottom]);

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.emoji-picker-container') && !e.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
      if (!e.target.closest('.attach-menu-container') && !e.target.closest('.attach-button')) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && currentChatId) {
      const newMessage = {
        id: Date.now(),
        sender: "You",
        avatar: "YO",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        timestamp: Date.now(),
        content: messageInput,
        isOwn: true,
        state: "sending",
        replyTo: replyTo,
      };

      // Update messages for current chat
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), newMessage]
      }));
      
      setMessageInput("");
      setReplyTo(null);
      localStorage.removeItem(`chat-draft-${currentChatId}`);

      // 🔥 Auto-scroll to bottom when sending message (only if user was at bottom)
      if (isUserAtBottom) {
        setTimeout(() => scrollToBottom(), 50);
      }

      // Simulate state changes
      setTimeout(() => {
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId]: prev[currentChatId].map(m =>
            m.id === newMessage.id ? { ...m, state: "sent" } : m
          )
        }));
      }, 500);

      setTimeout(() => {
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId]: prev[currentChatId].map(m =>
            m.id === newMessage.id ? { ...m, state: "delivered" } : m
          )
        }));
      }, 1500);
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

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  const handleReaction = (messageId, emoji) => {
    if (!currentChatId) return;
    
    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId]: prev[currentChatId].map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (reactions[emoji]) {
            reactions[emoji]++;
          } else {
            reactions[emoji] = 1;
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    }));
    setShowReactionPicker(null);
  };

  const handleDeleteMessage = (messageId, deleteFor = 'me') => {
    if (!currentChatId) return;
    
    if (deleteFor === 'everyone') {
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId].map(msg =>
          msg.id === messageId
            ? { ...msg, deleted: true, content: null }
            : msg
        )
      }));
    } else {
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId].filter(msg => msg.id !== messageId)
      }));
    }
    setContextMenu(null);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    setContextMenu(null);
    textareaRef.current?.focus();
  };

  const handleUpdateMessage = () => {
    if (editingMessage && messageInput.trim() && currentChatId) {
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId].map(msg =>
          msg.id === editingMessage.id
            ? {
              ...msg,
              content: messageInput,
              edited: true,
              editedAt: Date.now()
            }
            : msg
        )
      }));
      setMessageInput("");
      setEditingMessage(null);
      localStorage.removeItem(`chat-draft-${currentChatId}`);
    }
  };

  const canEditMessage = (message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSelectedMessage(messageId);
    setTimeout(() => setSelectedMessage(null), 2000);
  };

  // File upload handlers
  const handleFileUpload = (e, type) => {
    if (!currentChatId) return;
    
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newMessage = {
      id: Date.now(),
      sender: "You",
      avatar: "YO",
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      timestamp: Date.now(),
      type: type,
      url: url,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + " KB",
      isOwn: true,
      state: "sending",
    };

    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMessage]
    }));

    setShowAttachMenu(false);

    // 🔥 Auto-scroll when uploading file (only if user was at bottom)
    if (isUserAtBottom) {
      setTimeout(() => scrollToBottom(), 50);
    }

    // Simulate state changes
    setTimeout(() => {
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId].map(m =>
          m.id === newMessage.id ? { ...m, state: "sent" } : m
        )
      }));
    }, 500);

    setTimeout(() => {
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId].map(m =>
          m.id === newMessage.id ? { ...m, state: "delivered" } : m
        )
      }));
    }, 1500);

    e.target.value = '';
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        if (!currentChatId) return;
        
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        
        const newMessage = {
          id: Date.now(),
          sender: "You",
          avatar: "YO",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          timestamp: Date.now(),
          type: "voice",
          url: url,
          duration: formatTime(recordingTime),
          totalDuration: recordingTime,
          isOwn: true,
          state: "sending",
          played: false,
          waveform: Array.from({ length: 18 }, () => Math.random() * 100),
        };

        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId]: [...(prev[currentChatId] || []), newMessage]
        }));
        
        // 🔥 Auto-scroll when sending voice message (only if user was at bottom)
        if (isUserAtBottom) {
          setTimeout(() => scrollToBottom(), 50);
        }

        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setShowReactionPicker(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 🔥 Show empty state if no chat selected
  if (!selectedChat) {
    return (
      <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] sticky top-5 flex items-center justify-center">
        <div className="text-center space-y-3 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Select a chat to start messaging</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Choose a department group or individual member from the sidebar to begin your conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] sticky top-5 flex flex-col mx-auto">
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
                  {selectedChat.icon && <selectedChat.icon className="w-5 h-5 text-primary" />}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  {selectedChat.type === "dm" ? (
                    <>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        selectedChat.status === "online" && "bg-green-500 animate-pulse",
                        selectedChat.status === "away" && "bg-yellow-500",
                        selectedChat.status === "offline" && "bg-gray-400"
                      )} />
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
                <span>{activeResultIndex + 1} / {searchResults.length}</span>
                <button
                  onClick={() => goToSearchResult(Math.max(0, activeResultIndex - 1))}
                  disabled={activeResultIndex === 0}
                  className="p-1 rounded hover:bg-accent disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToSearchResult(Math.min(searchResults.length - 1, activeResultIndex + 1))}
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
        className="flex-1 overflow-y-auto p-4 space-y-1.5 relative scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          const isGroupStart = !prevMsg || prevMsg.sender !== msg.sender || prevMsg.type === "date-separator" || prevMsg.type === "system" || msg.type === "date-separator" || msg.type === "system";
          const isGroupEnd = !nextMsg || nextMsg.sender !== msg.sender || nextMsg.type === "date-separator" || nextMsg.type === "system" || msg.type === "date-separator" || msg.type === "system";

          if (msg.type === "date-separator") {
            return (
              <div key={msg.id} className="flex justify-center my-4" role="separator">
                <div className="bg-muted/50 px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
                  {msg.date}
                </div>
              </div>
            );
          }

          if (msg.type === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-3" role="status">
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
              onContextMenu={handleContextMenu}
              onReply={(msg) => setReplyTo(msg)}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
              canEdit={canEditMessage(msg)}
              showReactionPicker={showReactionPicker}
              setShowReactionPicker={setShowReactionPicker}
              onReaction={handleReaction}
              onScrollToReply={scrollToMessage}
              hoveredMessageId={hoveredMessageId}
              setHoveredMessageId={setHoveredMessageId}
              searchQuery={searchQuery}
            />
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-end" role="status" aria-label="Someone is typing">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-xs">MJ</AvatarFallback>
            </Avatar>

            <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          message={contextMenu.message}
          onReply={() => {
            setReplyTo(contextMenu.message);
            setContextMenu(null);
          }}
          onEdit={() => handleEditMessage(contextMenu.message)}
          onDelete={handleDeleteMessage}
          onCopy={() => {
            navigator.clipboard.writeText(contextMenu.message.content);
            setContextMenu(null);
          }}
          canEdit={canEditMessage(contextMenu.message)}
        />
      )}

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
              {newMessagesCount} new message{newMessagesCount > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {replyTo && (
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-primary mb-1 truncate">
                Replying to {replyTo.sender}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {replyTo.content}
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
                    onClick={() => alert('Location sharing coming soon!')}
                  />
                  <AttachmentButton
                    icon={BarChart3}
                    label="Poll"
                    onClick={() => alert('Poll feature coming soon!')}
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => handleFileUpload(e, 'video')}
              />
              <input
                ref={documentInputRef}
                type="file"
                hidden
                onChange={(e) => handleFileUpload(e, 'document')}
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

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                }}
                aria-label="Message input"
              />
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
              aria-label={isRecording ? "Stop recording" : "Record voice message"}
            >
              <Mic className={cn("w-5 h-5", isRecording ? "text-red-500" : "text-primary")} />
            </button>

            <button
              onClick={editingMessage ? handleUpdateMessage : handleSendMessage}
              disabled={!messageInput.trim()}
              className={cn(
                "h-11 px-5 rounded-xl text-sm flex items-center gap-2 transition-all flex-shrink-0",
                messageInput.trim()
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
  );
}

function AttachmentButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-accent transition-colors min-w-[60px]"
      title={label}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MessageBubble({
  message,
  hoveredMessageId,
  setHoveredMessageId,
  isGroupStart,
  isGroupEnd,
  isSelected,
  onSelect,
  onContextMenu,
  onReply,
  onEdit,
  onDelete,
  canEdit,
  showReactionPicker,
  setShowReactionPicker,
  onReaction,
  onScrollToReply,
  searchQuery,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  const showActions = hoveredMessageId === message.id;
  const isOwn = message.isOwn;

  useEffect(() => {
    if (isPlaying && message.type === "voice") {
      const interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + (100 / message.totalDuration);
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPlaying) {
      setPlayProgress(0);
    }
  }, [isPlaying, message.type, message.totalDuration]);

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
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
        <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
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
      onContextMenu={(e) => onContextMenu(e, message)}
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
        className={cn("flex flex-col max-w-[50%]", isOwn ? "items-end" : "items-start")}
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

        {message.replyTo && (
          <div
            onClick={() => onScrollToReply(message.replyTo.id)}
            className={cn(
              "mb-1 px-3 py-2 rounded-2xl border-l-4 cursor-pointer transition-colors max-w-full",
              isOwn ? "bg-primary/30 border-primary-foreground/30" : "bg-muted/50 border-primary"
            )}
          >
            <div className={cn("text-[10px] font-semibold mb-1", isOwn ? "text-primary" : "text-primary")}>
              {message.replyTo.sender}
            </div>
            <div className={cn("text-xs truncate", isOwn ? "text-foreground" : "text-muted-foreground")}>
              {message.replyTo.content}
            </div>
          </div>
        )}

        <AutoHeight>
          <div
            className={cn(
              "relative px-4 py-2.5 transition-all inline-block max-w-full",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
              isOwn && "rounded-[20px] rounded-br-none",
              !isOwn && "rounded-[20px] rounded-tl-none",
              isSelected && "ring-2 ring-primary/50 scale-[1.02]"
            )}
          >
            {message.content && !message.type && (
              <div>
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {highlightText(message.content)}
                </p>
                {message.edited && (
                  <span className={cn(
                    "text-[10px] italic ml-2",
                    isOwn ? "text-primary-foreground/50" : "text-muted-foreground"
                  )}>
                    (edited)
                  </span>
                )}
              </div>
            )}

            {message.type === "image" && (
              <div className="space-y-2">
                <img
                  src={message.url}
                  alt="Shared image"
                  className="rounded-lg max-w-[300px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity border border-primary/10"
                  onClick={() => window.open(message.url, '_blank')}
                />
              </div>
            )}

            {message.type === "video" && (
              <div className="space-y-2">
                <video
                  src={message.url}
                  controls
                  className="rounded-lg max-w-[300px] max-h-[300px]"
                />
              </div>
            )}

            {message.type === "document" && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.fileName}</p>
                  <p className="text-xs text-muted-foreground">{message.fileSize}</p>
                </div>
                <a
                  href={message.url}
                  download={message.fileName}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </a>
              </div>
            )}

            {message.type === "voice" && (
              <div className="flex items-center gap-3 min-w-[260px] max-w-full">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={cn(
                    "p-2 rounded-full transition-colors flex-shrink-0",
                    isOwn
                      ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
                      : "bg-primary/10 hover:bg-primary/20"
                  )}
                  aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-0.5 h-8 relative min-w-0">
                  {message.waveform.map((height, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all flex-shrink-0",
                        i < (playProgress / 100) * message.waveform.length
                          ? isOwn ? "bg-primary-foreground" : "bg-primary"
                          : isOwn ? "bg-primary-foreground/30" : "bg-primary/30"
                      )}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <span className={cn("text-xs flex-shrink-0 font-medium", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {message.duration}
                </span>
                <div className="relative flex-shrink-0">
                  <Mic className={cn("w-4 h-4", isOwn ? "text-primary-foreground/50" : "text-muted-foreground")} />
                  {!message.played && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            )}

            {isOwn && isGroupEnd && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-primary-foreground/70">
                  {message.time}
                </span>
                <MessageStateIcon state={message.state} />
              </div>
            )}
          </div>

          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className={cn("flex gap-1 mt-1", isOwn ? "flex-row-reverse" : "flex-row")}>
              {Object.entries(message.reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReaction(message.id, emoji)}
                  className="bg-muted/80 hover:bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all hover:scale-110"
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
                isOwn ? "flex-row-reverse" : "flex-row"
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
              <ActionButton icon={Forward} tooltip="Forward" />
              <ActionButton icon={Star} tooltip="Star" />
              <ActionButton
                icon={Smile}
                tooltip="React"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionPicker(showReactionPicker === message.id ? null : message.id);
                }}
              />
              {isOwn && (
                <ActionButton
                  icon={Trash}
                  tooltip="Delete"
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(message.id, 'me');
                  }}
                />
              )}
              <ActionButton icon={MoreVertical} tooltip="More" />
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

function ContextMenu({ x, y, message, onReply, onEdit, onDelete, onCopy, canEdit }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newX = x + rect.width > window.innerWidth ? x - rect.width : x;
      const newY = y + rect.height > window.innerHeight ? y - rect.height : y;
      setPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border rounded-xl shadow-xl py-1 z-50 min-w-[180px]"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
      role="menu"
    >
      <MenuItem icon={Reply} label="Reply" onClick={onReply} />
      {message.isOwn && canEdit && (
        <MenuItem icon={Edit3} label="Edit" onClick={onEdit} />
      )}
      <MenuItem icon={Forward} label="Forward" onClick={() => { }} />
      <MenuItem icon={Star} label="Star" onClick={() => { }} />
      <MenuItem icon={Copy} label="Copy" onClick={onCopy} />
      <MenuItem icon={Pin} label="Pin" onClick={() => { }} />

      {message.isOwn && (
        <>
          <div className="h-px bg-border my-1" />
          <MenuItem
            icon={Trash}
            label="Delete for me"
            onClick={() => onDelete(message.id, 'me')}
            className="text-red-500 hover:bg-red-500/10"
          />
          <MenuItem
            icon={Trash}
            label="Delete for everyone"
            onClick={() => onDelete(message.id, 'everyone')}
            className="text-red-500 hover:bg-red-500/10"
          />
        </>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, className }) {
  return (
    <button
      className={cn(
        "w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-muted transition-colors text-left",
        className
      )}
      onClick={onClick}
      role="menuitem"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
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
      return <Clock className="w-3 h-3 text-primary-foreground/50 animate-pulse" />;
    case "sent":
      return <Check className="w-3 h-3 text-primary-foreground/70" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-primary-foreground/70" />;
    case "seen":
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    default:
      return null;
  }
}