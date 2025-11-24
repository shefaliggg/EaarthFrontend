import React from 'react';
import { Mail, Loader, CheckCircle, XCircle } from 'lucide-react';
// import { useVerifyEmail } from '../hooks/useVerifyEmail';
import eaarthLogo from '../../../assets/eaarth.png';

export const VerifyEmailPage = ({ onSuccess }) => {
  const { status, message, inviteData } = useVerifyEmail(onSuccess);

  const LogoSection = (
    <div className="text-center mb-6">
      <img
        src={eaarthLogo}
        alt="Eaarth Studios"
        className="w-40 h-auto mx-auto mb-3"
      />
      <p className="text-sm text-gray-600 tracking-wide font-semibold">
        INVITATION VERIFICATION
      </p>
    </div>
  );

  // --------------------------
  // Loading State
  // --------------------------
  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-lg mx-auto">
          {LogoSection}

          <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#ede7f6] to-pink-100 rounded-full flex items-center justify-center">
                <Loader className="w-10 h-10 animate-spin text-[#7e57c2]" />
              </div>

              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Verifying Your Invitation
              </h2>
              <p className="text-gray-600 text-sm">
                Please wait while we process your invitation link...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------
  // Main Page (Success or Error)
  // --------------------------
  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 bg-gray-50">
      <div className="w-full max-w-lg mx-auto mt-10">
        {LogoSection}

        <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9575cd] to-pink-500 flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-xl font-medium text-gray-900">
                INVITATION STATUS
              </h2>
              <p className="text-xs text-gray-500">Email verification result</p>
            </div>
          </div>

          {/* ---------------- SUCCESS ---------------- */}
          {status === 'success' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h3 className="text-xl md:text-xl font-medium text-green-900 mb-3">
                  INVITATION VERIFIED!
                </h3>

                <p className="text-sm text-green-700 mb-2">
                  Your invitation has been successfully verified
                </p>

                {inviteData?.email && (
                  <div className="mt-4 bg-white/60 rounded-xl p-3 border border-green-200">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Email:</p>
                    <p className="text-sm font-medium text-green-900 break-all">
                      {inviteData.email}
                    </p>
                  </div>
                )}

                {inviteData?.userType && (
                  <div className="mt-3 inline-block bg-[#ede7f6] text-[#7e57c2] px-4 py-1 rounded-full text-xs font-medium">
                    {inviteData.userType.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 py-4">
                <Loader className="w-5 h-5 animate-spin text-[#7e57c2]" />
                <span className="text-sm font-medium text-gray-600">
                  Redirecting to setup...
                </span>
              </div>
            </div>
          )}

          {/* ---------------- ERROR ---------------- */}
          {status === 'error' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-300 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h3 className="text-xl md:text-xl font-medium text-red-900 mb-3">
                  VERIFICATION FAILED
                </h3>

                <p className="text-sm text-red-700 mb-4">
                  {message || 'Unable to verify your invitation'}
                </p>

                <div className="bg-white/60 rounded-xl p-4 border border-red-200">
                  <p className="text-xs text-gray-600 mb-2">Possible reasons:</p>
                  <ul className="text-left text-xs text-gray-700 space-y-1">
                    <li>• Invalid or expired invitation link</li>
                    <li>• Link has already been used</li>
                    <li>• Email address mismatch</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Need help? Contact your administrator
                </p>
                <button
                  onClick={() => (window.location.href = '/auth/login')}
                  className="text-[#7e57c2] hover:text-[#7e57c2] font-medium text-sm transition-colors"
                >
                  Return to Login
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-500 text-xs">
          © 2024 Eaarth Studios. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;








