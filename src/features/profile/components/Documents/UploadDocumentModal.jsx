// UploadDocumentModal.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react';

export const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [uploadForm, setUploadForm] = useState({
    documentType: 'PASSPORT',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    file: null,
    expiryDate: '',
  });

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.expiryDate) {
      alert('Please fill all required fields');
      return;
    }

    const fileName = `${uploadForm.documentType}_${uploadForm.firstName}_${uploadForm.lastName}.${uploadForm.file.name.split('.').pop()}`;
    
    const newDoc = {
      documentType: uploadForm.documentType,
      firstName: uploadForm.firstName,
      lastName: uploadForm.lastName,
      fileName: fileName,
      type: uploadForm.file.type.includes('pdf') ? 'PDF' : uploadForm.file.type.includes('image') ? 'JPG' : 'FILE',
      size: `${(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toLocaleDateString('en-GB'),
      expiryDate: uploadForm.expiryDate,
      category: uploadForm.documentType.includes('PASSPORT') || uploadForm.documentType.includes('VISA') || uploadForm.documentType.includes('LICENSE') ? 'Identity' : 'Other',
      shared: false
    };

    onUpload(newDoc);
    
    setUploadForm({
      documentType: 'PASSPORT',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      file: null,
      expiryDate: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-xl p-6 max-w-md w-full border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Upload Document</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
            <select
              value={uploadForm.documentType}
              onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="PASSPORT">PASSPORT</option>
              <option value="VISA">VISA</option>
              <option value="DRIVING_LICENSE">DRIVING LICENSE</option>
              <option value="INSURANCE">INSURANCE</option>
              <option value="TAX_CERTIFICATE">TAX CERTIFICATE</option>
              <option value="BANK_STATEMENT">BANK STATEMENT</option>
              <option value="CONTRACT">CONTRACT</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
            <input
              type="text"
              value={uploadForm.firstName}
              onChange={(e) => setUploadForm({ ...uploadForm, firstName: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="FIRST NAME"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
            <input
              type="text"
              value={uploadForm.lastName}
              onChange={(e) => setUploadForm({ ...uploadForm, lastName: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="LAST NAME"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
            <input
              type="date"
              value={uploadForm.expiryDate}
              onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: new Date(e.target.value).toLocaleDateString('en-GB') })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Upload File</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">File will be named: {uploadForm.documentType}_{uploadForm.firstName}_{uploadForm.lastName}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};







