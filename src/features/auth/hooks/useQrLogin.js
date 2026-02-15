import { useState, useEffect, useCallback, useRef } from "react";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { initPublicSocket } from "../../../shared/config/socketConfig";

export function useQrLogin({ type = "web" }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollRef = useRef(null);

  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const qrGenerateMethod =
    type === "web" ? authService.generateWebQr : authService.generateMobileQr;

  /**
   * Handle QR approval from socket or polling
   */
  const handleQrApproval = useCallback(
    async (tokenData) => {
      try {
        // tokenData must include accessToken, refreshToken, userId
        const newUser = await authService.getUserAndSetCookies(tokenData);
        updateUser(newUser);
        initSocket(newUser._id); // upgrades same system to auth mode

        setQrData((prev) => ({ ...prev, status: "approved" }));
        toast.success("Login Successful", {
          description: "QR verified. Redirecting...",
        });

        navigate("/home");
      } catch (err) {
        console.error("QR approval failed:", err);
        setError(err.message || "Failed to approve QR login");
        toast.error(err.message || "Failed to approve QR login");
      }
    },
    [updateUser, navigate],
  );

  /**
   * Fallback polling if socket fails
   */
  const startPolling = useCallback(
    (qrId) => {
      if (pollRef.current) return;

      console.log("⚠️ Starting fallback polling for QR:", qrId);

      pollRef.current = setInterval(async () => {
        try {
          const status = await authService.getQrStatus(qrId);

          if (!status) return;

          console.log("📡 Polling result:", status);

          if (status.status === "approved") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            handleQrApproval(status);
          }

          if (status.status === "expired") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            toast.error("QR Code Expired");
            setQrData((prev) => ({ ...prev, status: "expired" }));
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 4000);
    },
    [handleQrApproval],
  );

  /**
   * Generate QR (web or mobile)
   */
  const generateQr = useCallback(async () => {
    // Cleanup previous connections
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    setLoading(true);
    setError(null);
    setQrData(null);

    try {
      const data = await qrGenerateMethod();

      if (!data.qrId) throw new Error("Invalid QR data returned from server");

      setQrData({
        qrId: data.qrId,
        expiresAt: data.expiresAt,
        socketRoom: data.socketRoom,
        status: "pending",
      });

      // Initialize socket
      const socket = initPublicSocket();
      socket.emit("join-qr", data.socketRoom);

      socket.on("connect_error", (err) => {
        console.warn("❌ Socket connection error:", err.message);
        startPolling(data.qrId);
      });

      socket.on("disconnect", () => {
        console.warn("⚠️ Socket disconnected, fallback to polling");
        startPolling(data.qrId);
      });

      // Web QR approval event
      if (type === "web") {
        socket.on("qr:approved", (tokenData) => {
          console.log("✅ QR approved via socket:", tokenData);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          handleQrApproval(tokenData);
        });
      }

      // Mobile QR sync event
      if (type === "mobile") {
        socket.on("qr:mobile-approved", () => {
          toast.success("Login Synced", {
            description: "Mobile device successfully logged into web account",
          });
        });
      }

      setLoading(false);
      return data;
    } catch (err) {
      console.error("QR generation error:", err);
      const message =
        err.response?.data?.message || err.message || "Failed to generate QR";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }, [qrGenerateMethod, type, startPolling, handleQrApproval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        console.log("🧹 Clearing polling interval...");
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  return {
    qrData,
    loading,
    error,
    generateQr,
  };
}
