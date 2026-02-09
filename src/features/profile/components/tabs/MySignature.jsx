import React, { useRef, useState } from 'react';
import { PenTool, Download, Trash2 } from 'lucide-react';

export default function MySignature({ profile, setProfile, isEditing, isDarkMode }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureImage, setSignatureImage] = useState(profile.signature || null);

  const startDrawing = (e) => {
    if (!isEditing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !isEditing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
    setProfile({ ...profile, signature: null });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    setSignatureImage(imageData);
    setProfile({ ...profile, signature: imageData });
  };

  const downloadSignature = () => {
    if (!signatureImage) return;
    const link = document.createElement('a');
    link.href = signatureImage;
    link.download = 'my-signature.png';
    link.click();
  };

  return (
    <div className={`rounded-xl border shadow-md p-6 ${isDarkMode ? 'bg-card border-border' : 'bg-card border-border'}`}>
      <div className="space-y-6">
        <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
          <PenTool className="w-5 h-5" /> MY SIGNATURE
        </h4>
        
        <div className="space-y-4">
          {/* Canvas for drawing signature */}
          {isEditing ? (
            <>
              <div className="border-2 border-dashed border-muted rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full cursor-crosshair"
                  style={{ display: 'block', touchAction: 'none' }}
                />
              </div>

              {/* Action Buttons for Editing */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={saveSignature}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  Save Signature
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Display saved signature */}
              {signatureImage ? (
                <div className="border-2 border-muted rounded-lg overflow-hidden bg-white p-4">
                  <img
                    src={signatureImage}
                    alt="Your signature"
                    className="w-full max-h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
                  <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No signature saved yet. Edit to add your signature.</p>
                </div>
              )}

              {/* Action Buttons for Viewing */}
              {signatureImage && (
                <button
                  onClick={downloadSignature}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Signature
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
