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
  BellOff,
  Bell,
  ChevronRight,
  MoreVertical,
  Archive,
  Trash2,
  LogOut,
  Volume2,
  VolumeX,
  UserX,
  Check,
  Loader2,
  Star,
  Mail,
  AtSign,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Last seen formatter
const formatLastSeen = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Active now";
  if (minutes < 60) return `Last seen ${minutes}m ago`;
  if (hours < 24) return `Last seen ${hours}h ago`;
  return `Last seen ${Math.floor(hours / 24)}d ago`;
};

export default function ChatLeftSidebar({
  activeTab = "all",
  onTabChange,
  selectedChat,
  onChatSelect
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Team Chat - Departments/Groups with pinning and muting
  const [departments, setDepartments] = useState([
    {
      id: "production",
      name: "Production",
      icon: Briefcase,
      members: 15,
      online: 8,
      unread: 3,
      mentions: 1,
      lastMessage: "Budget review meeting at 3 PM",
      timestamp: Date.now() - 1800000, // 30m ago
      isPinned: true,
      isMuted: false,
      isFavorite: true,
      // Backend data
      conversationType: "DEPARTMENT",
      department: "Production",
    },
    {
      id: "camera",
      name: "Camera Department",
      icon: Video,
      members: 8,
      online: 5,
      unread: 0,
      mentions: 0,
      lastMessage: "New equipment arrived",
      timestamp: Date.now() - 86400000, // Yesterday
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "Camera Department",
    },
    {
      id: "stunts",
      name: "Stunt Team",
      icon: Zap,
      members: 12,
      online: 7,
      unread: 5,
      mentions: 2,
      lastMessage: "Safety briefing tomorrow",
      timestamp: Date.now() - 5400000, // 1.5h ago
      isPinned: true,
      isMuted: false,
      isFavorite: true,
      conversationType: "DEPARTMENT",
      department: "Stunt Team",
    },
    {
      id: "sound",
      name: "Sound Department",
      icon: Mic,
      members: 6,
      online: 4,
      unread: 1,
      mentions: 0,
      lastMessage: "Audio levels look good",
      timestamp: Date.now() - 7200000, // 2h ago
      isPinned: false,
      isMuted: true,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "Sound Department",
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      members: 10,
      online: 6,
      unread: 0,
      mentions: 0,
      lastMessage: "Perimeter check complete",
      timestamp: Date.now() - 172800000, // 2 days ago
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "Security",
    },
    {
      id: "catering",
      name: "Catering",
      icon: Utensils,
      members: 7,
      online: 3,
      unread: 2,
      mentions: 0,
      lastMessage: "Lunch menu updated",
      timestamp: Date.now() - 3600000, // 1h ago
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "Catering",
    },
    {
      id: "vfx",
      name: "VFX & Post-Production",
      icon: Palette,
      members: 9,
      online: 6,
      unread: 0,
      mentions: 0,
      lastMessage: "Renders completed",
      timestamp: Date.now() - 86400000, // Yesterday
      isPinned: false,
      isMuted: true,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "VFX & Post-Production",
    },
    {
      id: "editing",
      name: "Editing",
      icon: Scissors,
      members: 5,
      online: 3,
      unread: 1,
      mentions: 0,
      lastMessage: "Final cut review needed",
      timestamp: Date.now() - 259200000, // 3 days ago
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DEPARTMENT",
      department: "Editing",
    },
  ]);

  // Personal Chat - Individual Members with presence
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "marcus",
      name: "Marcus Johnson",
      role: "Director",
      avatar: "MJ",
      status: "online",
      device: "desktop",
      lastSeen: Date.now(),
      lastMessage: "Can we discuss the script changes?",
      timestamp: Date.now() - 300000, // 5m ago
      unread: 2,
      isPinned: true,
      isMuted: false,
      isFavorite: true,
      // Backend data
      conversationType: "DIRECT",
      userId: "marcus",
    },
    {
      id: "sarah",
      name: "Sarah Lee",
      role: "Producer",
      avatar: "SL",
      status: "online",
      device: "mobile",
      lastSeen: Date.now(),
      lastMessage: "Budget approved!",
      timestamp: Date.now() - 900000, // 15m ago
      unread: 0,
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DIRECT",
      userId: "sarah",
    },
    {
      id: "daniel",
      name: "Daniel Cruz",
      role: "Cinematographer",
      avatar: "DC",
      status: "away",
      device: "desktop",
      lastSeen: Date.now() - 600000, // 10m ago
      lastMessage: "Checking the lighting setup",
      timestamp: Date.now() - 3600000, // 1h ago
      unread: 0,
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DIRECT",
      userId: "daniel",
    },
    {
      id: "emma",
      name: "Emma Wilson",
      role: "Lead Editor",
      avatar: "EW",
      status: "online",
      device: "desktop",
      lastSeen: Date.now(),
      lastMessage: "Rough cut is ready",
      timestamp: Date.now() - 7200000, // 2h ago
      unread: 1,
      isPinned: true,
      isMuted: false,
      isFavorite: true,
      conversationType: "DIRECT",
      userId: "emma",
    },
    {
      id: "james",
      name: "James Rodriguez",
      role: "Sound Designer",
      avatar: "JR",
      status: "offline",
      device: null,
      lastSeen: Date.now() - 86400000, // Yesterday
      lastMessage: "Will send the mix tomorrow",
      timestamp: Date.now() - 86400000,
      unread: 0,
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DIRECT",
      userId: "james",
    },
    {
      id: "lisa",
      name: "Lisa Chen",
      role: "VFX Supervisor",
      avatar: "LC",
      status: "online",
      device: "desktop",
      lastSeen: Date.now(),
      lastMessage: "Preview renders attached",
      timestamp: Date.now() - 10800000, // 3h ago
      unread: 0,
      isPinned: false,
      isMuted: false,
      isFavorite: false,
      conversationType: "DIRECT",
      userId: "lisa",
    },
    {
      id: "ryan",
      name: "Ryan Taylor",
      role: "Stunt Coordinator",
      avatar: "RT",
      status: "away",
      device: "mobile",
      lastSeen: Date.now() - 1800000, // 30m ago
      lastMessage: "Safety meeting rescheduled",
      timestamp: Date.now() - 86400000,
      unread: 3,
      isPinned: false,
      isMuted: true,
      isFavorite: false,
      conversationType: "DIRECT",
      userId: "ryan",
    },
  ]);

  // Filter logic
  const filterItems = (items) => {
    let filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (activeTab) {
      case "unread":
        filtered = filtered.filter(item => item.unread > 0 || item.mentions > 0);
        break;
      case "favorites":
        filtered = filtered.filter(item => item.isFavorite);
        break;
      case "groups":
        // Only applicable for team tab
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.mentions > 0 && b.mentions === 0) return -1;
      if (a.mentions === 0 && b.mentions > 0) return 1;
      return b.timestamp - a.timestamp;
    });
  };

  const filteredDepartments = filterItems(departments);
  const filteredMembers = filterItems(teamMembers);

  const activeOnlineCount = teamMembers.filter(m => m.status === "online").length;
  const totalMembers = teamMembers.length;
  const totalUnread = activeTab === "all"
    ? departments.reduce((sum, d) => sum + d.unread, 0)
    : teamMembers.reduce((sum, m) => sum + m.unread, 0);

  // Context menu handlers
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const togglePin = (id, type) => {
    if (type === "team") {
      setDepartments(deps => deps.map(d =>
        d.id === id ? { ...d, isPinned: !d.isPinned } : d
      ));
    } else {
      setTeamMembers(members => members.map(m =>
        m.id === id ? { ...m, isPinned: !m.isPinned } : m
      ));
    }
    setContextMenu(null);
  };

  const toggleMute = (id, type) => {
    if (type === "team") {
      setDepartments(deps => deps.map(d =>
        d.id === id ? { ...d, isMuted: !d.isMuted } : d
      ));
    } else {
      setTeamMembers(members => members.map(m =>
        m.id === id ? { ...m, isMuted: !m.isMuted } : m
      ));
    }
    setContextMenu(null);
  };

  const toggleFavorite = (id, type) => {
    if (type === "team") {
      setDepartments(deps => deps.map(d =>
        d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
      ));
    } else {
      setTeamMembers(members => members.map(m =>
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      ));
    }
    setContextMenu(null);
  };

  const markAsRead = (id, type) => {
    if (type === "team") {
      setDepartments(deps => deps.map(d =>
        d.id === id ? { ...d, unread: 0, mentions: 0 } : d
      ));
    } else {
      setTeamMembers(members => members.map(m =>
        m.id === id ? { ...m, unread: 0 } : m
      ));
    }
    setContextMenu(null);
  };

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Drag handlers
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDragOverItem(item.id);
  };

  const handleDrop = (e, dropItem, type) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type) return;

    const updateOrder = (items) => {
      const dragIdx = items.findIndex(i => i.id === draggedItem.item.id);
      const dropIdx = items.findIndex(i => i.id === dropItem.id);
      const newItems = [...items];
      const [removed] = newItems.splice(dragIdx, 1);
      newItems.splice(dropIdx, 0, removed);
      return newItems;
    };

    if (type === "team") {
      setDepartments(updateOrder(departments));
    } else {
      setTeamMembers(updateOrder(teamMembers));
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 🔥 Handle chat selection with proper type mapping
  const handleChatClick = (item, itemType) => {
    console.log("🔘 ChatLeftSidebar: Chat clicked", { item, itemType });
    
    // Map to frontend types
    const chatData = {
      id: item.id,
      type: itemType, // "group" or "dm" or "all"
      name: item.name,
      icon: item.icon,
      department: item.department,
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
    };

    console.log("📤 ChatLeftSidebar: Sending chat data to parent:", chatData);
    onChatSelect?.(chatData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="font-bold mb-3">Conversations</h3>
        <div className="space-y-2">
          {/* Team Chat */}
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
              <p className="text-xs opacity-80">personal chat with members</p>
            </div>
          </button>
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              "cursor-not-allowed bg-muted opacity-50"
            )}
          >
            <Mail className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">Email</p>
              <p className="text-xs opacity-80">External Contacts</p>
            </div>
          </button>
        </div>
      </div>

      {/* Single Card Container */}
      <div className="flex-1 flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden min-h-[calc(100vh-38px)] h-[calc(100vh-38px)] max-h-[calc(100vh-38px)] sticky top-5">
        {/* Header with Tabs */}
        <div className="border-b bg-card px-4 py-2.5 pt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">
              {activeTab === "all" ? "All Departments" : activeTab === "personal" ? "Direct Messages" : "Email"}
            </h2>
            <div className="flex items-center gap-2">
            </div>
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
          {isLoading ? (
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
                  {/* All Departments */}
                  <ChatItem
                    item={{
                      id: "all-departments",
                      name: "All Departments",
                      icon: Hash,
                      members: departments.reduce((sum, d) => sum + d.members, 0),
                      online: departments.reduce((sum, d) => sum + d.online, 0),
                      unread: 0,
                      mentions: 0,
                      lastMessage: "Company-wide announcements",
                      timestamp: Date.now(),
                      isPinned: true,
                      isMuted: false,
                      isFavorite: false,
                    }}
                    type="group"
                    isSelected={selectedChat?.id === "all-departments"}
                    onClick={() => handleChatClick({
                      id: "all-departments",
                      name: "All Departments",
                      icon: Hash,
                      members: departments.reduce((sum, d) => sum + d.members, 0),
                      online: departments.reduce((sum, d) => sum + d.online, 0),
                      unread: 0,
                      mentions: 0,
                      lastMessage: "Company-wide announcements",
                      timestamp: Date.now(),
                      isPinned: true,
                      isMuted: false,
                      isFavorite: false,
                    }, "all")}
                    onContextMenu={(e) => handleContextMenu(e, { id: "all-departments" }, "team")}
                  />

                  {/* Individual Departments */}
                  {filteredDepartments.map((dept) => (
                    <ChatItem
                      key={dept.id}
                      item={dept}
                      type="group"
                      isSelected={selectedChat?.id === dept.id}
                      onClick={() => handleChatClick(dept, "group")}
                      onContextMenu={(e) => handleContextMenu(e, dept, "team")}
                      isDragging={draggedItem?.item.id === dept.id}
                      isDragOver={dragOverItem === dept.id}
                      onDragStart={(e) => handleDragStart(e, dept, "team")}
                      onDragOver={(e) => handleDragOver(e, dept)}
                      onDrop={(e) => handleDrop(e, dept, "team")}
                    />
                  ))}

                  {filteredDepartments.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">No departments found</p>
                    </div>
                  )}
                </>
              )}

              {/* Show Individual Chats */}
              {activeTab === "personal" && (
                <>
                  {filteredMembers.map((member) => (
                    <ChatItem
                      key={member.id}
                      item={member}
                      type="dm"
                      isSelected={selectedChat?.id === member.id}
                      onClick={() => handleChatClick(member, "dm")}
                      onContextMenu={(e) => handleContextMenu(e, member, "personal")}
                      isDragging={draggedItem?.item.id === member.id}
                      isDragOver={dragOverItem === member.id}
                      onDragStart={(e) => handleDragStart(e, member, "personal")}
                      onDragOver={(e) => handleDragOver(e, member)}
                      onDrop={(e) => handleDrop(e, member, "personal")}
                    />
                  ))}

                  {filteredMembers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">No members found</p>
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
          onMute={() => toggleMute(contextMenu.item.id, contextMenu.type)}
          onFavorite={() => toggleFavorite(contextMenu.item.id, contextMenu.type)}
          onMarkAsRead={() => markAsRead(contextMenu.item.id, contextMenu.type)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

// Filter Tab Component
function FilterTab({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap flex-shrink-0",
        active
          ? "bg-primary text-primary-foreground shadow"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {label}
    </button>
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
      onDragEnd={() => { }}
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
              {item.isFavorite && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatTime(item.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {item.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
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
              {item.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
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
function ContextMenuComponent({ x, y, item, type, onPin, onMute, onFavorite, onMarkAsRead, onClose }) {
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
      <MenuItem
        icon={item.isMuted ? Bell : BellOff}
        label={item.isMuted ? "Unmute notifications" : "Mute notifications"}
        onClick={onMute}
      />
      <MenuItem
        icon={item.isFavorite ? Star : Star}
        label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={onFavorite}
      />
      {(item.unread > 0 || item.mentions > 0) && (
        <MenuItem
          icon={Check}
          label="Mark as read"
          onClick={onMarkAsRead}
        />
      )}
      <div className="h-px bg-border my-1" />
      <MenuItem icon={Archive} label="Archive chat" onClick={onClose} />
      {type === "personal" && (
        <MenuItem
          icon={UserX}
          label="Block user"
          onClick={onClose}
          className="text-red-500 hover:bg-red-500/10"
        />
      )}
      {type === "team" && (
        <>
          <MenuItem icon={Volume2} label="Group info" onClick={onClose} />
          <MenuItem
            icon={LogOut}
            label="Exit group"
            onClick={onClose}
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