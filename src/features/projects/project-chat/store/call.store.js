import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  ConsoleLogger,
  DefaultActiveSpeakerPolicy,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { getChatSocket } from "../../../../shared/config/socketConfig";
import chatApi from "../api/chat.api";
import { toast } from "sonner";
import useChatStore from "./chat.store";
import { getCurrentUserId } from "../../../../shared/config/utils";

let endingTimer = null;

const useCallStore = create(
  devtools(
    (set, get) => ({
      callState: "idle", // idle | incoming | connecting | connected | ending
      endReason: null,
      callType: null,
      conversationId: null,
      meetingSession: null,
      incomingCall: null,
      viewMode: "compact",
      localTileId: null,
      remoteTiles: [],
      isInitiator: false,
      isAudioMuted: false,
      isVideoOff: false,
      isSharingScreen: false,
      activeSpeakerId: null,
      participants: [],
      hadParticipants: false, // [{ userId, displayName, isMuted, isVideoOff }]

      setViewMode: (mode) => set({ viewMode: mode }),
      setIncomingCall: (data) =>
        set({ incomingCall: data, callState: "incoming", isInitiator: false }),
      clearIncomingCall: () => set({ incomingCall: null }),

      enterEndingState: (reason = "ended") => {
        const { meetingSession } = get();
        try {
          if (meetingSession) {
            meetingSession.audioVideo.stopLocalVideoTile();
            meetingSession.audioVideo.stopContentShare();
            meetingSession.audioVideo.stop();
          }
        } catch (e) {
          /* ignore */
        }

        set({ callState: "ending", endReason: reason, viewMode: "compact" });

        if (endingTimer) clearTimeout(endingTimer);
        endingTimer = setTimeout(() => {
          get().resetCallState();
          endingTimer = null;
        }, 5000);
      },

      initiateCall: async (conversationId, callType = "VIDEO") => {
        set({
          callState: "connecting",
          callType,
          conversationId,
          viewMode: "compact",
          isInitiator: true,
        });

        const currentUserId = getCurrentUserId();

        const tempId = `temp-${crypto.randomUUID()}`;

        useChatStore.getState().addMessageToConversation(conversationId, {
          _id: tempId,
          clientTempId: tempId,
          type: "CALL",
          senderId: currentUserId,
          content: {
            callInfo: {
              type: callType,
              initiatorId: currentUserId,
              status: "RINGING",
            },
          },
          createdAt: new Date(),
        });

        try {
          const data = await chatApi.initiateCall({
            conversationId,
            callType,
            clientTempId: tempId,
          });
          await get().startSession(data.meeting, data.attendee, conversationId);
        } catch (err) {
          console.error("❌ initiateCall failed:", err);
          set({ callState: "idle", callType: null, conversationId: null });
          throw err;
        }
      },

      joinCall: async (conversationId) => {
        set({ callState: "connecting", conversationId });
        try {
          const data = await chatApi.joinCall(conversationId);
          const callType = data.callType || "AUDIO";
          set({ callType });

          if (
            Array.isArray(data.existingParticipants) &&
            data.existingParticipants.length > 0
          ) {
            set({
              participants: data.existingParticipants.map((p) => ({
                userId: p.userId,
                displayName: p.displayName,
                isMuted: false,
                isVideoOff: callType !== "VIDEO",
              })),
            });
          }
          await get().startSession(data.meeting, data.attendee, conversationId);
          get().clearIncomingCall();
        } catch (err) {
          console.error("❌ joinCall failed:", err);
          set({ callState: "idle" });
          throw err;
        }
      },

      joinCallSafely: async (conversationId) => {
        const state = get();

        // ✅ Already in THIS call — just bring the modal up
        if (
          state.callState === "connected" &&
          state.conversationId === conversationId
        ) {
          set({ viewMode: "compact" });
          return;
        }

        // 🚫 Prevent spam while connecting
        if (state.callState === "connecting") {
          toast.info("Connecting to call…");
          return;
        }

        // 🔄 In a DIFFERENT call — leave it first
        if (
          state.callState === "connected" &&
          state.conversationId !== conversationId
        ) {
          toast.info("Leaving current call…");
          await state.leaveCall();
        }

        // 🚀 Join
        set({ viewMode: "compact" }); // ensure modal is visible before async work
        await toast.promise(get().joinCall(conversationId), {
          loading: "Joining call…",
          success: () => {
            const type = get().callType === "VIDEO" ? "Video" : "Audio";
            return `${type} call connected`;
          },
          error: "Failed to join call",
        });
      },

      declineCall: () => {
        const { incomingCall } = get();
        const socket = getChatSocket();

        if (socket && incomingCall) {
          const conversation = useChatStore
            .getState()
            .conversations.find((c) => c.id === incomingCall.conversationId);

          const isDirect =
            conversation?.type === "dm" ||
            (Array.isArray(conversation?.members) &&
              conversation.members.length <= 2);

          if (isDirect) {
            socket.emit("call:decline", {
              conversationId: incomingCall.conversationId,
              initiatorId: incomingCall.initiatorId,
            });
          }
        }

        set({ incomingCall: null, callState: "idle", endReason: null });
      },

      leaveCall: async () => {
        const { conversationId, meetingSession } = get();

        try {
          if (meetingSession) {
            meetingSession.audioVideo.stopLocalVideoTile();
            meetingSession.audioVideo.stopContentShare();
            meetingSession.audioVideo.stop();
          }
        } catch (e) {
          console.warn("Session stop error:", e);
        }

        if (conversationId) {
          await chatApi.leaveCall(conversationId);
        }

        get().resetCallState();
      },

      endCallForEveryone: async () => {
        const { conversationId, meetingSession } = get();

        try {
          if (meetingSession) {
            meetingSession.audioVideo.stopLocalVideoTile();
            meetingSession.audioVideo.stopContentShare();
            meetingSession.audioVideo.stop();
          }
        } catch (e) {
          console.warn("Session stop error:", e);
        }

        if (conversationId) {
          await chatApi.endCall(conversationId);
        }

        get().resetCallState();
      },

      toggleMute: () => {
        const { meetingSession, isAudioMuted } = get();
        if (!meetingSession) return;

        if (isAudioMuted) {
          meetingSession.audioVideo.realtimeUnmuteLocalAudio();
        } else {
          meetingSession.audioVideo.realtimeMuteLocalAudio();
        }
        set({ isAudioMuted: !isAudioMuted });
      },

      toggleVideo: async () => {
        const { meetingSession, isVideoOff } = get();
        if (!meetingSession) return;

        if (isVideoOff) {
          const devices =
            await meetingSession.audioVideo.listVideoInputDevices();
          if (devices.length > 0) {
            await meetingSession.audioVideo.startVideoInput(
              devices[0].deviceId,
            );
          }
          meetingSession.audioVideo.startLocalVideoTile();
        } else {
          await meetingSession.audioVideo.stopVideoInput();
          meetingSession.audioVideo.stopLocalVideoTile();
        }
        set({ isVideoOff: !isVideoOff });
      },

      startScreenShare: async () => {
        const { meetingSession } = get();
        if (!meetingSession) return;
        try {
          await meetingSession.audioVideo.startContentShareFromScreenCapture();
          set({ isSharingScreen: true });
        } catch (err) {
          console.error("Screen share error:", err);
        }
      },

      stopScreenShare: async () => {
        const { meetingSession } = get();
        if (!meetingSession) return;
        await meetingSession.audioVideo.stopContentShare();
        set({ isSharingScreen: false });
      },

      startSession: async (meeting, attendee, conversationId) => {
        const logger = new ConsoleLogger("ChimeSDK", LogLevel.WARN);
        const deviceController = new DefaultDeviceController(logger);
        const configuration = new MeetingSessionConfiguration(
          meeting,
          attendee,
        );
        const meetingSession = new DefaultMeetingSession(
          configuration,
          logger,
          deviceController,
        );

        // Bind audio output — the <audio> element is always rendered once in CallModal
        const audioEl = document.getElementById("chime-audio-sink");
        if (audioEl) {
          await meetingSession.audioVideo.bindAudioElement(audioEl);
        } else {
          console.warn(
            "⚠️ chime-audio-sink element not found — remote audio may be silent",
          );
        }

        // Mic input
        const audioInputDevices =
          await meetingSession.audioVideo.listAudioInputDevices();
        if (audioInputDevices.length > 0) {
          await meetingSession.audioVideo.startAudioInput(
            audioInputDevices[0].deviceId,
          );
        }

        // Camera input (VIDEO calls only)
        const callType = get().callType;
        if (callType === "VIDEO") {
          const videoInputDevices =
            await meetingSession.audioVideo.listVideoInputDevices();
          if (videoInputDevices.length > 0) {
            await meetingSession.audioVideo.startVideoInput(
              videoInputDevices[0].deviceId,
            );
          }
        }

        get().attachObservers(meetingSession, conversationId);
        meetingSession.audioVideo.start();

        if (callType === "VIDEO") {
          meetingSession.audioVideo.startLocalVideoTile();
        }

        set({
          meetingSession,
          callState: "connected",
          conversationId,
          isAudioMuted: false,
          isVideoOff: callType !== "VIDEO",
        });
      },

      attachObservers: (meetingSession, conversationId) => {
        meetingSession.audioVideo.addObserver({
          videoTileDidUpdate: (tileState) => {
            if (!tileState.boundAttendeeId) return;

            if (tileState.localTile) {
              set({ localTileId: tileState.tileId });
            } else {
              set((state) => {
                // Update existing tile or add new one
                const existingIdx = state.remoteTiles.findIndex(
                  (t) => t.tileId === tileState.tileId,
                );
                const tile = {
                  tileId: tileState.tileId,
                  boundExternalUserId: tileState.boundExternalUserId,
                  isContent: tileState.isContent,
                };
                if (existingIdx >= 0) {
                  const updated = [...state.remoteTiles];
                  updated[existingIdx] = tile;
                  return { remoteTiles: updated };
                }
                return { remoteTiles: [...state.remoteTiles, tile] };
              });
            }
          },

          videoTileWasRemoved: (tileId) => {
            const { localTileId } = get();
            if (tileId === localTileId) {
              set({ localTileId: null });
            } else {
              set((state) => ({
                remoteTiles: state.remoteTiles.filter(
                  (t) => t.tileId !== tileId,
                ),
              }));
            }
          },

          audioVideoDidStop: (sessionStatus) => {
            console.log("Chime session stopped:", sessionStatus.statusCode());
            const { callState } = get();
            if (callState !== "idle") {
              get().resetCallState();
            }
          },

          contentShareDidStart: () => set({ isSharingScreen: true }),
          contentShareDidStop: () => set({ isSharingScreen: false }),
        });

        // Active speaker detector
        meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
          new DefaultActiveSpeakerPolicy(),
          (activeSpeakers) => {
            if (activeSpeakers.length > 0) {
              set({ activeSpeakerId: activeSpeakers[0] });
            } else {
              set({ activeSpeakerId: null });
            }
          },
        );
      },

      bindVideoTile: (tileId, videoElement) => {
        const { meetingSession } = get();
        if (!meetingSession || !videoElement) return;
        meetingSession.audioVideo.bindVideoElement(tileId, videoElement);
      },

      unbindVideoTile: (tileId) => {
        const { meetingSession } = get();
        if (!meetingSession) return;
        try {
          meetingSession.audioVideo.unbindVideoElement(tileId);
        } catch (e) {
          // tile may already be gone
        }
      },

      resetCallState: () => {
        set({
          callState: "idle",
          endReason: null,
          callType: null,
          conversationId: null,
          meetingSession: null,
          incomingCall: null,
          localTileId: null,
          remoteTiles: [],
          isAudioMuted: false,
          isVideoOff: false,
          isSharingScreen: false,
          activeSpeakerId: null,
          participants: [],
          hadParticipants: false,
          viewMode: "compact", // reset view mode for next call
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // SOCKET LISTENERS
      // ─────────────────────────────────────────────────────────────────────
      attachCallSocketListeners: () => {
        const socket = getChatSocket();
        if (!socket) return;

        socket.on("call:incoming", (data) => {
          if (get().callState !== "idle") return;
          get().setIncomingCall(data);
        });

        socket.on("call:declined", ({ conversationId }) => {
          const state = get();
          if (
            state.conversationId === conversationId &&
            (state.callState === "connecting" ||
              state.callState === "connected")
          ) {
            get().enterEndingState("declined");
          }
        });

        socket.on(
          "call:ended",
          ({ conversationId, endedBy, status, reason }) => {
            const state = get();
            const currentUserId = getCurrentUserId();

            const isActive =
              state.conversationId === conversationId &&
              state.callState !== "idle" &&
              state.callState !== "ending";

            const isPendingIncoming =
              state.callState === "incoming" &&
              state.incomingCall?.conversationId === conversationId;

            if (!isActive && !isPendingIncoming) return;

            if (isPendingIncoming) {
              // Call was cancelled/timed-out before we answered — silent clear, no animation
              get().resetCallState();
              return;
            }

            let endReason;

            if (status === "MISSED" || reason === "TIMEOUT") {
              endReason = "missed";
            } else if (status === "ENDED") {
              endReason = "ended";
            } else {
              endReason = state.participants.length === 0 ? "missed" : "ended";
            }

            get().enterEndingState(endReason);
          },
        );

        socket.on(
          "call:participant-joined",
          ({ userId, displayName, callType }) => {
            set((state) => ({
              participants: [
                ...state.participants.filter((p) => p.userId !== userId),
                {
                  userId,
                  displayName,
                  isMuted: false,
                  isVideoOff: callType !== "VIDEO",
                },
              ],
              hadParticipants: true,
            }));
          },
        );

        socket.on("call:participant-left", ({ userId }) => {
          set((state) => ({
            participants: state.participants.filter((p) => p.userId !== userId),
          }));

          const updated = get();
          if (
            updated.callState === "connected" &&
            updated.hadParticipants &&
            updated.participants.length === 0
          ) {
            get().enterEndingState("ended");
          }
        });
      },
    }),
    { name: "CallStore" },
  ),
);

export default useCallStore;
