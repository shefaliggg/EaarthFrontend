/**
 * CreateOffer.jsx — Enhanced with mock data + Lucide icons
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContractPreview from './ContractPreview';
import {
  ChevronLeft, Moon, Sun, FileDown, Save, Send,
  ChevronDown, Check, Plus, X, User, Building2,
  Briefcase, Package, StickyNote, Paperclip,
  Box, Monitor, AppWindow, Camera, Smartphone,
  Car, Truck, Coffee, DollarSign, Home,
  Trash2,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  'ACCOUNTS','ACTION VEHICLES','AERIAL','ANIMALS','ANIMATION','ARMOURY','ART',
  'ASSETS','ASSISTANT DIRECTORS','CAMERA','CAST','CHAPERONES','CHOREOGRAPHY',
  'CLEARANCES','COMPUTER GRAPHICS','CONSTRUCTION','CONTINUITY','COSTUME',
  'COSTUME FX','COVID SAFETY','CREATURE EFFECTS','DIT','DIGITAL ASSETS',
  'DIGITAL PLAYBACK','DIRECTOR','DOCUMENTARY','DRAPES','EPK','EDITORIAL',
  'ELECTRICAL','ELECTRICAL RIGGING','FRANCHISE','GREENS','GREENSCREENS','GRIP',
  'HAIR AND MAKEUP','HEALTH AND SAFETY','IT','LOCATIONS','MARINE','MEDICAL',
  'MILITARY','MUSIC','PHOTOGRAPHY','PICTURE VEHICLES','POST PRODUCTION',
  'PRODUCTION','PROP MAKING','PROPS','PROSTHETICS','PUBLICITY','PUPPETEER',
  'RIGGING','SFX','SCRIPT','SCRIPT EDITING','SECURITY','SET DEC','SOUND',
  'STANDBY','STORYBOARD','STUDIO UNIT','STUNTS','SUPPORTING ARTIST',
  'SUSTAINABILITY','TRANSPORT','TUTORS','UNDERWATER','VFX','VIDEO','VOICE',
];

const CONTRACT_OPTIONS = [
  { value: '',               label: 'SELECT AN OPTION' },
  { value: 'HOD',            label: 'HOD' },
  { value: 'NO_CONTRACT',    label: 'NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)' },
  { value: 'SENIOR_AGREEMENT', label: 'SENIOR AGREEMENT' },
];

const STATUS_REASONS = [
  { value: '',                  label: 'SELECT AN OPTION' },
  { value: 'HMRC_LIST',         label: "JOB TITLE APPEARS ON HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'" },
  { value: 'CEST_ASSESSMENT',   label: "OUR CEST ASSESSMENT HAS CONFIRMED 'OFF-PAYROLL WORKING RULES (IR35) DO NOT APPLY'" },
  { value: 'LORIMER_LETTER',    label: 'YOU HAVE SUPPLIED A VALID LORIMER LETTER' },
  { value: 'OTHER',             label: 'OTHER' },
];

const ENGAGEMENT_TYPES = [
  { value: '',          label: 'SELECT ENGAGEMENT TYPE' },
  { value: 'LOAN_OUT',  label: 'LOAN OUT' },
  { value: 'PAYE',      label: 'PAYE' },
  { value: 'SCHD',      label: 'SCHD (DAILY/WEEKLY)' },
  { value: 'LONG_FORM', label: 'LONG FORM' },
];

const RATE_TYPES  = [{ value: 'DAILY', label: 'DAILY' }, { value: 'WEEKLY', label: 'WEEKLY' }];
const CURRENCIES  = [{ value: 'GBP', label: 'GBP (£)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }];

const CAP_TYPES = [
  { value: '',           label: 'SELECT CAP TYPE' },
  { value: 'FLAT',       label: 'FLAT FIGURE' },
  { value: 'PERCENTAGE', label: 'PERCENTAGE OF INVENTORY' },
  { value: 'NO_CAP',     label: 'NO CAP' },
];

const WORKING_WEEKS = [
  { value: '',         label: 'SELECT...'  },
  { value: '5_DAYS',   label: '5 DAYS'    },
  { value: '5.5_DAYS', label: '5.5 DAYS'  },
  { value: '5_6_DAYS', label: '5/6 DAYS'  },
  { value: '6_DAYS',   label: '6 DAYS'    },
];

const OVERTIME_RULE_OPTIONS = [
  { label: 'After Standard Hours', value: 'AFTER_STANDARD_HOURS' },
  { label: 'Enhanced O/T',         value: 'ENHANCED_OT'          },
  { label: 'Camera O/T',           value: 'CAMERA_OT'            },
  { label: 'Post O/T',             value: 'POST_OT'              },
  { label: 'Pre O/T',              value: 'PRE_OT'               },
  { label: 'Night Penalty',        value: 'NIGHT_PENALTY'        },
  { label: 'BTA',                  value: 'BTA'                  },
  { label: 'Late Meal',            value: 'LATE_MEAL'            },
  { label: 'Broken Meal',          value: 'BROKEN_MEAL'          },
  { label: 'Travel',               value: 'TRAVEL'               },
  { label: 'Dawn',                 value: 'DAWN'                 },
  { label: 'Night',                value: 'NIGHT'                },
];

const SPECIAL_DAY_TYPES = [
  { key: 'SIXTH_DAY',     label: '6th Day'        },
  { key: 'SEVENTH_DAY',   label: '7th Day'        },
  { key: 'PUBLIC_HOLIDAY',label: 'Public Holiday' },
  { key: 'TRAVEL_DAY',    label: 'Travel Day'     },
  { key: 'TURNAROUND',    label: 'Turnaround'     },
];

const getDefaultAllowances = () => ({
  boxRental: false, boxRentalDescription: '', boxRentalFeePerWeek: '',
  boxRentalCapCalculatedAs: '', boxRentalCap: '', boxRentalCapPercentage: '',
  boxRentalTerms: '', boxRentalBudgetCode: '',
  boxRentalPayableInPrep: false, boxRentalPayableInShoot: true, boxRentalPayableInWrap: false,

  computerAllowance: false, computerAllowanceFeePerWeek: '',
  computerAllowanceCapCalculatedAs: '', computerAllowanceCap: '',
  computerAllowanceTerms: '', computerAllowanceBudgetCode: '',
  computerAllowancePayableInPrep: false, computerAllowancePayableInShoot: true, computerAllowancePayableInWrap: false,

  softwareAllowance: false, softwareAllowanceDescription: '', softwareAllowanceFeePerWeek: '',
  softwareAllowanceTerms: '', softwareAllowanceBudgetCode: '',
  softwareAllowancePayableInPrep: false, softwareAllowancePayableInShoot: true, softwareAllowancePayableInWrap: false,

  equipmentRental: false, equipmentRentalDescription: '', equipmentRentalFeePerWeek: '',
  equipmentRentalCapCalculatedAs: '', equipmentRentalCap: '',
  equipmentRentalTerms: '', equipmentRentalBudgetCode: '',
  equipmentRentalPayableInPrep: false, equipmentRentalPayableInShoot: true, equipmentRentalPayableInWrap: false,

  mobilePhoneAllowance: false, mobilePhoneAllowanceFeePerWeek: '',
  mobilePhoneAllowanceTerms: '', mobilePhoneAllowanceBudgetCode: '',
  mobilePhoneAllowancePayableInPrep: false, mobilePhoneAllowancePayableInShoot: true, mobilePhoneAllowancePayableInWrap: false,

  vehicleAllowance: false, vehicleAllowanceFeePerWeek: '',
  vehicleAllowanceTerms: '', vehicleAllowanceBudgetCode: '',
  vehicleAllowancePayableInPrep: false, vehicleAllowancePayableInShoot: true, vehicleAllowancePayableInWrap: false,

  vehicleHire: false, vehicleHireRate: '', vehicleHireTerms: '', vehicleHireBudgetCode: '',
  vehicleHirePayableInPrep: false, vehicleHirePayableInShoot: true, vehicleHirePayableInWrap: false,

  perDiem1: false, perDiem1Currency: 'GBP', perDiem1ShootDayRate: '', perDiem1NonShootDayRate: '',
  perDiem1Terms: '', perDiem1BudgetCode: '',
  perDiem1PayableInPrep: false, perDiem1PayableInShoot: true, perDiem1PayableInWrap: false,

  perDiem2: false, perDiem2Currency: 'USD', perDiem2ShootDayRate: '', perDiem2NonShootDayRate: '',
  perDiem2Terms: '', perDiem2BudgetCode: '',
  perDiem2PayableInPrep: false, perDiem2PayableInShoot: true, perDiem2PayableInWrap: false,

  livingAllowance: false, livingAllowanceCurrency: 'GBP',
  livingAllowanceDailyRate: '', livingAllowanceWeeklyRate: '',
  livingAllowanceTerms: '', livingAllowanceBudgetCode: '',
  livingAllowancePayableInPrep: false, livingAllowancePayableInShoot: true, livingAllowancePayableInWrap: false,
});

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_FORM_DATA = {
  fullName: 'JESSICA HARTLEY',
  emailAddress: 'jessica.hartley@example.com',
  mobileNumber: '+44 7700 900142',
  isViaAgent: true,
  agentName: 'CREATIVE ARTISTS AGENCY',
  agentEmailAddress: 'bookings@caa-london.com',
  alternativeContractType: '',
  allowAsSelfEmployedOrLoanOut: 'YES',
  statusDeterminationReason: 'CEST_ASSESSMENT',
  otherStatusDeterminationReason: '',
  isLivingInUk: 'YES',
  otherDealProvisions: 'Credit: First position above the title. Approval of key personnel including director of photography and production designer.',
  additionalNotes: 'Talent has confirmed availability for all principal photography dates. Wardrobe fittings scheduled for week prior to shoot commencement.',
};

const createMockRole = (index) => ({
  id: Date.now().toString() + index,
  isPrimaryRole: index === 0,
  roleName: index === 0 ? 'PRIMARY ROLE' : `ROLE ${index + 1}`,
  jobTitle: index === 0 ? 'DIRECTOR OF PHOTOGRAPHY' : 'CAMERA OPERATOR',
  jobTitleSuffix: index === 0 ? '' : 'B CAMERA',
  searchAllDepartments: false,
  createOwnJobTitle: false,
  unit: 'MAIN UNIT',
  department: index === 0 ? 'CAMERA' : 'CAMERA',
  subDepartment: '',
  regularSiteOfWork: 'PINEWOOD STUDIOS & VARIOUS UK LOCATIONS',
  engagementType: 'LOAN_OUT',
  productionPhase: '',
  startDate: '2025-03-10',
  endDate: '2025-09-30',
  workingWeek: '5_6_DAYS',
  workingInUnitedKingdom: 'YES',
  rateType: 'DAILY',
  currency: 'GBP',
  rateAmount: index === 0 ? '2500' : '950',
  feePerDay: index === 0 ? '2692.31' : '1023.08',
  standardWorkingHours: '10',
  holidayPayInclusive: true,
  rateDescription: '',
  overtimeType: 'CALCULATED',
  overtime: {
    enabled: true,
    rules: [
      { name: 'AFTER_STANDARD_HOURS', startsAfterHours: 10, rateMultiplier: 1.5, maxHours: 2, budgetCode: '', terms: '', payableInPrep: false, payableInShoot: true, payableInWrap: false },
      { name: 'ENHANCED_OT', startsAfterHours: 12, rateMultiplier: 2, maxHours: null, budgetCode: '', terms: '', payableInPrep: false, payableInShoot: true, payableInWrap: false },
    ],
  },
  specialDayRates: [
    { type: 'SIXTH_DAY',      amount: index === 0 ? '3125' : '1187.50', unit: 'DAILY' },
    { type: 'SEVENTH_DAY',    amount: index === 0 ? '5000' : '1900',    unit: 'DAILY' },
    { type: 'PUBLIC_HOLIDAY', amount: index === 0 ? '5000' : '1900',    unit: 'DAILY' },
    { type: 'TRAVEL_DAY',     amount: index === 0 ? '1250' : '475',     unit: 'DAILY' },
    { type: 'TURNAROUND',     amount: '',                               unit: 'DAILY' },
  ],
  budgetCode: index === 0 ? '401-10-001' : '401-10-002',
  allowances: {
    ...getDefaultAllowances(),
    ...(index === 0 ? {
      boxRental: true,
      boxRentalDescription: 'CAMERA DEPARTMENT EQUIPMENT, LENSES, ACCESSORIES AND ASSOCIATED PERIPHERALS',
      boxRentalFeePerWeek: '750',
      boxRentalCapCalculatedAs: 'FLAT',
      boxRentalCap: '26250',
      boxRentalTerms: 'PAYABLE ON INVOICE SUBMISSION',
      boxRentalBudgetCode: '401-65-001',
      boxRentalPayableInPrep: true,
      boxRentalPayableInShoot: true,
      boxRentalPayableInWrap: false,

      computerAllowance: true,
      computerAllowanceFeePerWeek: '75',
      computerAllowanceBudgetCode: '401-65-010',
      computerAllowancePayableInPrep: true,
      computerAllowancePayableInShoot: true,
      computerAllowancePayableInWrap: false,

      perDiem1: true,
      perDiem1Currency: 'GBP',
      perDiem1ShootDayRate: '75',
      perDiem1NonShootDayRate: '40',
      perDiem1BudgetCode: '401-80-001',
      perDiem1PayableInPrep: true,
      perDiem1PayableInShoot: true,
      perDiem1PayableInWrap: false,

      vehicleAllowance: true,
      vehicleAllowanceFeePerWeek: '200',
      vehicleAllowanceBudgetCode: '401-70-001',
      vehicleAllowancePayableInPrep: true,
      vehicleAllowancePayableInShoot: true,
      vehicleAllowancePayableInWrap: false,
    } : {}),
  },
});

const MOCK_ROLES = [createMockRole(0), createMockRole(1)];

// ── Helpers ───────────────────────────────────────────────────────────────────
const currSym = (c = 'GBP') => ({ GBP: '£', USD: '$', EUR: '€' }[c] ?? '£');
const cn = (...c) => c.filter(Boolean).join(' ');

const IC  = 'w-full px-3 py-2 text-sm rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150';
const ICsm = 'px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-input text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150';

// ── Primitive form components ─────────────────────────────────────────────────
function FL({ label, required, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-0.5">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function FInput({ label, required, className, inputClass, ...p }) {
  return (
    <FL label={label} required={required} className={className}>
      <input className={cn(IC, inputClass)} {...p} />
    </FL>
  );
}

function FSelect({ label, required, options, value, onChange, className }) {
  return (
    <FL label={label} required={required} className={className}>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className={`${IC} appearance-none pr-7 cursor-pointer`}>
          {options.map(o =>
            typeof o === 'string'
              ? <option key={o} value={o}>{o}</option>
              : <option key={o.value} value={o.value}>{o.label}</option>
          )}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </FL>
  );
}

function FMoney({ label, required, currency, value, onChange, className }) {
  return (
    <FL label={label} required={required} className={className}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-muted-foreground w-4 shrink-0">{currSym(currency)}</span>
        <input type="number" step="0.01" value={value} onChange={e => onChange(e.target.value)}
          placeholder="0.00" className={`${IC} flex-1`} />
      </div>
    </FL>
  );
}

function FCheck({ id, checked, onChange, label, small }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative shrink-0">
        <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={cn(
          'rounded border-2 flex items-center justify-center transition-all duration-150',
          small ? 'w-3.5 h-3.5' : 'w-4 h-4',
          checked ? 'bg-primary border-primary' : 'bg-input border-border'
        )}>
          {checked && (
            <Check className={cn('text-primary-foreground', small ? 'w-2 h-2' : 'w-2.5 h-2.5')} strokeWidth={3} />
          )}
        </div>
      </div>
      <span className={cn('font-medium text-foreground', small ? 'text-[11px]' : 'text-sm')}>{label}</span>
    </label>
  );
}

function FRadio({ name, options, value, onChange }) {
  return (
    <div className="flex gap-5 pt-0.5">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative shrink-0">
            <input type="radio" name={name} value={opt} checked={value === opt}
              onChange={e => onChange(e.target.value)} className="sr-only" />
            <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all', value === opt ? 'border-primary' : 'border-border')}>
              {value === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={cn('w-9 h-5 rounded-full transition-colors duration-200', checked ? 'bg-primary' : 'bg-border')}>
          <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-transform duration-200', checked ? 'translate-x-4' : 'translate-x-0.5')} />
        </div>
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

function PayableIn({ prefix, allowances, onChange }) {
  return (
    <FL label="Payable In">
      <div className="flex gap-4 pt-0.5">
        {['Prep', 'Shoot', 'Wrap'].map(p => {
          const key = `${prefix}PayableIn${p}`;
          return (
            <FCheck key={p} id={`${prefix}-${p}`} small checked={allowances[key]} onChange={v => onChange({ [key]: v })} label={p.toUpperCase()} />
          );
        })}
      </div>
    </FL>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function Section({ title, icon: Icon, open, onToggle, badge, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <button onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{title}</span>
          {badge && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function AllowCard({ id, icon: Icon, label, enabled, onToggle, children }) {
  return (
    <div className={cn('rounded-xl border transition-all duration-150', enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-card')}>
      <div className="flex items-center gap-3 p-3">
        <label htmlFor={id} className="cursor-pointer shrink-0">
          <div className="relative">
            <input type="checkbox" id={id} checked={enabled} onChange={e => onToggle(e.target.checked)} className="sr-only" />
            <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-all', enabled ? 'bg-primary border-primary' : 'bg-input border-border')}>
              {enabled && <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />}
            </div>
          </div>
        </label>
        <Icon className={cn('w-4 h-4 shrink-0', enabled ? 'text-primary' : 'text-muted-foreground')} strokeWidth={1.75} />
        <span className={cn('text-xs font-bold uppercase tracking-wide flex-1', enabled ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
        {enabled && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">ON</span>}
      </div>
      {enabled && children && (
        <div className="px-3 pb-3 pt-1 border-t border-primary/10 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function RoleTab({ role, active, onClick, onRemove, canRemove }) {
  return (
    <button onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all border',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
      )}>
      {role.isPrimaryRole && (
        <span className={cn('text-[8px] font-bold px-1.5 py-0.5 rounded-full border',
          active ? 'bg-white/20 text-white border-white/30' : 'bg-primary/10 text-primary border-primary/20')}>
          PRIMARY
        </span>
      )}
      {role.roleName}
      {canRemove && (
        <span onClick={e => { e.stopPropagation(); onRemove(); }}
          className={cn('ml-0.5 rounded-full w-4 h-4 flex items-center justify-center transition-colors',
            active ? 'hover:bg-white/20 text-white/70' : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive')}>
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
}

const createDefaultRole = (index) => ({
  id: Date.now().toString() + index,
  isPrimaryRole: index === 0,
  roleName: `ROLE ${index + 1}`,
  jobTitle: '', jobTitleSuffix: '',
  searchAllDepartments: false, createOwnJobTitle: false,
  unit: '', department: '', subDepartment: '',
  regularSiteOfWork: '', engagementType: '', productionPhase: '',
  startDate: '', endDate: '',
  workingWeek: '', workingInUnitedKingdom: 'YES',
  rateType: 'DAILY', currency: 'GBP',
  rateAmount: '', feePerDay: '', standardWorkingHours: '10',
  holidayPayInclusive: false, rateDescription: '',
  overtimeType: 'CALCULATED',
  overtime: { enabled: true, rules: [] },
  specialDayRates: SPECIAL_DAY_TYPES.map(d => ({ type: d.key, amount: '', unit: 'DAILY' })),
  budgetCode: '',
  allowances: getDefaultAllowances(),
});

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CreateOffer() {
  const navigate    = useNavigate?.() ?? (() => {});
  const { projectName } = useParams?.() ?? {};

  const [isDark, setIsDark] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Pre-populate with MOCK DATA ──────────────────────────────────────────
  const [formData, setFormData] = useState(MOCK_FORM_DATA);
  const [roles, setRoles]       = useState(MOCK_ROLES);
  const [activeRoleId, setActiveRoleId] = useState(MOCK_ROLES[0].id);

  const [open, setOpen] = useState({
    recipient: true, taxStatus: true, roles: true, allowances: true, notes: false, attachments: false,
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isDark) { html.classList.add('dark'); body.classList.add('dark'); }
    else        { html.classList.remove('dark'); body.classList.remove('dark'); }
    return () => { html.classList.remove('dark'); body.classList.remove('dark'); };
  }, [isDark]);

  useEffect(() => {
    if (!roles.find(r => r.id === activeRoleId) && roles.length > 0) {
      setActiveRoleId(roles[0].id);
    }
  }, [roles, activeRoleId]);

  const toggleSection = k => setOpen(p => ({ ...p, [k]: !p[k] }));
  const setFD  = k => v => setFormData(p => ({ ...p, [k]: v }));
  const addRole = () => {
    const r = createDefaultRole(roles.length);
    setRoles(p => [...p, r]);
    setActiveRoleId(r.id);
  };
  const removeRole = id => {
    if (roles.length <= 1) return;
    const next = roles.filter(r => r.id !== id);
    setRoles(next);
    if (activeRoleId === id) setActiveRoleId(next[0].id);
  };
  const updateRole = (id, upd) => setRoles(p => p.map(r => r.id === id ? { ...r, ...upd } : r));
  const updateAL   = (id, upd) => setRoles(p => p.map(r => r.id === id ? { ...r, allowances: { ...r.allowances, ...upd } } : r));
  const updateSD   = (id, type, amount) =>
    setRoles(p => p.map(r => r.id === id ? { ...r, specialDayRates: r.specialDayRates.map(d => d.type === type ? { ...d, amount } : d) } : r));
  const addOTRule  = id => setRoles(p => p.map(r => r.id === id ? {
    ...r, overtime: { ...r.overtime, rules: [...r.overtime.rules, { name: 'AFTER_STANDARD_HOURS', startsAfterHours: 10, rateMultiplier: 1.5, maxHours: null, budgetCode: '', terms: '', payableInPrep: false, payableInShoot: true, payableInWrap: false }] }
  } : r));
  const updateOT   = (id, idx, upd) => setRoles(p => p.map(r => r.id === id ? {
    ...r, overtime: { ...r.overtime, rules: r.overtime.rules.map((ru, i) => i === idx ? { ...ru, ...upd } : ru) }
  } : r));
  const removeOT   = (id, idx) => setRoles(p => p.map(r => r.id === id ? {
    ...r, overtime: { ...r.overtime, rules: r.overtime.rules.filter((_, i) => i !== idx) }
  } : r));

  const activeRole = roles.find(r => r.id === activeRoleId) || roles[0];
  const primaryRole = roles.find(r => r.isPrimaryRole) || roles[0];

  const activeAllowCount = ['boxRental','computerAllowance','softwareAllowance','equipmentRental','mobilePhoneAllowance','vehicleAllowance','vehicleHire','perDiem1','perDiem2','livingAllowance']
    .filter(k => activeRole?.allowances?.[k]).length;

  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 800)); setIsSaving(false); };
  const handleSend = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 800)); setIsSaving(false); };

  const handleExport = () => {
    const el = document.getElementById('contract-preview-doc');
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Contract — ${formData.fullName}</title></head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const getBundle = (eng = '', rate = '') => {
    if (eng==='LOAN_OUT' && rate==='DAILY')  return 'LOAN-OUT · DAILY';
    if (eng==='LOAN_OUT' && rate==='WEEKLY') return 'LOAN-OUT · WEEKLY';
    if (eng==='PAYE'     && rate==='DAILY')  return 'PAYE · DAILY';
    if (eng==='PAYE'     && rate==='WEEKLY') return 'PAYE · WEEKLY';
    if (eng==='SCHD')    return 'SCHD';
    if (eng==='LONG_FORM') return 'LONG FORM';
    return '';
  };
  const bundleTag = getBundle(primaryRole?.engagementType, primaryRole?.rateType);

  return (
    <div className="flex flex-col bg-background text-foreground transition-colors duration-300"
      style={{ height: '100vh', fontFamily: '"Outfit", system-ui, sans-serif' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-14 bg-card border-b border-border px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/projects/${projectName}/onboarding`)}
            className="w-8 h-8 rounded-xl border border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none">Create New Offer</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              {formData.fullName || 'New Recipient'}
              {primaryRole?.jobTitle && (
                <><span className="text-border">·</span><span>{primaryRole.jobTitle}</span></>
              )}
              {bundleTag && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {bundleTag}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-border bg-card text-xs font-semibold text-muted-foreground rounded-xl hover:bg-muted hover:text-foreground transition-all">
            <FileDown className="w-3.5 h-3.5" />
            Export PDF
          </button>

          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-border bg-card text-xs font-semibold text-muted-foreground rounded-xl hover:bg-muted transition-colors disabled:opacity-50">
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
        </div>
      </header>

      {/* ── Split body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ════ LEFT — FORM ════ */}
        <div className="w-[480px] flex-shrink-0 flex flex-col bg-background border-r border-border overflow-hidden">
          <div className="flex-shrink-0 px-5 py-3.5 bg-card border-b border-border">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Offer Details</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Edit fields → contract preview updates live</p>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-3 scrollbar-none">

            {/* ─ Recipient ─ */}
            <Section title="Recipient" icon={User} open={open.recipient} onToggle={() => toggleSection('recipient')}>
              <div className="space-y-3 pt-2">
                <FInput label="Full Name" required value={formData.fullName}
                  onChange={e => setFD('fullName')(e.target.value.toUpperCase())} placeholder="ENTER FULL NAME" />
                <div className="grid grid-cols-2 gap-3">
                  <FInput label="Email" required type="email" value={formData.emailAddress}
                    onChange={e => setFD('emailAddress')(e.target.value.toLowerCase())} placeholder="email@example.com" />
                  <FInput label="Mobile" type="tel" value={formData.mobileNumber}
                    onChange={e => setFD('mobileNumber')(e.target.value)} placeholder="+44 7XXX XXXXXX" />
                </div>
                <FL label="Via Agent?">
                  <Toggle checked={formData.isViaAgent} onChange={setFD('isViaAgent')} label="Represented via an agent" />
                </FL>
                {formData.isViaAgent && (
                  <div className="grid grid-cols-2 gap-3 pl-3 border-l-2 border-primary/20">
                    <FInput label="Agent Name" value={formData.agentName}
                      onChange={e => setFD('agentName')(e.target.value.toUpperCase())} placeholder="AGENT NAME" />
                    <FInput label="Agent Email" type="email" value={formData.agentEmailAddress}
                      onChange={e => setFD('agentEmailAddress')(e.target.value.toLowerCase())} placeholder="agent@email.com" />
                  </div>
                )}
                <FSelect label="Alternative Contract Type"
                  value={formData.alternativeContractType} onChange={setFD('alternativeContractType')}
                  options={CONTRACT_OPTIONS} />
              </div>
            </Section>

            {/* ─ Tax Status ─ */}
            <Section title="Tax Status" icon={Building2} open={open.taxStatus} onToggle={() => toggleSection('taxStatus')}>
              <div className="space-y-3 pt-2">
                <FL label="Allow as Self-Employed / Loan Out?">
                  <FRadio name="selfEmp" options={['YES', 'NO']}
                    value={formData.allowAsSelfEmployedOrLoanOut}
                    onChange={setFD('allowAsSelfEmployedOrLoanOut')} />
                </FL>
                {formData.allowAsSelfEmployedOrLoanOut === 'YES' && (
                  <FSelect label="Status Determination Reason"
                    value={formData.statusDeterminationReason}
                    onChange={setFD('statusDeterminationReason')}
                    options={STATUS_REASONS} />
                )}
                {formData.statusDeterminationReason === 'OTHER' && (
                  <FInput label="Specify Other Reason" value={formData.otherStatusDeterminationReason}
                    onChange={e => setFD('otherStatusDeterminationReason')(e.target.value.toUpperCase())}
                    placeholder="ENTER REASON" />
                )}
                <FL label="Working in the UK?">
                  <FRadio name="ukWork" options={['YES', 'NEVER']}
                    value={formData.isLivingInUk}
                    onChange={setFD('isLivingInUk')} />
                </FL>
              </div>
            </Section>

            {/* ─ Roles & Rates ─ */}
            <Section title="Roles & Rates" icon={Briefcase} open={open.roles} onToggle={() => toggleSection('roles')}>
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {roles.map(r => (
                    <RoleTab key={r.id} role={r} active={r.id === activeRoleId}
                      onClick={() => setActiveRoleId(r.id)}
                      onRemove={() => removeRole(r.id)}
                      canRemove={roles.length > 1 && !r.isPrimaryRole} />
                  ))}
                  <button onClick={addRole}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-border text-[11px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                    <Plus className="w-3 h-3" strokeWidth={2.5} />
                    Add Role
                  </button>
                </div>

                {activeRole && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FInput label="Unit" required value={activeRole.unit}
                        onChange={e => updateRole(activeRole.id, { unit: e.target.value.toUpperCase() })}
                        placeholder="E.G., MAIN UNIT" />
                      <FSelect label="Department" required value={activeRole.department}
                        onChange={v => updateRole(activeRole.id, { department: v })}
                        options={[{ value: '', label: 'SELECT DEPARTMENT...' }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
                    </div>
                    <FInput label="Sub-Department" value={activeRole.subDepartment}
                      onChange={e => updateRole(activeRole.id, { subDepartment: e.target.value.toUpperCase() })}
                      placeholder="OPTIONAL" />
                    <FInput label="Job Title" required value={activeRole.jobTitle}
                      onChange={e => updateRole(activeRole.id, { jobTitle: e.target.value.toUpperCase() })}
                      placeholder="TYPE JOB TITLE..." />
                    <div className="space-y-1.5 text-[10px] text-muted-foreground">
                      <FCheck id={`searchAll-${activeRole.id}`} checked={activeRole.searchAllDepartments} small
                        onChange={v => updateRole(activeRole.id, { searchAllDepartments: v })}
                        label="Search job titles from all departments" />
                      <FCheck id={`ownTitle-${activeRole.id}`} checked={activeRole.createOwnJobTitle} small
                        onChange={v => updateRole(activeRole.id, { createOwnJobTitle: v })}
                        label="Create your own job title (project-specific)" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FInput label="Job Title Suffix" value={activeRole.jobTitleSuffix}
                        onChange={e => updateRole(activeRole.id, { jobTitleSuffix: e.target.value.toUpperCase() })}
                        placeholder="E.G., TO CAST #1" />
                      <FInput label="Regular Site of Work" required value={activeRole.regularSiteOfWork}
                        onChange={e => updateRole(activeRole.id, { regularSiteOfWork: e.target.value.toUpperCase() })}
                        placeholder="E.G., VARIOUS LOCATIONS" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FSelect label="Engagement Type" required value={activeRole.engagementType}
                        onChange={v => updateRole(activeRole.id, { engagementType: v })} options={ENGAGEMENT_TYPES} />
                      <FSelect label="Rate Type" value={activeRole.rateType}
                        onChange={v => updateRole(activeRole.id, { rateType: v })} options={RATE_TYPES} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <FInput label="Start Date" required type="date" value={activeRole.startDate}
                        onChange={e => updateRole(activeRole.id, { startDate: e.target.value })} />
                      <FInput label="End Date" type="date" value={activeRole.endDate}
                        onChange={e => updateRole(activeRole.id, { endDate: e.target.value })} />
                      <FSelect label="Working Week" value={activeRole.workingWeek}
                        onChange={v => updateRole(activeRole.id, { workingWeek: v })} options={WORKING_WEEKS} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FL label="Working in UK?">
                        <FRadio name={`ukRole-${activeRole.id}`} options={['YES', 'NEVER']}
                          value={activeRole.workingInUnitedKingdom}
                          onChange={v => updateRole(activeRole.id, { workingInUnitedKingdom: v })} />
                      </FL>
                      <FSelect label="Currency" value={activeRole.currency}
                        onChange={v => updateRole(activeRole.id, { currency: v })} options={CURRENCIES} />
                    </div>

                    <Divider label="Rates" />
                    <div className="grid grid-cols-2 gap-3">
                      <FMoney label={`${activeRole.rateType === 'DAILY' ? 'Daily' : 'Weekly'} Rate`} required
                        currency={activeRole.currency} value={activeRole.rateAmount}
                        onChange={v => updateRole(activeRole.id, { rateAmount: v })} />
                      <FMoney label="Fee Per Day (incl. holiday)" currency={activeRole.currency}
                        value={activeRole.feePerDay}
                        onChange={v => updateRole(activeRole.id, { feePerDay: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FInput label="Standard Working Hours" type="number" value={activeRole.standardWorkingHours}
                        onChange={e => updateRole(activeRole.id, { standardWorkingHours: e.target.value })}
                        placeholder="10" />
                      <FL label="Holiday Pay">
                        <div className="pt-1">
                          <FCheck id={`hol-${activeRole.id}`} checked={activeRole.holidayPayInclusive}
                            onChange={v => updateRole(activeRole.id, { holidayPayInclusive: v })}
                            label="Inclusive in rate" />
                        </div>
                      </FL>
                    </div>

                    <Divider label="Special Day Rates" />
                    <div className="grid grid-cols-2 gap-3">
                      {SPECIAL_DAY_TYPES.map(day => {
                        const dr = activeRole.specialDayRates.find(d => d.type === day.key);
                        return (
                          <FMoney key={day.key} label={day.label} currency={activeRole.currency}
                            value={dr?.amount || ''} onChange={v => updateSD(activeRole.id, day.key, v)} />
                        );
                      })}
                    </div>

                    <Divider label="Overtime" />
                    <FL label="Overtime Type">
                      <div className="flex gap-5 pt-0.5">
                        {[{ v: 'CALCULATED', l: 'Calculated per Agreement' }, { v: 'CUSTOM', l: 'Custom Rates' }].map(opt => (
                          <label key={opt.v} className="flex items-center gap-2 cursor-pointer select-none">
                            <div className="relative shrink-0">
                              <input type="radio" name={`ot-${activeRole.id}`} value={opt.v}
                                checked={activeRole.overtimeType === opt.v}
                                onChange={() => updateRole(activeRole.id, { overtimeType: opt.v })}
                                className="sr-only" />
                              <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all', activeRole.overtimeType === opt.v ? 'border-primary' : 'border-border')}>
                                {activeRole.overtimeType === opt.v && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                            </div>
                            <span className="text-sm font-medium text-foreground">{opt.l}</span>
                          </label>
                        ))}
                      </div>
                    </FL>

                    {activeRole.overtimeType === 'CUSTOM' && (
                      <div className="space-y-2">
                        {activeRole.overtime.rules.map((rule, ri) => (
                          <div key={ri} className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary uppercase">Rule {ri + 1}</span>
                              <button onClick={() => removeOT(activeRole.id, ri)}
                                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <FSelect label="Rule Type" value={rule.name}
                                onChange={v => updateOT(activeRole.id, ri, { name: v })}
                                options={[{ value: '', label: 'SELECT...' }, ...OVERTIME_RULE_OPTIONS]} />
                              <FL label="Rate Multiplier">
                                <input type="number" step="0.1" value={rule.rateMultiplier}
                                  onChange={e => updateOT(activeRole.id, ri, { rateMultiplier: Number(e.target.value) })}
                                  placeholder="1.5" className={IC} />
                              </FL>
                              <FL label="Starts After Hrs">
                                <input type="number" value={rule.startsAfterHours ?? ''}
                                  onChange={e => updateOT(activeRole.id, ri, { startsAfterHours: Number(e.target.value) })}
                                  placeholder="10" className={IC} />
                              </FL>
                              <FL label="Max Hours">
                                <input type="number" value={rule.maxHours ?? ''}
                                  onChange={e => updateOT(activeRole.id, ri, { maxHours: e.target.value ? Number(e.target.value) : null })}
                                  placeholder="No cap" className={IC} />
                              </FL>
                            </div>
                            <PayableIn prefix={`rule${ri}`} allowances={{
                              [`rule${ri}PayableInPrep`]: rule.payableInPrep,
                              [`rule${ri}PayableInShoot`]: rule.payableInShoot,
                              [`rule${ri}PayableInWrap`]: rule.payableInWrap,
                            }} onChange={upd => {
                              const k = Object.keys(upd)[0];
                              const phase = k.includes('Prep') ? 'payableInPrep' : k.includes('Shoot') ? 'payableInShoot' : 'payableInWrap';
                              updateOT(activeRole.id, ri, { [phase]: upd[k] });
                            }} />
                          </div>
                        ))}
                        <button onClick={() => addOTRule(activeRole.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border text-[11px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                          <Plus className="w-3 h-3" strokeWidth={2.5} />
                          Add Overtime Rule
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>

            {/* ─ Allowances ─ */}
            <Section title="Allowances" icon={Package} open={open.allowances} onToggle={() => toggleSection('allowances')}
              badge={activeAllowCount > 0 ? `${activeAllowCount} active` : null}>
              <div className="space-y-2 pt-2">

                <AllowCard id="boxRental" icon={Box} label="Box Rental"
                  enabled={activeRole?.allowances.boxRental} onToggle={v => updateAL(activeRole.id, { boxRental: v })}>
                  <FL label="Description">
                    <textarea value={activeRole.allowances.boxRentalDescription}
                      onChange={e => updateAL(activeRole.id, { boxRentalDescription: e.target.value.toUpperCase() })}
                      className={`${IC} resize-none h-12 text-xs`} placeholder="DESCRIPTION OF BOX RENTAL ITEMS" />
                  </FL>
                  <div className="grid grid-cols-2 gap-2">
                    <FMoney label="Fee Per Week" currency={activeRole.currency}
                      value={activeRole.allowances.boxRentalFeePerWeek} onChange={v => updateAL(activeRole.id, { boxRentalFeePerWeek: v })} />
                    <FSelect label="Cap Type" value={activeRole.allowances.boxRentalCapCalculatedAs}
                      onChange={v => updateAL(activeRole.id, { boxRentalCapCalculatedAs: v })} options={CAP_TYPES} />
                  </div>
                  {activeRole.allowances.boxRentalCapCalculatedAs === 'FLAT' && (
                    <FMoney label="Cap Amount" currency={activeRole.currency}
                      value={activeRole.allowances.boxRentalCap} onChange={v => updateAL(activeRole.id, { boxRentalCap: v })} />
                  )}
                  {activeRole.allowances.boxRentalCapCalculatedAs === 'PERCENTAGE' && (
                    <FL label="Cap % of Inventory">
                      <input type="number" step="0.01" value={activeRole.allowances.boxRentalCapPercentage}
                        onChange={e => updateAL(activeRole.id, { boxRentalCapPercentage: e.target.value })}
                        placeholder="0.00" className={IC} />
                    </FL>
                  )}
                  <FInput label="Terms" value={activeRole.allowances.boxRentalTerms}
                    onChange={e => updateAL(activeRole.id, { boxRentalTerms: e.target.value.toUpperCase() })} placeholder="TERMS" />
                  <FInput label="Budget Code" value={activeRole.allowances.boxRentalBudgetCode}
                    onChange={e => updateAL(activeRole.id, { boxRentalBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="boxRental" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="computerAllowance" icon={Monitor} label="Computer Allowance"
                  enabled={activeRole.allowances.computerAllowance} onToggle={v => updateAL(activeRole.id, { computerAllowance: v })}>
                  <FMoney label="Fee Per Week" currency={activeRole.currency}
                    value={activeRole.allowances.computerAllowanceFeePerWeek} onChange={v => updateAL(activeRole.id, { computerAllowanceFeePerWeek: v })} />
                  <FInput label="Terms" value={activeRole.allowances.computerAllowanceTerms}
                    onChange={e => updateAL(activeRole.id, { computerAllowanceTerms: e.target.value.toUpperCase() })} placeholder="TERMS" />
                  <FInput label="Budget Code" value={activeRole.allowances.computerAllowanceBudgetCode}
                    onChange={e => updateAL(activeRole.id, { computerAllowanceBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="computerAllowance" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="softwareAllowance" icon={AppWindow} label="Software Allowance"
                  enabled={activeRole.allowances.softwareAllowance} onToggle={v => updateAL(activeRole.id, { softwareAllowance: v })}>
                  <FInput label="Software Description" value={activeRole.allowances.softwareAllowanceDescription}
                    onChange={e => updateAL(activeRole.id, { softwareAllowanceDescription: e.target.value.toUpperCase() })} placeholder="SOFTWARE NAME" />
                  <FMoney label="Fee Per Week" currency={activeRole.currency}
                    value={activeRole.allowances.softwareAllowanceFeePerWeek} onChange={v => updateAL(activeRole.id, { softwareAllowanceFeePerWeek: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.softwareAllowanceBudgetCode}
                    onChange={e => updateAL(activeRole.id, { softwareAllowanceBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="softwareAllowance" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="equipmentRental" icon={Camera} label="Equipment Rental"
                  enabled={activeRole.allowances.equipmentRental} onToggle={v => updateAL(activeRole.id, { equipmentRental: v })}>
                  <FInput label="Equipment Description" value={activeRole.allowances.equipmentRentalDescription}
                    onChange={e => updateAL(activeRole.id, { equipmentRentalDescription: e.target.value.toUpperCase() })} placeholder="EQUIPMENT" />
                  <FMoney label="Fee Per Week" currency={activeRole.currency}
                    value={activeRole.allowances.equipmentRentalFeePerWeek} onChange={v => updateAL(activeRole.id, { equipmentRentalFeePerWeek: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.equipmentRentalBudgetCode}
                    onChange={e => updateAL(activeRole.id, { equipmentRentalBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="equipmentRental" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="mobilePhoneAllowance" icon={Smartphone} label="Mobile Phone Allowance"
                  enabled={activeRole.allowances.mobilePhoneAllowance} onToggle={v => updateAL(activeRole.id, { mobilePhoneAllowance: v })}>
                  <FMoney label="Fee Per Week" currency={activeRole.currency}
                    value={activeRole.allowances.mobilePhoneAllowanceFeePerWeek} onChange={v => updateAL(activeRole.id, { mobilePhoneAllowanceFeePerWeek: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.mobilePhoneAllowanceBudgetCode}
                    onChange={e => updateAL(activeRole.id, { mobilePhoneAllowanceBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="mobilePhoneAllowance" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="vehicleAllowance" icon={Car} label="Vehicle Allowance"
                  enabled={activeRole.allowances.vehicleAllowance} onToggle={v => updateAL(activeRole.id, { vehicleAllowance: v })}>
                  <FMoney label="Fee Per Week" currency={activeRole.currency}
                    value={activeRole.allowances.vehicleAllowanceFeePerWeek} onChange={v => updateAL(activeRole.id, { vehicleAllowanceFeePerWeek: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.vehicleAllowanceBudgetCode}
                    onChange={e => updateAL(activeRole.id, { vehicleAllowanceBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="vehicleAllowance" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="vehicleHire" icon={Truck} label="Vehicle Hire"
                  enabled={activeRole.allowances.vehicleHire} onToggle={v => updateAL(activeRole.id, { vehicleHire: v })}>
                  <FMoney label="Weekly Rate" currency={activeRole.currency}
                    value={activeRole.allowances.vehicleHireRate} onChange={v => updateAL(activeRole.id, { vehicleHireRate: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.vehicleHireBudgetCode}
                    onChange={e => updateAL(activeRole.id, { vehicleHireBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="vehicleHire" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="perDiem1" icon={Coffee} label="Per Diem 1"
                  enabled={activeRole.allowances.perDiem1} onToggle={v => updateAL(activeRole.id, { perDiem1: v })}>
                  <FSelect label="Currency" value={activeRole.allowances.perDiem1Currency}
                    onChange={v => updateAL(activeRole.id, { perDiem1Currency: v })} options={CURRENCIES} />
                  <div className="grid grid-cols-2 gap-2">
                    <FMoney label="Shoot Day" currency={activeRole.allowances.perDiem1Currency}
                      value={activeRole.allowances.perDiem1ShootDayRate} onChange={v => updateAL(activeRole.id, { perDiem1ShootDayRate: v })} />
                    <FMoney label="Non-Shoot Day" currency={activeRole.allowances.perDiem1Currency}
                      value={activeRole.allowances.perDiem1NonShootDayRate} onChange={v => updateAL(activeRole.id, { perDiem1NonShootDayRate: v })} />
                  </div>
                  <FInput label="Budget Code" value={activeRole.allowances.perDiem1BudgetCode}
                    onChange={e => updateAL(activeRole.id, { perDiem1BudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="perDiem1" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="perDiem2" icon={DollarSign} label="Per Diem 2"
                  enabled={activeRole.allowances.perDiem2} onToggle={v => updateAL(activeRole.id, { perDiem2: v })}>
                  <FSelect label="Currency" value={activeRole.allowances.perDiem2Currency}
                    onChange={v => updateAL(activeRole.id, { perDiem2Currency: v })} options={CURRENCIES} />
                  <div className="grid grid-cols-2 gap-2">
                    <FMoney label="Shoot Day" currency={activeRole.allowances.perDiem2Currency}
                      value={activeRole.allowances.perDiem2ShootDayRate} onChange={v => updateAL(activeRole.id, { perDiem2ShootDayRate: v })} />
                    <FMoney label="Non-Shoot Day" currency={activeRole.allowances.perDiem2Currency}
                      value={activeRole.allowances.perDiem2NonShootDayRate} onChange={v => updateAL(activeRole.id, { perDiem2NonShootDayRate: v })} />
                  </div>
                  <FInput label="Budget Code" value={activeRole.allowances.perDiem2BudgetCode}
                    onChange={e => updateAL(activeRole.id, { perDiem2BudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="perDiem2" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>

                <AllowCard id="livingAllowance" icon={Home} label="Living Allowance"
                  enabled={activeRole.allowances.livingAllowance} onToggle={v => updateAL(activeRole.id, { livingAllowance: v })}>
                  <FSelect label="Currency" value={activeRole.allowances.livingAllowanceCurrency}
                    onChange={v => updateAL(activeRole.id, { livingAllowanceCurrency: v })} options={CURRENCIES} />
                  <FMoney label="Weekly Rate" currency={activeRole.allowances.livingAllowanceCurrency}
                    value={activeRole.allowances.livingAllowanceWeeklyRate} onChange={v => updateAL(activeRole.id, { livingAllowanceWeeklyRate: v })} />
                  <FInput label="Budget Code" value={activeRole.allowances.livingAllowanceBudgetCode}
                    onChange={e => updateAL(activeRole.id, { livingAllowanceBudgetCode: e.target.value.toUpperCase() })} placeholder="E.G. 847-13-001" />
                  <PayableIn prefix="livingAllowance" allowances={activeRole.allowances} onChange={upd => updateAL(activeRole.id, upd)} />
                </AllowCard>
              </div>
            </Section>

            {/* ─ Attachments ─ */}
            <Section title="Template Bundle" icon={Paperclip} open={open.attachments} onToggle={() => toggleSection('attachments')}>
              <div className="pt-2 grid grid-cols-2 gap-2">
                {['Daily Loan Out Agreement', 'Box Rental Form', 'Policy Acknowledgement', 'Crew Information Form'].map(doc => (
                  <div key={doc} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Paperclip className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase leading-tight text-foreground">{doc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ─ Notes ─ */}
            <Section title="Additional Notes" icon={StickyNote} open={open.notes} onToggle={() => toggleSection('notes')}>
              <div className="space-y-3 pt-2">
                <FL label="Other Deal Provisions">
                  <textarea value={formData.otherDealProvisions}
                    onChange={e => setFD('otherDealProvisions')(e.target.value)}
                    className={`${IC} resize-none h-20`} placeholder="Enter any additional provisions..." />
                </FL>
                <FL label="Internal Notes">
                  <textarea value={formData.additionalNotes}
                    onChange={e => setFD('additionalNotes')(e.target.value)}
                    className={`${IC} resize-none h-20`} placeholder="Notes for internal reference only..." />
                </FL>
              </div>
            </Section>

            <div className="h-4" />
          </div>
        </div>

        {/* ════ RIGHT — CONTRACT PREVIEW ════ */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-shrink-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" style={{ backgroundColor: 'var(--mint-500)' }} />
              <span className="text-xs font-bold text-foreground">Contract Preview</span>
              <span className="text-[10px] text-muted-foreground">— read-only · updates live</span>
            </div>
            {bundleTag && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {bundleTag}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto min-h-0 bg-muted/40 p-6">
            <div className="max-w-[680px] mx-auto shadow-2xl rounded-2xl overflow-hidden ring-1 ring-border">
              <ContractPreview offer={formData} role={primaryRole} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}