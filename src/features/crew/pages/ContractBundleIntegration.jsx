/**
 * ContractBundleIntegration.jsx
 *
 * DROP-IN ADDITIONS to wire contract bundles into the existing workflow:
 *
 * 1. CategorySelector  — add this field to ContractForm.jsx (Engagement section)
 *                        It lets the user pick "Standard Crew", "HOD", etc.
 *                        The choice is stored as offer.category and used to
 *                        resolve the correct bundle.
 *
 * 2. BundlePreviewBar  — shows the resolved bundle name + badge in CreateOffer
 *                        layout (right panel, above the contract document).
 *
 * 3. Layout2_BundleSection — drop into Layout2_ProductionReview to replace the
 *                        "Submitted Documents" panel with the resolved bundle forms.
 *
 * ─── How bundle resolution works ──────────────────────────────────────────────
 *
 *   offer.dailyOrWeekly  ("daily"  | "weekly")   → freq
 *   offer.engagementType ("paye"   | "loan_out" | "schd" | "long_form") → payFamily
 *   offer.category       ("Standard Crew" | "HOD" | …)  → category
 *
 *   Bundle key = `${freq} ${payFamily} ${category}`
 *   Looks up BUNDLE_FORMS_MAP[payFamily].contractForms + SHARED_ALLOWANCE_FORMS
 *
 * ─── Usage in ContractForm.jsx ────────────────────────────────────────────────
 *
 *   // In the Engagement CollapsibleSection, add after "Engagement type":
 *   import { CategorySelector } from "./ContractBundleIntegration";
 *   ...
 *   <div className="space-y-1.5">
 *     <Label className="text-xs text-foreground/80">Category</Label>
 *     <CategorySelector
 *       value={data.category ?? ""}
 *       onChange={(v) => set("category", v)}
 *     />
 *   </div>
 *
 * ─── Usage in CreateOfferLayout.jsx ───────────────────────────────────────────
 *
 *   import { BundlePreviewBar } from "./ContractBundleIntegration";
 *   ...
 *   // Above the ContractDocument render:
 *   <BundlePreviewBar data={data} />
 *
 * ─── Usage in ViewOffer.jsx (Layout2_ProductionReview) ────────────────────────
 *
 *   import { Layout2_BundleSection } from "./ContractBundleIntegration";
 *   ...
 *   // Replace or augment the "Submitted Documents" block inside Layout2:
 *   <Layout2_BundleSection offer={offer} contractData={contractData} />
 */

import { useState } from "react";
import {
  FileText, Layers, Package, ChevronDown, ChevronRight,
  CheckCircle2, AlertCircle, Shield, BadgeCheck, Building,
  Car, Monitor, Tag,
} from "lucide-react";

// ─── Re-use bundle data (mirrors ContractSettingsPage.jsx) ────────────────────

const CATEGORIES = [
  "Standard Crew",
  "Senior / Buyout",
  "Construction",
  "Electrical",
  "HOD",
  "Rigging",
  "Transport",
];

const ENGAGEMENT_TO_PAY = {
  paye:      "PAYE",
  loan_out:  "Loan Out",
  schd:      "Self Employed",
  long_form: "PAYE",
};

const PAY_COMBO_BADGE = {
  "Daily-PAYE":          { badge: "DAILY PAYE",  color: "#6d28d9", bg: "#ede9fe" },
  "Daily-Loan Out":      { badge: "DAILY LO",    color: "#92400e", bg: "#fef3c7" },
  "Daily-Self Employed": { badge: "DAILY SE",    color: "#0369a1", bg: "#e0f2fe" },
  "Weekly-PAYE":         { badge: "WEEKLY PAYE", color: "#6d28d9", bg: "#ede9fe" },
  "Weekly-Loan Out":     { badge: "WEEKLY LO",   color: "#92400e", bg: "#fef3c7" },
  "Weekly-Self Employed":{ badge: "WEEKLY SE",   color: "#0369a1", bg: "#e0f2fe" },
};

