import { useEffect } from 'react';
import { CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react';

// interface VerificationResultProps {
//   status: "success" | "failed";   
//   onNavigate: (screen: string) => void;
//   onSkip?: () => void;           
// }

export function VerificationResultScreen({
  status,
  onNavigate,
  onSkip,
}) {

  // Auto-redirect for success
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onNavigate("complete");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onNavigate]);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-green-100 via-pink-100 to-purple-200 relative">

      {/* Skip Button only in failed case */}
      {!isSuccess && onSkip && (
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all text-purple-600 font-medium"
        >
          <Home className="w-5 h-5" />
          Skip to Dashboard
        </button>
      )}

      {/* Back button always visible for both */}
      <button
        onClick={() => onNavigate(isSuccess ? "complete" : "login")}
        className="absolute top-6 left-6 p-3 hover:bg-white/50 rounded-full transition-all bg-white/30"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            EAARTH
          </h1>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            STUDIOS
          </p>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center 
            ${isSuccess ? "bg-green-100" : "bg-red-100"}
          `}
          >
            {isSuccess ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">
          {isSuccess ? "Verified Successfully!" : "Verification Failed"}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          {isSuccess
            ? "Your account has been verified. Redirecting to your dashboard..."
            : "The invitation link is invalid or has expired. Please contact your administrator for a new invitation."
          }
        </p>

        {/* Success Loader */}
        {isSuccess && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Failed buttons */}
        {!isSuccess && (
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("login")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
            >
              BACK TO LOGIN
            </button>
            <button
              onClick={() => onNavigate("contact-support")}
              className="w-full border border-purple-600 text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-all"
            >
              CONTACT SUPPORT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




