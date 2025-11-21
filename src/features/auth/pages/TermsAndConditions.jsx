import { useState } from 'react';
import { ArrowLeft, Home, Shield } from 'lucide-react';
import eaarthLogo from '../../../../src/assets/eaarth.png';

export default function TermsAndConditionsScreen({ onNavigate, onSkip }) {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    onNavigate('identity-verification');
  };

  return (
    <div className="min-h-screen  flex items-start justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-gray-600 font-semibold tracking-wide">
            TERMS & CONDITIONS
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-5 gap-2">
          <button
            onClick={() => onNavigate('set-password')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl
                       hover:bg-gray-50 transition-all font-medium text-gray-600 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BACK</span>
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-600
                         text-purple-600 rounded-2xl hover:bg-purple-50 transition-all font-medium text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">SKIP</span>
            </button>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-purple-100 overflow-hidden">

          {/* Header */}
          <div className="p-6 text-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              TERMS & CONDITIONS
            </h2>
            <p className="text-sm text-gray-500">
              Please review and accept our terms to proceed
            </p>
          </div>

          {/* Scrollable Terms */}
          <div className="px-6 pb-6 md:px-10">
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl max-h-96 overflow-y-auto mb-6">
              <h3 className="font-medium text-purple-600 mb-2 text-lg">
                E-AARTH PLATFORM TERMS & CONDITIONS
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Version 1.0 | Last Updated: November 13, 2025
              </p>

              <div className="space-y-4 text-sm text-gray-700">

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">1. ACCEPTANCE OF TERMS</h4>
                  <p>
                    By using the E-AARTH platform, you acknowledge that you agree to be bound by these Terms and Conditions.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">2. USER RESPONSIBILITIES</h4>
                  <p>
                    You are responsible for keeping your account credentials secure and for all activity under your account.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">3. DATA PRIVACY</h4>
                  <p>
                    We are committed to protecting your personal information, which will be handled according to our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">4. PLATFORM USAGE</h4>
                  <p>
                    You agree not to misuse the platform, disrupt services, or violate applicable laws.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">5. INTELLECTUAL PROPERTY</h4>
                  <p>
                    All platform content and features are owned by E-AARTH Studios and protected by copyright laws.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">6. ACCOUNT TERMINATION</h4>
                  <p>
                    We may suspend or terminate your account for violations of these terms.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">7. LIMITATION OF LIABILITY</h4>
                  <p>
                    E-AARTH is not liable for indirect or consequential damages arising from use of the platform.
                  </p>
                </section>

                <section>
                  <h4 className="font-medium text-gray-900 mb-1">8. CHANGES TO TERMS</h4>
                  <p>
                    We may modify these terms anytime. Continued use of the platform indicates acceptance.
                  </p>
                </section>

              </div>
            </div>

            {/* Accept Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                id="accept-terms"
              />

              <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                I have read and agree to the{' '}
                <span className="text-purple-600 font-semibold hover:underline">Terms & Conditions</span>{' '}
                and{' '}
                <span className="text-purple-600 font-semibold hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleContinue}
              disabled={!accepted}
              className={`w-full py-4 font-medium rounded-2xl transition-all ${
                accepted
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ACCEPT & CONTINUE
            </button>

            {/* Security Note */}
            <div className="mt-4 flex items-center justify-center text-xs gap-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your data is protected & encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Final Step: Accept Terms & Conditions
        </div>
      </div>
    </div>
  );
}




