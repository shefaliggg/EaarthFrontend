import React, { useEffect, useState } from 'react';
import { Scan, CheckCircle, XCircle, ArrowRight, Loader, ArrowLeft, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        disabled={isVerifying}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-2xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            AI Face Verification
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 rounded-lg">
              <Scan className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Identity Verification
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Comparing ID and Live Photos
              </p>
            </div>
          </div>

          {/* Photo Comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* ID Photo */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center uppercase tracking-wide">
                ID Photo
              </p>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                {idPhotoPreview ? (
                  <img src={idPhotoPreview} className="w-full h-40 object-cover" alt="ID Document" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Live Photo */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center uppercase tracking-wide">
                Live Photo
              </p>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                {selfiePreview ? (
                  <img src={selfiePreview} className="w-full h-40 object-cover" alt="Live Selfie" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* VERIFICATION PROGRESS */}
          {isVerifying ? (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-6 text-center mb-4">

              <div className="relative w-16 h-16 mx-auto mb-4">
                <Scan className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
                </div>
              </div>

              <p className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                AI Verification in Progress...
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">{progress}% Complete</p>
            </div>
          ) : (
            <>
              {verificationResult?.verified ? (
                /* VERIFICATION SUCCESS */
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl p-6 text-center mb-4">

                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Verification Successful!
                  </h3>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Face Match: <strong className="text-green-600 dark:text-green-400">{Math.round(verificationResult?.confidence * 100)}%</strong>
                  </p>

                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800/40 rounded-xl p-3">
                    <p className="text-xs text-gray-800 dark:text-gray-200">
                      ✓ Your identity has been successfully verified using AI facial recognition.
                      Confidence: <strong>{Math.round(verificationResult?.confidence * 100)}%</strong>
                    </p>
                  </div>

                </div>
              ) : (
                /* VERIFICATION FAILED */
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-6 text-center mb-4">

                  <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Verification Failed
                  </h3>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Face Match: <strong className="text-red-600 dark:text-red-400">{Math.round((verificationResult?.confidence || 0) * 100)}%</strong>
                  </p>

                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800/40 rounded-xl p-3 mb-4">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {error || 'The photos do not match sufficiently. Minimum 80% confidence required.'}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-3 text-left">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Common Issues:
                        </p>
                        <ul className="text-[10px] text-gray-700 dark:text-gray-300 space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            Poor lighting in photos
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            Face not clearly visible in ID photo
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            Wearing glasses, hat, or face covering
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            Blurry or low-quality images
                          </li>
                        </ul>
                      </div>
                    </div>
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
                  className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Continue to Terms & Conditions
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Try Again
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={performVerification}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Loader className="w-5 h-5 animate-spin" />
                    Re-run Verification
                  </button>
                </>
              )}

            </div>
          )}

          {/* Back Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              disabled={isVerifying}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Live Photo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 5 of 5 — AI Face Verification
        </div>
      </div>
    </div>
  );
}