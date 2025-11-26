import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader } from 'lucide-react';
import { useTemporaryLogin } from '../hooks/useTemporaryLogin';
import eaarthLogo from '../../../assets/eaarth.png';

export const TemporaryLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');

  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleSubmit,
  } = useTemporaryLogin((data) => {
    // On success, navigate to set password
    navigate('/auth/set-password', {
      state: {
        userId: data.userId,
        email: data.email,
        ...location.state,
      },
    });
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(email);
  };

  const handleBackClick = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-medium text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            BACK
          </button>
        </div>

        <div className="w-full bg-white rounded-2xl overflow-hidden">
          <div className="px-6 md:px-8 py-8 text-center">
            <img
              src={eaarthLogo}
              alt="Eaarth Studios"
              className="w-40 h-auto mx-auto mb-4"
            />
            <h2 className="text-xl md:text-xl font-medium text-gray-800 mb-2">
              TEMPORARY LOGIN
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Use the temporary password sent to your email
            </p>
          </div>

          <div className="px-6 md:px-8 py-8">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  disabled={!!location.state?.email || loading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent placeholder:text-gray-400 outline-none transition-all ${
                    (location.state?.email || loading) ? 'bg-gray-100 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  TEMPORARY PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER TEMPORARY PASSWORD"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent placeholder:text-gray-400 outline-none transition-all disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !email}
                className="w-full bg-gradient-to-r from-[#9333ea] to-pink-600 text-white font-medium py-3.5 rounded-2xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    VERIFYING...
                  </>
                ) : (
                  'CONTINUE'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={handleBackClick}
                className="text-[#9333ea] hover:text-[#7c2cc9] font-medium text-sm transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporaryLoginPage;