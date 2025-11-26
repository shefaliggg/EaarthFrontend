import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useQrLogin({ type = "web" }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const pollRef = useRef(null);

  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const isDevelopment = import.meta.env.VITE_APP_ENV === "development";

  const baseURL = isDevelopment
    ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
    : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;

  const qrGenerateMethod =
    type === "web" ? authService.generateWebQr : authService.generateMobileQr;

  const handleQrApproval = useCallback(
    async (tokenData) => {
      try {
        const newUser = await authService.getUserAndSetCookies(tokenData);
        updateUser(newUser);

        setQrData((prev) => ({ ...prev, status: "approved" }));
        toast.success("Login Successful", {
          description: "QR verified. Redirecting...",
        });

        navigate("/home");
      } catch (err) {
        setError(err.message);
      }
    },
    [updateUser, navigate]
  );

  // fallback
  const startPolling = useCallback(
    (qrId) => {
      if (pollRef.current) return; // prevent duplicate polling

      console.log("⚠️ Starting fallback polling...");

      pollRef.current = setInterval(async () => {
        try {
          const status = await authService.getQrStatus(qrId);
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
          console.log("Polling error:", err);
        }
      }, 4000);
    },
    [handleQrApproval]
  );

  const generateQr = useCallback(async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setLoading(true);
    setError(null);
    setQrData(null);

    try {
      const data = await qrGenerateMethod();
      console.log("QR response:", data);

      setQrData({
        qrId: data.qrId,
        expiresAt: data.expiresAt,
        socketRoom: data.socketRoom,
        status: "pending",
      });

      const socket = io(baseURL, {
        transports: ["websocket"],
        path: "/socket.io/",
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("🔥 Socket connected:", socket.id);
        socket.emit("join-qr", data.socketRoom);
      });

      socket.on("connect_error", (err) => {
        console.log("❌ Socket connect error:", err);
        startPolling(data.qrId);
      });

      socket.on("disconnect", () => {
        console.log("⚠️ Socket disconnected");
        startPolling(data.qrId);
      });

      if (type === "web") {
        socket.on("qr:approved", (tokenData) => {
          console.log("QR approved via socket");
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          handleQrApproval(tokenData);
        });
      }

      if (type === "mobile") {
        socket.on("qr:mobile-approved", (tokenData) => {
          toast.success("Login Synced", {
            description:
              "Your mobile device successfully logged into your web account.",
          });
        });
      }
      setLoading(false);
      return data;
    } catch (err) {
      console.log("QR Error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [qrGenerateMethod, type, startPolling, handleQrApproval, baseURL]);

  // cleanup
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }

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
