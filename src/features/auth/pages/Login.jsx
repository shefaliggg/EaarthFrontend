import React from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eaarthLogo from "../../../assets/eaarth.webp";
import { useLogin } from "../hooks/useLogin";
import WebLoginQR from "../components/WebLoginQR";
import { Input } from "../../../shared/components/ui/input";

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
  } = useLogin();

  return (
    <div className="w-full flex py-6 items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT PANEL - LOGIN FORM */}
          <div className="rounded-3xl py-6 px-8 bg-card border-border shadow-md transition-colors h-full flex flex-col">

            <div className="text-center mb-2">
              <img src={eaarthLogo} alt="Eaarth" className="w-36 mx-auto" />
            </div>

            <h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              Sign in to Eaarth
            </h2>
            <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
              Enter your trusted email address to continue
            </p>

            {error && (
              <div className="bg-red-600/20 text-red-300 p-2 rounded-lg mb-3 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4 flex-1 flex flex-col">

              {/* Email */}
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Email address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="h-10 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                    className="pr-10 h-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <span className="text-[10px] text-gray-600 dark:text-gray-400">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/auth/forgot-password")}
                  disabled={loading}
                  className="text-[10px] font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-purple-600 text-white 
                  hover:bg-purple-700 flex items-center justify-center gap-2 
                  disabled:opacity-50 transition-colors font-semibold"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    LOGGING IN...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <p className="text-center text-[10px] text-gray-500 dark:text-gray-500">
                Protected by Eaarth Secure Access
              </p>

            </div>
          </div>

          {/* RIGHT PANEL - QR LOGIN */}
          <WebLoginQR />
        </div>

        <p className="text-center text-xs mt-8 text-gray-600 dark:text-gray-400">
          © 2025 Eaarth Studios. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
