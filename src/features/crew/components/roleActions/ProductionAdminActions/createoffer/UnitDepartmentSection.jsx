import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";

export function UnitDepartmentSection({ data, onChange, departments }) {
  const set = (field, value) =>
    onChange({ ...data, [field]: typeof value === "string" ? value.toUpperCase() : value });

  const setExact = (field, value) =>
    onChange({ ...data, [field]: value }); // ← no uppercase, preserves casing for dropdown match

  const departmentItems = departments.map((d) => ({ label: d, value: d }));

  return (
    <div className="space-y-3">
      <EditableTextDataField
        label="Unit"
        icon="Layers"
        value={data.unit ?? ""}
        isEditing
        onChange={(v) => set("unit", v)}
        placeholder="e.g. MAIN UNIT, SECOND UNIT"
      />

      <EditableSelectField
        label="Department"
        icon="Building2"
        placeholder="Select department..."
        value={data.department ?? ""}
        items={departmentItems}
        isEditing
        onChange={(v) => setExact("department", v)} // ✅ exact match required
      />

      <EditableTextDataField
        label="Sub-department"
        icon="GitBranch"
        value={data.subDepartment ?? ""}
        isEditing
        onChange={(v) => set("subDepartment", v)}
        placeholder="e.g. DRONE OPERATOR, STEADICAM, DIT"
      />
    </div>
  );
}