import { Eye, EyeOff, ArrowLeft, Info, Loader, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSetPassword from '../hooks/useSetPassword';
import eaarthLogo from '../../../assets/eaarth.png';

export const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  const email = location.state?.email || 'user@example.com';

  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    error,
    success,
    handleSubmit,
  } = useSetPassword();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(userId, email);

    if (result && result.success) {
      setTimeout(() => {
        navigate('/auth/upload-id', {
          replace: true,
          state: { email, userId },
        });
      }, 1500);
    }
  };

  const handleBackClick = () => navigate('/auth/temp-login');
  const handleBackToLogin = () => navigate('/auth/login');

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-card rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <CheckCircle className="w-14 h-14 text-mint-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Password Set Successfully!
            </h2>
            <p className="text-muted-foreground">Redirecting to ID upload...</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PAGE UI
  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">

      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        disabled={loading}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-lg mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground tracking-wide font-semibold">
            SET NEW PASSWORD
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl p-8 md:p-10 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-2xl font-medium mb-2 text-foreground">
              CREATE YOUR PASSWORD
            </h2>
            <p className="text-muted-foreground text-sm">
              Create a new password to secure your account
            </p>
          </div>

          {/* Email Banner */}
          <div className="bg-lavender-50 border border-gray-100 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground break-all">
              <span className="font-semibold">Email:</span> {email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-destructive p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleFormSubmit} className="space-y-4">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl 
                             focus:border-border focus:ring-2 focus:ring-lavender-50 outline-none
                             placeholder:text-muted-foreground transition-all disabled:bg-muted text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl 
                             focus:border-border focus:ring-2 focus:ring-lavender-50 outline-none
                             placeholder:text-muted-foreground transition-all disabled:bg-muted text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Guidelines */}
            <div className="bg-muted rounded-xl p-3.5 text-sm text-muted-foreground">
              <p className="font-medium mb-2 text-foreground">Password must include:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>8+ characters</li>
                <li>Uppercase letter</li>
                <li>Lowercase letter</li>
                <li>Number</li>
                <li>Special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full bg-primary mt-2 text-primary-foreground font-medium py-3
                         rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  SETTING PASSWORD...
                </>
              ) : (
                'CONTINUE'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <button
              onClick={handleBackToLogin}
              disabled={loading}
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 2 of 5 — Set Password
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;