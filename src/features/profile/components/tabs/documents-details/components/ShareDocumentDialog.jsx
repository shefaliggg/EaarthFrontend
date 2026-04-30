import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { convertToPrettyText, getAvatarFallback } from "@/shared/config/utils";

import useChatStore from "../../../../../projects/project-chat/store/chat.store";
import RecipientSelectorDialog from "../../../../../projects/project-chat/Dialogs/RecipientSelectorDialog";
import {
  getAllProjectsThunk,
  getProjectMembersThunk,
} from "../../../../../projects/store";
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import { FileText, Loader } from "lucide-react";

export default function ShareDocumentDialog({ open, onOpenChange, document }) {
  const dispatch = useDispatch();

  const {
    conversations,
    loadConversations,
    getOrCreateDirectConversation,
    sendMessage,
  } = useChatStore();

  const { currentUser } = useSelector((state) => state.user);
  const { projects, projectMembers, isFetchingMembers, isFetching } =
    useSelector((state) => state.project);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const currentUserId = currentUser?._id?.toString();

  // ─────────────────────────────────────────────
  // 📦 Load projects initially
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!projects || projects.length === 0) {
      dispatch(getAllProjectsThunk());
    }
  }, [projects, dispatch]);

  // ─────────────────────────────────────────────
  // 🎯 Auto select first project
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedProjectId && projects?.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // ─────────────────────────────────────────────
  // 🔄 Load members + conversations on project change
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedProjectId || !currentUserId) return;

    dispatch(getProjectMembersThunk({ projectId: selectedProjectId }));

    loadConversations(selectedProjectId, "all"); // or your tab
  }, [selectedProjectId, currentUserId]);

  const isLoading = isFetching || isFetchingMembers;

  // ─────────────────────────────────────────────
  // 🧠 Build items
  // ─────────────────────────────────────────────
  const items = useMemo(() => {
    const q = searchQuery.toLowerCase();

    const dmUserIds = new Set(
      conversations
        .filter((c) => c.type === "dm")
        .map((c) => c.userId?.toString()),
    );

    const convItems = conversations
      .filter((c) => !c.isArchived)
      .filter((c) => c.name?.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.type === "dm" ? c.avatar : undefined,
        subtitle: c.type === "dm" ? "Direct Message" : "Group Chat",
        type: "conversation",
      }));

    const memberItems = (projectMembers ?? [])
      .filter((m) => m.userId?.toString() !== currentUserId)
      .filter((m) => !dmUserIds.has(m.userId?.toString()))
      .filter((m) => {
        const text =
          `${m.displayName} ${m.roleName} ${m.department}`.toLowerCase();
        return text.includes(q);
      })
      .map((m) => ({
        id: m.userId.toString(),
        name: m.displayName,
        avatar: getAvatarFallback(m.displayName),
        subtitle: `${convertToPrettyText(m.roleName)} · ${convertToPrettyText(
          m.department,
        )}`,
        type: "user",
      }));

    return [...convItems, ...memberItems];
  }, [conversations, projectMembers, currentUserId, searchQuery]);

  // ─────────────────────────────────────────────
  // 🚀 Confirm handler
  // ─────────────────────────────────────────────
  const handleConfirm = async (selectedIds) => {
    if (!document || !selectedProjectId) return;

    setIsSharing(true);

    const buildMessageData = () => ({
      type: "MEDIA",
      caption: `Sharing this with you: ${document.name || document.originalName}`,
      files: [
        {
          key: document.key,
          name: document.name || document.originalName,
          size: document.sizeBytes ?? document.size ?? 0,
          mime:
            document.mimeType ?? document.mime ?? "application/octet-stream",
          documentId: document._id,
        },
      ],
    });

    const resolveConversationId = async (id) => {
      const item = items.find((i) => i.id === id);

      if (!item) throw new Error("Invalid recipient");

      if (item.type === "conversation") return id;

      const conv = await getOrCreateDirectConversation(selectedProjectId, id);
      return conv.id;
    };

    try {
      const convIds = await Promise.all(selectedIds.map(resolveConversationId));

      const uniqueIds = [...new Set(convIds)];

      await Promise.all(
        uniqueIds.map((cid) =>
          sendMessage(cid, selectedProjectId, buildMessageData()),
        ),
      );

      // ✅ SUCCESS TOAST (descriptive)
      toast.success("Document shared", {
        description: `Your document has been shared to ${
          uniqueIds.length
        } chat${uniqueIds.length > 1 ? "s" : ""}. You can view it in the conversation.`,
      });

      onOpenChange(false);
    } catch (err) {
      console.error("❌ Share failed:", err);

      // ❌ ERROR TOAST (descriptive)
      toast.error("Failed to share document", {
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while sharing. Please try again.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const projectOptions = useMemo(() => {
    return (projects || []).map((p) => ({
      label: p.projectName,
      value: p._id,
    }));
  }, [projects]);

  // ─────────────────────────────────────────────
  // 🎨 Render
  // ─────────────────────────────────────────────
  return (
    <RecipientSelectorDialog
      open={open}
      onOpenChange={(v) => !isSharing && onOpenChange(v)}
      items={items}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onConfirm={handleConfirm}
      selectionType="multiple"
      mode="share"
      confirmLabel={
        isSharing ? (
          <span className="flex items-center gap-1">
            <Loader className="animate-spin size-4" /> Sharing...
          </span>
        ) : (
          "Share"
        )
      }
      disableConfirm={isSharing}
      isLoading={isLoading}
      renderTopContent={
        <div className="space-y-3">
          {/* 📁 Project Selector */}
          <EditableSelectField
            label="Project"
            icon="FolderKanban"
            placeholder="Select project"
            value={selectedProjectId}
            items={projectOptions}
            isEditing={true}
            onChange={(val) => setSelectedProjectId(val)}
            isRequired={true}
            disabled={!projects?.length}
          />

          {/* 📄 Document preview */}
          {document && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/60 border">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {document.name || document.originalName}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {document.documentType?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
