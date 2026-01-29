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
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function RealisticChatUI() {
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
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Realistic message data with ALL features
  const [messages, setMessages] = useState([
    {
      id: "date-sep-1",
      type: "date-separator",
      date: "Yesterday",
    },
    {
      id: "system-1",
      type: "system",
      content: "Sarah Chen joined the group",
      time: "9:15 AM",
    },
    {
      id: 1,
      sender: "Team Lead",
      avatar: "TL",
      time: "10:30 AM",
      timestamp: Date.now() - 7200000,
      content:
        "Hey team, just reviewed the latest updates. Looks great but we need to coordinate on timing.",
      isOwn: false,
      state: "seen",
      readBy: 12,
      reactions: { "👍": 3, "❤️": 2 },
    },
    {
      id: 2,
      sender: "Sarah Chen",
      avatar: "SC",
      time: "10:32 AM",
      timestamp: Date.now() - 7080000,
      content: "Agreed! Should we schedule a quick sync?",
      isOwn: false,
      state: "seen",
      readBy: 8,
      replyTo: {
        id: 1,
        sender: "Team Lead",
        content: "Hey team, just reviewed the latest updates...",
      },
    },
    {
      id: 3,
      sender: "Zoe Saldana",
      avatar: "ZS",
      time: "10:35 AM",
      timestamp: Date.now() - 6900000,
      type: "voice",
      duration: "0:23",
      totalDuration: 23,
      isOwn: false,
      state: "seen",
      played: false,
      waveform: [30, 60, 45, 80, 55, 90, 40, 70, 50, 85, 45, 75, 35, 65, 50, 80, 40, 60],
    },
    {
      id: "date-sep-2",
      type: "date-separator",
      date: "Today",
    },
    {
      id: "system-2",
      type: "system",
      content: "Team Lead pinned a message",
      time: "10:35 AM",
    },
    {
      id: 4,
      sender: "You",
      avatar: "YO",
      time: "10:40 AM",
      timestamp: Date.now() - 180000,
      content: "I can join at 2 PM. Does that work for everyone?",
      isOwn: true,
      state: "seen",
      edited: true,
      editedAt: Date.now() - 120000,
    },
    {
      id: 5,
      sender: "You",
      avatar: "YO",
      time: "10:41 AM",
      timestamp: Date.now() - 120000,
      content: "Also, I've prepared the deck we discussed.",
      isOwn: true,
      state: "delivered",
    },
    {
      id: 6,
      sender: "Alex Kim",
      avatar: "AK",
      time: "10:42 AM",
      timestamp: Date.now() - 60000,
      content: "Perfect timing! 2 PM works for me.",
      isOwn: false,
      state: "seen",
      readBy: 5,
      reactions: { "👍": 1 },
    },
    {
      id: 7,
      sender: "You",
      avatar: "YO",
      time: "10:43 AM",
      timestamp: Date.now() - 30000,
      content: "Great! See you all then 👍",
      isOwn: true,
      state: "sending",
    },
  ]);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
    setIsUserAtBottom(true);
    setNewMessagesCount(0);
  }, []);

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
    const draft = localStorage.getItem('chat-draft');
    if (draft) setMessageInput(draft);
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    localStorage.setItem('chat-draft', messageInput);
  }, [messageInput]);

  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  // Simulate new message arrival
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isUserAtBottom) {
        setNewMessagesCount(prev => prev + 1);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isUserAtBottom]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
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
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput("");
      setReplyTo(null);
      localStorage.removeItem('chat-draft');
      
      // Auto-scroll only if user was at bottom
      if (isUserAtBottom) {
        setTimeout(() => scrollToBottom(), 50);
      }
      
      // Simulate state changes
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, state: "sent" } : m
        ));
      }, 500);
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, state: "delivered" } : m
        ));
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
    setMessages(prev => prev.map(msg => {
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
    }));
    setShowReactionPicker(null);
  };

  const handleDeleteMessage = (messageId, deleteFor = 'me') => {
    if (deleteFor === 'everyone') {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, deleted: true, content: null } 
          : msg
      ));
    } else {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
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
    if (editingMessage && messageInput.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id 
          ? { 
              ...msg, 
              content: messageInput, 
              edited: true,
              editedAt: Date.now() 
            } 
          : msg
      ));
      setMessageInput("");
      setEditingMessage(null);
      localStorage.removeItem('chat-draft');
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

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setShowReactionPicker(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-100px)] flex flex-col max-w-5xl mx-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 border-b  rounded-t-3xl backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
              TC
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-sm">Team Chat - Production</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span>125 members</span>
              <span className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
              <span className="flex items-center gap-1 text-green-500 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                45 online
              </span>
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

          <button 
            className="h-8 px-2.5 rounded-md text-[10px] flex items-center gap-1.5 border bg-background hover:bg-accent transition-colors hidden sm:flex"
            aria-label="Translate messages"
          >
            Translate
          </button>

          <div className="w-px h-8 bg-border mx-0.5" />

          <button 
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="Search messages"
          >
            {/* <Search className="w-4 h-4" /> */}
          </button>

          <button 
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
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

          // Date Separator
          if (msg.type === "date-separator") {
            return (
              <div key={msg.id} className="flex justify-center my-4" role="separator">
                <div className="bg-muted/50 px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
                  {msg.date}
                </div>
              </div>
            );
          }

          // System Message
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
            />
          );
        })}

        {/* Typing Indicator */}
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

      {/* Scroll to Bottom Button */}
      {showScrollButton && !newMessagesCount && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-32 right-6 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Context Menu */}
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
        {/* New Messages Indicator - Centered above input */}
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
        
        {/* Reply Preview */}
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

        {/* Edit Mode Indicator */}
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

        {/* Message Input */}
        <div className="flex rounded-xl items-end gap-2">
          <button 
            className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>

          <button 
            className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

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
            className="p-2.5 rounded-xl hover:bg-accent transition-colors flex-shrink-0 h-11 flex items-center justify-center"
            aria-label="Record voice message"
          >
            <Mic className="w-5 h-5 text-primary" />
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
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ 
  message, 
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
}) {
  const [showActions, setShowActions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  const isOwn = message.isOwn;

  // Voice message playback simulation
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

  // Deleted message
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
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onContextMenu={(e) => onContextMenu(e, message)}
      role="article"
      aria-label={`Message from ${message.sender} at ${message.time}`}
    >
      {/* Avatar - only show on group start for others */}
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

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[50%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender name and time - only on group start */}
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

        {/* Reply Preview */}
        {message.replyTo && (
          <div 
            onClick={() => onScrollToReply(message.replyTo.id)}
            className={cn(
              "mb-1 px-3 py-2 rounded-2xl border-l-4 cursor-pointer hover:bg-muted/50 transition-colors max-w-full",
              isOwn ? "bg-primary-foreground/10 border-primary-foreground/30" : "bg-muted/50 border-primary"
            )}
          >
            <div className={cn("text-[10px] font-semibold mb-1", isOwn ? "text-primary-foreground/70" : "text-primary")}>
              {message.replyTo.sender}
            </div>
            <div className={cn("text-xs truncate", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-4 py-2.5 transition-all inline-block max-w-full",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted",
            // Rounded corners based on message position
            isGroupStart && isGroupEnd && "rounded-[20px]",
            isOwn && isGroupStart && !isGroupEnd && "rounded-[20px] rounded-br-md",
            isOwn && !isGroupStart && isGroupEnd && "rounded-[20px] rounded-tr-md",
            isOwn && !isGroupStart && !isGroupEnd && "rounded-[20px] rounded-tr-md rounded-br-md",
            !isOwn && isGroupStart && !isGroupEnd && "rounded-[20px] rounded-bl-md",
            !isOwn && !isGroupStart && isGroupEnd && "rounded-[20px] rounded-tl-md",
            !isOwn && !isGroupStart && !isGroupEnd && "rounded-[20px] rounded-tl-md rounded-bl-md",
            isSelected && "ring-2 ring-primary/50 scale-[1.02]"
          )}
        >
          {/* Text Message */}
          {message.content && (
            <div>
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
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

          {/* Voice Message */}
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

          {/* Message State & Time (for own messages) */}
          {isOwn && isGroupEnd && (
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-primary-foreground/70">
                {message.time}
              </span>
              <MessageStateIcon state={message.state} />
            </div>
          )}
        </div>

        {/* Reactions */}
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

        {/* Hover Actions - Animated */}
        <div
          className={cn(
            "flex gap-1 mt-1.5 transition-all duration-300 ease-out",
            isOwn ? "flex-row-reverse" : "flex-row",
            showActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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

        {/* Reaction Picker */}
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

// Context Menu Component
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
      <MenuItem icon={Forward} label="Forward" onClick={() => {}} />
      <MenuItem icon={Star} label="Star" onClick={() => {}} />
      <MenuItem icon={Copy} label="Copy" onClick={onCopy} />
      <MenuItem icon={Pin} label="Pin" onClick={() => {}} />
      
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

// Menu Item Component
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

// Action Button Component
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

// Message State Icon Component
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