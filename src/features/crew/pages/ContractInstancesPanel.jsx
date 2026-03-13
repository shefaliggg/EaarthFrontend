/**
 * ContractInstancesPanel.jsx
 *
 * Uses the reusable <ContractStepper> component.
 *
 * KEY FIX — deduplication:
 *   dedupByFormKey() keeps only the highest-generation instance per formKey.
 *   This eliminates duplicates that appear when:
 *     - Multiple bundles share the same form template (e.g. 2× "Start Form")
 *     - A contract was regenerated and old SUPERSEDED record leaked through
 *     - Redux state was not cleared before re-fetching (now fixed below)
 *
 * Also: clearInstances() is dispatched before every fetch so Redux never
 * accumulates stale entries across navigations.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight,
  Layers, Shield, FileText, CheckCircle2, Clock, FileSignature,
  XCircle, PenLine, Check,
} from "lucide-react";
import { cn } from "../../../shared/config/utils";

import {
  getContractInstancesThunk,
  getContractInstanceHtmlThunk,
  clearInstances,
  selectInstances,
  selectInstancesLoading,
  selectInstancesError,
} from "../store/contractInstances.slice";

import { ContractStepper, isSignedStatus } from "../components/viewoffer/layouts/ContractStepper";

// ── Type badge config ─────────────────────────────────────────────────────────

const TYPE_CFG = {
  contract:  { cls: "bg-violet-100 text-violet-700 border-violet-200",    label: "CONTRACT"  },
  allowance: { cls: "bg-sky-100 text-sky-700 border-sky-200",             label: "ALLOWANCE" },
  standard:  { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "STANDARD"  },
  optional:  { cls: "bg-orange-100 text-orange-700 border-orange-200",    label: "OPTIONAL"  },
  tax:       { cls: "bg-pink-100 text-pink-700 border-pink-200",          label: "TAX"       },
};

const STATUS_CFG = {
  DRAFT:                  { label: "Draft",         Icon: Clock         },
  PENDING_REVIEW:         { label: "Pending",       Icon: Clock         },
  PENDING_CREW_SIGNATURE: { label: "Awaiting Crew", Icon: FileSignature },
  CREW_SIGNED:            { label: "Crew Signed",   Icon: CheckCircle2  },
  UPM_SIGNED:             { label: "UPM Signed",    Icon: CheckCircle2  },
  FC_SIGNED:              { label: "FC Signed",     Icon: CheckCircle2  },
  STUDIO_SIGNED:          { label: "Studio Signed", Icon: CheckCircle2  },
  COMPLETED:              { label: "Completed",     Icon: CheckCircle2  },
  SUPERSEDED:             { label: "Superseded",    Icon: XCircle       },
  VOIDED:                 { label: "Voided",        Icon: XCircle       },
};

const STATUS_COLOR = {
  COMPLETED:              "bg-emerald-50 text-emerald-600 border-emerald-200",
  CREW_SIGNED:            "bg-teal-50 text-teal-600 border-teal-200",
  UPM_SIGNED:             "bg-teal-50 text-teal-600 border-teal-200",
  FC_SIGNED:              "bg-teal-50 text-teal-600 border-teal-200",
  STUDIO_SIGNED:          "bg-teal-50 text-teal-600 border-teal-200",
  PENDING_CREW_SIGNATURE: "bg-sky-50 text-sky-600 border-sky-200",
  PENDING_REVIEW:         "bg-amber-50 text-amber-600 border-amber-200",
  DRAFT:                  "bg-zinc-100 text-zinc-500 border-zinc-200",
  VOIDED:                 "bg-red-50 text-red-500 border-red-200",
  SUPERSEDED:             "bg-zinc-100 text-zinc-400 border-zinc-200",
};

// ─────────────────────────────────────────────────────────────────────────────
// DEDUP — keeps highest-generation instance per formKey/formName
// ─────────────────────────────────────────────────────────────────────────────

function dedupByFormKey(instances) {
  const map = new Map();
  for (const inst of instances) {
    const key = inst.formKey || inst.formName || inst._id;
    const existing = map.get(key);
    if (!existing || (inst.generation ?? 1) > (existing.generation ?? 1)) {
      map.set(key, inst);
    }
  }
  return Array.from(map.values());
}

// ── Auto-sizing iframe ────────────────────────────────────────────────────────

function AutoIframe({ html, title }) {
  const ref     = useRef(null);
  const blobRef = useRef(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    if (!html || !ref.current) return;
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const blob = new Blob([html], { type: "text/html; charset=utf-8" });
    blobRef.current = URL.createObjectURL(blob);
    ref.current.src = blobRef.current;
    const onLoad = () => {
      try {
        const doc = ref.current?.contentDocument || ref.current?.contentWindow?.document;
        if (doc) setHeight(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0, 400) + 24);
      } catch { setHeight(900); }
    };
    ref.current.addEventListener("load", onLoad);
    const t = setTimeout(onLoad, 500);
    return () => {
      ref.current?.removeEventListener("load", onLoad);
      clearTimeout(t);
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [html]);

  return (
    <iframe ref={ref} title={title} className="w-full border-0 block"
      style={{ height: `${height}px` }} sandbox="allow-same-origin allow-scripts" scrolling="no" />
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg  = STATUS_CFG[status] ?? STATUS_CFG.DRAFT;
  const Icon = cfg.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide", STATUS_COLOR[status] ?? STATUS_COLOR.DRAFT)}>
      <Icon className="w-2.5 h-2.5" />{cfg.label}
    </span>
  );
}

// ── Single document view ──────────────────────────────────────────────────────

function DocumentView({ instance, index, total }) {
  const dispatch  = useDispatch();
  const [html,    setHtml   ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);
  const signed   = isSignedStatus(instance.status);
  const typeCfg  = TYPE_CFG[instance.displayType] ?? TYPE_CFG.standard;

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setHtml(null);
    dispatch(getContractInstanceHtmlThunk(instance._id)).then((res) => {
      if (cancelled) return;
      if (res.error)         setError(res.payload?.message || "Failed to load");
      else if (res.payload?.html) setHtml(res.payload.html);
      else                   setError("No content returned");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instance._id, dispatch]);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
      <div className={cn("rounded-xl overflow-hidden border", signed ? "border-emerald-200" : "border-neutral-200")}>

        {/* Header */}
        <div className={cn("flex items-center gap-3 px-4 py-3", signed ? "bg-emerald-600" : "bg-violet-700")}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            {signed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{instance.formName}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[8px] font-bold px-1.5 py-px rounded border bg-white/20 text-white border-white/30 uppercase tracking-wider">{typeCfg.label}</span>
              <span className="text-[8px] text-white/70 font-mono uppercase tracking-wider">DOC {index + 1} OF {total}</span>
              {(instance.generation ?? 1) > 1 && (
                <span className="text-[8px] font-mono text-white/70 bg-white/10 px-1.5 py-px rounded border border-white/20">GEN {instance.generation}</span>
              )}
            </div>
          </div>
          <StatusBadge status={instance.status} />
        </div>

        {/* Signature row */}
        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/60 flex items-center gap-3">
          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", signed ? "bg-emerald-100" : "bg-neutral-100")}>
            {signed ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <PenLine className="w-3.5 h-3.5 text-neutral-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-[11px] font-semibold", signed ? "text-emerald-700" : "text-neutral-600")}>
              {signed ? "Signature recorded" : "Signature pending"}
            </p>
            <p className="text-[10px] text-neutral-400">{STATUS_CFG[instance.status]?.label ?? "Draft"}</p>
          </div>
        </div>

        {/* Document body */}
        <div className="bg-[#f0eef8]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
              <p className="text-[11px] text-neutral-500">Loading document…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <AlertCircle className="w-4 h-4 text-neutral-400" />
              <p className="text-[11px] text-neutral-400">{error}</p>
            </div>
          ) : html ? (
            <div className="px-5 py-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200/60">
                <AutoIframe html={html} title={instance.formName} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-violet-300" />
      </div>
      <p className="text-sm font-semibold text-neutral-500">No contracts generated yet</p>
      <p className="text-[11px] text-neutral-400 mt-1.5 max-w-xs leading-relaxed">
        Documents are generated when the crew accepts the offer.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContractInstancesPanel({ offerId, className }) {
  const dispatch  = useDispatch();
  const instances = useSelector(selectInstances);
  const loading   = useSelector(selectInstancesLoading);
  const error     = useSelector(selectInstancesError);
  const [activeIdx, setActiveIdx] = useState(0);

  // FIX: clear before fetch — prevents stale entries accumulating in Redux
  const handleRefresh = useCallback(() => {
    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(offerId));
  }, [dispatch, offerId]);

  useEffect(() => {
    if (!offerId) return;
    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(offerId));
  }, [dispatch, offerId]);

  // Active + deduplicated list
  const activeInstances = dedupByFormKey(
    instances
      .filter((i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  );

  const safeIdx     = Math.min(activeIdx, Math.max(0, activeInstances.length - 1));
  const signedCount = activeInstances.filter((i) => isSignedStatus(i.status)).length;
  const total       = activeInstances.length;
  const progress    = total ? Math.round((signedCount / total) * 100) : 0;

  const steps = activeInstances.map((inst) => ({
    id:     inst._id,
    label:  inst.formName,
    status: inst.status,
    signed: isSignedStatus(inst.status),
  }));

  if (loading && instances.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-20", className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          <p className="text-[11px] text-neutral-500">Loading contract documents…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2", className)}>
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        <p className="text-[11px] text-red-600">{error}</p>
        <button onClick={handleRefresh} className="ml-auto text-[10px] text-red-500 underline">Retry</button>
      </div>
    );
  }

  if (!loading && total === 0) return <EmptyState />;

  const current = activeInstances[safeIdx];

  return (
    <div className={cn("space-y-5", className)}>

      {/* Bundle bar */}
      <div className="bg-white rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-800">Contract Bundle</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-neutral-400">{total} documents</span>
              {signedCount > 0 && <span className="text-[10px] text-emerald-600 font-semibold">· {signedCount} signed</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-neutral-400 shrink-0">{signedCount}/{total}</span>
          <button onClick={handleRefresh} disabled={loading} title="Refresh"
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* ── Reusable stepper ── */}
      <ContractStepper steps={steps} activeIndex={safeIdx} onSelect={setActiveIdx} />

      {/* Active document */}
      {current && <DocumentView key={current._id} instance={current} index={safeIdx} total={total} />}

      {/* Prev / Next */}
      {total > 1 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setActiveIdx(i => Math.max(0, i - 1))} disabled={safeIdx === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-[12px] text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[11px] text-neutral-400">{safeIdx + 1} of {total}</span>
          <button onClick={() => setActiveIdx(i => Math.min(total - 1, i + 1))} disabled={safeIdx === total - 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-[12px] text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}