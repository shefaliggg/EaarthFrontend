import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Download, Palette, Type, Save,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  ArrowLeft, Maximize2, Minimize2, AlertTriangle, FileText
} from 'lucide-react';

// ─── PDF.js init ───────────────────────────────────────────────────────────────
let pdfjsLib = null;
const initPdfJs = async () => {
  if (!pdfjsLib) {
    const pdfjs  = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    pdfjsLib = pdfjs;
  }
  return pdfjsLib;
};

// ─── Design themes ─────────────────────────────────────────────────────────────
const DESIGN_TEMPLATES = [
  { id: 'ocean-blue',     name: 'Ocean Blue',    colors: { primary: '#3B82F6', secondary: '#60A5FA', bg: '#EFF6FF' }, icon: '🌊' },
  { id: 'emerald-luxury', name: 'Emerald',        colors: { primary: '#059669', secondary: '#F59E0B', bg: '#ECFDF5' }, icon: '💎' },
  { id: 'royal-purple',   name: 'Royal Purple',   colors: { primary: '#9333EA', secondary: '#C084FC', bg: '#FAF5FF' }, icon: '👑' },
  { id: 'sunset-orange',  name: 'Sunset Orange',  colors: { primary: '#F97316', secondary: '#FB923C', bg: '#FFF7ED' }, icon: '🌅' },
  { id: 'midnight-dark',  name: 'Midnight Dark',  colors: { primary: '#1F2937', secondary: '#374151', bg: '#F9FAFB' }, icon: '🌙' },
];

