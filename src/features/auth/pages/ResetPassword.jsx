import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eaarthLogo from "../../../assets/eaarth.webp";
import { Input } from "../../../shared/components/ui/input";
import { useResetPassword } from '../hooks/useResetPassword';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('resetPasswordEmail');

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('resetPasswordEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/auth/forgot-password');
    }
  }, [location.state, navigate]);

  const {
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useResetPassword(() => {
    localStorage.removeItem('resetPasswordEmail');
    navigate('/auth/login');
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Email not found. Please request a new OTP.');
      navigate('/auth/forgot-password');
      return;
    }

    await handleSubmit(email);
  };

  if (!email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      <button
        onClick={() => {
          localStorage.removeItem('resetPasswordEmail');
          navigate('/auth/forgot-password');
        }}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Reset Password
          </p>
        </div>

        <div className="bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Create New Password
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>

          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                OTP Code
              </label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                className="text-center text-lg tracking-widest h-10"
              />
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                Check your email for the verification code
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                  className="pr-10 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                  className="pr-10 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Password Requirements:
              </p>
              <ul className="space-y-1 text-[10px] text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">•</span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">•</span>
                  Contains uppercase & lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">•</span>
                  Includes numbers & special characters
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !otp || !newPassword || !confirmPassword}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>RESETTING...</span>
                </>
              ) : (
                'RESET PASSWORD'
              )}
            </button>

          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                localStorage.removeItem('resetPasswordEmail');
                navigate('/auth/forgot-password', { state: { email } });
              }}
              disabled={loading}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn't receive OTP? Request new one
            </button>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 2 of 2 — Password Recovery
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;