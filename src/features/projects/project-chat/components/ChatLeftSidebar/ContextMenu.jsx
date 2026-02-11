// src/features/chat/components/ChatLeftSidebar/ContextMenu.jsx
// ✅ Right-click context menu for conversations

import React from "react";
import {
  Pin,
  Archive,
  Trash2,
  VolumeX,
  Volume2,
  Star,
  MoreHorizontal,
} from "lucide-react";

export default function ContextMenu({ x, y, item, type, onClose }) {
  const handleAction = (action) => {
    console.log(`📌 Context menu action: ${action}`, item);
    
    // TODO: Implement actual actions
    // - Pin/Unpin conversation
    // - Favorite/Unfavorite
    // - Mute/Unmute
    // - Archive
    // - Delete
    
    onClose();
  };

  const menuItems = [
    { 
      icon: Pin, 
      label: item.isPinned ? "Unpin conversation" : "Pin conversation", 
      action: "pin" 
    },
    { 
      icon: Star, 
      label: item.isFavorite ? "Remove from favorites" : "Add to favorites", 
      action: "favorite" 
    },
    { 
      icon: item.isMuted ? Volume2 : VolumeX, 
      label: item.isMuted ? "Unmute notifications" : "Mute notifications", 
      action: "mute" 
    },
    { 
      icon: Archive, 
      label: "Archive conversation", 
      action: "archive" 
    },
    { 
      icon: Trash2, 
      label: "Delete conversation", 
      action: "delete", 
      danger: true 
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu */}
      <div
        className="fixed z-50 bg-card border rounded-lg shadow-xl py-1 min-w-[200px] animate-in fade-in slide-in-from-top-1 duration-200"
        style={{ 
          left: Math.min(x, window.innerWidth - 220), 
          top: Math.min(y, window.innerHeight - (menuItems.length * 40 + 20))
        }}
        role="menu"
        aria-orientation="vertical"
      >
        {menuItems.map((menuItem, index) => (
          <button
            key={index}
            onClick={() => handleAction(menuItem.action)}
            className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-muted transition-colors text-sm ${
              menuItem.danger 
                ? "text-red-500 hover:bg-red-500/10" 
                : "text-foreground"
            }`}
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