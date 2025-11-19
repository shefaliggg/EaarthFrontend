import { useState } from 'react';
import { EyeOff, QrCode, LogIn, Film, Shield, Zap } from 'lucide-react';
import QRCode from 'react-qr-code';
import eaarthLogo from '../../../assets/eaarth.png';

export default function Login() {
    return (
        <div className="w-full max-w-7xl mx-auto px-30">

            {/* ---------------- Header ---------------- */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                    <img
                        src={eaarthLogo}
                        alt="Eaarth Studios"
                        className="w-48 h-auto object-contain"
                    />
                </div>
                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">
                    Production Management Platform
                </p>
            </div>

            {/* ---------------- Main Content ---------------- */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* ---------------- Left Card ---------------- */}
                <div className="bg-white rounded-4xl shadow-2xl p-10 border">

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                <LogIn className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">LOGIN</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-900"
                                disabled
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-900 pr-12"
                                    disabled
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                                    disabled
                                >
                                    <EyeOff className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 opacity-60">
                                <input type="checkbox" className="w-4 h-4 rounded" disabled />
                                <span className="text-xs text-gray-600 font-medium">Remember me</span>
                            </label>

                            <button
                                type="button"
                                className="text-xs font-semibold text-gray-400"
                                disabled
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="button"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl opacity-60 cursor-not-allowed shadow-md text-sm"
                            disabled
                        >
                            LOGIN
                        </button>

                    </form>

                    {/* Signup */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-600">
                            Don't have an account?
                            <span className="font-bold text-gray-400 ml-2 cursor-not-allowed">Sign up with invite</span>
                        </p>
                    </div>

                </div>

                {/* ---------------- Right QR Section ---------------- */}
                <div className=" rounded-4xl shadow-lg border p-10 relative overflow-hidden">

                    <div className="absolute inset-0  opacity-80 -z-10"></div>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-purple-900" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-purple-900">QR CODE LOGIN</h2>
                            <p className="text-gray-800 text-sm">Scan with your mobile app</p>
                        </div>
                    </div>

                    {/* QR */}
                    <div className="bg-white rounded-4xl py-10 m-8  mx-12 flex items-center justify-center shadow-md">
                        <QRCode
                            value="STATIC-DEMO"
                            size={240}
                            level="H"
                            fgColor="#7C3AED"
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm mb-3 text-purple-900">How to use:</h3>

                        {[
                            "Open Eaarth Studios mobile app",
                            "Tap the QR Login button",
                            "Scan this code with your camera",
                            "You'll be logged in instantly!"
                        ].map((t, i) => (
                            <div className="flex items-start gap-3" key={i}>
                                <div className="w-8 h-8 rounded-md bg-purple-900/20 flex items-center justify-center text-purple-900 text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-xs text-gray-800">{t}</p>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="mt-8 pt-8 border-t border-purple-900/20">
                        <div className="grid grid-cols-3 gap-4">

                            {[{ icon: Shield, text: "SECURE" },
                            { icon: Zap, text: "INSTANT" },
                            { icon: Film, text: "EASY" }].map(({ icon: Icon, text }) => (
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

            {/* ---------------- Footer ---------------- */}
            <div className="text-center mt-12 text-sm text-gray-500">
                <p>© 2024 Eaarth Studios. All rights reserved.</p>
            </div>

        </div>
    );
}