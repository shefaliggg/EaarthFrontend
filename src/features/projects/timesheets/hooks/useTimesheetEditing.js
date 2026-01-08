import { useState } from "react";

export function useTimesheetEditing() {
  const [editingRowIds, setEditingRowIds] = useState(() => new Set());

  const startEdit = (id) => {
    setEditingRowIds((prev) => new Set(prev).add(id));
  };

  const stopEdit = (id) => {
    setEditingRowIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const stopAll = () => setEditingRowIds(new Set());

  const isEditing = (id) => editingRowIds.has(id);

  return {
    editingRowIds,
    isEditing,
    startEdit,
    stopEdit,
    stopAll,
  };
}
