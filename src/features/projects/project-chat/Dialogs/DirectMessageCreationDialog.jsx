import React, { useState } from "react";
import useChatStore, { DEFAULT_PROJECT_ID } from "../store/chat.store";
import { toast } from "sonner";
import RecipientSelectorDialog from "./RecipientSelectorDialog";
import {
  convertToPrettyText,
  getAvatarFallback,
} from "../../../../shared/config/utils";
import { useSelector } from "react-redux";

export default function DirectMessageCreationDialog({
  open,
  onOpenChange,
  projectMembers,
}) {
  const { createDirectConversation, setSelectedChat, conversations } =
    useChatStore();
  const { currentUser } = useSelector((state) => state.user);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = projectMembers
    .filter((user) => user.userId !== currentUser._id)
    .filter((user) => {
      const fullText = `
      ${user.displayName}
      ${user.roleName}
      ${user.department}
    `.toLowerCase();

      return fullText.includes(searchQuery.toLowerCase());
    });

  const items = filteredMembers.map((user) => ({
    id: user.userId,
    name: user.displayName,
    avatar: getAvatarFallback(user.displayName),
    subtitle: `${convertToPrettyText(user.roleName)} · ${convertToPrettyText(
      user.department,
    )}`,
  }));

  const handleConfirm = async ([userId]) => {
    const existing = conversations.find(
      (c) => c.type === "dm" && c.userId?.toString() === userId.toString(),
    );

    if (existing) return setSelectedChat(existing);
    setIsCreating(true);

    try {
      const chat = await createDirectConversation(DEFAULT_PROJECT_ID, userId);

      setSelectedChat(chat);

      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <RecipientSelectorDialog
      open={open}
      onOpenChange={(val) => {
        if (!isCreating) onOpenChange(val);
      }}
      items={items}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      mode="direct"
      selectionType="single"
      onConfirm={handleConfirm}
      confirmLabel={isCreating ? "Creating..." : "Create"}
      disableConfirm={isCreating}
    />
  );
}
