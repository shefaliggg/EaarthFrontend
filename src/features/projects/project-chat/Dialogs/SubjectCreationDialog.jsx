import React, { useState } from "react";
import { Loader } from "lucide-react";
import RecipientSelectorDialog from "./RecipientSelectorDialog";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import useChatStore, { DEFAULT_PROJECT_ID } from "../store/chat.store";
import { useSelector } from "react-redux";
import {
  convertToPrettyText,
  getAvatarFallback,
} from "../../../../shared/config/utils";
import { toast } from "sonner";
import { isSameSubjectConversation } from "../utils/messageHelpers";

export default function SubjectCreationDialog({
  open,
  onOpenChange,
  projectMembers,
  onCreate,
}) {
  const { createSubjectConversation, setSelectedChat, conversations } =
    useChatStore();
  const { currentUser } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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

  const handleConfirm = async (selectedUserIds) => {
    if (!title.trim()) {
      return toast.error("Please provide a Subject Title");
    }

    const existing = conversations.find((c) =>
      isSameSubjectConversation(c, title, selectedUserIds, currentUser._id),
    );

    if (existing) {
      setSelectedChat(existing);
      onOpenChange(false);
      return;
    }

    setIsCreating(true);

    try {
      const chat = await createSubjectConversation(
        DEFAULT_PROJECT_ID,
        title,
        selectedUserIds,
      );

      setSelectedChat(chat);

      setTitle("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to create Subject conversation");
      console.error("Failed to create subject conversation", err);
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
      mode="subject"
      selectionType="multiple"
      onConfirm={handleConfirm}
      confirmLabel={
        isCreating ? (
          <>
            <Loader className="w-3 h-3 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Subject Group"
        )
      }
      disableConfirm={isCreating || !title.trim()}
      renderTopContent={
        <EditableTextDataField
          label="Subject Title"
          value={title}
          isEditing={true}
          onChange={setTitle}
          placeholder="Eg: Camera Team Discussion"
          inputClassName={"border-border border-2 rounded-3xl py-4.5"}
        />
      }
    />
  );
}
