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
import { Trash2 } from "lucide-react";
import useChatStore from "../store/chat.store";

export default function DeleteMessageDialog({
  open,
  onOpenChange,
  message,
  selectedChatId,
  canDeleteForEveryone,
}) {
  const { deleteMessageForMe, deleteMessageForEveryone } = useChatStore();

  const handleDeleteForMe = async () => {
    onOpenChange(false);
    await deleteMessageForMe(selectedChatId, message.id);
  };

  const handleDeleteForEveryone = async () => {
    onOpenChange(false);
    await deleteMessageForEveryone(selectedChatId, message.id);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md! space-y-4">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            <AlertDialogTitle>Delete message</AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            This message will be removed from the conversation.
            {canDeleteForEveryone && message?.isOwn && (
              <span className="block mt-1 text-xs text-muted-foreground">
                You can also delete it for everyone.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col! gap-2">
          {message?.isOwn && canDeleteForEveryone && (
            <Button
              variant="outline"
              className="w-full text-red-500 hover:bg-red-600"
              onClick={handleDeleteForEveryone}
            >
              Delete for everyone
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDeleteForMe}
          >
            Delete for me
          </Button>

          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
