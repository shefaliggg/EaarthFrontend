import React from 'react';
import { Eye, EyeOff, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useResetPassword } from '../hooks/useResetPassword';
import eaarthLogo from "../../../../src/assets/eaarth.png";

export const ResetPasswordPage = ({ email: initialEmail, onSuccess, onBack, onNavigate, onSkip }) => {
  const navigate = useNavigate();
  const [email] = React.useState(initialEmail || 'mohammedshanidt08@gmail.com');
  
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
  } = useResetPassword(onSuccess, (err) => console.error(err));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(email);
    
    // If successful and no custom handlers, navigate to login
    if (result && !onSuccess) {
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('login');
        } else {
          navigate('/auth/login');
        }
      }, 2000);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('login');
    } else {
      navigate('/auth/login');
    }
  };

  const handleResendOTP = async () => {
    // Add your resend OTP API call here
    alert('OTP resent to your email');
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-xl mx-auto">
        {/* Logo (OUTSIDE CARD) */}
        <div className="text-center mb-6">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            RESET PASSWORD
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          {/* Title */}
          <h2 className="text-2xl md:text-2xl font-medium text-center mb-2 text-gray-900">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP *
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="738401"
                required
                maxLength={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-[#9575cd] focus:border-transparent 
                outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-[#9575cd] focus:border-transparent 
                  outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-[#9575cd] focus:border-transparent 
                  outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Password must include:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>8+ characters</li>
                <li>Uppercase, lowercase, number, and special character</li>
              </ul>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading || !otp || !newPassword || !confirmPassword}
              className="w-full bg-gradient-to-r from-[#7e57c2] to-pink-600 
              text-white font-medium py-4 rounded-xl hover:shadow-md 
              transition-all hover:scale-[1.02] disabled:opacity-50 
              disabled:cursor-not-allowed disabled:hover:scale-100 
              flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>RESETTING...</span>
                </>
              ) : (
                'RESET PASSWORD'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-[#7e57c2] hover:text-[#7e57c2] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
          </div>

          {/* Skip */}
          {onSkip && (
            <div className="mt-4 text-center">
              <button
                onClick={onSkip}
                disabled={loading}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;








