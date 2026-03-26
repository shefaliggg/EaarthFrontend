import {
  Pin,
  Archive,
  Trash2,
  VolumeX,
  Volume2,
  Star,
  MoreHorizontal,
  Eye,
  Heart,
} from "lucide-react";
import useChatStore from "../../store/chat.store";
import { useState } from "react";

export default function ContextMenu({ x, y, item, type, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const emitConversationRead = useChatStore((s) => s.emitConversationRead);
  const togglePinConversation = useChatStore((s) => s.togglePinConversation);
  const toggleFavoriteConversation = useChatStore(
    (s) => s.toggleFavoriteConversation,
  );
  const toggleArchiveConversation = useChatStore(
    (s) => s.toggleArchiveConversation,
  );
  const pinnedCount = useChatStore(
    (s) => s.conversations.filter((c) => c.isPinned).length,
  );
  const isPinDisabled = !item.isPinned && pinnedCount >= 5;

  const handleAction = (action) => {
    console.log(`📌 Context menu action: ${action}`, item);

    // TODO: Implement actual actions
    // - Mute/Unmute
    // - Delete
    if (action === "read") {
      emitConversationRead(item?.id);
    }
    if (action === "pin") {
      togglePinConversation(item?.id);
    }
    if (action === "favorite") {
      toggleFavoriteConversation(item?.id);
    }
    if (action === "archive") {
      toggleArchiveConversation(item?.id);
    }

    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 180); // match animation duration
  };

  const menuItems = [
    {
      icon: Archive,
      label: item.isArchived
        ? "Unarchive conversation"
        : "Archive conversation",
      action: "archive",
    },
    {
      icon: Pin,
      label: item.isPinned
        ? "Unpin conversation"
        : pinnedCount >= 5
          ? "Pin limit reached (5)"
          : "Pin conversation",
      action: "pin",
      disabled: !item.isPinned && pinnedCount >= 5,
    },
    {
      icon: Heart,
      label: item.isFavorite ? "Remove from favorites" : "Add to favorites",
      action: "favorite",
    },
    {
      icon: Eye,
      label: item.isRead ? "Mark as unread" : "Mark as read",
      action: "read",
    },
    {
      icon: item.isMuted ? Volume2 : VolumeX,
      label: item.isMuted ? "Unmute notifications" : "Mute notifications",
      action: "mute",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={`
    fixed z-50 bg-card border rounded-lg shadow-xl py-1 min-w-[200px]
    transition-all duration-200 ease-out
    ${
      isClosing
        ? "opacity-0 scale-95 translate-y-1"
        : "opacity-100 scale-100 translate-y-0"
    }
  `}
        style={{
          left: Math.min(x, window.innerWidth - 220),
          top: Math.min(y, window.innerHeight - (menuItems.length * 40 + 20)),
        }}
        role="menu"
        aria-orientation="vertical"
      >
        {menuItems.map((menuItem, index) => (
          <button
            key={index}
            onClick={() => !menuItem.disabled && handleAction(menuItem.action)}
            disabled={menuItem.disabled}
            className={`
                w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm transition-colors
                ${
                  menuItem.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted cursor-pointer"
                }
                ${menuItem.danger ? "text-red-500 hover:bg-red-500/10" : "text-foreground"}
              `}
            role="menuitem"
          >
            <menuItem.icon className="w-4 h-4 flex-shrink-0" />
            <span>{menuItem.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
