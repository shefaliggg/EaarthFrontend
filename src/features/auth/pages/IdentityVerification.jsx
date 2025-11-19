import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  CreditCard,
  IdCard,
  Home,
} from "lucide-react";

export default function IdentityVerificationScreen({ onNavigate, onSkip }) {
  // Commented out — since you said no functions needed
  // const [idDocument, setIdDocument] = useState(null);
  // const [selfie, setSelfie] = useState(null);

  // const handleIdUpload = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) setIdDocument(file);
  // };

  // const handleSelfieUpload = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) setSelfie(file);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-green-100 via-pink-100 to-purple-200 relative">
      {/* Skip Button */}
      {onSkip && (
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all text-purple-600 font-medium z-10"
        >
          <Home className="w-5 h-5" />
          Skip to Dashboard
        </button>
      )}

      <button
        onClick={() => onNavigate("terms")}
        className="absolute top-6 left-6 p-3 hover:bg-white/50 rounded-full transition-all bg-white/30"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            EAARTH
          </h1>
          <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            STUDIOS
          </p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Identity Verification
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please verify your identity to continue
        </p>

        {/* Verification Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg">UPLOAD GOVERNMENT-ISSUED ID</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4 ml-11">
              Please upload a clear photo of your Passport, Driver's License, or National ID
            </p>

            <div className="ml-11">
              {/* ID Type Options */}
              <div className="flex gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Passport</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span>Driver's License</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <IdCard className="w-4 h-4 text-gray-600" />
                  <span>National ID</span>
                </div>
              </div>

              {/* Upload Box */}
              <label className="block">
                <input type="file" accept="image/*" className="hidden" />

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 font-medium mb-1">
                    Click to upload ID document
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG or PDF (max. 10MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg">CAPTURE LIVE SELFIE</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4 ml-11">
              Take a clear photo of your face. Face the camera directly and ensure good lighting
            </p>

            <div className="ml-11">
              <label className="block">
                <input type="file" accept="image/*" capture="user" className="hidden" />

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 font-medium mb-1">
                    Click to capture selfie
                  </p>
                  <p className="text-sm text-gray-400">
                    Use your camera to take a photo
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full font-semibold py-3 rounded-lg transition-all mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
        >
          SUBMIT & CONTINUE
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your documents are encrypted and securely stored
        </p>
      </div>
    </div>
  );
}
