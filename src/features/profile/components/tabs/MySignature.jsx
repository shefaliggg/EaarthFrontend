import React, { useEffect, useRef, useState } from "react";
import {
  PenTool,
  Download,
  Trash2,
  Check,
  Fingerprint,
  Calendar,
  User,
  Eye,
  History,
  RotateCcw,
} from "lucide-react";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import SignaturePad from "../../../crew/components/SignaturePad/SignaturePad";
import {
  convertTitleToUrl,
  convertToPrettyText,
  formatDate,
  getFullName,
} from "../../../../shared/config/utils";
import { Button } from "../../../../shared/components/ui/button";
import SignatureCertificateModal from "./SignatureCertificateModal";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentsByType } from "../../../user-documents/store/document.selector";
import SignatureOtpModal from "./my-signature/SignatureOtpModal";
import {
  createSignatureThunk,
  fetchCurrentSignatureThunk,
  sendSignatureOtpThunk,
} from "../../../signature/store/signature.thunk";
import { Skeleton } from "../../../../shared/components/ui/skeleton";
import { StatusBadge } from "../../../../shared/components/badges/StatusBadge";
import { toast } from "sonner";

export default function MySignature() {
  const { crewProfile } = useSelector((state) => state.crewProfile);
  const { currentUser } = useSelector((state) => state.user);
  // const { userDocuments } = useSelector((state) => state.userDocuments);
  const { currentSignature, isFetching, isCreating } = useSelector(
    (state) => state.signature,
  );

  console.log("current signature:", currentSignature);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const padRef = useRef();

  const signatureImage = currentSignature?.signatureUrl;
  // const signatureDocuments = getDocumentsByType(userDocuments, "SIGNATURE");
  // const signatureCertificateDocuments = getDocumentsByType(
  //   userDocuments,
  //   "SIGNATURE_CERTIFICATE",
  // );

  useEffect(() => {
    dispatch(fetchCurrentSignatureThunk());
  }, []);

  function base64ToFile(base64, filename = "signature.png") {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const handleSave = async () => {
    const data = await padRef.current?.getData();
    if (!data?.data) return;
    console.log("Signature data to save:", data);
    const file = base64ToFile(data.data,"signature.png");

    const formData = new FormData();
    formData.append("signature", file);
    formData.append("signatureType", data.type.toUpperCase());

    if (data.type === "typed") {
      formData.append("typedText", data.text || "");
      formData.append("fontFamily", data.font || "");
    }

    const res = await dispatch(createSignatureThunk(formData));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Signature created successfully", {
        description: "Your digital signature has been securely saved.",
      });
      toast.info("Verification process Initiated", {
        description:
          "We are sending a secure OTP to your registered email and preparing your certificate generation pipeline.",
      });
      const otpRes = await dispatch(sendSignatureOtpThunk());

      // 👇 DEV MODE ONLY
      const otpFromBackend = otpRes.payload?.otp;
      if (otpFromBackend) {
        console.log("🧪 DEV OTP (initial):", otpFromBackend);
        setDevOtp(otpFromBackend);
      }

      setShowOtpModal(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const downloadSignature = async () => {
    if (!signatureImage) return;

    try {
      const response = await fetch(signatureImage, {
        method: "GET",
      });

      console.log("status:", response.status);
      console.log("content-type:", response.headers.get("content-type"));
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);

      // const link = document.createElement("a");
      // link.href = url;
      // link.download = `${convertTitleToUrl(getFullName(currentUser))}-signature.png`;

      // document.body.appendChild(link);
      // link.click();

      // link.remove();
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download signature");
    }
  };

  if (isFetching) {
    return (
      <CardWrapper
        title={"My Signature"}
        icon={"PenTool"}
        actions={
          <div className="flex gap-2">
            <Skeleton className="h-8 w-30 rounded-md" />
            <Skeleton className="h-8 w-30 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        }
      >
        <div className="space-y-6">
          {/* Signature Card Skeleton */}
          <div className="rounded-2xl bg-card border border-gray-200 overflow-hidden shadow-sm mt-4">
            {/* Signature Image Area */}
            <div className="p-6 pt-12 pb-8 flex justify-center items-center min-h-[180px]">
              <div className="w-full max-w-[320px] flex justify-center">
                <Skeleton className="w-full h-32 rounded-md" />
              </div>
            </div>

            {/* Signature Footer */}
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between text-xs">
                {/* Left Side (Calendar + User) */}
                <div className="flex items-center gap-4">
                  {/* Calendar row */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                    <Skeleton className="h-3 w-28" />
                  </div>

                  {/* User row */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {/* Active status */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-1.5 h-1.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>

                  {/* Verified */}
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <>
      <CardWrapper
        title={"My Signature"}
        icon={"PenTool"}
        actions={
          <>
            {signatureImage && !isEditing && (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => setIsCertificateOpen(true)}
                >
                  <Eye />
                  <span className="text-sm font-medium">View Certificate</span>
                </Button>
                <Button onClick={downloadSignature} variant={"outline"}>
                  <Download />
                  <span className="text-sm font-medium">
                    Download Signature
                  </span>
                </Button>
              </>
            )}
            {currentSignature?.verificationStatus === "PENDING" && (
              <Button
                variant="default"
                onClick={() => {
                  dispatch(sendSignatureOtpThunk());
                  setShowOtpModal(true);
                }}
              >
                <RotateCcw />
                Retry Signature Verification
              </Button>
            )}
            <EditToggleButtons
              isEditing={isEditing}
              isLoading={isCreating}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </>
        }
      >
        <div className="space-y-4">
          {/* Canvas for drawing signature */}
          {isEditing ? (
            <SignaturePad
              ref={padRef}
              onSave={handleSave}
              onCancel={handleCancel}
              showActions={false}
            />
          ) : (
            <>
              {signatureImage ? (
                <>
                  <div className="space-y-6">
                    {/* Signature Card */}
                    <div className="rounded-2xl bg-card border border-gray-200 overflow-hidden shadow-sm mt-4">
                      <div className="text-muted-foreground/70 text-sm p-3 px-6 flex items-center justify-end gap-2">
                        <History className="size-4" />
                        Version {currentSignature?.version}
                      </div>
                      {/* Signature Image */}
                      <div className="p-6 py-8 flex justify-center items-center min-h-[200px]">
                        <div className="relative group">
                          <img
                            src={signatureImage}
                            alt="Your signature"
                            className="w-full max-h-32 object-contain relative z-10"
                          />
                        </div>
                      </div>

                      {/* Signature Footer */}
                      <div className="px-5 pb-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-500">
                                Added on{" "}
                                {formatDate(currentSignature?.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-500">
                                Digitally signed
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-gray-400">
                                Currently{" "}
                                {convertToPrettyText(currentSignature?.status)}
                              </span>
                            </div>
                            <StatusBadge
                              label={currentSignature?.verificationStatus}
                              status={
                                currentSignature?.verificationStatus ===
                                "VERIFIED"
                                  ? "highlight"
                                  : "pending"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SignatureCertificateModal
                    crewProfile={crewProfile}
                    open={isCertificateOpen}
                    onOpenChange={setIsCertificateOpen}
                    signatureImage={signatureImage}
                  />
                </>
              ) : (
                /* Empty State - Premium Design */
                <div className="relative overflow-hidden">
                  {/* Content */}
                  <div className="relative rounded-2xl p-10 pt-4 text-center backdrop-blur-sm">
                    <div className="relative z-10">
                      {/* Animated Icon Container */}
                      <div className="relative inline-block mb-4">
                        <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-purple-50 to-white rounded-full flex items-center justify-center border border-purple-100">
                          <PenTool className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Signature Added Yet
                      </h4>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                        Add your digital signature to quickly sign documents,
                        contracts, and forms with just one click.
                      </p>

                      {/* Benefits List */}
                      <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                          <span>Legally binding</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                          <span>Secure & encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                          <span>Instant access</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-sm transition-all duration-200 group"
                      >
                        <PenTool className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium">
                          Add Your Signature
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardWrapper>
      {showOtpModal && (
        <SignatureOtpModal
          open={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          devOtp={devOtp}
          setDevOtp={setDevOtp}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
}
