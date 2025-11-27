import React, { useEffect, useState } from 'react';
import { Scan, CheckCircle, XCircle, ArrowRight, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useIdentityVerification from '../hooks/useIdentityVerification';
import eaarthLogo from '../../../assets/eaarth.png';

export default function IdentityVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId, idFile, selfieFile } = location.state || {};

  const {
    handleVerifyIdentity,
    loading,
    error,
    verificationResult,
  } = useIdentityVerification();

  const [progress, setProgress] = useState(0);
  const [idPhotoPreview, setIdPhotoPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Create image previews
  useEffect(() => {
    if (idFile) {
      const reader = new FileReader();
      reader.onloadend = () => setIdPhotoPreview(reader.result);
      reader.readAsDataURL(idFile);
    }

    if (selfieFile) {
      const reader = new FileReader();
      reader.onloadend = () => setSelfiePreview(reader.result);
      reader.readAsDataURL(selfieFile);
    }
  }, [idFile, selfieFile]);

  // MAIN VERIFICATION FUNCTION
  const performVerification = async () => {
    setIsVerifying(true);
    setProgress(0);

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 200);

    const result = await handleVerifyIdentity({
      userId,
      idFile,
      selfieFile,
    });

    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setIsVerifying(false);
    }, 400);
  };

  // Auto-start verification
  useEffect(() => {
    if (!userId || !idFile || !selfieFile) {
      navigate('/auth/upload-id', { replace: true });
      return;
    }
    performVerification();
  }, []);

  // Navigation
  const handleContinue = () => {
    navigate('/auth/terms', {
      state: { email, userId },
    });
  };

  const handleRetry = () => {
    navigate('/auth/upload-id', {
      replace: true,
      state: { email, userId },
    });
  };

  const handleBackClick = () => {
    navigate('/auth/live-photo', {
      state: { email, userId, idFile },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">

      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        disabled={isVerifying}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-2xl mx-auto">

        {/* Logo/Header */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground tracking-wide font-semibold">
            AI FACE VERIFICATION
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-gray-100 w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-lavender-50 border border-primary rounded-xl flex-shrink-0">
              <Scan className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-medium text-foreground">
                FACE VERIFICATION
              </h2>
              <p className="text-xs text-muted-foreground">
                Comparing ID and Live Photos
              </p>
            </div>
          </div>

          {/* Photo Comparison */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">

            {/* ID Photo */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wide">ID Photo</p>
              <div className="rounded-xl overflow-hidden border border-border">
                {idPhotoPreview ? (
                  <img src={idPhotoPreview} className="w-full h-40 md:h-48 object-cover" alt="ID Document" />
                ) : (
                  <div className="w-full h-40 md:h-48 bg-muted flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Live Photo */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wide">Live Photo</p>
              <div className="rounded-xl overflow-hidden border border-border">
                {selfiePreview ? (
                  <img src={selfiePreview} className="w-full h-40 md:h-48 object-cover" alt="Live Selfie" />
                ) : (
                  <div className="w-full h-40 md:h-48 bg-muted flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* VERIFICATION PROGRESS */}
          {isVerifying ? (
            <>
              <div className="bg-lavender-50 border border-primary/30 rounded-xl p-6 text-center mb-6">

                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Scan className="w-16 h-16 text-primary animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-lavender-200 border-t-primary rounded-full animate-spin"></div>
                  </div>
                </div>

                <p className="text-lg font-semibold text-foreground mb-3">
                  AI VERIFICATION IN PROGRESS...
                </p>

                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-muted-foreground">{progress}% Complete</p>
              </div>
            </>
          ) : (
            <>
              {verificationResult?.verified ? (
                <div className="bg-mint-50 border border-mint-500/30 rounded-xl p-6 text-center mb-6">

                  <CheckCircle className="w-16 h-16 text-mint-600 mx-auto mb-4" />

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    VERIFICATION SUCCESSFUL!
                  </h3>

                  <p className="text-base text-mint-700 mb-4">
                    Face Match: <strong>{Math.round(verificationResult?.confidence * 100)}%</strong>
                  </p>

                  <div className="bg-mint-100 rounded-xl p-3.5">
                    <p className="text-sm text-mint-800">
                      ✓ Your identity has been successfully verified using AI facial recognition.
                      Confidence: <strong>{Math.round(verificationResult?.confidence * 100)}%</strong>
                    </p>
                  </div>

                </div>
              ) : (
                /* VERIFICATION FAILED */
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center mb-6">

                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    VERIFICATION FAILED
                  </h3>

                  <p className="text-base text-destructive mb-4">
                    Face Match: <strong>{Math.round((verificationResult?.confidence || 0) * 100)}%</strong>
                  </p>

                  <div className="bg-red-100 rounded-xl p-3.5 mb-4">
                    <p className="text-sm text-destructive">
                      {error || 'The photos do not match sufficiently. Minimum 80% confidence required.'}
                    </p>
                  </div>

                  <div className="text-left">
                    <p className="text-sm text-destructive font-semibold mb-2">
                      COMMON ISSUES:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Poor lighting</li>
                      <li>• Face not clearly visible in ID photo</li>
                      <li>• Wearing glasses, hat, or face covering</li>
                      <li>• Blurry or low-quality image</li>
                    </ul>
                  </div>

                </div>
              )}
            </>
          )}

          {/* ACTION BUTTONS */}
          {!isVerifying && (
            <div className="space-y-3">

              {verificationResult?.verified ? (
                <button
                  onClick={handleContinue}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  CONTINUE TO TERMS & CONDITIONS
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    TRY AGAIN
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={performVerification}
                    className="w-full bg-muted text-foreground font-medium py-3 rounded-xl hover:bg-muted/80 border border-border transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Loader className="w-5 h-5 animate-spin" />
                    RE-RUN VERIFICATION
                  </button>
                </>
              )}

            </div>
          )}

        </div>

        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 5 of 5 — AI Face Verification
        </div>
      </div>
    </div >
  );
}