const SHARED_ALLOWANCE_FORMS = [
  { key: "box_rental",             name: "Box Rental",             displayType: "allowance" },
  { key: "computer_allowance",     name: "Computer Allowance",     displayType: "allowance" },
  { key: "crew_information_form",  name: "Crew Information Form",  displayType: "standard"  },
  { key: "mobile_allowance",       name: "Mobile Allowance",       displayType: "allowance" },
  { key: "start_form",             name: "Start Form",             displayType: "standard"  },
  { key: "nda_confidentiality",    name: "NDA / Confidentiality",  displayType: "optional"  },
  { key: "policy_acknowledgement", name: "Policy Acknowledgement", displayType: "standard"  },
];

const BUNDLE_FORMS_MAP = {
  PAYE: [
    { key: "paye_contract",          name: "PAYE Contract",           displayType: "contract"  },
    { key: "policy_acknowledgement", name: "Policy Acknowledgement",  displayType: "standard"  },
    { key: "crew_information_form",  name: "Crew Information Form",   displayType: "standard"  },
    { key: "start_form",             name: "Start Form",              displayType: "standard"  },
    { key: "p46",                    name: "P45 / P46",               displayType: "tax",      optional: true },
  ],
  "Loan Out": [
    { key: "loan_out_agreement",       name: "Loan Out Agreement",       displayType: "contract"  },
    { key: "certificate_of_insurance", name: "Certificate of Insurance", displayType: "standard"  },
    { key: "company_details",          name: "Company Details Form",     displayType: "standard"  },
    { key: "nda_confidentiality",      name: "NDA / Confidentiality",    displayType: "optional", optional: true },
  ],
  "Self Employed": [
    { key: "self_employed_contract",      name: "Self-Employed Contract",      displayType: "contract"  },
    { key: "self_assessment_declaration", name: "Self-Assessment Declaration", displayType: "standard"  },
    { key: "certificate_of_insurance",    name: "Certificate of Insurance",    displayType: "standard"  },
    { key: "nda_confidentiality",         name: "NDA / Confidentiality",       displayType: "optional", optional: true },
  ],
};

const TYPE_STYLE = {
  contract:  { bg: "#fef3c7", color: "#92400e" },
  allowance: { bg: "#dbeafe", color: "#1e40af" },
  standard:  { bg: "#dcfce7", color: "#166534" },
  optional:  { bg: "#f3e8ff", color: "#6b21a8" },
  tax:       { bg: "#fce7f3", color: "#9d174d" },
};

function resolveBundle(offer) {
  const freq      = (offer?.dailyOrWeekly || offer?.feeFrequency) === "weekly" ? "Weekly" : "Daily";
  const payFamily = ENGAGEMENT_TO_PAY[offer?.engagementType] || "PAYE";
  const category  = offer?.category || "Standard Crew";
  const comboKey  = `${freq}-${payFamily}`;
  const combo     = PAY_COMBO_BADGE[comboKey];

  return {
    bundleName:     `${freq} ${payFamily} ${category}`,
    badge:          combo?.badge   || `${freq.toUpperCase()} PAYE`,
    badgeColor:     combo?.color   || "#6d28d9",
    badgeBg:        combo?.bg      || "#ede9fe",
    freq,
    payFamily,
    category,
    contractForms:  BUNDLE_FORMS_MAP[payFamily] || BUNDLE_FORMS_MAP["PAYE"],
    allowanceForms: SHARED_ALLOWANCE_FORMS,
  };
}

// ─── shadcn-compatible Select wrapper (uses existing ST/SC/SI classes) ─────────

const ST = "w-full h-9 bg-input border-border hover:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm";

// ── 1. CategorySelector ──────────────────────────────────────────────────────
/**
 * Drop into ContractForm.jsx Engagement section.
 * Props: value, onChange
 */
export function CategorySelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 rounded-md px-3 text-sm bg-background border border-input hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
    >
      <option value="">Select category…</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}

// ── 2. BundlePreviewBar ───────────────────────────────────────────────────────
/**
 * Shows resolved bundle name above the contract document preview in CreateOfferLayout.
 * Props: data (contractData)
 */
