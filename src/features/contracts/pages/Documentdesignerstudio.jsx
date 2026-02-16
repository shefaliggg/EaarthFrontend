import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Download, 
  Palette,
  Type,
  Save,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Maximize2,
  Minimize2,
  AlertTriangle
} from 'lucide-react';

// ✅ FIXED: PDF.js initialization for Vite (NO CDN worker)
let pdfjsLib = null;

const initPdfJs = async () => {
  if (!pdfjsLib) {
    try {
      console.log('🔄 Initializing PDF.js...');
      
      // Import PDF.js library
      const pdfjs = await import('pdfjs-dist');
      
      // ✅ CRITICAL FIX: Import local worker (NOT CDN)
      // This works with Vite's bundler
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      
      // Set worker source to local bundled file
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

      pdfjsLib = pdfjs;

      console.log('✅ PDF.js initialized successfully');
      console.log('📦 Version:', pdfjs.version);
      console.log('🔧 Worker:', worker.default);
      
      return pdfjsLib;
    } catch (error) {
      console.error('❌ PDF.js initialization failed:', error);
      throw new Error('Failed to load PDF.js. Please refresh the page.');
    }
  }
  return pdfjsLib;
};

const DESIGN_TEMPLATES = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional blue theme',
    colors: { primary: '#3B82F6', secondary: '#60A5FA', bg: '#EFF6FF' },
    icon: '🌊'
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxury',
    description: 'Elegant green & gold',
    colors: { primary: '#059669', secondary: '#F59E0B', bg: '#ECFDF5' },
    icon: '💎'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Modern purple gradient',
    colors: { primary: '#9333EA', secondary: '#C084FC', bg: '#FAF5FF' },
    icon: '👑'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm & energetic',
    colors: { primary: '#F97316', secondary: '#FB923C', bg: '#FFF7ED' },
    icon: '🌅'
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    description: 'Bold dark theme',
    colors: { primary: '#1F2937', secondary: '#374151', bg: '#F9FAFB' },
    icon: '🌙'
  }
];

