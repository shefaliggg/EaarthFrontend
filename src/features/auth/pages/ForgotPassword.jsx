import React from 'react';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import eaarthLogo from '../../../assets/eaarth.webp';

export const ForgotPasswordPage = ({ onNavigate, onBack, onSuccess }) => {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  } = useForgotPassword(
    (data) => {
      if (onNavigate) return onNavigate('reset', data);
      if (onSuccess) return onSuccess(data);

      navigate('/auth/reset-password', {
        state: { email: data.email },
      });
    },
    (err) => console.error(err)
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleBack = () => {
    if (onBack) return onBack();
    if (onNavigate) return onNavigate('login');
    navigate('/auth/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">OTP Sent!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Check your email for the reset code</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4  transition-colors">

      <button
        onClick={handleBack}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto " />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Forgot Password
          </p>
        </div>

        <div className="bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Reset Your Password
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Enter your email to receive a reset code
          </p>

          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-3 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                  focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all
                  text-sm text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-gray-400 dark:placeholder:text-gray-500 h-10"
              />
            </div>

            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={loading || !email}
              className="w-full bg-purple-600 text-white font-semibold py-3
                rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>SENDING...</span>
                </>
              ) : (
                'SEND OTP'
              )}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 1 of 2 — Password Recovery
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;