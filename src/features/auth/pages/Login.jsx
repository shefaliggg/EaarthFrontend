import React, { useState } from "react";
import { Eye, EyeOff, QrCode, Shield, Zap, Film, Loader, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import eaarthLogo from "../../../assets/eaarth.png";

export const LoginPage = ({ onNavigate, onSuccess }) => {
  const navigate = useNavigate();

  /** ---------- Local Component State (replaces useLogin) ---------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** ---------- Local Login Handler (instead of useLogin) ---------- */
  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      // Simulated API call — replace with real API request
      await new Promise((res) => setTimeout(res, 1200));

      const responseData = {
        email,
        userId: "12345",
        requiresOtp: true,
      };
      navigate("/home");
      /** Navigate to OTP */
      // if (onNavigate) onNavigate("otp", responseData);
      // else if (onSuccess) onSuccess(responseData);
      // else navigate("/auth/otp", { state: responseData });

    } catch (err) {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Form Submit Handler */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  /** Forgot Password Handler */
  const handleForgotPassword = () => {
    if (onNavigate) onNavigate("forgot");
    else navigate("/auth/forgot-password");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-30">
      {/* ---------------- Header ---------------- */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-48 h-auto object-contain" />
        </div>
        <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">
          Production Management Platform
        </p>
      </div>

      {/* ---------------- Main Content Grid ---------------- */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* ---------------- Left: Login Form Card ---------------- */}
        <div className="bg-white rounded-4xl shadow-2xl p-10 border">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">LOGIN</h2>
            </div>
            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl
                  focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all
                  text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
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
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all
                    text-sm text-gray-900 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                {/* Toggle show/hide password */}
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
              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={loading}
                />
                <span className="text-xs text-gray-600 font-medium">Remember me</span>
              </label>

              {/* Forgot Password Button */}
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors
                  disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-purple-600 mt-5 to-pink-600 text-white font-bold py-3
                rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md text-sm flex items-center justify-center gap-2"
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

        {/* ---------------- Right: QR Login Section ---------------- */}
        <div className="rounded-4xl shadow-lg border p-10 relative overflow-hidden ">
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-900" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-purple-900">QR CODE LOGIN</h2>
              <p className="text-gray-800 text-sm">Scan with your mobile app</p>
            </div>
          </div>

          {/* QR Code Box */}
          <div className="bg-white rounded-4xl py-10 m-8 mx-12 flex items-center justify-center shadow-md">
            <QRCode value="EAARTH-STUDIOS-LOGIN" size={240} level="H" fgColor="#7C3AED" />
          </div>

          {/* How-To Steps */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm mb-3 text-purple-900">How to use:</h3>

            {[
              "Open Eaarth Studios mobile app",
              "Tap the QR Login button",
              "Scan this code with your camera",
              "You'll be logged in instantly!",
            ].map((t, i) => (
              <div className="flex items-center gap-3" key={i}>
                <div className="w-8 h-8 rounded-md bg-purple-900/20 flex items-center justify-center text-purple-900 text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-800">{t}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-purple-900/20">
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, text: "SECURE" },
                { icon: Zap, text: "INSTANT" },
                { icon: Film, text: "EASY" },
              ].map(({ icon: Icon, text }) => (
                <div className="text-center" key={text}>
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-900" />
                  </div>
                  <p className="text-[10px] font-bold text-purple-900">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Footer ---------------- */}
      <div className="text-center mt-12 text-sm text-gray-500">
        <p>© 2024 Eaarth Studios. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
