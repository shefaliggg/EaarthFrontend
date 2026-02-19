/**
 * ContractPreview.jsx — Enhanced UI with refined card styling, Lucide icons, logo
 */

import eaarthLogo from '../../../../src/assets/eaarth.webp';
import {
  User, Mail, Phone, UserCheck, FileText,
  Briefcase, Building2, MapPin, Calendar,
  Clock, Globe, CreditCard, TrendingUp,
  Package, StickyNote, PenLine, Shield,
  CheckCircle2, AlertCircle, Box, Monitor,
  AppWindow, Camera, Smartphone, Car, Truck,
  Coffee, DollarSign, Home, Zap,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const SPECIAL_DAY_LABELS = {
  SIXTH_DAY:      '6th Day',
  SEVENTH_DAY:    '7th Day',
  PUBLIC_HOLIDAY: 'Public Holiday',
  TRAVEL_DAY:     'Travel Day',
  TURNAROUND:     'Turnaround',
};

const getBundle = (eng = '', rate = '') => {
  const e = eng.toUpperCase();
  const r = rate.toUpperCase();
  if (e === 'LOAN_OUT' && r === 'DAILY')  return { name: 'Daily Loan Out Agreement',  tag: 'LOAN-OUT · DAILY',  color: 'lavender' };
  if (e === 'LOAN_OUT' && r === 'WEEKLY') return { name: 'Weekly Loan Out Agreement', tag: 'LOAN-OUT · WEEKLY', color: 'lavender' };
  if (e === 'PAYE'     && r === 'DAILY')  return { name: 'Daily PAYE Agreement',      tag: 'PAYE · DAILY',     color: 'sky'      };
  if (e === 'PAYE'     && r === 'WEEKLY') return { name: 'Weekly PAYE Agreement',     tag: 'PAYE · WEEKLY',    color: 'sky'      };
  if (e === 'SCHD')                       return { name: 'SCHD Agreement',            tag: 'SCHD',             color: 'peach'    };
  if (e === 'LONG_FORM')                  return { name: 'Long Form Agreement',       tag: 'LONG FORM',        color: 'mint'     };
  return { name: 'Standard Agreement', tag: 'STANDARD', color: 'lavender' };
};

const ALLOWANCE_ICONS = {
  boxRental: Box,
  computerAllowance: Monitor,
  softwareAllowance: AppWindow,
  equipmentRental: Camera,
  mobilePhoneAllowance: Smartphone,
  vehicleAllowance: Car,
  vehicleHire: Truck,
  perDiem1: Coffee,
  perDiem2: DollarSign,
  livingAllowance: Home,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const currSym  = (c = 'GBP') => ({ GBP: '£', USD: '$', EUR: '€' }[c] ?? '£');
const fmtDate  = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
const fmtMoney = (v, c = 'GBP') => {
  if (!v) return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : `${currSym(c)}${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const stableHash = (s = '') => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
const cn = (...c) => c.filter(Boolean).join(' ');

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, accent }) {
  return (
    <div className={cn(
      'flex items-center gap-2.5 px-5 py-3 border-b border-border',
      accent ? 'bg-primary/5' : 'bg-muted/40'
    )}>
      <div className={cn(
        'w-6 h-6 rounded-lg flex items-center justify-center shrink-0',
        accent ? 'bg-primary/15' : 'bg-border'
      )}>
        <Icon className={cn('w-3.5 h-3.5', accent ? 'text-primary' : 'text-muted-foreground')} strokeWidth={1.75} />
      </div>
      <span className={cn(
        'text-[10px] font-bold uppercase tracking-[0.15em]',
        accent ? 'text-primary' : 'text-muted-foreground'
      )}>{label}</span>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, value, icon: Icon, wide, mono }) {
  return (
    <div className={cn('space-y-1', wide && 'col-span-2')}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-muted-foreground/60" strokeWidth={1.75} />}
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      </div>
      <p className={cn('leading-snug', mono ? 'text-[11px] font-mono' : 'text-[12px] font-semibold text-foreground')}>
        {value || <span className="text-muted-foreground/30 italic font-normal text-[11px]">—</span>}
      </p>
    </div>
  );
}

// ── Info grid ─────────────────────────────────────────────────────────────────
function Grid2({ children, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-x-6 gap-y-4 p-5', className)}>
      {children}
    </div>
  );
}

function Grid3({ children, className }) {
  return (
    <div className={cn('grid grid-cols-3 gap-x-5 gap-y-4 p-5', className)}>
      {children}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, className }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card overflow-hidden', className)}>
      {children}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function Badge({ label, variant = 'default' }) {
  const styles = {
    default:  'bg-border/60 text-muted-foreground border-border',
    primary:  'bg-primary/10 text-primary border-primary/20',
    success:  'bg-mint-100 text-mint-700 border-mint-200 dark:bg-mint-900/30 dark:text-mint-300 dark:border-mint-800',
    warning:  'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    sky:      'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800',
    peach:    'bg-peach-100 text-peach-700 border-peach-200 dark:bg-peach-900/30 dark:text-peach-300 dark:border-peach-800',
    lavender: 'bg-lavender-100 text-lavender-700 border-lavender-200 dark:bg-lavender-900/30 dark:text-lavender-300 dark:border-lavender-800',
  };
  return (
    <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full border tracking-wide', styles[variant] || styles.default)}>
      {label}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContractPreview({ offer = {}, role = {} }) {
  const al     = role.allowances || {};
  const bundle = getBundle(role.engagementType, role.rateType);
  const today  = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const sym    = currSym(role.currency || 'GBP');
  const refNum = `AGR-${new Date().getFullYear()}-${String(stableHash((offer.fullName || '') + (role.jobTitle || ''))).slice(0, 4).padStart(4, '0')}`;

  // Active allowances
  const allowanceList = [
    al.boxRental && {
      key: 'boxRental', label: 'Box Rental',
      value: fmtMoney(al.boxRentalFeePerWeek, role.currency),
      detail: al.boxRentalDescription,
      extra: al.boxRentalCap ? `Cap: ${fmtMoney(al.boxRentalCap, role.currency)}` : null,
      budgetCode: al.boxRentalBudgetCode,
    },
    al.computerAllowance && {
      key: 'computerAllowance', label: 'Computer',
      value: fmtMoney(al.computerAllowanceFeePerWeek, role.currency),
      budgetCode: al.computerAllowanceBudgetCode,
    },
    al.softwareAllowance && {
      key: 'softwareAllowance', label: 'Software',
      value: fmtMoney(al.softwareAllowanceFeePerWeek, role.currency),
      detail: al.softwareAllowanceDescription,
      budgetCode: al.softwareAllowanceBudgetCode,
    },
    al.equipmentRental && {
      key: 'equipmentRental', label: 'Equipment',
      value: fmtMoney(al.equipmentRentalFeePerWeek, role.currency),
      detail: al.equipmentRentalDescription,
      budgetCode: al.equipmentRentalBudgetCode,
    },
    al.mobilePhoneAllowance && {
      key: 'mobilePhoneAllowance', label: 'Mobile Phone',
      value: fmtMoney(al.mobilePhoneAllowanceFeePerWeek, role.currency),
      budgetCode: al.mobilePhoneAllowanceBudgetCode,
    },
    al.vehicleAllowance && {
      key: 'vehicleAllowance', label: 'Vehicle',
      value: fmtMoney(al.vehicleAllowanceFeePerWeek, role.currency),
      budgetCode: al.vehicleAllowanceBudgetCode,
    },
    al.vehicleHire && {
      key: 'vehicleHire', label: 'Vehicle Hire',
      value: fmtMoney(al.vehicleHireRate, role.currency),
      budgetCode: al.vehicleHireBudgetCode,
    },
    al.perDiem1 && {
      key: 'perDiem1', label: `Per Diem (${al.perDiem1Currency || 'GBP'})`,
      value: `${currSym(al.perDiem1Currency)}${al.perDiem1ShootDayRate || '—'}/day`,
      detail: `Non-shoot: ${currSym(al.perDiem1Currency)}${al.perDiem1NonShootDayRate || '—'}`,
      budgetCode: al.perDiem1BudgetCode,
    },
    al.perDiem2 && {
      key: 'perDiem2', label: `Per Diem (${al.perDiem2Currency || 'USD'})`,
      value: `${currSym(al.perDiem2Currency)}${al.perDiem2ShootDayRate || '—'}/day`,
      detail: `Non-shoot: ${currSym(al.perDiem2Currency)}${al.perDiem2NonShootDayRate || '—'}`,
      budgetCode: al.perDiem2BudgetCode,
    },
    al.livingAllowance && {
      key: 'livingAllowance', label: 'Living',
      value: fmtMoney(al.livingAllowanceWeeklyRate, al.livingAllowanceCurrency),
      budgetCode: al.livingAllowanceBudgetCode,
    },
  ].filter(Boolean);

  const specials = (role.specialDayRates || []).filter(d => d.amount);

  return (
    <article
      id="contract-preview-doc"
      className="bg-background text-foreground"
      style={{ fontFamily: '"Outfit", system-ui, sans-serif' }}
    >

      {/* ══════════════════════════════════════════════
          HEADER — Dark branded block
      ══════════════════════════════════════════════ */}
      <div className="bg-primary relative overflow-hidden">

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

        {/* Top strip with logo + ref */}
        <div className="relative flex items-center justify-between px-7 pt-6 pb-0">
          <div className="flex items-center gap-3.5">
            <img
              src={eaarthLogo}
              alt="Eaarth Productions"
              className="h-9 w-auto object-contain select-none"
              style={{ filter: 'brightness(0) invert(1)' }}
              draggable={false}
            />
            <div className="w-px h-9 opacity-20" style={{ background: 'white' }} />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] opacity-70 text-white leading-none">
                EAARTH PRODUCTIONS
              </p>
              <p className="text-[9px] opacity-60 text-white mt-0.5 leading-none">Crew Engagement</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[8px] font-mono uppercase tracking-widest opacity-70 text-white">Reference</p>
            <p className="text-[11px] font-mono text-white font-bold mt-0.5">
              {refNum}
            </p>
            <p className="text-[9px] opacity-75 text-white mt-0.5">{today}</p>
          </div>
        </div>

        {/* Contract title block */}
        <div className="relative px-7 pt-5 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80 text-white mb-1.5">
                Agreement Type
              </p>
              <h1 className="text-[22px] font-bold text-white leading-tight tracking-tight">
                {bundle.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full opacity-70" style={{ backgroundColor: 'white' }} />
                <p className="text-[11px] opacity-90 text-white truncate">
                  {offer.fullName || '—'} &nbsp;·&nbsp; {role.jobTitle || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={cn(
              'text-[9px] font-bold px-2.5 py-1 rounded-full border tracking-wide',
              bundle.color === 'lavender' ? 'bg-lavender-400/15 text-lavender-300 border-lavender-400/20' :
              bundle.color === 'sky'      ? 'bg-sky-400/15 text-sky-300 border-sky-400/20' :
              bundle.color === 'peach'    ? 'bg-peach-400/15 text-peach-300 border-peach-400/20' :
                                           'bg-mint-400/15 text-mint-300 border-mint-400/20'
            )}>
              {bundle.tag}
            </span>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full border bg-amber-400/15 text-amber-300 border-amber-400/20 tracking-wide">
              DRAFT
            </span>
            {offer.allowAsSelfEmployedOrLoanOut === 'YES' && (
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full border bg-mint-400/15 text-mint-300 border-mint-400/20 tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                SELF-EMPLOYED APPROVED
              </span>
            )}
            {offer.statusDeterminationReason && offer.statusDeterminationReason !== 'OTHER' && (
              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/8 text-white/40 border border-white/10 tracking-wide">
                {offer.statusDeterminationReason.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }} />
      </div>

      {/* ══════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════ */}
      <div className="bg-background px-6 py-5 space-y-4">

        {/* ── 1. Artist Details ─────────────────────────────────────────────── */}
        <Card>
          <SectionHeader icon={User} label="Artist Details" />
          <Grid2>
            <Field label="Full Name"  value={offer.fullName}       icon={User} />
            <Field label="Email"      value={offer.emailAddress}   icon={Mail} />
            <Field label="Mobile"     value={offer.mobileNumber}   icon={Phone} />
            <Field label="Tax Status" value={
              offer.allowAsSelfEmployedOrLoanOut === 'YES' ? 'Self-Employed / Loan Out' :
              offer.allowAsSelfEmployedOrLoanOut === 'NO'  ? 'PAYE Employee' : null
            } icon={Shield} />
            {offer.alternativeContractType && (
              <Field label="Contract Type" value={offer.alternativeContractType.replace(/_/g, ' ')} icon={FileText} wide />
            )}
          </Grid2>

          {offer.isViaAgent && (
            <>
              <div className="h-px bg-border mx-5" />
              <div className="px-5 py-3 bg-muted/30 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  <UserCheck className="w-3 h-3" strokeWidth={1.75} />
                  Via Agent
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4 pl-2">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Agency</p>
                    <p className="text-[11px] font-semibold text-foreground">{offer.agentName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Contact</p>
                    <p className="text-[11px] font-semibold text-foreground">{offer.agentEmailAddress || '—'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* ── 2. Role & Engagement ─────────────────────────────────────────── */}
        <Card>
          <SectionHeader icon={Briefcase} label="Role & Engagement" />
          <Grid3>
            <Field label="Job Title"    value={[role.jobTitle, role.jobTitleSuffix].filter(Boolean).join(' ')} icon={Briefcase} wide />
            <Field label="Unit"         value={role.unit}                    icon={Building2} />
            <Field label="Department"   value={role.department}              icon={Building2} />
            <Field label="Sub-Dept"     value={role.subDepartment}           icon={Building2} />
            <Field label="Site of Work" value={role.regularSiteOfWork}       icon={MapPin} />
            <Field label="Engagement"   value={role.engagementType?.replace(/_/g, ' ')} icon={FileText} />
            <Field label="Working Week" value={role.workingWeek?.replace(/_/g, ' ')}    icon={Calendar} />
            <Field label="Std Hrs/Day"  value={role.standardWorkingHours ? `${role.standardWorkingHours} hours` : null} icon={Clock} />
            <Field label="Start Date"   value={fmtDate(role.startDate)}      icon={Calendar} />
            <Field label="End Date"     value={fmtDate(role.endDate)}        icon={Calendar} />
            <Field label="Working in UK" value={role.workingInUnitedKingdom} icon={Globe} />
          </Grid3>
        </Card>

        {/* ── 3. Fees & Compensation ────────────────────────────────────────── */}
        <Card>
          <SectionHeader icon={CreditCard} label="Fees & Compensation" accent />

          {/* Rate hero */}
          <div className="px-5 py-5 flex items-start gap-6 border-b border-border">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                {role.rateType === 'DAILY' ? 'Daily' : 'Weekly'} Rate
              </p>
              <p className="text-[32px] font-bold text-foreground leading-none tracking-tight">
                {fmtMoney(role.rateAmount, role.currency) ?? (
                  <span className="text-muted-foreground text-2xl font-normal italic">Not set</span>
                )}
              </p>
              {role.holidayPayInclusive && (
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="w-3 h-3 text-primary" strokeWidth={2} />
                  <span className="text-[10px] text-primary font-semibold">Holiday pay inclusive</span>
                </div>
              )}
            </div>

            <div className="shrink-0 text-right border-l border-border pl-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Fee Per Day</p>
              <p className="text-xl font-bold text-foreground">
                {fmtMoney(role.feePerDay, role.currency) ?? '—'}
              </p>
              <p className="text-[9px] text-muted-foreground mt-1 font-mono">{role.currency || 'GBP'}</p>
            </div>
          </div>

          {/* Special day rates */}
          {specials.length > 0 && (
            <div className="border-b border-border">
              <div className="px-5 pt-4 pb-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" strokeWidth={1.75} />
                  Special Day Rates
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {specials.map(d => (
                    <div key={d.type} className="rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                      <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                        {SPECIAL_DAY_LABELS[d.type] || d.type}
                      </p>
                      <p className="text-[13px] font-bold text-foreground">
                        {sym}{parseFloat(d.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-3" />
            </div>
          )}

          {/* Overtime */}
          <div className="px-5 py-3.5 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overtime</p>
            </div>
            <p className="text-[11px] font-semibold text-foreground">
              {role.overtimeType === 'CALCULATED' || !role.overtimeType
                ? 'Calculated per agreement'
                : `${(role.overtime?.rules || []).length} custom rule(s) applied`}
            </p>
          </div>
        </Card>

        {/* ── 4. Allowances ─────────────────────────────────────────────────── */}
        {allowanceList.length > 0 && (
          <Card>
            <SectionHeader icon={Package} label={`Allowances — ${allowanceList.length} active`} accent />
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {allowanceList.map(a => {
                const Icon = ALLOWANCE_ICONS[a.key] || Package;
                return (
                  <div key={a.key}
                    className="rounded-xl border border-primary/15 bg-primary/5 overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{a.label}</span>
                      </div>
                      {a.value && (
                        <span className="text-[13px] font-bold text-foreground">
                          {a.value}<span className="text-[9px] font-normal text-muted-foreground">/wk</span>
                        </span>
                      )}
                    </div>
                    {/* Card details */}
                    {(a.detail || a.extra || a.budgetCode) && (
                      <div className="px-3.5 py-2 space-y-0.5">
                        {a.detail && <p className="text-[10px] text-muted-foreground leading-snug">{a.detail}</p>}
                        {a.extra  && <p className="text-[10px] text-primary font-semibold">{a.extra}</p>}
                        {a.budgetCode && (
                          <p className="text-[9px] font-mono text-muted-foreground/60">{a.budgetCode}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── 5. Notes & Provisions ─────────────────────────────────────────── */}
        {(offer.otherDealProvisions || offer.additionalNotes) && (
          <Card>
            <SectionHeader icon={StickyNote} label="Notes & Provisions" />
            <div className="p-5 space-y-3.5">
              {offer.otherDealProvisions && (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} />
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Other Deal Provisions
                    </p>
                  </div>
                  <p className="text-[12px] text-foreground leading-relaxed whitespace-pre-line">
                    {offer.otherDealProvisions}
                  </p>
                </div>
              )}
              {offer.additionalNotes && (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} />
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Internal Notes
                    </p>
                  </div>
                  <p className="text-[12px] text-foreground leading-relaxed whitespace-pre-line">
                    {offer.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ── 6. Signature Block ────────────────────────────────────────────── */}
        <Card>
          <SectionHeader icon={PenLine} label="Signatures" />
          <div className="p-5">
            <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.18em] text-center mb-6">
              In Witness Whereof the parties have executed this Agreement
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { party: 'EAARTH PRODUCTIONS', name: 'Authorised Signatory', sub: 'On behalf of the Company' },
                { party: 'ARTIST / REPRESENTATIVE', name: offer.fullName || 'Artist Name', sub: 'The Contractor or their Lender' },
              ].map(p => (
                <div key={p.party}>
                  <p className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-[0.16em] mb-3">
                    {p.party}
                  </p>

                  {/* Signature line */}
                  <div className="relative mb-3">
                    <div className="h-10 border-b-2 border-border" />
                    <p className="absolute bottom-1 left-0 text-[8px] text-muted-foreground/40 uppercase tracking-wide">
                      Signature
                    </p>
                  </div>

                  <p className="text-[11px] font-semibold text-foreground mb-3">{p.name}</p>
                  <p className="text-[9px] text-muted-foreground/60 mb-3">{p.sub}</p>

                  {/* Date line */}
                  <div className="relative">
                    <div className="h-7 border-b border-border/60" />
                    <p className="absolute bottom-1 left-0 text-[8px] text-muted-foreground/40 uppercase tracking-wide">
                      Date
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center pt-1 pb-2">
          <p className="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest">
            Confidential · {bundle.name.toUpperCase()} · {refNum} · Eaarth Productions
          </p>
        </div>
      </div>
    </article>
  );
}