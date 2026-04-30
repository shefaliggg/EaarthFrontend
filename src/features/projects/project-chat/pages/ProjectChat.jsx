import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar/ChatLeftSidebar";
import ChatBox from "../components/ChatBox/ChatBox";
import useChatStore, { DEFAULT_PROJECT_ID } from "../store/chat.store";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Archive,
  EllipsisVertical,
  Eye,
  Heart,
  MessageCircle,
  MessageCirclePlus,
  MessageSquare,
  MessagesSquare,
  Phone,
  Pin,
  Search,
  UserCircle,
  UserRound,
  Users,
  Users2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import FilterPillTabs from "../../../../shared/components/FilterPillTabs";
import DirectMessageCreationDialog from "../Dialogs/DirectMessageCreationDialog";
import SubjectCreationDialog from "../Dialogs/SubjectCreationDialog";

function ProjectChat() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDirectDialog, setShowDirectDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);

  const currentUser = useSelector((state) => state.user?.currentUser);
  const { projectMembers } = useSelector((state) => state.project);
  const { conversations, setSelectedChat, loadConversations } = useChatStore();

  console.log("project members:",projectMembers)
  const currentProject = {
    _id: DEFAULT_PROJECT_ID,
    name: "Default Project",
  };

  const sortedConversations = [...conversations].sort((a, b) => {
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
      if (!conv.isArchived) {
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
          acc.favorite.push(conv);
        }
        if (conv.isMuted) {
          acc.muted.push(conv);
        }
        if (conv.isPinned) {
          acc.pinned.push(conv);
        }
      }

      if (conv.isArchived) {
        acc.archived.push(conv);
      }

      return acc;
    },
    {
      groups: [],
      subjects: [],
      teamMembers: [],
      unread: [],
      favorite: [],
      muted: [],
      pinned: [],
      archived: [],
    },
  );

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

  const getBadge = (count) => (count > 0 ? count : undefined);

  const chatFilterItems = [
    {
      label: "All",
      value: "all",
      badge: getBadge(groups.length + teamMembers.length),
      icon: MessageSquare,
    },
    {
      label: "Groups",
      value: "groups",
      badge: getBadge(groups.length),
      icon: MessagesSquare,
    },
    {
      label: "Subjects",
      value: "subjects",
      badge: getBadge(subjects.length),
      icon: Users2,
    },
    {
      label: "Direct",
      value: "direct",
      badge: getBadge(teamMembers.length),
      icon: UserRound,
    },
    {
      label: "Unread",
      value: "unread",
      badge: getBadge(unread.length),
      icon: Eye,
    },
    {
      label: "Favorites",
      value: "favorite",
      badge: getBadge(favorite.length),
      icon: Heart,
    },
    {
      label: "Pinned",
      value: "pinned",
      badge: getBadge(pinned.length),
      icon: Pin,
    },
    {
      label: "Muted",
      value: "muted",
      badge: getBadge(muted.length),
      icon: VolumeX,
    },
    {
      label: "Archived",
      value: "archived",
      badge: getBadge(archived.length),
      icon: Archive,
    },
  ];
  useEffect(() => {
    if (currentProject?._id && currentUser?._id) {
      loadConversations(currentProject._id, activeTab);
    }
  }, [currentProject?._id, activeTab, currentUser?._id]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // setSelectedChat(null);
  };

  return (
    <>
      <div className="space-y-6 mx-auto">
        <PageHeader
          icon="MessageSquare"
          title="Project Chat"
          extraActions={
            <>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <InfoTooltip content={"New Conversation"}>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm">
                        <MessageCirclePlus className="text-white w-5! h-5!" />
                        New Chat
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
              </div>
            </>
          }
        />
        <div className="mb-4 space-y-3 flex">
          <FilterPillTabs
            options={chatFilterItems}
            value={activeTab}
            onChange={handleTabChange}
            size="md"
            transparentBg={false}
            fullWidth
            variant="modern"
          />
        </div>

        <div className="flex h-full gap-3">
          {/* Sidebar */}
          <div className="w-full sm:w-[280px] lg:w-[320px] xl:w-[320px] 2xl:[360px] flex-shrink-0">
            <ChatLeftSidebar
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortedConversations={sortedConversations}
              categorizedConversations={categorizedConversations}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-w-0">
            <ChatBox />
          </div>
        </div>
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

export default ProjectChat;
