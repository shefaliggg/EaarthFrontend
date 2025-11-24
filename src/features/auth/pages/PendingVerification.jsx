import { AlertCircle } from 'lucide-react';

// interface VerificationPendingProps {
//   onGoToDashboard: () => void;
// }

export function VerificationPending({ onGoToDashboard }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Logo */}
      <div className="absolute top-9 left-11">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#9333ea] rounded-full"></div>
          <span className="text-xl tracking-wider text-gray-800">eaarth</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[50px] p-12 max-w-[504px] w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[52px] h-[52px] rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#9333ea] rounded-full"></div>
            <span className="text-2xl tracking-wider text-gray-800">eaarth</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-gray-800 text-3xl mb-6 tracking-wide">
          Verification Pending
        </h1>
        <p className="text-gray-600 text-center mb-12 tracking-wide leading-relaxed">
          We have received your request and documents to verify. It might take upto 24hrs to get verified.
        </p>

        {/* Button */}
        <button
          onClick={onGoToDashboard}
          className="w-[224px] h-14 bg-[#9333ea] text-white rounded-full hover:bg-[#9333ea] transition-colors tracking-wide mx-auto block"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}












