// sections/PlaceOfWorkSection.jsx
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableRadioField from "../../../../../../shared/components/wrappers/EditableRadioField";

const SITE_ITEMS = [
  { value: "on_set",  label: "On set"  },
  { value: "off_set", label: "Off set" },
];

const UK_OPTIONS = [
  { label: "Yes",   value: "yes"   },
  { label: "Never", value: "never" },
];

export function PlaceOfWorkSection({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      <EditableSelectField
        label="Regular site of work (on Shoot days)"
        icon="MapPin"
        placeholder="Select..."
        value={data.regularSiteOfWork ?? ""}
        items={SITE_ITEMS}
        isEditing
        onChange={(v) => set("regularSiteOfWork", v)}
      />

      <EditableRadioField
        label="Working in the UK?"
        icon="Globe"
        value={data.workingInUK ?? ""}
        options={UK_OPTIONS}
        isEditing
        onChange={(v) => set("workingInUK", v)}
      />
    </div>
  );
}