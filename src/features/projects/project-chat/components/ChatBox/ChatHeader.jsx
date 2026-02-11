// src/features/chat/components/ChatBox/ChatHeader.jsx
// ✅ Chat header with search, settings, and chat info

import React, { useState } from "react";
import {
  Search,
  Settings2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";

export default function ChatHeader({ selectedChat }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  return (
    <div className="flex items-center justify-between p-3 border-b rounded-t-3xl backdrop-blur-sm flex-shrink-0">
      {!isSearchOpen ? (
        <>
          {/* Chat Info */}
          <div className="flex items-center gap-2.5">
            {selectedChat.type === "dm" ? (
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
                  {selectedChat.avatar}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="p-2 rounded-full bg-primary/10">
                {selectedChat.icon && (
                  <selectedChat.icon className="w-5 h-5 text-primary" />
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                {selectedChat.type === "dm" ? (
                  <>
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        selectedChat.status === "online" &&
                          "bg-green-500 animate-pulse",
                        selectedChat.status === "away" && "bg-yellow-500",
                        selectedChat.status === "offline" && "bg-gray-400"
                      )}
                    />
                    <span>{selectedChat.role}</span>
                  </>
                ) : (
                  <>
                    <span>{selectedChat.members || 0} members</span>
                    {selectedChat.online > 0 && (
                      <>
                        <span className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                        <span className="flex items-center gap-1 text-green-500 font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          {selectedChat.online} online
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              className="h-8 px-2.5 rounded-md text-[10px] flex items-center gap-1.5 border bg-background hover:bg-accent transition-colors"
              aria-label="Summarize conversation"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Summarize</span>
            </button>

            <div className="w-px h-8 bg-border mx-0.5" />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label="Search messages"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
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
                    Math.min(searchResults.length - 1, activeResultIndex + 1)
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