import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import useChatStore from "../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ReplyPreview from "./ReplyPreviewContent";
import EditBanner from "./EditBanner";
import RecordingBar from "./RecordingBar";
import ReplyToMessagePreview from "./ReplyToMessagePreview";
import ChatLoaderSkeleton from "../skeltons/ChatLoaderSkeleton";

function ChatBox() {
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [unreadNewMessages, setUnreadNewMessages] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const {
    selectedChat,
    messagesByConversation,
    loadMessages,
    markAsRead,
    emitConversationRead,
    isLoadingMessages,
  } = useChatStore();

  const messagesData = useMemo(() => {
    if (!selectedChat?.id || !messagesByConversation[selectedChat.id]) {
      return { messages: [], hasMore: false };
    }
    return messagesByConversation[selectedChat.id];
  }, [selectedChat?.id, messagesByConversation]);

  const messages = messagesData.messages || [];

  const NEAR_BOTTOM_THRESHOLD = 0; // px from bottom considered "near"

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }
    setIsUserAtBottom(true);
    setUnreadNewMessages(0);
  }, []);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop } = e.target;

      const container = scrollContainerRef.current;
      const nearBottom =
        container.scrollHeight - container.clientHeight - scrollTop <
        NEAR_BOTTOM_THRESHOLD;

      setIsUserAtBottom(nearBottom);

      if (nearBottom && unreadNewMessages > 0) {
        setUnreadNewMessages(0);
        try {
          emitConversationRead && emitConversationRead(selectedChat?.id);
        } catch (e) {
          markAsRead(selectedChat?.id).catch(() => {});
        }
      }

      // load older messages when scrollTop is near top
      if (scrollTop < 100 && messagesData.hasMore && !isLoadingMessages) {
        const prevScrollHeight = container.scrollHeight;

        loadMessages(selectedChat.id, true).then(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight + scrollTop;
        });
      }
    },
    [
      messagesData.hasMore,
      isLoadingMessages,
      selectedChat?.id,
      loadMessages,
      unreadNewMessages,
      markAsRead,
      emitConversationRead,
    ],
  );

  // ────────────────────────────────
  // Initial load / chat change
  // ────────────────────────────────
  useEffect(() => {
    if (!selectedChat?.id) return;

    setLoadError(null);
    setUnreadNewMessages(0);
    setIsUserAtBottom(false);
    prevMessageCountRef.current = 0;
    setReplyTo(null);
    setEditingMessage(null);
    setIsRecording(false);
    setRecordingTime(0);

    const conv = messagesByConversation[selectedChat.id];

    if (conv && conv.messages && conv.messages.length > 0) {
      const lastCachedId =
        conv.messages[conv.messages.length - 1].clientTempId ||
        conv.messages[conv.messages.length - 1].id;
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const el = document.getElementById(`message-${lastCachedId}`);
        if (container && el) {
          const targetTop = Math.max(
            0,
            el.offsetTop - container.clientHeight + el.clientHeight,
          );
          container.scrollTo({ top: targetTop, behavior: "auto" });
          setIsUserAtBottom(false);
        }
      }, 20);
    }

    (async () => {
      try {
        await loadMessages(selectedChat.id);
      } catch (err) {
        setLoadError(err.message || "Failed to load messages");
      }

      if (!conv || !conv.messages || conv.messages.length === 0) {
        setTimeout(() => scrollToBottom(false), 100);
      }
    })();
  }, [selectedChat?.id]);

  useEffect(() => {
    if (!selectedChat?.id) return;
    if (messages.length <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      return;
    }

    const newMessages = messages.slice(prevMessageCountRef.current);
    const lastMessage = messages[messages.length - 1];

    // Always scroll when the current user sends a message (optimistic state)
    if (lastMessage?.isOwn && lastMessage?.state === "sending") {
      scrollToBottom(true);
      try {
        emitConversationRead && emitConversationRead(selectedChat?.id);
      } catch (e) {
        markAsRead(selectedChat?.id).catch(() => {});
      }
      prevMessageCountRef.current = messages.length;
      return;
    }

    // For incoming messages from others
    const newOtherMessageCount = newMessages.filter(
      (m) => !m.isOwn && m.state !== "sending",
    ).length;

    if (newOtherMessageCount > 0) {
      if (isUserAtBottom) {
        scrollToBottom(true);
        try {
          emitConversationRead && emitConversationRead(selectedChat?.id);
        } catch (e) {
          markAsRead(selectedChat?.id).catch(() => {});
        }
      } else {
      }
    }

    prevMessageCountRef.current = messages.length;
  }, [messages, isUserAtBottom, selectedChat?.id]);

  // ────────────────────────────────
  // Scroll to bottom button
  // ────────────────────────────────
  const handleScrollToNewMessages = useCallback(() => {
    scrollToBottom(true);
    setUnreadNewMessages(0);
    // User manually moved to newest messages; emit read (debounced)
    try {
      emitConversationRead(selectedChat?.id);
    } catch (e) {
      markAsRead(selectedChat?.id).catch(() => {});
    }
  }, [scrollToBottom, selectedChat?.id, emitConversationRead, markAsRead]);

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
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

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 relative flex flex-col"
      >
        {loadError && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-md p-6 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="font-semibold">Failed to Load Messages</h3>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
          </div>
        )}

        {!loadError && isLoadingMessages && messages.length === 0 && (
          <ChatLoaderSkeleton count={6} />
        )}

        {messages.length > 0 && (
          <MessageList
            messages={messages}
            messagesData={messagesData}
            isLoadingMessages={isLoadingMessages}
            onReply={setReplyTo}
            onEdit={setEditingMessage}
          />
        )}

        {!isLoadingMessages && messages.length === 0 && (
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

      {unreadNewMessages > 0 && !isUserAtBottom && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleScrollToNewMessages}
            className="bg-primary text-primary-foreground rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 animate-in slide-in-from-bottom-4 hover:scale-105 active:scale-95"
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">
              {unreadNewMessages} New Message{unreadNewMessages > 1 ? "s" : ""}
            </span>
          </button>
        </div>
      )}

      <div className="border-t p-4 space-y-2.5 rounded-b-3xl flex-shrink-0 relative">
        {replyTo && (
          <ReplyToMessagePreview
            replyTo={replyTo}
            onClose={() => setReplyTo(null)}
          />
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
        {attachments.length > 0 && (
          <div className="flex gap-2 p-2 overflow-x-auto">
            {attachments.map((att, index) => (
              <div key={index} className="relative w-20 h-20">
                {att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs rounded-lg">
                    {att.file.name}
                  </div>
                )}
                <button
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute -top-1 -right-1 bg-black/60 text-white text-xs px-1 rounded-3xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {!isRecording && (
          <MessageInput
            selectedChat={selectedChat}
            replyTo={replyTo}
            editingMessage={editingMessage}
            onClearReply={() => setReplyTo(null)}
            onClearEdit={() => setEditingMessage(null)}
            onStartRecording={() => setIsRecording(true)}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        )}
      </div>
    </div>
  );
}

export default ChatBox;
