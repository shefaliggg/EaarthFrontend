import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, ClipboardList } from 'lucide-react';

const CONTRACT_TEMPLATES = [
  { id: 1, name: "Crew - Loanout Services",    file: `${import.meta.env.BASE_URL}contracts/loan-out.pdf`,                 category: "Crew",      description: "Major motion picture loanout services agreement" },
  { id: 2, name: "Transport - Self Employed",  file: `${import.meta.env.BASE_URL}contracts/transport-self-employed.pdf`, category: "Transport", description: "Unit Driver individual services agreement" },
  { id: 3, name: "Daily Transport - Paye",     file: `${import.meta.env.BASE_URL}contracts/daily-transport-paye.pdf`,    category: "Transport", description: "Daily transport paye agreement" },
  { id: 4, name: "Paye",                       file: `${import.meta.env.BASE_URL}contracts/paye.pdf`,                    category: "Financial", description: "PAYE agreement" },
];

export default function ContractForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const groupedContracts = useMemo(() =>
    CONTRACT_TEMPLATES.reduce((acc, c) => {
      (acc[c.category] ??= []).push(c);
      return acc;
    }, {}), []);

  const totalTemplates = CONTRACT_TEMPLATES.length + (pdfFile ? 1 : 0);

  useEffect(() => {
    const file = location.state?.uploadedFile;
    if (file) {
      if (file.type !== 'application/pdf') { alert('Only PDF files are supported'); navigate('../'); return; }
      setPdfFile(file);
    }
  }, [location.state, navigate]);

  const handlePdfClick = () => {
    if (!pdfFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('selectedContractPdf', reader.result);
      localStorage.setItem('selectedContractName', pdfFile.name);
    };
    reader.readAsDataURL(pdfFile);
    navigate('../designer', { state: { file: pdfFile, templateName: pdfFile.name } });
  };

  const handleTemplateSelect = async (template) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(template.file);
      if (!response.ok) throw new Error(`Failed to load PDF: ${response.status}`);
      const blob = await response.blob();
      const file = new File([blob], `${template.name}.pdf`, { type: 'application/pdf' });
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('selectedContractPdf', reader.result);
        localStorage.setItem('selectedContractName', template.name);
      };
      reader.readAsDataURL(file);
      navigate('../designer', { state: { file, templateName: template.name } });
    } catch (error) {
      alert(`Failed to load contract template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Top bar with "Contract Details" button ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-0.5">Choose From Contract Templates</h2>
            <p className="text-sm text-gray-500">{totalTemplates} professional template{totalTemplates !== 1 ? 's' : ''} ready to customise</p>
          </div>

          {/* ★ CONTRACT DETAILS BUTTON */}
          <button
            onClick={() => navigate('../contract-details')}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all
                       bg-gradient-to-r from-purple-600 to-violet-600 text-white
                       hover:from-purple-700 hover:to-violet-700 hover:shadow-md active:scale-95"
          >
            <ClipboardList size={16} />
            Contract Details
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 font-medium text-xs uppercase tracking-widest">Templates</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
              <div className="w-14 h-14 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Loading Contract…</h3>
              <p className="text-sm text-gray-500">Fetching PDF from server</p>
            </div>
          </div>
        )}

        <div className="space-y-8 mb-10">
          {/* Uploaded PDF */}
          {pdfFile && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-purple-600 rounded-full" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Uploaded</h3>
                <span className="text-xs text-gray-400">(1)</span>
              </div>
              <button onClick={handlePdfClick}
                className="w-full bg-white p-5 rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <FileText className="text-purple-600" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{pdfFile.name.replace('.pdf', '')}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded document</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-purple-600 font-medium">
                    <span>Open in Designer</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Template groups */}
          {Object.entries(groupedContracts).map(([category, contracts]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-purple-600 rounded-full" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{category}</h3>
                <span className="text-xs text-gray-400">({contracts.length})</span>
              </div>
              <div className="space-y-3">
                {contracts.map(contract => (
                  <button key={contract.id} onClick={() => handleTemplateSelect(contract)} disabled={loading}
                    className="w-full bg-white p-5 rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <FileText className="text-purple-600" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{contract.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{contract.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-purple-600 font-medium">
                        <span className="hidden sm:inline">Open in Designer</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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