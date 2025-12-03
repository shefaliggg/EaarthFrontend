import React, { useState, useRef } from 'react';
import { Camera, ArrowRight, RotateCcw, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import eaarthLogo from '../../../../assets/eaarth.png';

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
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      
      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        {/* Logo/Header */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground tracking-wide font-semibold">
            CAPTURE LIVE PHOTO
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-8 md:p-10 border border-gray-100 w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-lavender-50 border border-primary rounded-xl flex-shrink-0">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-foreground">TAKE LIVE PHOTO</h2>
              <p className="text-xs text-muted-foreground">For identity verification</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-background border border-border rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground font-semibold mb-2">PHOTO GUIDELINES:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting (avoid shadows)</li>
                  <li>• Remove glasses, hats, or face coverings</li>
                  <li>• Look directly at the camera</li>
                  <li>• Maintain a neutral expression</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-destructive text-sm font-medium mb-6">
              {error}
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-destructive font-semibold mb-1">Camera Access Required</p>
                  <p className="text-sm text-muted-foreground">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Camera / Preview Box */}
          <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900 mb-6 w-full h-[280px] md:h-[320px]">

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
                  <div className="w-40 h-52 md:w-48 md:h-64 border-4 border-primary rounded-full opacity-50"></div>
                </div>
              </div>
            ) : preview ? (
              // Preview captured image
              <div className="relative w-full h-full">
                <img src={preview} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-mint-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  CAPTURED
                </div>
              </div>
            ) : (
              // Placeholder
              <>
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-3 opacity-50 text-foreground" />
                    <p className="text-sm opacity-70 text-foreground">Camera preview area</p>
                  </div>
                </div>
              </>
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
                      className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Camera className="w-5 h-5" />
                      OPEN CAMERA
                    </button>

                    {/* Upload Photo (Fallback) */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-muted text-foreground font-medium py-3 rounded-xl hover:bg-muted/80 border border-border transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      UPLOAD PHOTO
                    </button>
                  </>
                ) : (
                  <>
                    {/* Capture Button */}
                    <button
                      onClick={handleCaptureSelfie}
                      className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Camera className="w-5 h-5" />
                      CAPTURE PHOTO
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => setShowWebcam(false)}
                      className="w-full bg-muted text-foreground font-medium py-3 rounded-xl hover:bg-muted/80 border border-border transition-all text-sm"
                    >
                      CANCEL
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Retake Button */}
                <button
                  onClick={handleRetake}
                  className="w-full bg-muted text-foreground font-medium py-3 rounded-xl hover:bg-muted/80 border border-border transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw className="w-5 h-5" />
                  RETAKE PHOTO
                </button>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  CONTINUE TO VERIFICATION
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 4 of 5 — Live Photo Capture
        </div>
      </div>
    </div>
  );
}

export default LivePhotoCapture;