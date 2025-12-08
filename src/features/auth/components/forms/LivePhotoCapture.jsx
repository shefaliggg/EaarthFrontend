import React, { useState, useRef } from 'react';
import { Camera, ArrowRight, RotateCcw, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import eaarthLogo from '../../../../assets/eaarth.webp';

export function LivePhotoCapture() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId, idFile } = location.state || {};

  const [selfieFile, setSelfieFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Convert base64 to File object
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // Handle webcam capture
  const handleCaptureSelfie = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const file = base64ToFile(imageSrc, `selfie-${Date.now()}.jpg`);
      setSelfieFile(file);
      setPreview(imageSrc);
      setShowWebcam(false);
      setError('');
    }
  };

  // Handle file upload (fallback)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setSelfieFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleOpenWebcam = () => {
    setShowWebcam(true);
    setCameraError(null);
  };

  const handleRetake = () => {
    setSelfieFile(null);
    setPreview(null);
    setError('');
    setShowWebcam(false);
  };

  const handleContinue = () => {
    if (!selfieFile) {
      setError('Please capture your selfie photo');
      return;
    }

    navigate('/auth/identity-verification', {
      state: { email, userId, idFile, selfieFile },
    });
  };

  const handleBackClick = () => {
    navigate('/auth/upload-id', {
      state: { email, userId },
    });
  };

  const handleWebcamError = (error) => {
    console.error('Webcam error:', error);
    setCameraError('Unable to access camera. Please allow camera permissions or upload a photo.');
    setShowWebcam(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Capture Live Photo
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Take Live Photo
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            For identity verification
          </p>

          {/* Instructions */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Photo Guidelines:
                </p>
                <ul className="text-[10px] text-gray-700 dark:text-gray-300 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Face the camera directly
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Ensure good lighting (avoid shadows)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Remove glasses, hats, or face coverings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Look directly at the camera
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Maintain a neutral expression
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-red-600 dark:text-red-300 font-semibold mb-1">Camera Access Required</p>
                  <p className="text-[10px] text-red-600 dark:text-red-300">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Camera / Preview Box */}
          <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900 mb-4 w-full h-[280px]">

            {showWebcam && !preview ? (
              // Live Webcam View
              <div className="w-full h-full">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                  onUserMediaError={handleWebcamError}
                  className="w-full h-full object-cover"
                />

                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-52 border-4 border-purple-500 dark:border-purple-400 rounded-full opacity-50"></div>
                </div>
              </div>
            ) : preview ? (
              // Preview captured image
              <div className="relative w-full h-full">
                <img src={preview} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-green-600 dark:bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Captured
                </div>
              </div>
            ) : (
              // Placeholder
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Camera preview area</p>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input for fallback upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Buttons */}
          <div className="space-y-3">
            {!preview ? (
              <>
                {!showWebcam ? (
                  <>
                    {/* Open Camera Button */}
                    <button
                      onClick={handleOpenWebcam}
                      className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Camera className="w-5 h-5" />
                      Open Camera
                    </button>

                    {/* Upload Photo (Fallback) */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all text-sm"
                    >
                      Upload Photo
                    </button>
                  </>
                ) : (
                  <>
                    {/* Capture Button */}
                    <button
                      onClick={handleCaptureSelfie}
                      className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => setShowWebcam(false)}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Retake Button */}
                <button
                  onClick={handleRetake}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Photo
                </button>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Continue to Verification
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Back to Previous */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors"
            >
              Back to ID Upload
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 4 of 5 — Live Photo Capture
        </div>
      </div>
    </div>
  );
}

export default LivePhotoCapture;