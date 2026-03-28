/**
 * InDocumentSigner.jsx
 *
 * FIX 1: AgreeAndSignDialog now fetches the real profile signature from
 * GET /signatures/:contractId/profile-check instead of using a hardcoded
 * broken mock base64 string.
 *
 * FIX 2: base64 string is sanitized — newlines/whitespace stripped, double
 * prefix removed, so the data URL is always valid.
 *
 * FIX 3 (production-safe): Signature is rendered via Blob URL instead of
 * inline base64. This eliminates ERR_INVALID_URL permanently — even when
 * React StrictMode double-renders corrupt the base64 state between renders.
 * Blob URLs are revoked on component unmount to prevent memory leaks.
 *
 * FIX 4: useProfileSignature no longer bails when contractId is null.
 *   The backend profile-check endpoint only uses req.user._id — contractId
 *   in the URL is irrelevant. We use "me" as a sentinel so the fetch always
 *   fires, even before contractId has resolved from the parent.
 *
 * FIX 5: Render guard between sigLoading→false and blobUrl→set.
 *   When hasSignature=true but blobUrl is still null (async gap between
 *   state updates), show a spinner instead of "No profile signature found".
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch }    from "react-redux";
import {
  AlertCircle, CheckCircle2, FileText, Loader2,
  PenLine, ShieldCheck, X,
} from "lucide-react";
import { cn }        from "../../../../shared/config/utils";
import axiosConfig   from "../../../auth/config/axiosConfig";
import { getContractInstanceHtmlThunk } from "../../store/contractInstances.slice";
import { isSignedForRole }              from "../../components/viewoffer/layouts/ContractStepper";

// ── Role colours ───────────────────────────────────────────────────────────────

const ROLE_COLOR = {
  CREW:   { btn: "#7c3aed", light: "#f5f3ff", border: "#c4b5fd", text: "#5b21b6" },
  UPM:    { btn: "#0284c7", light: "#f0f9ff", border: "#7dd3fc", text: "#0369a1" },
  FC:     { btn: "#d97706", light: "#fffbeb", border: "#fcd34d", text: "#92400e" },
  STUDIO: { btn: "#059669", light: "#f0fdf4", border: "#6ee7b7", text: "#065f46" },
};

const ROLE_LABEL = {
  CREW:   "Crew Member",
  UPM:    "Unit Production Manager",
  FC:     "Financial Controller",
  STUDIO: "Production Executive",
};

const OFFER_STATUS_FOR_ROLE = {
  CREW:   "PENDING_CREW_SIGNATURE",
  UPM:    "PENDING_UPM_SIGNATURE",
  FC:     "PENDING_FC_SIGNATURE",
  STUDIO: "PENDING_STUDIO_SIGNATURE",
};

// ── normalizeSignatureImage ────────────────────────────────────────────────────

const normalizeSignatureImage = (raw) => {
  if (!raw) return null;

  let img = raw.trim();

  // Remove duplicate prefix if present
  img = img.replace(
    /^data:image\/png;base64,data:image\/png;base64,/,
    "data:image/png;base64,"
  );

  // Strip ALL whitespace/newlines from entire string
  img = img.replace(/\s+/g, "");

  // Add prefix if missing entirely
  if (!img.startsWith("data:image")) {
    img = "data:image/png;base64," + img;
  }

  return img;
};

// ── base64ToBlobUrl ────────────────────────────────────────────────────────────

const base64ToBlobUrl = (base64String) => {
  try {
    if (!base64String) return null;

    if (base64String.startsWith("blob:")) return base64String;

    const cleanedBase64 = base64String.includes("base64,")
      ? base64String.split("base64,")[1]
      : base64String;

    if (!cleanedBase64) {
      console.error("[base64ToBlobUrl] Empty base64 payload after stripping prefix");
      return null;
    }

    const byteCharacters = atob(cleanedBase64);
    const byteNumbers    = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("[base64ToBlobUrl] conversion failed:", err);
    return null;
  }
};

// ── useProfileSignature ────────────────────────────────────────────────────────
// FIX 4: No longer bails on null contractId.
// The backend only uses req.user._id for profile-check — contractId in the
// URL path is irrelevant. We fall back to "me" so the fetch always fires.

function useProfileSignature(contractId) {
  const [signatureImage, setSignatureImage] = useState(null);
  const [hasSignature,   setHasSignature  ] = useState(false);
  const [loading,        setLoading       ] = useState(true);
  const [error,          setError         ] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // FIX 4: use "me" as sentinel — never block on missing contractId
    const resolvedId = contractId || "me";

    // Guard against React StrictMode double-invoke in dev
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    const doFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosConfig.get(
          `/signatures/${resolvedId}/profile-check`,
          { headers: { "x-view-as-role": localStorage.getItem("viewRole") || "CREW" } }
        );
        if (cancelled) return;

        const data = res.data?.data ?? res.data ?? {};
        setHasSignature(!!data.hasSignature);

        const normalized = normalizeSignatureImage(data.signatureImage ?? null);
        setSignatureImage(normalized);

      } catch (err) {
        if (!cancelled) {
          console.warn("[useProfileSignature] fetch failed:", err.message);
          setError(err.response?.data?.message || err.message || "Could not load signature");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [contractId]);

  return { signatureImage, hasSignature, loading, error };
}

// ── AgreeAndSignDialog ─────────────────────────────────────────────────────────

function AgreeAndSignDialog({ role, contractId, offerCode, formName, onConfirm, onClose, isLoading }) {
  const [agreed, setAgreed] = useState(false);
  const col   = ROLE_COLOR[role] || ROLE_COLOR.CREW;
  const label = ROLE_LABEL[role] || role;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const { signatureImage, hasSignature, loading: sigLoading } = useProfileSignature(contractId);

  // Convert base64 → Blob URL. Revoke on unmount / signatureImage change.
  const [blobUrl, setBlobUrl] = useState(null);
  useEffect(() => {
    const url = base64ToBlobUrl(signatureImage);
    setBlobUrl(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [signatureImage]);

  // FIX 5: true when fetch is done but blob conversion hasn't settled yet
  const isConverting = !sigLoading && hasSignature && !blobUrl;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "min(440px, calc(100vw - 32px))",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: col.btn, padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck style={{ width: 20, height: 20, color: "#fff" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Sign as {label}</div>
              {offerCode && (
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2 }}>
                  {offerCode}{formName ? ` · ${formName}` : ""}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X style={{ width: 18, height: 18, color: "rgba(255,255,255,0.8)" }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 0" }}>
          {/* Signature preview box */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
            }}>
              Your profile signature
            </div>
            <div style={{
              background: col.light, border: `2px solid ${col.border}`,
              borderRadius: 10, padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 72,
            }}>
              {/* Loading state — fetch in progress */}
              {sigLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader2 style={{ width: 16, height: 16, color: col.btn, animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 12, color: col.text }}>Loading signature…</span>
                </div>
              )}

              {/* FIX 5: Converting state — fetch done, blob not yet ready */}
              {isConverting && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader2 style={{ width: 16, height: 16, color: col.btn, animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 12, color: col.text }}>Preparing signature…</span>
                </div>
              )}

              {/* Signature image — blob URL ready */}
              {!sigLoading && !isConverting && blobUrl && (
                <img
                  src={blobUrl}
                  alt="Your signature"
                  style={{ maxHeight: 54, maxWidth: "100%", objectFit: "contain", display: "block" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}

              {/* No signature found — fetch done, no image, not converting */}
              {!sigLoading && !isConverting && !blobUrl && (
                <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
                  No profile signature found — please set one up in your profile settings.
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6, textAlign: "right" }}>
              Signed: {today}
            </div>
          </div>

          {/* Warning if no signature */}
          {!sigLoading && !hasSignature && (
            <div style={{
              background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8,
              padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#9a3412",
            }}>
              ⚠ You don't have a profile signature set up. Please add one in your profile before signing.
            </div>
          )}

          {/* Confirmation checkbox */}
          <label style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            background: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: 10, padding: "12px 14px", cursor: "pointer", marginBottom: 16,
          }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!hasSignature && !sigLoading}
              style={{ marginTop: 2, accentColor: col.btn, width: 16, height: 16, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
              I confirm that I have read and understood the terms of this contract,
              and I agree to sign it electronically using my saved profile signature.
              I understand this has the same legal effect as a handwritten signature.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, padding: "0 20px 20px" }}>
          <button onClick={onClose} disabled={isLoading} style={{
            flex: 1, height: 42, borderRadius: 10,
            border: "1px solid #d1d5db", background: "#fff", color: "#6b7280",
            fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: isLoading ? 0.5 : 1,
          }}>
            Cancel
          </button>
          <button
            onClick={() => agreed && hasSignature && onConfirm()}
            disabled={!agreed || isLoading || !hasSignature || sigLoading || isConverting}
            style={{
              flex: 1.5, height: 42, borderRadius: 10, border: "none",
              background: agreed && hasSignature && !isConverting ? col.btn : "#d1d5db",
              color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: agreed && hasSignature && !isLoading && !isConverting ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.2s",
            }}
          >
            {isLoading
              ? <><Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> Saving…</>
              : <><PenLine style={{ width: 15, height: 15 }} /> Sign Now</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AutoIframe ─────────────────────────────────────────────────────────────────

function AutoIframe({ html, title, iframeRef, scrollToSig, viewRole, onScrollDone }) {
  const blobRef     = useRef(null);
  const observerRef = useRef(null);
  const timersRef   = useRef([]);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "IFRAME_HEIGHT" && typeof e.data.height === "number")
        setHeight((prev) => Math.max(prev, e.data.height));
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!html || !iframeRef.current) return;
    if (blobRef.current)     URL.revokeObjectURL(blobRef.current);
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const blob = new Blob([html], { type: "text/html; charset=utf-8" });
    blobRef.current = URL.createObjectURL(blob);
    iframeRef.current.src = blobRef.current;

    const measureHeight = () => {
      try {
        const d = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (!d) return;
        setHeight(Math.max(d.documentElement.scrollHeight, d.documentElement.offsetHeight, d.body?.scrollHeight || 0, 400) + 40);
      } catch { setHeight(900); }
    };

    const onLoad = () => {
      measureHeight();
      try {
        const d = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (d?.body) {
          observerRef.current = new MutationObserver(measureHeight);
          observerRef.current.observe(d.body, { childList: true, subtree: true });
        }
      } catch { /* sandboxed */ }
      [600, 1200, 2000].forEach((ms) => { timersRef.current.push(setTimeout(measureHeight, ms)); });
    };

    iframeRef.current.addEventListener("load", onLoad);
    return () => {
      iframeRef.current?.removeEventListener("load", onLoad);
      if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
    };
  }, [html]);

  useEffect(() => {
    if (!scrollToSig) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const scrollAndHighlight = () => {
      try {
        const d = iframe.contentDocument || iframe.contentWindow?.document;
        if (!d) return;
        const patterns = {
          CREW: /crew\s*member|employee\s*sig|crew/i,
          UPM: /unit\s*production\s*manager|\bupm\b/i,
          FC: /financial\s*controller|\bfc\b/i,
          STUDIO: /production\s*executive|approved|studio/i,
        };
        let target = null;
        for (const container of d.querySelectorAll(".sig-item, .sig-box, [data-role]")) {
          if (patterns[viewRole]?.test(container.textContent)) { target = container; break; }
        }
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          const orig = target.style.outline;
          target.style.outline = "3px solid #7c3aed";
          target.style.borderRadius = "8px";
          setTimeout(() => { target.style.outline = orig; target.style.borderRadius = ""; }, 2000);
        }
      } catch { /* sandboxed */ }
      onScrollDone?.();
    };
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc?.readyState === "complete") scrollAndHighlight();
    else iframe.addEventListener("load", scrollAndHighlight, { once: true });
  }, [scrollToSig, viewRole, onScrollDone]);

  return (
    <iframe
      ref={iframeRef} title={title}
      className="w-full border-0 block"
      style={{ height: `${height}px`, transition: "height 0.2s ease" }}
      sandbox="allow-same-origin allow-scripts allow-forms"
      scrolling="no"
    />
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function InDocumentSigner({
  instance, index, total, viewRole, onSign,
  isSubmitting, offerStatus, scrollToCanvas = false, onScrollDone = null,
}) {
  const dispatch  = useDispatch();
  const iframeRef = useRef(null);
  const [rawHtml,    setRawHtml   ] = useState(null);
  const [loading,    setLoading   ] = useState(true);
  const [error,      setError     ] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const signed     = isSignedForRole(instance.status, viewRole);
  const isMyTurn   = offerStatus === OFFER_STATUS_FOR_ROLE[viewRole] && ["CREW","UPM","FC","STUDIO"].includes(viewRole);
  const contractId = instance.contractId?.toString?.() ?? null;

  const fetchHtml = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await dispatch(getContractInstanceHtmlThunk(instance._id));
    if (res.error) setError(res.payload?.message || "Failed to load document");
    else           setRawHtml(res.payload?.html || "");
    setLoading(false);
  }, [dispatch, instance._id]);

  useEffect(() => { fetchHtml(); }, [fetchHtml]);

  const handleSignConfirm = useCallback(async () => {
    setShowDialog(false);
    await onSign?.(viewRole);
    await fetchHtml();
  }, [viewRole, onSign, fetchHtml]);

  const headerBg = signed ? "bg-emerald-600" : isMyTurn ? "bg-violet-700" : "bg-neutral-700";
  const col = ROLE_COLOR[viewRole] || ROLE_COLOR.CREW;

  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
      <div className={cn("flex items-center gap-3 px-4 py-3", headerBg)}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          {signed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-semibold truncate">{instance.formName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[8px] font-bold px-1.5 py-px rounded border bg-white/20 text-white border-white/30 uppercase tracking-wider">
              {instance.displayType || "contract"}
            </span>
            <span className="text-[8px] text-white/70 font-mono uppercase">DOC {index + 1} OF {total}</span>
            {(instance.generation ?? 1) > 1 && (
              <span className="text-[8px] font-mono text-white/70 bg-white/10 px-1.5 py-px rounded border border-white/20">
                GEN {instance.generation}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full border bg-white/20 text-white border-white/30">
          {signed ? "✓ Signed" : isMyTurn ? "✍ Your turn" : "⏳ Pending"}
        </div>
      </div>

      <div className="bg-[#f0eef8]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            <p className="text-[11px] text-neutral-500">Loading document…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-400" />
            <p className="text-[11px] text-neutral-400">{error}</p>
            <button onClick={fetchHtml} className="text-[10px] text-violet-500 underline">Retry</button>
          </div>
        ) : rawHtml ? (
          <div className="px-5 pt-4 pb-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200/60">
              <AutoIframe
                html={rawHtml} title={instance.formName} iframeRef={iframeRef}
                scrollToSig={scrollToCanvas} viewRole={viewRole} onScrollDone={onScrollDone}
              />
            </div>

            {isMyTurn && !isSubmitting && !signed && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  onClick={() => setShowDialog(true)}
                  style={{
                    background: col.btn, border: "none", color: "#fff",
                    borderRadius: 10, padding: "12px 32px", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    boxShadow: `0 4px 12px ${col.btn}55`,
                  }}
                >
                  <PenLine style={{ width: 16, height: 16 }} />
                  Agree &amp; Sign — {ROLE_LABEL[viewRole] || viewRole}
                </button>
                <p className="text-[10px] text-neutral-500 text-center max-w-xs">
                  Review the document above, then click to sign using your saved profile signature.
                </p>
              </div>
            )}

            {signed && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <p className="text-[12px] text-emerald-600 font-medium">Signed by {ROLE_LABEL[viewRole] || viewRole}</p>
              </div>
            )}

            {isSubmitting && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                <p className="text-[11px] text-violet-600 font-medium">Saving signature…</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {showDialog && (
        <AgreeAndSignDialog
          role={viewRole}
          contractId={contractId}
          offerCode={instance.offerCode}
          formName={instance.formName}
          onConfirm={handleSignConfirm}
          onClose={() => setShowDialog(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}