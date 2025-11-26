import { Film, QrCode, Shield, Zap, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useQrLogin } from "../hooks/useQrLogin";
import { toast } from "sonner";

function WebLoginQR() {
  const { qrData, generateQr, loading } = useQrLogin({ type: "web" });
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    generateQr();
  }, []);

  useEffect(() => {
    if (!qrData?.expiresAt) return;

    const end = new Date(qrData.expiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      setSecondsLeft(diff);

      if (diff === 0) {
        toast.error("QR Code Expired", {
          description: "The QR code is no longer valid. Please refresh to generate a new one.",
        });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrData]);


  const isExpired = secondsLeft === 0;
  return (
    <div className="rounded-3xl shadow-lg border p-6 relative overflow-hidden">

      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <QrCode className="w-8 h-8 text-purple-900" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-purple-900">QR CODE LOGIN</h2>
          <p className="text-gray-800 text-sm">Scan with your mobile app</p>
        </div>
      </div>

      {/* QR Code Box */}
      <div className={`bg-white rounded-3xl p-12 pb-6 m-10 flex flex-col items-center justify-center shadow-md relative`}>

        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-10">
            <RotateCcw
              className="w-10 h-10 text-purple-900 cursor-pointer mb-2"
              onClick={() => {
                generateQr();
                setSecondsLeft(60);
              }}
            />
            <p className="text-sm font-semibold text-purple-900">Refresh QR</p>
          </div>
        )}

        {loading && <div className="flex flex-col p-18 items-center justify-center gap-4 text-purple-900 text-sm font-medium animate-pulse">
          <QrCode className="size-20 " /> Generating QR Code
        </div>}

        {/* QR Code */}
        {qrData && (
          <QRCode
            value={qrData.socketRoom}
            level="H"
            fgColor="#7C3AED"
            className={`${isExpired ? "opacity-40" : ""} w-full`}
          />
        )}

        {qrData && (
          <p className="text-center text-sm font-medium mt-6 text-purple-900">
            {isExpired ? (
              <span className="text-red-600 font-semibold">QR Expired</span>
            ) : (
              <>Expires in: <span className="font-bold">{secondsLeft}s</span></>
            )}
          </p>
        )}
      </div>

      {/* How-To Steps */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm mb-3 text-purple-900">How to use:</h3>

        {[
          "Open Eaarth Studios mobile app",
          "Tap the QR Login button",
          "Scan this code with your camera",
          "You'll be logged in instantly!",
        ].map((t, i) => (
          <div className="flex items-center gap-3" key={i}>
            <div className="w-8 h-8 rounded-md bg-purple-900/20 flex items-center justify-center text-purple-900 text-xs font-medium">
              {i + 1}
            </div>
            <p className="text-xs text-gray-800">{t}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="mt-8 pt-6 border-t border-purple-900/20">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Shield, text: "SECURE" },
            { icon: Zap, text: "INSTANT" },
            { icon: Film, text: "EASY" },
          ].map(({ icon: Icon, text }) => (
            <div className="text-center" key={text}>
              <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-900" />
              </div>
              <p className="text-[10px] font-medium text-purple-900">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WebLoginQR;
