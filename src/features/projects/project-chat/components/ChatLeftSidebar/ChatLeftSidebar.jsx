// src/features/chat/components/ChatLeftSidebar/ChatLeftSidebar.jsx
// ✅ FIXED: Proper conversation filtering

import React, { useState } from "react";
import { Hash, Users, Mail, Search, X } from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import useChatStore from "../../store/chat.store";
import ConversationItem from "../ChatLeftSidebar/ConversationItem";
import ContextMenu from "../ChatLeftSidebar/ContextMenu";
import SkeletonItem from "../ChatLeftSidebar/SkeletonItem";

export default function ChatLeftSidebar({
  activeTab = "all",
  onTabChange,
  selectedChat,
  onChatSelect,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  const { conversations, isLoadingConversations } = useChatStore();

  console.log("📋 All conversations:", conversations); // ✅ Debug log

  // ✅ FIXED: Filter conversations by search and tab
  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    if (!conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // ✅ CRITICAL FIX: Match backend types correctly
    if (activeTab === "all") {
      // Show PROJECT_ALL and DEPARTMENT conversations
      return conv.type === "all" || conv.type === "group";
    } else if (activeTab === "personal") {
      // Show DIRECT conversations only
      return conv.type === "dm";
    }

    return true;
  });

  console.log("🔍 Filtered conversations for tab:", activeTab, filteredConversations); // ✅ Debug log

  // Sort: pinned first, then by timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.mentions > 0 && b.mentions === 0) return -1;
    if (a.mentions === 0 && b.mentions > 0) return 1;
    return b.timestamp - a.timestamp;
  });

  // ✅ FIXED: Separate by type for "all" tab
  const departments = sortedConversations.filter(
    (c) => c.type === "all" || c.type === "group"
  );
  const teamMembers = sortedConversations.filter((c) => c.type === "dm");

  console.log("📊 Departments:", departments.length, "Team members:", teamMembers.length); // ✅ Debug log

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const handleChatClick = (item, itemType) => {
    console.log("💬 Chat clicked:", item); // ✅ Debug log
    
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
      canSendMessage: item.canSendMessage,
      projectId: item.projectId, // ✅ CRITICAL: Include projectId
      _raw: item._raw,
    };

    onChatSelect?.(chatData);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Selection */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="font-bold mb-3">Conversations</h3>
        <div className="space-y-2">
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
            {/* ✅ Show count badge */}
            {departments.length > 0 && (
              <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                {departments.length}
              </span>
            )}
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
              <p className="text-xs opacity-80">Personal chat with members</p>
            </div>
            {/* ✅ Show count badge */}
            {teamMembers.length > 0 && (
              <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                {teamMembers.length}
              </span>
            )}
          </button>

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
            {/* ✅ Show count */}
            <span className="text-xs text-muted-foreground">
              {activeTab === "all" ? departments.length : teamMembers.length} chats
            </span>
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
              {/* ✅ FIXED: Show correct conversations based on tab */}
              {activeTab === "all" && (
                <>
                  {departments.map((dept) => (
                    <ConversationItem
                      key={dept.id}
                      item={dept}
                      type={dept.type}
                      isSelected={selectedChat?.id === dept.id}
                      onClick={() => handleChatClick(dept, dept.type)}
                      onContextMenu={(e) => handleContextMenu(e, dept, "team")}
                    />
                  ))}

                  {departments.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">
                        {searchQuery 
                          ? `No departments found for "${searchQuery}"`
                          : "No departments found"}
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "personal" && (
                <>
                  {teamMembers.map((member) => (
                    <ConversationItem
                      key={member.id}
                      item={member}
                      type="dm"
                      isSelected={selectedChat?.id === member.id}
                      onClick={() => handleChatClick(member, "dm")}
                      onContextMenu={(e) => handleContextMenu(e, member, "personal")}
                    />
                  ))}

                  {teamMembers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xs text-muted-foreground">
                        {searchQuery 
                          ? `No members found for "${searchQuery}"`
                          : "No direct messages yet"}
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
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          type={contextMenu.type}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}