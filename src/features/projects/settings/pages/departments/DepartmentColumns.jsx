import EditableTextDataField  from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField    from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField  from "@/shared/components/wrappers/EditableCheckboxField";
import ActionsMenu            from "@/shared/components/menus/ActionsMenu";

export const DepartmentColumns = ({
  departments,
  setDepartments,
  isEditing,
  onDelete,
}) => {

  // ── Key helper — handles both Mongo _id and temp local id ─────────────────
  const rowKey = (row) => row._id ?? row.id;

  // ── Row updater ───────────────────────────────────────────────────────────
  const updateRow = (id, field, value) => {
    setDepartments(
      departments.map((row) =>
        rowKey(row) === id
          ? { ...row, [field]: value }
          : row,
      ),
    );
  };

  return [
    {
      key:   "department",
      label: "Department",
      render: (row) => (
        <EditableTextDataField
          label=""
          value={row.department}
          isEditing={isEditing}
          isRequired={false}
          textCase="pretty"
          onChange={(value) => updateRow(rowKey(row), "department", value)}
        />
      ),
    },

    {
      key:   "site",
      label: "Site",
      align: "center",
      render: (row) => (
        <EditableSelectField
          label=""
          value={row.site}
          isEditing={isEditing}
          isRequired={false}
          items={[
            { label: "ON SET",  value: "On Set"  },
            { label: "OFF SET", value: "Off Set" },
          ]}
          onChange={(value) => updateRow(rowKey(row), "site", value)}
        />
      ),
    },

    {
      key:   "cameraOT",
      label: "Camera OT",
      align: "center",
      render: (row) => (
        <EditableCheckboxField
          label=""
          checked={row.cameraOT}
          isEditing={isEditing}
          isRequired={false}
          onChange={(checked) => updateRow(rowKey(row), "cameraOT", checked)}
          centered
        />
      ),
    },

    {
      key:   "otherOT",
      label: "Other OT",
      align: "center",
      render: (row) => (
        <EditableCheckboxField
          label=""
          checked={row.otherOT}
          isEditing={isEditing}
          isRequired={false}
          onChange={(checked) => updateRow(rowKey(row), "otherOT", checked)}
          centered
        />
      ),
    },

    {
      key:   "minutesAcross",
      label: "Across",
      align: "center",
      render: (row) =>
        isEditing ? (
          <EditableTextDataField
            label=""
            value={row.minutesAcross}
            type="number"
            isEditing={isEditing}
            isRequired={false}
            onChange={(value) => updateRow(rowKey(row), "minutesAcross", Number(value))}
          />
        ) : (
          row.minutesAcross ?? "—"
        ),
    },

    {
      key:   "minutesBefore",
      label: "Before",
      align: "center",
      render: (row) =>
        isEditing ? (
          <EditableTextDataField
            label=""
            value={row.minutesBefore}
            type="number"
            isEditing={isEditing}
            isRequired={false}
            onChange={(value) => updateRow(rowKey(row), "minutesBefore", Number(value))}
          />
        ) : (
          row.minutesBefore ?? "—"
        ),
    },

    {
      key:   "minutesAfter",
      label: "After",
      align: "center",
      render: (row) =>
        isEditing ? (
          <EditableTextDataField
            label=""
            value={row.minutesAfter}
            type="number"
            isEditing={isEditing}
            isRequired={false}
            onChange={(value) => updateRow(rowKey(row), "minutesAfter", Number(value))}
          />
        ) : (
          row.minutesAfter ?? "—"
        ),
    },

    {
      key:   "actions",
      label: "",
      align: "right",
      render: (row) => {
        const isDefaultDepartment = row.department === "All Depts";
        if (!isEditing || isDefaultDepartment) return null;
        return (
          <ActionsMenu
            actions={[
              {
                label:       "Delete",
                icon:        "Trash2",
                destructive: true,
                onClick:     () => onDelete?.(rowKey(row)),
              },
            ]}
          />
        );
      },
    },
  ];
};