import useChatStore from "../store/chat.store";
import { toast } from "sonner";
import RecipientSelectorDialog from "./RecipientSelectorDialog";
import { useState } from "react";

export default function ForwardMessageDialog({
  open,
  onOpenChange,
  message,
  selectedChatId,
}) {
  const { conversations, sendMessage } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  const items = conversations
    .filter((conv) => conv.id !== selectedChatId)
    .map((conv) => ({
      id: conv.id,
      name: conv.name,
      avatar: conv.type === "dm" ? conv.avatar : undefined,
      subtitle: conv.type === "dm" ? "Direct Message" : "Group Chat",
    }))
    .filter((conv) => conv.name.includes(searchQuery.toLowerCase()));

  const handleConfirm = async (selectedIds) => {
    const forwardPromise = Promise.all(
      selectedIds.map((convId) => {
        const messageData = {
          type: message.type.toUpperCase(),
          text: message.type === "text" ? message.content : undefined,
          caption: message.type !== "text" ? message.caption : undefined,
          files: message.files || [],
          forwardedFrom: {
            conversationId: message.conversationId,
            senderId: message.senderId,
          },
        };

        return sendMessage(convId, message.projectId, messageData);
      }),
    );

    toast.promise(forwardPromise, {
      loading: "Forwarding message...",
      success: `Message forwarded to ${selectedIds.length} conversation(s)!`,
      error: "Failed to forward message",
    });

    try {
      await forwardPromise;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <RecipientSelectorDialog
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      mode="forward"
      selectionType="multiple"
      onConfirm={handleConfirm}
    />
  );
}
