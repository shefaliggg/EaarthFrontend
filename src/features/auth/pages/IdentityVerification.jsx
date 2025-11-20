import { useState, useEffect } from 'react';
import { Scan, CheckCircle, XCircle, ArrowRight, Loader } from 'lucide-react';
import eaarthLogo from '../../../assets/eaarth.png';

export default function identityVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [progress, setProgress] = useState(0);

  // Mock photo data
  const idPhotoData = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=cro';
  const livePhotoData = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=cro';

  useEffect(() => {
    performVerification();
  }, []);

  const performVerification = async () => {
    setIsVerifying(true);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(progressInterval);
    setProgress(100);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock result - change match to false to see error state
    const result = {
      match: true,
      score: 92
    };

    setVerificationResult(result);
    setIsVerifying(false);
  };

  const handleContinue = () => {
    console.log('Continue to terms');
  };

  const handleRetry = () => {
    console.log('Retry verification');
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo/Header */}
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

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border-2 border-purple-100 w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-purple-100 border-2 border-purple-700 rounded-3xl flex-shrink-0">
              <Scan className="w-6 md:w-7 h-6 md:h-7 text-purple-700" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">FACE VERIFICATION</h2>
              <p className="text-xs text-gray-500">Comparing ID and live photos</p>
            </div>
          </div>

          {/* Photo Comparison */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
            {/* ID Photo */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 text-center">ID PHOTO</p>
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border-2 border-gray-200">
                <img src={idPhotoData} alt="ID" className="w-full h-48 md:h-56 object-cover" />
              </div>
            </div>

            {/* Live Photo */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 text-center">LIVE PHOTO</p>
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border-2 border-gray-200">
                <img src={livePhotoData} alt="Live" className="w-full h-48 md:h-56 object-cover" />
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {isVerifying ? (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-3xl p-6 md:p-8 text-center mb-6">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Scan className="w-20 h-20 text-purple-600 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="text-base md:text-lg font-bold text-purple-900 mb-3">
                AI VERIFICATION IN PROGRESS...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-700">{progress}% Complete</p>
            </div>
          ) : (
            <>
              {verificationResult?.match ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-3xl p-6 md:p-8 text-center mb-6">
                  <CheckCircle className="w-16 md:w-20 h-16 md:h-20 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-2">
                    VERIFICATION SUCCESSFUL!
                  </h3>
                  <p className="text-base md:text-lg text-green-700 mb-4">
                    Face Match: <strong>{verificationResult.score}%</strong>
                  </p>
                  <div className="bg-green-100 rounded-2xl p-4">
                    <p className="text-xs md:text-sm text-green-800">
                      ✓ Your identity has been verified using AI facial recognition technology.
                      Your photos match with <strong>{verificationResult.score}% confidence</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 md:p-8 text-center mb-6">
                  <XCircle className="w-16 md:w-20 h-16 md:h-20 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold text-red-900 mb-2">
                    VERIFICATION FAILED
                  </h3>
                  <p className="text-base md:text-lg text-red-700 mb-4">
                    Face Match: <strong>{verificationResult?.score || 0}%</strong>
                  </p>
                  <div className="bg-red-100 rounded-2xl p-4 mb-4">
                    <p className="text-xs md:text-sm text-red-800">
                      {verificationResult?.error || 
                        `The photos do not match sufficiently. We require at least 80% confidence for verification.`}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs md:text-sm text-red-700 font-bold mb-2">
                      COMMON ISSUES:
                    </p>
                    <ul className="text-xs md:text-sm text-red-600 space-y-1">
                      <li>• Poor lighting in one or both photos</li>
                      <li>• Face not clearly visible in ID photo</li>
                      <li>• Wearing glasses, hat, or face covering</li>
                      <li>• Low quality or blurry photos</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          {!isVerifying && (
            <div className="space-y-4">
              {verificationResult?.match ? (
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 md:py-4 rounded-3xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  CONTINUE TO TERMS & CONDITIONS
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 md:py-4 rounded-3xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    TRY AGAIN
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={performVerification}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 md:py-4 rounded-3xl hover:bg-gray-200 border-2 border-gray-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Loader className="w-5 h-5" />
                    RE-RUN VERIFICATION
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 4 of 4: AI Face Verification
        </div>
      </div>
    </div>
  );
}