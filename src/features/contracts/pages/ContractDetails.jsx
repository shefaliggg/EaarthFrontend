import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── PDF.js init ────────────────────────────────────────────────────────────────
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

const guessType = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('date') || n.includes('dob'))                               return 'date';
  if (n.includes('email'))                                                    return 'email';
  if (n.includes('phone') || n.includes('tel') || n.includes('mobile'))      return 'tel';
  if (n.includes('address') || n.includes('street'))                         return 'textarea';
  if (n.includes('rate') || n.includes('fee') || n.includes('salary') ||
      n.includes('wage') || n.includes('amount') || n.includes('pay'))       return 'number';
  return 'text';
};

const CURRENCIES = [
  { value: '£', label: 'GBP (£)' },
  { value: '$', label: 'USD ($)' },
  { value: '€', label: 'EUR (€)' },
];

const TEMPLATE_TYPES = [
  { id: 'service',   label: 'Service Agreement' },
  { id: 'loanout',   label: 'Crew – Loanout Services' },
  { id: 'transport', label: 'Transport – Self Employed' },
  { id: 'daily',     label: 'Daily Transport – PAYE' },
  { id: 'paye',      label: 'PAYE Agreement' },
];

const DEFAULT = {
  templateType: 'service',
  contractTitle: 'Service Agreement',
  clientName: '', clientAddress: '', clientCompany: '',
  providerName: '', providerAddress: '', providerCompany: '',
  startDate: '', endDate: '',
  currency: '£', feeAmount: '',
  paymentTerms: 'Net 30 days from invoice',
  scopeOfWork: '', deliverables: '',
  governingLaw: 'England and Wales',
  terminationDays: '30',
  confidentiality: true, ipAssignment: true, limitation: true,
  dispute: 'arbitration',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (d) => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  : null;

const formatFee = (amount, currency) => {
  if (!amount) return null;
  const n = parseFloat(amount);
  if (isNaN(n)) return null;
  return `${currency}${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function getCompletion(form) {
  const fields = [form.clientName, form.clientAddress, form.providerName, form.providerAddress,
    form.startDate, form.endDate, form.feeAmount, form.scopeOfWork];
  return Math.round(fields.filter(f => f && String(f).trim().length > 0).length / fields.length * 100);
}

function hashStr(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── Primitive UI ───────────────────────────────────────────────────────────────
const fieldCls = `w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-input
  text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
  transition-all duration-150`;

function FieldRow({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {label}{required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ label, required, hint, ...props }) {
  return (
    <FieldRow label={label} required={required} hint={hint}>
      <input className={fieldCls} {...props} />
    </FieldRow>
  );
}

function Textarea({ label, hint, rows = 3, ...props }) {
  return (
    <FieldRow label={label} hint={hint}>
      <textarea rows={rows} className={`${fieldCls} resize-none leading-relaxed`} {...props} />
    </FieldRow>
  );
}

function Select({ label, options, value, onChange, hint }) {
  return (
    <FieldRow label={label} hint={hint}>
      <div className="relative">
        <select value={value} onChange={onChange}
          className={`${fieldCls} appearance-none pr-8 cursor-pointer`}>
          {options.map(o => (
            typeof o === 'string'
              ? <option key={o} value={o}>{o}</option>
              : <option key={o.value ?? o.id} value={o.value ?? o.id}>{o.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
        </svg>
      </div>
    </FieldRow>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-border'}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── Contract Data Form ─────────────────────────────────────────────────────────
function ContractDataTab({ form, set }) {
  const pct = getCompletion(form);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] font-semibold text-primary mb-1.5">
            <span>Form completion</span><span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        {pct === 100 && (
          <div className="flex-shrink-0 w-7 h-7 bg-mint-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <SectionDivider label="Template" />

      <Select label="Agreement Type" value={form.templateType}
        onChange={e => { set('templateType')(e); set('contractTitle')({ target: { value: TEMPLATE_TYPES.find(t=>t.id===e.target.value)?.label||'' } }); }}
        options={TEMPLATE_TYPES} />

      <Input label="Contract Title" value={form.contractTitle} onChange={set('contractTitle')} placeholder="e.g. Service Agreement" />

      <SectionDivider label="Client — Party A" />
      <Input label="Full Name" required value={form.clientName} onChange={set('clientName')} placeholder="Jane Smith" />
      <Input label="Company" value={form.clientCompany} onChange={set('clientCompany')} placeholder="Acme Ltd" />
      <Textarea label="Address" rows={2} value={form.clientAddress} onChange={set('clientAddress')} placeholder="123 High Street, London" />

      <SectionDivider label="Service Provider — Party B" />
      <Input label="Full Name" required value={form.providerName} onChange={set('providerName')} placeholder="John Doe" />
      <Input label="Company" value={form.providerCompany} onChange={set('providerCompany')} placeholder="Freelance Ltd" />
      <Textarea label="Address" rows={2} value={form.providerAddress} onChange={set('providerAddress')} placeholder="456 Main Road, Manchester" />

      <SectionDivider label="Term" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Date" required type="date" value={form.startDate} onChange={set('startDate')} />
        <Input label="End Date" required type="date" value={form.endDate} onChange={set('endDate')} />
      </div>

      <SectionDivider label="Fees" />
      <div className="grid grid-cols-3 gap-3">
        <Select label="Currency" value={form.currency} onChange={set('currency')} options={CURRENCIES} />
        <div className="col-span-2">
          <Input label="Fee Amount" required type="number" value={form.feeAmount} onChange={set('feeAmount')} placeholder="50,000" />
        </div>
      </div>
      <Input label="Payment Terms" value={form.paymentTerms} onChange={set('paymentTerms')} placeholder="Net 30 days from invoice" />

      <SectionDivider label="Scope of Work" />
      <Textarea label="Description" rows={4} value={form.scopeOfWork} onChange={set('scopeOfWork')}
        placeholder="Describe the services to be provided in detail..." />
      <Textarea label="Deliverables" hint="one per line" rows={3} value={form.deliverables} onChange={set('deliverables')}
        placeholder="Final screenplay&#10;Two rounds of revisions" />

      <SectionDivider label="Legal" />
      <div className="space-y-4">
        <Toggle checked={form.confidentiality} onChange={set('confidentiality')}
          label="Confidentiality Clause" description="Mutual NDA for the term + 5 years" />
        <Toggle checked={form.ipAssignment} onChange={set('ipAssignment')}
          label="IP Assignment" description="All work product transfers to client on payment" />
        <Toggle checked={form.limitation} onChange={set('limitation')}
          label="Limitation of Liability" description="Cap liability to 3 months' fees" />
      </div>

      <Input label="Governing Law" value={form.governingLaw} onChange={set('governingLaw')} placeholder="England and Wales" />
      <Input label="Termination Notice (days)" type="number" value={form.terminationDays} onChange={set('terminationDays')} placeholder="30" />

      <Select label="Dispute Resolution" value={form.dispute} onChange={set('dispute')}
        options={[{ value: 'arbitration', label: 'LCIA Arbitration' }, { value: 'courts', label: 'Courts' }]} />

      <div className="h-4" />
    </div>
  );
}

// ── Live Contract Preview ──────────────────────────────────────────────────────
function Section({ num, title, children }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[9px] font-mono text-muted-foreground/50">{num}.</span>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function LivePreview({ form }) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const start = fmt(form.startDate);
  const end   = fmt(form.endDate);
  const fee   = formatFee(form.feeAmount, form.currency);
  const deliverables = form.deliverables.split('\n').filter(d => d.trim());
  const template = TEMPLATE_TYPES.find(t => t.id === form.templateType);

  const Blank = ({ w = '120px' }) => (
    <span className="inline-block border-b-2 border-dashed border-border text-transparent select-none"
      style={{ minWidth: w }}>——</span>
  );

  return (
    <div style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
      className="bg-card text-foreground min-h-full text-[13px]">

      {/* Document header — dark band */}
      <div className="bg-foreground px-10 py-8">
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2">{template?.label}</div>
        <h1 className="text-[20px] font-bold text-white leading-tight mb-1">
          {form.contractTitle || 'Contract Agreement'}
        </h1>
        {(form.clientName || form.providerName) && (
          <p className="text-xs text-white/50">
            Between {form.clientName || '—'} and {form.providerName || '—'}
          </p>
        )}
        <p className="text-xs text-white/50 mt-1">Date: {today}</p>
      </div>

      <div className="px-10 py-8 space-y-6">

        {/* Reference */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Reference</div>
            <div className="text-xs font-mono text-primary mt-0.5">
              AGR-{new Date().getFullYear()}-{String(hashStr(form.clientName + form.providerName)).slice(0, 4).padStart(4, '0')}
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
            Draft
          </span>
        </div>

        {/* 1. Parties */}
        <Section num="1" title="Parties">
          <p className="text-[12px] text-muted-foreground mb-3">
            This Agreement is entered into on <strong className="text-foreground">{start ?? <Blank />}</strong>, between:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'Client', tag: 'Party A', name: form.clientName, company: form.clientCompany, address: form.clientAddress, color: 'var(--primary)' },
              { role: 'Service Provider', tag: 'Party B', name: form.providerName, company: form.providerCompany, address: form.providerAddress, color: 'var(--sky-600)' },
            ].map(p => (
              <div key={p.role} className="rounded-lg border border-border p-3" style={{ borderLeftColor: p.color, borderLeftWidth: 3 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{p.role}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `color-mix(in srgb, ${p.color} 10%, transparent)`, color: p.color }}>{p.tag}</span>
                </div>
                {(p.name || p.company || p.address) ? (
                  <>
                    {p.name    && <p className="text-[12px] font-semibold text-foreground">{p.name}</p>}
                    {p.company && <p className="text-[11px] text-muted-foreground">{p.company}</p>}
                    {p.address && <p className="text-[11px] text-muted-foreground mt-0.5">{p.address}</p>}
                  </>
                ) : <p className="text-[11px] text-muted-foreground/50 italic">Not specified</p>}
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Term */}
        <Section num="2" title="Term of Agreement">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            This Agreement commences on <strong className="text-foreground">{start ?? <Blank w="90px" />}</strong> and
            continues until <strong className="text-foreground">{end ?? <Blank w="90px" />}</strong>, unless terminated
            earlier per Section 8. Time is of the essence.
          </p>
        </Section>

        {/* 3. Scope */}
        <Section num="3" title="Scope of Work">
          {form.scopeOfWork
            ? <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-line">{form.scopeOfWork}</p>
            : <p className="text-[12px] text-muted-foreground/50 italic">Scope of services not yet defined…</p>
          }
        </Section>

        {/* 4. Deliverables */}
        {deliverables.length > 0 && (
          <Section num="4" title="Deliverables">
            <div className="space-y-1.5">
              {deliverables.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-primary mt-0.5">{i + 1}</span>
                  <span className="text-[12px] text-muted-foreground">{d}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 5. Fees */}
        <Section num="5" title="Fees & Payment">
          <div className="bg-background border border-border rounded-xl p-4 mb-3 flex items-end justify-between">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Total Contract Value</div>
              <div className="text-2xl font-bold text-foreground">{fee ?? <span className="text-muted-foreground/50 text-xl">Not set</span>}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Payment Terms</div>
              <div className="text-xs font-semibold text-primary">{form.paymentTerms || 'Net 30'}</div>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            The Client shall pay <strong className="text-foreground">{fee ?? <Blank w="70px" />}</strong>.
            Late payments incur 8% p.a. above Bank of England base rate.
          </p>
        </Section>

        {form.confidentiality && (
          <Section num="6" title="Confidentiality">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Each party shall hold in strict confidence all Confidential Information received from the other party
              for the term of this Agreement and five (5) years thereafter.
            </p>
          </Section>
        )}

        {form.ipAssignment && (
          <Section num="7" title="Intellectual Property">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              All work product created hereunder shall, upon full payment, be the sole property of the Client.
              The Service Provider assigns all rights, title, and interest therein.
            </p>
          </Section>
        )}

        <Section num="8" title="Termination">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Either party may terminate with <strong className="text-foreground">{form.terminationDays || '30'} days'</strong> written notice.
            Immediate termination permitted upon material breach. Client pays for all work performed to date.
          </p>
        </Section>

        {form.limitation && (
          <Section num="9" title="Limitation of Liability">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Neither party shall be liable for indirect or consequential damages. Total liability shall not
              exceed fees paid in the three (3) months preceding the claim.
            </p>
          </Section>
        )}

        <Section num="10" title="Governing Law">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            This Agreement is governed by the laws of <strong className="text-foreground">{form.governingLaw || 'England and Wales'}</strong>.
            {form.dispute === 'arbitration'
              ? ' Disputes shall be resolved by binding LCIA arbitration.'
              : ' Disputes shall be subject to the exclusive jurisdiction of the courts.'}
          </p>
        </Section>

        {/* Execution */}
        <div className="pt-6 border-t-2 border-border">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest text-center mb-6">In Witness Whereof</p>
          <div className="grid grid-cols-2 gap-8">
            {[
              { role: 'Client', name: form.clientName, company: form.clientCompany },
              { role: 'Service Provider', name: form.providerName, company: form.providerCompany },
            ].map(p => (
              <div key={p.role}>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-3">{p.role}</div>
                <div className="border-b border-border h-10 mb-2" />
                <p className="text-[11px] font-semibold text-muted-foreground">{p.name || 'Name'}</p>
                {p.company && <p className="text-[10px] text-muted-foreground">{p.company}</p>}
                <div className="border-b border-border h-8 mt-3 mb-1" />
                <p className="text-[10px] text-muted-foreground/50">Date</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border text-center">
          <p className="text-[9px] font-mono text-muted-foreground/50">
            CONFIDENTIAL — {form.contractTitle || 'Draft'} — REF AGR-{new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ContractBuilder() {
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT);
  const [tab, setTab]   = useState('upload');

  const canvasRef     = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfJsDocRef   = useRef(null);
  const fieldRefs     = useRef({});

  const [uploadFile,     setUploadFile]     = useState(null);
  const [uploadFields,   setUploadFields]   = useState([]);
  const [uploadFormData, setUploadFormData] = useState({});
  const [uploadPdfForm,  setUploadPdfForm]  = useState(null);
  const [uploadFillable, setUploadFillable] = useState(false);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [canvasSize,     setCanvasSize]     = useState({ w: 0, h: 0 });
  const [zoom,           setZoom]           = useState(100);
  const [uploadLoading,  setUploadLoading]  = useState(false);
  const [uploadLoadMsg,  setUploadLoadMsg]  = useState('');
  const [uploadError,    setUploadError]    = useState(null);
  const [activeField,    setActiveField]    = useState(null);
  const [isDragging,     setIsDragging]     = useState(false);

  const SCALE = zoom / 100 * 1.5;

  const set = useCallback((key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  const handlePrint = () => {
    const el = document.getElementById('contract-preview-doc');
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${form.contractTitle}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Georgia,serif;}@media print{@page{margin:0;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const loadUploadPdf = async (f) => {
    setUploadLoading(true); setUploadError(null); setUploadFile(f);
    setUploadFields([]); setUploadFormData({}); setCurrentPage(1);
    setActiveField(null); pdfJsDocRef.current = null;

    try {
      const ab = await f.arrayBuffer();
      setUploadLoadMsg('Reading form fields…');
      let extracted = []; let libForm = null;

      try {
        const { PDFDocument } = await import('pdf-lib');
        const libDoc = await PDFDocument.load(ab, { ignoreEncryption: true });
        libForm = libDoc.getForm();
        const raw = libForm.getFields();
        extracted = raw.map(fld => ({
          id:      fld.getName(),
          label:   fld.getName().replace(/_/g, ' ').replace(/\./g, ' › '),
          type:    fld.constructor.name === 'PDFCheckBox' ? 'checkbox'
                 : fld.constructor.name === 'PDFDropdown' ? 'select'
                 : guessType(fld.getName()),
          value:   fld.constructor.name === 'PDFTextField' ? (fld.getText() || '') : '',
          options: fld.constructor.name === 'PDFDropdown' ? fld.getOptions() : [],
          rect: null, page: 1,
        }));
        if (raw.length > 0) { setUploadPdfForm(libForm); setUploadFillable(true); }
      } catch (e) { console.warn(e.message); }

      setUploadLoadMsg('Rendering…');
      const pdfjs    = await initPdfJs();
      const pdfJsDoc = await pdfjs.getDocument({ data: ab.slice(0), verbosity: 0 }).promise;
      pdfJsDocRef.current = pdfJsDoc;
      setTotalPages(pdfJsDoc.numPages);

      const rectMap = {};
      for (let p = 1; p <= pdfJsDoc.numPages; p++) {
        const page = await pdfJsDoc.getPage(p);
        const anns = await page.getAnnotations();
        const vp   = page.getViewport({ scale: 1 });
        anns.forEach(ann => {
          if (ann.subtype === 'Widget' && ann.fieldName && ann.rect) {
            const r = vp.convertToViewportRectangle(ann.rect);
            rectMap[ann.fieldName] = { x: r[0], y: r[1], w: r[2]-r[0], h: r[3]-r[1], page: p };
          }
        });
      }

      if (extracted.length > 0) {
        extracted = extracted.map(f => ({ ...f, rect: rectMap[f.id] || null, page: rectMap[f.id]?.page || 1 }));
      } else {
        Object.entries(rectMap).forEach(([name, rect]) => {
          extracted.push({ id: name, label: name.replace(/_/g, ' '), type: guessType(name), value: '', rect, page: rect.page });
        });
        setUploadFillable(extracted.length > 0);
      }

      const init = {};
      extracted.forEach(f => { init[f.id] = f.value || ''; });
      setUploadFormData(init);
      setUploadFields(extracted);
      setUploadLoading(false);

      requestAnimationFrame(() => setTimeout(() => {
        if (pdfJsDocRef.current && canvasRef.current) renderUploadPage(pdfJsDocRef.current, 1);
      }, 0));

    } catch (err) { setUploadError(err.message); setUploadLoading(false); }
  };

  const renderUploadPage = async (doc, pageNum) => {
    if (!doc || !canvasRef.current) return;
    try {
      if (renderTaskRef.current) { renderTaskRef.current.cancel(); renderTaskRef.current = null; }
      const page   = await doc.getPage(pageNum);
      const vp     = page.getViewport({ scale: SCALE });
      const canvas = canvasRef.current;
      const ctx    = canvas.getContext('2d');
      canvas.width = vp.width; canvas.height = vp.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasSize({ w: vp.width, h: vp.height });
      const task = page.render({ canvasContext: ctx, viewport: vp });
      renderTaskRef.current = task;
      await task.promise;
      renderTaskRef.current = null;
    } catch (err) { if (err?.name !== 'RenderingCancelledException') console.error(err); }
  };

  useEffect(() => {
    if (!pdfJsDocRef.current || !canvasRef.current) return;
    const id = requestAnimationFrame(() => renderUploadPage(pdfJsDocRef.current, currentPage));
    return () => cancelAnimationFrame(id);
  }, [currentPage, zoom, uploadFile]);

  const handleUploadFieldChange = useCallback((id, value) => {
    setUploadFormData(prev => ({ ...prev, [id]: value }));
    if (uploadPdfForm) {
      try {
        const fld = uploadPdfForm.getField(id);
        if (fld.constructor.name === 'PDFTextField') fld.setText(String(value));
        if (fld.constructor.name === 'PDFCheckBox')  value === 'true' ? fld.check() : fld.uncheck();
      } catch (_) {}
    }
  }, [uploadPdfForm]);

  const pageFields   = uploadFields.filter(f => f.page === currentPage && f.rect);
  const fieldsByPage = uploadFields.reduce((acc, f) => { (acc[f.page || 1] ??= []).push(f); return acc; }, {});
  const pct          = getCompletion(form);

  const TABS = [
    { id: 'data', label: 'Contract Data', icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    )},
    { id: 'upload', label: 'Upload Template', icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
      </svg>
    )},
  ];

  // ── Shared input classes for upload field inputs ───────────────────────────
  const uploadFieldCls = (isActive) =>
    `w-full text-sm px-3 py-2 rounded-lg border outline-none transition-all bg-input text-foreground
     ${isActive
       ? 'border-primary ring-2 ring-primary/10'
       : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/10'}`;

  return (
    <div className="flex flex-col bg-background text-foreground"
      style={{ height: '100vh', fontFamily: '"Outfit", system-ui, sans-serif' }}>

      {/* ── Top bar ── */}
      <header className="flex-shrink-0 bg-card border-b border-border px-6 h-14 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
              <svg className="w-4 h-4 text-card" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">Contract Template Engine</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Professional agreement builder</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all
                  ${tab === t.id
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'}`}>
                {t.icon}
                {t.label}
                {t.id === 'data' && (
                  <span className={`ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold
                    ${pct === 100 ? 'bg-mint-100 text-mint-600' : 'bg-muted text-muted-foreground'}`}>
                    {pct}%
                  </span>
                )}
                {t.id === 'upload' && uploadFile && (
                  <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-mint-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-semibold
              text-muted-foreground rounded-xl hover:bg-muted transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export PDF
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground
            text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Finalise Contract
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* LEFT PANEL */}
        <div className="w-[440px] flex-shrink-0 flex flex-col overflow-hidden bg-card border-r border-border">

          {/* Panel header */}
          <div className="flex-shrink-0 px-5 py-4 border-b border-border">
            {tab === 'data' && (
              <div>
                <h2 className="text-sm font-bold text-foreground">Contract Details</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Fill in the contract information below</p>
              </div>
            )}
            {tab === 'upload' && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Upload Template</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {uploadFile ? `${uploadFields.length} fields detected` : 'Inspect PDF form fields'}
                  </p>
                </div>
                {uploadFile && !uploadLoading && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full
                    ${uploadFillable ? 'bg-mint-100 text-mint-600' : 'bg-amber-50 text-amber-600'}`}>
                    {uploadFillable ? '● Fillable PDF' : '● Text PDF'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">

            {/* ── Contract Data tab ── */}
            {tab === 'data' && (
              !uploadFile ? (
                <div className="flex items-center justify-center h-full text-muted-foreground/50">
                  <div className="text-center px-6">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="text-sm font-semibold">No contract loaded</p>
                    <p className="text-xs mt-1 opacity-70">Upload a PDF template first</p>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4">
                  <ContractDataTab form={form} set={set} />
                </div>
              )
            )}

            {/* ── Upload tab ── */}
            {tab === 'upload' && (
              <>
                {/* Empty state */}
                {!uploadFile && !uploadLoading && (
                  <div className="flex items-center justify-center h-full p-6">
                    <div
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={e => {
                        e.preventDefault(); setIsDragging(false);
                        const f = e.dataTransfer.files[0];
                        if (f?.type === 'application/pdf') loadUploadPdf(f);
                        else setUploadError('Please drop a valid PDF file.');
                      }}
                      className={`w-full rounded-2xl border-2 border-dashed p-10 text-center transition-all
                        ${isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40 hover:bg-primary/5'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors
                        ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>
                        <svg className={`w-7 h-7 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1.5">Drop PDF contract here</h3>
                      <p className="text-xs text-muted-foreground mb-5">or click to browse files</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground
                        text-xs font-semibold rounded-xl cursor-pointer hover:bg-primary/90 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                        Choose PDF File
                        <input type="file" accept=".pdf" className="sr-only"
                          onChange={e => { const f = e.target.files[0]; if (f) loadUploadPdf(f); }} />
                      </label>
                      {uploadError && <p className="text-xs text-destructive mt-3">{uploadError}</p>}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {uploadLoading && (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs text-muted-foreground">{uploadLoadMsg}</p>
                  </div>
                )}

                {/* File loaded */}
                {uploadFile && !uploadLoading && (
                  <div className="px-4 py-3">
                    {/* File info bar */}
                    <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-background rounded-xl border border-border">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span className="text-xs font-medium text-foreground truncate flex-1">{uploadFile.name}</span>
                      <button
                        onClick={() => { setUploadFile(null); setUploadFields([]); setUploadFormData({}); pdfJsDocRef.current = null; setUploadError(null); setActiveField(null); }}
                        className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {uploadFields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm font-medium">No form fields detected</p>
                        <p className="text-xs mt-1">This PDF has no AcroForm fields</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {Object.entries(fieldsByPage).map(([page, pfList]) => (
                          <div key={page}>
                            <div className="flex items-center gap-2 py-2 sticky top-0 bg-card z-10">
                              <div className="flex-1 h-px bg-border" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Page {page}</span>
                              <div className="flex-1 h-px bg-border" />
                            </div>
                            {pfList.map(field => {
                              const isActive = activeField === field.id;
                              const value    = uploadFormData[field.id] ?? '';

                              return (
                                <div key={field.id}
                                  ref={el => fieldRefs.current[field.id] = el}
                                  onClick={() => { setActiveField(field.id); if (field.page !== currentPage) setCurrentPage(field.page); }}
                                  className={`rounded-xl border p-3 mb-2 cursor-pointer transition-all
                                    ${isActive
                                      ? 'border-primary bg-primary/5 shadow-sm'
                                      : 'border-transparent hover:border-border hover:bg-background'}`}
                                >
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors
                                      ${isActive ? 'bg-primary' : 'bg-border'}`} />
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide truncate flex-1">
                                      {field.label}
                                    </span>
                                    <span className="text-[9px] font-mono text-muted-foreground/50">{field.type}</span>
                                  </div>
                                  <div onClick={e => e.stopPropagation()}>
                                    {field.type === 'checkbox' ? (
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={value === 'true'}
                                          onChange={e => handleUploadFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                                          onFocus={() => { setActiveField(field.id); if (field.page !== currentPage) setCurrentPage(field.page); }}
                                          className="w-4 h-4 accent-primary" />
                                        <span className="text-xs text-muted-foreground">{value === 'true' ? 'Checked' : 'Unchecked'}</span>
                                      </label>
                                    ) : field.type === 'select' && field.options?.length > 0 ? (
                                      <div className="relative">
                                        <select value={value}
                                          onChange={e => handleUploadFieldChange(field.id, e.target.value)}
                                          onFocus={() => { setActiveField(field.id); if (field.page !== currentPage) setCurrentPage(field.page); }}
                                          className={`${uploadFieldCls(isActive)} appearance-none cursor-pointer`}>
                                          <option value="">— Select —</option>
                                          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
                                        </svg>
                                      </div>
                                    ) : field.type === 'textarea' ? (
                                      <textarea rows={2} value={value}
                                        onChange={e => handleUploadFieldChange(field.id, e.target.value)}
                                        onFocus={() => { setActiveField(field.id); if (field.page !== currentPage) setCurrentPage(field.page); }}
                                        placeholder={field.label}
                                        className={`${uploadFieldCls(isActive)} resize-none`} />
                                    ) : (
                                      <input type={field.type === 'date' ? 'text' : (field.type || 'text')} value={value}
                                        onChange={e => handleUploadFieldChange(field.id, e.target.value)}
                                        onFocus={() => { setActiveField(field.id); if (field.page !== currentPage) setCurrentPage(field.page); }}
                                        placeholder={field.label}
                                        className={uploadFieldCls(isActive)} />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Preview header */}
          <div className="flex-shrink-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors
                ${tab === 'data' && uploadFile ? 'bg-mint-500 animate-pulse' : 'bg-border'}`} />
              <span className="text-xs font-bold text-foreground">
                {tab === 'upload' ? 'PDF Preview' : 'Live Preview'}
              </span>
              {tab === 'upload' && uploadFile && (
                <span className="text-[10px] text-muted-foreground">— click fields to highlight</span>
              )}
            </div>
            {tab === 'data' && (
              <span className="text-[11px] font-mono text-muted-foreground/50">
                {form.contractTitle || 'Draft'} · A4
              </span>
            )}
            {tab === 'upload' && uploadFile && (
              <div className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
                <button onClick={() => setZoom(z => Math.max(50, z - 10))}
                  className="p-1 hover:bg-card rounded transition-colors">
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/>
                  </svg>
                </button>
                <span className="text-xs font-medium text-muted-foreground w-9 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 10))}
                  className="p-1 hover:bg-card rounded transition-colors">
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="p-1 hover:bg-card rounded disabled:opacity-40">
                      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <span className="text-xs text-muted-foreground font-medium">{currentPage}/{totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="p-1 hover:bg-card rounded disabled:opacity-40">
                      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto min-h-0 bg-muted">

            {/* Contract Data preview */}
            {tab === 'data' && (
              !uploadFile ? (
                <div className="flex items-center justify-center h-full text-muted-foreground/50">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="text-sm font-semibold">Preview will appear here</p>
                    <p className="text-xs mt-1 opacity-70">Upload a PDF template to begin</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex justify-center items-start min-h-full">
                  <div className="w-full max-w-[680px] shadow-xl rounded-xl overflow-hidden">
                    <div id="contract-preview-doc">
                      <LivePreview form={form} />
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Upload PDF preview */}
            {tab === 'upload' && (
              <>
                {!uploadFile && !uploadLoading && (
                  <div className="flex items-center justify-center h-full text-muted-foreground/50">
                    <div className="text-center">
                      <svg className="w-20 h-20 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p className="text-sm font-medium">PDF preview appears here</p>
                    </div>
                  </div>
                )}

                {uploadLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs text-muted-foreground">{uploadLoadMsg}</p>
                    </div>
                  </div>
                )}

                {uploadFile && !uploadLoading && (
                  <div className="p-6 flex justify-center items-start">
                    <div className="shadow-xl"
                      style={{ position: 'relative', display: 'inline-block',
                               width: canvasSize.w || 'auto', height: canvasSize.h || 'auto',
                               background: 'var(--card)', borderRadius: 4 }}>
                      <canvas ref={canvasRef} className="block" />

                      {pageFields.map(field => {
                        const x = field.rect.x * SCALE, y = field.rect.y * SCALE;
                        const w = field.rect.w * SCALE, h = field.rect.h * SCALE;
                        const isActive = activeField === field.id;
                        return (
                          <div key={field.id}
                            onClick={() => { setActiveField(field.id); fieldRefs.current[field.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                            title={field.label}
                            style={{
                              position: 'absolute', left: x, top: y, width: w, height: h,
                              boxSizing: 'border-box',
                              border: isActive ? '2px solid var(--primary)' : '1.5px solid color-mix(in srgb, var(--primary) 50%, transparent)',
                              background: isActive ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'color-mix(in srgb, var(--primary) 6%, transparent)',
                              borderRadius: 3, cursor: 'pointer', zIndex: 10,
                              transition: 'all 0.15s ease',
                              boxShadow: isActive ? '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)' : 'none',
                            }}
                          />
                        );
                      })}

                      {activeField && (() => {
                        const f = pageFields.find(f => f.id === activeField);
                        if (!f) return null;
                        return (
                          <div style={{
                            position: 'absolute', left: f.rect.x * SCALE, top: Math.max(0, f.rect.y * SCALE - 22),
                            background: 'var(--primary)', color: 'var(--primary-foreground)',
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                            whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none',
                          }}>
                            {f.label}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}