import React from 'react';
import { Eye, EyeOff, ArrowLeft, Info, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useSetPassword } from '../hooks/useSetPassword';

export const SetPasswordPage = ({ userId, email: propEmail, onSuccess, onBack, onComplete }) => {
  const navigate = useNavigate();
  const email = propEmail || 'user@example.com';

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
  } = useSetPassword(onSuccess);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleSubmit(userId, email);

    if (!ok) return;

    if (!onSuccess && !onComplete) {
      navigate('/auth/login');
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBackClick = () => onBack?.() ?? navigate('/auth/temp-login');
  const handleBackToLogin = () => navigate('/auth/login');

  // Success State Screen
  if (success) {
    return (
      <div className="w-full max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Password Set Successfully!
          </h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-medium text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK
        </button>
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 py-8 text-center">
          <h2 className="text-2xl md:text-2xl font-medium text-gray-800 mb-2">SET YOUR PASSWORD</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Create a new password to secure your account
          </p>
        </div>

        {/* Email Banner */}
        <div className="px-6 md:px-10">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 break-all">
              <span className="font-medium">EMAIL:</span> {email}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 md:px-8 pb-10">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">NEW PASSWORD *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENTER NEW PASSWORD"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 
                    focus:ring-[#9575cd] focus:border-transparent placeholder:text-gray-400 outline-none 
                    transition-all disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                    transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">CONFIRM PASSWORD *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="RE-ENTER PASSWORD"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 
                    focus:ring-[#9575cd] focus:border-transparent placeholder:text-gray-400 outline-none 
                    transition-all disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                    transition-colors disabled:opacity-50"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Password must include:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>8+ characters</li>
                <li>Uppercase letter (A-Z)</li>
                <li>Lowercase letter (a-z)</li>
                <li>Number (0-9)</li>
                <li>Special character (!@#$%^&*)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full bg-[#7e57c2] hover:bg-[#7e57c2] transition-colors text-white font-medium 
                py-3.5 rounded-2xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-[#7e57c2] hover:text-[#9575cd] font-medium text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;








