import { FileText, Lock, PenTool } from "lucide-react";
import { formatCurrency } from "../../../../utils/rateCalculations";

const ROLE_LABEL_MAP = {
  "CREW MEMBER SIGNATURE": "crew",
  "UPM": "upm",
  "FINANCIAL CONTROLLER": "fc",
  "APPROVED PRODUCTION EXECUTIVE": "studio",
  "AGENT INITIALS (IF APPLICABLE)": null,
};

const ROLE_COLOR_MAP = {
  crew: { bg: "bg-teal-50", border: "border-teal-300", text: "text-teal-700", ring: "ring-teal-200" },
  upm: { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700", ring: "ring-indigo-200" },
  fc: { bg: "bg-violet-50", border: "border-violet-300", text: "text-violet-700", ring: "ring-violet-200" },
  studio: { bg: "bg-fuchsia-50", border: "border-fuchsia-300", text: "text-fuchsia-700", ring: "ring-fuchsia-200" },
};

const allowanceLabelMap = [
  { key: "boxRental", label: "Box Rental" },
  { key: "computer", label: "Computer" },
  { key: "software", label: "Software" },
  { key: "equipment", label: "Equipment" },
  { key: "vehicle", label: "Vehicle" },
  { key: "mobile", label: "Mobile" },
  { key: "perDiem1", label: "Per Diem (Shoot)" },
  { key: "perDiem2", label: "Per Diem (Non-Shoot)" },
  { key: "living", label: "Living" },
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "fuel", label: "Fuel" },
  { key: "mileage", label: "Mileage" },
];

// Map form field names → which "zone" in the contract they correspond to
// Each zone has a label to show in the highlight tooltip and a color
const FIELD_ZONE_MAP = {
  // Recipient fields → highlight the recipient party block
  fullName:     { zone: "recipient", label: "Full Name" },
  email:        { zone: "recipient", label: "Email" },
  mobileNumber: { zone: "recipient", label: "Phone" },
  agentEmail:   { zone: "recipient", label: "Agent Email" },
  isViaAgent:   { zone: "recipient", label: "Via Agent" },

  // Deal terms
  department:    { zone: "dealTerms", label: "Department" },
  jobTitle:      { zone: "dealTerms", label: "Position" },
  newJobTitle:   { zone: "dealTerms", label: "Position" },
  jobTitleSuffix:{ zone: "dealTerms", label: "Position Suffix" },
  startDate:     { zone: "dealTerms", label: "Start Date" },
  endDate:       { zone: "dealTerms", label: "End Date" },
  unit:          { zone: "dealTerms", label: "Unit" },

  // Fee / engagement
  feePerDay:      { zone: "feeStructure", label: "Fee Per Day" },
  dailyOrWeekly:  { zone: "feeStructure", label: "Frequency" },
  engagementType: { zone: "feeStructure", label: "Engagement Type" },
  workingWeek:    { zone: "feeStructure", label: "Working Week" },
  currency:       { zone: "feeStructure", label: "Currency" },
  overtime:       { zone: "feeStructure", label: "Overtime" },
  otherOT:        { zone: "feeStructure", label: "Other O/T" },
  cameraOTSWD:    { zone: "feeStructure", label: "Camera O/T SWD" },
  cameraOTSCWD:   { zone: "feeStructure", label: "Camera O/T SCWD" },
  cameraOTCWD:    { zone: "feeStructure", label: "Camera O/T CWD" },

  // Tax / IR35
  allowSelfEmployed:              { zone: "feeStructure", label: "Engagement Type" },
  statusDeterminationReason:      { zone: "feeStructure", label: "IR35 Reason" },
  otherStatusDeterminationReason: { zone: "feeStructure", label: "IR35 Reason" },

  // Other deal provisions
  otherDealProvisions: { zone: "specialStipulations", label: "Special Stipulations" },
};

// Salary / overtime rows
const SALARY_ZONE_RE   = /^salaryRow_/;
const OVERTIME_ZONE_RE = /^overtimeRow_/;
const ALLOWANCE_ZONE_RE = /^allowance_/;

