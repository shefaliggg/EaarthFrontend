import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Info, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOTPVerification } from '../hooks/useOTPVerification';
import { useAuth } from '../context/AuthContext';
import eaarthLogo from "../../../assets/eaarth.png";
import { Input } from "../../../shared/components/ui/input";

export const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const email = location.state?.email;
  const password = location.state?.password;
  const rememberMe = location.state?.rememberMe || false;
  const devOtp = location.state?.otp;

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
    if (password) await handleResend(email, password, rememberMe);
  };

  const handleBackClick = () => navigate('/auth/login');

  if (!email) return null;

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 bg-[var(--background)]  transition-colors">

      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/10 dark:hover:bg-gray-700/30 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-[var(--foreground)] dark:text-[var(--foreground-dark)]" />
      </button>

      <div className="w-full max-w-lg mx-auto ">
  
        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] font-semibold tracking-wide">OTP VERIFICATION</p>
        </div>

        <div className="bg-[var(--card)] dark:bg-slate-800 border  rounded-3xl p-8 shadow-md transition-colors">

          <h2 className="text-2xl font-bold text-center mb-2 text-[var(--foreground)] dark:text-[var(--foreground-dark)]">
            VERIFY YOUR IDENTITY
          </h2>
          <p className="text-center text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] mb-6">
            Enter the 6-digit code sent to your email
          </p>

          <div className="bg-[var(--muted)] dark:bg-[var(--muted-dark)]  rounded-xl p-4 mb-6 flex items-center gap-3">
            <Info className="w-5 h-5 text-[var(--primary)]" />
            <p className="text-sm text-[var(--foreground)] dark:text-[var(--foreground-dark)] break-all">
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
            <div className="bg-[var(--destructive)] text-[var(--destructive-foreground)] p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center mb-6">
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
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-semibold border border-[var(--border)] dark:border-[var(--border-dark)] rounded-xl focus:ring-[var(--ring)] focus:border-[var(--primary)]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-[var(--primary)] hover:bg-[var(--lavender-600)] transition-colors text-[var(--primary-foreground)] dark:text-[var(--primary-foreground-dark)] font-medium py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : 'VERIFY'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendClick}
              disabled={!canResend || loading || !password}
              className="font-medium text-[var(--primary)] hover:text-[var(--lavender-600)] disabled:text-[var(--muted-foreground)] dark:disabled:text-[var(--muted-foreground-dark)] transition-colors"
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="text-[var(--primary)] hover:text-[var(--lavender-600)] font-medium text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>

        </div>

        <div className="text-center mt-6 text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)]">
          Step 2 of 4 — OTP Verification
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
