import React from 'react';
import { ArrowLeft, Info, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useOTPVerification } from '../hooks/useOTPVerification';
import eaarthLogo from "../../../../src/assets/eaarth.png";

export const OTPVerificationPage = ({ email: propEmail, onSuccess, onBack, onNavigate }) => {
  const navigate = useNavigate();
  const [email] = React.useState(propEmail || 'example@email.com');
  
  const {
    otp,
    loading,
    error,
    setError,
    canResend,
    countdown,
    inputRefs,
    handleInput,
    handleBackspace,
    handleSubmit,
    handleResend,
  } = useOTPVerification(onSuccess, (err) => console.error(err));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(email);
    
    // If successful and no custom handler, navigate
    if (result && !onSuccess) {
      if (onNavigate) {
        onNavigate('dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleResendClick = async (e) => {
    e.preventDefault();
    await handleResend(email);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('login');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-lg mx-auto">
        {/* Logo + Title (OUTSIDE CARD) */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            OTP VERIFICATION
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border-2 border-purple-100">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-900">
            VERIFY YOUR IDENTITY
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Enter the 6-digit code sent to your email
          </p>

          {/* Email Info Box */}
          <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Info className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-700 break-all">
              <span className="font-semibold">Email:</span> {email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            {/* OTP Inputs */}
            <div className="flex gap-3 justify-center mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleBackspace(i, e)}
                  disabled={loading}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold 
                  border-2 border-gray-300 rounded-xl 
                  focus:border-purple-600 focus:ring-2 focus:ring-purple-300
                  outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold 
              py-4 rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                'VERIFY'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendClick}
              disabled={!canResend || loading}
              className="font-medium text-purple-600 hover:text-purple-700 
              disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="text-purple-600 hover:text-purple-700 font-bold text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 3 of 4 — OTP Verification
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
