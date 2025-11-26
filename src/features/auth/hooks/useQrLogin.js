import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useQrLogin({ type = "web" }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const { updateUser } = useAuth();

  const isDevelopment = import.meta.env.VITE_APP_ENV === "development";

  const baseURL = isDevelopment
    ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
    : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;

  // --- Pick correct API based on type ---
  const qrGenerateMethod =
    type === "web" ? authService.generateWebQr : authService.generateMobileQr;

  const generateQr = useCallback(async () => {
    setQrData(null)
    setLoading(true);
    setError(null);

    try {
      const data = await qrGenerateMethod();
      console.log("QR response:", data);

      setQrData({
        qrId: data.qrId,
        expiresAt: data.expiresAt,
        socketRoom: data.socketRoom,
        status: "pending",
      });
      console.log("baseURL", baseURL);

      const socketInstance = io(baseURL, {
        transports: ["websocket"],
        path: "/socket.io/",
        withCredentials: true,
      });
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("🔥 Socket connected:", socketInstance.id);
        socketInstance.emit("join-qr", data.socketRoom);
      });

      socketInstance.on("connect_error", (err) => {
        console.log("❌ Socket connect error:", err);
      });

      if (type === "web") {
        socketInstance.on("qr:approved", async (tokenData) => {
          try {
            const newUser = await authService.getUserAndSetCookies(tokenData);
            updateUser(newUser);

            setQrData((prev) => ({ ...prev, status: "approved" }));
            toast.success("Login Successful", {
              description:
                "Your mobile device has approved the login. Redirecting...",
            });

            navigate("/home");
          } catch (err) {
            setError(err.message);
          }
        });
      }

      if (type === "mobile") {
        toast.success("Login Synced", {
          description:
            "Your mobile device successfully logged into your web account.",
        });
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [qrGenerateMethod, type, updateUser, navigate]);

  // Cleanup socket
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return {
    qrData,
    loading,
    error,
    generateQr,
  };
}
