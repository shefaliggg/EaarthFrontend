import ImagePreviewDialog from "../../../features/projects/project-chat/Dialogs/ImagePreviewDialog";
import { MODAL_TYPES, useModalStore } from "../../stores/useModalStore";
import ConfirmActionDialog from "../modals/ConfirmActionDialog";
import DocumentPreviewDialog from "../modals/DocumentPreviewDialog";

export default function GlobalModalRenderer() {
  const { type, isOpen, data, closeModal } = useModalStore();

  if (!isOpen) return null;

  switch (type) {
    case MODAL_TYPES.IMAGE_PREVIEW:
      return (
        <ImagePreviewDialog
          open={isOpen}
          onOpenChange={closeModal}
          imageFile={data?.imageFile}
        />
      );

    case MODAL_TYPES.DOCUMENT_PREVIEW:
      return (
        <DocumentPreviewDialog
          open={isOpen}
          onOpenChange={closeModal}
          fileUrl={data?.fileUrl}
          fileName={data?.fileName}
          banner={data?.banner}
        />
      );

    case MODAL_TYPES.CONFIRM_ACTION:
      return (
        <ConfirmActionDialog
          open={isOpen}
          onOpenChange={closeModal}
          loading={data?.loading}
          config={data?.config}
          error={data?.error}
          onConfirm={data?.onConfirm}
          autoClose={data?.autoClose}
        />
      );

    default:
      return null;
  }
}
