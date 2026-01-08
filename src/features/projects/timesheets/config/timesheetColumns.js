import { DateCell } from "../components/cells/DateCell";
import { TypeCell } from "../components/cells/TypeCell";
import { InOutCell } from "../components/cells/InOutCell";
import { OverviewCell } from "../components/cells/OverviewCell";
import { NotesCell } from "../components/cells/NotesCell";

export function getTimesheetColumns({
  isEditing,
  startEdit,
  stopEdit,
  updateEntry,
  currentUserRole,
  calendarSchedule,
  autoValues,
}) {
  return [
    {
      key: "date",
      label: "Date",
      width: 140,
      render: (row) => (
        <DateCell
          entry={row}
          calendarSchedule={calendarSchedule}
          onEdit={() => startEdit(row.id)}
        />
      ),
    },

    {
      key: "type",
      label: "Type / Unit",
      width: 160,
      render: (row) => (
        <TypeCell
          entry={row}
          isEditing={isEditing(row.id)}
          onChange={updateEntry}
        />
      ),
    },

    {
      key: "inOut",
      label: "IN / OUT",
      width: 180,
      render: (row) => (
        <InOutCell
          entry={row}
          isEditing={isEditing(row.id)}
          onChange={updateEntry}
        />
      ),
    },

    {
      key: "overview",
      label: "Overview",
      width: 260,
      render: (row) => (
        <OverviewCell
          entry={row}
          isEditing={isEditing(row.id)}
          autoValues={autoValues[row.id]}
          role={currentUserRole}
          onChange={updateEntry}
        />
      ),
    },

    {
      key: "notes",
      label: "Notes",
      width: 200,
      render: (row) => (
        <NotesCell
          entry={row}
          isEditing={isEditing(row.id)}
          onChange={updateEntry}
          onBlur={stopEdit}
        />
      ),
    },
  ];
}
