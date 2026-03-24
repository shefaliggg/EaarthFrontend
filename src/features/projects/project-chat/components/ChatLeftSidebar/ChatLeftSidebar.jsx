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
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";
import useChatStore, { DEFAULT_PROJECT_ID } from "../../store/chat.store";
import ConversationItem from "../ChatLeftSidebar/ConversationItem";
import ContextMenu from "../ChatLeftSidebar/ContextMenu";
import SkeletonItem from "../ChatLeftSidebar/SkeletonItem";
import FilterPillTabs from "../../../../../shared/components/FilterPillTabs";
import { Button } from "../../../../../shared/components/ui/button";
import DirectMessageCreationDialog from "../../Dialogs/DirectMessageCreationDialog";
import { useDispatch, useSelector } from "react-redux";
import { getProjectMembersThunk } from "../../../store";
import { InfoTooltip } from "../../../../../shared/components/InfoTooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import SubjectCreationDialog from "../../Dialogs/SubjectCreationDialog";

export default function ChatLeftSidebar({ activeTab = "all", onTabChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [showDirectDialog, setShowDirectDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
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

    const aHasUnread = a.unread > 0 || a.mentions > 0;
    const bHasUnread = b.unread > 0 || b.mentions > 0;

    if (aHasUnread && !bHasUnread) return -1;
    if (!aHasUnread && bHasUnread) return 1;

    return b.timestamp - a.timestamp;
  });

  const categorizedConversations = sortedConversations.reduce(
    (acc, conv) => {
      if (conv.type === "group") {
        acc.groups.push(conv);
        if (conv.category === "subject") {
          acc.subjects.push(conv);
        }
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
      groups: [],
      subjects: [],
      teamMembers: [],
      unread: [],
      favorite: [],
    },
  );

  const { groups, subjects, teamMembers, unread, favorite } =
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

      case "all":
      default:
        return sortedConversations;
    }
  })();

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No conversations found for "${searchQuery}"`;
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
          {/* Header */}
          <div className="border-b bg-card px-3 py-2.5 pt-3 mb-1">
            <div className="flex items-center justify-between mb-2 pl-1.5">
              <h2 className="text-lg font-bold">
                {activeTab === "Email" ? "Email" : "Chats"}
              </h2>

              <div className="flex items-center">
                <DropdownMenu>
                  <InfoTooltip content={"New Conversation"}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MessageCirclePlus className="text-primary w-5! h-5!" />
                      </Button>
                    </DropdownMenuTrigger>
                  </InfoTooltip>
                  <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuLabel>New Conversation</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setShowDirectDialog(true)}>
                      <MessageCirclePlus className="h-4 w-4" />
                      Direct Chat
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setShowSubjectDialog(true)}
                    >
                      <Users className="h-4 w-4" />
                      Subject Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <InfoTooltip content={"Menu"}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="text-primary w-5! h-5!" />
                      </Button>
                    </DropdownMenuTrigger>
                  </InfoTooltip>
                  <DropdownMenuContent align="end" className="min-w-48">
                    {/* <DropdownMenuLabel>New Conversation</DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}

                    <DropdownMenuItem onClick={() => setShowDirectDialog(true)}>
                      <MessageCirclePlus className="h-4 w-4" />
                      Archive Chat
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setShowSubjectDialog(true)}
                    >
                      <Users className="h-4 w-4" />
                      Unread All Chats
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <FilterPillTabs
              options={[
                {
                  label: "All",
                  value: "all",
                  badge: groups.length + teamMembers.length,
                },
                {
                  label: "Groups",
                  value: "groups",
                  badge: groups.length,
                },
                {
                  label: "Subject",
                  value: "subjects",
                  badge: subjects.length,
                },
                {
                  label: "Direct",
                  value: "direct",
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
        open={showDirectDialog}
        onOpenChange={setShowDirectDialog}
        projectMembers={projectMembers}
      />

      <SubjectCreationDialog
        open={showSubjectDialog}
        onOpenChange={setShowSubjectDialog}
        projectMembers={projectMembers}
      />
    </>
  );
}
