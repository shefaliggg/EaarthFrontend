import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Printer, ZoomIn, ZoomOut, Maximize2, 
  FileText, Calendar, User, DollarSign, CheckCircle, Clock,
  AlertCircle, ChevronRight, X, Menu
} from 'lucide-react';
import eaarthLogo from '@/assets/eaarth.webp';

// CONTRACT DATA (same as original)
const CONTRACT_DATA = {
  'contract-001': {
    filmTitle: 'WERWULF',
    version: '1.0',
    offerId: 'WW-2024-001',
    updated: '13/02/2024',
    executionDate: '13 February 2024',
    producer: {
      entity: 'MIRAGE PICTURES LIMITED',
      address: '123 Production Lane, Pinewood Studios, Iver Heath, Buckinghamshire, SL0 0NH',
      phone: '+44 (0) 1753 656 700',
    },
    crewMember: {
      name: 'John Michael Smith',
      address: '45 Chelsea Harbour Drive, London, SW10 0XD',
      phone: '+44 7700 900 123',
      email: 'john.smith@example.com',
      citizenship: 'British',
      residence: 'United Kingdom',
    },
    dealTerms: {
      department: 'Transport',
      position: 'Unit Driver',
      startDate: '01/03/2024',
      endDate: '30/06/2024',
    },
    fees: {
      baseWeeklyRate: '£800.00',
      weeklyHolidayRate: '£96.56',
      weeklyRate: '£896.56',
      baseDailyRate: '£160.00',
      dailyHolidayRate: '£19.31',
      dailyRate: '£179.31',
      base6thDayRate: '£240.00',
      sixthDayHolidayRate: '£28.97',
      sixthDayRate: '£268.97',
      base7thDayRate: '£320.00',
      seventhDayHolidayRate: '£38.62',
      seventhDayRate: '£358.62',
    },
    allowances: {
      mobileRate: '£50.00',
      mobileTerms: 'per week',
    },
    productionBase: 'Pinewood Studios, Iver Heath, Buckinghamshire, SL0 0NH',
    workingTerms: {
      dailyRate: '£179.31',
      overtimeRate: '£25.00',
    },
    specialStipulations: [
      'Unit Driver agrees to maintain the vehicle in excellent condition at all times.',
      'Vehicle must be available for production use within 30 minutes of call time.',
      'Driver must hold a valid PCO licence and comprehensive insurance.',
    ],
    signatures: [
      { role: 'crew_member', signedBy: 'John Michael Smith', signedAt: '13/02/2024', verified: true },
      { role: 'upm', signedBy: 'Sarah Johnson', signedAt: '13/02/2024', verified: true },
      { role: 'financial_controller', signedBy: 'Robert Williams', signedAt: '14/02/2024', verified: true },
      { role: 'production_executive', signedBy: 'Emma Thompson', signedAt: '14/02/2024', verified: true },
    ],
    status: 'fully_executed',
  },
};

