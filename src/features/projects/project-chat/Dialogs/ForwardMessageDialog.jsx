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
import useChatStore from "../store/chat.store";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
} from "../../../../shared/components/ui/avatar";

export default function ForwardMessageDialog({
  open,
  onOpenChange,
  message,
  selectedChatId,
}) {
  const [selectedConversations, setSelectedConversations] = useState([]);
  const { conversations, sendMessage } = useChatStore();

  const handleForwardMessage = async () => {
    if (selectedConversations.length === 0) {
      toast.warning("Please select at least one conversation");
      return;
    }

    const conversations = [...selectedConversations];
    const originalSenderId = message.senderId;

    onOpenChange(false);
    setSelectedConversations([]);

    const forwardPromise = Promise.all(
      conversations.map((convId) => {
        const messageData = {
          type: message.type.toUpperCase(),
          text: message.type === "text" ? message.content : undefined,
          caption: message.type !== "text" ? message.caption : undefined,
          files: message.files || [],
          forwardedFrom: {
            conversationId: message.conversationId,
            senderId: originalSenderId,
          },
        };

        return sendMessage(convId, message.projectId, messageData);
      }),
    );

    toast.promise(forwardPromise, {
      loading: "Forwarding message...",
      success: `Message forwarded to ${conversations.length} conversation(s)!`,
      error: "Failed to forward message",
    });

    try {
      await forwardPromise;
    } catch (error) {
      console.error("Failed to forward message:", error);
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
                        : [...prev, conv.id],
                    );
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted border-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9! w-9! border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
                        {conv.type === "dm" ? conv.avatar : conv.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{conv.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {conv.type === "dm" ? "Direct Message" : "Group Chat"}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground",
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
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
