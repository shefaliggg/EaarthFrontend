import { useState, useEffect, useRef } from "react";
import { authApi } from "../api/auth.api";


export const useVerifyEmail = (onSuccess) => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [inviteData, setInviteData] = useState(null);
  const hasRun = useRef(false);


  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;


    const verifyFromUrl = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");


        if (!token || !email) {
          setStatus("error");
          setMessage("Invalid invitation link. Missing token or email.");
          return;
        }


        const response = await authApi.verifyInvitation(token, email);


        if (response?.success) {
          const payload = {
            email,
            userType: response.data?.userType,
            token,
          };


          setInviteData(payload);
          setStatus("success");
          setMessage("Invitation verified! Redirecting...");


          setTimeout(() => {
            onSuccess?.(payload);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(response?.message || "Verification failed. Please contact support.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error?.message || "An unexpected error occurred.");
      }
    };


    verifyFromUrl();
  }, [onSuccess]);


  return { status, message, inviteData };
};







