import { useState, useEffect, useRef } from "react";
import { authService } from "../services/auth.service";

export const useVerifyEmail = (onSuccess) => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [inviteData, setInviteData] = useState(null);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyInvite = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        // 🔍 Validate URL params
        if (!token || !email) {
          setStatus("error");
          setMessage("Invalid invitation link. Token or email is missing.");
          return;
        }

        // 🔥 API Call
        const response = await authService.verifyInviteLink(token, email);

        if (!response || !response.success) {
          setStatus("error");
          setMessage(response?.message || "Failed to verify invitation.");
          return;
        }

        // 🎯 Prepare structured payload
        const data = response.data || {};
        const payload = {
          email: data.email,
          userType: data.userType,
          organizationId: data.organizationId,
          organizationType: data.organizationType,
          isLinkVerified: data.isLinkVerified,
          firstLogin: data.firstLogin,
        };

        setInviteData(payload);
        setStatus("success");
        setMessage("Invitation verified! Redirecting...");

        // ⏳ Delay redirect for UI feedback
        setTimeout(() => {
          onSuccess?.(payload);
        }, 1500);
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || err.message || "Something went wrong.");
      }
    };

    verifyInvite();
  }, [onSuccess]);

  return { status, message, inviteData };
};
