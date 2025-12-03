import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import eaarthLogo from '../../../assets/eaarth.png';

export function VerificationResultScreen() {
  const navigate = useNavigate();

  // Auto-redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth/login', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">
      
      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-32 h-auto mx-auto mb-2"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Verification Success
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <div className="text-center">
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verified Successfully!
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">
              Your account has been verified and setup is complete. Redirecting to login page...
            </p>

            {/* Loading Spinner */}
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-purple-600"></div>
            </div>

            {/* Progress Text */}
            <p className="text-[10px] text-gray-600 dark:text-gray-400">
              Redirecting in a moment...
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 5 of 5 — Verification Complete
        </div>
      </div>
    </div>
  );
}

export default VerificationResultScreen;