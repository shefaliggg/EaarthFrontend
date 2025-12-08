import React from 'react';
import { Mail, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import eaarthLogo from '../../../assets/eaarth.webp';

export const VerifyEmailPage = ({ onSuccess }) => {
  const { status, message, inviteData } = useVerifyEmail(onSuccess);

  // --------------------------
  // LOADING STATE
  // --------------------------
  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-xl mx-auto">

          {/* Logo + Title */}
          <div className="text-center mb-4">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-36 h-auto mx-auto"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
              Invitation Verification
            </p>
          </div>

          {/* Main Card */}
          <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Verifying Invitation
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Processing your invitation link
                </p>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-6 text-center">

              <div className="relative w-16 h-16 mx-auto mb-4">
                <Mail className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
                </div>
              </div>

              <p className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                Verifying Your Invitation...
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                Please wait while we process your invitation
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
            Step 1 of 5 — Email Verification
          </div>
        </div>
      </div>
    );
  }

  // --------------------------
  // SUCCESS / ERROR STATES
  // --------------------------
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-36 h-auto mx-auto"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Invitation Status
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Verification Status
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Email invitation result
              </p>
            </div>
          </div>

          {/* ---------------- SUCCESS ---------------- */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl p-6 text-center">

                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Invitation Verified!
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Your invitation has been successfully verified
                </p>

                {inviteData?.email && (
                  <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 border border-green-200 dark:border-green-800/30 mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                      Email Address
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
                      {inviteData.email}
                    </p>
                  </div>
                )}

                {inviteData?.userType && (
                  <div className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase">
                    {inviteData.userType}
                  </div>
                )}
              </div>

              {/* Loading Redirect */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4 flex items-center justify-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Redirecting to account setup...
                </span>
              </div>
            </div>
          )}

          {/* ---------------- ERROR ---------------- */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-6 text-center">

                <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Verification Failed
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {message || 'Unable to verify your invitation'}
                </p>
              </div>

              {/* Common Issues Info Box */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Common Issues:
                    </p>
                    <ul className="text-[10px] text-gray-700 dark:text-gray-300 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        Invalid or expired invitation link
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        Link has already been used
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        Email address mismatch
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        Network connectivity issues
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Admin */}
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Need help? Contact your system administrator
                </p>
                <button
                  onClick={() => (window.location.href = '/auth/login')}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors"
                >
                  Return to Login Page
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          {status === 'success' ? 'Step 1 of 5 — Email Verified' : 'Verification Failed'}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;