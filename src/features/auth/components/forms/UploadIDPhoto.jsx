import { Upload, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import eaarthLogo from '../../../../assets/eaarth.png';

export function UploadIDPhoto() {
  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-gray-600 tracking-wide font-semibold">
            UPLOAD ID DOCUMENT
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl p-6 md:p-6 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#faf5ff] border border-gray-200 rounded-2xl flex-shrink-0">
              <CreditCard className="w-6 md:w-7 h-6 md:h-7 text-[#9333ea]" />
            </div>
            <div>
              <h2 className="text-xl md:text-xl font-medium text-gray-900">UPLOAD ID PHOTO</h2>
              <p className="text-xs text-gray-500">Passport or driver's license</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-2">IMPORTANT INSTRUCTIONS:</p>
                <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                  <li>• Upload a clear photo of your <strong>Passport</strong> or <strong>Driver's License</strong></li>
                  <li>• Ensure your face is clearly visible</li>
                  <li>• All text must be readable</li>
                  <li>• Photo should be well-lit without glare</li>
                  <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Box */}
          <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl px-6 md:px-8 py-8 md:py-8 text-center hover:border-gray-300 hover:bg-[#faf5ff]/50 transition-all cursor-pointer">
            <Upload className="w-12 md:w-16 h-12 md:h-16 text-[#9333ea] mx-auto mb-4 md:mb-6" />
            <p className="text-lg md:text-lg font-medium mb-2">CLICK TO UPLOAD OR DRAG & DROP</p>
            <p className="text-xs md:text-sm text-gray-500">Upload a clear image of your ID document</p>
          </div>

          {/* Button */}
          <button className="w-full mt-6 md:mt-8 bg-[#9333ea] hover:bg-[#9333ea] transition-colors text-white font-medium py-3.5 md:py-4 rounded-2xl flex items-center justify-center gap-2">
            CONTINUE TO LIVE PHOTO
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Step 2 of 4 — ID Document Upload
        </div>
      </div>
    </div>
  );
}












