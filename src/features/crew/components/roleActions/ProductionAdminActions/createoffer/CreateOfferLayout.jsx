import { useState } from "react";
import { format, parseISO, isValid, eachDayOfInterval } from "date-fns";
import { OfferHeader } from "./OfferHeader";
import { RecipientSection } from "./RecipientSection";
import { OfferDetailsSection } from "./OfferDetailsSection";
import { ContractTermsSection } from "./ContractTermsSection";
import { SalaryTable } from "./FeeStructure/SalaryTable";
import { OvertimeTable } from "./FeeStructure/OvertimeTable";
import { AllowancesGrid } from "./FeeStructure/AllowancesGrid";
import { ApprovalHistory } from "./ApprovalHistory";
import { HighlightField } from "../shared/HighlightField";

const allowanceLabelMap = [
  { key: "boxRental",  label: "Box Rental"  },
  { key: "computer",   label: "Computer"    },
  { key: "software",   label: "Software"    },
  { key: "equipment",  label: "Equipment"   },
  { key: "vehicle",    label: "Vehicle"     },
  { key: "mobile",     label: "Mobile"      },
  { key: "living",     label: "Living"      },
  { key: "perDiem1",   label: "Per Diem 1"  },
  { key: "perDiem2",   label: "Per Diem 2"  },
  { key: "breakfast",  label: "Breakfast"   },
  { key: "lunch",      label: "Lunch"       },
  { key: "dinner",     label: "Dinner"      },
  { key: "fuel",       label: "Fuel"        },
  { key: "mileage",    label: "Mileage"     },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(val) {
  if (!val) return null;
  const d = parseISO(val);
  return isValid(d) ? format(d, "dd MMM yyyy").toUpperCase() : null;
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  const s = parseISO(start), e = parseISO(end);
  if (!isValid(s) || !isValid(e) || e < s) return null;
  return eachDayOfInterval({ start: s, end: e }).length;
}

function chunkBy(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// ── Compact date row used inside cards ────────────────────────────────────
function DateLine({ label, start, end, notes, dotColor = "bg-purple-400" }) {
  const s    = fmtDate(start);
  const e    = fmtDate(end);
  const days = daysBetween(start, end);
  if (!s && !e && !notes) return null;
  return (
    <div className="flex items-center gap-1.5 py-[2px] min-w-0">
      <div className={`w-1 h-1 rounded-full shrink-0 ${dotColor}`} />
      <span className="text-[9px] font-semibold uppercase tracking-wider text-purple-500 shrink-0 w-[46px]">
        {label}
      </span>
      {(s || e) && (
        <span className="text-[10px] font-mono text-purple-900 shrink-0">
          {s || "—"}&nbsp;→&nbsp;{e || "—"}
        </span>
      )}
      {days != null && (
        <span className="text-[9px] text-purple-400 shrink-0">({days}d)</span>
      )}
      {notes && (
        <span className="text-[9px] text-purple-400 italic truncate ml-1">{notes}</span>
      )}
    </div>
  );
}

// ── Pre-Prep full-width row ────────────────────────────────────────────────
function PrePrepRow({ prePrep }) {
  const s    = fmtDate(prePrep?.start);
  const e    = fmtDate(prePrep?.end);
  const days = daysBetween(prePrep?.start, prePrep?.end);
  if (!s && !e) return null;
  return (
    <div className="flex items-center gap-2 py-[3px] border-b border-purple-100/60 pb-1.5">
      <div className="w-[3px] h-3 bg-purple-300 rounded-full shrink-0" />
      <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider shrink-0 w-[56px]">
        Pre-Prep
      </span>
      <span className="text-[10px] font-mono text-purple-900">
        {s || "—"}&nbsp;→&nbsp;{e || "—"}
      </span>
      {days != null && (
        <span className="text-[9px] text-purple-400">({days} days)</span>
      )}
      {prePrep?.notes && (
        <span className="text-[9px] text-purple-400 italic truncate ml-1">{prePrep.notes}</span>
      )}
    </div>
  );
}

// ── Wrap full-width row ────────────────────────────────────────────────────
function WrapRow({ wrap }) {
  const s    = fmtDate(wrap?.start);
  const e    = fmtDate(wrap?.end);
  const days = daysBetween(wrap?.start, wrap?.end);
  if (!s && !e) return null;
  return (
    <div className="flex items-center gap-2 py-[3px] border-t border-purple-100/60 pt-1.5">
      <div className="w-[3px] h-3 bg-purple-400 rounded-full shrink-0" />
      <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider shrink-0 w-[56px]">
        Wrap
      </span>
      <span className="text-[10px] font-mono text-purple-900">
        {s || "—"}&nbsp;→&nbsp;{e || "—"}
      </span>
      {days != null && (
        <span className="text-[9px] text-purple-400">({days} days)</span>
      )}
      {wrap?.notes && (
        <span className="text-[9px] text-purple-400 italic truncate ml-1">{wrap.notes}</span>
      )}
    </div>
  );
}

// ── Block card ─────────────────────────────────────────────────────────────
function BlockCard({ block, index }) {
  const hasPrepDates  = block.prep?.start || block.prep?.end;
  const hasBlockDates = block.start || block.end;
  if (!hasPrepDates && !hasBlockDates) return null;
  const bDays = daysBetween(block.start, block.end);
  return (
    <div className="border border-purple-200/70 rounded-md overflow-hidden min-w-0">
      {/* block header */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-600/10 border-b border-purple-200/50">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
        <span className="text-[9px] font-bold text-purple-800 uppercase tracking-wider">
          {block.name || `Block ${index + 1}`}
        </span>
        {bDays != null && (
          <span className="text-[9px] text-purple-500 font-mono ml-auto">
            {bDays} days
          </span>
        )}
      </div>
      {/* prep + shoot rows */}
      <div className="px-2 py-1 space-y-0 bg-white/50">
        {hasPrepDates && (
          <DateLine
            label="Prep"
            start={block.prep?.start}
            end={block.prep?.end}
            notes={block.prep?.notes}
            dotColor="bg-purple-300"
          />
        )}
        {hasBlockDates && (
          <DateLine
            label="Shoot"
            start={block.start}
            end={block.end}
            notes={block.notes}
            dotColor="bg-purple-600"
          />
        )}
      </div>
    </div>
  );
}

// ── Suspension of Services card (was: Hiatus) ─────────────────────────────
// Real contract language: "Suspension of Services" or "Production Hiatus"
function SuspensionCard({ h, index, total }) {
  const days = daysBetween(h.start, h.end);
  if (!h.start && !h.end && !h.reason) return null;
  const s = fmtDate(h.start);
  const e = fmtDate(h.end);
  return (
    <div className="border border-purple-200/60 rounded-md overflow-hidden min-w-0">
      {/* header */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100/50 border-b border-purple-200/40">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
        <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">
          {total > 1 ? `Hiatus ${index + 1}` : "Production Hiatus"}
        </span>
        {days != null && (
          <span className="text-[9px] text-purple-400 font-mono ml-auto">{days} days</span>
        )}
      </div>
      {/* dates + reason */}
      <div className="px-2 py-1 bg-white/50 space-y-0.5">
        {(s || e) && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-purple-300 shrink-0" />
            <span className="text-[10px] font-mono text-purple-900">
              {s || "—"}&nbsp;→&nbsp;{e || "—"}
            </span>
          </div>
        )}
        {h.reason && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-transparent shrink-0" />
            <span className="text-[9px] text-purple-500 font-medium uppercase tracking-wide">
              {h.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Schedule Preview ───────────────────────────────────────────────────────
function SchedulePreview({ schedule }) {
  if (!schedule) return null;

  const {
    workingHours,
    hiatus  = [],
    prePrep = {},
    blocks  = [],
    wrap    = {},
    totalDays,
  } = schedule;

  const hasPrePrep   = prePrep?.start || prePrep?.end;
  const hasWrap      = wrap?.start    || wrap?.end;
  const activeHiatus = hiatus.filter((h) => h.start || h.end || h.reason);
  const activeBlocks = blocks
    .map((b, i) => ({ block: b, index: i }))
    .filter(({ block: b }) => b.start || b.end || b.prep?.start || b.prep?.end);

  const hasAny = hasPrePrep || hasWrap || activeHiatus.length || activeBlocks.length || totalDays > 0;
  if (!hasAny) return null;

  const blockRows      = chunkBy(activeBlocks, 2);
  const suspensionRows = chunkBy(
    activeHiatus.map((h, i) => ({ h, index: i })),
    2
  );

  return (
    <div className="rounded-lg border border-purple-200/60 bg-white/60 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-purple-50/80 border-b border-purple-200/40">
        <div className="flex items-center gap-2">
          <div className="w-[3px] h-3.5 bg-purple-600 rounded-full" />
          <span className="text-[10px] font-bold text-purple-900 tracking-wide uppercase">
            Engagement Schedule
          </span>
          {workingHours && (
            <span className="text-[9px] text-purple-400 font-mono">
              · {workingHours} hrs/day
            </span>
          )}
        </div>
        {totalDays > 0 && (
          <span className="text-[9px] font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded-full">
            {totalDays} working days
          </span>
        )}
      </div>

      <div className="px-3 py-1.5 space-y-1.5">

        {/* Pre-Prep */}
        {hasPrePrep && <PrePrepRow prePrep={prePrep} />}

        {/* Work Blocks */}
        {activeBlocks.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">
              Production Periods
            </span>
            {blockRows.map((row, ri) => (
              <div key={ri} className={`grid gap-1.5 ${row.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                {row.map(({ block, index }) => (
                  <BlockCard key={index} block={block} index={index} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Wrap */}
        {hasWrap && <WrapRow wrap={wrap} />}

        {/* Suspension of Services / Hiatus */}
        {activeHiatus.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">
              Suspension of Services
            </span>
            {suspensionRows.map((row, ri) => (
              <div key={ri} className={`grid gap-1.5 ${row.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                {row.map(({ h, index }) => (
                  <SuspensionCard key={index} h={h} index={index} total={activeHiatus.length} />
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Main layout ────────────────────────────────────────────────────────────
export function CreateOfferLayout({
  data,
  activeField,
  onFieldClick,
  onFieldFocus,
  onFieldBlur,
  calculatedRates,
  engineSettings,
  salaryBudgetCodes,
  setSalaryBudgetCodes,
  salaryTags,
  setSalaryTags,
  overtimeBudgetCodes,
  setOvertimeBudgetCodes,
  overtimeTags,
  setOvertimeTags,
  allowances,
  projectSettings = null,
  offer = null,
  initialOfferCollapsed = false,
  isDocumentLocked = false,
  hideContractDocument = false,
  hideOfferSections = false,
  signatures = {},
  activeSigningRole = null,
  onSignatureClick,
  schedule = null,
}) {
  const [offerCollapsed, setOfferCollapsed] = useState(initialOfferCollapsed);

  const getCurrencySymbol = () => {
    const map = { GBP:"£", USD:"$", EUR:"€", AUD:"A$", CAD:"C$", NZD:"NZ$", DKK:"kr", ISK:"kr" };
    return map[data.currency] || "£";
  };
  const cs = getCurrencySymbol();

  const enabledAllowances = allowanceLabelMap.filter((a) => allowances[a.key]?.enabled);
  const notes           = data.notes || {};
  const otherDeal       = notes.otherDealProvisions || data.otherDealProvisions || "";
  const additionalNotes = notes.additionalNotes     || data.additionalNotes     || "";
  const resolvedSchedule = schedule || offer?.schedule || null;

  return (
    <div className="bg-purple-50/30 uppercase">
      {!hideOfferSections && (
        <OfferHeader
          data={data}
          offer={offer}
          offerCollapsed={offerCollapsed}
          onToggleCollapse={() => setOfferCollapsed((p) => !p)}
        />
      )}

      <div className="px-3 py-2.5 space-y-2">
        {!offerCollapsed && !hideOfferSections && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <RecipientSection data={data} activeField={activeField} onFieldClick={onFieldClick} />
              <OfferDetailsSection data={data} activeField={activeField} onFieldClick={onFieldClick} />
            </div>

            <ContractTermsSection
              data={data}
              activeField={activeField}
              onFieldClick={onFieldClick}
              engineSettings={engineSettings}
            />

            <SchedulePreview schedule={resolvedSchedule} />

            {(otherDeal || additionalNotes) && (
              <div className="grid grid-cols-2 gap-2">
                {otherDeal && (
                  <div className="bg-purple-50/60 rounded-lg border border-purple-200/60 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-[2px] h-3 bg-purple-400 rounded-full" />
                      <p className="text-[10px] font-semibold text-purple-800 tracking-wide uppercase">
                        Other Deal Provisions
                      </p>
                    </div>
                    <HighlightField
                      fieldName="notes.otherDealProvisions"
                      active={activeField === "notes.otherDealProvisions" || activeField === "otherDealProvisions"}
                      onClick={onFieldClick}
                    >
                      <p className="text-[10px] text-neutral-700 leading-snug">{otherDeal}</p>
                    </HighlightField>
                  </div>
                )}
                {additionalNotes && (
                  <div className="bg-purple-50/60 rounded-lg border border-purple-200/60 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-[2px] h-3 bg-purple-400 rounded-full" />
                      <p className="text-[10px] font-semibold text-purple-800 tracking-wide uppercase">
                        Internal Notes
                      </p>
                    </div>
                    <HighlightField
                      fieldName="notes.additionalNotes"
                      active={activeField === "notes.additionalNotes" || activeField === "additionalNotes"}
                      onClick={onFieldClick}
                    >
                      <p className="text-[10px] text-neutral-600 leading-snug">{additionalNotes}</p>
                    </HighlightField>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-[3px] h-4 bg-purple-600 rounded-full" />
                  <h3 className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">
                    Fee Structure
                  </h3>
                </div>
                <span className="text-[9px] text-neutral-400 font-medium">
                  Base {cs}{data.feePerDay || "0.00"}/day ·{" "}
                  {(engineSettings.holidayUplift * 100).toFixed(2)}% holiday ·{" "}
                  {engineSettings.agreementMode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 items-start">
                <SalaryTable
                  calculatedRates={calculatedRates}
                  salaryBudgetCodes={salaryBudgetCodes}
                  setSalaryBudgetCodes={setSalaryBudgetCodes}
                  salaryTags={salaryTags}
                  setSalaryTags={setSalaryTags}
                  activeField={activeField}
                  onFieldFocus={onFieldFocus}
                  onFieldBlur={onFieldBlur}
                  currencySymbol={cs}
                />
                <OvertimeTable
                  calculatedRates={calculatedRates}
                  overtimeBudgetCodes={overtimeBudgetCodes}
                  setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                  overtimeTags={overtimeTags}
                  setOvertimeTags={setOvertimeTags}
                  activeField={activeField}
                  onFieldFocus={onFieldFocus}
                  onFieldBlur={onFieldBlur}
                  currencySymbol={cs}
                  overtimeMode={data.overtime}
                />
              </div>
              <AllowancesGrid
                enabledAllowances={enabledAllowances}
                allowances={allowances}
                activeField={activeField}
                currencySymbol={cs}
              />
            </div>
            {/* ── Special Stipulations Preview ── */}
{Array.isArray(data.specialStipulations) && 
 data.specialStipulations.filter(s => s.body?.trim()).length > 0 && (
  <div className="space-y-1.5">
    {/* Section label */}
    <div className="flex items-center gap-2 mb-1">
      <div className="w-[3px] h-3.5 bg-purple-600 rounded-full" />
      <span className="text-[10px] font-bold text-purple-900 tracking-wide uppercase">
        Special Stipulations
      </span>
    </div>

    {data.specialStipulations.filter(s => s.body?.trim()).map((s, i) => (
      <div
        key={i}
        className="flex gap-2.5 bg-white border border-purple-100 rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(88,28,135,0.06)]"
      >
        {/* Left: numbered badge column */}
        <div className="flex flex-col items-center pt-2.5 pl-2.5 shrink-0">
          <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white leading-none">
              {i + 1}
            </span>
          </div>
          {/* vertical connector line if not last */}
          {i < data.specialStipulations.filter(s => s.body?.trim()).length - 1 && (
            <div className="w-[1px] flex-1 bg-purple-100 mt-1 mb-0 min-h-[8px]" />
          )}
        </div>

        {/* Right: content */}
        <div className="flex-1 py-2 pr-3 min-w-0">
          {/* Title row */}
          <p className="text-[9px] font-bold text-purple-700 uppercase tracking-widest mb-0.5">
            {s.title?.trim() ? s.title : "CONTRACT TERMS"}
          </p>
          {/* Body text — dense legal style matching the screenshot */}
          <p className="text-[9.5px] text-neutral-600 leading-[1.5] whitespace-pre-wrap break-words">
            {s.body}
          </p>
        </div>
      </div>
    ))}


  </div>
)}

            <ApprovalHistory offer={offer} />
          </>
        )}
      </div>
    </div>
  );
}