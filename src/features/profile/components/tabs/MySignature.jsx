import React, { useRef, useState } from "react";
import {
  PenTool,
  Download,
  Trash2,
  Check,
  Fingerprint,
  Calendar,
  User,
} from "lucide-react";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import SignaturePad from "../../../crew/components/SignaturePad/SignaturePad";
import { formatDate } from "../../../../shared/config/utils";
import { Button } from "../../../../shared/components/ui/button";

export default function MySignature({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
}) {
  const [signatureImage, setSignatureImage] = useState(
    profile.signature || null,
  );
  const handleSaveSignature = (signatureData) => {
    if (!signatureData?.data) return;

    setSignatureImage(signatureData.data);

    setProfile({
      ...profile,
      signature: signatureData.data,
    });

    setIsEditing(false); // optional but nice UX
  };

  const downloadSignature = () => {
    if (!signatureImage) return;
    const link = document.createElement("a");
    link.href = signatureImage;
    link.download = "my-signature.png";
    link.click();
  };

  return (
    <CardWrapper
      title={"My Signature"}
      icon={"PenTool"}
      actions={
        <EditToggleButtons
          isEditing={isEditing}
          setIsEditing={() => setIsEditing(!isEditing)}
        />
      }
    >
      <div className="space-y-4">
        {/* Canvas for drawing signature */}
        {isEditing ? (
          <SignaturePad
            onSave={handleSaveSignature}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            {/* Display saved signature with premium styling */}
            {signatureImage ? (
              <div className="space-y-6">
                {/* Signature Card */}
                <div className="rounded-2xl bg-card border border-gray-200 overflow-hidden shadow-sm mt-6">
                  {/* Signature Header */}
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-50 rounded-lg">
                          <Fingerprint className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Official Signature
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature Image */}
                  <div className="p-6 flex justify-center items-center">
                    <div className="relative group">
                      <img
                        src={signatureImage}
                        alt="Your signature"
                        className="w-full max-h-32 object-contain relative z-10"
                      />
                    </div>
                  </div>

                  {/* Signature Footer */}
                  <div className="px-5 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500">
                            Added on {formatDate(new Date())}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500">
                            Digitally signed
                          </span>
                        </div>
                      </div>
                      <div className="text-purple-600 text-[10px] font-mono">
                        ✓ Verified
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    onClick={downloadSignature}
                    variant={"outline"}
                  >
                    <Download />
                    <span className="text-sm font-medium">Download</span>
                  </Button>

                  <Button
                    onClick={() => setIsEditing(true)}
                  >
                    <PenTool />
                    <span className="text-sm font-medium">
                      Replace Signature
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Empty State - Premium Design */
              <div className="relative overflow-hidden">

                {/* Content */}
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-white/50 backdrop-blur-sm">
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
  );
}
