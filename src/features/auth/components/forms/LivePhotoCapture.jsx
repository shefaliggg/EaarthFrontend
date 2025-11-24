import { Camera, ArrowRight, RotateCcw } from 'lucide-react';
import eaarthLogo from '../../../../assets/eaarth.png';

export function LivePhotoCapture() {
  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-4">
          <img
            src={eaarthLogo}
            alt="Eaarth Studios"
            className="w-40 h-auto mx-auto mb-3"
          />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            CAPTURE LIVE PHOTO
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-6 border border-gray-100 w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#ede7f6] border border-gray-200 rounded-2xl flex-shrink-0">
              <Camera className="w-6 md:w-7 h-6 md:h-7 text-[#7e57c2]" />
            </div>
            <div>
              <h2 className="text-xl md:text-xl font-medium text-gray-900">TAKE LIVE PHOTO</h2>
              <p className="text-xs text-gray-500">For identity verification</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 md:px-6 py-3 mb-4">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-2">PHOTO GUIDELINES:</p>
                <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting (avoid shadows)</li>
                  <li>• Remove glasses, hats, or face coverings</li>
                  <li>• Look directly at the camera</li>
                  <li>• Maintain a neutral expression</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Camera Box */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-6 w-full h-[220px] sm:h-[250px] md:h-[300px]">
            {/* Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p className="text-sm opacity-70">Camera preview area</p>
            </div>

            {/* Face Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-52 md:w-56 md:h-72 border-2 border-gray-200 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Capture */}
            <button className="w-full bg-[#7e57c2] hover:bg-[#7e57c2] transition-colors text-white font-medium py-3.5 md:py-4 rounded-2xl flex items-center justify-center gap-2">
              <Camera className="w-5 h-5" />
              CAPTURE PHOTO
            </button>

            {/* Retake */}
            <button className="w-full bg-gray-100 text-gray-700 font-medium py-3.5 md:py-4 rounded-2xl hover:bg-gray-200 border border-gray-200 flex items-center justify-center gap-2 transition-colors">
              <RotateCcw className="w-5 h-5" />
              RETAKE PHOTO
            </button>

            {/* Continue */}
            <button className="w-full bg-[#7e57c2] hover:bg-[#7e57c2] transition-colors text-white font-medium py-3.5 md:py-4 rounded-2xl flex items-center justify-center gap-2">
              CONTINUE TO VERIFICATION
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 3 of 4: Live Photo Capture
        </div>
      </div>
    </div>
  );
}







