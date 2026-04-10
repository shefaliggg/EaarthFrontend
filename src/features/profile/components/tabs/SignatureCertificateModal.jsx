import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Eye,
  ZoomIn,
  ZoomOut,
  Download,
  X,
  Shield,
  CheckCircle,
  Calendar,
  User,
  Fingerprint,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

function SignatureCertificateModal({
  profile,
  signatureImage,
  open,
  onOpenChange,
}) {
  const certificateId = "SIG-" + Date.now();

  // Platform-specific dates
  const signedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verifiedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    handleReset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-screen! h-screen p-0 bg-transparent border-0 shadow-none overflow-hidden rounded-none">
        <div className="relative w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Controls Bar */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-50 bg-black/60 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/10 shadow-lg">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-white/80 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/80 min-w-[48px] text-center font-mono">
              {zoomPercentage}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-white/80 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/80 hover:text-white"
            >
              Reset
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 z-50 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <button className="absolute top-6 right-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 z-50 border border-white/10">
            <Download className="w-5 h-5" />
          </button>

          {/* Certificate Preview Container */}
          <div
            className="w-full h-full flex items-center justify-center overflow-y-auto"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              onMouseDown={handleMouseDown}
              className={`transition-transform duration-200 ease-out py-12 ${
                zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {/* A4 Aspect Ratio Certificate (1/√2 ≈ 0.707) */}
              <div className="w-[800px] h-[1131px] bg-white relative shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                {/* Decorative Top Bar */}
                <div className="h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />

                <div className="flex-1 p-10 relative">
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 opacity-[0.1] pointer-events-none flex items-center justify-center">
                    <div className="text-center text-primary/40 text-7xl font-semibold tracking-widest">
                      VERIFIED
                      <br />
                      SIGNATURE
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="text-center mb-8 relative">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                      Signature Certificate
                    </h1>
                    <p className="text-gray-500 text-xs mt-1 tracking-wide">
                      Official Digital Signature Record
                    </p>
                  </div>

                  {/* Certificate ID Row */}
                  <div className="flex justify-between items-center text-xs text-gray-400 font-mono border-b border-gray-100 pb-2 mb-5">
                    <span>
                      Certificate ID:{" "}
                      <span className="font-semibold text-gray-600">
                        {certificateId}
                      </span>
                    </span>
                    <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Signature Status: ACTIVE
                    </span>
                  </div>

                  {/* Signature Owner Section */}
                  <div className="mb-8">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                      Signature Owner
                    </p>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Name Row */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                          Full Name
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {profile?.name || "NICHOLAS PERRY"}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-3 border-r border-gray-100">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                            Email Address
                          </p>
                          <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                            {profile?.email || "nicholas.perry@example.com"}
                          </p>
                        </div>

                        <div className="px-4 py-3">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                            Location
                          </p>
                          <p className="text-sm font-medium text-gray-800 mt-1">
                            {profile?.location || "United Kingdom"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signature Display - Large and Prominent */}
                  <div className="mb-8">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Registered Signature
                    </p>
                    <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 bg-gray-50/50 flex items-center justify-center min-h-[180px]">
                      {signatureImage ? (
                        <img
                          src={signatureImage}
                          alt="Digital Signature"
                          className="max-h-48 object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <Fingerprint className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                          <span className="text-gray-400 text-sm">
                            Signature Preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platform Dates Section */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      Certificate Timeline
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                        <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-[11px] text-gray-400 uppercase">
                          Signed Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {signedDate}
                        </p>
                      </div>
                      <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-[11px] text-gray-400 uppercase">
                          Verified (Email OTP)
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {verifiedDate}
                        </p>
                      </div>
                      <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                        <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-[11px] text-gray-400 uppercase">
                          Activated Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {activatedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Grid */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">User ID</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          {profile?.id || "USR-" + certificateId.slice(-6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Signature Type</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          Secure Digital Signature
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">
                          Verification Method
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          Email OTP Authenticated
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs"> Verification Status</p>
                        <p className="font-semibold text-green-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          VERIFIED
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-10 pt-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        This certificate is electronically generated and serves
                        as official proof of digital signature registration. The
                        signature has been verified through email OTP
                        authentication and is legally binding.
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-[10px] text-gray-400">
                            Authorized By
                          </p>
                          <div className="w-32 h-px bg-gray-300 mt-1" />
                          <p className="text-xs font-medium text-gray-700 mt-1">
                            System Authority
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Issued By</p>
                          <p className="text-sm font-semibold text-primary">
                            Eaarth
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignatureCertificateModal;
