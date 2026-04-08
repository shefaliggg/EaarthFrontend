// sections/EngagementSection.jsx
//
// DatePicker (custom) → EditableDateField (existing)
// BundlePreviewBar stays — it's a pure display component, not a shared field
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableDateField   from "../../../../../../shared/components/wrappers/EditableDateField";
import { BundlePreviewBar } from "../createoffer/FeeStructure/BundlePreviewBar";

const ALT_CONTRACT_ITEMS = [
  { value: "none",        label: "None (standard contract)"                          },
  { value: "hod",         label: "HoD"                                               },
  { value: "no_contract", label: "No contract (all other documents to be processed)" },
  { value: "senior",      label: "Senior agreement"                                  },
];

const DAILY_WEEKLY_ITEMS = [
  { value: "daily",  label: "Daily"  },
  { value: "weekly", label: "Weekly" },
];

const ENGAGEMENT_ITEMS = [
  { value: "loan_out",  label: "LOAN OUT"         },
  { value: "paye",      label: "PAYE"             },
  { value: "schd",      label: "SCHD (DAILY/WEEKLY)" },
  { value: "long_form", label: "LONG FORM"        },
];

const WORKING_WEEK_ITEMS = [
  { value: "5",   label: "5 days"   },
  { value: "5.5", label: "5.5 days" },
  { value: "5_6", label: "5/6 days" },
  { value: "6",   label: "6 days"   },
];

export function EngagementSection({ data, onChange, categoryOptions }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      {/* Alternative contract type */}
      <EditableSelectField
        label="Alternative contract type"
        icon="FileSignature"
        placeholder="None (standard contract)"
        value={data.alternativeContract || "none"}
        items={ALT_CONTRACT_ITEMS}
        isEditing
        onChange={(v) => set("alternativeContract", v === "none" ? "" : v)}
      />

      <div className="border-t border-border/40 my-1" />

      {/* Contract category */}
      <EditableSelectField
        label="Contract category"
        icon="FolderOpen"
        placeholder="Select category..."
        value={data.categoryId ?? ""}
        items={categoryOptions}
        isEditing
        onChange={(v) => set("categoryId", v)}
      />

      {/* Dates */}
      <EditableDateField
        label="Start date"
        icon="CalendarCheck"
        value={data.startDate ?? ""}
        isEditing
        onChange={(v) => set("startDate", v ? v.slice(0, 10) : "")}
        placeholder="Pick start date"
      />

      <EditableDateField
        label="End date (optional)"
        icon="CalendarX"
        value={data.endDate ?? ""}
        isEditing
        onChange={(v) => set("endDate", v ? v.slice(0, 10) : "")}
        placeholder="Pick end date"
      />

      <EditableSelectField
        label="Daily or weekly"
        icon="Clock"
        placeholder="Select..."
        value={data.dailyOrWeekly ?? ""}
        items={DAILY_WEEKLY_ITEMS}
        isEditing
        onChange={(v) => set("dailyOrWeekly", v)}
      />

      <EditableSelectField
        label="Engagement type"
        icon="UserCog"
        placeholder="Select..."
        value={data.engagementType ?? ""}
        items={ENGAGEMENT_ITEMS}
        isEditing
        onChange={(v) => set("engagementType", v)}
      />

      <EditableSelectField
        label="Working week"
        icon="CalendarDays"
        placeholder="Select..."
        value={data.workingWeek ?? ""}
        items={WORKING_WEEK_ITEMS}
        isEditing
        onChange={(v) => set("workingWeek", v)}
      />

      <BundlePreviewBar offer={data} />
    </div>
  );
}