import React, { useState } from "react";
import {
  Search,
  Settings2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Button } from "../../../../../shared/components/ui/button";
import useChatStore from "../../store/chat.store";
import useCallStore from "../../store/call.store";

export default function ChatHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  const { selectedChat, getGroupOnlineCount, onlineUsers } = useChatStore();
  const { initiateCall } = useCallStore();

  const isOnline = selectedChat?.userId && onlineUsers.has(selectedChat.userId);

  const onlineCount = getGroupOnlineCount(selectedChat);

  return (
    <div className="flex items-center justify-between p-3 border-b rounded-t-3xl backdrop-blur-sm flex-shrink-0">
      {!isSearchOpen ? (
        <>
          {/* Chat Info */}
          <div className="flex items-center gap-2.5">
            {selectedChat.avatar && (
              <Avatar className="h-9! w-9! border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
                  {selectedChat.type === "dm"
                    ? selectedChat.avatar
                    : selectedChat.name.charAt(0)}
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
                    <span>{selectedChat.role}</span>
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

            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Start Voice Call"
              onClick={() => initiateCall(selectedChat.id, "AUDIO")}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Start Video Call"
              onClick={() => initiateCall(selectedChat.id, "VIDEO")}
            >
              <Video className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setIsSearchOpen(true)}
              variant={"ghost"}
              size={"icon"}
              aria-label="Search messages"
              disabled
            >
              <Search className="w-4 h-4" />
            </Button>

            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Settings"
              disabled
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </>
      ) : (
        /* Search Mode */
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="p-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>

          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 h-8"
            autoFocus
          />

          {searchResults.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                {activeResultIndex + 1} / {searchResults.length}
              </span>
              <button
                onClick={() =>
                  setActiveResultIndex(Math.max(0, activeResultIndex - 1))
                }
                disabled={activeResultIndex === 0}
                className="p-1 rounded hover:bg-accent disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveResultIndex(
                    Math.min(searchResults.length - 1, activeResultIndex + 1),
                  )
                }
                disabled={activeResultIndex === searchResults.length - 1}
                className="p-1 rounded hover:bg-accent disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
