import { useState } from 'react';
import { Eye, EyeOff, QrCode, LogIn, ArrowRight, Film, Shield, Zap } from 'lucide-react';
import { motion } from "framer-motion";

import QRCode from 'react-qr-code';

// TODO: replace with your real logo asset
import eaarthLogo from '@/assets/eaarth.png';

export default function LoginForm({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <motion.img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-54 h-auto object-contain"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Main Card Container */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Card - Email/Password Login */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 border-2 border-purple-700 rounded-xl">
                <LogIn className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">EMAIL LOGIN</h2>
                <p className="text-xs text-gray-500">Sign in with your credentials</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-bold py-4 px-6 rounded-xl hover:bg-purple-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] transform border-2 border-purple-800"
              >
                <span>LOGIN</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Skip Button */}
              <button
                type="button"
                onClick={onLogin}
                className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 border-2 border-gray-200 text-sm"
              >
                Skip to Dashboard for Demo
              </button>
            </form>
          </div>

          {/* Right Card - QR Code Login */}
          <div className="bg-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden border-2 border-purple-800">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">QR CODE LOGIN</h2>
                  <p className="text-white/90 text-xs">Instant login via mobile app</p>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="bg-white rounded-2xl p-4 my-5">
                <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center p-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* QR Code Pattern */}
                    {/* Top-left corner */}
                    <rect x="5" y="5" width="20" height="20" fill="#6B21A8" rx="3" />
                    <rect x="10" y="10" width="10" height="10" fill="white" rx="2" />
                    
                    {/* Top-right corner */}
                    <rect x="75" y="5" width="20" height="20" fill="#6B21A8" rx="3" />
                    <rect x="80" y="10" width="10" height="10" fill="white" rx="2" />
                    
                    {/* Bottom-left corner */}
                    <rect x="5" y="75" width="20" height="20" fill="#6B21A8" rx="3" />
                    <rect x="10" y="80" width="10" height="10" fill="white" rx="2" />
                    
                    {/* QR pattern blocks */}
                    <rect x="30" y="7" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="38" y="7" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="50" y="7" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="58" y="7" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="30" y="15" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="38" y="15" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="50" y="18" width="8" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="7" y="30" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="15" y="30" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="7" y="38" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="15" y="41" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="30" y="30" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="42" y="30" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="52" y="30" width="8" height="8" fill="#6B21A8" rx="1" />
                    <rect x="30" y="38" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="42" y="41" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="65" y="30" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="77" y="30" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="88" y="30" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="65" y="38" width="5" height="8" fill="#6B21A8" rx="1" />
                    
                    <rect x="42" y="50" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="52" y="52" width="8" height="8" fill="#6B21A8" rx="1" />
                    <rect x="42" y="58" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="65" y="50" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="77" y="50" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="88" y="52" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="65" y="58" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="7" y="50" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="15" y="50" width="8" height="8" fill="#6B21A8" rx="1" />
                    <rect x="7" y="58" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="30" y="50" width="8" height="5" fill="#6B21A8" rx="1" />
                    <rect x="30" y="58" width="5" height="8" fill="#6B21A8" rx="1" />
                    
                    <rect x="30" y="70" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="38" y="70" width="8" height="8" fill="#6B21A8" rx="1" />
                    <rect x="50" y="70" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="30" y="78" width="8" height="5" fill="#6B21A8" rx="1" />
                    
                    <rect x="58" y="70" width="5" height="5" fill="#6B21A8" rx="1" />
                    <rect x="65" y="70" width="8" height="8" fill="#6B21A8" rx="1" />
                    <rect x="77" y="70" width="5" height="8" fill="#6B21A8" rx="1" />
                    <rect x="88" y="75" width="5" height="5" fill="#6B21A8" rx="1" />
                    
                    {/* Center logo */}
                    <circle cx="50" cy="50" r="8" fill="white" />
                    <text x="50" y="55" fontSize="10" fontWeight="bold" fill="#6B21A8" textAnchor="middle">E</text>
                  </svg>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">HOW TO LOGIN:</h3>
                    <ol className="space-y-1.5 text-sm text-white/90">
                      <li>1. Open <strong>Eaarth Studios App</strong> on your phone</li>
                      <li>2. Tap the <strong>QR Scan</strong> icon</li>
                      <li>3. Point camera at this QR code</li>
                      <li>4. Confirm login on your device</li>
                    </ol>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="font-medium">Active - Ready to Scan</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80">
                <Shield className="w-4 h-4" />
                <span>Secure encrypted connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2025 Eaarth Studios. All Rights Reserved. | Multi-Tenant Production Platform
          <br />
          <button
            onClick={() => onNavigate('master-admin-login')}
            className="mt-2 text-xs text-purple-600 hover:text-purple-700 hover:underline font-bold"
          >
            🔐 Master Admin Access
          </button>
        </div>
      </div>
    </div>
  );
}