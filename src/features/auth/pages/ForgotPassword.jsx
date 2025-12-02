import React from 'react';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import eaarthLogo from '../../../assets/eaarth.png';

export const ForgotPasswordPage = ({ onNavigate, onBack, onSuccess }) => {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  } = useForgotPassword(
    (data) => {
      if (onNavigate) return onNavigate('reset', data);
      if (onSuccess) return onSuccess(data);

      navigate('/auth/reset-password', {
        state: { email: data.email },
      });
    },
    (err) => console.error(err)
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleBack = () => {
    if (onBack) return onBack();
    if (onNavigate) return onNavigate('login');
    navigate('/auth/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background transition-colors">
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-md text-center">
          <CheckCircle className="w-16 h-16 text-mint-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">OTP Sent!</h2>
          <p className="text-muted-foreground">Check your email for the reset code</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 bg-background transition-colors">

      <button
        onClick={handleBack}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-muted rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-lg mx-auto ">

        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold tracking-wide uppercase">
            Forgot Password
          </p>
        </div>

        <div className="bg-card dark:bg-slate-800 rounded-3xl p-8 border border-border shadow-md transition-colors">
          <h2 className="text-2xl font-bold text-center mb-2 text-foreground">
            RESET YOUR PASSWORD
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Enter your email to receive a reset code
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                disabled={loading}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all
                  text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary mt-2 text-primary-foreground font-medium py-3
                rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>SENDING...</span>
                </>
              ) : (
                'SEND OTP'
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="text-primary hover:text-primary/80 font-medium text-sm transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Step 1 of 2 — Password Recovery
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;