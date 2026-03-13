/**
 * CrewIdentityHeader.jsx
 * Full-width crew info card — avatar, name, job title, rate, dates, email + Edit button
 *
 * Props:
 *   contractData : object  — fullName, jobTitle, department, engagementType,
 *                            dailyOrWeekly, feePerDay, currency, startDate, endDate, email
 *   offer        : object  — for jobTitle override (createOwnJobTitle / newJobTitle)
 *   showEdit     : bool    — controls Edit/Close toggle state
 *   onToggleEdit : fn      — called when Edit button clicked
 */

import { Calendar, User, Edit2 } from "lucide-react";

const ENG_LABELS     = { paye: "PAYE", loan_out: "Loan Out", schd: "Schedule D", long_form: "Direct Hire" };
const CURRENCY_SYM   = { GBP: "£", USD: "$", EUR: "€", AUD: "A$", CAD: "C$" };
const DEPT_LABELS    = {
  camera: "Camera", electrical: "Electrical", grip: "Grip", art: "Art",
  costume: "Costume", makeup: "Makeup", sound: "Sound", production: "Production",
  locations: "Locations", transport: "Transport", vfx: "VFX", editing: "Editing",
  construction: "Construction",
};

export function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export function fmtDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

export default function CrewIdentityHeader({ contractData = {}, offer, showEdit, onToggleEdit }) {
  const jobTitle  = offer?.createOwnJobTitle && offer?.newJobTitle
    ? offer.newJobTitle : contractData.jobTitle || offer?.jobTitle || "";
  const engLabel  = ENG_LABELS[contractData.engagementType]  || contractData.engagementType || "";
  const deptLabel = DEPT_LABELS[contractData.department]     || contractData.department      || "";
  const currency  = CURRENCY_SYM[contractData.currency]     || "£";
  const rate      = contractData.feePerDay
    ? `${currency}${parseFloat(contractData.feePerDay).toLocaleString()}/day` : "";
  const freq      = contractData.dailyOrWeekly === "weekly" ? "Weekly" : "Daily";
  const dateRange = (contractData.startDate || contractData.endDate)
    ? `${fmtDate(contractData.startDate)} – ${fmtDate(contractData.endDate)}` : "";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-[13px] font-bold shrink-0 select-none">
          {getInitials(contractData.fullName)}
        </div>

        <div className="min-w-0">
          {/* Row 1 — name + chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-neutral-900 tracking-tight">{contractData.fullName || "—"}</span>
            {jobTitle && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-violet-50 text-violet-700 border-violet-200 uppercase tracking-wide">
                {jobTitle}
              </span>
            )}
            {engLabel && (
              <><span className="text-neutral-300 text-[11px]">·</span>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-neutral-400" />
                <span className="text-[11px] text-neutral-500">{engLabel}</span>
              </div></>
            )}
            {deptLabel && (
              <><span className="text-neutral-300 text-[11px]">·</span>
              <span className="text-[11px] text-neutral-500">{deptLabel}</span></>
            )}
            {rate && (
              <><span className="text-neutral-300 text-[11px]">·</span>
              <span className="text-[11px] font-semibold text-neutral-700">{rate}</span></>
            )}
          </div>

          {/* Row 2 — dates + freq + email */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {dateRange && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="text-[10px] text-neutral-500">{dateRange}</span>
              </div>
            )}
            {dateRange && <span className="text-neutral-300 text-[10px]">·</span>}
            <span className="text-[10px] text-neutral-500">{freq}</span>
            {contractData.email && (
              <><span className="text-neutral-300 text-[10px]">·</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wide">{contractData.email}</span></>
            )}
          </div>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={onToggleEdit}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all shrink-0 ${
          showEdit
            ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-700"
            : "bg-white text-violet-700 border-violet-200 hover:bg-violet-50"
        }`}
      >
        <Edit2 className="w-3 h-3" />
        {showEdit ? "Close Editor" : "Edit Offer"}
      </button>
    </div>
  );
}