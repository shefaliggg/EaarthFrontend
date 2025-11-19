import { useState } from 'react';
import { ArrowLeft, Shield, Home } from 'lucide-react';

export default function TermsAndConditions({ onNavigate, onSkip }) {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    onNavigate('identity-verification');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('set-password')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            BACK
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-bold"
            >
              <Home className="w-5 h-5" />
              SKIP TO DASHBOARD
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              TERMS & CONDITIONS
            </h2>
            <p className="text-white/90">
              Please review and accept our terms to continue
            </p>
          </div>

          {/* Content */}
          <div className="p-10">
            {/* Scrollable Terms Content */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-purple-600 mb-3 text-lg">
                E-AARTH PLATFORM TERMS & CONDITIONS
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Version 1.0 | Last Updated: November 13, 2025
              </p>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">1. ACCEPTANCE OF TERMS</h4>
                  <p>
                    By accessing and using the E-AARTH platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">2. USER RESPONSIBILITIES</h4>
                  <p>
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3. DATA PRIVACY</h4>
                  <p>
                    We are committed to protecting your privacy and personal information. All data collected will be used in accordance with our Privacy Policy and applicable data protection regulations.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">4. PLATFORM USAGE</h4>
                  <p>
                    You agree to use the platform only for lawful purposes and in accordance with these terms. You must not use the platform in any way that could damage, disable, or impair the service.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">5. INTELLECTUAL PROPERTY</h4>
                  <p>
                    All content, features, and functionality of the platform are owned by E-AARTH Studios and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">6. ACCOUNT TERMINATION</h4>
                  <p>
                    We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">7. LIMITATION OF LIABILITY</h4>
                  <p>
                    E-AARTH Studios shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">8. CHANGES TO TERMS</h4>
                  <p>
                    We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                id="accept-terms"
              />
              <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
                I have read and agree to the{' '}
                <a href="#" className="text-purple-600 hover:underline font-bold">
                  Terms & Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:underline font-bold">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Continue Button */}
            <button
              disabled={!accepted}
              className={`w-full font-bold py-3.5 rounded-xl transition-all ${
                accepted
                  ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg border-2 border-purple-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ACCEPT & CONTINUE
            </button>

            {/* Security Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your data is secure and protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}