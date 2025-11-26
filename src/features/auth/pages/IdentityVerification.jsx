import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Scan,
  Loader,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useIdentityVerification } from '../hooks/useIdentityVerification';
import eaarthLogo from '../../../assets/eaarth.png';

export const IdentityVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email;

  const [step, setStep] = useState(1); // 1: Upload ID, 2: Capture Selfie, 3: Verifying, 4: Result
  const [idDocument, setIdDocument] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const idInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const { handleVerifyIdentity, loading, error, verificationResult } =
    useIdentityVerification();

  // Handle ID document upload
  const handleIdUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdDocument(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle selfie file upload (alternative to camera)
  const handleSelfieUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfiePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera for selfie
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        setSelfiePhoto(file);
        setSelfiePreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // Retake selfie
  const retakeSelfie = () => {
    setSelfiePhoto(null);
    setSelfiePreview(null);
    startCamera();
  };

  // Submit verification
  const handleSubmitVerification = async () => {
    if (!idDocument || !selfiePhoto) {
      alert('Please upload both ID document and selfie photo');
      return;
    }

    setStep(3); // Show verifying state

    const result = await handleVerifyIdentity({
      userId,
      idDocument,
      selfiePhoto,
    });

    setStep(4); // Show result

    // Auto-redirect based on result
    if (result.verified) {
      setTimeout(() => {
        navigate('/auth/terms', {
          state: { userId, email, verified: true, ...location.state },
        });
      }, 2000);
    }
  };

  // Step 1: Upload ID Document
  if (step === 1) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-4">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-40 h-auto mx-auto mb-3"
            />
            <p className="text-sm text-gray-600 tracking-wide font-semibold">
              UPLOAD ID DOCUMENT
            </p>
          </div>

          <div className="w-full bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#faf5ff] border border-gray-200 rounded-2xl">
                <Upload className="w-6 md:w-7 h-6 md:h-7 text-[#9333ea]" />
              </div>
              <div>
                <h2 className="text-xl md:text-xl font-medium text-gray-900">
                  UPLOAD ID PHOTO
                </h2>
                <p className="text-xs text-gray-500">Passport or driver's license</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-5 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    IMPORTANT INSTRUCTIONS:
                  </p>
                  <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                    <li>• Upload a clear photo of your ID</li>
                    <li>• Ensure your face is clearly visible</li>
                    <li>• All text must be readable</li>
                    <li>• Photo should be well-lit without glare</li>
                    <li>• Accepted formats: JPG, PNG, PDF (max 5MB)</li>
                  </ul>
                </div>
              </div>
            </div>

            {idPreview ? (
              <div className="mb-6">
                <img
                  src={idPreview}
                  alt="ID Preview"
                  className="w-full rounded-2xl border-2 border-green-300"
                />
                <button
                  onClick={() => {
                    setIdDocument(null);
                    setIdPreview(null);
                  }}
                  className="mt-4 w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  UPLOAD DIFFERENT ID
                </button>
              </div>
            ) : (
              <div
                onClick={() => idInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl px-6 md:px-8 py-8 md:py-8 text-center hover:border-gray-300 hover:bg-[#faf5ff]/50 transition-all cursor-pointer mb-6"
              >
                <Upload className="w-12 md:w-16 h-12 md:h-16 text-[#9333ea] mx-auto mb-4 md:mb-6" />
                <p className="text-lg md:text-lg font-medium mb-2">
                  CLICK TO UPLOAD OR DRAG & DROP
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Upload a clear image of your ID document
                </p>
                <input
                  ref={idInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  className="hidden"
                />
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!idDocument}
              className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 md:py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              CONTINUE TO LIVE PHOTO
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mt-6 text-gray-500 text-xs">
            Step 1 of 3 — ID Document Upload
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Capture Selfie
  if (step === 2) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-4">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-40 h-auto mx-auto mb-3"
            />
            <p className="text-sm text-gray-600 tracking-wide font-semibold">
              CAPTURE LIVE PHOTO
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#faf5ff] border border-gray-200 rounded-2xl">
                <Camera className="w-6 md:w-7 h-6 md:h-7 text-[#9333ea]" />
              </div>
              <div>
                <h2 className="text-xl md:text-xl font-medium text-gray-900">
                  TAKE LIVE PHOTO
                </h2>
                <p className="text-xs text-gray-500">For identity verification</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 md:px-6 py-3 mb-4">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    PHOTO GUIDELINES:
                  </p>
                  <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                    <li>• Face the camera directly</li>
                    <li>• Ensure good lighting</li>
                    <li>• Remove glasses, hats, or face coverings</li>
                    <li>• Look directly at the camera</li>
                    <li>• Maintain a neutral expression</li>
                  </ul>
                </div>
              </div>
            </div>

            {selfiePreview ? (
              <div className="mb-6">
                <img
                  src={selfiePreview}
                  alt="Selfie Preview"
                  className="w-full rounded-2xl border-2 border-green-300"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-6 w-full h-[300px]">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-sm opacity-70">Camera not started</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            <div className="space-y-4">
              {!selfiePreview && !cameraActive && (
                <>
                  <button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 md:py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    START CAMERA
                  </button>

                  <div className="text-center text-gray-500 text-sm">OR</div>

                  <button
                    onClick={() => selfieInputRef.current?.click()}
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3.5 md:py-4 rounded-2xl hover:bg-gray-200 border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    UPLOAD PHOTO
                  </button>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                </>
              )}

              {cameraActive && !selfiePreview && (
                <button
                  onClick={capturePhoto}
                  className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 md:py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  CAPTURE PHOTO
                </button>
              )}

              {selfiePreview && (
                <>
                  <button
                    onClick={retakeSelfie}
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3.5 md:py-4 rounded-2xl hover:bg-gray-200 border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    RETAKE PHOTO
                  </button>

                  <button
                    onClick={handleSubmitVerification}
                    className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 md:py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    VERIFY IDENTITY
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 font-medium py-2 transition-colors hover:text-gray-900 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to ID Upload
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-xs">
            Step 2 of 3 — Live Photo Capture
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Verifying
  if (step === 3) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-40 h-auto mx-auto mb-3"
            />
            <p className="text-sm text-gray-600 tracking-wide font-semibold">
              AI FACE VERIFICATION
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#faf5ff] border border-gray-200 rounded-2xl">
                <Scan className="w-6 md:w-7 h-6 md:h-7 text-[#9333ea]" />
              </div>
              <div>
                <h2 className="text-xl md:text-xl font-medium text-gray-900">
                  FACE VERIFICATION
                </h2>
                <p className="text-xs text-gray-500">Comparing ID and live photos</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">
                  ID PHOTO
                </p>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={idPreview}
                    alt="ID"
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">
                  LIVE PHOTO
                </p>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={selfiePreview}
                    alt="Live"
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#faf5ff] border border-gray-200 rounded-2xl p-6 md:p-6 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Scan className="w-20 h-20 text-[#9333ea] animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 border-2 border-gray-200 border-t-[#9333ea] rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="text-base md:text-lg font-medium text-[#9333ea] mb-2">
                AI VERIFICATION IN PROGRESS...
              </p>
              <p className="text-sm text-gray-600">
                Please wait while we verify your identity
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-xs">
            Step 3 of 3 — Verifying Identity
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Result
  if (step === 4 && verificationResult) {
    const isSuccess = verificationResult.verified;

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-40 h-auto mx-auto mb-3"
            />
            <p className="text-sm text-gray-600 tracking-wide font-semibold">
              VERIFICATION RESULT
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
            {isSuccess ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-300 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 md:w-20 h-16 md:h-20 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-medium text-green-900 mb-2">
                    VERIFICATION SUCCESSFUL!
                  </h3>
                  <p className="text-base md:text-lg text-green-700 mb-4">
                    Face Match: <strong>{verificationResult.confidence}%</strong>
                  </p>
                  <div className="bg-white/60 rounded-2xl p-4">
                    <p className="text-xs md:text-sm text-green-800">
                      ✓ Your identity has been verified using AI facial recognition
                      technology.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 py-4">
                  <Loader className="w-5 h-5 animate-spin text-[#9333ea]" />
                  <span className="text-sm font-medium text-gray-600">
                    Redirecting to terms...
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-300 rounded-2xl p-6 text-center">
                  <XCircle className="w-16 md:w-20 h-16 md:h-20 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-medium text-red-900 mb-2">
                    VERIFICATION FAILED
                  </h3>
                  <p className="text-base md:text-lg text-red-700 mb-4">
                    {verificationResult.message || 'Face verification failed'}
                  </p>
                  <div className="bg-white/60 rounded-2xl p-4">
                    <p className="text-xs md:text-sm text-red-800 mb-3">
                      Your account is pending admin review. You'll be notified once
                      reviewed.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/auth/login')}
                  className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 md:py-4 rounded-2xl hover:opacity-90 transition-opacity"
                >
                  RETURN TO LOGIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default IdentityVerificationPage;