function getZoneForField(fieldName) {
  if (!fieldName) return null;
  if (SALARY_ZONE_RE.test(fieldName))   return { zone: "feeStructure", label: "Salary" };
  if (OVERTIME_ZONE_RE.test(fieldName)) return { zone: "feeStructure", label: "Overtime" };
  if (ALLOWANCE_ZONE_RE.test(fieldName)) return { zone: "feeStructure", label: "Allowances" };
  return FIELD_ZONE_MAP[fieldName] ?? null;
}

// Highlight wrapper component — wraps a zone block and pulses blue when active
function ZoneHighlight({ zoneId, activeZone, label, children }) {
  const isActive = activeZone === zoneId;
  return (
    <div className={`relative transition-all duration-200 rounded ${isActive ? "ring-2 ring-blue-400 ring-offset-[1px]" : ""}`}>
      {isActive && (
        <div className="absolute -top-4 left-0 z-10 flex items-center gap-1 pointer-events-none">
          <span className="bg-blue-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider whitespace-nowrap">
            {label}
          </span>
        </div>
      )}
      <div className={`transition-colors duration-200 rounded ${isActive ? "bg-blue-50/60" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export function ContractDocument({
  data,
  calculatedRates,
  engineSettings,
  allowances,
  activeField = null,
  isLocked = false,
  signatures = {},
  activeSigningRole = null,
  onSignatureClick,
}) {
  // Derive which zone to highlight from the active field
  const zoneInfo = getZoneForField(activeField);
  const activeZone = zoneInfo?.zone ?? null;
  const activeLabel = zoneInfo?.label ?? "";

  const cs = (() => {
    switch (data.currency) {
      case "GBP": return "£";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "£";
    }
  })();

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getDeptLabel = (val) =>
    val ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

  const getEngType = () => {
    const m = { loan_out: "LOAN OUT", paye: "PAYE", schd: "SCHEDULE D", long_form: "LONG FORM" };
    return m[data.engagementType] || "PAYE";
  };

  const getJobTitle = () => {
    if (data.createOwnJobTitle && data.newJobTitle) return data.newJobTitle;
    return data.jobTitle || "—";
  };

  const freq = data.dailyOrWeekly
    ? data.dailyOrWeekly.charAt(0).toUpperCase() + data.dailyOrWeekly.slice(1)
    : "Daily";

  const now = new Date();
  const refDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  const enabledAllowances = allowanceLabelMap.filter((a) => allowances[a.key]?.enabled);

  const Cell = ({ label, value, className = "" }) => (
    <div className={className}>
      <p className="text-[7px] text-neutral-400 uppercase tracking-wider">{label}</p>
      <p className="text-[9px] text-neutral-800 mt-px">{value}</p>
    </div>
  );

  const renderSignatureBox = (label, role) => {
    const isActive = role != null && role === activeSigningRole;
    const signature = role ? signatures[role] : undefined;
    const colors = role ? ROLE_COLOR_MAP[role] : null;

    if (signature) {
      return (
        <div key={label}>
          <div className="h-8 border-b border-emerald-300 bg-emerald-50/60 rounded-t flex items-center justify-center relative">
            <p className="text-[11px] italic text-emerald-800" style={{ fontFamily: "Georgia, serif" }}>
              {signature.name}
            </p>
            <span className="absolute right-1 top-0.5 text-[5px] text-emerald-500 font-semibold uppercase tracking-wider">
              {signature.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
          <p className="text-[7px] font-semibold uppercase tracking-wider text-emerald-600 mt-px flex items-center gap-1">
            {label} <span className="text-[5px] bg-emerald-100 text-emerald-600 px-1 py-px rounded font-bold">SIGNED</span>
          </p>
        </div>
      );
    }

    if (isActive && onSignatureClick && colors) {
      return (
        <div key={label}>
          <button
            type="button"
            onClick={() => onSignatureClick(role)}
            className={`w-full h-8 border-b-2 ${colors.border} ${colors.bg} rounded-t flex items-center justify-center gap-1.5 ring-2 ${colors.ring} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            <PenTool className={`h-3 w-3 ${colors.text}`} />
            <span className={`text-[7px] font-semibold ${colors.text} uppercase tracking-wider`}>Click to sign</span>
          </button>
          <p className={`text-[7px] font-semibold uppercase tracking-wider ${colors.text} mt-px flex items-center gap-1`}>
            {label} <span className={`text-[5px] ${colors.bg} ${colors.text} px-1 py-px rounded font-bold border ${colors.border}`}>YOUR TURN</span>
          </p>
        </div>
      );
    }

    return (
      <div key={label}>
        <div className="h-8 border-b border-purple-300" />
        <p className="text-[7px] font-semibold uppercase tracking-wider text-purple-700 mt-px">{label}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {isLocked && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 flex items-center gap-2">
          <Lock className="h-3 w-3 text-emerald-600" />
          <span className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">
            Document Locked — All signatures received
          </span>
        </div>
      )}

      <div className="p-3">
        {/* Header */}
        <div className="border-b-2 border-purple-700 pb-1.5 mb-2">
          <div className="flex justify-between items-end mb-1 border-b border-purple-100 pb-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-purple-700 flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-[14px] font-black uppercase tracking-tighter text-purple-900">
                FILM: &ldquo;WERWULF&rdquo;
              </h1>
            </div>
            <div className="text-[7px] font-mono text-neutral-400 flex flex-col items-end gap-px">
              <div>Version: <span className="text-purple-700 font-semibold">1.0</span></div>
              <div>Ref: <span className="text-purple-700 font-semibold">WERWULF-ISA-V1.0</span></div>
              <div>Date: <span className="text-neutral-700 font-semibold">{refDate}</span></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-[8px] font-semibold uppercase tracking-widest text-purple-800">
              Crew — Major Motion Picture — Individual Services Agreement
            </h2>
            <div className="flex gap-1.5">
              <ZoneHighlight zoneId="feeStructure" activeZone={activeZone} label={activeLabel}>
                <span className="border border-purple-700 text-purple-700 px-2 py-px text-[8px] font-black uppercase tracking-wider rounded">
                  {freq}
                </span>
              </ZoneHighlight>
              <ZoneHighlight zoneId="feeStructure" activeZone={activeZone} label={activeLabel}>
                <span className="bg-purple-700 text-white px-2 py-px text-[8px] font-black uppercase tracking-wider rounded">
                  {getEngType()}
                </span>
              </ZoneHighlight>
            </div>
          </div>
          <p className="mt-1 text-[8px] italic text-neutral-500">
            This Agreement is made with effect from between:
          </p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-3 mb-2 text-[8px]">
          {/* Producer — not highlighted */}
          <div>
            <p className="font-bold text-[9px] text-purple-900 mb-0.5">(1) MIRAGE PICTURES LIMITED</p>
            <p className="text-neutral-500 mb-1">(&ldquo;Producer&rdquo;)</p>
            <div className="grid grid-cols-[45px_1fr] gap-1">
              <span className="text-neutral-500 font-medium">Address:</span>
              <span className="text-neutral-700">Sky Elstree Studios, Borehamwood</span>
              <span className="text-neutral-500 font-medium">Phone:</span>
              <span className="text-neutral-700">020 3945 9013</span>
            </div>
          </div>

          {/* Crew member — highlight on recipient fields */}
          <ZoneHighlight zoneId="recipient" activeZone={activeZone} label={activeLabel}>
            <p className="font-bold text-[9px] text-purple-900 mb-0.5">(2) {data.fullName || "[CREW MEMBER]"}</p>
            <p className="text-neutral-500 mb-1">(&ldquo;you&rdquo; / &ldquo;your&rdquo;)</p>
            <div className="grid grid-cols-[55px_1fr] gap-1">
              <span className="text-neutral-500 font-medium">Email:</span>
              <span className="text-neutral-700">{data.email || "—"}</span>
              <span className="text-neutral-500 font-medium">Phone:</span>
              <span className="text-neutral-700">{data.mobileNumber || "—"}</span>
            </div>
          </ZoneHighlight>
        </div>

        {/* Deal Terms */}
        <div className="bg-purple-50/60 px-2 py-0.5 font-semibold text-[8px] uppercase text-purple-800 border-l-2 border-purple-600 tracking-wide mb-1.5">
          Deal Terms
        </div>
        <ZoneHighlight zoneId="dealTerms" activeZone={activeZone} label={activeLabel}>
          <div className="grid grid-cols-4 gap-x-3 gap-y-1 mb-2">
            <Cell label="Department" value={getDeptLabel(data.department)} />
            <Cell label="Position" value={`${getJobTitle()}${data.jobTitleSuffix ? ` ${data.jobTitleSuffix}` : ""}`} />
            <Cell label="Start Date" value={formatDate(data.startDate)} />
            <Cell label="End Date" value={data.endDate ? formatDate(data.endDate) : "n/a"} />
          </div>
        </ZoneHighlight>

        {/* Fee Structure */}
        <div className="bg-purple-50/60 px-2 py-0.5 font-semibold text-[8px] uppercase text-purple-800 border-l-2 border-purple-600 tracking-wide mb-1.5">
          Fee Structure
        </div>
        <ZoneHighlight zoneId="feeStructure" activeZone={activeZone} label={activeLabel}>
          <div className="grid grid-cols-3 gap-1.5 mb-2 items-start">
            {/* Salary */}
            <div className="border border-purple-100 rounded-lg">
              <div className="bg-purple-700 px-2 py-0.5 rounded-t-lg">
                <p className="text-white text-[8px] font-semibold tracking-wide">Salary</p>
              </div>
              <div className="px-1 py-0.5">
                <div className="grid grid-cols-[1fr_50px_50px] text-[6px] font-semibold text-purple-500 uppercase tracking-wider border-b border-purple-50 pb-px mb-px">
                  <span>Item</span><span className="text-right">Rate</span><span className="text-right">Gross</span>
                </div>
                {calculatedRates.salary.map((row, i) => (
                  <div key={i} className={`grid grid-cols-[1fr_50px_50px] py-px text-[7px] ${i % 2 === 0 ? "" : "bg-purple-50/30"}`}>
                    <span className="text-neutral-700">{row.item}</span>
                    <span className="text-right text-neutral-500 tabular-nums">{formatCurrency(row.rate, cs)}</span>
                    <span className="text-right text-purple-700 font-semibold tabular-nums">{formatCurrency(row.gross, cs)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overtime */}
            <div className="border border-purple-100 rounded-lg">
              <div className="bg-purple-700 px-2 py-0.5 rounded-t-lg">
                <p className="text-white text-[8px] font-semibold tracking-wide">Overtime</p>
              </div>
              <div className="px-1 py-0.5">
                <div className="grid grid-cols-[1fr_50px_50px] text-[6px] font-semibold text-purple-500 uppercase tracking-wider border-b border-purple-50 pb-px mb-px">
                  <span>Item</span><span className="text-right">Rate</span><span className="text-right">Gross</span>
                </div>
                {calculatedRates.overtime.map((row, i) => (
                  <div key={i} className={`grid grid-cols-[1fr_50px_50px] py-px text-[7px] ${i % 2 === 0 ? "" : "bg-purple-50/30"}`}>
                    <span className="text-neutral-700">{row.item}</span>
                    <span className="text-right text-neutral-500 tabular-nums">{formatCurrency(row.rate, cs)}</span>
                    <span className="text-right text-blue-600 font-semibold tabular-nums">{formatCurrency(row.gross, cs)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowances */}
            <div className="border border-purple-100 rounded-lg">
              <div className="bg-purple-700 px-2 py-0.5 rounded-t-lg">
                <p className="text-white text-[8px] font-semibold tracking-wide">Allowances</p>
              </div>
              <div className="px-1 py-0.5">
                <div className="grid grid-cols-[1fr_60px] text-[6px] font-semibold text-purple-500 uppercase tracking-wider border-b border-purple-50 pb-px mb-px">
                  <span>Item</span><span className="text-right">Rate / Cap</span>
                </div>
                {enabledAllowances.length > 0 ? (
                  enabledAllowances.map(({ key, label }, i) => {
                    const a = allowances[key];
                    return (
                      <div key={key} className={`grid grid-cols-[1fr_60px] py-px text-[7px] ${i % 2 === 0 ? "" : "bg-purple-50/30"}`}>
                        <span className="text-neutral-700">{label}</span>
                        <span className="text-right text-teal-600 font-semibold tabular-nums">
                          {cs}{parseFloat(a.feePerWeek || "0").toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[7px] text-neutral-400 italic py-1">No allowances</p>
                )}
              </div>
            </div>
          </div>
        </ZoneHighlight>

        {/* Other Terms */}
        <div className="text-[7.5px] space-y-1 mb-2">
          <div className="grid grid-cols-[80px_1fr] gap-1.5">
            <span className="font-semibold uppercase text-purple-800">Holiday:</span>
            <span className="text-neutral-600 leading-tight">
              Paid holiday per year in accordance with the Regulations, pro-rated to the length of the term of Your services under this Agreement (Holiday uplift: {(engineSettings.holidayUplift * 100).toFixed(2)}%).
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-1.5">
            <span className="font-semibold uppercase text-purple-800">Location:</span>
            <span className="text-neutral-600 leading-tight">
              Your normal place of work shall be the Production Base. However, You may be required to work at such other place or places within the United Kingdom or abroad.
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-1.5">
            <span className="font-semibold uppercase text-purple-800">Prod. Base:</span>
            <span className="text-neutral-600">Sky Elstree Studios, Rowley Lane, Borehamwood, WD6 1FX</span>
          </div>
        </div>

        {/* Note */}
        <div className="text-[7px] bg-amber-50/60 p-1.5 border-l-2 border-amber-400 mb-2 italic text-neutral-600 leading-tight rounded-r">
          <span className="font-semibold not-italic">Note:</span> The Immigration, Asylum and Nationality Act 2006 requires documentary evidence of eligibility to work in the United Kingdom. Please submit a copy of your passport to the production office.
        </div>

        {/* Special Stipulations */}
        {data.otherDealProvisions && (
          <>
            <div className="bg-purple-50/60 px-2 py-0.5 font-semibold text-[8px] uppercase text-purple-800 border-l-2 border-purple-600 tracking-wide mb-1">
              Special Stipulations
            </div>
            <ZoneHighlight zoneId="specialStipulations" activeZone={activeZone} label={activeLabel}>
              <p className="text-[8px] text-neutral-700 mb-2 leading-snug px-1">{data.otherDealProvisions}</p>
            </ZoneHighlight>
          </>
        )}

        {/* Agreement Text */}
        <div className="text-[7px] text-neutral-600 leading-snug bg-purple-50/20 p-1.5 border border-purple-100 rounded mb-2 text-justify">
          <p className="mb-1">
            Producer hereby agrees to engage You upon and subject to the terms and conditions of these Deal Terms, Special Stipulations (if any) and the attached Standard Terms and Conditions (together, the &ldquo;Agreement&rdquo;), in the Position set forth above in connection with the making of the motion picture provisionally entitled &ldquo;WERWULF&rdquo; (&ldquo;the Film&rdquo;) which Producer intends but does not undertake to make.
          </p>
          <p>
            You acknowledge by signing this Agreement that You have read, understood, and agree with all of the above Deal Terms/Special Stipulations as well as all those set out in the attached Standard Terms and Conditions.
          </p>
        </div>

        {/* Signature Block */}
        <div className="border border-purple-200 rounded-lg p-2 bg-purple-50/30">
          <p className="text-center font-semibold text-[7px] uppercase mb-3 tracking-wide text-purple-800 leading-tight">
            THIS NOTICE IS EFFECTIVE ONLY UPON SIGNATURE OF CREW MEMBER{data.isViaAgent ? " (OR AGENT)" : ""}, UNIT PRODUCTION MANAGER, FINANCIAL CONTROLLER AND THE APPROVED PRODUCTION EXECUTIVE
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {(() => {
              const label = data.isViaAgent ? "AGENT ON BEHALF OF CREW" : "CREW MEMBER SIGNATURE";
              const role = ROLE_LABEL_MAP["CREW MEMBER SIGNATURE"];
              return (
                <div>
                  {renderSignatureBox(label, role)}
                  {data.isViaAgent && data.agentEmail && (
                    <p className="text-[6px] text-purple-600/70 mt-0.5">For: {data.fullName}</p>
                  )}
                </div>
              );
            })()}
            {["FINANCIAL CONTROLLER", "UPM", "APPROVED PRODUCTION EXECUTIVE"].map((label) =>
              renderSignatureBox(label, ROLE_LABEL_MAP[label])
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-1.5 border-t border-neutral-200 flex justify-between text-[6px] text-neutral-400 font-mono">
          <span>REF: WERWULF-ISA-V1.0</span>
          <span>Page 1 of 1</span>
          <span>CONFIDENTIAL</span>
        </div>
      </div>
    </div>
  );
}