import React, { useEffect } from 'react';
import { ArrowLeft, Info, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOTPVerification } from '../hooks/useOTPVerification';
import { useAuth } from '../context/AuthContext';
import eaarthLogo from "../../../assets/eaarth.png";

export const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  
  const email = location.state?.email;
  const password = location.state?.password;
  const rememberMe = location.state?.rememberMe || false;
  const devOtp = location.state?.otp; 

  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { replace: true });
    }
  }, [email, navigate]);

  const {
    otp,
    loading,
    error,
    canResend,
    countdown,
    inputRefs,
    handleInput,
    handleBackspace,
    handleSubmit,
    handleResend,
  } = useOTPVerification(
    (user) => {
      console.log('OTP verified, user authenticated:', user);
 
      updateUser(user);
      navigate('/dashboard', { replace: true });
    },
    // onError
    (err) => {
      console.error('OTP verification error:', err);
    }
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(email);
  };

  const handleResendClick = async (e) => {
    e.preventDefault();
    if (password) {
      await handleResend(email, password, rememberMe);
    } else {
      console.error('Cannot resend: password not available');
    }
  };

  const handleBackClick = () => {
    navigate('/auth/login');
  };

  if (!email) {
    return null; 
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">

      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            OTP VERIFICATION
          </p>
        </div>
        <div className="w-full bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
          <h2 className="text-xl md:text-xl font-medium text-center mb-2 text-gray-900">
            VERIFY YOUR IDENTITY
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Enter the 6-digit code sent to your email
          </p>

          <div className="bg-[#faf5ff] border border-gray-100 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Info className="w-5 h-5 text-[#9333ea]" />
            <p className="text-sm text-gray-700 break-all">
              <span className="font-semibold">Email:</span> {email}
            </p>
          </div>

          {devOtp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">🔧 Dev Mode OTP:</span> {devOtp}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
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
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-xl font-semibold 
                  border border-gray-300 rounded-xl 
                  focus:border-gray-200 focus:ring-2 focus:ring-[#c084fc]
                  outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-[#9333ea] hover:bg-[#7c2cc9] transition-colors text-white font-medium 
              py-4 rounded-2xl hover:transition-all hover:scale-[1.02]
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

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendClick}
              disabled={!canResend || loading || !password}
              className="font-medium text-[#9333ea] hover:text-[#7c2cc9] 
              disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="text-[#9333ea] hover:text-[#7c2cc9] font-medium text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 2 of 4 — OTP Verification
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;