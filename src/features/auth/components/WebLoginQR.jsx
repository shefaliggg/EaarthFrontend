import { QrCode, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useQrLogin } from "../hooks/useQrLogin";
import { toast } from "sonner";

function WebLoginQR() {
  const { qrData, generateQr, loading, error } = useQrLogin({ type: "web" });
  const [secondsLeft, setSecondsLeft] = useState(60);
  const isDark = document.body.classList.contains("dark");

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
          description: "Please refresh to generate a new QR code.",
        });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrData]);

  const isExpired = secondsLeft === 0;

  return (
    <div className="rounded-3xl shadow-lg p-6 bg-card h-full flex flex-col items-center justify-center transition-colors">

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2 ">
          <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Mobile Login
          </h2>
        </div>
        <p className="text-xs text-muted-foreground px-10">
          SCAN WITH THE EAARTH MOBILE APP TO LOG IN INSTANTLY
        </p>
      </div>

      <div className="bg-background dark:bg-[#0d0d0d] rounded-2xl border-2 dark:border-neutral-950 p-8 shadow-sm relative">

        {isExpired && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10">
            <RotateCcw
              className="w-8 h-8 text-foreground cursor-pointer mb-2"
              onClick={() => {
                generateQr();
                setSecondsLeft(60);
              }}
            />
            <p className=" text-foreground text-xs font-semibold">Refresh QR</p>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 px-14 animate-pulse text-muted-foreground">
            <QrCode className="size-16" />
            <p className="text-xs">Generating...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-red-600 dark:text-red-500">
            <QrCode className="size-16" />
            <p className="text-xs">Error generating QR</p>
          </div>
        )}

        {qrData && qrData.socketRoom && (
          <div className="flex flex-col items-center">
            <QRCode
              value={qrData.socketRoom}
              level="H"
              fgColor={isDark ? "#FFFFFF" : "#000000"}
              bgColor={isDark ? "#0d0d0d" : "#FFFFFF"}
              style={{ width: "180px", height: "180px" }}
              className={isExpired ? "opacity-40" : ""}
            />
          </div>
        )}
      </div>

      {qrData && (
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
            {isExpired ? (
              <span className="text-red-500">QR Expired</span>
            ) : (
              <>Code Expires in {secondsLeft}s</>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Open Eaarth Studios mobile app
          </p>
        </div>
      )}
    </div>
  );
}

export default WebLoginQR;