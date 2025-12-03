import React from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eaarthLogo from "../../../assets/eaarth.png";
import { useLogin } from "../hooks/useLogin";
import WebLoginQR from "../components/WebLoginQR";
import { Input } from "../../../shared/components/ui/input";
import DarkmodeButton from "../../../shared/components/DarkmodeButton";

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
    (data) => {
      navigate("/auth/otp-verification", {
        state: {
          email: data.email,
          password: password,
          rememberMe: data.rememberMe,
          otpSend: data.otpSend,
          otp: data.otp,
        },
      });
    },
    (err) => {
      console.error("Login error:", err);
    }
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="w-full">
      <div className="flex justify-end pt-4">
        <DarkmodeButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-30 py-8 pt-4">
        <div className="grid lg:grid-cols-2 gap-6">

          <div className="rounded-3xl p-8 border h-full flex flex-col bg-card dark:bg-linear-to-b from-[#250149] via-[#200352] to-[#0e0021] border-border shadow-md transition-colors">

            <div className="mb-8 text-center">
              <img
                src={eaarthLogo}
                alt="Eaarth Studios"
                className="w-48 h-auto object-contain mx-auto"
              />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[var(--foreground)] dark:text-[var(--foreground-dark)]">
                LOGIN
              </h2>
            </div>

            {error && (
              <div className="bg-[var(--destructive)] text-[var(--destructive-foreground)] p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] mb-2 uppercase tracking-wide">
                  Email Address
                </label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] mb-2 uppercase tracking-wide">
                  Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground-dark)] disabled:opacity-50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground-dark)] font-medium">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/auth/forgot-password")}
                  disabled={loading}
                  className="text-xs font-medium text-[var(--primary)] hover:text-[var(--secondary)] disabled:text-[var(--muted-foreground)] dark:disabled:text-[var(--muted-foreground-dark)]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--lavender-600)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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

          <WebLoginQR />
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>© 2024 Eaarth Studios. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
