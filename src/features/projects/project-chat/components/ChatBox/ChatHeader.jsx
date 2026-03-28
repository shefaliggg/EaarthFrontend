import React, { useEffect, useState } from "react";
import {
  Search,
  Settings2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
  Megaphone,
  Clapperboard,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Button } from "../../../../../shared/components/ui/button";
import useChatStore from "../../store/chat.store";
import useCallStore from "../../store/call.store";
import { canUserSendMessage } from "../../utils/chatPermissions";
import {
  convertToPrettyText,
  getCurrentUserId,
} from "../../../../../shared/config/utils";
import { getGroupCategoryUI } from "../../utils/messageHelpers";

export default function ChatHeader() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { selectedChat, getGroupOnlineCount, onlineUsers } = useChatStore();
  const { initiateCall } = useCallStore();

  const { canSend } = canUserSendMessage(selectedChat, getCurrentUserId());

  const isGroup = selectedChat.type === "group";
  const {
    icon: Icon,
    containerClass,
    iconClass,
  } = getGroupCategoryUI(selectedChat.category);

  const isOnline = selectedChat?.userId && onlineUsers.has(selectedChat.userId);
  const onlineCount = getGroupOnlineCount(selectedChat);

  useEffect(() => {
    if (isSearching) {
      document.getElementById("message-search")?.focus();
    }
  }, [isSearching]);

  return (
    <div className="p-3 border-b rounded-t-3xl backdrop-blur-sm">
      <div className="flex items-center justify-between flex-shrink-0">
        {/* Chat Info */}
        <div className="flex items-center gap-2.5">
          {selectedChat.avatar && (
            <Avatar className="h-9! w-9!">
              <AvatarFallback
                className={cn(
                  "text-primary-foreground font-bold text-sm",
                  isGroup
                    ? containerClass
                    : "bg-gradient-to-br from-primary to-primary/70",
                )}
              >
                {isGroup ? (
                  <Icon className={cn("w-4 h-4", iconClass)} />
                ) : (
                  selectedChat.avatar
                )}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              {selectedChat.type === "dm" ? (
                <>
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400",
                    )}
                  />
                  <span>{convertToPrettyText(selectedChat.role)}</span>
                </>
              ) : (
                <>
                  <span>{selectedChat.members.length || 0} members</span>
                  <span className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      onlineCount > 0
                        ? "text-green-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {onlineCount > 0 && (
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    )}
                    {onlineCount} online
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          {/* <Button
              variant={"outline"}
              size={"sm"}
              aria-label="Summarize conversation"
              disabled
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Summarize</span>
            </Button> */}

          {canSend && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Start Voice Call"
                onClick={() =>
                  initiateCall(selectedChat.id, selectedChat.type, "AUDIO")
                }
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Start Video Call"
                onClick={() =>
                  initiateCall(selectedChat.id, selectedChat.type, "VIDEO")
                }
              >
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          {isSearching ? (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
            >
              <X className="w-4 h-4 stroke-2! text-destructive" />
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

          <Button
            variant={"ghost"}
            size={"icon"}
            aria-label="Settings"
            disabled
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "relative overflow-hidden transform transition-all duration-300 ease-in-out",
          isSearching
            ? "translate-y-0 opacity-100 max-h-14 mt-3"
            : "-translate-y-2 opacity-0 max-h-0",
        )}
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
          <Input
            id="message-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search For Messages"
            className="pl-9 pr-6 h-9 bg-muted/50 border rounded-3xl text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
