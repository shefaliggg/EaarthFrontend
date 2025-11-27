import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTemporaryLogin from '../hooks/useTemporaryLogin';
import eaarthLogo from '../../../assets/eaarth.png';

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
    <div className="min-h-screen w-full flex items-start justify-center p-4">

      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-lg mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            TEMPORARY LOGIN
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-card rounded-3xl p-8 md:p-10 border border-gray-100">

          {/* Header */}
          <h2 className="text-2xl md:text-2xl font-medium text-center mb-3 text-foreground">
            TEMPORARY LOGIN
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Enter the temporary password sent to your email
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-destructive p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={!!propEmail || loading}
                className={`w-full px-4 py-3.5 bg-input border border-border rounded-xl
                  focus:border-border focus:ring-2 focus:ring-lavender-50 outline-none transition-all
                  text-sm text-foreground disabled:bg-muted disabled:cursor-not-allowed
                  ${propEmail ? 'bg-muted text-muted-foreground' : ''}`}
              />
            </div>

            {/* Temporary Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Temporary Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-input border border-border rounded-xl
                    focus:border-border focus:ring-2 focus:ring-lavender-50 outline-none transition-all
                    text-sm text-foreground pr-12 disabled:bg-muted disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground
                    transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !email}
              className="w-full bg-primary mt-2 text-primary-foreground font-medium py-3.5
                rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                text-sm flex items-center justify-center gap-2"
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
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 1 of 5 — Temporary Login
        </div>
      </div>
    </div>
  );
};

export default TemporaryLoginPage;