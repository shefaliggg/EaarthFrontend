/**
 * SubmittedDocumentsPanel.jsx — compact height version
 */

import { useEffect, useState, useCallback } from "react";
import {
  FileText, Eye, Download, CheckCircle2,
  AlertCircle, Loader2, RefreshCw, ShieldCheck,
  Wrench, Car, Monitor, Package, Smartphone,
} from "lucide-react";
import { cn } from "../../../../../shared/config/utils";

const STATUS = {
  uploaded:     { label: "UPLOADED", badge: "bg-violet-100 text-violet-700 border-violet-200", border: "border-neutral-200", bg: "bg-white" },
  missing:      { label: "MISSING",  badge: "bg-red-50 text-red-500 border-red-200",           border: "border-red-200",     bg: "bg-red-50/40" },
  acknowledged: { label: null,       badge: null,                                               border: "border-neutral-200", bg: "bg-white" },
};

const IDENTITY_DOCS = [
  { key: "passport",     label: "Passport",       fileKey: "PASSPORT_GP.PDF", Icon: FileText    },
  { key: "licenceFront", label: "Licence (Front)", fileKey: "DL_F_GP.PDF",    Icon: FileText    },
  { key: "licenceBack",  label: "Licence (Back)",  fileKey: "DL_B_GP.PDF",    Icon: FileText    },
  { key: "rightToWork",  label: "Right to Work",   fileKey: "RTW_GP.PDF",     Icon: ShieldCheck },
];

const EQUIPMENT_DOCS = [
  { key: "boxInventory",    label: "Box Inventory",    Icon: Package,    show: (o) => o?.allowances?.some((a) => a.key === "boxRental" && a.enabled) },
  { key: "softwareDetails", label: "Software Details", Icon: Monitor,    show: (o) => o?.allowances?.some((a) => a.key === "computer"  && a.enabled) },
  { key: "vehicleLicence",  label: "Vehicle Licence",  Icon: Car,        show: (o) => o?.allowances?.some((a) => a.key === "vehicle"   && a.enabled) },
  { key: "carInsurance",    label: "Car Insurance",    Icon: Car,        show: (o) => o?.allowances?.some((a) => a.key === "vehicle"   && a.enabled) },
  { key: "mobileLaptop",    label: "Mobile / Laptop",  Icon: Smartphone, alwaysShow: true, acknowledged: true },
];

// ── Compact identity card ─────────────────────────────────────────────────────

function IdentityDocCard({ doc, data, onView, onDownload }) {
  const uploaded = !!data?.fileUrl || data?.status === "uploaded";
  const st = uploaded ? STATUS.uploaded : STATUS.missing;
  const Icon = doc.Icon;

  return (
    <div className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2 min-w-0", st.border, st.bg)}>
      <div className="w-6 h-6 rounded-md bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-violet-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-neutral-800 truncate leading-tight">{doc.label}</p>
        <p className={cn("text-[9px] truncate font-mono leading-tight", uploaded ? "text-neutral-400" : "text-red-400")}>
          {uploaded ? (data?.fileName ?? doc.fileKey) : "Not uploaded"}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {uploaded && (
          <>
            <button onClick={() => onView?.(data)} className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-violet-500 hover:bg-violet-50 transition-colors" title="View">
              <Eye className="w-3 h-3" />
            </button>
            <button onClick={() => onDownload?.(data)} className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-violet-500 hover:bg-violet-50 transition-colors" title="Download">
              <Download className="w-3 h-3" />
            </button>
          </>
        )}
        {st.label && (
          <span className={cn("text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wide", st.badge)}>
            {st.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Compact equipment card ────────────────────────────────────────────────────

function EquipmentCard({ doc, data }) {
  const Icon = doc.Icon;

  if (doc.acknowledged) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-2">
        <div className="w-6 h-6 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
          <Icon className="w-3 h-3 text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-neutral-800 leading-tight">{doc.label}</p>
          <p className="text-[9px] text-neutral-400 leading-tight">Acknowledged — no docs required</p>
        </div>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      </div>
    );
  }

  const uploaded = !!data?.fileUrl || data?.status === "uploaded";
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2", uploaded ? "border-neutral-200 bg-white" : "border-red-200 bg-red-50/40")}>
      <div className={cn("w-6 h-6 rounded-md border flex items-center justify-center shrink-0", uploaded ? "bg-violet-50 border-violet-100" : "bg-red-50 border-red-100")}>
        <Icon className={cn("w-3 h-3", uploaded ? "text-violet-500" : "text-red-400")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-neutral-800 leading-tight">{doc.label}</p>
        <p className={cn("text-[9px] leading-tight", uploaded ? "text-neutral-400" : "text-red-400")}>
          {uploaded ? (data?.fileName ?? "Uploaded") : "Not uploaded"}
        </p>
      </div>
      <span className={cn("text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wide shrink-0", uploaded ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-red-50 text-red-500 border-red-200")}>
        {uploaded ? "UPLOADED" : "MISSING"}
      </span>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function SubmittedDocumentsPanel({ offerId, offer, className, onView, onDownload }) {
  const [docs,    setDocs   ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  const fetchDocs = useCallback(async () => {
    if (!offerId) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with your thunk
      // const res = await dispatch(getCrewDocumentsThunk(offerId));
      // setDocs(res.payload);
      setDocs(null);
    } catch (e) {
      setError(e?.message ?? "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const visibleEquipment = EQUIPMENT_DOCS.filter((d) => d.alwaysShow || d.show?.(offer));
  const uploadedCount    = IDENTITY_DOCS.filter((d) => docs?.[d.key]?.status === "uploaded" || !!docs?.[d.key]?.fileUrl).length;

  return (
    <div className={cn("bg-white rounded-xl border border-neutral-200 overflow-hidden", className)}>

      {/* Header — slim */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-violet-500" />
          <h3 className="text-[12px] font-semibold text-neutral-800">Submitted Documents</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-400">{uploadedCount}/{IDENTITY_DOCS.length} identity docs uploaded</span>
          <button onClick={fetchDocs} disabled={loading} className="p-1 rounded border border-neutral-200 text-neutral-400 hover:bg-neutral-50 transition-colors" title="Refresh">
            <RefreshCw className={cn("w-2.5 h-2.5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 mx-4 my-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <p className="text-[10px] text-red-600">{error}</p>
          <button onClick={fetchDocs} className="ml-auto text-[9px] text-red-500 underline">Retry</button>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">

          {/* IDENTITY & ELIGIBILITY */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3 h-3 text-neutral-400" />
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Identity &amp; Eligibility</span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-1.5">
              {IDENTITY_DOCS.map((doc) => (
                <IdentityDocCard key={doc.key} doc={doc} data={docs?.[doc.key] ?? null} onView={onView} onDownload={onDownload} />
              ))}
            </div>
          </div>

          {/* EQUIPMENT & ALLOWANCES */}
          {visibleEquipment.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Wrench className="w-3 h-3 text-neutral-400" />
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Equipment &amp; Allowances</span>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-1.5">
                {visibleEquipment.map((doc) => (
                  <EquipmentCard key={doc.key} doc={doc} data={docs?.[doc.key] ?? null} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}