const guessType = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('date') || n.includes('dob'))                                   return 'date';
  if (n.includes('email'))                                                         return 'email';
  if (n.includes('phone') || n.includes('tel') || n.includes('mobile'))           return 'tel';
  if (n.includes('address') || n.includes('street'))                              return 'textarea';
  if (n.includes('rate') || n.includes('fee') || n.includes('salary') ||
      n.includes('wage') || n.includes('amount') || n.includes('pay'))            return 'number';
  return 'text';
};

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function DocumentDesignerStudio() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fileObj,        setFileObj]        = useState(null);
  const [pdfDocLib,      setPdfDocLib]      = useState(null);
  const [pdfForm,        setPdfForm]        = useState(null);
  const [fields,         setFields]         = useState([]);      // { id, label, type, rect, page, value }
  const [formData,       setFormData]       = useState({});
  const [isFillable,     setIsFillable]     = useState(false);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [canvasSize,     setCanvasSize]     = useState({ w: 0, h: 0 });
  const [zoom,           setZoom]           = useState(100);
  const [selectedTheme,  setSelectedTheme]  = useState('ocean-blue');
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [processingMsg,  setProcessingMsg]  = useState('');
  const [error,          setError]          = useState(null);
  const [stylingOptions, setStylingOptions] = useState({
    fieldHeight: 28, fieldPadding: 6, borderRadius: 4,
    labelFontSize: 11, inputFontSize: 12,
    showFieldBorders: true, showLabels: false,
  });

  const canvasRef      = useRef(null);
  const pdfJsDocRef    = useRef(null);
  const containerRef   = useRef(null);
  const renderTaskRef  = useRef(null);   // cancel previous render on page change
  const SCALE          = zoom / 100 * 1.5;   // render scale

  // ── Source detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const stateFile = location.state?.file;
    if (stateFile) { setFileObj(stateFile); return; }

    const saved = localStorage.getItem('selectedContractPdf');
    const name  = localStorage.getItem('selectedContractName');
    if (saved) {
      fetch(saved).then(r => r.blob()).then(blob =>
        setFileObj(new File([blob], name || 'contract.pdf', { type: 'application/pdf' }))
      ).catch(() => setError('Could not restore PDF from cache.'));
    } else {
      setError('No PDF file provided. Go back and select a contract.');
    }
  }, []);

  useEffect(() => { if (fileObj) loadFile(fileObj); }, [fileObj]);

  // ── Load PDF ─────────────────────────────────────────────────────────────────
  const loadFile = async (file) => {
    setIsProcessing(true);
    setProcessingMsg('Reading PDF...');
    // reset
    setFields([]); setFormData({}); setCurrentPage(1);
    setError(null); setPdfDocLib(null); setPdfForm(null); setIsFillable(false);
    pdfJsDocRef.current = null;

    try {
      if (file.type !== 'application/pdf') throw new Error('File must be a PDF.');

      const arrayBuffer = await file.arrayBuffer();

      // ── 1. pdf-lib: read real AcroForm fields ────────────────────────────────
      setProcessingMsg('Detecting AcroForm fields...');
      let extractedFields = [];
      let libDoc = null, libForm = null;

      try {
        const { PDFDocument } = await import('pdf-lib');
        libDoc  = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        libForm = libDoc.getForm();
        const rawFields = libForm.getFields();
        console.log('✅ pdf-lib fields:', rawFields.length);

        // We'll get positions from pdf.js annotations below
        extractedFields = rawFields.map(f => ({
          id:       f.getName(),
          label:    f.getName().replace(/_/g, ' ').replace(/\./g, ' › '),
          type:     f.constructor.name === 'PDFCheckBox' ? 'checkbox'
                  : f.constructor.name === 'PDFDropdown' ? 'select'
                  : guessType(f.getName()),
          pdfType:  f.constructor.name,
          value:    f.constructor.name === 'PDFTextField' ? (f.getText() || '') : '',
          options:  (f.constructor.name === 'PDFDropdown') ? f.getOptions() : [],
          rect:     null,   // filled in by pdf.js annotations
          page:     1,
        }));

        if (rawFields.length > 0) {
          setPdfDocLib(libDoc);
          setPdfForm(libForm);
          setIsFillable(true);
        }
      } catch (e) {
        console.warn('pdf-lib fallback:', e.message);
      }

      // ── 2. pdf.js: render + get field positions ──────────────────────────────
      setProcessingMsg('Rendering pages...');
      const pdfjs    = await initPdfJs();
      const pdfJsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0), verbosity: 0 }).promise;
      pdfJsDocRef.current = pdfJsDoc;
      setTotalPages(pdfJsDoc.numPages);

      // Store rects at scale:1 base — multiply by SCALE at render (stable on zoom)
      const rectMap = {};
      for (let p = 1; p <= pdfJsDoc.numPages; p++) {
        const page        = await pdfJsDoc.getPage(p);
        const annotations = await page.getAnnotations();
        const viewport    = page.getViewport({ scale: 1 }); // base units

        annotations.forEach(ann => {
          if (ann.subtype === 'Widget' && ann.fieldName && ann.rect) {
            const rect = viewport.convertToViewportRectangle(ann.rect);
            // Store normalized: x,y,w,h — multiply by SCALE at render time
            rectMap[ann.fieldName] = {
              x: rect[0],
              y: rect[1],
              w: rect[2] - rect[0],
              h: rect[3] - rect[1],
              page: p
            };
          }
        });
      }

      // Attach rects to extractedFields; if no pdf-lib fields use annotation fallback
      if (extractedFields.length > 0) {
        extractedFields = extractedFields.map(f => ({
          ...f,
          rect: rectMap[f.id] || null,
          page: rectMap[f.id]?.page || 1,
        }));
      } else {
        // Fallback: build fields from annotations only
        Object.entries(rectMap).forEach(([name, rect]) => {
          extractedFields.push({
            id:    name,
            label: name.replace(/_/g, ' '),
            type:  guessType(name),
            value: '',
            rect,
            page:  rect.page,
          });
        });
        setIsFillable(extractedFields.length > 0);
      }

      // Init form data
      const initData = {};
      extractedFields.forEach(f => { initData[f.id] = f.value || ''; });
      setFormData(initData);
      setFields(extractedFields);

      setProcessingMsg('Done!');
      setIsProcessing(false);

      // ✅ Wait for DOM commit before rendering (prevents blank first page)
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (pdfJsDocRef.current && canvasRef.current) {
            renderPage(pdfJsDocRef.current, 1);
          }
        }, 0);
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  // ── Render canvas page (cancel-safe, no black screen) ────────────────────────
  const renderPage = async (doc, pageNum) => {
    if (!doc || !canvasRef.current) return;
    try {
      // Cancel any in-progress render (prevents black/blank flicker)
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page     = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas   = canvasRef.current;
      const ctx      = canvas.getContext('2d');

      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear old frame

      setCanvasSize({ w: viewport.width, h: viewport.height });

      const renderTask = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;

    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PDF render error:', err);
      }
    }
  };

  // Re-render on page/zoom change — RAF ensures canvas is mounted
  useEffect(() => {
    if (!pdfJsDocRef.current || !canvasRef.current) return;
    const id = requestAnimationFrame(() => {
      renderPage(pdfJsDocRef.current, currentPage);
    });
    return () => cancelAnimationFrame(id);
  }, [currentPage, zoom]);

  // Zoom just re-renders canvas — rects recalculated from scale:1 base * SCALE
  // No full reload needed — prevents flicker

  // ── Field change ──────────────────────────────────────────────────────────────
  const handleFieldChange = useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (pdfForm) {
      try {
        const f = pdfForm.getField(fieldId);
        if (f.constructor.name === 'PDFTextField') f.setText(String(value));
        if (f.constructor.name === 'PDFCheckBox')  value === 'true' ? f.check() : f.uncheck();
      } catch (_) {}
    }
  }, [pdfForm]);

  // ── Export ────────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!pdfDocLib) { alert('Export requires a fillable PDF with AcroForm fields.'); return; }
    try {
      const bytes = await pdfDocLib.save();
      const url   = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const a     = document.createElement('a');
      a.href = url; a.download = 'filled-contract.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed: ' + e.message); }
  };

  const colors    = DESIGN_TEMPLATES.find(t => t.id === selectedTheme)?.colors || DESIGN_TEMPLATES[0].colors;
  const pageFields = fields.filter(f => f.page === currentPage && f.rect);

  // ── Error / Loading ───────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Go Back</button>
          <button onClick={() => { setError(null); if (fileObj) loadFile(fileObj); }} className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Retry</button>
        </div>
      </div>
    </div>
  );

  if (isProcessing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-5" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Loading Document</h2>
        <p className="text-sm text-purple-600">{processingMsg}</p>
      </div>
    </div>
  );

  // ── Main UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Document Designer</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{fileObj?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFillable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isFillable ? `● Fillable · ${fields.length} fields` : `● Text PDF · ${fields.length} fields`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
            <button onClick={() => setZoom(z => Math.max(50,  z - 10))} className="p-1 hover:bg-white rounded"><ZoomOut size={15} /></button>
            <span className="text-xs font-medium text-gray-700 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1 hover:bg-white rounded"><ZoomIn size={15} /></button>
          </div>

          <button
            onClick={handleExport}
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            className="px-4 py-2 text-white text-sm rounded-lg font-semibold flex items-center gap-2 shadow hover:opacity-90"
          >
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar ── */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 p-4 space-y-5">
          {/* Themes */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Theme</p>
            <div className="space-y-1.5">
              {DESIGN_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                  className={`w-full p-2.5 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${selectedTheme === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span>{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      <div className="w-4 h-4 rounded" style={{ background: t.colors.primary }} />
                      <div className="w-4 h-4 rounded" style={{ background: t.colors.secondary }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Field Style */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Field Style</p>
            {[
              { key: 'inputFontSize',  label: 'Font Size',    min: 8,  max: 18 },
              { key: 'fieldHeight',    label: 'Field Height', min: 18, max: 56 },
              { key: 'borderRadius',   label: 'Radius',       min: 0,  max: 12 },
            ].map(({ key, label, min, max }) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{label}</span>
                  <span className="text-purple-600 font-medium">{stylingOptions[key]}px</span>
                </div>
                <input type="range" min={min} max={max} value={stylingOptions[key]}
                  onChange={e => setStylingOptions(p => ({ ...p, [key]: +e.target.value }))}
                  className="w-full accent-purple-600 h-1" />
              </div>
            ))}

            {/* Show borders toggle */}
            <label className="flex items-center justify-between cursor-pointer mt-3">
              <span className="text-xs text-gray-600">Show Field Borders</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer"
                  checked={stylingOptions.showFieldBorders}
                  onChange={e => setStylingOptions(p => ({ ...p, showFieldBorders: e.target.checked }))} />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </div>
            </label>

            {/* Show labels toggle */}
            <label className="flex items-center justify-between cursor-pointer mt-3">
              <span className="text-xs text-gray-600">Show Field Labels</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer"
                  checked={stylingOptions.showLabels}
                  onChange={e => setStylingOptions(p => ({ ...p, showLabels: e.target.checked }))} />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </div>
            </label>
          </div>

          {/* Field list summary */}
          {fields.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fields on this page</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {pageFields.length === 0
                  ? <p className="text-xs text-gray-400">No positioned fields on page {currentPage}</p>
                  : pageFields.map(f => (
                    <div key={f.id} className="text-xs flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.primary }} />
                      <span className="text-gray-700 truncate">{f.label}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {/* ── PDF Canvas + Overlaid Inputs ── */}
        <div ref={containerRef} className="flex-1 overflow-auto flex flex-col" style={{ background: colors.bg }}>
          {/* Page nav */}
          <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronLeft size={16} /></button>
              <span className="text-sm text-gray-700 font-medium">Page {currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronRight size={16} /></button>
            </div>
            <button onClick={handleExport}
              className="px-4 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 flex items-center gap-1.5 font-medium">
              <Save size={13} /> Save & Export
            </button>
          </div>

          {/* ── PDF + overlay container ── */}
          <div className="flex-1 flex justify-center items-start p-8 overflow-auto">
            {/* Container matches canvas size — inputs overlay exactly */}
            <div className="shadow-2xl"
              style={{ position: 'relative', display: 'inline-block',
                       width: canvasSize.w || 'auto', height: canvasSize.h || 'auto',
                       background: 'white' }}>

              {/* Canvas renders PDF — sets actual pixel dimensions */}
              <canvas ref={canvasRef} className="block bg-white" />

              {/* ── OVERLAID INPUT FIELDS ── */}
              {pageFields.map(field => {
                // Stored at scale:1 base → multiply by SCALE to match canvas
                const x = field.rect.x * SCALE;
                const y = field.rect.y * SCALE;
                const w = field.rect.w * SCALE;
                const h = field.rect.h * SCALE;

                // ✅ PIXEL-PERFECT: zero padding/margin, font scales with field height
                const isTextarea = field.type === 'textarea';
                const fontSize   = Math.max(7, h * 0.62);  // proportional to field h

                const baseStyle = {
                  position:    'absolute',
                  left:        x,
                  top:         y,
                  width:       w,
                  height:      h,
                  margin:      0,
                  padding:     isTextarea ? '2px 3px' : 0,
                  paddingLeft: '3px',
                  border:      stylingOptions.showFieldBorders
                                 ? `1px solid ${colors.primary}99`
                                 : '1px solid transparent',
                  background:  'rgba(219,234,254,0.35)',
                  fontSize:    `${fontSize}px`,
                  fontFamily:  'Helvetica, Arial, sans-serif',
                  lineHeight:  isTextarea ? '1.3' : `${h}px`,
                  boxSizing:   'border-box',
                  outline:     'none',
                  zIndex:      10,
                  color:       '#111827',
                  resize:      'none',
                  overflow:    'hidden',
                  borderRadius: `${stylingOptions.borderRadius}px`,
                  verticalAlign: 'middle',
                };

                const onFocus = e => {
                  e.target.style.background   = 'rgba(255,255,255,0.96)';
                  e.target.style.border       = `1.5px solid ${colors.primary}`;
                  e.target.style.boxShadow    = `0 0 0 2px ${colors.primary}22`;
                };
                const onBlur = e => {
                  e.target.style.background   = baseStyle.background;
                  e.target.style.border       = baseStyle.border;
                  e.target.style.boxShadow    = 'none';
                };

                const value = formData[field.id] ?? field.value ?? '';

                return (
                  <React.Fragment key={field.id}>
                    {/* Optional label tooltip above field */}
                    {stylingOptions.showLabels && (
                      <div style={{
                        position:   'absolute',
                        left:       x,
                        top:        y - 13,
                        fontSize:   '8px',
                        color:      colors.primary,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        background: 'white',
                        padding:    '0 2px',
                        zIndex:     12,
                        borderRadius: 2,
                      }}>
                        {field.label}
                      </div>
                    )}

                    {field.type === 'checkbox' ? (
                      <input type="checkbox"
                        checked={value === 'true'}
                        onChange={e => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                        style={{ ...baseStyle, width: h, padding: 0, cursor: 'pointer', accentColor: colors.primary }}
                      />

                    ) : field.type === 'select' && field.options?.length > 0 ? (
                      <select value={value} onChange={e => handleFieldChange(field.id, e.target.value)}
                        style={{ ...baseStyle, cursor: 'pointer' }}
                        onFocus={onFocus} onBlur={onBlur}>
                        <option value="">—</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>

                    ) : isTextarea ? (
                      <textarea value={value}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        style={baseStyle}
                        onFocus={onFocus} onBlur={onBlur}
                      />

                    ) : (
                      <input
                        type={field.type === 'date' ? 'text' : (field.type || 'text')}
                        value={value}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        style={baseStyle}
                        onFocus={onFocus} onBlur={onBlur}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Show message if no positioned fields on this page */}
              {fields.length > 0 && pageFields.length === 0 && canvasSize.w > 0 && (
                <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-4 py-2 rounded-full">
                    No editable fields detected on this page
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}