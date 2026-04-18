import React, { useEffect, useRef, useState } from "react";
import {
  PenTool,
  Download,
  Check,
  Calendar,
  User,
  Eye,
  History,
  RotateCcw,
  ShieldCheck,
  Info,
  TriangleAlert,
} from "lucide-react";
import CardWrapper from "../../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../../shared/components/buttons/EditToggleButtons";
import SignaturePad from "../../../../crew/components/SignaturePad/SignaturePad";
import {
  convertToPrettyText,
  formatDate,
} from "../../../../../shared/config/utils";
import { Button } from "../../../../../shared/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import SignatureOtpModal from "./SignatureOtpModal";
import {
  createSignatureThunk,
  fetchCurrentSignatureThunk,
  sendSignatureOtpThunk,
} from "../../../../signature/store/signature.thunk";
import { StatusBadge } from "../../../../../shared/components/badges/StatusBadge";
import { toast } from "sonner";
import SignatureLoadingSkelton from "../../skeltons/SignatureLoadingSkelton";
import DocumentPreviewDialog from "../../../../../shared/components/modals/DocumentPreviewDialog";
import { signatureReplaceConfig } from "../../../../../shared/config/ConfirmActionsConfig";
import ConfirmActionDialog from "../../../../../shared/components/modals/ConfirmActionDialog";
import { downloadFileFromUrl } from "../../../../../shared/config/downloadFile";
import SignatureHistoryDialog from "./SignatureHistoryDialog";
import { InfoTooltip } from "../../../../../shared/components/InfoTooltip";

export default function MySignature() {
  const { currentSignature, isFetching, isCreating } = useSelector(
    (state) => state.signature,
  );

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [isChangingSignature, setIsChangingSignature] = useState(false);
  const [changeMeta, setChangeMeta] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  console.log("current signature:", currentSignature);
  console.log("preview doc:", previewDoc);

  const handleEditClick = () => {
    if (currentSignature?.status === "ACTIVE") {
      setShowReplaceDialog(true);
      setIsChangingSignature(true);
    } else {
      setIsEditing(true);
    }
  };

  const padRef = useRef();

  const signatureImage = currentSignature?.signatureUrl;

  useEffect(() => {
    if (!currentSignature) {
      dispatch(fetchCurrentSignatureThunk());
    }
  }, []);

  useEffect(() => {
    if (currentSignature) {
      setPreviewDoc({
        url: currentSignature?.certificateUrl,
        name: currentSignature?.certificateDocumentId?.originalName,
        status: currentSignature?.status,
      });
    }
  }, [currentSignature]);

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
    console.log("changing meta", changeMeta);
    if (isChangingSignature) {
      if (!changeMeta?.changeReasonText || !changeMeta?.changeReasonType) {
        toast.warning(
          "Please provide reason and describe it for changing your signature",
        );
        return;
      }
    }
    console.log("Signature data to save:", data);
    const file = base64ToFile(data.data, "signature.png");

    const formData = new FormData();
    formData.append("signature", file);
    formData.append("signatureType", data.type.toUpperCase());

    if (data.type === "typed") {
      formData.append("typedText", data.text || "");
      formData.append("fontFamily", data.font || "");
    }

    if (isChangingSignature && changeMeta) {
      formData.append("changeReasonType", changeMeta.changeReasonType);
      formData.append("changeReasonText", changeMeta.changeReasonText);
    }

    const res = await dispatch(createSignatureThunk(formData));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Signature created successfully", {
        description: "Your digital signature has been securely saved.",
      });

      const loadingToastId = toast.loading("Initiating verification...", {
        description: "Preparing secure OTP and certificate pipeline...",
      });

      setIsChangingSignature(false);
      setChangeMeta(null);
      setIsEditing(false);

      const otpRes = await dispatch(sendSignatureOtpThunk());

      // DEV MODE ONLY
      const otpFromBackend = otpRes.payload?.otp;
      if (otpFromBackend) {
        console.log("🧪 DEV OTP (initial):", otpFromBackend);
        setDevOtp(otpFromBackend);
      }

      toast.dismiss(loadingToastId);

      setShowOtpModal(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingSignature(false);
    setChangeMeta(null);
  };

  const handleDownload = async ({ type, fileUrl, fileName }) => {
    try {
      toast.info(`Downloading ${type}..`);
      await downloadFileFromUrl(fileUrl, fileName);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error(`Downloading ${type} failed`);
    }
  };

  if (isFetching) {
    return <SignatureLoadingSkelton />;
  }

  const certificateBanner =
    previewDoc?.status !== "ACTIVE"
      ? {
          title: "Certificate Context Notice",
          icon: TriangleAlert,
          variant: "warning",
          content: (
            <div>
              This certificate was issued before this signature version was
              revoked.
              <br />
              It remains valid as a historical record but is not tied to the
              active signature.
            </div>
          ),
        }
      : null;

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
                  size={"sm"}
                  onClick={() => setIsCertificateOpen(true)}
                >
                  <Eye />
                  <span className="text-sm font-medium">View Certificate</span>
                </Button>
                <Button
                  onClick={() =>
                    handleDownload({
                      type: "Signature",
                      fileName:
                        currentSignature?.signatureDocumentId?.originalName,
                      fileUrl: signatureImage,
                    })
                  }
                  variant={"outline"}
                  size={"sm"}
                >
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
                size={"sm"}
                onClick={() => {
                  dispatch(sendSignatureOtpThunk());
                  setShowOtpModal(true);
                }}
              >
                <RotateCcw />
                Retry Signature Verification
              </Button>
            )}
            {currentSignature?.version > 1 && (
              <InfoTooltip content={"view Signature History"}>
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <History />
                </Button>
              </InfoTooltip>
            )}
            <EditToggleButtons
              isEditing={isEditing}
              isLoading={isCreating}
              onEdit={handleEditClick}
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
              isChangingSignature={isChangingSignature}
              showActions={false}
            />
          ) : (
            <>
              {signatureImage ? (
                <>
                  <div className="space-y-6">
                    {/* Signature Card */}
                    <div className="rounded-2xl bg-card border border-muted overflow-hidden shadow-sm mt-4">
                      <div className="text-muted-foreground/70 text-sm p-3 px-6 flex items-center justify-end gap-2">
                        <History className="size-4" />
                        Version {currentSignature?.version}
                      </div>
                      {/* Signature Image */}
                      <div className="p-6 pb-3 flex justify-center items-center min-h-[200px]">
                        <div className="relative group">
                          <img
                            src={signatureImage}
                            alt="Your signature"
                            className="w-full max-h-38 object-contain object-center relative z-10"
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

                  <DocumentPreviewDialog
                    open={isCertificateOpen}
                    onOpenChange={setIsCertificateOpen}
                    fileUrl={previewDoc?.url}
                    fileName={previewDoc?.name}
                    banner={certificateBanner}
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

      <ConfirmActionDialog
        open={showReplaceDialog}
        onOpenChange={setShowReplaceDialog}
        loading={isCreating}
        config={signatureReplaceConfig}
        onConfirm={({ reason, note }) => {
          setShowReplaceDialog(false);
          setIsEditing(true);

          setChangeMeta({
            changeReasonType: reason,
            changeReasonText: note,
          });
        }}
      />

      <SignatureHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        history={history}
        onViewCertificate={(item) => {
          setIsCertificateOpen(true);
          setPreviewDoc({
            url: item?.certificateUrl,
            name: item?.certificateDocumentId?.originalName,
            status: item?.status,
          });
        }}
        onDownload={handleDownload}
      />

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
