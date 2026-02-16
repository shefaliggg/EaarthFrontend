import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

// Contract library - matches your public/contracts folder structure
const CONTRACT_TEMPLATES = [
  { 
    id: 1, 
    name: "Transport - Self Employed", 
    file: "/contracts/transport-self-employed.pdf",
    category: "Transport",
    description: "Unit Driver individual services agreement"
  },
  { 
    id: 2, 
    name: "Crew - Loanout Services", 
    file: "/contracts/loan-out.pdf",
    category: "Crew",
    description: "Major motion picture loanout services agreement"
  },
  // Add your other 28 contracts here...
];

// Group contracts by category
const groupedContracts = CONTRACT_TEMPLATES.reduce((acc, contract) => {
  if (!acc[contract.category]) {
    acc[contract.category] = [];
  }
  acc[contract.category].push(contract);
  return acc;
}, {});

export default function ContractList() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manual Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      navigate('../contractss/designer', { state: { file } });
    } else {
      alert('Please upload a PDF file');
    }
  };

  // Template Selection Handler - FIXED VERSION
  const handleTemplateSelect = async (template) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Loading PDF from:', template.file);

      // Step 1: Fetch PDF from public folder
      const response = await fetch(template.file);
      
      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
      }

      // Step 2: Get ArrayBuffer (required for PDF.js)
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ PDF loaded, size:', arrayBuffer.byteLength, 'bytes');

      // Step 3: Convert to Blob
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

      // Step 4: Create File object (this is what your designer expects)
      const file = new File([blob], template.name + ".pdf", {
        type: "application/pdf",
      });

      console.log('✅ File object created:', file.name, file.size, 'bytes');

      // Step 5: Navigate to designer with file
      navigate('../contractss/designer', { 
        state: { 
          file,
          templateName: template.name 
        } 
      });

    } catch (error) {
      console.error('❌ Error loading template:', error);
      setError(`Failed to load ${template.name}: ${error.message}`);
      
      // Show user-friendly error
      alert(
        `Could not load the contract template.\n\n` +
        `Error: ${error.message}\n\n` +
        `Please ensure:\n` +
        `1. The PDF file exists in /public${template.file}\n` +
        `2. The file name matches exactly\n` +
        `3. The PDF is not corrupted`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Contract Designer Studio
              </h1>
              <p className="text-gray-600">
                Choose from {CONTRACT_TEMPLATES.length} professional templates or upload your own
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles size={16} className="text-lavender-600" />
              <span>AI-Powered Design</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Contract</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 mb-12 hover:border-lavender-400 transition-all shadow-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-lavender-100 to-lavender-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-lavender-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Upload Your Own Contract
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Have a custom PDF? Upload it and transform it with professional design templates
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-8 py-4 bg-lavender-600 text-white rounded-xl font-semibold hover:bg-lavender-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Choose PDF File
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Supported format: PDF • Max size: 10MB
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Contract Library */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Choose From Contract Templates
          </h2>
          <p className="text-gray-600">
            {CONTRACT_TEMPLATES.length} professional contract templates ready to customize
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md">
              <div className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Contract...</h3>
              <p className="text-gray-600">Fetching PDF from server</p>
            </div>
          </div>
        )}

        {/* Grouped Contracts */}
        {Object.entries(groupedContracts).map(([category, contracts]) => (
          <div key={category} className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-lavender-600 rounded"></span>
              {category}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({contracts.length})
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => handleTemplateSelect(contract)}
                  disabled={loading}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-lavender-400 hover:shadow-lg cursor-pointer transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-lavender-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lavender-100 transition-colors">
                      <FileText className="text-lavender-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-lavender-600 transition-colors">
                        {contract.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {contract.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-lavender-600 font-medium">
                        <span>Open in Designer</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Stats Footer */}
        <div className="mt-12 bg-gradient-to-r from-lavender-50 to-purple-50 rounded-xl p-8 border border-lavender-200">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-lavender-600 mb-2">
                {CONTRACT_TEMPLATES.length}+
              </div>
              <div className="text-sm text-gray-600">Contract Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lavender-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Design Themes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lavender-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Customizable</div>
            </div>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Public folder path: /contracts/*.pdf</div>
          <div>Current route: {window.location.pathname}</div>
          <div>Total templates: {CONTRACT_TEMPLATES.length}</div>
        </div>
      </div>
    </div>
  );
}