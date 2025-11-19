import { Eye, EyeOff, Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react";

export default function CreatePasswordScreenUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo/Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black mb-2 text-purple-700">EAARTH STUDIOS</h1>
          <p className="text-sm text-gray-600">CREATE YOUR PASSWORD</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 border-2 border-purple-700 rounded-xl">
              <Lock className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">SET PASSWORD</h2>
              <p className="text-xs text-gray-500">Create a secure password</p>
            </div>
          </div>

          {/* User Info (Static UI) */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-5">
            <p className="text-sm text-purple-900">
              <strong>Email:</strong> example@email.com
            </p>
            <p className="text-sm text-purple-900">
              <strong>Role:</strong> user
            </p>
          </div>

          {/* Password Form (UI Only) */}
          <div className="space-y-4">

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none 
                  transition-all placeholder:text-gray-400 text-gray-900 pr-12"
                />

                {/* Toggle hidden (no logic) */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                  hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none 
                  transition-all placeholder:text-gray-400 text-gray-900 pr-12"
                />

                {/* Toggle hidden (no logic) */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                  hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Password Requirements (Static UI) */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-700 mb-2">
                PASSWORD REQUIREMENTS:
              </p>

              <Requirement text="At least 8 characters" />
              <Requirement text="One uppercase letter" />
              <Requirement text="One lowercase letter" />
              <Requirement text="One number" />
              <Requirement text="One special character" />
              <Requirement text="Passwords match" />
            </div>

            {/* Continue Button (UI Only, always enabled) */}
            <button
              className="w-full bg-purple-700 text-white font-bold py-4 px-6 rounded-xl 
              hover:bg-purple-800 hover:shadow-xl transition-all duration-300 
              flex items-center justify-center gap-2 group transform hover:scale-105 
              border-2 border-purple-800"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 1 of 4: Password Creation
        </div>
      </div>
    </div>
  );
}

/* Static Requirement Item (No logic, always gray) */
function Requirement({ text }) {
  return (
    <div className="flex items-center gap-2">
      <XCircle className="w-4 h-4 text-gray-300" />
      <span className="text-xs text-gray-500">{text}</span>
    </div>
  );
}