export function BundlePreviewBar({ data }) {
  const bundle = resolveBundle(data);
  if (!data?.engagementType) return null;

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-violet-50 border border-violet-200 mb-2">
      <div className="flex items-center gap-2">
        <Package className="h-3.5 w-3.5 text-violet-500 shrink-0" />
        <span className="text-[10px] font-semibold text-violet-700">
          Bundle: <span className="font-bold">{bundle.bundleName}</span>
        </span>
      </div>
      <span
        className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded"
        style={{ background: bundle.badgeBg, color: bundle.badgeColor }}
      >
        {bundle.badge}
      </span>
    </div>
  );
}

// ── 3. Layout2_BundleSection ─────────────────────────────────────────────────
/**
 * Full bundle section for Production Review (Layout2_ProductionReview).
 * Shows:
 *   - Resolved bundle name + badge
 *   - Allowance forms panel
 *   - Contract forms panel
 *   - Optional forms (greyed out)
 *
 * Props: offer (the raw offer from backend), contractData
 */
export function Layout2_BundleSection({ offer, contractData }) {
  const [open, setOpen] = useState(true);
  const bundle = resolveBundle(contractData || offer);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-500" />
          <span className="text-[13px] font-semibold text-neutral-800">Contract Bundle</span>
          {/* Resolved badge inline */}
          <span
            className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded ml-1"
            style={{ background: bundle.badgeBg, color: bundle.badgeColor }}
          >
            {bundle.badge}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-400">
            {bundle.contractForms.length + bundle.allowanceForms.length} forms
          </span>
          {open
            ? <ChevronDown className="h-4 w-4 text-neutral-400" />
            : <ChevronRight className="h-4 w-4 text-neutral-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-neutral-100">
          {/* Bundle name strip */}
          <div className="px-5 py-2 bg-neutral-50 border-b border-neutral-100">
            <p className="text-[10px] text-neutral-500">
              Resolved bundle:{" "}
              <span className="font-semibold text-neutral-700">{bundle.bundleName}</span>
              <span className="ml-2 text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded">
                ACTIVE
              </span>
            </p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            {/* Left: Allowance / default forms */}
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Package className="h-2.5 w-2.5" /> Allowance Forms
              </p>
              <div className="space-y-1">
                {bundle.allowanceForms.map((f) => {
                  const s = TYPE_STYLE[f.displayType] || TYPE_STYLE.standard;
                  return (
                    <div key={f.key}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-100 bg-neutral-50">
                      <FileText className="w-2.5 h-2.5 text-neutral-300 shrink-0" />
                      <span className="text-[10px] text-neutral-600 flex-1 truncate">{f.name}</span>
                      <span
                        className="text-[7px] font-bold px-1.5 py-px rounded-full shrink-0"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {f.displayType.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Contract forms */}
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <FileText className="h-2.5 w-2.5" /> Contract Forms
              </p>
              <div className="space-y-1">
                {bundle.contractForms.map((f) => {
                  const s = TYPE_STYLE[f.displayType] || TYPE_STYLE.standard;
                  return (
                    <div key={f.key}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
                        f.optional ? "border-dashed border-neutral-200 opacity-60" : "border-neutral-100 bg-neutral-50"
                      }`}>
                      <FileText className="w-2.5 h-2.5 text-neutral-300 shrink-0" />
                      <span className="text-[10px] text-neutral-600 flex-1 truncate">{f.name}</span>
                      {f.optional && (
                        <span className="text-[7px] text-neutral-400 shrink-0">OPT</span>
                      )}
                      <span
                        className="text-[7px] font-bold px-1.5 py-px rounded-full shrink-0"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {f.displayType.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── How to wire into ViewOffer.jsx Layout2_ProductionReview ──────────────────
/**
 *  In ViewOffer.jsx, import at top:
 *    import { Layout2_BundleSection } from "./ContractBundleIntegration";
 *
 *  Inside Layout2_ProductionReview, replace or add after the
 *  "Submitted Documents" block:
 *
 *    <Layout2_BundleSection offer={offer} contractData={contractData} />
 *
 *  That's it — it reads offer.engagementType + offer.dailyOrWeekly + offer.category
 *  to resolve the correct bundle and shows all its forms.
 */