/**
 * Path: src/features/projects/settings/hooks/useChatSettings.js
 */

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatSettingsThunk,
  updateChatGeneralThunk,
  updateChatChannelsThunk,
  updateChatNotificationsThunk,
  updateChatModerationThunk,
} from "../../store/thunks/chatSettings.thunks";

const DEFAULTS = {
  general: {
    enableChat: true, enableDirectMessages: true, enableChannels: true,
    enableThreads: true, enableFileSharing: true, enableReactions: true,
    enableReadReceipts: true, maxFileSizeMB: 25,
  },
  channels: {
    defaultChannels: "GENERAL, ANNOUNCEMENTS, PRODUCTION, DEPARTMENTS",
  },
  notifications: {
    enableNotifications: true, mentionsOnly: false, muteAfterHours: false,
  },
  moderation: {
    enableModeration: true, profanityFilter: false, enableGiphy: true,
    enableBots: false, archiveInactiveChannels: true,
    messageRetentionDays: 365, archiveAfterDaysInactive: 90,
  },
};

export function useChatSettings(projectId) {
  const dispatch = useDispatch();

  const raw        = useSelector((s) => s.projectSettings.chatSettings);
  const isFetching = useSelector((s) => s.projectSettings.isFetching ?? false);
  const isUpdating = useSelector((s) => s.projectSettings.isUpdating ?? false);
  const error      = useSelector((s) => s.projectSettings.error      ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchChatSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    general:       { ...DEFAULTS.general,       ...(raw?.general       ?? {}) },
    channels:      { ...DEFAULTS.channels,      ...(raw?.channels      ?? {}) },
    notifications: { ...DEFAULTS.notifications, ...(raw?.notifications ?? {}) },
    moderation:    { ...DEFAULTS.moderation,    ...(raw?.moderation    ?? {}) },
  };

  const updateGeneral       = useCallback((updates) => dispatch(updateChatGeneralThunk({ projectId, updates })),       [dispatch, projectId]);
  const updateChannels      = useCallback((updates) => dispatch(updateChatChannelsThunk({ projectId, updates })),      [dispatch, projectId]);
  const updateNotifications = useCallback((updates) => dispatch(updateChatNotificationsThunk({ projectId, updates })), [dispatch, projectId]);
  const updateModeration    = useCallback((updates) => dispatch(updateChatModerationThunk({ projectId, updates })),    [dispatch, projectId]);

  return {
    settings,
    isFetching,
    isUpdating,
    error,
    updateGeneral,
    updateChannels,
    updateNotifications,
    updateModeration,
  };
}