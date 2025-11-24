import React from 'react';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useForgotPassword } from '../hooks/useForgotPassword';
import eaarthLogo from '../../../assets/eaarth.png';

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
    navigate('/auth/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">OTP Sent!</h2>
          <p className="text-gray-600">Check your email for the reset code</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative">
      <div className="absolute top-4 left-4">
        <button
          onClick={handleBack}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100 transition-all font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK
        </button>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl">
        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="h-[45px] mx-auto" />
        </div>

        <h2 className="text-2xl font-medium text-center mb-2">Forgot Password?</h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your email to receive a reset code
        </p>

        <form onSubmit={handleFormSubmit} className="w-full space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border shadow-md border-gray-300 focus:ring-2 focus:ring-[#9333ea] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 rounded-xl font-medium text-white bg-[#9333ea] hover:bg-[#9333ea] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="w-full text-gray-700 hover:underline font-medium mt-2 transition-colors disabled:text-gray-400"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;












