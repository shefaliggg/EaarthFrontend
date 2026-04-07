/**
 * BulkOfferCreate.jsx
 *
 * UPDATED:
 *   - Auto-recalculates salary/overtime rates when feePerDay or workingHours changes
 *   - RatesPanel: per-row salary & overtime tables with editable budget codes/tags
 *   - SchedulePanel: full schedule editor (hiatus, pre-prep, blocks, wrap) per row
 *   - StipulationsPanel: already existed, now also wired via column cell
 *   - All panel state (ratesRowId, scheduleRowId) added
 *   - deepSet for salaryBudgetCodes/salaryTags/overtimeBudgetCodes/overtimeTags
 *     (these are arrays at top level, not nested — handled with direct setRows)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button }   from "../../../shared/components/ui/button";
import { Badge }    from "../../../shared/components/ui/badge";
import { Checkbox } from "../../../shared/components/ui/checkbox";
import {
  Plus, Users, CheckCircle, AlertCircle,
  Settings2, Trash, ArrowLeft, Package, TrendingUp, CalendarDays,
} from "lucide-react";

import {
  createOfferThunk,
  getProjectOffersThunk,
} from "../store/offer.slice";
import { APP_CONFIG } from "../config/appConfig";

import { BulkOfferTable }    from "../components/bulkoffer/BulkOfferTable";
import { AllowancePanel }    from "../components/bulkoffer/AllowancePanel";
import { StipulationsPanel } from "../components/bulkoffer/StipulationsPanel";
import { BulkEditPanel }     from "../components/bulkoffer/BulkEditPanel";
import { RatesPanel }        from "../components/bulkoffer/RatesPanel";
import { SchedulePanel }     from "../components/bulkoffer/SchedulePanel";

import {
  COLUMNS,
  createEmptyRow,
  validateRow,
  buildPayload,
  deepSet,
  recalcRowRates,
} from "../utils/bulkOfferUtils";

// ─── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "bulkOfferDraft_v5";
const STUDIO_ID   = APP_CONFIG.STUDIO_ID;
const PROJECT_ID  = APP_CONFIG.PROJECT_ID;

const FROZEN_COLS     = COLUMNS.filter(c => c.frozen);
const SCROLLABLE_COLS = COLUMNS.filter(c => !c.frozen);
const FROZEN_WIDTH    = FROZEN_COLS.reduce((s, c) => s + c.width, 0);

const INITIAL_BULK_EDIT = {
  department: "", engagementType: "", workingWeek: "",
  currency: "", dailyOrWeekly: "", categoryId: "", workingInUK: "",
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BulkOfferCreate() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const params      = useParams();
  const projectSlug = params.projectName ?? "demo-project";

  // ── Row state ─────────────────────────────────────────────────────────────
  const [rows, setRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [createEmptyRow(), createEmptyRow(), createEmptyRow()];
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch {}
  }, [rows]);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [copySettings,  setCopySettings ] = useState(true);
  const [dragData,      setDragData     ] = useState(null);
  const [isSubmitting,  setIsSubmitting ] = useState(false);

  // Panel open state — null = closed, string = row.id
  const [allowRowId,    setAllowRowId   ] = useState(null);
  const [ratesRowId,    setRatesRowId   ] = useState(null);
  const [scheduleRowId, setScheduleRowId] = useState(null);
  const [stipRowId,     setStipRowId    ] = useState(null);
  const [bulkPanelOpen, setBulkPanelOpen] = useState(false);
  const [bulkEdit,      setBulkEdit     ] = useState(INITIAL_BULK_EDIT);

  const cellRefsObj = useRef({});

  // ── Computed ─────────────────────────────────────────────────────────────
  const validRows    = rows.filter(r => validateRow(r).valid);
  const selectedRows = rows.filter(r => r._selected);

  // ── Cell update — auto-recalc rates when feePerDay or workingHours changes ──
  const updateCell = useCallback((rowId, path, value) => {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      let updated = deepSet(r, path, value);
      // Recalc whenever a rate-affecting field changes
      if (path === "feePerDay" || path === "workingHours") {
        updated = recalcRowRates(updated);
      }
      return updated;
    }));
  }, []);

  // ── Special updater for array fields (salaryBudgetCodes etc.) ────────────
  const updateRowArrayField = useCallback((rowId, field, newArr) => {
    setRows(prev => prev.map(r =>
      r.id === rowId ? { ...r, [field]: newArr } : r
    ));
  }, []);

  // Unified updater passed to RatesPanel (handles both path and array fields)
  const handleRatesPanelUpdate = useCallback((rowId, pathOrField, value) => {
    const arrayFields = ["salaryBudgetCodes", "salaryTags", "overtimeBudgetCodes", "overtimeTags"];
    if (arrayFields.includes(pathOrField)) {
      updateRowArrayField(rowId, pathOrField, value);
    } else {
      updateCell(rowId, pathOrField, value);
    }
  }, [updateCell, updateRowArrayField]);

  // ── Row management ────────────────────────────────────────────────────────
  const addRow = () => {
    const last = rows[rows.length - 1];
    setRows(prev => [...prev, createEmptyRow(copySettings ? last : null, copySettings)]);
  };

  const addRowBelow = rowId => {
    const idx  = rows.findIndex(r => r.id === rowId);
    const next = createEmptyRow(copySettings ? rows[idx] : null, copySettings);
    setRows(prev => {
      const u = [...prev];
      u.splice(idx + 1, 0, next);
      return u;
    });
  };

  const removeRow = rowId => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.id !== rowId));
  };

  const duplicateRow = rowId => {
    const row = rows.find(r => r.id === rowId);
    if (!row) return;
    const dup = {
      ...JSON.parse(JSON.stringify(row)),
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      _selected: false,
    };
    dup.recipient = { ...dup.recipient, fullName: "", email: "" };
    const idx = rows.findIndex(r => r.id === rowId);
    setRows(prev => {
      const u = [...prev];
      u.splice(idx + 1, 0, dup);
      return u;
    });
  };

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    const all = rows.every(r => r._selected);
    setRows(prev => prev.map(r => ({ ...r, _selected: !all })));
  };

  const toggleSelect = id =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, _selected: !r._selected } : r));

  const deleteSelected = () => {
    const keep = rows.filter(r => !r._selected);
    if (!keep.length) { toast.error("Cannot delete all rows — at least one required."); return; }
    setRows(keep);
    toast.success("Selected rows deleted.");
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e, rowIdx, colIdx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cellRefsObj.current[`${rowIdx + 1}-${colIdx}`]?.focus();
    } else if (e.key === "Tab") {
      e.preventDefault();
      cellRefsObj.current[`${rowIdx}-${e.shiftKey ? colIdx - 1 : colIdx + 1}`]?.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      duplicateRow(rows[rowIdx].id);
    }
  };

  // ── Drag-to-fill ──────────────────────────────────────────────────────────
  const handleDragStart = (e, rowIdx, key, value) => {
    setDragData({ rowIdx, key, value });
    e.dataTransfer.effectAllowed = "copy";
  };
  const handleDragOver = e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; };
  const handleDrop = (e, targetIdx, targetKey) => {
    e.preventDefault();
    if (!dragData || dragData.key !== targetKey) return;
    const start = Math.min(dragData.rowIdx, targetIdx);
    const end   = Math.max(dragData.rowIdx, targetIdx);
    setRows(prev => prev.map((r, i) => {
      if (i <= start || i > end) return r;
      let updated = deepSet(r, targetKey, dragData.value);
      if (targetKey === "feePerDay" || targetKey === "workingHours") {
        updated = recalcRowRates(updated);
      }
      return updated;
    }));
    setDragData(null);
  };

  // ── Bulk edit ─────────────────────────────────────────────────────────────
  const applyBulkEdit = () => {
    const sel = rows.filter(r => r._selected);
    if (!sel.length) { toast.error("Select at least one row first."); return; }

    setRows(prev => prev.map(r => {
      if (!r._selected) return r;
      let u = r;
      if (bulkEdit.department)     u = deepSet(u, "department",     bulkEdit.department);
      if (bulkEdit.engagementType) u = deepSet(u, "engagementType", bulkEdit.engagementType);
      if (bulkEdit.workingWeek)    u = deepSet(u, "workingWeek",    bulkEdit.workingWeek);
      if (bulkEdit.currency)       u = deepSet(u, "currency",       bulkEdit.currency);
      if (bulkEdit.dailyOrWeekly)  u = deepSet(u, "dailyOrWeekly",  bulkEdit.dailyOrWeekly);
      if (bulkEdit.categoryId)     u = deepSet(u, "categoryId",     bulkEdit.categoryId);
      if (bulkEdit.workingInUK)    u = deepSet(u, "workingInUK",    bulkEdit.workingInUK);
      return u;
    }));

    setBulkPanelOpen(false);
    setBulkEdit(INITIAL_BULK_EDIT);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validRows.length) {
      toast.error("No complete rows to submit. Fill in required fields first.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading(
      `Creating ${validRows.length} draft offer${validRows.length !== 1 ? "s" : ""}…`
    );

    let successCount = 0, failCount = 0;
    const failedNames = [];

    for (const row of validRows) {
      try {
        const result = await dispatch(createOfferThunk(buildPayload(row, STUDIO_ID, PROJECT_ID)));
        if (result.error) {
          failCount++;
          failedNames.push(row.recipient?.fullName || "Unknown");
        } else {
          successCount++;
        }
      } catch {
        failCount++;
        failedNames.push(row.recipient?.fullName || "Unknown");
      }
    }

    toast.dismiss(toastId);
    setIsSubmitting(false);

    if (successCount > 0 && failCount === 0) {
      toast.success(`✅ ${successCount} draft offer${successCount !== 1 ? "s" : ""} created successfully!`);
      localStorage.removeItem(STORAGE_KEY);
      dispatch(getProjectOffersThunk({ projectId: PROJECT_ID }));
      setRows([createEmptyRow()]);
    } else if (successCount > 0) {
      toast.warning(`${successCount} created, ${failCount} failed: ${failedNames.join(", ")}`);
      dispatch(getProjectOffersThunk({ projectId: PROJECT_ID }));
    } else {
      toast.error("Failed to create offers. Check console for details.");
    }
  };

  // ── Panel data ────────────────────────────────────────────────────────────
  const allowRow    = allowRowId    ? rows.find(r => r.id === allowRowId)    : null;
  const ratesRow    = ratesRowId    ? rows.find(r => r.id === ratesRowId)    : null;
  const scheduleRow = scheduleRowId ? rows.find(r => r.id === scheduleRowId) : null;
  const stipRow     = stipRowId     ? rows.find(r => r.id === stipRowId)     : null;
  const stipRowIndex = stipRowId ? rows.findIndex(r => r.id === stipRowId) : -1;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* ── Top bar ── */}
      <div className="shrink-0 bg-card border-b px-4 py-2.5 shadow-sm flex items-center justify-between gap-3 flex-wrap z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${projectSlug}/onboarding`)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Crew Onboarding"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              BULK OFFER CREATION
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Creates draft offers — visible immediately in Crew Onboarding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer select-none">
            <Checkbox checked={copySettings} onCheckedChange={setCopySettings} />
            Copy previous row settings
          </label>

          <Badge variant="outline" className="gap-1 text-[11px] text-green-700 border-green-300 bg-green-50">
            <CheckCircle className="w-3 h-3" /> {validRows.length} ready
          </Badge>
          <Badge variant="outline" className="gap-1 text-[11px] text-orange-700 border-orange-300 bg-orange-50">
            <AlertCircle className="w-3 h-3" /> {rows.length - validRows.length} incomplete
          </Badge>

          {selectedRows.length > 0 && (
            <>
              <Button
                onClick={() => setBulkPanelOpen(true)}
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-[11px]"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Bulk Edit ({selectedRows.length})
              </Button>
              <Button
                onClick={deleteSelected}
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-[11px] text-destructive border-destructive/40"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete
              </Button>
            </>
          )}

          <Button
            onClick={addRow}
            variant="outline"
            size="sm"
            className="gap-1.5 h-7 text-[11px]"
          >
            <Plus className="w-3.5 h-3.5" /> Add Row
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!validRows.length || isSubmitting}
            size="sm"
            className="h-7 text-[11px] gap-1.5"
          >
            {isSubmitting
              ? "Creating…"
              : `Create ${validRows.length} Draft${validRows.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>

      {/* ── Spreadsheet ── */}
      <BulkOfferTable
        rows={rows}
        frozenCols={FROZEN_COLS}
        scrollableCols={SCROLLABLE_COLS}
        frozenWidth={FROZEN_WIDTH}
        cellRefsObj={cellRefsObj}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelect={toggleSelect}
        onAddRowBelow={addRowBelow}
        onDuplicate={duplicateRow}
        onRemove={removeRow}
        onOpenAllowances={setAllowRowId}
        onOpenRates={setRatesRowId}
        onOpenSchedule={setScheduleRowId}
        onOpenStipulations={setStipRowId}
        onCellChange={updateCell}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {/* ── Bottom status bar ── */}
      <div className="shrink-0 bg-card border-t px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{rows.length} rows</span>
          <span className="text-green-700">{validRows.length} ready</span>
          <span className="text-orange-700">{rows.length - validRows.length} incomplete</span>
          {selectedRows.length > 0 && (
            <span className="text-primary">{selectedRows.length} selected</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          💡
          <strong>Enter</strong> ↓ next row ·
          <strong>Tab</strong> → next field ·
          <strong>Ctrl+D</strong> duplicate ·
          drag numbers to fill ·
          <TrendingUp className="w-3 h-3 inline text-purple-600" /> rates ·
          <CalendarDays className="w-3 h-3 inline text-sky-600" /> schedule ·
          <Package className="w-3 h-3 inline text-rose-600" /> allowances
        </div>
      </div>

      {/* ── Allowance Panel ── */}
      {allowRow && (
        <AllowancePanel
          row={allowRow}
          onClose={() => setAllowRowId(null)}
          onUpdate={updateCell}
        />
      )}

      {/* ── Rates Panel (salary & overtime) ── */}
      {ratesRow && (
        <RatesPanel
          row={ratesRow}
          onClose={() => setRatesRowId(null)}
          onUpdate={handleRatesPanelUpdate}
        />
      )}

      {/* ── Schedule Panel ── */}
      {scheduleRow && (
        <SchedulePanel
          row={scheduleRow}
          onClose={() => setScheduleRowId(null)}
          onUpdate={updateCell}
        />
      )}

      {/* ── Stipulations Panel ── */}
      {stipRow && (
        <StipulationsPanel
          row={stipRow}
          rowIndex={stipRowIndex}
          onClose={() => setStipRowId(null)}
          onUpdate={updateCell}
        />
      )}

      {/* ── Bulk Edit Panel ── */}
      {bulkPanelOpen && (
        <BulkEditPanel
          selectedCount={selectedRows.length}
          bulkEdit={bulkEdit}
          setBulkEdit={setBulkEdit}
          onApply={applyBulkEdit}
          onClose={() => { setBulkPanelOpen(false); setBulkEdit(INITIAL_BULK_EDIT); }}
        />
      )}
    </div>
  );
}