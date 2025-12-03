import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTemporaryLogin from '../hooks/useTemporaryLogin';
import eaarthLogo from '../../../assets/eaarth.png';
import { Input } from "../../../shared/components/ui/input";

export const TemporaryLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const propEmail = location.state?.email || null;
  const [email, setEmail] = useState(propEmail || '');

  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleSubmit,
  } = useTemporaryLogin();

  const handleBackClick = () => {
    navigate('/auth/login');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const result = await handleSubmit(email);

    if (result && result.success) {
      navigate('/auth/set-password', {
        replace: true,
        state: {
          userId: result.userId,
          email: result.email,
        },
      });
    }
  };

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
            className="w-36 h-auto mx-auto"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Temporary Login
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Temporary Access
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Enter the temporary password sent to your email
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={!!propEmail || loading}
                className={`h-10 text-sm ${propEmail ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Temporary Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Temporary Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  required
                  disabled={loading}
                  className="pr-10 h-10 text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !email}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                'CONTINUE'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              disabled={loading}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 1 of 5 — Temporary Login
        </div>
      </div>
    </div>
  );
};

export default TemporaryLoginPage;