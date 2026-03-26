import { useEffect, useState } from "react";
import { Search, X, SearchX, MessageCircleX } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import useChatStore, { DEFAULT_PROJECT_ID } from "../../store/chat.store";
import ConversationItem from "../ChatLeftSidebar/ConversationItem";
import ContextMenu from "../ChatLeftSidebar/ContextMenu";
import SkeletonItem from "../ChatLeftSidebar/SkeletonItem";
import { useDispatch, useSelector } from "react-redux";
import { getProjectMembersThunk } from "../../../store";
export default function ChatLeftSidebar({
  activeTab = "all",
  searchQuery,
  setSearchQuery,
  sortedConversations,
  categorizedConversations,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const dispatch = useDispatch();
  const projectId = DEFAULT_PROJECT_ID;

  const { isLoadingConversations, selectedChat, setSelectedChat } =
    useChatStore();

  const { groups, subjects, teamMembers, unread, favorite, muted, pinned } =
    categorizedConversations;

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

      case "all":
      default:
        return sortedConversations;
    }
  })();

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
        {/* Conversations List */}
        <div className="flex flex-col rounded-3xl border bg-card shadow-sm overflow-hidden h-[calc(100vh-38px)] max-h-[924px]">
          <div className="bg-card p-3 border-b">
            <div className="flex items-center justify-between mb-2 pl-1.5">
              <h2 className="text-lg font-bold">Conversations</h2>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="pl-9 pr-3 h-9 bg-muted/50 border rounded-3xl text-xs placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted/80"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              )}
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
                {activeList.length > 0 ? (
                  renderConversationList(activeList)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground flex flex-col items-center gap-4">
                      {searchQuery ? (
                        <SearchX className="w-8 h-8 text-primary" />
                      ) : (
                        <MessageCircleX className="w-8 h-8 text-primary" />
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
