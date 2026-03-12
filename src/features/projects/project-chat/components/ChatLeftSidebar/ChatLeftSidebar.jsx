import React, { useEffect, useState } from "react";
import {
  Hash,
  Users,
  Mail,
  Search,
  X,
  MessageCirclePlus,
  MessageCircleOff,
  SearchX,
  MessageCircleX,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import useChatStore, { DEFAULT_PROJECT_ID } from "../../store/chat.store";
import ConversationItem from "../ChatLeftSidebar/ConversationItem";
import ContextMenu from "../ChatLeftSidebar/ContextMenu";
import SkeletonItem from "../ChatLeftSidebar/SkeletonItem";
import { toast } from "sonner";
import FilterPillTabs from "../../../../../shared/components/FilterPillTabs";
import { Button } from "../../../../../shared/components/ui/button";
import DirectMessageCreationDialog from "../../Dialogs/DirectMessageCreationDialog";
import { useDispatch, useSelector } from "react-redux";
import { getProjectMembersThunk } from "../../../store";

export default function ChatLeftSidebar({ activeTab = "all", onTabChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [showDirectMessageCreationDialog, setShowDirectMessageCreationDialog] =
    useState(false);
  const dispatch = useDispatch();

  const {
    conversations,
    isLoadingConversations,
    selectedChat,
    setSelectedChat,
  } = useChatStore();
  const { projectMembers } = useSelector((state) => state.project);

  const projectId = DEFAULT_PROJECT_ID;

  const filteredConversations = conversations.filter((conv) => {
    if (!conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.mentions > 0 && b.mentions === 0) return -1;
    if (a.mentions === 0 && b.mentions > 0) return 1;
    return b.timestamp - a.timestamp;
  });

  const categorizedConversations = sortedConversations.reduce(
    (acc, conv) => {
      if (conv.type === "all" || conv.type === "group") {
        acc.departments.push(conv);
      }

      if (conv.type === "dm") {
        acc.teamMembers.push(conv);
      }

      if (conv.unread > 0) {
        acc.unread.push(conv);
      }
      if (conv.isFavorite) {
        acc.favorited.push(conv);
      }

      return acc;
    },
    {
      departments: [],
      teamMembers: [],
      unread: [],
      favorite: [],
    },
  );

  const { departments, teamMembers, unread, favorite } =
    categorizedConversations;

  const renderConversationList = (list) => {
    return list.map((item) => (
      <ConversationItem
        key={item.id}
        item={item}
        type={item.type === "dm" ? "personal" : "group"}
        isSelected={selectedChat?.id === item.id}
        onClick={() =>
          item.canSendMessage
            ? handleChatClick(item)
            : toast.error(
                "You do not have permission to send messages in this Chat",
              )
        }
        onContextMenu={(e) =>
          handleContextMenu(e, item, item.type === "dm" ? "personal" : "team")
        }
      />
    ));
  };

  const activeList = (() => {
    switch (activeTab) {
      case "departments":
        return departments;

      case "personal":
        return teamMembers;

      case "unread":
        return unread;

      case "favorite":
        return favorite;

      case "all":
      default:
        return [...departments, ...teamMembers];
    }
  })();

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No conversations found for "${searchQuery}"`;
    }

    switch (activeTab) {
      case "departments":
        return "No departments found";

      case "personal":
        return "No personal conversations yet";

      case "unread":
        return "No unread messages";

      case "favorite":
        return "No Favorite conversations";

      default:
        return "No conversations yet";
    }
  };

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectMembersThunk({ projectId }));
    }
  }, [projectId]);

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Tab Selection */}
        {/* <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="font-bold mb-3">Conversations</h3>
          <div className="space-y-2">
            <button
              className={cn(
                "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
              onClick={() => onTabChange?.("all")}
            >
              <Hash className="w-4 h-4" />
              <div className="flex-1">
                <p className="text-sm font-bold">Chat</p>
                <p className="text-xs opacity-80">
                  department and direct chats
                </p>
              </div>
            </button>

            <button
              className={cn(
                "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
                "cursor-not-allowed bg-muted opacity-50",
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
        </div> */}

        {/* Conversations List */}
        <div className="flex flex-col rounded-3xl border bg-card shadow-sm overflow-hidden h-[calc(100vh-38px)] max-h-[710px] sticky top-5">
          {/* Header */}
          <div className="border-b bg-card px-4 py-2.5 pt-3 mb-1">
            <div className="flex items-center justify-between mb-3 pl-1.5">
              <h2 className="text-lg font-bold">
                {activeTab === "Email" ? "Email" : "Chat Conversations"}
              </h2>
              <Button
                variant="ghost"
                size={"icon"}
                onClick={() => setShowDirectMessageCreationDialog(true)}
              >
                <MessageCirclePlus className="text-primary" />
              </Button>
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
            <FilterPillTabs
              options={[
                {
                  label: "All",
                  value: "all",
                  badge: departments.length + teamMembers.length,
                },
                {
                  label: "Departments",
                  value: "departments",
                  badge: departments.length,
                },
                {
                  label: "Personal",
                  value: "personal",
                  badge: teamMembers.length,
                },
                {
                  label: "Unread",
                  value: "unread",
                  badge: unread.length,
                },
                {
                  label: "Favorites",
                  value: "favorite",
                  badge: favorite.length,
                },
              ]}
              value={activeTab}
              onChange={onTabChange}
              size="sm"
            />
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
              <div className="p-1 px-2 space-y-1">
                {activeList.length > 0 ? (
                  renderConversationList(activeList)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xs text-muted-foreground flex flex-col items-center gap-4">
                      {searchQuery ? (
                        <SearchX className="w-6 h-6 text-primary" />
                      ) : (
                        <MessageCircleX className="w-6 h-6 text-primary" />
                      )}
                      {getEmptyMessage()}
                    </p>
                  </div>
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

      <DirectMessageCreationDialog
        open={showDirectMessageCreationDialog}
        onOpenChange={setShowDirectMessageCreationDialog}
        projectMembers={projectMembers}
      />
    </>
  );
}
