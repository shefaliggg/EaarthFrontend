import { Eye, EyeOff, ArrowLeft, Info, Loader, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSetPassword from '../hooks/useSetPassword';
import eaarthLogo from '../../../assets/eaarth.webp';
import { Input } from "../../../shared/components/ui/input";

export const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  const email = location.state?.email || 'user@example.com';

  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    error,
    success,
    handleSubmit,
  } = useSetPassword();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(userId, email);

    if (result && result.success) {
      setTimeout(() => {
        navigate('/auth/upload-id', {
          replace: true,
          state: { email, userId },
        });
      }, 1500);
    }
  };

  const handleBackClick = () => navigate('/auth/temp-login');
  const handleBackToLogin = () => navigate('/auth/login');

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 transition-colors">
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-md text-center transition-colors">
            <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Password Set Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Redirecting to ID upload...</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PAGE UI
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-36 h-auto mx-auto "
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Set New Password
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Create Your Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Create a new password to secure your account
            </p>
          </div>

          {/* Email Banner */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-3 mb-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <p className="text-xs text-gray-900 dark:text-gray-100 break-all">
              <span className="font-semibold">Email:</span> {email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleFormSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="pr-10 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                  className="pr-10 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password Guidelines */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  SETTING PASSWORD...
                </>
              ) : (
                'CONTINUE'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <button
              onClick={handleBackToLogin}
              disabled={loading}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 2 of 5 — Set Password
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;