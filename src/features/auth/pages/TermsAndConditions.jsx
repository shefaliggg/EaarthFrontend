import { useState } from 'react';
import { ArrowLeft, Shield, Loader } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-start justify-center p-4">

      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-3xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground font-semibold tracking-wide">
            TERMS & CONDITIONS
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="p-6 text-center">
            <h2 className="text-2xl font-medium text-foreground mb-2">
              TERMS & CONDITIONS
            </h2>
            <p className="text-sm text-muted-foreground">
              Please review and accept our terms to proceed
            </p>
          </div>

          {/* Scrollable Terms */}
          <div className="px-6 pb-6 md:px-8">
            <div className="bg-muted border border-border p-5 rounded-xl max-h-80 overflow-y-auto mb-5">
              <h3 className="font-semibold text-primary mb-2 text-base">
                E-AARTH PLATFORM TERMS & CONDITIONS
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Version 1.0 | Last Updated: November 13, 2025
              </p>

              <div className="space-y-3.5 text-sm text-muted-foreground">

                <section>
                  <h4 className="font-semibold text-foreground mb-1">1. ACCEPTANCE OF TERMS</h4>
                  <p>
                    By using the E-AARTH platform, you acknowledge that you agree to be bound by these Terms and Conditions.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">2. USER RESPONSIBILITIES</h4>
                  <p>
                    You are responsible for keeping your account credentials secure and for all activity under your account.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">3. DATA PRIVACY</h4>
                  <p>
                    We are committed to protecting your personal information, which will be handled according to our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">4. PLATFORM USAGE</h4>
                  <p>
                    You agree not to misuse the platform, disrupt services, or violate applicable laws.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">5. INTELLECTUAL PROPERTY</h4>
                  <p>
                    All platform content and features are owned by E-AARTH Studios and protected by copyright laws.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">6. ACCOUNT TERMINATION</h4>
                  <p>
                    We may suspend or terminate your account for violations of these terms.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">7. LIMITATION OF LIABILITY</h4>
                  <p>
                    E-AARTH is not liable for indirect or consequential damages arising from use of the platform.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-1">8. CHANGES TO TERMS</h4>
                  <p>
                    We may modify these terms anytime. Continued use of the platform indicates acceptance.
                  </p>
                </section>

              </div>
            </div>

            {/* Accept Checkbox */}
            <div className="flex items-start gap-3 mb-5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-2 focus:ring-lavender-50 cursor-pointer disabled:opacity-50"
                id="accept-terms"
              />

              <label htmlFor="accept-terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I have read and agree to the{' '}
                <span className="text-primary font-semibold hover:underline">Terms & Conditions</span>{' '}
                and{' '}
                <span className="text-primary font-semibold hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleContinue}
              disabled={!accepted || loading}
              className={`w-full py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${accepted && !loading
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  COMPLETING SETUP...
                </>
              ) : (
                'ACCEPT & CONTINUE'
              )}
            </button>

            {/* Security Note */}
            <div className="mt-3.5 flex items-center justify-center text-xs gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Your data is protected & encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Final Step — Accept Terms & Conditions
        </div>
      </div>
    </div>
  );
}