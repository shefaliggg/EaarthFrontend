// ContractForm.jsx — Refactored shell
//
// All field rendering is delegated to section components.
// Section components use ONLY your existing field components:
//   EditableTextDataField, EditableSelectField, EditableRadioField,
//   EditableDateField, EditableCheckboxField, EditablePhoneField
//
// The only "custom" shared pieces still referenced are:
//   AllowanceRow    — complex allowance UI (unchanged from original)
//   BundlePreviewBar — pure display, no inputs
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Printer, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";

import { DEFAULT_DEPARTMENTS, DEFAULT_JOB_TITLES, DEFAULT_SCHEDULE } from "../shared/defaults";
import { getCurrencySymbol } from "../shared/constants";

import { RecipientSection }       from "../createoffer/RecipientSections";
import { UnitDepartmentSection }  from "../createoffer/UnitDepartmentSection";
import { RoleSection }            from "../createoffer/RoleSection";
import { TaxStatusSection }       from "../createoffer/TaxStatusSection";
import { PlaceOfWorkSection }     from "../createoffer/PlaceOfWorkSection";
import { EngagementSection }      from "../createoffer/EngagementSection";
// import { ScheduleSection }        from "../createoffer/ScheduleSection";
import { RatesSection }           from "../createoffer/RatesSection";
import { SalarySection, OvertimeSection } from "../createoffer/SalaryOvertimeSection";
import { AllowancesSection }      from "../createoffer/AllowancesSection";
import { StipulationsSection }    from "../createoffer/StipulationsSection";
import { OtherSection }           from "../createoffer/OtherSection";

// ─────────────────────────────────────────────────────────────────────────────
// Section registry
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  { id: "recipient",     title: "Recipient",            defaultOpen: true  },
  { id: "unitDept",      title: "Unit and Department",  defaultOpen: true  },
  { id: "role",          title: "Role",                 defaultOpen: true  },
  { id: "taxStatus",     title: "Tax Status",           defaultOpen: false },
  { id: "placeOfWork",   title: "Place of Work",        defaultOpen: false },
  { id: "engagement",    title: "Engagement",           defaultOpen: true  },
  // { id: "schedule",      title: "Schedule",             defaultOpen: false },
  { id: "rates",         title: "Rates",                defaultOpen: true  },
  { id: "salary",        title: "Salary",               defaultOpen: true  },
  { id: "overtime",      title: "Overtime",             defaultOpen: true  },
  { id: "allowances",    title: "Allowances",           defaultOpen: true  },
  { id: "stipulations",  title: "Special Stipulations", defaultOpen: false },
  { id: "other",         title: "Other",                defaultOpen: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Presentational wrapper — purely controls open/close chrome
// ─────────────────────────────────────────────────────────────────────────────
function CollapsibleSection({ title, open, onOpenChange, children }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}
      className="border border-border rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <button type="button"
          className="w-full flex items-center justify-between px-3 py-2 bg-accent/10 hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <span className="text-xs font-medium text-foreground">{title}</span>
          </div>
          {open
            ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
            : <ChevronRight className="h-3.5 w-3.5 text-primary" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 py-3 pl-6 space-y-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ContractForm
// ─────────────────────────────────────────────────────────────────────────────
export function ContractForm({
  data, onChange,
  onSave, onPrint,
  onFieldFocus, onFieldBlur,
  calculatedRates,
  salaryBudgetCodes, setSalaryBudgetCodes,
  salaryTags, setSalaryTags,
  overtimeBudgetCodes, setOvertimeBudgetCodes,
  overtimeTags, setOvertimeTags,
  allowances, setAllowances,
  schedule, setSchedule,
  categories    = null,
  departments   = DEFAULT_DEPARTMENTS,
  jobTitles     = DEFAULT_JOB_TITLES,
  categoryTotals = { box: 0, software: 0, equipment: 0 },
}) {
  // Collapse state keyed by section id
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(SECTION_CONFIG.map((s) => [s.id, s.defaultOpen]))
  );
  const toggle = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const cs = getCurrencySymbol(data.currency);

  const categoryOptions = categories
    ? categories.map((c) => ({ value: c._id, label: c.name }))
    : [
        { value: "standard_crew",  label: "Standard Crew"   },
        { value: "senior_buyout",  label: "Senior / Buyout" },
        { value: "construction",   label: "Construction"    },
        { value: "electrical",     label: "Electrical"      },
        { value: "hod",            label: "HOD"             },
        { value: "rigging",        label: "Rigging"         },
        { value: "transport",      label: "Transport"       },
      ];

  const sched = schedule || DEFAULT_SCHEDULE;

  // Shared props passed to every section that modifies `data`
  const shared = { data, onChange, onFieldFocus, onFieldBlur };

  // ── Switch — one case per section, zero logic ─────────────────────────────
  function renderSection(id) {
    switch (id) {

      case "recipient":
        return <RecipientSection {...shared} />;

      case "unitDept":
        return <UnitDepartmentSection {...shared} departments={departments} />;

      case "role":
        return <RoleSection {...shared} jobTitles={jobTitles} />;

      case "taxStatus":
        return <TaxStatusSection {...shared} />;

      case "placeOfWork":
        return <PlaceOfWorkSection {...shared} />;

      case "engagement":
        return <EngagementSection {...shared} categoryOptions={categoryOptions} />;

      // case "schedule":
        // return <ScheduleSection schedule={sched} setSchedule={setSchedule} onFieldFocus={onFieldFocus} onFieldBlur={onFieldBlur} />;//

      case "rates":
        return <RatesSection {...shared} currencySymbol={cs} />;

      case "salary":
        return (
          <SalarySection
            calculatedRates={calculatedRates}
            salaryBudgetCodes={salaryBudgetCodes}   setSalaryBudgetCodes={setSalaryBudgetCodes}
            salaryTags={salaryTags}                  setSalaryTags={setSalaryTags}
            onFieldFocus={onFieldFocus}              onFieldBlur={onFieldBlur}
            currencySymbol={cs}
          />
        );

      case "overtime":
        return (
          <OvertimeSection
            calculatedRates={calculatedRates}
            overtimeBudgetCodes={overtimeBudgetCodes} setOvertimeBudgetCodes={setOvertimeBudgetCodes}
            overtimeTags={overtimeTags}               setOvertimeTags={setOvertimeTags}
            onFieldFocus={onFieldFocus}               onFieldBlur={onFieldBlur}
            currencySymbol={cs}
          />
        );

      case "allowances":
        return (
          <AllowancesSection
            allowances={allowances}           setAllowances={setAllowances}
            onFieldFocus={onFieldFocus}        onFieldBlur={onFieldBlur}
            currencySymbol={cs}               categoryTotals={categoryTotals}
          />
        );

      case "stipulations":
        return <StipulationsSection {...shared} />;

      case "other":
        return <OtherSection {...shared} />;

      default:
        return null;
    }
  }

  return (
    <div className="py-0">
      <div className="space-y-2">
        {SECTION_CONFIG.map(({ id, title }) => (
          <CollapsibleSection
            key={id}
            title={title}
            open={openSections[id]}
            onOpenChange={() => toggle(id)}
          >
            {renderSection(id)}
          </CollapsibleSection>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} className="flex-1 text-sm">Save Offer</Button>
        <Button onClick={onPrint} variant="outline"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
      </div>
    </div>
  );
}