export default function DocumentDesignerStudio() {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(location.state?.file || null);
  const [pdfData, setPdfData] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('ocean-blue');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState(null);
  
  // Styling options
  const [stylingOptions, setStylingOptions] = useState({
    fontSize: 14,
    fieldHeight: 40,
    fieldPadding: 12,
    sectionSpacing: 24,
    showFieldBorders: true,
    borderRadius: 6,
    labelFontSize: 13,
    inputFontSize: 14
  });

  const formContainerRef = useRef(null);

  // Process file if it was passed from navigation
  useEffect(() => {
    if (uploadedFile) {
      console.log('📄 File received:', uploadedFile.name, uploadedFile.size, 'bytes');
      handleFileProcess(uploadedFile);
    } else {
      console.warn('⚠️ No file received in state');
    }
  }, [uploadedFile]);

  // Safety check - if page data doesn't exist, reset to page 1
  useEffect(() => {
    if (pdfData && pdfData.pages) {
      const currentPageData = pdfData.pages[currentPage - 1];
      if (!currentPageData || !currentPageData.sections) {
        setCurrentPage(1);
      }
    }
  }, [currentPage, pdfData]);

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    setProcessingStatus('Initializing PDF parser...');
    setError(null);
    
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      console.log('🔄 Processing file:', file.name);

      // ✅ CRITICAL: Initialize PDF.js with local worker
      setProcessingStatus('Loading PDF library...');
      const pdfjs = await initPdfJs();
      
      setProcessingStatus('Reading PDF file...');
      
      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      console.log('📦 ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty');
      }

      setProcessingStatus('Parsing PDF structure...');
      
      // ✅ Load the PDF document with proper config
      console.log('🔧 Loading PDF document...');
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        verbosity: 0 // Reduce console noise
      });
      
      const pdf = await loadingTask.promise;
      
      console.log('✅ PDF loaded successfully!');
      console.log('📄 Pages:', pdf.numPages);
      
      setProcessingStatus(`Extracting content from ${pdf.numPages} pages...`);
      
      // Extract text and structure from all pages
      const extractedData = await extractPDFContent(pdf, file.name);
      
      setProcessingStatus('Organizing form fields...');
      setPdfData(extractedData);
      
      // Initialize form data
      const initialData = {};
      extractedData.pages.forEach(page => {
        page.sections.forEach(section => {
          if (section.fields && Array.isArray(section.fields)) {
            section.fields.forEach(field => {
              if (field.editable) {
                initialData[field.id] = field.value || '';
              }
            });
          }
        });
      });
      setFormData(initialData);
      
      console.log('✅ PDF processed successfully');
      console.log('📊 Extracted fields:', Object.keys(initialData).length);
      
      setProcessingStatus('Done!');
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error('❌ Error processing PDF:', error);
      
      // Provide helpful error messages
      let errorMessage = error.message;
      
      if (error.message.includes('worker')) {
        errorMessage = 'PDF.js worker failed to load. Please refresh the page and try again.';
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = 'This PDF file appears to be corrupted or invalid.';
      } else if (error.message.includes('password')) {
        errorMessage = 'This PDF is password protected. Please use an unprotected version.';
      }
      
      setError(errorMessage);
      setProcessingStatus('Error: ' + errorMessage);
      
      // Show error for 5 seconds then go back
      setTimeout(() => {
        if (confirm('Failed to process PDF. Would you like to try another file?')) {
          navigate(-1);
        }
      }, 3000);
    }
  };

  // Extract actual content from PDF
  const extractPDFContent = async (pdf, filename) => {
    const pages = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`📖 Processing page ${pageNum}/${pdf.numPages}`);
      
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items
        const textItems = textContent.items.map(item => item.str);
        const fullText = textItems.join(' ');
        
        console.log(`📝 Page ${pageNum} text length:`, fullText.length, 'characters');
        
        if (fullText.length === 0) {
          console.warn(`⚠️ Page ${pageNum} has no text - might be scanned image`);
        }
        
        // Create sections based on content
        const sections = parsePageContent(fullText, pageNum, textItems);
        
        pages.push({
          pageNumber: pageNum,
          sections: sections,
          hasText: fullText.length > 0
        });
      } catch (pageError) {
        console.error(`❌ Error processing page ${pageNum}:`, pageError);
        
        // Add error section for this page
        pages.push({
          pageNumber: pageNum,
          sections: [{
            id: `error_${pageNum}`,
            title: 'Page Load Error',
            type: 'warning',
            message: `Could not load page ${pageNum}: ${pageError.message}`
          }],
          hasText: false
        });
      }
    }
    
    return {
      title: filename.replace('.pdf', ''),
      filename: filename,
      totalPages: pdf.numPages,
      pages: pages
    };
  };

  // Parse page content and create form fields
  const parsePageContent = (fullText, pageNum, textItems) => {
    const sections = [];
    const fields = [];
    let fieldCounter = 0;

    // Check if page has text
    if (fullText.trim().length === 0) {
      sections.push({
        id: `warning_${pageNum}`,
        title: 'No Text Detected',
        type: 'warning',
        message: 'This page appears to be a scanned image or has no extractable text.'
      });
      return sections;
    }

    // Detect headers (all caps, short text, standalone)
    const headers = [];
    textItems.forEach((item, index) => {
      const trimmed = item.trim();
      if (trimmed.length > 5 && 
          trimmed.length < 80 && 
          trimmed === trimmed.toUpperCase() &&
          !trimmed.match(/^[0-9\s:\-.,()£$€]+$/) &&
          trimmed.split(' ').length <= 10) {
        headers.push(trimmed);
      }
    });

    // Add header section if found
    if (headers.length > 0) {
      sections.push({
        id: `header_${pageNum}`,
        title: headers[0],
        type: 'header',
        style: 'title'
      });
    }

    // Process text items to find form fields
    for (let i = 0; i < textItems.length; i++) {
      const item = textItems[i].trim();
      
      if (!item || item.length < 2) continue;

      // Check if this looks like a label
      const isLabel = item.endsWith(':') || 
                      item.match(/^(Name|Address|Phone|Email|Date|Department|Position|Rate|Country|Citizenship|Producer|Film|Title|Base|Weekly|Daily|Allowance|Holiday|Mobile|Production|Start|End|Value|Fee|Period|Location|Entity|Member|Crew|Lender)$/i);

      if (isLabel) {
        // This is a label, create a field
        let fieldType = 'text';
        const lowerLabel = item.toLowerCase();
        
        // Determine field type based on label
        if (lowerLabel.includes('date')) fieldType = 'date';
        else if (lowerLabel.includes('email')) fieldType = 'email';
        else if (lowerLabel.includes('address')) fieldType = 'textarea';
        else if (lowerLabel.includes('rate') || lowerLabel.includes('fee') || lowerLabel.includes('allowance') || lowerLabel.includes('value')) fieldType = 'number';
        else if (lowerLabel.includes('phone') || lowerLabel.includes('tel')) fieldType = 'tel';
        
        // Check if next items contain the value
        let value = '';
        let nextIndex = i + 1;
        
        // Look ahead for potential value (skip very short items like ":")
        while (nextIndex < textItems.length && nextIndex < i + 3) {
          const nextItem = textItems[nextIndex].trim();
          if (nextItem && !nextItem.endsWith(':') && nextItem.length > 1 && !nextItem.match(/^[():]$/)) {
            value = nextItem;
            break;
          }
          nextIndex++;
        }
        
        fields.push({
          id: `field_${pageNum}_${fieldCounter++}`,
          label: item,
          type: fieldType,
          editable: true,
          value: value || '',
          width: fieldType === 'textarea' ? '100%' : '50%',
          rows: fieldType === 'textarea' ? 3 : undefined
        });
      } else if (item.length > 60 && !item.match(/^[0-9.£$€,\s]+$/)) {
        // This looks like a paragraph of static text
        fields.push({
          id: `static_${pageNum}_${fieldCounter++}`,
          label: '',
          type: 'static',
          editable: false,
          value: item,
          width: '100%',
          style: 'paragraph'
        });
      }
    }

    // Create main content section with fields
    if (fields.length > 0) {
      sections.push({
        id: `content_${pageNum}`,
        title: pageNum === 1 ? 'Document Information' : '',
        type: 'section',
        fields: fields
      });
    } else {
      // If no fields detected, show preview of raw text
      sections.push({
        id: `content_${pageNum}`,
        title: '',
        type: 'section',
        fields: [{
          id: `text_${pageNum}`,
          label: '',
          type: 'static',
          editable: false,
          value: fullText.substring(0, 2000) + (fullText.length > 2000 ? '...' : ''),
          width: '100%',
          style: 'paragraph'
        }]
      });
    }
    
    return sections;
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleStyleChange = (key, value) => {
    setStylingOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportPDF = () => {
    // Create a summary of filled data
    const filledFields = Object.entries(formData).filter(([_, value]) => value);
    console.log('Filled fields:', filledFields);
    
    alert(`Ready to export PDF with ${filledFields.length} filled fields!\n\n(In production, this would generate a filled PDF using jsPDF or similar)`);
  };

  const getTemplateColors = () => {
    const template = DESIGN_TEMPLATES.find(t => t.id === selectedTemplate);
    return template ? template.colors : DESIGN_TEMPLATES[0].colors;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      formContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Error screen
  if (error && !isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing screen
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 border-4 border-lavender-200 border-t-lavender-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Document</h2>
          <p className="text-gray-600 mb-6">{processingStatus}</p>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-start gap-3 text-sm text-left">
              <div className="w-2 h-2 bg-lavender-600 rounded-full animate-pulse mt-1.5 flex-shrink-0"></div>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900 mb-2">What's happening:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Loading PDF.js library</li>
                  <li>✓ Initializing worker thread</li>
                  <li>✓ Reading PDF binary data</li>
                  <li>✓ Parsing document structure</li>
                  <li>✓ Extracting text from pages</li>
                  <li>✓ Detecting form fields</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Document Loaded</h2>
          <p className="text-gray-600 mb-4">Please select a contract to get started.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700"
          >
            Browse Contracts
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = pdfData.pages?.[currentPage - 1];
  const colors = getTemplateColors();

  // Don't render if no valid page data
  if (!currentPageData || !currentPageData.sections) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Page</h2>
          <p className="text-gray-600 mb-4">This page doesn't exist.</p>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-6 py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700"
          >
            Go to Page 1
          </button>
        </div>
      </div>
    );
  }

  // Show warning if page has no text
  const showNoTextWarning = !currentPageData.hasText;

  // Document Designer Main View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Designer Studio</h1>
                <p className="text-sm text-gray-600">
                  {pdfData.filename} • {pdfData.totalPages} pages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-2 hover:bg-white rounded transition-colors"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                  className="p-2 hover:bg-white rounded transition-colors"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              
              <button
                onClick={handleExportPDF}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                }}
                className="px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2 shadow-lg transition-opacity"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Design Templates */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-6 space-y-6">
            {/* Design Templates */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Palette size={20} className="text-lavender-600" />
                Design Templates
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a professional template
              </p>

              <div className="space-y-3">
                {DESIGN_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-lavender-500 bg-lavender-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {template.description}
                        </p>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: template.colors.secondary }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Controls */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Type size={20} className="text-lavender-600" />
                Layout Controls
              </h3>

              <div className="space-y-6">
                {/* Label Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Label Font Size
                    <span className="ml-2 text-lavender-600 font-normal">{stylingOptions.labelFontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="11"
                    max="16"
                    value={stylingOptions.labelFontSize}
                    onChange={(e) => handleStyleChange('labelFontSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-600"
                  />
                </div>

                {/* Input Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Input Font Size
                    <span className="ml-2 text-lavender-600 font-normal">{stylingOptions.inputFontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    value={stylingOptions.inputFontSize}
                    onChange={(e) => handleStyleChange('inputFontSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-600"
                  />
                </div>

                {/* Field Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Field Height
                    <span className="ml-2 text-lavender-600 font-normal">{stylingOptions.fieldHeight}px</span>
                  </label>
                  <input
                    type="range"
                    min="36"
                    max="56"
                    value={stylingOptions.fieldHeight}
                    onChange={(e) => handleStyleChange('fieldHeight', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-600"
                  />
                </div>

                {/* Section Spacing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Section Spacing
                    <span className="ml-2 text-lavender-600 font-normal">{stylingOptions.sectionSpacing}px</span>
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="40"
                    value={stylingOptions.sectionSpacing}
                    onChange={(e) => handleStyleChange('sectionSpacing', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-600"
                  />
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Border Radius
                    <span className="ml-2 text-lavender-600 font-normal">{stylingOptions.borderRadius}px</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={stylingOptions.borderRadius}
                    onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-600"
                  />
                </div>

                {/* Show Borders Toggle */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show Field Borders</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={stylingOptions.showFieldBorders}
                        onChange={(e) => handleStyleChange('showFieldBorders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lavender-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lavender-600"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Document Form */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* No Text Warning */}
          {showNoTextWarning && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">
                  This page appears to be a scanned image or has no extractable text. 
                  You may need OCR or manual field definition.
                </span>
              </div>
            </div>
          )}

          {/* Page Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                Page {currentPage} of {pdfData.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(pdfData.totalPages, currentPage + 1))}
                disabled={currentPage === pdfData.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-lavender-600 text-white rounded-lg font-medium hover:bg-lavender-700 flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>

          {/* Scrollable Form Container */}
          <div 
            ref={formContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{ 
              backgroundColor: colors.bg,
              padding: '40px 20px'
            }}
          >
            <div 
              className="mx-auto bg-white shadow-2xl"
              style={{
                width: `${zoom}%`,
                maxWidth: '210mm',
                minHeight: '297mm',
                transform: zoom < 100 ? 'scale(1)' : 'none',
                transformOrigin: 'top center'
              }}
            >
              <div className="p-12">
                {/* Render page sections */}
                {currentPageData.sections.map((section, sectionIdx) => {
                  // Handle warning sections
                  if (section.type === 'warning') {
                    return (
                      <div 
                        key={section.id}
                        className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                          <div>
                            <h3 className="font-bold text-yellow-900 mb-1">{section.title}</h3>
                            <p className="text-sm text-yellow-800">{section.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Handle header sections
                  if (section.type === 'header') {
                    return (
                      <div 
                        key={section.id}
                        className="mb-8 pb-4 border-b-2"
                        style={{ 
                          borderColor: colors.primary,
                          marginBottom: stylingOptions.sectionSpacing
                        }}
                      >
                        <h1 
                          className="font-bold text-center"
                          style={{ 
                            color: colors.primary,
                            fontSize: stylingOptions.labelFontSize + 10
                          }}
                        >
                          {section.title}
                        </h1>
                      </div>
                    );
                  }

                  // Handle regular sections
                  return (
                    <div 
                      key={section.id}
                      style={{ marginBottom: stylingOptions.sectionSpacing }}
                    >
                      {/* Section Title */}
                      {section.title && (
                        <h2 
                          className="font-bold mb-4"
                          style={{ 
                            color: colors.primary,
                            fontSize: stylingOptions.labelFontSize + 4
                          }}
                        >
                          {section.title}
                        </h2>
                      )}

                      {/* Section Fields */}
                      {section.fields && section.fields.length > 0 && (
                        <div className="space-y-4">
                          {section.fields.map((field) => (
                            <FormField
                              key={field.id}
                              field={field}
                              value={formData[field.id]}
                              onChange={handleFieldChange}
                              colors={colors}
                              styling={stylingOptions}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Form Field Component (unchanged)
function FormField({ field, value, onChange, colors, styling }) {
  const getFieldWidth = () => {
    if (field.width === '100%') return 'w-full';
    if (field.width === '50%') return 'w-1/2';
    if (field.width === '33.33%') return 'w-1/3';
    return 'w-full';
  };

  const inputBaseStyle = {
    height: field.type === 'textarea' ? 'auto' : `${styling.fieldHeight}px`,
    fontSize: `${styling.inputFontSize}px`,
    padding: `${styling.fieldPadding}px`,
    borderRadius: `${styling.borderRadius}px`,
    borderWidth: styling.showFieldBorders ? '1px' : '0',
    borderColor: '#E5E7EB',
    backgroundColor: field.editable ? '#FFFFFF' : '#F9FAFB'
  };

  if (field.type === 'static') {
    if (field.style === 'label') {
      return (
        <div className={getFieldWidth()}>
          <p 
            className="font-medium"
            style={{ 
              fontSize: `${styling.labelFontSize}px`,
              color: '#374151'
            }}
          >
            {field.label} {field.value}
          </p>
        </div>
      );
    }

    if (field.style === 'description' || field.style === 'paragraph') {
      return (
        <div className="w-full">
          {field.label && (
            <p 
              className="font-medium mb-2"
              style={{ 
                fontSize: `${styling.labelFontSize}px`,
                color: '#374151'
              }}
            >
              {field.label}
            </p>
          )}
          <p 
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            style={{ fontSize: `${styling.inputFontSize - 1}px` }}
          >
            {field.value}
          </p>
        </div>
      );
    }
  }

  return (
    <div className={`inline-block pr-4 ${getFieldWidth()}`}>
      {field.label && (
        <label 
          className="block font-medium mb-2"
          style={{ 
            fontSize: `${styling.labelFontSize}px`,
            color: '#374151'
          }}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {field.type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={!field.editable}
          rows={field.rows || 3}
          placeholder={field.placeholder || 'Enter text...'}
          className="w-full resize-none focus:ring-2 focus:outline-none transition-all"
          style={{
            ...inputBaseStyle,
            borderColor: styling.showFieldBorders ? '#E5E7EB' : 'transparent'
          }}
        />
      ) : (
        <input
          type={field.type}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={!field.editable}
          placeholder={field.placeholder || ''}
          className="w-full focus:ring-2 focus:outline-none transition-all"
          style={{
            ...inputBaseStyle,
            borderColor: styling.showFieldBorders ? '#E5E7EB' : 'transparent'
          }}
        />
      )}

      {field.helper && (
        <p 
          className="mt-1 text-gray-500"
          style={{ fontSize: `${styling.inputFontSize - 2}px` }}
        >
          {field.helper}
        </p>
      )}
    </div>
  );
}