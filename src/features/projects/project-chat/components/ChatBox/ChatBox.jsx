import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";
import { Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import useChatStore from "../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ReplyPreview from "./ReplyPreview";
import EditBanner from "./EditBanner";
import RecordingBar from "./RecordingBar";

function ChatBox() {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [unreadNewMessages, setUnreadNewMessages] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loadError, setLoadError] = useState(null);

  const messagesByConversation = useChatStore(
    (state) => state.messagesByConversation,
  );
  const { selectedChat } = useChatStore();
  const loadMessages = useChatStore((state) => state.loadMessages);
  const markAsRead = useChatStore((state) => state.markAsRead);
  const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);

  const messagesData = useMemo(() => {
    if (!selectedChat?.id || !messagesByConversation[selectedChat.id]) {
      return { messages: [], hasMore: false };
    }
    return messagesByConversation[selectedChat.id];
  }, [selectedChat?.id, messagesByConversation]);

  const messages = messagesData.messages || [];

  // Scroll to bottom function
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    setIsUserAtBottom(true);
    setUnreadNewMessages(0);
  }, []);

  // ─────────────────────────────────────────
  // LOAD MESSAGES ON CHAT CHANGE
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!selectedChat?.id) return;

    prevMessageCountRef.current = 0;
    setLoadError(null);
    setUnreadNewMessages(0);
    setIsUserAtBottom(true);

    loadMessages(selectedChat.id).catch((error) => {
      setLoadError(error.message || "Failed to load messages");
    });

    markAsRead(selectedChat.id).catch(() => {});

    setReplyTo(null);
    setEditingMessage(null);
    setIsRecording(false);
    setRecordingTime(0);

    // Scroll to bottom on chat change (with delay to ensure render)
    setTimeout(() => scrollToBottom(false), 100);
  }, [selectedChat?.id, loadMessages, markAsRead, scrollToBottom]);

  // ─────────────────────────────────────────
  // AUTO-SCROLL ON NEW MESSAGES (WhatsApp behavior)
  // ─────────────────────────────────────────
  useLayoutEffect(() => {
    const currentCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    // Only handle if messages increased
    if (currentCount > prevCount) {
      const newMessagesCount = currentCount - prevCount;

      if (isUserAtBottom) {
        // User is at bottom - auto scroll to new messages
        setTimeout(() => scrollToBottom(true), 50);
        markAsRead(selectedChat?.id).catch(() => {});
      } else {
        // User scrolled up - show notification
        setUnreadNewMessages((prev) => prev + newMessagesCount);
      }
    }

    prevMessageCountRef.current = currentCount;
  }, [
    messages.length,
    isUserAtBottom,
    scrollToBottom,
    selectedChat?.id,
    markAsRead,
  ]);

  // ─────────────────────────────────────────
  // HANDLE SCROLL EVENTS
  // ─────────────────────────────────────────
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      setIsUserAtBottom(isNearBottom);

      // Clear unread when scrolling to bottom
      if (isNearBottom && unreadNewMessages > 0) {
        setUnreadNewMessages(0);
        markAsRead(selectedChat?.id).catch(() => {});
      }

      // Load more messages when scrolling to top
      if (scrollTop < 100 && messagesData.hasMore && !isLoadingMessages) {
        loadMessages(selectedChat.id, true);
      }
    },
    [
      messagesData.hasMore,
      isLoadingMessages,
      selectedChat?.id,
      loadMessages,
      unreadNewMessages,
      markAsRead,
    ],
  );

  // ─────────────────────────────────────────
  // HANDLE NEW MESSAGE BUTTON CLICK
  // ─────────────────────────────────────────
  const handleScrollToNewMessages = useCallback(() => {
    scrollToBottom(true);
    setUnreadNewMessages(0);
    markAsRead(selectedChat?.id).catch(() => {});
  }, [scrollToBottom, selectedChat?.id, markAsRead]);

  // ─────────────────────────────────────────
  // EMPTY CHAT STATE
  // ─────────────────────────────────────────
  if (!selectedChat) {
    return (
      <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[924px] sticky top-5 flex items-center justify-center mx-auto">
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
    <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[924px] sticky top-5 flex flex-col mx-auto">
      <ChatHeader selectedChat={selectedChat} />

      {/* MESSAGE CONTAINER */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1.5 relative"
      >
        {/* ERROR */}
        {loadError && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-md p-6 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="font-semibold">Failed to Load Messages</h3>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {!loadError && isLoadingMessages && messages.length === 0 && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="bg-muted rounded-2xl p-3 space-y-2 max-w-xs flex-1">
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MESSAGES */}
        {!loadError && messages.length > 0 && (
          <MessageList
            messages={messages}
            messagesData={messagesData}
            isLoadingMessages={isLoadingMessages}
            onReply={setReplyTo}
            onEdit={setEditingMessage}
          />
        )}

        {/* EMPTY */}
        {!loadError && !isLoadingMessages && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="text-4xl">💬</div>
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* NEW MESSAGES BUTTON (WhatsApp style) */}
      {unreadNewMessages > 0 && !isUserAtBottom && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleScrollToNewMessages}
            className="bg-primary text-primary-foreground rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 animate-in slide-in-from-bottom-4 hover:scale-105 active:scale-95"
            aria-label={`Scroll to ${unreadNewMessages} new message${unreadNewMessages > 1 ? "s" : ""}`}
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">
              {unreadNewMessages} New Message{unreadNewMessages > 1 ? "s" : ""}
            </span>
          </button>
        </div>
      )}

      {/* INPUT AREA */}
      <div className="border-t p-4 space-y-2.5 rounded-b-3xl flex-shrink-0 relative">
        {replyTo && (
          <ReplyPreview replyTo={replyTo} onClose={() => setReplyTo(null)} />
        )}

        {editingMessage && (
          <EditBanner onClose={() => setEditingMessage(null)} />
        )}

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

export default ChatBox;
