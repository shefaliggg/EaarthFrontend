import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  ConsoleLogger,
  DefaultActiveSpeakerPolicy,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSessionStatusCode,
} from "amazon-chime-sdk-js";
import { getChatSocket } from "../../../../shared/config/socketConfig";
import chatApi from "../api/chat.api";
import { toast } from "sonner";
import useChatStore from "./chat.store";
import { getCurrentUserId } from "../../../../shared/config/utils";

let endingTimer = null;
let activeSpeakerTimer = null;

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
      remoteTiles: {},
      isInitiator: false,
      isAudioMuted: false,
      isVideoOff: false,
      isSharingScreen: false,
      activeSpeakerId: null,
      attendeeIdToUserId: {},
      participants: [],
      hadParticipants: false, // [{ userId, displayName, isMuted, isVideoOff }]

      setViewMode: (mode) => set({ viewMode: mode }),
      setIncomingCall: (data) =>
        set({ incomingCall: data, callState: "incoming", isInitiator: false }),
      clearIncomingCall: () => set({ incomingCall: null }),

      enterEndingState: (reason = "ended") => {
        console.log("ending state triggered:", reason);
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
        endingTimer = setTimeout(
          () => {
            get().resetCallState();
            endingTimer = null;
          },
          reason === "error" ? 6000 : 4000,
        );
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
          get().enterEndingState("error");
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
            // Build attendeeIdToUserId mapping for existing participants
            const attendeeMap = {};
            data.existingParticipants.forEach((p) => {
              if (p.attendeeId && p.userId) {
                attendeeMap[p.attendeeId] = p.userId;
              }
            });

            set((state) => ({
              participants: data.existingParticipants.map((p) => ({
                userId: p.userId,
                displayName: p.displayName,
                isMuted: p.isMuted ?? false,
                isVideoOff: p.isVideoOff ?? (callType !== "VIDEO"),
              })),
              attendeeIdToUserId: {
                ...state.attendeeIdToUserId,
                ...attendeeMap,
              },
            }));
          }
          await get().startSession(data.meeting, data.attendee, conversationId);
          get().clearIncomingCall();
        } catch (err) {
          console.error("❌ joinCall failed:", err);
          get().enterEndingState("error");
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
        const { conversationId, meetingSession, callState } = get();

        // ✅ Guard — don't fire if already cleaning up or idle
        if (!conversationId || callState === "idle" || callState === "ending") {
          console.warn("leaveCall called in invalid state:", callState);
          return;
        }

        try {
          if (meetingSession) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            meetingSession.audioVideo.stopLocalVideoTile();
            meetingSession.audioVideo.stopContentShare();
            meetingSession.audioVideo.stop();
          }
        } catch (e) {
          console.warn("Session stop error:", e);
        }

        try {
          await chatApi.leaveCall(conversationId);
        } catch (err) {
          // Backend already cleaned up (timeout, end call, etc.) — safe to ignore
          console.warn(
            "leaveCall API error (may already be ended):",
            err.message,
          );
        }

        get().enterEndingState("left");
      },

      endCallForEveryone: async () => {
        const { conversationId, meetingSession, callState } = get();

        if (!conversationId || callState === "idle" || callState === "ending") {
          console.warn("No active call to end");
          return;
        }

        try {
          if (meetingSession) {
            meetingSession.audioVideo.stopLocalVideoTile();
            meetingSession.audioVideo.stopContentShare();
            meetingSession.audioVideo.stop();
          }

          await chatApi.endCall(conversationId);
        } catch (e) {
          console.warn("End call error:", e.message);
        }

        get().enterEndingState("ended");
      },

      toggleMute: () => {
        const { meetingSession, isAudioMuted } = get();
        if (!meetingSession) return;

        if (isAudioMuted) {
          meetingSession.audioVideo.realtimeUnmuteLocalAudio();
        } else {
          meetingSession.audioVideo.realtimeMuteLocalAudio();
        }
        const currentUserId = getCurrentUserId();

        set((state) => ({
          isAudioMuted: !isAudioMuted,
          participants: state.participants.map((p) =>
            p.userId === currentUserId ? { ...p, isMuted: !isAudioMuted } : p,
          ),
        }));
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

      syncParticipantJoin: ({ attendeeId, userId, displayName }) => {
        set((state) => {
          const exists = state.participants.find((p) => p.userId === userId);
          if (exists) return state;

          return {
            participants: [
              ...state.participants,
              {
                attendeeId,
                userId,
                displayName: displayName || "User",
                isMuted: false,
                isVideoOff: true,
                isSpeaking: false,
              },
            ],
            attendeeIdToUserId: {
              ...state.attendeeIdToUserId,
              [attendeeId]: userId,
            },
            hadParticipants: true,
          };
        });
      },

      syncParticipantLeave: (attendeeId) => {
        set((state) => {
          const userId = state.attendeeIdToUserId[attendeeId];
          if (!userId) return state;

          return {
            participants: state.participants.filter((p) => p.userId !== userId),
            attendeeIdToUserId: Object.fromEntries(
              Object.entries(state.attendeeIdToUserId).filter(
                ([id]) => id !== attendeeId,
              ),
            ),
          };
        });
      },

      syncMuteState: (attendeeId, muted) => {
        const { attendeeIdToUserId } = get();
        const userId = attendeeIdToUserId[attendeeId];
        if (!userId) return;

        set((state) => ({
          participants: state.participants.map((p) =>
            p.userId === userId ? { ...p, isMuted: muted } : p,
          ),
        }));
      },

      syncActiveSpeaker: (attendeeId) => {
        const { attendeeIdToUserId } = get();
        const userId = attendeeIdToUserId[attendeeId];
        if (!userId) return;

        set((state) => ({
          activeSpeakerId: userId,
          participants: state.participants.map((p) => ({
            ...p,
            isSpeaking: p.userId === userId,
          })),
        }));

        if (activeSpeakerTimer) clearTimeout(activeSpeakerTimer);

        activeSpeakerTimer = setTimeout(() => {
          set((state) => ({
            participants: state.participants.map((p) => ({
              ...p,
              isSpeaking: false,
            })),
            activeSpeakerId: null,
          }));
        }, 1200);
      },

      startSession: async (meeting, attendee, conversationId) => {
        try {
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

          // map attendeeId -> userId
          const currentUserId = getCurrentUserId();

          set((state) => ({
            attendeeIdToUserId: {
              ...state.attendeeIdToUserId,
              [attendee.AttendeeId]: currentUserId,
            },
          }));

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
        } catch (err) {
          console.error("❌ startSession failed:", err);

          get().enterEndingState("error");

          throw err;
        }
      },

      attachObservers: (meetingSession, conversationId) => {
        meetingSession.audioVideo.addObserver({
          videoTileDidUpdate: (tileState) => {
            if (!tileState.boundAttendeeId) return;

            if (tileState.localTile) {
              set({ localTileId: tileState.tileId });
              return;
            }

            const tile = {
              tileId: tileState.tileId,
              boundExternalUserId: tileState.boundExternalUserId,
              isContent: tileState.isContent,
            };

            set((state) => ({
              remoteTiles: {
                ...state.remoteTiles,
                [tileState.tileId]: tile,
              },
            }));
          },

          videoTileWasRemoved: (tileId) => {
            const { localTileId } = get();
            if (tileId === localTileId) {
              set({ localTileId: null });
            } else {
              set((state) => {
                const updated = { ...state.remoteTiles };
                delete updated[tileId];

                return { remoteTiles: updated };
              });
            }
          },

          audioVideoDidStop: (sessionStatus) => {
            const code = sessionStatus.statusCode();
            const state = get();
            if (state.callState === "ending" || state.callState === "idle")
              return;
            if (
              code === MeetingSessionStatusCode.AudioCallEnded ||
              code === MeetingSessionStatusCode.MeetingEnded
            ) {
              get().enterEndingState("ended");
            }
            if (
              code ===
              MeetingSessionStatusCode.SignalingChannelClosedUnexpectedly
            )
              return;
          },

          contentShareDidStart: () => set({ isSharingScreen: true }),
          contentShareDidStop: () => set({ isSharingScreen: false }),
        });

        // Active speaker detector
        meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
          new DefaultActiveSpeakerPolicy(),
          (activeSpeakers) => {
            console.log("active speackers", activeSpeakers)
            get().syncActiveSpeaker(activeSpeakers[0]);
          },
        );

        meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
          (attendeeId, present, externalUserId) => {
            // Skip content-share ghost attendees
            if (attendeeId.includes("#content")) return;

            if (present) {
              // get().syncParticipantJoin({ attendeeId, userId: externalUserId });

              // Subscribe to this attendee's volume individually
              meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                attendeeId,
                (aId, volume, muted) => {
                  if (muted !== null) {
                    get().syncMuteState(aId, muted);
                  }
                  if (volume !== null && volume > 0.08 && muted === false) {
                    get().syncActiveSpeaker(aId);
                  }
                },
              );
            } else {
              // get().syncParticipantLeave(attendeeId);
              try {
                meetingSession.audioVideo.realtimeUnsubscribeFromVolumeIndicator(
                  attendeeId,
                );
              } catch (_) {
                /* already cleaned up */
              }
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
        if (activeSpeakerTimer) {
          clearTimeout(activeSpeakerTimer);
          activeSpeakerTimer = null;
        }
        set({
          callState: "idle",
          endReason: null,
          callType: null,
          conversationId: null,
          meetingSession: null,
          incomingCall: null,
          localTileId: null,
          remoteTiles: {},
          isAudioMuted: false,
          isVideoOff: false,
          isSharingScreen: false,
          activeSpeakerId: null,
          attendeeIdToUserId: {},
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

            // Ignore if not related to this conversation at all
            const isSameConversation =
              state.conversationId === conversationId ||
              state.incomingCall?.conversationId === conversationId;

            if (!isSameConversation) return;

            console.log("📴 call:ended received", { status, endedBy });

            // If already idle, ignore duplicate
            if (state.callState === "idle") return;

            let endReason = "ended";

            if (reason === "TIMEOUT" || status === "MISSED") {
              endReason = "missed";
            }

            if (status === "DECLINED") {
              endReason = "declined";
            }

            if (status === "ERROR" || reason === "ERROR") {
              endReason = "error";
            }

            // Always go through ending state
            get().enterEndingState(endReason);
          },
        );

        socket.on(
          "call:participant-joined",
          ({ userId, displayName, callType, attendeeId }) => {
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
              attendeeIdToUserId: {
                ...state.attendeeIdToUserId,
                [attendeeId]: userId,
              },
              hadParticipants: true,
            }));
          },
        );

        socket.on("call:participant-left", ({ userId }) => {
          set((state) => {
            const newParticipants = state.participants.filter(
              (p) => p.userId !== userId,
            );

            const newMap = { ...state.attendeeIdToUserId };
            Object.keys(newMap).forEach((attendeeId) => {
              if (newMap[attendeeId] === userId) {
                delete newMap[attendeeId];
              }
            });

            return {
              participants: newParticipants,
              attendeeIdToUserId: newMap,
            };
          });

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
