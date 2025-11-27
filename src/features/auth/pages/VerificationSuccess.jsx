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
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      
      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-lg mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground font-semibold tracking-wide">
            VERIFICATION SUCCESS
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="p-8 md:p-10 text-center">
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-mint-50 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-mint-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-medium text-foreground mb-2">
              Verified Successfully!
            </h2>

            {/* Subtitle */}
            <p className="text-muted-foreground text-sm mb-8">
              Your account has been verified and setup is complete. Redirecting to login page...
            </p>

            {/* Loading Spinner */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-muted border-t-primary"></div>
            </div>

            {/* Progress Text */}
            <p className="text-xs text-muted-foreground mt-6">
              Redirecting in a moment...
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 5 of 5 — Verification Complete
        </div>
      </div>
    </div>
  );
}

export default VerificationResultScreen;