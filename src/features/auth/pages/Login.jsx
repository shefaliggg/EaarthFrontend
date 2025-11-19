import { useState } from 'react';
import { Eye, EyeOff, QrCode, LogIn, ArrowRight, Film, Shield, Zap } from 'lucide-react';
import { motion } from "framer-motion";

import QRCode from 'react-qr-code';
// import eaarthLogo from 'figma:asset/7a01459921a79f8171eb1d487d40590f7bfe0d1e.png';

export default function Login() {
  // ------------------------------
  // 💬 COMMENTED OUT FUNCTIONALITY
  // ------------------------------

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [showPassword, setShowPassword] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onLoginSuccess();
  // };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">

      {/* Simple Elegant Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <img 
            // src={eaarthLogo} 
            alt="Eaarth Studios"
            className="w-64 h-auto object-contain"
          />
        </div>
        <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">
          Production Management Platform
        </p>
      </div>

      {/* Main Content */}  
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* Left Side — Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-lavender-100">

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender-400 to-pastel-pink-400 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900">LOGIN</h2>
            </div>
            <p className="text-gray-500 text-sm ml-15">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 outline-none transition-all text-gray-900"
                disabled
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                Password
              </label>
              <div className="relative">

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 outline-none transition-all text-gray-900 pr-12"
                  disabled
                />

                {/* Password toggle — disabled */}
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                  disabled
                >
                  <EyeOff className="w-5 h-5" />
                </button>

              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer opacity-50">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-sm text-gray-600 font-bold">Remember me</span>
              </label>

              <button 
                type="button" 
                className="text-sm font-bold text-gray-400"
                disabled
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="w-full bg-gradient-to-r from-lavender-300 to-pastel-pink-300 text-white font-bold py-4 rounded-xl opacity-60 cursor-not-allowed"
              disabled
            >
              LOGIN
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-gray-500 bg-white font-bold">OR</span>
              </div>
            </div>

            {/* Three quick access buttons */}
            <div className="grid grid-cols-3 gap-3">

              <div className="flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-xl opacity-50">
                <Shield className="w-6 h-6 text-sky-600" />
                <span className="text-xs font-bold text-sky-700">ADMIN</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 bg-mint-50 border-2 border-mint-200 rounded-xl opacity-50">
                <QrCode className="w-6 h-6 text-mint-600" />
                <span className="text-xs font-bold text-mint-700">QR CODE</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 bg-peach-50 border-2 border-peach-200 rounded-xl opacity-50">
                <Zap className="w-6 h-6 text-peach-600" />
                <span className="text-xs font-bold text-peach-700">DEMO</span>
              </div>

            </div>

          </form>

          {/* Signup Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <span className="font-bold text-gray-400 ml-2">Sign up with invite</span>
            </p>
          </div>

        </div>

        {/* RIGHT SIDE — QR Code Section */}
        <div className="bg-gradient-to-br from-lavender-500 via-pastel-pink-500 to-peach-500 rounded-3xl shadow-2xl p-10 relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-lavender-600 via-pastel-pink-600 to-peach-600 opacity-95 -z-10"></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-900" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-purple-900">QR CODE LOGIN</h2>
              <p className="text-gray-800 text-sm">Scan with your mobile app</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-8 mb-8 flex items-center justify-center">
            <QRCode
              value="STATIC-DEMO"
              size={240}
              level="H"
              fgColor="#7C3AED"
            />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 text-purple-900">How to use:</h3>

            {["Open Eaarth Studios mobile app", "Tap the QR Login button", "Scan this code with your camera", "You'll be logged in instantly!"].map((t, i) => (
              <div className="flex items-start gap-4" key={i}>
                <div className="w-8 h-8 rounded-lg bg-purple-900/20 flex items-center justify-center font-bold shrink-0 text-purple-900">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-800">{t}</p>
              </div>
            ))}

          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-purple-900/20">
            <div className="grid grid-cols-3 gap-4">

              {[{icon: Shield, text: "SECURE"},
                {icon: Zap, text: "INSTANT"},
                {icon: Film, text: "EASY"}].map(({icon: Icon, text}) => (
                <div className="text-center" key={text}>
                  <div className="w-12 h-12 mx-auto mb-2 bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-900" />
                  </div>
                  <p className="text-xs font-bold text-purple-900">{text}</p>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-500">
        <p>© 2024 Eaarth Studios. All rights reserved.</p>
      </div>

    </div>
  );
}
