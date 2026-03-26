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

  const currentProject = {
    _id: DEFAULT_PROJECT_ID,
    name: "Default Project",
  };

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
        acc.favorite.push(conv);
      }
      if (conv.isMuted) {
        acc.muted.push(conv);
      }
      if (conv.isPinned) {
        acc.pinned.push(conv);
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
    },
  );

  const { groups, subjects, teamMembers, unread, favorite, muted, pinned } =
    categorizedConversations;

  const chatFilterItems = [
    {
      label: "All",
      value: "all",
      badge: groups.length + teamMembers.length,
      icon: MessageSquare,
    },
    {
      label: "Groups",
      value: "groups",
      badge: groups.length,
      icon: MessagesSquare,
    },
    {
      label: "Subjects",
      value: "subjects",
      badge: subjects.length,
      icon: Users2,
    },
    {
      label: "Direct",
      value: "direct",
      badge: teamMembers.length,
      icon: UserRound,
    },
    {
      label: "Unread",
      value: "unread",
      badge: unread.length,
      icon: Eye,
    },
    {
      label: "Favorites",
      value: "favorite",
      badge: favorite.length,
      icon: Heart,
    },
    {
      label: "Pinned",
      value: "pinned",
      badge: pinned.length,
      icon: Pin,
    },
    {
      label: "Muted",
      value: "muted",
      badge: muted.length,
      icon: VolumeX,
    },
    // {
    //   label: "Calls",
    //   value: "calls",
    //   badge: favorite.length,
    //   icon: Phone
    // },
    {
      label: "Archived",
      value: "archive",
      badge: 0,
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

                {/* <DropdownMenu>
                  <InfoTooltip content={"Menu"}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <EllipsisVertical className=" w-5! h-5!" />
                      </Button>
                    </DropdownMenuTrigger>
                  </InfoTooltip>
                  <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuLabel>Chat menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />

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
                </DropdownMenu> */}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-1">
            <ChatLeftSidebar
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortedConversations={sortedConversations}
              categorizedConversations={categorizedConversations}
            />
          </div>

          <div className="lg:col-span-3">
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
