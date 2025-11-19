import { ArrowLeft, Info } from "lucide-react";

export default function OTPVerification() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-green-100 via-pink-100 to-purple-200">

      {/* Back button (logic removed) */}
      {/* <button onClick={() => {}}> */}
      <button className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* App Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            EAARTH
          </h1>
          <p className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            STUDIOS
          </p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Identity
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/* Email Information */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-600" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">Email:</span> example@email.com
          </p>
        </div>

        {/* OTP Input Boxes (no logic) */}
        <div className="flex gap-2 justify-center mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg 
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          ))}
        </div>

        {/* Verify Button (disabled state removed, no logic) */}
        <button
          className="w-full font-semibold py-3 rounded-lg transition-all mb-4
          bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
        >
          Verify
        </button>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>

          {/* No timer, no disable logic */}
          <button className="font-medium text-purple-600 hover:text-purple-700">
            Resend Code
          </button>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-4">
          <button className="text-gray-500 hover:text-gray-700 font-medium">
            Skip Verification
          </button>
        </div>
      </div>
    </div>
  );
}
