import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  mergeAIFields,
  normalizeAIFieldsForMerge,
  setNestedValue,
} from "../config/aiDocumentScanner.helper";
import { useDocumentAIScan } from "./useDocumentAIScan";
import { getDocAIFields } from "../../../user-documents/store/document.selector";

export function useDocumentSectionAI({
  documentType,
  scanKey,
  getForm,
  setForm,
}) {
  const { getScan, triggerScan, setReuseFields, clearAllScans } =
    useDocumentAIScan();

  const [aiConflicts, setAiConflicts] = useState([]);
  const [autoFilledCount, setAutoFilledCount] = useState(0);
  const [aiRawFields, setAiRawFields] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const applyMergeResult = useCallback(
    ({ updatedForm, autoFilled, conflicts }) => {
      setForm(updatedForm);
      setAutoFilledCount(autoFilled.length);
      setAiConflicts(conflicts);
    },
    [setForm],
  );

  const resetAIState = useCallback(() => {
    setAiConflicts([]);
    setAiRawFields(null);
    setAutoFilledCount(0);
    clearAllScans();
  }, [clearAllScans]);

  // ── Scan ─────────────────────────────────────────────────────────────────
  const processAIScan = useCallback(
    async ({ file, documentId, currentForm } = {}) => {
      resetAIState();

      const scanPromise = triggerScan({
        key: scanKey,
        file,
        documentId,
        documentType,
      });

      toast.promise(scanPromise, {
        loading: "Scanning document with AI…",
        success: () => ({
          message: "Scan completed",
          description: "Review the extracted details before saving.",
        }),
        error: (err) => ({
          message: "AI scan failed",
          description:
            err?.message || "You can still fill the fields manually.",
        }),
      });

      const fields = await scanPromise; // throws on error (caught by toast)
      if (!fields) return;

      setAiRawFields(fields);

      const result = mergeAIFields({
        currentForm: currentForm ?? getForm(),
        aiFields: fields,
        documentType,
      });

      applyMergeResult(result);
      return fields;
    },
    [
      triggerScan,
      applyMergeResult,
      resetAIState,
      getForm,
      documentType,
      scanKey,
    ],
  );

  const handleReuseSelect = useCallback(
    (id, userDocuments) => {
      resetAIState();
      if (!id) return;

      const persistedFields = getDocAIFields(userDocuments, id);
      if (!persistedFields) return;

      const normalized = normalizeAIFieldsForMerge(persistedFields);
      setReuseFields({ key: scanKey, fields: normalized });

      const result = mergeAIFields({
        currentForm: getForm(),
        aiFields: normalized,
        documentType,
      });

      applyMergeResult(result);
    },
    [
      resetAIState,
      setReuseFields,
      scanKey,
      getForm,
      applyMergeResult,
      documentType,
    ],
  );

  // ── Conflict resolution ───────────────────────────────────────────────────

  const acceptAISuggestion = useCallback(
    (conflict) => {
      setForm(setNestedValue(getForm(), conflict.formPath, conflict.aiValue));
      setAiConflicts((prev) => prev.filter((c) => c.aiKey !== conflict.aiKey));
    },
    [getForm, setForm],
  );

  const rejectAISuggestion = useCallback((conflict) => {
    setAiConflicts((prev) => prev.filter((c) => c.aiKey !== conflict.aiKey));
  }, []);

  // ── Exposed ───────────────────────────────────────────────────────────────

  return {
    scan: getScan(scanKey),
    aiConflicts,
    autoFilledCount,
    aiRawFields,
    processAIScan,
    handleReuseSelect,
    acceptAISuggestion,
    rejectAISuggestion,
    resetAIState,
  };
}
