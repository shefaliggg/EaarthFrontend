import { useEffect, useState } from "react";
import {
  Search,
  X,
  SearchX,
  MessageCircleX,
  EllipsisVertical,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import useChatStore, { DEFAULT_PROJECT_ID } from "../../store/chat.store";
import ConversationItem from "../ChatLeftSidebar/ConversationItem";
import ContextMenu from "../ChatLeftSidebar/ContextMenu";
import SkeletonItem from "../ChatLeftSidebar/SkeletonItem";
import { useDispatch, useSelector } from "react-redux";
import { getProjectMembersThunk } from "../../../store";
import { cn } from "../../../../../shared/config/utils";
import { Button } from "../../../../../shared/components/ui/button";
export default function ChatLeftSidebar({
  activeTab = "all",
  searchQuery,
  setSearchQuery,
  sortedConversations,
  categorizedConversations,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const projectId = DEFAULT_PROJECT_ID;

  const { isLoadingConversations, selectedChat, setSelectedChat } =
    useChatStore();

  const {
    groups,
    subjects,
    teamMembers,
    unread,
    favorite,
    muted,
    pinned,
    archived,
  } = categorizedConversations;

  const renderConversationList = (list) => {
    return list.map((item) => (
      <ConversationItem
        key={item.id}
        item={item}
        type={item.type === "dm" ? "direct" : "group"}
        isSelected={selectedChat?.id === item.id}
        onClick={() => handleChatClick(item)}
        onContextMenu={(e) =>
          handleContextMenu(e, item, item.type === "dm" ? "direct" : "group")
        }
      />
    ));
  };

  const activeList = (() => {
    switch (activeTab) {
      case "groups":
        return groups;

      case "subjects":
        return subjects;

      case "direct":
        return teamMembers;

      case "unread":
        return unread;

      case "favorite":
        return favorite;

      case "pinned":
        return pinned;

      case "muted":
        return muted;

      case "archived":
        return archived;

      case "all":
      default:
        return sortedConversations.filter((conv) => !conv.isArchived);
    }
  })();

  const filteredConversations = activeList.filter((conv) => {
    if (!conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getEmptyMessage = () => {
    if (searchQuery) {
      return (
        <span>
          No conversations found for "
          <span className="text-primary">{searchQuery}</span>"
        </span>
      );
    }

    switch (activeTab) {
      case "groups":
        return "No groups found";
      case "subjects":
        return "No subjects groups found";

      case "direct":
        return "No direct conversations yet";

      case "unread":
        return "No unread messages";

      case "favorite":
        return "No Favorite conversations";

      case "pinned":
        return "No Pinned conversations";

      case "muted":
        return "No Muted conversations";

      case "archived":
        return "No Archived conversations";

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
  useEffect(() => {
    if (isSearching) {
      document.getElementById("chat-search")?.focus();
    }
  }, [isSearching]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Conversations List */}
        <div className="flex flex-col rounded-3xl border bg-card shadow-sm overflow-hidden h-[calc(100vh-38px)] max-h-[924px]">
          <div className="bg-card p-3 border-b">
            <div className="flex items-center justify-between mt-0.5 pl-1.5">
              <h2 className="text-lg font-bold">Conversations</h2>
              <div className="flex items-center">
                {isSearching ? (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => {
                      setIsSearching(false);
                      setSearchQuery("");
                    }}
                  >
                    <X className="w-4 h-4 stroke-2! text-muted-foreground" />
                  </Button>
                ) : (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setIsSearching(true)}
                  >
                    <Search className="w-4 h-4 stroke-2! text-muted-foreground" />
                  </Button>
                )}
                <Button variant={"ghost"} size={"icon"}>
                  <EllipsisVertical className="w-4 h-4 stroke-2! text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div
              className={cn(
                "relative overflow-hidden transform transition-all duration-300 ease-in-out",
                isSearching ? "max-h-14 opacity-100 mt-2" : "max-h-0 opacity-0",
                isSearching
                  ? "translate-y-0 opacity-100 max-h-14 mt-2"
                  : "-translate-y-2 opacity-0 max-h-0",
              )}
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                <Input
                  id="chat-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-9 pr-6 h-9 bg-muted/50 border rounded-3xl text-xs placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent px-1 pb-2 mx-0.5 pt-1">
            {isLoadingConversations ? (
              <div className="p-1 space-y-1">
                {[...Array(8)].map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </div>
            ) : (
              <div className="p-1 space-y-1">
                {filteredConversations.length > 0 ? (
                  renderConversationList(filteredConversations)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground flex flex-col items-center gap-4">
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
    </>
  );
}
