/**
 * ContractInstancesPanel.jsx
 *
 * THEMING: All colors use CSS variables from index.css.
 *   No hardcoded Tailwind color classes (emerald-*, violet-*, neutral-*, teal-*, etc.)
 *
 * FIX 1: clearHtmlCache() called alongside clearInstances().
 * FIX 2: offerStatus prop dependency — re-fetches on status change.
 */

import { useEffect, useRef, useState, useCallback } from "react";
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
  clearHtmlCache,
  selectInstances,
  selectInstancesLoading,
  selectInstancesError,
  selectCurrentOfferId,
} from "../store/contractInstances.slice";

import { selectViewRole } from "../store/viewrole.slice";

import {
  ContractStepper,
  isSignedForRole,
  isSignedStatus,
} from "../components/viewoffer/layouts/ContractStepper";

// ── Type badge config ─────────────────────────────────────────────────────────

const TYPE_CFG = {
  contract:  { label: "CONTRACT",  bg: "var(--lavender-100)", color: "var(--lavender-700)", border: "var(--lavender-200)" },
  allowance: { label: "ALLOWANCE", bg: "var(--sky-100)",      color: "var(--sky-700)",      border: "var(--sky-200)"      },
  standard:  { label: "STANDARD",  bg: "var(--mint-100)",     color: "var(--mint-700)",     border: "var(--mint-200)"     },
  optional:  { label: "OPTIONAL",  bg: "var(--peach-100)",    color: "var(--peach-700)",    border: "var(--peach-200)"    },
  tax:       { label: "TAX",       bg: "var(--pastel-pink-100)", color: "var(--pastel-pink-700)", border: "var(--pastel-pink-200)" },
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

const STATUS_STYLE = {
  COMPLETED:              { bg: "var(--mint-50)",       color: "var(--mint-600)",         border: "var(--mint-200)"       },
  CREW_SIGNED:            { bg: "var(--mint-50)",       color: "var(--mint-600)",         border: "var(--mint-200)"       },
  UPM_SIGNED:             { bg: "var(--mint-50)",       color: "var(--mint-600)",         border: "var(--mint-200)"       },
  FC_SIGNED:              { bg: "var(--mint-50)",       color: "var(--mint-600)",         border: "var(--mint-200)"       },
  STUDIO_SIGNED:          { bg: "var(--mint-50)",       color: "var(--mint-600)",         border: "var(--mint-200)"       },
  PENDING_CREW_SIGNATURE: { bg: "var(--sky-50)",        color: "var(--sky-600)",          border: "var(--sky-200)"        },
  PENDING_REVIEW:         { bg: "var(--peach-50)",      color: "var(--peach-600)",        border: "var(--peach-200)"      },
  DRAFT:                  { bg: "var(--muted)",         color: "var(--muted-foreground)", border: "var(--border)"         },
  VOIDED:                 { bg: "#fff1f1",              color: "#dc2626",                 border: "#fecaca"               },
  SUPERSEDED:             { bg: "var(--muted)",         color: "var(--muted-foreground)", border: "var(--border)"         },
};

// ── Dedup ─────────────────────────────────────────────────────────────────────

function dedupByFormKey(instances) {
  const map = new Map();
  for (const inst of instances) {
    const key      = inst.formKey || inst.formName || inst._id;
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
        if (doc) {
          setHeight(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0, 400) + 24);
        }
      } catch { setHeight(900); }
    };
    ref.current.addEventListener("load", onLoad);
    const t = setTimeout(onLoad, 500);
    return () => {
      ref.current?.removeEventListener("load", onLoad);
      clearTimeout(t);
      if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
    };
  }, [html]);

  return (
    <iframe
      ref={ref} title={title}
      className="w-full border-0 block"
      style={{ height: `${height}px` }}
      sandbox="allow-same-origin allow-scripts"
      scrolling="no"
    />
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg   = STATUS_CFG[status] ?? STATUS_CFG.DRAFT;
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.DRAFT;
  const Icon  = cfg.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
      style={{ background: style.bg, color: style.color, borderColor: style.border }}
    >
      <Icon className="w-2.5 h-2.5" />{cfg.label}
    </span>
  );
}

// ── Single document view ──────────────────────────────────────────────────────

