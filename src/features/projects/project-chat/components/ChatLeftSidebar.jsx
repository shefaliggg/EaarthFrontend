import React, { useState, useRef, useEffect } from "react";
import {
  Hash,
  Users,
  Search,
  X,
  Briefcase,
  Video,
  Zap,
  Mic,
  Shield,
  Utensils,
  Palette,
  Scissors,
  Pin,
  Check,
  Star,
  Mail,
  InfoIcon,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import useChatStore from "../store/chat.store";
import chatApi from "../api/chat.api";

// Smart time formatting
const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Icon mapping for departments
const DEPARTMENT_ICONS = {
  Production: Briefcase,
  Camera: Video,
  Stunts: Zap,
  Sound: Mic,
  Security: Shield,
  Catering: Utensils,
  VFX: Palette,
  Editing: Scissors,
};

export default function ChatLeftSidebar({
  activeTab = "all",
  onTabChange,
  selectedChat,
  onChatSelect,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // ✅ Get data from Zustand store
  const { conversations, isLoadingConversations, loadConversations } =
    useChatStore();

  // Filter conversations by search and tab
  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    if (!conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tab filter
    if (activeTab === "all") {
      return conv.type === "all" || conv.type === "group";
    } else if (activeTab === "personal") {
      return conv.type === "dm";
    }

    return true;
  });

  // Sort conversations: pinned first, then by timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.mentions > 0 && b.mentions === 0) return -1;
    if (a.mentions === 0 && b.mentions > 0) return 1;
    return b.timestamp - a.timestamp;
  });

  // Separate by type
  const departments = sortedConversations.filter(
    (c) => c.type === "all" || c.type === "group"
  );
  const teamMembers = sortedConversations.filter((c) => c.type === "dm");

  // Context menu handlers
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const togglePin = async (id, type) => {
    try {
      const conversation = conversations.find((c) => c.id === id);
      if (conversation) {
        await chatApi.pinConversation(id, !conversation.isPinned);
        // Optimistically update local state
        const updatedConversations = conversations.map((c) =>
          c.id === id ? { ...c, isPinned: !c.isPinned } : c
        );
        // Note: You might want to add a method in the store to update a single conversation
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
    setContextMenu(null);
  };

  const markAsRead = async (id, type) => {
    try {
      await chatApi.markAsRead(id);
      // The unread count will be updated when we reload conversations
      // Or you can optimistically update it here
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
    setContextMenu(null);
  };

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Drag handlers
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDragOverItem(item.id);
  };

  const handleDrop = (e, dropItem, type) => {
    e.preventDefault();
    setDraggedItem(null);
    setDragOverItem(null);
    // Note: Drag-and-drop reordering might need backend support
  };

  // Handle chat selection
  const handleChatClick = (item, itemType) => {
    console.log("🔘 ChatLeftSidebar: Chat clicked", { item, itemType });

    const chatData = {
      id: item.id,
      type: itemType,
      name: item.name,
      icon: item.icon,
      department: item.department,
      departmentName: item.departmentName,
      userId: item.userId,
      avatar: item.avatar,
      role: item.role,
      status: item.status,
      members: item.members,
      online: item.online,
      unread: item.unread,
      mentions: item.mentions,
      lastMessage: item.lastMessage,
      timestamp: item.timestamp,
      isPinned: item.isPinned,
      isMuted: item.isMuted,
      isFavorite: item.isFavorite,
      _raw: item._raw,
    };

    console.log("📤 ChatLeftSidebar: Sending chat data to parent:", chatData);
    onChatSelect?.(chatData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="font-bold mb-3">Conversations</h3>
        <div className="space-y-2">
          {/* Department Chat Tab */}
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              activeTab === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => onTabChange?.("all")}
          >
            <Hash className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-sm font-bold">Department Chat</p>
              <p className="text-xs opacity-80">All project members</p>
            </div>
          </button>

          {/* Individual Chat Tab */}
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              activeTab === "personal"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => onTabChange?.("personal")}
          >
            <Users className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">Individual Chat</p>
              <p className="text-xs opacity-80">Personal chat with members</p>
            </div>
          </button>

          {/* Email Tab (Disabled) */}
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              "cursor-not-allowed bg-muted opacity-50"
            )}
            disabled
          >
            <Mail className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">Email</p>
              <p className="text-xs opacity-80">External Contacts</p>
            </div>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex flex-col rounded-3xl border bg-card shadow-sm overflow-hidden h-[calc(100vh-38px)] max-h-[818px] sticky top-5">
        {/* Header */}
        <div className="border-b bg-card px-4 py-2.5 pt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">
              {activeTab === "all"
                ? "All Departments"
                : activeTab === "personal"
                ? "Direct Messages"
                : "Email"}
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="pl-9 pr-3 h-9 bg-muted/50 border-0 rounded-lg text-xs placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted/80"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {isLoadingConversations ? (
            <div className="p-2 space-y-1">
              {[...Array(8)].map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
          ) : (
            <div className="p-1 px-2 space-y-0.5">
              {/* Show Department Chats */}
              {activeTab === "all" && (
                <>
                  {departments.map((dept) => {
                    // Assign icon based on department name
                    const Icon =
                      DEPARTMENT_ICONS[dept.departmentName] || Briefcase;

                    return (
                      <ChatItem
                        key={dept.id}
                        item={{ ...dept, icon: Icon }}
                        type={dept.type}
                        isSelected={selectedChat?.id === dept.id}
                        onClick={() => handleChatClick(dept, dept.type)}
                        onContextMenu={(e) =>
                          handleContextMenu(e, dept, "team")
                        }
                        isDragging={draggedItem?.item.id === dept.id}
                        isDragOver={dragOverItem === dept.id}
                        onDragStart={(e) => handleDragStart(e, dept, "team")}
                        onDragOver={(e) => handleDragOver(e, dept)}
                        onDrop={(e) => handleDrop(e, dept, "team")}
                      />
                    );
                  })}

                  {departments.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">
                        No departments found
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Show Individual Chats */}
              {activeTab === "personal" && (
                <>
                  {teamMembers.map((member) => (
                    <ChatItem
                      key={member.id}
                      item={member}
                      type="dm"
                      isSelected={selectedChat?.id === member.id}
                      onClick={() => handleChatClick(member, "dm")}
                      onContextMenu={(e) =>
                        handleContextMenu(e, member, "personal")
                      }
                      isDragging={draggedItem?.item.id === member.id}
                      isDragOver={dragOverItem === member.id}
                      onDragStart={(e) => handleDragStart(e, member, "personal")}
                      onDragOver={(e) => handleDragOver(e, member)}
                      onDrop={(e) => handleDrop(e, member, "personal")}
                    />
                  ))}

                  {teamMembers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">
                        No members found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenuComponent
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          type={contextMenu.type}
          onPin={() => togglePin(contextMenu.item.id, contextMenu.type)}
          onMarkAsRead={() => markAsRead(contextMenu.item.id, contextMenu.type)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

// Chat Item Component
function ChatItem({
  item,
  type,
  isSelected,
  onClick,
  onContextMenu,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const Icon = item.icon;
  const isGroup = type === "group" || type === "all";

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={() => {}}
      className={cn(
        "w-full px-3 py-2.5 text-left transition-all hover:bg-muted/50 relative rounded-md border border-transparent hover:border-border/50",
        isSelected && "bg-muted ring-2 ring-primary/20",
        isDragging && "opacity-50",
        isDragOver && "bg-primary/10"
      )}
    >
      <div className="flex items-center gap-2.5">
        {/* Icon/Avatar */}
        {isGroup ? (
          <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xs font-bold">
              {item.avatar}
            </div>
            <span
              className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
                item.status === "online" && "bg-green-500",
                item.status === "away" && "bg-yellow-500",
                item.status === "offline" && "bg-gray-400"
              )}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              {item.isFavorite && (
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatTime(item.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {item.isMuted && (
                <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
              <p className="text-xs text-muted-foreground truncate">
                {!isGroup && item.unread > 0 && (
                  <span className="text-foreground font-medium">
                    {item.lastMessage.substring(0, 20)}
                    {item.lastMessage.length > 20 && "..."}
                  </span>
                )}
                {!isGroup && item.unread === 0 && item.lastMessage}
                {isGroup && item.lastMessage}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.isPinned && (
                <Pin className="w-3 h-3 text-muted-foreground" />
              )}
              {item.mentions > 0 && (
                <Badge className="bg-purple-500 text-white text-[10px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
                  <span className="text-xs mb-0.5">@</span>
                  {item.mentions}
                </Badge>
              )}
              {item.unread > 0 && !item.isMuted && item.mentions === 0 && (
                <Badge className="bg-purple-500 text-white text-[10px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
                  {item.unread}
                </Badge>
              )}
              {item.unread > 0 && item.isMuted && (
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// Skeleton Loading Component
function SkeletonItem() {
  return (
    <div className="px-3 py-2.5 animate-pulse border-b border-border/50">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-muted rounded w-32" />
            <div className="h-2.5 bg-muted rounded w-12" />
          </div>
          <div className="h-3 bg-muted rounded w-full" />
        </div>
      </div>
    </div>
  );
}

// Context Menu Component
function ContextMenuComponent({
  x,
  y,
  item,
  type,
  onPin,
  onMarkAsRead,
  onClose,
}) {
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
      className="fixed bg-card border rounded-lg shadow-xl py-1.5 z-50 min-w-[200px]"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        icon={item.isPinned ? X : Pin}
        label={item.isPinned ? "Unpin chat" : "Pin chat"}
        onClick={onPin}
      />
      {(item.unread > 0 || item.mentions > 0) && (
        <MenuItem icon={Check} label="Mark as read" onClick={onMarkAsRead} />
      )}
      {type === "team" && (
        <MenuItem icon={InfoIcon} label="Group info" onClick={onClose} />
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, className }) {
  return (
    <button
      className={cn(
        "w-full px-3 py-1.5 text-xs flex items-center gap-2.5 hover:bg-muted transition-colors text-left",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}