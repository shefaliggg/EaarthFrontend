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
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-100px)] flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 border-b bg-card/95 backdrop-blur-sm flex-shrink-0">
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
            <Search className="w-4 h-4" />
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
        className="flex-1 overflow-y-auto p-3 space-y-1 relative scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
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
              <div key={msg.id} className="flex justify-center my-3" role="separator">
                <div className="bg-muted/50 px-2.5 py-1 rounded-full text-[10px] text-muted-foreground font-medium">
                  {msg.date}
                </div>
              </div>
            );
          }

          // System Message
          if (msg.type === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-2" role="status">
                <div className="bg-muted/30 px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {msg.content}
                  <span className="text-[9px]">{msg.time}</span>
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
          <div className="flex gap-2.5 items-end" role="status" aria-label="Someone is typing">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-muted text-[10px]">MJ</AvatarFallback>
            </Avatar>

            <div className="bg-muted px-3 py-2 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* New Messages Indicator */}
      {!isUserAtBottom && newMessagesCount > 0 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => scrollToBottom()}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
            aria-label={`${newMessagesCount} new messages`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            {newMessagesCount} new message{newMessagesCount > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollButton && !newMessagesCount && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 right-6 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-4 h-4" />
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
      <div className="border-t p-3 space-y-2 bg-card/95 backdrop-blur-sm flex-shrink-0">
        {/* Reply Preview */}
        {replyTo && (
          <div className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-md">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-primary mb-0.5 truncate">
                Replying to {replyTo.sender}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {replyTo.content}
              </div>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="p-0.5 hover:bg-muted rounded flex-shrink-0"
              aria-label="Cancel reply"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Edit Mode Indicator */}
        {editingMessage && (
          <div className="flex items-center gap-1.5 bg-blue-500/10 p-1.5 rounded-md border border-blue-500/20">
            <Edit3 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 text-[10px] text-blue-600 font-medium">
              Editing message
            </div>
            <button
              onClick={() => {
                setEditingMessage(null);
                setMessageInput("");
              }}
              className="p-0.5 hover:bg-blue-500/20 rounded flex-shrink-0"
              aria-label="Cancel editing"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Smart Replies */}
        {!editingMessage && !replyTo && (
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { label: "Sounds good", variant: "default" },
                { label: "I'll review it", variant: "muted" },
                { label: "Schedule meeting", variant: "outline" },
                { label: "Approved ✓", variant: "success" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setMessageInput(item.label)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap",
                    "hover:shadow-sm hover:border-primary hover:scale-105 active:scale-95",
                    item.variant === "default" &&
                      "bg-primary/10 text-primary border-primary/30",
                    item.variant === "muted" &&
                      "bg-muted text-muted-foreground border-border",
                    item.variant === "outline" &&
                      "bg-card text-foreground border-border",
                    item.variant === "success" &&
                      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  )}
                  aria-label={`Quick reply: ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end gap-1.5">
          <button 
            className="p-1.5 rounded-md hover:bg-accent transition-colors mb-0.5"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>

          <button 
            className="p-1.5 rounded-md hover:bg-accent transition-colors mb-0.5"
            aria-label="Add emoji"
          >
            <Smile className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
              style={{
                minHeight: "38px",
                maxHeight: "100px",
              }}
              aria-label="Message input"
            />
          </div>

          <button 
            className="p-1.5 rounded-md hover:bg-accent transition-colors mb-0.5"
            aria-label="Record voice message"
          >
            <Mic className="w-4 h-4 text-primary" />
          </button>

          <button
            onClick={editingMessage ? handleUpdateMessage : handleSendMessage}
            disabled={!messageInput.trim()}
            className={cn(
              "h-9 px-3 rounded-md text-[10px] flex items-center gap-1.5 transition-all mb-0.5",
              messageInput.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label={editingMessage ? "Update message" : "Send message"}
          >
            <Send className="w-3.5 h-3.5" />
            {editingMessage ? "Update" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component (keeping your existing implementation but with smaller sizing)
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
          "flex gap-2.5 group transition-all",
          isOwn ? "flex-row-reverse" : "flex-row",
          isGroupStart ? "mt-2.5" : "mt-0.5"
        )}
      >
        {!isOwn && <div className="w-7" />}
        <div className={cn("flex flex-col max-w-[65%]", isOwn ? "items-end" : "items-start")}>
          <div className="bg-muted/50 px-2.5 py-1.5 rounded-lg italic text-xs text-muted-foreground flex items-center gap-1.5">
            <Trash className="w-3 h-3" />
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
        "flex gap-2.5 group transition-all",
        isOwn ? "flex-row-reverse" : "flex-row",
        isGroupStart ? "mt-2.5" : "mt-0.5"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onContextMenu={(e) => onContextMenu(e, message)}
      role="article"
      aria-label={`Message from ${message.sender} at ${message.time}`}
    >
      {/* Avatar - only show on group start for others */}
      {!isOwn && (
        <div className={cn("w-7", isGroupStart ? "" : "invisible")}>
          {isGroupStart && (
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-muted text-[10px]">
                {message.avatar}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[65%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender name and time - only on group start */}
        {!isOwn && isGroupStart && (
          <div className="flex items-center gap-1.5 mb-0.5 px-0.5">
            <span className="font-semibold text-[10px] text-foreground">
              {message.sender}
            </span>
            <span className="text-[9px] text-muted-foreground">
              {message.time}
            </span>
            {message.readBy && (
              <Badge variant="outline" className="text-[8px] h-3.5 px-1">
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
              "w-full mb-0.5 px-2 py-1.5 rounded-md border-l-2 cursor-pointer hover:bg-muted/50 transition-colors",
              isOwn ? "bg-primary-foreground/10 border-primary-foreground/30" : "bg-muted/50 border-primary"
            )}
          >
            <div className={cn("text-[9px] font-semibold mb-0.5", isOwn ? "text-primary-foreground/70" : "text-primary")}>
              {message.replyTo.sender}
            </div>
            <div className={cn("text-[10px] truncate", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-2.5 py-1.5 transition-all",
            isOwn
              ? cn(
                  "bg-primary text-primary-foreground",
                  isGroupStart && isGroupEnd && "rounded-2xl",
                  isGroupStart && !isGroupEnd && "rounded-2xl rounded-br-md",
                  !isGroupStart && isGroupEnd && "rounded-2xl rounded-tr-md",
                  !isGroupStart && !isGroupEnd && "rounded-2xl rounded-tr-md rounded-br-md"
                )
              : cn(
                  "bg-muted",
                  isGroupStart && isGroupEnd && "rounded-2xl",
                  isGroupStart && !isGroupEnd && "rounded-2xl rounded-bl-md",
                  !isGroupStart && isGroupEnd && "rounded-2xl rounded-tl-md",
                  !isGroupStart && !isGroupEnd && "rounded-2xl rounded-tl-md rounded-bl-md"
                ),
            isSelected && "ring-2 ring-primary/50 scale-[1.02]"
          )}
        >
          {/* Text Message */}
          {message.content && (
            <div>
              <p className="text-xs whitespace-pre-wrap break-words">
                {message.content}
              </p>
              {message.edited && (
                <span className={cn(
                  "text-[9px] italic ml-1.5",
                  isOwn ? "text-primary-foreground/50" : "text-muted-foreground"
                )}>
                  (edited)
                </span>
              )}
            </div>
          )}

          {/* Voice Message */}
          {message.type === "voice" && (
            <div className="flex items-center gap-2.5 min-w-[220px]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "p-1.5 rounded-full transition-colors flex-shrink-0",
                  isOwn
                    ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
                    : "bg-primary/10 hover:bg-primary/20"
                )}
                aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="flex-1 flex items-center gap-0.5 h-7 relative">
                {message.waveform.map((height, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-0.5 rounded-full transition-all",
                      i < (playProgress / 100) * message.waveform.length
                        ? isOwn ? "bg-primary-foreground" : "bg-primary"
                        : isOwn ? "bg-primary-foreground/30" : "bg-primary/30"
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <span className={cn("text-[10px] flex-shrink-0", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {message.duration}
              </span>
              <div className="relative flex-shrink-0">
                <Mic className={cn("w-3.5 h-3.5", isOwn ? "text-primary-foreground/50" : "text-muted-foreground")} />
                {!message.played && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
          )}

          {/* Message State & Time (for own messages) */}
          {isOwn && isGroupEnd && (
            <div className="flex items-center justify-end gap-0.5 mt-0.5">
              <span className="text-[9px] text-primary-foreground/70">
                {message.time}
              </span>
              <MessageStateIcon state={message.state} />
            </div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className={cn("flex gap-0.5 mt-0.5", isOwn ? "flex-row-reverse" : "flex-row")}>
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReaction(message.id, emoji)}
                className="bg-muted/80 hover:bg-muted px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-0.5 transition-all hover:scale-110"
              >
                <span>{emoji}</span>
                <span className="text-[9px] font-medium">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        {showActions && (
          <div
            className={cn(
              "flex gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-all",
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

        {/* Reaction Picker */}
        {showReactionPicker === message.id && (
          <div 
            className={cn(
              "flex gap-1 mt-1.5 p-1.5 bg-card border rounded-lg shadow-lg z-10",
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
                className="text-lg hover:scale-125 transition-transform p-0.5"
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
      className="fixed bg-card border rounded-lg shadow-xl py-0.5 z-50 min-w-[160px]"
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
          <div className="h-px bg-border my-0.5" />
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
        "w-full px-3 py-1.5 text-xs flex items-center gap-2.5 hover:bg-muted transition-colors text-left",
        className
      )}
      onClick={onClick}
      role="menuitem"
    >
      <Icon className="w-3.5 h-3.5" />
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
        "p-1 rounded-md bg-muted/80 hover:bg-muted transition-all hover:scale-110 active:scale-95",
        className
      )}
      aria-label={tooltip}
    >
      <Icon className="w-3 h-3" />
    </button>
  );
}

// Message State Icon Component
function MessageStateIcon({ state }) {
  switch (state) {
    case "sending":
      return <Clock className="w-2.5 h-2.5 text-primary-foreground/50 animate-pulse" />;
    case "sent":
      return <Check className="w-2.5 h-2.5 text-primary-foreground/70" />;
    case "delivered":
      return <CheckCheck className="w-2.5 h-2.5 text-primary-foreground/70" />;
    case "seen":
      return <CheckCheck className="w-2.5 h-2.5 text-blue-400" />;
    default:
      return null;
  }
}