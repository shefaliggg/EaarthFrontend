import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

// Contract templates array
const CONTRACT_TEMPLATES = [
  { 
    id: 1, 
    name: "Crew - Loanout Services", 
    file: "/contracts/loan-out.pdf",
    category: "Crew",
    description: "Major motion picture loanout services agreement"
  },{ 
    id: 2, 
    name: "Transport - Self Employed", 
    file: "/contracts/transport-self-employed.pdf",
    category: "Transport",
    description: "Unit Driver individual services agreement"
  },
  
];

// Group contracts by category
const groupedContracts = CONTRACT_TEMPLATES.reduce((acc, contract) => {
  if (!acc[contract.category]) {
    acc[contract.category] = [];
  }
  acc[contract.category].push(contract);
  return acc;
}, {});

export default function ContractForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const file = location.state?.uploadedFile;
    
    if (file) {
      console.log('📄 Received uploaded file:', file.name);
      setPdfFile(file);
    }
  }, [location.state]);

  // Click uploaded PDF → Go to Designer
  const handlePdfClick = () => {
    if (pdfFile) {
      console.log('🔄 Opening uploaded PDF in designer:', pdfFile.name);
      
      navigate('../designer', { 
        state: { 
          file: pdfFile,
          templateName: pdfFile.name 
        } 
      });
    }
  };

  // Click template → Go to Designer
  const handleTemplateSelect = async (template) => {
    setLoading(true);
    try {
      console.log('🔍 Loading template PDF:', template.file);
      
      const response = await fetch(template.file);
      if (!response.ok) throw new Error(`Failed to load PDF`);
      
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const file = new File([blob], template.name + ".pdf", { type: "application/pdf" });

      console.log('✅ Navigating to designer with template');
      
      navigate('../designer', { 
        state: { 
          file, 
          templateName: template.name 
        } 
      });
    } catch (error) {
      console.error('❌ Error loading template:', error);
      alert('Failed to load contract template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-medium text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Choose From Contract Templates
          </h2>
          <p className="text-sm text-gray-600">
            {pdfFile ? CONTRACT_TEMPLATES.length + 1 : CONTRACT_TEMPLATES.length} professional contract template{pdfFile || CONTRACT_TEMPLATES.length > 1 ? 's' : ''} ready to customize
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md">
              <div className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Contract...</h3>
            </div>
          </div>
        )}

        {/* All Templates */}
        <div className="space-y-8 mb-10">
          {/* Uploaded PDF Section (if exists) */}
          {pdfFile && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-lavender-600 rounded"></div>
                <h3 className="text-base font-bold text-gray-900">Uploaded</h3>
                <span className="text-sm text-gray-500">(1)</span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handlePdfClick}
                  className="w-full bg-white p-5 rounded-xl border border-gray-200 hover:border-lavender-400 hover:shadow-md cursor-pointer transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lavender-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lavender-100 transition-colors">
                      <FileText className="text-lavender-600" size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-lavender-600 transition-colors">
                        {pdfFile.name.replace('.pdf', '')}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded document
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-lavender-600 font-medium">
                      <span>Open in Designer</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Template Sections */}
          {Object.entries(groupedContracts).map(([category, contracts]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-lavender-600 rounded"></div>
                <h3 className="text-base font-bold text-gray-900">{category}</h3>
                <span className="text-sm text-gray-500">({contracts.length})</span>
              </div>
              
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <button 
                    key={contract.id} 
                    onClick={() => handleTemplateSelect(contract)} 
                    disabled={loading} 
                    className="w-full bg-white p-5 rounded-xl border border-gray-200 hover:border-lavender-400 hover:shadow-md cursor-pointer transition-all group text-left disabled:opacity-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-lavender-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lavender-100 transition-colors">
                        <FileText className="text-lavender-600" size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-lavender-600 transition-colors">
                          {contract.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {contract.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-lavender-600 font-medium">
                        <span className="hidden sm:inline">Open in Designer</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}