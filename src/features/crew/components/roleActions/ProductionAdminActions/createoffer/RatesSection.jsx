// sections/RatesSection.jsx
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableRadioField from "../../../../../../shared/components/wrappers/EditableRadioField";

const CURRENCY_ITEMS = ["AUD", "CAD", "DKK", "EUR", "GBP", "ISK", "NZD", "USD"].map((c) => ({
  value: c, label: c,
}));

const OVERTIME_OPTIONS = [
  { value: "calculated", label: "Calculated per agreement" },
  { value: "custom",     label: "Custom overtime rates"    },
];

const CUSTOM_OT_FIELDS = [
  { id: "otherOT",      label: "Other O/T"          },
  { id: "cameraOTSWD",  label: "Camera O/T (SWD)"   },
  { id: "cameraOTSCWD", label: "Camera O/T (SCWD)"  },
  { id: "cameraOTCWD",  label: "Camera O/T (CWD)"   },
];

export function RatesSection({ data, onChange, currencySymbol: cs }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      <EditableSelectField
        label="Currency"
        icon="DollarSign"
        placeholder="Select..."
        value={data.currency ?? "GBP"}
        items={CURRENCY_ITEMS}
        isEditing
        onChange={(v) => set("currency", v)}
      />

      <EditableTextDataField
        label={`Fee per day including holiday (${cs})`}
        icon="Banknote"
        type="number"
        value={data.feePerDay ?? ""}
        isEditing
        onChange={(v) => set("feePerDay", v)}
        placeholder="0.00"
      />

      <EditableTextDataField
        label="Standard working hours / day"
        icon="Timer"
        type="number"
        value={String(data.workingHours ?? 11)}
        isEditing
        onChange={(v) => set("workingHours", Number(v))}
        placeholder="11"
      />

      <EditableRadioField
        label="Overtime"
        icon="TrendingUp"
        value={data.overtime ?? "calculated"}
        options={OVERTIME_OPTIONS}
        isEditing
        onChange={(v) => set("overtime", v)}
      />

      {data.overtime === "custom" && (
        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
          {CUSTOM_OT_FIELDS.map(({ id, label }) => (
            <EditableTextDataField
              key={id}
              label={`${label} (${cs})`}
              icon="Hash"
              type="number"
              value={data[id] ?? ""}
              isEditing
              onChange={(v) => set(id, v)}
              placeholder="0.00"
            />
          ))}
        </div>
      )}
    </div>
  );
}