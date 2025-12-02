import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eaarthLogo from "../../../assets/eaarth.png";
import { Input } from "../../../shared/components/ui/input";
import { useResetPassword } from '../hooks/useResetPassword';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email;

    const storedEmail = localStorage.getItem('resetPasswordEmail');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('resetPasswordEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/auth/forgot-password');
    }
  }, [location.state, navigate]);

  const {
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useResetPassword(() => {
    localStorage.removeItem('resetPasswordEmail');
    navigate('/auth/login');
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Email not found. Please request a new OTP.');
      navigate('/auth/forgot-password');
      return;
    }
    
    await handleSubmit(email);
  };

  if (!email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background transition-colors">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background transition-colors">
        <div className="w-full max-w-xl bg-card rounded-2xl p-6 text-center border border-border shadow-md transition-colors">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-foreground mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 bg-background transition-colors relative">

      <button
        onClick={() => {
          localStorage.removeItem('resetPasswordEmail');
          navigate('/auth/forgot-password');
        }}
        className="absolute top-6 left-6 p-2 hover:bg-muted rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-xl mx-auto mt-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground tracking-wide font-semibold uppercase">
            Reset Password
          </p>
        </div>

        {/* Card */}
        <div className="bg-card dark:bg-slate-800 border border-border rounded-3xl p-8 shadow-md transition-colors">

          <h2 className="text-2xl font-medium text-center mb-2 text-foreground">
            Reset Your Password
          </h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-6 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
 
            <div>
              <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                OTP *
              </label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Check your email for the 6-digit code
              </p>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                New Password *
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

             <div className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
              <p className="font-medium mb-2">Password must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>8+ characters</li>
                <li>Uppercase, lowercase, number & special character</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !otp || !newPassword || !confirmPassword}
              className="w-full mt-2 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  RESETTING PASSWORD...
                </>
              ) : (
                "RESET PASSWORD"
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('resetPasswordEmail');
                navigate('/auth/forgot-password', { state: { email } });
              }}
              disabled={loading}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              Didn't receive OTP? Request new one
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Step 2 of 2 — Password Recovery
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
