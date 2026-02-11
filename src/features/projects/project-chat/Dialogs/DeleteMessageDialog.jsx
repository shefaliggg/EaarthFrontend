// src/features/chat/components/Dialogs/DeleteMessageDialog.jsx
// ✅ Delete message dialog with "for me" and "for everyone" options

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import chatApi from "../api/chat.api";
import useChatStore from "../store/chat.store";

export default function DeleteMessageDialog({
  open,
  onOpenChange,
  message,
  selectedChatId,
  canDeleteForEveryone,
}) {
  const { loadMessages } = useChatStore();

  const handleDeleteForMe = async () => {
    try {
      await chatApi.deleteMessageForMe(selectedChatId, message.id);
      onOpenChange(false);
      await loadMessages(selectedChatId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert(`Failed to delete message: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      await chatApi.deleteMessageForEveryone(selectedChatId, message.id);
      onOpenChange(false);
      await loadMessages(selectedChatId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert(error.response?.data?.message || "Failed to delete message.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Choose how you want to delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="outline"
            onClick={handleDeleteForMe}
            className="w-full sm:w-auto"
          >
            Delete for me
          </Button>
          {message?.isOwn && canDeleteForEveryone && (
            <Button
              variant="destructive"
              onClick={handleDeleteForEveryone}
              className="w-full sm:w-auto"
            >
              Delete for everyone
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}