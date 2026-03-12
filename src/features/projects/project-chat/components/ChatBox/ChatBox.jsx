import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  Sparkles,
  AlertCircle,
  ChevronDown,
  X,
  Pin,
  Paperclip,
  MessageCircle,
  Phone,
  Video,
  Slash,
  SeparatorVertical,
} from "lucide-react";
import useChatStore from "../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EditBanner from "./EditBanner";
import RecordingBar from "./RecordingBar";
import ReplyToMessagePreview from "./ReplyToMessagePreview";
import ChatLoaderSkeleton from "../skeltons/ChatLoaderSkeleton";
import TypingIndicator from "./TypingIndicator";

function ChatBox() {
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const topLoaderRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [unreadNewMessages, setUnreadNewMessages] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const [recordingState, setRecordingState] = useState("idle"); // "idle" | "recording" | "preview"

  const {
    selectedChat,
    messagesByConversation,
    loadMessages,
    emitConversationRead,
    isLoadingMessages,
    typingUsers,
  } = useChatStore();

  const messagesData = useMemo(() => {
    if (!selectedChat?.id || !messagesByConversation[selectedChat.id]) {
      return { messages: [], hasMore: false };
    }
    return messagesByConversation[selectedChat.id];
  }, [selectedChat?.id, messagesByConversation]);

  const messages = messagesData.messages || [];

  const NEAR_BOTTOM_THRESHOLD = 100; // px from bottom considered "near"

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    setIsUserAtBottom(true);
    setUnreadNewMessages(0);
  }, []);

  const isUserNearBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return false;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      NEAR_BOTTOM_THRESHOLD
    );
  };

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop } = e.target;

      const container = scrollContainerRef.current;
      const nearBottom = isUserNearBottom();

      setIsUserAtBottom(nearBottom);

      if (nearBottom && unreadNewMessages > 0) {
        setUnreadNewMessages(0);
        emitConversationRead(selectedChat?.id);
      }

      // load older messages when scrollTop is near top
      if (scrollTop < 80 && messagesData.hasMore && !isLoadingMessages) {
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        // measure loader height BEFORE fetch
        const loaderHeight = topLoaderRef.current?.offsetHeight || 0;

        loadMessages(selectedChat.id, true).then(() => {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;

            container.scrollTop = prevScrollTop + heightDiff - loaderHeight;
          });
        });
      }
    },
    [
      messagesData.hasMore,
      isLoadingMessages,
      selectedChat?.id,
      loadMessages,
      unreadNewMessages,
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
    setIsUserAtBottom(true); // important
    setReplyTo(null);
    setEditingMessage(null);
    setIsRecording(false);
    setRecordingTime(0);

    loadMessages(selectedChat.id).catch((err) => {
      setLoadError(err.message || "Failed to load messages");
    });
  }, [selectedChat?.id]);

  useLayoutEffect(() => {
    if (!selectedChat?.id) return;
    if (isLoadingMessages) return;
    if (!messages.length) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [isLoadingMessages]);

  useEffect(() => {
    if (!messages.length) return;

    const last = messages[messages.length - 1];
    const id = last.clientTempId || last.id;

    if (id === lastMessageIdRef.current) return;
    lastMessageIdRef.current = id;

    if (last.isOwn || isUserNearBottom()) {
      emitConversationRead?.(selectedChat?.id);
      scrollToBottom(true);
    } else {
      setUnreadNewMessages((c) => c + 1);
    }
  }, [messages]);

  useLayoutEffect(() => {
    const typing = typingUsers[selectedChat?.id] || [];
    if (!typing.length) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (isUserNearBottom()) {
      container.scrollTop = container.scrollHeight;
    }
  }, [typingUsers, selectedChat?.id]);

  // ────────────────────────────────
  // Scroll to bottom button
  // ────────────────────────────────
  const handleScrollToNewMessages = useCallback(() => {
    scrollToBottom(true);
    setUnreadNewMessages(0);
    // User manually moved to newest messages; emit read (debounced)
    emitConversationRead(selectedChat?.id);
  }, [scrollToBottom, selectedChat?.id, emitConversationRead]);

  const scrollToMessage = (messageClientId) => {
    const element = document.getElementById(`message-${messageClientId}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const pinnedMessage = selectedChat?.pinnedMessage;
  console.log("pinned message", pinnedMessage)

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  if (!selectedChat) {
    return (
      <div className="rounded-3xl border bg-card shadow-sm h-[calc(100vh-38px)] max-h-[924px] sticky top-5 flex items-center justify-center mx-auto">
        <div className="text-center space-y-3 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary" />
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
      <ChatHeader />

      <div className="relative w-full">
        {pinnedMessage?.messageId && (
          <button
            onClick={() => scrollToMessage(pinnedMessage.messageId)}
            className="absolute top-2 left-3 z-50 w-[calc(100%-24px)] bg-card/70 group flex items-center gap-2 text-left cursor-pointer p-2 pl-3 rounded-3xl border shadow-xl transition-all hover:bg-muted/60 backdrop-blur-2xl"
          >
            {/* Pin icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mr-1">
              <Pin className="w-4 h-4" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-primary uppercase tracking-wide">
                Pinned Message
              </p>

              <p className="text-sm text-foreground truncate">
                {pinnedMessage.text}
              </p>
            </div>

            {/* Attachment indicator */}
            {pinnedMessage.attachmentCount > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-3xl bg-primary/10 text-primary text-xs font-medium">
                <Paperclip className="w-3.5 h-3.5" />
                {pinnedMessage.attachmentCount}
              </div>
            )}

            {pinnedMessage.isCallMessage && (
              <div className="flex items-center gap-1 p-2.5 rounded-3xl bg-primary/10 text-primary text-xs font-medium">
                <Phone className="w-3.5 h-3.5" />
                <SeparatorVertical className="w-3.5 h-3.5"/>
                <Video className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Unpin */}
            <span
              onClick={(e) => {
                e.stopPropagation();
                // handleUnpin()
              }}
              className="opacity-0 scale-0 max-w-0 group-hover:max-w-4 group-hover:mr-2  group-hover:scale-100 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </span>
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-1 relative"
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

        {isLoadingMessages && messagesData.hasMore && (
          <div ref={topLoaderRef}>
            <ChatLoaderSkeleton count={2} />
          </div>
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

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers[selectedChat?.id] || []} />

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
          <EditBanner
            message={editingMessage}
            onClose={() => setEditingMessage(null)}
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

        {recordingState !== "idle" && (
          <RecordingBar
            selectedChat={selectedChat}
            onClose={() => setRecordingState("idle")}
          />
        )}

        {recordingState === "idle" && (
          <MessageInput
            selectedChat={selectedChat}
            replyTo={replyTo}
            editingMessage={editingMessage}
            onClearReply={() => setReplyTo(null)}
            onClearEdit={() => setEditingMessage(null)}
            onStartRecording={() => setRecordingState("recording")}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        )}
      </div>
    </div>
  );
}

export default ChatBox;
