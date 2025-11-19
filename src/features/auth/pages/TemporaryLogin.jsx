import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';

export function TemporaryLogin({ onNavigate, onSuccess, onSkip }) {
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess();
    onNavigate('set-password');
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('login')}
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
              TEMPORARY LOGIN
            </h2>
            <p className="text-white/90">
              Use the temporary password sent to your email
            </p>
          </div>

          {/* Form Content */}
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Temporary Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  TEMPORARY PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="ENTER TEMPORARY PASSWORD"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-bold py-3.5 rounded-xl hover:bg-purple-800 hover:shadow-lg transition-all mt-8 border-2 border-purple-800"
              >
                CONTINUE
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => onNavigate('login')}
                className="text-purple-600 hover:text-purple-700 font-bold text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}