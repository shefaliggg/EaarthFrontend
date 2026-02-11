// src/features/chat/components/ChatBox/ChatBox.jsx
// ✅ Main ChatBox container - coordinates all sub-components (SPLIT VERSION)

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import useChatStore from "../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ReplyPreview from "./ReplyPreview";
import EditBanner from "./EditBanner";
import RecordingBar from "./RecordingBar";

export default function ChatBox({ selectedChat }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const {
    messagesByConversation,
    loadMessages,
    markAsRead,
    isLoadingMessages,
  } = useChatStore();

  // Get messages for this conversation
  const messagesData = selectedChat?.id && messagesByConversation[selectedChat.id]
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

  // Handle scroll events
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
    [messagesData.hasMore, isLoadingMessages, selectedChat, loadMessages]
  );

  // Load messages when chat changes
  useEffect(() => {
    if (selectedChat?.id) {
      console.log("📥 ChatBox: Loading messages for:", selectedChat.id);
      loadMessages(selectedChat.id);
      markAsRead(selectedChat.id);

      // Reset UI state
      setReplyTo(null);
      setEditingMessage(null);
      setIsRecording(false);
      setRecordingTime(0);

      // Scroll to bottom after messages load
      setTimeout(() => {
        scrollToBottom(false);
        setIsUserAtBottom(true);
      }, 150);
    }
  }, [selectedChat?.id, loadMessages, markAsRead, scrollToBottom]);

  // Empty state - EXACT same design
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
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[900px] sticky top-5 flex flex-col mx-auto">
      {/* Header */}
      <ChatHeader selectedChat={selectedChat} />

      {/* Messages Container */}
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

        <MessageList
          selectedChat={selectedChat}
          messages={messages}
          messagesData={messagesData}
          isLoadingMessages={isLoadingMessages}
          messagesEndRef={messagesEndRef}
          onReply={setReplyTo}
          onEdit={setEditingMessage}
        />

        {/* Typing Indicator */}
        <TypingIndicator conversationId={selectedChat.id} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 space-y-2.5 rounded-b-3xl backdrop-blur-sm flex-shrink-0 relative">
        {/* Reply Preview */}
        {replyTo && <ReplyPreview replyTo={replyTo} onClose={() => setReplyTo(null)} />}

        {/* Edit Banner */}
        {editingMessage && (
          <EditBanner
            onClose={() => {
              setEditingMessage(null);
            }}
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
              setIsRecording(false);
              setRecordingTime(0);
            }}
          />
        )}

        {/* Message Input */}
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
}