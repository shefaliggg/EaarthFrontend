import { useState, useCallback } from "react";
import { scanTempDocument } from "../../../user-documents/services/document.service";

const IDLE = { status: "idle", fields: null, error: null };

export function useDocumentAIScan() {
  const [scanStates, setScanStates] = useState({});

  const getScan = useCallback((key) => scanStates[key] ?? IDLE, [scanStates]);

  /**
   * Trigger a temporary AI scan. Returns extracted fields or null on failure.
   */
  const triggerScan = useCallback(
    async ({ key, file, documentId, documentType }) => {
      setScanStates((prev) => ({
        ...prev,
        [key]: {
          status: "scanning",
          fields: null,
          verification: null,
          error: null,
        },
      }));

      try {
        const result = await scanTempDocument({
          file,
          documentId,
          documentType,
        });

        console.log("response for ai document scan:", result);

        setScanStates((prev) => ({
          ...prev,
          [key]: {
            status: "done",
            fields: result.fields,
            verification: result.verification,
            error: null,
          },
        }));

        return{ fields: result.fields, verification: result.verification };
      } catch (err) {
        const message =
          err?.response?.data?.message ?? err?.message ?? "AI scan failed.";

        setScanStates((prev) => ({
          ...prev,
          [key]: {
            status: "error",
            fields: null,
            verification: null,
            error: message,
          },
        }));

        throw new Error(message);
      }
    },
    [],
  );

  /**
   * Apply AI fields from a previously scanned & persisted document (reuse flow).
   * Mirrors `triggerScan` status so the same UI renders for both paths.
   */
  const setReuseFields = useCallback(({ key, fields, verification }) => {
    setScanStates((prev) => ({
      ...prev,
      [key]: { status: "done", fields, verification, error: null },
    }));
  }, []);

  const clearScan = useCallback((key) => {
    setScanStates((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearAllScans = useCallback(() => setScanStates({}), []);

  return { getScan, triggerScan, setReuseFields, clearScan, clearAllScans };
}
