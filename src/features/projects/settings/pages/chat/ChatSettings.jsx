/**
 * ChatSettings.jsx
 * Path: src/features/projects/settings/pages/ChatSettings.jsx
 */

import { useState, useCallback }  from "react";
import { useOutletContext }       from "react-router-dom";
import { Loader2 }                from "lucide-react";

import CardWrapper           from "@/shared/components/wrappers/CardWrapper";
import EditableSwitchField   from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import { useChatSettings }   from "./useChatSettings";

function ChatSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    error,
    updateGeneral,
    updateChannels,
    updateNotifications,
    updateModeration,
  } = useChatSettings(projectId);

  const [saveError, setSaveError] = useState(null);

  // ── Auto-save helper ──────────────────────────────────────────────────────
  const autoSave = useCallback(async (thunkFn, updates) => {
    setSaveError(null);
    try {
      await thunkFn(updates).unwrap();
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
    }
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isFetching && !settings.general.enableChat) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading chat settings…
      </div>
    );
  }

  const { general, channels, notifications, moderation } = settings;

  // ── Section header ────────────────────────────────────────────────────────
  const SectionHeader = ({ title, description }) => (
    <div className="flex items-center justify-between mb-7">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
        <div>
          <h3 className="text-foreground text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground text-[0.7rem] mt-0.5">{description}</p>
        </div>
      </div>
      {isUpdating && (
        <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
          <Loader2 size={11} className="animate-spin" /> Auto-saving changes
        </div>
      )}
    </div>
  );

  // ── Yes/No toggle ─────────────────────────────────────────────────────────
  // Matches the screenshot's YES / NO pill toggle style via EditableSwitchField
  const YesNoRow = ({ label, checked, onChange }) => (
    <EditableSwitchField
      label={label}
      checked={checked}
      isEditing={true}
      onChange={onChange}
      yesNo
    />
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {(error || saveError) && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError ?? (typeof error === "string" ? error : error?.message) ?? "Something went wrong."}
        </div>
      )}

      {/* ── General ── */}
      <CardWrapper showLabel={false}>
        <SectionHeader
          title="General"
          description="Core chat functionality settings."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YesNoRow
            label="Enable Chat"
            checked={general.enableChat}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableChat: val })}
          />
          <YesNoRow
            label="Enable Direct Messages"
            checked={general.enableDirectMessages}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableDirectMessages: val })}
          />
          <YesNoRow
            label="Enable Channels"
            checked={general.enableChannels}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableChannels: val })}
          />
          <YesNoRow
            label="Enable Threads"
            checked={general.enableThreads}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableThreads: val })}
          />
          <YesNoRow
            label="Enable File Sharing"
            checked={general.enableFileSharing}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableFileSharing: val })}
          />
          <YesNoRow
            label="Enable Reactions"
            checked={general.enableReactions}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableReactions: val })}
          />
          <YesNoRow
            label="Enable Read Receipts"
            checked={general.enableReadReceipts}
            onChange={(val) => autoSave(updateGeneral, { ...general, enableReadReceipts: val })}
          />
        </div>

        <div className="mt-4">
          <EditableTextDataField
            label="Max File Size (MB)"
            type="number"
            value={general.maxFileSizeMB ?? ""}
            isEditing={true}
            isRequired={false}
            onChange={(val) =>
              autoSave(updateGeneral, { ...general, maxFileSizeMB: val === "" ? 25 : Number(val) })
            }
          />
        </div>
      </CardWrapper>

      {/* ── Channels ── */}
      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Channels"
          description="Default channel configuration."
        />

        <EditableTextDataField
          label="Default Channels (comma-separated)"
          value={channels.defaultChannels}
          isEditing={true}
          isRequired={false}
          onChange={(val) => autoSave(updateChannels, { defaultChannels: val })}
        />
        <p className="text-muted-foreground text-[0.65rem] mt-2">
          These channels are automatically created for new projects.
        </p>
      </CardWrapper>

      {/* ── Notifications ── */}
      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Notifications"
          description="Chat notification preferences."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YesNoRow
            label="Enable Notifications"
            checked={notifications.enableNotifications}
            onChange={(val) => autoSave(updateNotifications, { ...notifications, enableNotifications: val })}
          />
          <YesNoRow
            label="Mentions Only"
            checked={notifications.mentionsOnly}
            onChange={(val) => autoSave(updateNotifications, { ...notifications, mentionsOnly: val })}
          />
          <YesNoRow
            label="Mute After Hours"
            checked={notifications.muteAfterHours}
            onChange={(val) => autoSave(updateNotifications, { ...notifications, muteAfterHours: val })}
          />
        </div>
      </CardWrapper>

      {/* ── Moderation & Retention ── */}
      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Moderation & Retention"
          description="Content moderation and message retention policies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YesNoRow
            label="Enable Moderation"
            checked={moderation.enableModeration}
            onChange={(val) => autoSave(updateModeration, { ...moderation, enableModeration: val })}
          />
          <YesNoRow
            label="Profanity Filter"
            checked={moderation.profanityFilter}
            onChange={(val) => autoSave(updateModeration, { ...moderation, profanityFilter: val })}
          />
          <YesNoRow
            label="Enable Giphy"
            checked={moderation.enableGiphy}
            onChange={(val) => autoSave(updateModeration, { ...moderation, enableGiphy: val })}
          />
          <YesNoRow
            label="Enable Bots"
            checked={moderation.enableBots}
            onChange={(val) => autoSave(updateModeration, { ...moderation, enableBots: val })}
          />
          <YesNoRow
            label="Archive Inactive Channels"
            checked={moderation.archiveInactiveChannels}
            onChange={(val) => autoSave(updateModeration, { ...moderation, archiveInactiveChannels: val })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableTextDataField
            label="Message Retention (days)"
            type="number"
            value={moderation.messageRetentionDays ?? ""}
            isEditing={true}
            isRequired={false}
            onChange={(val) =>
              autoSave(updateModeration, {
                ...moderation,
                messageRetentionDays: val === "" ? 365 : Number(val),
              })
            }
          />
          <EditableTextDataField
            label="Archive After (days inactive)"
            type="number"
            value={moderation.archiveAfterDaysInactive ?? ""}
            isEditing={true}
            isRequired={false}
            onChange={(val) =>
              autoSave(updateModeration, {
                ...moderation,
                archiveAfterDaysInactive: val === "" ? 90 : Number(val),
              })
            }
          />
        </div>
      </CardWrapper>

    </div>
  );
}

export default ChatSettings;