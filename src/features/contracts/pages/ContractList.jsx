import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

export default function ContractList() {
  const navigate = useNavigate();

  // Click button → Go to ContractForm directly
  const handleGoToForm = () => {
    console.log('📄 Going to contract form...');
    navigate('list');
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Designer Studio</h1>
        <p className="text-gray-600">Upload your contract to get started</p>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Upload Box Only */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-10 hover:border-lavender-400 transition-all">
          <div className="text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-100 to-lavender-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-lavender-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Own Contract</h2>
            <p className="text-gray-600 mb-6 text-sm">Have a custom PDF? Upload it and transform it with professional design templates</p>
            
            <button 
              onClick={handleGoToForm}
              className="px-8 py-3 bg-lavender-600 text-white rounded-xl font-semibold hover:bg-lavender-700 transition-colors shadow-lg"
            >
              Choose PDF File
            </button>
            
            <p className="text-xs text-gray-500 mt-4">Supported format: PDF • Max size: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}