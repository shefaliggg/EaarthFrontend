import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifySignatureOtpThunk,
  sendSignatureOtpThunk,
} from "@/features/signature/store/signature.thunk";
import { Loader } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import { toast } from "sonner";

export default function SignatureOtpModal({
  open,
  onClose,
  devOtp,
  setDevOtp,
  setIsEditing,
}) {
  const dispatch = useDispatch();

  const { isVerifying } = useSelector((s) => s.signature);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!open) return;

    setOtp("");
    setTimer(30);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const handleVerify = async () => {
    console.log("📡 verifySignatureOtpThunk called", { otp });

    const res = await dispatch(verifySignatureOtpThunk({ otp }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Signature verified & activated", {
        description: "Your identity signature has been successfully verified.",
      });
      toast.success("Digital Certificate Generated", {
        description:
          " A digital certificate has been generated and linked to your profile.",
      });
      onClose();
      setIsEditing(false);
    } else {
      console.error("❌ OTP Verify Error:", res.payload);
      toast.error(res.payload?.message || "Invalid OTP. Try again.");
    }
  };

  const resendOtp = async () => {
    const res = await dispatch(sendSignatureOtpThunk());

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("OTP resent successfully 📩");
      setTimer(30);

      // 👇 DEV MODE ONLY
      if (process.env.NODE_ENV === "development") {
        const otpFromBackend = res.payload?.otp;
        if (otpFromBackend) {
          console.log("🧪 DEV OTP:", otpFromBackend);
          setDevOtp(otpFromBackend);
        }
      }
    } else {
      console.error("❌ Resend OTP Error:", res.payload);
      toast.error(res.payload?.message || "Failed to resend OTP");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Verify Signature
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Enter the 6-digit OTP sent to your email
        </p>

        {/* 🧪 DEV OTP DISPLAY */}
        {devOtp && (
          <div className="mb-3 text-center text-xs text-purple-600 font-mono bg-purple-50 p-2 rounded">
            DEV OTP: {devOtp}
          </div>
        )}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full text-center tracking-[0.5em] text-lg border rounded-xl py-3 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="------"
        />

        {/* Timer / Resend */}
        <div className="text-xs text-gray-500 mt-3 text-center">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={resendOtp}
              className="text-purple-600 font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={isVerifying || otp.length !== 6}
          className="w-full mt-6 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition"
        >
          {isVerifying ? (
            <>
              <Loader className="size-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Activate"
          )}
        </Button>
      </div>
    </div>
  );
}