function DocumentView({ instance, index, total, viewRole }) {
  const dispatch  = useDispatch();
  const [html,    setHtml   ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  const signed  = isSignedForRole(instance.status, viewRole);
  const typeCfg = TYPE_CFG[instance.displayType] ?? TYPE_CFG.standard;

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setHtml(null);
    dispatch(getContractInstanceHtmlThunk(instance._id)).then((res) => {
      if (cancelled) return;
      if (res.error)            setError(res.payload?.message || "Failed to load");
      else if (res.payload?.html) setHtml(res.payload.html);
      else                      setError("No content returned");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instance._id, dispatch]);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${signed ? "var(--mint-200)" : "var(--border)"}` }}
      >
        {/* Doc header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: signed ? "var(--mint-600)" : "var(--primary)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {signed
              ? <CheckCircle2 className="w-4 h-4 text-white" />
              : <FileText className="w-4 h-4 text-white" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{instance.formName}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wider"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                {typeCfg.label}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)" }}>
                DOC {index + 1} OF {total}
              </span>
              {(instance.generation ?? 1) > 1 && (
                <span
                  className="text-[8px] font-mono px-1.5 py-px rounded"
                  style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  GEN {instance.generation}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={instance.status} />
        </div>

        {/* Signature bar */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--border)", background: signed ? "var(--mint-50)" : "var(--muted)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: signed ? "var(--mint-100)" : "var(--card)" }}
          >
            {signed
              ? <Check className="w-3.5 h-3.5" style={{ color: "var(--mint-600)", strokeWidth: 2.5 }} />
              : <PenLine className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-semibold"
              style={{ color: signed ? "var(--mint-700)" : "var(--foreground)" }}
            >
              {signed ? "Signature recorded" : "Signature pending"}
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {STATUS_CFG[instance.status]?.label ?? "Draft"}
            </p>
          </div>
        </div>

        {/* Document content */}
        <div style={{ background: "var(--lavender-50)" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--primary)" }} />
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Loading document…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <AlertCircle className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{error}</p>
            </div>
          ) : html ? (
            <div className="px-5 py-4">
              <div
                className="rounded-lg overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
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

function EmptyState({ onRefresh, loading }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}
      >
        <Shield className="w-6 h-6" style={{ color: "var(--lavender-300)" }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
        No contracts generated yet
      </p>
      <p className="text-[11px] mt-1.5 max-w-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        Documents are generated when the crew accepts the offer.
      </p>
      <button
        onClick={onRefresh} disabled={loading}
        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors disabled:opacity-50"
        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}
      >
        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
        Refresh
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContractInstancesPanel({ offerId, offerStatus, className }) {
  const dispatch       = useDispatch();
  const instances      = useSelector(selectInstances);
  const loading        = useSelector(selectInstancesLoading);
  const error          = useSelector(selectInstancesError);
  const viewRole       = useSelector(selectViewRole);

  const [activeIdx, setActiveIdx] = useState(0);
  const retryDoneRef = useRef(false);

  const handleRefresh = useCallback(() => {
    retryDoneRef.current = false;
    dispatch(clearInstances());
    dispatch(clearHtmlCache());
    dispatch(getContractInstancesThunk(offerId));
  }, [dispatch, offerId]);

  useEffect(() => {
    if (!offerId) return;
    retryDoneRef.current = false;
    dispatch(clearInstances());
    dispatch(clearHtmlCache());
    dispatch(getContractInstancesThunk(offerId));
  }, [offerId, offerStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!offerId || loading || instances.length > 0 || retryDoneRef.current) return;
    const t = setTimeout(() => {
      retryDoneRef.current = true;
      dispatch(getContractInstancesThunk(offerId));
    }, 2000);
    return () => clearTimeout(t);
  }, [offerId, loading, instances.length, dispatch]);

  useEffect(() => { setActiveIdx(0); }, [offerId]);

  const activeInstances = dedupByFormKey(
    instances
      .filter((i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  );

  const safeIdx     = Math.min(activeIdx, Math.max(0, activeInstances.length - 1));
  const total       = activeInstances.length;
  const signedCount = activeInstances.filter((i) => isSignedForRole(i.status, viewRole)).length;
  const progress    = total ? Math.round((signedCount / total) * 100) : 0;

  const steps = activeInstances.map((inst) => ({
    id:     inst._id,
    label:  inst.formName,
    status: inst.status,
  }));

  if (loading && instances.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-20", className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--primary)" }} />
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Loading contract documents…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn("rounded-xl px-4 py-3 flex items-center gap-2", className)}
        style={{ background: "#fff1f1", border: "1px solid #fecaca" }}
      >
        <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }} />
        <p className="text-[11px]" style={{ color: "#dc2626" }}>{error}</p>
        <button onClick={handleRefresh} className="ml-auto text-[10px] underline" style={{ color: "#dc2626" }}>
          Retry
        </button>
      </div>
    );
  }

  if (!loading && total === 0) {
    return <EmptyState onRefresh={handleRefresh} loading={loading} />;
  }

  const current = activeInstances[safeIdx];

  return (
    <div className={cn("space-y-5", className)}>

      {/* Bundle bar */}
      <div
        className="rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <Layers className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
          </div>
          <div>
            <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
              Contract Bundle
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {total} documents
              </span>
              {signedCount > 0 && (
                <span className="text-[10px] font-semibold" style={{ color: "var(--mint-600)" }}>
                  · {signedCount} signed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-28 h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--muted)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--mint-500)" }}
            />
          </div>
          <span className="text-[10px] shrink-0" style={{ color: "var(--muted-foreground)" }}>
            {signedCount}/{total}
          </span>
          <button
            onClick={handleRefresh} disabled={loading} title="Refresh"
            className="p-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Stepper */}
      <ContractStepper
        steps={steps}
        activeIndex={safeIdx}
        onSelect={setActiveIdx}
        viewRole={viewRole}
      />

      {/* Active document */}
      {current && (
        <DocumentView
          key={current._id}
          instance={current}
          index={safeIdx}
          total={total}
          viewRole={viewRole}
        />
      )}

      {/* Prev / Next */}
      {total > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            disabled={safeIdx === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            {safeIdx + 1} of {total}
          </span>
          <button
            onClick={() => setActiveIdx((i) => Math.min(total - 1, i + 1))}
            disabled={safeIdx === total - 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}