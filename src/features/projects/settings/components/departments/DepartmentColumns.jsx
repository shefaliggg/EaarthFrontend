import { Checkbox } from "@/shared/components/ui/checkbox";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import ActionsMenu from "@/shared/components/menus/ActionsMenu";

export const DepartmentColumns = ({
  departments,
  setDepartments,
  isEditing,
  onDelete,
}) => {
  const updateRow = (id, field, value) => {
    setDepartments(
      departments.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  return [
    {
      key: "department",
      label: "Department",

      render: (row) => (
        <EditableTextDataField
          label=""
          value={row.department}
          isEditing={isEditing}
          isRequired={false}
          textCase="pretty"
          onChange={(value) => updateRow(row.id, "department", value)}
        />
      ),
    },

    {
      key: "site",
      label: "Site",
      align: "center",
      render: (row) => (
        <EditableSelectField
          label=""
          value={row.site}
          isEditing={isEditing}
          isRequired={false}
          items={[
            {
              label: "ON SET",
              value: "On Set",
            },
            {
              label: "OFF SET",
              value: "Off Set",
            },
          ]}
          onChange={(value) => updateRow(row.id, "site", value)}
        />
      ),
    },

    {
      key: "cameraOT",
      label: "Camera OT",
      align: "center",
      render: (row) => (
        <EditableCheckboxField
          label=""
          checked={row.cameraOT}
          isEditing={isEditing}
          isRequired={false}
          onChange={(checked) => updateRow(row.id, "cameraOT", checked)}
          centered
        />
      ),
    },

    {
      key: "otherOT",
      label: "Other OT",
      align: "center",

      render: (row) => (
        <EditableCheckboxField
          label=""
          checked={row.otherOT}
          isEditing={isEditing}
          isRequired={false}
          onChange={(checked) => updateRow(row.id, "otherOT", checked)}
          centered
        />
      ),
    },

    {
      key: "minutesAcross",
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
            onChange={(value) =>
              updateRow(row.id, "minutesAcross", Number(value))
            }
          />
        ) : (
          row.minutesAcross
        ),
    },

    {
      key: "minutesBefore",
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
            onChange={(value) =>
              updateRow(row.id, "minutesBefore", Number(value))
            }
          />
        ) : (
          row.minutesBefore
        ),
    },

    {
      key: "minutesAfter",
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
            onChange={(value) =>
              updateRow(row.id, "minutesAfter", Number(value))
            }
          />
        ) : (
          row.minutesAfter
        ),
    },
    {
      key: "actions",
      label: "",
      align: "right",

      render: (row) => {
        const isDefaultDepartment = row.department === "All Depts";

        if (!isEditing || isDefaultDepartment) {
          return null;
        }

        return (
          <ActionsMenu
            actions={[
              {
                label: "Delete",
                icon: "Trash2",
                destructive: true,
                onClick: () => onDelete?.(row.id),
              },
            ]}
          />
        );
      },
    },
  ];
};
