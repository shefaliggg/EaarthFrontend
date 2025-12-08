import React, { useState } from 'react';
import { Upload, CreditCard, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eaarthLogo from "../../../../assets/eaarth.webp";

export default function UploadIDPhoto() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};

  const [idFile, setIdFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setIdFile(file);

    if (file.type === 'application/pdf') {
      setPreview('PDF_FILE');
    } else {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = () => {
    setIdFile(null);
    setPreview(null);
    setError('');
  };

  const handleContinue = () => {
    if (!idFile) {
      setError('Please upload your ID document');
      return;
    }

    // Navigate to live photo page with all necessary data
    navigate('/auth/live-photo', {
      state: {
        email,
        userId,
        idFile
      },
    });
  };

  const handleBackClick = () => {
    navigate('/auth/set-password', {
      state: { email, userId },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors">

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/30 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>

      <div className="w-full max-w-xl mx-auto">

        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-36 h-auto mx-auto" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
            Upload ID Document
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white dark:bg-gradient-to-b from-[#250149] via-[#200352] to-[#0e0021] rounded-3xl py-6 px-8 border border-gray-200 dark:border-gray-700 shadow-md transition-colors">

          {/* Header */}
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Upload ID Photo
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Passport or driver's license
          </p>

          {/* Instructions */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Important Instructions:
                </p>
                <ul className="text-[10px] text-gray-700 dark:text-gray-300 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Upload a clear photo of your Passport or Driver's License
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Ensure your face is clearly visible
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    All text must be readable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Photo should be well-lit
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    Accepted formats: JPG, PNG, PDF (max 5MB)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 text-red-600 dark:text-red-300 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          {/* Upload Box / Preview */}
          {!preview ? (
            <div
              onClick={() => document.getElementById('file-input')?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-6 py-10 text-center hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all cursor-pointer"
            >
              <Upload className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Click to Upload or Drag & Drop
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Upload a clear image of your ID document
              </p>

              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-green-500 dark:border-green-400">
                {preview === 'PDF_FILE' ? (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <CreditCard className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {idFile?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">PDF Document</p>
                    </div>
                  </div>
                ) : (
                  <img src={preview} alt="ID Document" className="w-full" />
                )}
                <div className="absolute top-3 right-3 bg-green-600 dark:bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className="w-4 h-4" /> Uploaded
                </div>
              </div>

              <button
                onClick={handleRemove}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all text-sm"
              >
                Upload Different Photo
              </button>
            </div>
          )}

          {/* Continue Button */}
          {preview && (
            <button
              onClick={handleContinue}
              className="w-full mt-4 bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Continue to Live Photo
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Back to Login */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors"
            >
              Back to Password Setup
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          Step 3 of 5 — ID Document Upload
        </div>
      </div>
    </div>
  );
}