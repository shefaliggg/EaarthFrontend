import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Info, Home } from 'lucide-react';

export default function SetPassword({ onNavigate, email = 'mohammedshanidt08@gmail.com', onSkip }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onNavigate('terms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('temp-login')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            BACK
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-bold"
            >
              <Home className="w-5 h-5" />
              SKIP TO DASHBOARD
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              SET YOUR PASSWORD
            </h2>
            <p className="text-white/90">
              Create a strong password for your account
            </p>
          </div>

          {/* Form Content */}
          <div className="p-10">
            {/* Email Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">EMAIL:</span> {email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  NEW PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="ENTER NEW PASSWORD"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  CONFIRM PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="RE-ENTER NEW PASSWORD"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-bold text-gray-900 mb-2">PASSWORD MUST INCLUDE:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>8+ characters</li>
                  <li>Uppercase, lowercase, number, and special character</li>
                </ul>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-bold py-3.5 rounded-xl hover:bg-purple-800 hover:shadow-lg transition-all mt-8 border-2 border-purple-800"
              >
                CONTINUE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}