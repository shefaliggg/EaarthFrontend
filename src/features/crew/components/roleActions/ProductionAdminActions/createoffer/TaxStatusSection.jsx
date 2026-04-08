// sections/TaxStatusSection.jsx
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableRadioField from "../../../../../../shared/components/wrappers/EditableRadioField";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";

const SE_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No",  value: "no"  },
];

const DETERMINATION_ITEMS = [
  { value: "hmrc_list", label: "Job title appears on HMRC list of 'Roles normally treated as self-employed'" },
  { value: "cest",      label: "CEST assessment confirmed 'Off-payroll working rules (IR35) do not apply'" },
  { value: "lorimer",   label: "You have supplied a valid Lorimer letter" },
  { value: "other",     label: "Other" },
];

export function TaxStatusSection({ data, onChange }) {
  const taxStatus = data.taxStatus || {};

  const setTaxStatus = (field, value) =>
    onChange({ ...data, taxStatus: { ...taxStatus, [field]: value } });

  return (
    <div className="space-y-3">
      <EditableRadioField
        label="Allow as self-employed or loan out?"
        icon="ShieldCheck"
        value={taxStatus.allowSelfEmployed ?? ""}
        options={SE_OPTIONS}
        isEditing
        onChange={(v) => setTaxStatus("allowSelfEmployed", v)}
      />

      <EditableSelectField
        label="Status determination reason"
        icon="ClipboardList"
        placeholder="Select..."
        value={taxStatus.statusDeterminationReason ?? ""}
        items={DETERMINATION_ITEMS}
        isEditing
        onChange={(v) => setTaxStatus("statusDeterminationReason", v)}
      />

      {taxStatus.statusDeterminationReason === "other" && (
        <EditableTextDataField
          label="Other reason"
          icon="FileQuestion"
          value={taxStatus.otherStatusDeterminationReason ?? ""}
          isEditing
          onChange={(v) => setTaxStatus("otherStatusDeterminationReason", v.toUpperCase())}
          placeholder="Describe reason..."
        />
      )}
    </div>
  );
}