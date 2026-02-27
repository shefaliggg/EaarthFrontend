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
import { axiosConfig } from "../../../auth/config/axiosConfig";
import { getChatSocket } from "../../../../shared/config/socketConfig";
import chatApi from "../api/chat.api";

// ─────────────────────────────────────────────────────────────
// CALL STATES
// "idle" | "incoming" | "connecting" | "connected" | "ended"
// ─────────────────────────────────────────────────────────────

const useCallStore = create(
  devtools(
    (set, get) => ({
      // ── State ──
      callState: "idle", // idle | incoming | connecting | connected | ended
      callType: null, // "VIDEO" | "AUDIO"
      conversationId: null,
      meetingSession: null,
      incomingCall: null, // { conversationId, callType, meetingId, initiatorId, initiatorName }

      // Participant tiles
      localTileId: null,
      remoteTiles: [], // [{ tileId, boundExternalUserId, isContent }]

      // Controls
      isAudioMuted: false,
      isVideoOff: false,
      isSharingScreen: false,
      activeSpeakerId: null,

      // Participants list (for UI)
      participants: [], // [{ userId, displayName, isMuted, isVideoOff }]

      // ── Incoming call from socket ──
      setIncomingCall: (data) =>
        set({ incomingCall: data, callState: "incoming" }),
      clearIncomingCall: () => set({ incomingCall: null }),

      // ── INITIATE call (caller side) ──
      initiateCall: async (conversationId, callType = "VIDEO") => {
        set({ callState: "connecting", callType, conversationId });
        try {
          const data = await chatApi.initiateCall(conversationId, callType);
          const { meeting, attendee } = data;
          await get().startSession(meeting, attendee, conversationId);
        } catch (err) {
          console.error("❌ initiateCall failed:", err);
          set({ callState: "idle", callType: null, conversationId: null });
          throw err;
        }
      },

      // ── JOIN call (callee side) ──
      joinCall: async (conversationId) => {
        set({ callState: "connecting", conversationId });
        try {
          const data = await chatApi.joinCall(conversationId);
          const { meeting, attendee } = data;
          const callType = get().incomingCall?.callType || "VIDEO";
          set({ callType });
          await get().startSession(meeting, attendee, conversationId);
          get().clearIncomingCall();
        } catch (err) {
          console.error("❌ joinCall failed:", err);
          set({ callState: "idle" });
          throw err;
        }
      },

      // ── DECLINE incoming call ──
      declineCall: () => {
        set({ incomingCall: null, callState: "idle" });
      },

      // ── LEAVE call (just this participant) ──
      leaveCall: async () => {
        const { conversationId, meetingSession } = get();

        try {
          if (meetingSession) {
            await meetingSession.audioVideo.stopLocalVideoTile();
            await meetingSession.audioVideo.stopContentShare();
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
            await meetingSession.audioVideo.stopLocalVideoTile();
            await meetingSession.audioVideo.stopContentShare();
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

      // ── TOGGLE MUTE ──
      toggleMute: async () => {
        const { meetingSession, isAudioMuted } = get();
        if (!meetingSession) return;

        if (isAudioMuted) {
          await meetingSession.audioVideo.realtimeUnmuteLocalAudio();
        } else {
          meetingSession.audioVideo.realtimeMuteLocalAudio();
        }
        set({ isAudioMuted: !isAudioMuted });
      },

      // ── TOGGLE VIDEO ──
      toggleVideo: async () => {
        const { meetingSession, isVideoOff } = get();
        if (!meetingSession) return;

        if (isVideoOff) {
          const videoInputDevices =
            await meetingSession.audioVideo.listVideoInputDevices();
          if (videoInputDevices.length > 0) {
            await meetingSession.audioVideo.startVideoInput(
              videoInputDevices[0].deviceId,
            );
          }
          meetingSession.audioVideo.startLocalVideoTile();
        } else {
          await meetingSession.audioVideo.stopVideoInput();
          meetingSession.audioVideo.stopLocalVideoTile();
        }
        set({ isVideoOff: !isVideoOff });
      },

      // ── SCREEN SHARE ──
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

      // ── INTERNAL: bootstrap Chime session ──
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

        // ── Bind audio to a hidden <audio> element ──
        const audioEl = document.getElementById("chime-audio-sink");
        if (audioEl) {
          await meetingSession.audioVideo.bindAudioElement(audioEl);
        }

        // ── Select default devices ──
        const audioInputDevices =
          await meetingSession.audioVideo.listAudioInputDevices();
        if (audioInputDevices.length > 0) {
          await meetingSession.audioVideo.startAudioInput(
            audioInputDevices[0].deviceId,
          );
        }

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

        // ── Attach observers ──
        get().attachObservers(meetingSession, conversationId);

        // ── Start the session ──
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
        // Video tile observers
        meetingSession.audioVideo.addObserver({
          videoTileDidUpdate: (tileState) => {
            if (!tileState.boundAttendeeId) return;

            if (tileState.localTile) {
              set({ localTileId: tileState.tileId });
            } else {
              set((state) => {
                const existing = state.remoteTiles.find(
                  (t) => t.tileId === tileState.tileId,
                );
                if (existing) return state;
                return {
                  remoteTiles: [
                    ...state.remoteTiles,
                    {
                      tileId: tileState.tileId,
                      boundExternalUserId: tileState.boundExternalUserId,
                      isContent: tileState.isContent,
                    },
                  ],
                };
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

          // Session ended externally (host ended call)
          audioVideoDidStop: (sessionStatus) => {
            console.log("Call stopped externally:", sessionStatus.statusCode());
            get().resetCallState();
          },

          contentShareDidStart: () => {
            set({ isSharingScreen: true });
          },

          contentShareDidStop: () => {
            set({ isSharingScreen: false });
          },
        });

        // Active speaker
        const activeSpeakerPolicy = new DefaultActiveSpeakerPolicy();

        meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
          activeSpeakerPolicy,
          (activeSpeakers) => {
            if (activeSpeakers.length > 0) {
              set({ activeSpeakerId: activeSpeakers[0] });
            }
          },
        );
      },

      // ── INTERNAL: bind a video tile to a DOM element ──
      bindVideoTile: (tileId, videoElement) => {
        const { meetingSession } = get();
        if (!meetingSession || !videoElement) return;
        meetingSession.audioVideo.bindVideoElement(tileId, videoElement);
      },

      unbindVideoTile: (tileId) => {
        const { meetingSession } = get();
        if (!meetingSession) return;
        meetingSession.audioVideo.unbindVideoElement(tileId);
      },

      // ── INTERNAL: reset all call state ──
      resetCallState: () => {
        set({
          callState: "idle",
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
        });
      },

      // ── Socket listeners for call events ──
      attachCallSocketListeners: () => {
        const socket = getChatSocket();
        if (!socket) return;

        socket.on("call:incoming", (data) => {
          const { callState } = get();
          // Don't show incoming toast if already in a call
          if (callState !== "idle") return;
          get().setIncomingCall(data);
        });

        socket.on("call:ended", ({ conversationId }) => {
          const state = get();
          if (
            state.conversationId === conversationId &&
            state.callState !== "idle"
          ) {
            // Server ended the call
            state.meetingSession?.audioVideo.stop();
            get().resetCallState();
          }
        });

        socket.on("call:participant-joined", ({ userId, displayName }) => {
          set((state) => ({
            participants: [
              ...state.participants.filter((p) => p.userId !== userId),
              { userId, displayName, isMuted: false, isVideoOff: false },
            ],
          }));
        });

        socket.on("call:participant-left", ({ userId }) => {
          set((state) => ({
            participants: state.participants.filter((p) => p.userId !== userId),
          }));
        });
      },
    }),
    { name: "CallStore" },
  ),
);

export default useCallStore;
