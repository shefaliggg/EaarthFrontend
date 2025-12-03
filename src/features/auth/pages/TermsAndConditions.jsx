import { useState } from 'react';
import { ArrowLeft, Shield, Loader, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eaarthLogo from '../../../../src/assets/eaarth.png';

export default function TermsAndConditionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, userId } = location.state || {};

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }

    setLoading(true);

    // Simulate brief loading then redirect to success page
    setTimeout(() => {
      navigate('/auth/result', {
        replace: true,
        state: { status: 'success' }
      });
    }, 1000);
  };

  const handleBack = () => {
    navigate('/auth/identity-verification', {
      state: { email, userId },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      {/* Back Button */}
      <button
        onClick={handleBack}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-3xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Terms & Conditions
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Terms & Conditions
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Please review and accept to proceed
              </p>
            </div>
          </div>

          {/* Scrollable Terms */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-5 rounded-xl max-h-80 overflow-y-auto mb-4">
            <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2 text-sm">
              E-AARTH PLATFORM TERMS & CONDITIONS
            </h3>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-4">
              Version 1.0 | Last Updated: November 13, 2025
            </p>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">1. ACCEPTANCE OF TERMS</h4>
                <p>
                  By using the E-AARTH platform, you acknowledge that you agree to be bound by these Terms and Conditions.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">2. USER RESPONSIBILITIES</h4>
                <p>
                  You are responsible for keeping your account credentials secure and for all activity under your account.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">3. DATA PRIVACY</h4>
                <p>
                  We are committed to protecting your personal information, which will be handled according to our Privacy Policy.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">4. PLATFORM USAGE</h4>
                <p>
                  You agree not to misuse the platform, disrupt services, or violate applicable laws.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">5. INTELLECTUAL PROPERTY</h4>
                <p>
                  All platform content and features are owned by E-AARTH Studios and protected by copyright laws.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">6. ACCOUNT TERMINATION</h4>
                <p>
                  We may suspend or terminate your account for violations of these terms.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">7. LIMITATION OF LIABILITY</h4>
                <p>
                  E-AARTH is not liable for indirect or consequential damages arising from use of the platform.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">8. CHANGES TO TERMS</h4>
                <p>
                  We may modify these terms anytime. Continued use of the platform indicates acceptance.
                </p>
              </section>

            </div>
          </div>

          {/* Accept Checkbox */}
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
              id="accept-terms"
            />

            <label htmlFor="accept-terms" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
              I have read and agree to the{' '}
              <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Terms & Conditions</span>{' '}
              and{' '}
              <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Privacy Policy</span>.
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleContinue}
            disabled={!accepted || loading}
            className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
              accepted && !loading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Completing Setup...
              </>
            ) : (
              'Accept & Continue'
            )}
          </button>

          {/* Security Note */}
          <div className="mt-3 flex items-center justify-center text-xs gap-2 text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Your data is protected & encrypted</span>
          </div>

          {/* Back Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleBack}
              disabled={loading}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Verification
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Final Step — Accept Terms & Conditions
        </div>
      </div>
    </div>
  );
}