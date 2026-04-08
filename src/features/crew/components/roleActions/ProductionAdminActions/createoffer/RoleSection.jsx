import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../../../../shared/components/wrappers/EditableCheckboxField";

export function RoleSection({ data, onChange, jobTitles }) {
  // ✅ separate setter — jobTitle must NOT be uppercased (must match items value exactly)
  const set = (field, value) =>
    onChange({ ...data, [field]: typeof value === "string" ? value.toUpperCase() : value });

  const setExact = (field, value) =>
    onChange({ ...data, [field]: value }); // ← no transform, preserves original casing

  const jobTitleItems = jobTitles.map((t) => ({ label: t, value: t }));

  return (
    <div className="space-y-3">
      <EditableSelectField
        label="Job title"
        icon="Briefcase"
        placeholder="Search job titles..."
        value={data.jobTitle ?? ""}
        items={jobTitleItems}
        isEditing
        onChange={(v) => setExact("jobTitle", v)} // ✅ use setExact — no uppercase
      />

      <EditableCheckboxField
        label="Search job titles from all departments?"
        checked={!!data.searchAllDepartments}
        onChange={(v) => onChange({ ...data, searchAllDepartments: v })}
        isEditing
      />

      <EditableCheckboxField
        label="Create your own job title (only available to this project)"
        checked={!!data.createOwnJobTitle}
        onChange={(v) => onChange({ ...data, createOwnJobTitle: v })}
        isEditing
      />

      {data.createOwnJobTitle && (
        <EditableTextDataField
          label="New job title"
          icon="PenLine"
          value={data.newJobTitle ?? ""}
          isEditing
          onChange={(v) => set("newJobTitle", v)}
          placeholder="Add your own job title"
        />
      )}

      <EditableTextDataField
        label="Job title suffix"
        icon="Tag"
        value={data.jobTitleSuffix ?? ""}
        isEditing
        onChange={(v) => set("jobTitleSuffix", v)}
        placeholder="e.g. to Cast #1"
      />
    </div>
  );
}