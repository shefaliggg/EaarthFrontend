import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  archiveDocumentThunk,
  unarchiveDocumentThunk,
  deleteDocumentThunk,
  restoreDocumentThunk,
} from "../store/document.thunk";

export function useDocumentActions() {
  const dispatch = useDispatch();
  const { archiving, unarchiving, deleting, restoring } = useSelector(
    (s) => s.userDocuments,
  );

  // ── Archive ─────────────────────────────────────────────

  const archiveDocument = async (doc) => {
    if (doc.usage?.length > 0) {
      toast.warning(
        `Document is used in ${doc.usage.length} context(s). Remove usage before archiving.`,
      );
      return;
    }

    await toast.promise(dispatch(archiveDocumentThunk(doc._id)).unwrap(), {
      loading: "Archiving document...",
      success: () => ({
        message: "Document archived",
        description:
          "This document is now archived. You can delete it manually or it will be automatically moved to trash after 6 months if unused.",
      }),
      error: (err) => ({
        message: "Archive failed",
        description:
          err?.message ||
          err ||
          "Something went wrong while archiving. Please try again.",
      }),
    });
  };

  // ── Unarchive ───────────────────────────────────────────

  const unarchiveDocument = async (doc) => {
    await toast.promise(dispatch(unarchiveDocumentThunk(doc._id)).unwrap(), {
      loading: "Restoring document...",
      success: () => ({
        message: "Document restored",
        description: "The document is now active and available for use.",
      }),
      error: (err) => ({
        message: "Restore failed",
        description:
          err?.message ||
          err ||
          "Unable to restore document. Please try again.",
      }),
    });
  };

  // ── Delete (soft delete) ────────────────────────────────

  const deleteDocument = async (doc) => {
    if (doc.status !== "ARCHIVED") {
      toast.info("Document must be archived before deletion.");
      return;
    }

    if (doc.usage?.length > 0) {
      toast.warning("Document is still in use and cannot be deleted.");
      return;
    }

    await toast.promise(dispatch(deleteDocumentThunk(doc._id)).unwrap(), {
      loading: "Moving document to trash...",
      success: () => ({
        message: "Moved to trash",
        description:
          "This document will be permanently deleted after 30 days. You can restore it anytime before that.",
      }),
      error: (err) => ({
        message: "Delete failed",
        description:
          err?.message ||
          err ||
          "Failed to move document to trash. Please try again.",
      }),
    });
  };

  // ── Restore ─────────────────────────────────────────────

  const restoreDocument = async (doc) => {
    await toast.promise(dispatch(restoreDocumentThunk(doc._id)).unwrap(), {
      loading: "Restoring from trash...",
      success: () => ({
        message: "Document restored",
        description: "The document has been successfully restored.",
      }),
      error: (err) => ({
        message: "Restore failed",
        description:
          err?.message ||
          err ||
          "Could not restore document. Please try again.",
      }),
    });
  };

  return {
    archiveDocument,
    unarchiveDocument,
    deleteDocument,
    restoreDocument,

    isArchiving: (id) => !!archiving[id],
    isUnarchiving: (id) => !!unarchiving[id],
    isDeleting: (id) => !!deleting[id],
    isRestoring: (id) => !!restoring[id],
  };
}
