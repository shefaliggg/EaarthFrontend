import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Info, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOTPVerification } from '../hooks/useOTPVerification';
import { useAuth } from '../context/AuthContext';
import eaarthLogo from "../../../assets/eaarth.webp";
import { Input } from "../../../shared/components/ui/input";

export const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const email = location.state?.email;
  const password = location.state?.password;
  const rememberMe = location.state?.rememberMe || false;
  const [devOtp, setDevOtp] = useState(location.state?.otp || null);

  useEffect(() => {
    if (!email) navigate('/auth/login', { replace: true });
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
      updateUser(user);
      navigate('/home', { replace: true });
    },
    (err) => console.error('OTP verification error:', err)
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(email);
  };

  const handleResendClick = async (e) => {
    e.preventDefault();
    if (password) {
      setDevOtp("Requesting Otp");
      const resentResponse = await handleResend(email, password, rememberMe);
      setDevOtp(resentResponse?.data?.otp || null);
    }
  };

  const handleBackClick = () => navigate('/auth/login');

  if (!email) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md mx-auto">

        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto " />
          <p className="text-xs text-muted-foreground font-semibold tracking-wide">OTP VERIFICATION</p>
        </div>

        <div className="bg-card dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] border border-border rounded-3xl p-6 shadow-md transition-colors">

          <h2 className="text-xl font-bold text-center mb-2 text-foreground">
            VERIFY YOUR IDENTITY
          </h2>
          <p className="text-center text-xs text-muted-foreground mb-4">
            Enter the 6-digit code sent to your email
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-foreground break-all">
              <span className="font-semibold">Email:</span> {email}
            </p>
          </div>

          {devOtp && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <span className="font-semibold">🔧 Dev Mode OTP:</span> {devOtp}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-2 justify-center mb-4">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleBackspace(i, e)}
                  disabled={loading}
                  className="w-10 h-12 md:w-12 md:h-12 text-center text-lg font-semibold  border dark:border-foreground/50 rounded-xl focus:ring-2 focus:ring-purple-600"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-primary hover:bg-purple-700 transition-colors text-primary-foreground font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">VERIFYING...</span>
                </>
              ) : (
                <span className="text-sm">VERIFY</span>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendClick}
              disabled={!canResend || loading || !password}
              className="font-medium text-primary hover:text-purple-700 disabled:text-muted-foreground transition-colors text-sm"
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </button>
          </div>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={handleBackClick}
              className="text-primary hover:text-purple-700 font-medium text-xs transition-colors"
            >
              Back to Login
            </button>
          </div>

        </div>

        <div className="text-center mt-4 text-xs text-muted-foreground">
          Step 2 of 4 — OTP Verification
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;