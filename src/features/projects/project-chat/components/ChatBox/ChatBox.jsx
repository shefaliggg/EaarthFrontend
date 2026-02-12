// src/features/chat/components/ChatBox/ChatBox.jsx
// ✅ PRODUCTION: Fixed infinite render issue

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Sparkles, ChevronDown, AlertCircle } from "lucide-react";
import useChatStore from "../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ReplyPreview from "./ReplyPreview";
import EditBanner from "./EditBanner";
import RecordingBar from "./RecordingBar";

// ✅ Use React.memo to prevent unnecessary re-renders
const ChatBox = React.memo(({ selectedChat }) => {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loadError, setLoadError] = useState(null);

  // ✅ Use selector to prevent re-renders
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);
  const loadMessages = useChatStore((state) => state.loadMessages);
  const markAsRead = useChatStore((state) => state.markAsRead);
  const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);

  // ✅ Memoize messages data to prevent re-computation
  const messagesData = useMemo(() => {
    if (!selectedChat?.id || !messagesByConversation[selectedChat.id]) {
      return { messages: [], hasMore: false, cursor: null };
    }
    return messagesByConversation[selectedChat.id];
  }, [selectedChat?.id, messagesByConversation]);

  const messages = messagesData.messages || [];

  // ═══════════════════════════════════════
  // SCROLL MANAGEMENT
  // ═══════════════════════════════════════
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    setIsUserAtBottom(true);
    setNewMessagesCount(0);
  }, []);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      setIsUserAtBottom(isNearBottom);

      if (isNearBottom) {
        setNewMessagesCount(0);
      }

      // Load more messages on scroll to top
      if (scrollTop < 100 && messagesData.hasMore && !isLoadingMessages) {
        loadMessages(selectedChat.id, true);
      }
    },
    [messagesData.hasMore, isLoadingMessages, selectedChat?.id, loadMessages]
  );

  // ═══════════════════════════════════════
  // LOAD MESSAGES ON CHAT CHANGE (ONLY ONCE)
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!selectedChat?.id) return;

    console.log("📥 ChatBox: Loading messages for:", selectedChat.id);
    
    setLoadError(null);
    
    loadMessages(selectedChat.id).catch((error) => {
      console.error("❌ Failed to load messages:", error);
      setLoadError(error.message || "Failed to load messages");
    });
    
    markAsRead(selectedChat.id).catch((error) => {
      console.error("⚠️ Failed to mark as read:", error);
    });

    // Reset UI state
    setReplyTo(null);
    setEditingMessage(null);
    setIsRecording(false);
    setRecordingTime(0);

    // Scroll to bottom after messages load
    const scrollTimer = setTimeout(() => {
      scrollToBottom(false);
      setIsUserAtBottom(true);
    }, 150);

    return () => clearTimeout(scrollTimer);
  }, [selectedChat?.id]); // ✅ ONLY depend on chat ID

  // ═══════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════
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
            Choose a department group or individual member from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[900px] sticky top-5 flex flex-col mx-auto">
      {/* ═══════════════════════════════════════
          HEADER
          ═══════════════════════════════════════ */}
      <ChatHeader selectedChat={selectedChat} />

      {/* ═══════════════════════════════════════
          MESSAGES CONTAINER
          ═══════════════════════════════════════ */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1.5 relative"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {/* Scroll to bottom button */}
        {showScrollButton && !newMessagesCount && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 p-2 rounded-full bg-primary/50 backdrop-blur-sm text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}

        {/* New messages indicator */}
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

        {/* Error State */}
        {loadError && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-md p-6 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="font-semibold">Failed to Load Messages</h3>
              <p className="text-sm text-muted-foreground">{loadError}</p>
              <button
                onClick={() => {
                  setLoadError(null);
                  loadMessages(selectedChat.id);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State (initial load) */}
        {!loadError && isLoadingMessages && messages.length === 0 && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                <div className="bg-muted rounded-2xl p-3 space-y-2 max-w-xs flex-1">
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages List */}
        {!loadError && messages.length > 0 && (
          <MessageList
            selectedChat={selectedChat}
            messages={messages}
            messagesData={messagesData}
            isLoadingMessages={isLoadingMessages}
            messagesEndRef={messagesEndRef}
            onReply={setReplyTo}
            onEdit={setEditingMessage}
          />
        )}

        {/* Empty State */}
        {!loadError && !isLoadingMessages && messages.length === 0 && (
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

        {/* Typing Indicator */}
        <TypingIndicator conversationId={selectedChat?.id} />
      </div>

      {/* ═══════════════════════════════════════
          INPUT AREA
          ═══════════════════════════════════════ */}
      <div className="border-t p-4 space-y-2.5 rounded-b-3xl backdrop-blur-sm flex-shrink-0 relative">
        {/* Reply Preview */}
        {replyTo && (
          <ReplyPreview 
            replyTo={replyTo} 
            onClose={() => setReplyTo(null)} 
          />
        )}

        {/* Edit Banner */}
        {editingMessage && (
          <EditBanner 
            onClose={() => setEditingMessage(null)} 
          />
        )}

        {/* Recording Bar */}
        {isRecording && (
          <RecordingBar
            recordingTime={recordingTime}
            onCancel={() => {
              setIsRecording(false);
              setRecordingTime(0);
            }}
            onSend={() => {
              console.log("Send voice message");
              setIsRecording(false);
              setRecordingTime(0);
            }}
          />
        )}

        {/* Message Input - ONLY RENDER IF NOT RECORDING */}
        {!isRecording && (
          <MessageInput
            selectedChat={selectedChat}
            replyTo={replyTo}
            editingMessage={editingMessage}
            onClearReply={() => setReplyTo(null)}
            onClearEdit={() => setEditingMessage(null)}
            onStartRecording={() => setIsRecording(true)}
            isUserAtBottom={isUserAtBottom}
            scrollToBottom={scrollToBottom}
          />
        )}
      </div>
    </div>
  );
});

ChatBox.displayName = 'ChatBox';

export default ChatBox;