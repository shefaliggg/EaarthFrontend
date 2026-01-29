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
  activeTab = "team", 
  onTabChange,
  selectedChat,
  onChatSelect 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    },
  ]);

  // Filter and sort logic
  const filteredDepartments = departments
    .filter(dept => dept.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by unread with mentions
      if (a.mentions > 0 && b.mentions === 0) return -1;
      if (a.mentions === 0 && b.mentions > 0) return 1;
      // Then by timestamp
      return b.timestamp - a.timestamp;
    });

  const filteredMembers = teamMembers
    .filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by unread
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;
      // Then by online status
      if (a.status === "online" && b.status !== "online") return -1;
      if (a.status !== "online" && b.status === "online") return 1;
      // Then by timestamp
      return b.timestamp - a.timestamp;
    });

  const pinnedDepartments = filteredDepartments.filter(d => d.isPinned);
  const unpinnedDepartments = filteredDepartments.filter(d => !d.isPinned);
  const pinnedMembers = filteredMembers.filter(m => m.isPinned);
  const unpinnedMembers = filteredMembers.filter(m => !m.isPinned);

  const activeOnlineCount = teamMembers.filter(m => m.status === "online").length;
  const totalMembers = teamMembers.length;

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

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-3">
      {/* Compact Tab Switcher */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="grid grid-cols-2 gap-1.5 p-1.5">
          <button
            onClick={() => {
              onTabChange?.("team");
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
            className={cn(
              "px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
              activeTab === "team"
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Hash className="w-3.5 h-3.5" />
            Team
          </button>
          <button
            onClick={() => {
              onTabChange?.("personal");
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
            className={cn(
              "px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
              activeTab === "personal"
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Personal
          </button>
        </div>
      </div>

      {/* Compact Header & Search */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {activeTab === "team" ? "Groups" : "Direct Messages"}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {activeTab === "team" 
                  ? `${departments.length} groups` 
                  : `${activeOnlineCount}/${totalMembers} online`
                }
              </p>
            </div>
            
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "p-1.5 rounded-md transition-all flex-shrink-0",
                isSearchOpen ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              aria-label="Toggle search"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          {isSearchOpen && (
            <div className="relative animate-in slide-in-from-top-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "team" ? "Search groups..." : "Search people..."}
                className="pl-8 pr-8 h-8 text-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto rounded-lg border bg-card shadow-sm scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {isLoading ? (
          // Skeleton Loading
          <div className="p-2 space-y-1.5">
            {[...Array(8)].map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Team Chat Groups */}
            {activeTab === "team" && (
              <div className="p-2 space-y-1">
                {/* All Departments - Always at top */}
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
                  }}
                  type="group"
                  isSelected={selectedChat?.id === "all-departments"}
                  onClick={() => onChatSelect?.({ id: "all-departments", type: "group" })}
                  onContextMenu={(e) => handleContextMenu(e, { id: "all-departments" }, "team")}
                />

                {/* Pinned Groups */}
                {pinnedDepartments.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Pinned
                    </div>
                    {pinnedDepartments.map((dept) => (
                      <ChatItem
                        key={dept.id}
                        item={dept}
                        type="group"
                        isSelected={selectedChat?.id === dept.id}
                        onClick={() => onChatSelect?.({ ...dept, type: "group" })}
                        onContextMenu={(e) => handleContextMenu(e, dept, "team")}
                        isDragging={draggedItem?.item.id === dept.id}
                        isDragOver={dragOverItem === dept.id}
                        onDragStart={(e) => handleDragStart(e, dept, "team")}
                        onDragOver={(e) => handleDragOver(e, dept)}
                        onDrop={(e) => handleDrop(e, dept, "team")}
                      />
                    ))}
                  </>
                )}

                {/* Regular Groups */}
                {unpinnedDepartments.length > 0 && pinnedDepartments.length > 0 && (
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Groups
                  </div>
                )}
                {unpinnedDepartments.map((dept) => (
                  <ChatItem
                    key={dept.id}
                    item={dept}
                    type="group"
                    isSelected={selectedChat?.id === dept.id}
                    onClick={() => onChatSelect?.({ ...dept, type: "group" })}
                    onContextMenu={(e) => handleContextMenu(e, dept, "team")}
                    isDragging={draggedItem?.item.id === dept.id}
                    isDragOver={dragOverItem === dept.id}
                    onDragStart={(e) => handleDragStart(e, dept, "team")}
                    onDragOver={(e) => handleDragOver(e, dept)}
                    onDrop={(e) => handleDrop(e, dept, "team")}
                  />
                ))}

                {filteredDepartments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-muted-foreground">No groups found</p>
                  </div>
                )}
              </div>
            )}

            {/* Personal Chat Members */}
            {activeTab === "personal" && (
              <div className="p-2 space-y-1">
                {/* Pinned Chats */}
                {pinnedMembers.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Pinned
                    </div>
                    {pinnedMembers.map((member) => (
                      <ChatItem
                        key={member.id}
                        item={member}
                        type="dm"
                        isSelected={selectedChat?.id === member.id}
                        onClick={() => onChatSelect?.({ ...member, type: "dm" })}
                        onContextMenu={(e) => handleContextMenu(e, member, "personal")}
                        isDragging={draggedItem?.item.id === member.id}
                        isDragOver={dragOverItem === member.id}
                        onDragStart={(e) => handleDragStart(e, member, "personal")}
                        onDragOver={(e) => handleDragOver(e, member)}
                        onDrop={(e) => handleDrop(e, member, "personal")}
                      />
                    ))}
                  </>
                )}

                {/* Regular Chats */}
                {unpinnedMembers.length > 0 && pinnedMembers.length > 0 && (
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Direct Messages
                  </div>
                )}
                {unpinnedMembers.map((member) => (
                  <ChatItem
                    key={member.id}
                    item={member}
                    type="dm"
                    isSelected={selectedChat?.id === member.id}
                    onClick={() => onChatSelect?.({ ...member, type: "dm" })}
                    onContextMenu={(e) => handleContextMenu(e, member, "personal")}
                    isDragging={draggedItem?.item.id === member.id}
                    isDragOver={dragOverItem === member.id}
                    onDragStart={(e) => handleDragStart(e, member, "personal")}
                    onDragOver={(e) => handleDragOver(e, member)}
                    onDrop={(e) => handleDrop(e, member, "personal")}
                  />
                ))}

                {filteredMembers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-muted-foreground">No members found</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
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
  const isGroup = type === "group";

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
        "w-full p-2 rounded-md text-left transition-all group relative",
        isSelected && "bg-primary/10 ring-1 ring-primary",
        !isSelected && "hover:bg-muted/50",
        isDragging && "opacity-50",
        isDragOver && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Icon/Avatar */}
        {isGroup ? (
          <div className={cn(
            "p-1.5 rounded-md mt-0.5 flex-shrink-0",
            isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-[10px] font-bold">
              {item.avatar}
            </div>
            <span 
              className={cn(
                "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card",
                item.status === "online" && "bg-green-500",
                item.status === "away" && "bg-yellow-500",
                item.status === "offline" && "bg-gray-400"
              )}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{item.name}</p>
              {item.isPinned && <Pin className="w-2.5 h-2.5 text-primary flex-shrink-0" />}
              {item.isMuted && <BellOff className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />}
            </div>
            <span className="text-[9px] text-muted-foreground flex-shrink-0">
              {formatTime(item.timestamp)}
            </span>
          </div>

          {/* Role or Last Message */}
          {!isGroup && item.role && (
            <p className="text-[9px] text-muted-foreground/80 mb-0.5">{item.role}</p>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground truncate flex-1">
              {item.lastMessage}
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.mentions > 0 && (
                <Badge className="bg-red-500 text-white text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                  @{item.mentions}
                </Badge>
              )}
              {item.unread > 0 && !item.isMuted && item.mentions === 0 && (
                <Badge className="bg-primary text-primary-foreground text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                  {item.unread}
                </Badge>
              )}
              {item.unread > 0 && item.isMuted && (
                <Badge variant="outline" className="text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                  {item.unread}
                </Badge>
              )}
            </div>
          </div>

          {/* Status info for DMs */}
          {!isGroup && item.status !== "online" && (
            <p className="text-[9px] text-muted-foreground/60 mt-0.5">
              {formatLastSeen(item.lastSeen)}
            </p>
          )}
          {!isGroup && item.status === "online" && item.device && (
            <p className="text-[9px] text-green-600 mt-0.5">
              Active on {item.device}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// Skeleton Loading Component
function SkeletonItem() {
  return (
    <div className="p-2 rounded-md animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-24" />
            <div className="h-2 bg-muted rounded w-8" />
          </div>
          <div className="h-2.5 bg-muted rounded w-full" />
          <div className="h-2 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// Context Menu Component
function ContextMenuComponent({ x, y, item, type, onPin, onMute, onMarkAsRead, onClose }) {
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
      className="fixed bg-card border rounded-lg shadow-xl py-1 z-50 min-w-[180px]"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        icon={item.isPinned ? X : Pin}
        label={item.isPinned ? "Unpin" : "Pin"}
        onClick={onPin}
      />
      <MenuItem
        icon={item.isMuted ? Bell : BellOff}
        label={item.isMuted ? "Unmute" : "Mute"}
        onClick={onMute}
      />
      {(item.unread > 0 || item.mentions > 0) && (
        <MenuItem
          icon={Check}
          label="Mark as read"
          onClick={onMarkAsRead}
        />
      )}
      <div className="h-px bg-border my-1" />
      <MenuItem icon={Archive} label="Archive" onClick={onClose} />
      {type === "personal" && (
        <MenuItem 
          icon={UserX} 
          label="Block" 
          onClick={onClose}
          className="text-red-500 hover:bg-red-500/10"
        />
      )}
      {type === "team" && (
        <MenuItem 
          icon={LogOut} 
          label="Leave group" 
          onClick={onClose}
          className="text-red-500 hover:bg-red-500/10"
        />
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, className }) {
  return (
    <button
      className={cn(
        "w-full px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-muted transition-colors text-left",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}