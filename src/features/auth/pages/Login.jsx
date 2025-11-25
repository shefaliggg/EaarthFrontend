import React from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eaarthLogo from "../../../assets/eaarth.png";
import QRLogin from "../components/QRLogin";
import { useLogin } from "../hooks/useLogin";

export const LoginPage = () => {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    handleSubmit,
  } = useLogin(
    // onSuccess callback - navigate to OTP page with data
    (data) => {
      navigate("/auth/otp-verification", { 
        state: {
          email: data.email,
          password: password, // Pass password for resend
          rememberMe: data.rememberMe,
          otpSend: data.otpSend,
          otp: data.otp, // Only in dev mode
        }
      });
    },
    // onError callback
    (err) => {
      console.error("Login error:", err);
    }
  );

  /** Form Submit Handler */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  /** Forgot Password Handler */
  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-30 py-8">
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Login Form Card */}
        <div className="bg-white rounded-3xl p-8 border h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img src={eaarthLogo} alt="Eaarth Studios" className="w-48 h-auto object-contain mx-auto" />
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">LOGIN</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:border-gray-200 focus:ring-2 focus:ring-[#faf5ff] outline-none transition-all
                  text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                    focus:border-gray-200 focus:ring-2 focus:ring-[#faf5ff] outline-none transition-all
                    text-sm text-gray-900 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                    transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#9333ea] focus:ring-[#a855f7]"
                  disabled={loading}
                />
                <span className="text-xs text-gray-600 font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs font-medium text-[#9333ea] hover:text-[#a855f7] transition-colors
                  disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#9333ea] mt-2 text-white font-medium py-2.5
                rounded-xl hover:bg-[#7c2cc9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>LOGGING IN...</span>
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>
        <QRLogin />
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-500">
        <p>© 2024 Eaarth Studios. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;