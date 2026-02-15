// src/features/chat/components/Dialogs/ForwardMessageDialog.jsx
// ✅ Forward message to other conversations

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import chatApi from "../api/chat.api";
import useChatStore from "../store/chat.store";

export default function ForwardMessageDialog({
  open,
  onOpenChange,
  message,
  selectedChatId,
}) {
  const [selectedConversations, setSelectedConversations] = useState([]);
  const { conversations } = useChatStore();

  const handleForwardMessage = async () => {
    if (selectedConversations.length === 0) {
      alert("Please select at least one conversation");
      return;
    }

    try {
      const senderId = message._raw?.senderId?._id || message._raw?.senderId;

      for (const convId of selectedConversations) {
        const messageData = {
          projectId: message._raw?.projectId || "697c899668977a7ca2b27462",
          text: message.content || "",
          type: (message.type || "TEXT").toUpperCase(),
          forwardedFrom: {
            conversationId: selectedChatId,
            senderId: senderId,
          },
        };

        await chatApi.sendMessage(convId, messageData);
      }

      onOpenChange(false);
      setSelectedConversations([]);
      alert(`Message forwarded to ${selectedConversations.length} conversation(s)!`);
    } catch (error) {
      console.error("Failed to forward message:", error);
      alert(`Failed to forward message: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
          <DialogDescription>
            Select conversations to forward this message to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {conversations
            .filter((conv) => conv.id !== selectedChatId)
            .map((conv) => {
              const isSelected = selectedConversations.includes(conv.id);

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversations((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== conv.id)
                        : [...prev, conv.id]
                    );
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{conv.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {conv.type === "dm" ? "Direct Message" : "Group Chat"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedConversations([]);
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleForwardMessage}
            disabled={selectedConversations.length === 0}
            className="flex-1"
          >
            Forward ({selectedConversations.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}