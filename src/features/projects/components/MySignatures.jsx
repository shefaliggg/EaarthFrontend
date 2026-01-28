import { useState } from 'react';
import { Plus, Trash2, Edit, PenTool, Type, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { SmartIcon } from '@/shared/components/SmartIcon';

export default function MySignatures() {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureType, setSignatureType] = useState('draw');
  const [selectedFont, setSelectedFont] = useState('Dancing Script');
  const [signatureText, setSignatureText] = useState('');
  const [initialsText, setInitialsText] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const [signatures, setSignatures] = useState([
    {
      id: 'SIG-001',
      userId: 'USER-001',
      userName: 'JOHN SMITH',
      type: 'drawn',
      imageData: 'data:image/png;base64,...',
      initialsData: 'data:image/png;base64,...',
      createdDate: '2025-11-01',
      isDefault: true
    }
  ]);

  const signatureFonts = [
    { name: 'Dancing Script', style: 'Dancing Script, cursive' },
    { name: 'Great Vibes', style: 'Great Vibes, cursive' },
    { name: 'Allura', style: 'Allura, cursive' },
    { name: 'Pacifico', style: 'Pacifico, cursive' },
    { name: 'Satisfy', style: 'Satisfy, cursive' },
    { name: 'Alex Brush', style: 'Alex Brush, cursive' },
    { name: 'Mr Dafoe', style: 'Mr Dafoe, cursive' },
    { name: 'Pinyon Script', style: 'Pinyon Script, cursive' },
    { name: 'Italianno', style: 'Italianno, cursive' },
    { name: 'Tangerine', style: 'Tangerine, cursive' },
  ];

  const handleDelete = (sigId) => {
    if (confirm('Are you sure you want to delete this signature?')) {
      setSignatures(signatures.filter(s => s.id !== sigId));
    }
  };

  const handleCreateSignature = () => {
    const newSig = {
      id: `SIG-${String(signatures.length + 1).padStart(3, '0')}`,
      userId: 'USER-001',
      userName: signatureText || 'JOHN SMITH',
      type: signatureType,
      imageData: 'data:image/png;base64,...',
      initialsData: 'data:image/png;base64,...',
      createdDate: new Date().toISOString().split('T')[0],
      isDefault: setAsDefault
    };
    
    setSignatures([...signatures, newSig]);
    setShowSignatureModal(false);
    setSignatureText('');
    setInitialsText('');
    setSetAsDefault(false);
  };

  return (
    <CardWrapper
      title="Your Signatures"
      icon="PenTool"
      description="Create and manage your digital signatures for approvals"
      actions={
        <Button 
          onClick={() => setShowSignatureModal(true)}
          className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Signature
        </Button>
      }
    >
      {/* Signature List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signatures.map((sig) => (
          <motion.div
            key={sig.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border ${
              sig.isDefault
                ? 'border-lavender-400 bg-lavender-50 dark:border-lavender-700 dark:bg-lavender-900/20'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-lavender-600 dark:text-lavender-400" />
                <span className="text-sm font-semibold text-card-foreground">
                  {sig.type.toUpperCase()} SIGNATURE
                </span>
              </div>
              {sig.isDefault && (
                <span className="px-2 py-1 bg-lavender-500 text-white text-xs rounded font-semibold">
                  DEFAULT
                </span>
              )}
            </div>

            {/* Signature Preview */}
            <div className="border-2 rounded-lg p-3 mb-2 h-20 flex items-center justify-center bg-background dark:bg-muted">
              <div className="text-2xl font-signature italic text-muted-foreground">
                {sig.userName}
              </div>
            </div>

            {/* Initials Preview */}
            <div className="border rounded-lg p-2 mb-2 h-10 flex items-center justify-center bg-muted/50">
              <div className="text-lg font-signature italic text-muted-foreground">
                {sig.userName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(sig.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        <button
          onClick={() => setShowSignatureModal(true)}
          className="p-6 rounded-xl border-2 border-dashed border-border hover:border-lavender-400 dark:hover:border-lavender-600 bg-muted/30 transition-all hover:scale-105"
        >
          <Plus className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-semibold text-muted-foreground">
            Add New Signature
          </p>
        </button>
      </div>

      {/* Signature Creation Modal */}
      <AnimatePresence>
        {showSignatureModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-xl shadow-2xl bg-card"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">
                  Create Your Signature
                </h3>
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Type Selection */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSignatureType('draw')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      signatureType === 'draw'
                        ? 'bg-lavender-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <PenTool className="w-4 h-4 inline mr-2" />
                    Draw
                  </button>
                  <button
                    onClick={() => setSignatureType('type')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      signatureType === 'type'
                        ? 'bg-lavender-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Type
                  </button>
                  <button
                    onClick={() => setSignatureType('upload')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      signatureType === 'upload'
                        ? 'bg-lavender-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                  </button>
                </div>

                {/* Signature Canvas */}
                <div className="border-2 rounded-lg h-32 mb-4 border-border bg-background">
                  <div className="h-full flex items-center justify-center">
                    {signatureType === 'draw' && (
                      <div className="text-center text-muted-foreground">
                        <PenTool className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Draw Your Signature Here</p>
                      </div>
                    )}
                    {signatureType === 'type' && (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        {signatureText ? (
                          <div 
                            className="text-4xl italic text-center text-card-foreground"
                            style={{ fontFamily: signatureFonts.find(f => f.name === selectedFont)?.style }}
                          >
                            {signatureText}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Type className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Type Your Name Below</p>
                          </div>
                        )}
                      </div>
                    )}
                    {signatureType === 'upload' && (
                      <div className="text-center text-muted-foreground">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to Upload Image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Font Selector for Type mode */}
                {signatureType === 'type' && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold block mb-2 text-card-foreground">
                      Signature Style
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg border border-border">
                      {signatureFonts.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => setSelectedFont(font.name)}
                          className={`p-3 rounded-lg text-left transition-all ${
                            selectedFont === font.name
                              ? 'bg-lavender-100 border-2 border-lavender-500 dark:bg-lavender-900/30 dark:border-lavender-400'
                              : 'bg-muted border border-border hover:bg-muted/80'
                          }`}
                        >
                          <div 
                            className={`text-2xl italic ${
                              selectedFont === font.name
                                ? 'text-lavender-900 dark:text-lavender-100'
                                : 'text-card-foreground'
                            }`}
                            style={{ fontFamily: font.style }}
                          >
                            {signatureText || 'John Smith'}
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            {font.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Name Input for Type mode */}
                {signatureType === 'type' && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold block mb-2 text-card-foreground">
                      Your Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Type your full name"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value.toUpperCase())}
                      className="font-semibold"
                    />
                  </div>
                )}

                {/* Initials Canvas */}
                <div className="mb-4">
                  <label className="text-sm font-semibold block mb-2 text-card-foreground">
                    Initials (Optional)
                  </label>
                  <div className="border-2 rounded-lg h-20 border-border bg-background">
                    <div className="h-full flex items-center justify-center">
                      {signatureType === 'type' && initialsText ? (
                        <div 
                          className="text-2xl italic text-center text-card-foreground"
                          style={{ fontFamily: signatureFonts.find(f => f.name === selectedFont)?.style }}
                        >
                          {initialsText}
                        </div>
                      ) : signatureType === 'type' ? (
                        <div className="text-center text-muted-foreground">
                          <p className="text-sm">Type Your Initials Below</p>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <p className="text-sm">Draw or Type Initials</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Initials Input for Type mode */}
                {signatureType === 'type' && (
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Type your initials (e.g., JS)"
                      value={initialsText}
                      onChange={(e) => setInitialsText(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="font-semibold"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="defaultSig" 
                    className="rounded" 
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                  />
                  <label htmlFor="defaultSig" className="text-sm text-card-foreground">
                    Set as default signature
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSignatureModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSignature}
                    className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
                  >
                    Save Signature
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CardWrapper>
  );
}