import React, { useState } from 'react';
import { Upload, CreditCard, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eaarthLogo from '../../../../assets/eaarth.png';

export function UploadIDPhoto() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};

  const [idFile, setIdFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setIdFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
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

    navigate('/auth/live-photo', {
      state: { email, userId, idFile },
    });
  };

  const handleBackClick = () => {
    navigate('/auth/set-password', {
      state: { email, userId },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4">
      
      {/* Back Button - Top Left */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-2 hover:bg-white/50 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="w-full max-w-xl mx-auto">
        
        {/* Logo + Title */}
        <div className="text-center mb-4">
          <img src={eaarthLogo} alt="Eaarth Studios" className="w-40 h-auto mx-auto mb-3" />
          <p className="text-sm text-muted-foreground tracking-wide font-semibold">
            UPLOAD ID DOCUMENT
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-card rounded-3xl p-8 md:p-10 border border-border">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-lavender-50 border border-primary rounded-xl shrink-0">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-foreground">UPLOAD ID PHOTO</h2>
              <p className="text-xs text-muted-foreground">Passport or driver's license</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-background border border-border rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-semibold mb-2">IMPORTANT INSTRUCTIONS:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload a clear photo of your <strong>Passport</strong> or <strong>Driver's License</strong></li>
                  <li>• Ensure your face is clearly visible</li>
                  <li>• All text must be readable</li>
                  <li>• Photo should be well-lit</li>
                  <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ERROR BOX */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-destructive text-sm font-medium mb-6">
              {error}
            </div>
          )}

          {/* Upload Box / Preview */}
          {!preview ? (
            <div
              onClick={() => document.getElementById('file-input')?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full border-2 border-dashed border-border rounded-xl px-8 py-10 text-center hover:border-primary hover:bg-lavender-50/50 transition-all cursor-pointer"
            >
              <Upload className="w-14 h-14 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">CLICK TO UPLOAD OR DRAG & DROP</p>
              <p className="text-sm text-muted-foreground">Upload a clear image of your ID document</p>

              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-mint-500">
                <img src={preview} alt="ID Document" className="w-full" />
                <div className="absolute top-4 right-4 bg-mint-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> UPLOADED
                </div>
              </div>

              <button
                onClick={handleRemove}
                className="w-full bg-muted text-foreground font-medium py-3 rounded-xl hover:bg-muted/80 border border-border transition-all"
              >
                UPLOAD DIFFERENT PHOTO
              </button>
            </div>
          )}

          {/* Continue Button */}
          {preview && (
            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              CONTINUE TO LIVE PHOTO
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-muted-foreground text-xs">
          Step 3 of 5 — ID Document Upload
        </div>
      </div>
    </div>
  );
}

export default UploadIDPhoto;