export default function ContractPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMetadata, setShowMetadata] = useState(true);

  useEffect(() => {
    setContract(CONTRACT_DATA[id] || CONTRACT_DATA['contract-001']);
  }, [id]);

  if (!contract) return null;

  const pages = [
    { id: 0, title: 'Deal Terms', icon: DollarSign },
    { id: 1, title: 'Special Stipulations', icon: FileText },
    { id: 2, title: 'Execution & Signatures', icon: CheckCircle },
  ];

  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(50, Math.min(150, newZoom)));
  };

  const statusConfig = {
    fully_executed: { 
      label: 'Fully Executed', 
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    pending_signatures: { 
      label: 'Pending Signature', 
      color: 'bg-amber-100 text-amber-700 border-amber-300',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    draft: { 
      label: 'Draft', 
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: AlertCircle,
      dot: 'bg-slate-500'
    },
  };

  const status = statusConfig[contract.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* PREMIUM GLASS TOOLBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm print:hidden">
        <div className="max-w-[1920px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{contract.filmTitle}</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${status.color} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{contract.crewMember.name} • {contract.dealTerms.position}</p>
                </div>
              </div>
            </div>

            {/* Center - Zoom Controls */}
            <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl px-3 py-2 backdrop-blur-sm">
              <button
                onClick={() => handleZoomChange(zoom - 10)}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40"
                disabled={zoom <= 50}
              >
                <ZoomOut size={16} />
              </button>
              <input
                type="range"
                min="50"
                max="150"
                step="10"
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-24 h-1 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <button
                onClick={() => handleZoomChange(100)}
                className="text-xs font-semibold min-w-[45px] text-center text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {zoom}%
              </button>
              <button
                onClick={() => handleZoomChange(zoom + 10)}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40"
                disabled={zoom >= 150}
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Toggle Pages"
              >
                <Menu size={18} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <Printer size={16} />
                <span className="hidden md:inline">Print</span>
              </button>
              <button
                onClick={() => alert('Download PDF')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-xl"
              >
                <Download size={16} />
                <span className="hidden md:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THREE-PANEL LAYOUT */}
      <div className="flex max-w-[1920px] mx-auto">
        {/* LEFT SIDEBAR - Page Thumbnails */}
        {showSidebar && (
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm print:hidden sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">
                Pages
              </div>
              {pages.map((page) => {
                const PageIcon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all group ${
                      currentPage === page.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-700 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        currentPage === page.id
                          ? 'bg-indigo-100 dark:bg-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        <PageIcon size={16} className={currentPage === page.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-xs font-semibold ${
                            currentPage === page.id 
                              ? 'text-indigo-700 dark:text-indigo-300' 
                              : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            Page {page.id + 1}
                          </span>
                          {currentPage === page.id && (
                            <ChevronRight size={14} className="text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <p className={`text-xs leading-tight ${
                          currentPage === page.id 
                            ? 'text-slate-700 dark:text-slate-300' 
                            : 'text-slate-500 dark:text-slate-500'
                        }`}>
                          {page.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mini Thumbnail Preview */}
                    <div className={`mt-3 w-full h-24 rounded border-2 ${
                      currentPage === page.id
                        ? 'border-indigo-300 dark:border-indigo-600'
                        : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 p-2 overflow-hidden`}>
                      <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center">
                        <PageIcon size={24} className="text-slate-300 dark:text-slate-600" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CENTER - Document Viewer */}
        <div className="flex-1 overflow-y-auto py-8 px-6 print:p-0">
          <div className="max-w-[850px] mx-auto">
            {/* A4 PAPER CONTAINER */}
            <div
              className="bg-white dark:bg-slate-900 mx-auto transition-all duration-300 print:shadow-none"
              style={{
                width: '794px',
                minHeight: '1123px',
                maxWidth: '100%',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                boxShadow: `
                  0 1px 2px rgba(0,0,0,0.05),
                  0 10px 30px rgba(0,0,0,0.08),
                  0 30px 80px rgba(0,0,0,0.06)
                `,
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              {/* Document Header */}
              <DocumentHeader contract={contract} status={status} />

              {/* Document Content */}
              <div className="p-12" style={{ fontFamily: '"Source Serif Pro", "Georgia", serif' }}>
                {currentPage === 0 && <Page1 contract={contract} />}
                {currentPage === 1 && <Page2 contract={contract} />}
                {currentPage === 2 && <Page3 contract={contract} />}

                {/* Document Footer */}
                <DocumentFooter currentPage={currentPage} />
              </div>
            </div>

            {/* Page Navigation */}
            <div className="mt-6 flex items-center justify-center gap-3 print:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Page {currentPage + 1} of {pages.length}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                disabled={currentPage === pages.length - 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Contract Metadata */}
        {showMetadata && (
          <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm print:hidden sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <ContractMetadata contract={contract} status={status} />
          </div>
        )}
      </div>
    </div>
  );
}

// DOCUMENT HEADER COMPONENT
function DocumentHeader({ contract, status }) {
  const StatusIcon = status.icon;
  
  return (
    <div className="relative border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.05] pointer-events-none overflow-hidden">
        <span className="text-9xl font-bold text-slate-900 dark:text-white rotate-[-15deg]" style={{ fontFamily: '"Playfair Display", serif' }}>
          {status.label.toUpperCase()}
        </span>
      </div>
      
      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <img 
              src={eaarthLogo} 
              alt="EAARTH" 
              className="h-12 object-contain mb-2"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Production Management Platform
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color} mb-3`}>
              <StatusIcon size={12} />
              {status.label}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contract ID</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: '"Courier New", monospace' }}>
                {contract.offerId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Issued</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{contract.updated}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Version</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{contract.version}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pages</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// DOCUMENT FOOTER COMPONENT
function DocumentFooter({ currentPage }) {
  return (
    <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
        <p>Page {currentPage + 1} of 3</p>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">EAARTH Production Management</p>
      </div>
      <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
        <p>This is a legally binding document</p>
        <p>Generated on {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </div>
  );
}

// CONTRACT METADATA SIDEBAR
function ContractMetadata({ contract, status }) {
  const StatusIcon = status.icon;
  
  return (
    <div className="p-6 space-y-6">
      {/* Contract Summary */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Contract Summary
        </h3>
        <div className="space-y-3">
          <InfoItem icon={FileText} label="Film Title" value={contract.filmTitle} />
          <InfoItem icon={User} label="Contractor" value={contract.crewMember.name} />
          <InfoItem icon={DollarSign} label="Weekly Rate" value={contract.fees.weeklyRate} highlight />
          <InfoItem icon={Calendar} label="Duration" value={`${contract.dealTerms.startDate} - ${contract.dealTerms.endDate}`} />
        </div>
      </div>

      {/* Status Timeline */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Signature Progress
        </h3>
        <div className="space-y-2">
          {contract.signatures.map((sig, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                sig.verified 
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {sig.verified ? <CheckCircle size={14} /> : <Clock size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{sig.signedBy}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{sig.role.replace('_', ' ')}</p>
                {sig.verified && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">✓ Signed {sig.signedAt}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Actions */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={14} />
            Download PDF
          </button>
          <button className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Printer size={14} />
            Print Contract
          </button>
        </div>
      </div>

      {/* Audit Log */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Audit Log
        </h3>
        <div className="space-y-3 text-xs">
          <AuditItem date="14/02/2024" action="Contract fully executed" user="System" />
          <AuditItem date="14/02/2024" action="Signed by Production Executive" user="Emma Thompson" />
          <AuditItem date="13/02/2024" action="Signed by Contractor" user="John Smith" />
          <AuditItem date="13/02/2024" action="Contract created" user="System" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-slate-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold truncate ${
          highlight 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-slate-700 dark:text-slate-300'
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function AuditItem({ date, action, user }) {
  return (
    <div className="flex gap-3">
      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
      <div className="flex-1">
        <p className="text-slate-700 dark:text-slate-300 font-medium">{action}</p>
        <p className="text-slate-500 dark:text-slate-400">{user} • {date}</p>
      </div>
    </div>
  );
}

// PAGE COMPONENTS (Refined Typography)
function Page1({ contract }) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.05em' }}>
          Independent Contractor Agreement
        </h1>
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
          Film Production: "{contract.filmTitle}"
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Unit Driver – Individual Services</p>
      </div>

      {/* Execution Date */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-400 rounded-r-lg p-4">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          This Agreement is made and entered into on <strong className="text-indigo-700 dark:text-indigo-400">{contract.executionDate}</strong>, 
          with effect from the date first written above.
        </p>
      </div>

      {/* Parties */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b-2 pb-2 border-slate-200 dark:border-slate-700" style={{ fontFamily: '"Playfair Display", serif' }}>
          1. Parties to the Agreement
        </h3>

        <PartyCard
          label="Producer"
          entity={contract.producer.entity}
          address={contract.producer.address}
          phone={contract.producer.phone}
          color="indigo"
        />

        <PartyCard
          label="Contractor"
          entity={contract.crewMember.name}
          address={contract.crewMember.address}
          phone={contract.crewMember.phone}
          email={contract.crewMember.email}
          citizenship={contract.crewMember.citizenship}
          residence={contract.crewMember.residence}
          color="blue"
        />
      </section>

      {/* Engagement Terms */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b-2 pb-2 border-slate-200 dark:border-slate-700" style={{ fontFamily: '"Playfair Display", serif' }}>
          2. Engagement Terms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <TermCard label="Department" value={contract.dealTerms.department} />
          <TermCard label="Position" value={contract.dealTerms.position} />
          <TermCard label="Start Date" value={contract.dealTerms.startDate} />
          <TermCard label="End Date" value={contract.dealTerms.endDate} />
        </div>
      </section>

      {/* Compensation */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b-2 pb-2 border-slate-200 dark:border-slate-700" style={{ fontFamily: '"Playfair Display", serif' }}>
          3. Compensation & Benefits
        </h3>
        
        <CompensationCard
          title="Weekly Compensation"
          baseRate={contract.fees.baseWeeklyRate}
          holidayRate={contract.fees.weeklyHolidayRate}
          totalRate={contract.fees.weeklyRate}
          color="emerald"
        />

        <CompensationCard
          title="Daily Compensation"
          baseRate={contract.fees.baseDailyRate}
          holidayRate={contract.fees.dailyHolidayRate}
          totalRate={contract.fees.dailyRate}
          color="blue"
        />

        <div className="grid grid-cols-2 gap-3">
          <PremiumRateCard
            title="6th Consecutive Day"
            rate={contract.fees.sixthDayRate}
            multiplier="1.5× Daily Rate"
            color="amber"
          />
          <PremiumRateCard
            title="7th Consecutive Day"
            rate={contract.fees.seventhDayRate}
            multiplier="2× Daily Rate"
            color="orange"
          />
        </div>
      </section>
    </div>
  );
}

function Page2({ contract }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.05em' }}>
          Special Stipulations
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Additional Terms & Conditions Specific to this Engagement</p>
      </div>

      {contract.specialStipulations && contract.specialStipulations.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b-2 pb-2 border-slate-200 dark:border-slate-700" style={{ fontFamily: '"Playfair Display", serif' }}>
            5. Special Conditions
          </h3>
          {contract.specialStipulations.map((stipulation, index) => (
            <div key={index} className="flex gap-4 p-5 border-l-4 border-indigo-500 dark:border-indigo-400 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pt-2">
                {stipulation}
              </p>
            </div>
          ))}
        </section>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 italic">No special stipulations apply to this agreement.</p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-5">
        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          Conflict Resolution
        </h4>
        <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
          In the event of any conflict between the Standard Terms and Conditions and these Special Stipulations, 
          the provisions of the Special Stipulations shall take precedence.
        </p>
      </div>
    </div>
  );
}

function Page3({ contract }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.05em' }}>
          Execution & Agreement
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Authorized Signatures & Verification</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b-2 pb-2 border-slate-200 dark:border-slate-700" style={{ fontFamily: '"Playfair Display", serif' }}>
          7. Authorized Signatures
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { role: 'crew_member', label: 'Contractor', color: 'blue' },
            { role: 'financial_controller', label: 'Financial Controller', color: 'emerald' },
            { role: 'upm', label: 'Unit Production Manager', color: 'amber' },
            { role: 'production_executive', label: 'Production Executive', color: 'indigo' },
          ].map((sig) => {
            const signature = contract.signatures?.find(s => s.role === sig.role);
            return (
              <SignatureBlock
                key={sig.role}
                label={sig.label}
                signature={signature}
                color={sig.color}
              />
            );
          })}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 border-2 border-emerald-400 rounded-full px-8 py-4 shadow-lg">
          <CheckCircle size={20} className="text-white" />
          <span className="font-bold text-white uppercase text-sm tracking-wider">
            Fully Executed & Verified
          </span>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function PartyCard({ label, entity, address, phone, email, citizenship, residence, color }) {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
  };

  return (
    <div className={`border-2 ${colors[color]} rounded-lg p-6`}>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-3">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">{entity}</p>
      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
        <p><span className="font-semibold text-slate-900 dark:text-white">Address:</span> {address}</p>
        <p><span className="font-semibold text-slate-900 dark:text-white">Phone:</span> {phone}</p>
        {email && <p><span className="font-semibold text-slate-900 dark:text-white">Email:</span> {email}</p>}
        {citizenship && residence && (
          <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <p><span className="font-semibold text-slate-900 dark:text-white">Citizenship:</span> {citizenship}</p>
            <p><span className="font-semibold text-slate-900 dark:text-white">Residence:</span> {residence}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TermCard({ label, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function CompensationCard({ title, baseRate, holidayRate, totalRate, color }) {
  const colors = {
    emerald: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-700',
    blue: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border-2 rounded-lg p-5`}>
      <h4 className="font-bold text-slate-900 dark:text-white mb-4">{title}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Base Rate</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{baseRate}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Holiday (12.07%)</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{holidayRate}</p>
        </div>
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-semibold">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRate}</p>
        </div>
      </div>
    </div>
  );
}

function PremiumRateCard({ title, rate, multiplier, color }) {
  const colors = {
    amber: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-700',
    orange: 'from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border-2 rounded-lg p-4`}>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-semibold">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{rate}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{multiplier}</p>
    </div>
  );
}

function SignatureBlock({ label, signature, color }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700',
  };

  return (
    <div className={`border-2 ${colors[color]} rounded-lg p-5`}>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-3">{label}</p>
      {signature ? (
        <div className="space-y-3">
          <div className="border-t-2 border-slate-900 dark:border-white pt-3">
            <p className="font-bold text-slate-900 dark:text-white text-lg" style={{ fontFamily: '"Brush Script MT", cursive' }}>
              {signature.signedBy}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Executed on {signature.signedAt}</p>
          </div>
          {signature.verified && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Digitally Verified</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="h-16 border-b-2 border-dashed border-slate-300 dark:border-slate-600"></div>
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">Awaiting signature</p>
        </div>
      )}
    </div>
  );
}