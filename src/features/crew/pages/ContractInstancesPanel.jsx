/**
 * ContractInstancesPanel.jsx
 *
 * FIXES:
 *  1. After clicking sign → show GREEN "uploading" state while API saves
 *  2. Once API confirms → switch to WHITE + PURPLE signed state with signature image
 *  3. Stay on same document after signing — user clicks Next manually
 *  4. No auto-advance, no sig-signed-chip, no green permanent state
 *  5. Date stamp purple, role label stays purple after signed
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight,
  Layers, Shield, FileText, CheckCircle2, Clock, FileSignature,
  XCircle, PenLine, Check,
} from "lucide-react";
import { cn } from "../../../shared/config/utils";
import { toast } from "sonner";

import {
  getContractInstancesThunk,
  getContractInstanceHtmlThunk,
  clearInstances,
  clearHtmlCache,
  selectInstances,
  selectInstancesLoading,
  selectInstancesError,
} from "../store/contractInstances.slice";

import { selectViewRole } from "../store/viewrole.slice";

import {
  ContractStepper,
  isSignedForRole,
} from "../components/viewoffer/layouts/ContractStepper";

// ── Config ────────────────────────────────────────────────────────────────────

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

const ROLE_FROM_SLOT = { crew: "CREW", upm: "UPM", fc: "FC", studio: "STUDIO" };

function normaliseRole(r = "") {
  if (!r) return "";
  return (ROLE_FROM_SLOT[r.toLowerCase()] ?? r).toUpperCase();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function dedupByFormKey(instances) {
  const map = new Map();
  for (const inst of instances) {
    const key = inst.formKey || inst.formName || inst._id;
    const existing = map.get(key);
    if (!existing || (inst.generation ?? 1) > (existing.generation ?? 1)) map.set(key, inst);
  }
  return Array.from(map.values());
}

function instanceSignedByRole(instance, viewRole) {
  if (!viewRole) return false;
  return !!instance?.signatures?.[viewRole.toLowerCase()]?.signedAt;
}

// ── AutoIframe ────────────────────────────────────────────────────────────────

function AutoIframe({ html, title, onReady }) {
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
          setHeight(
            Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0, 400) + 24
          );
        }
      } catch { setHeight(900); }
      if (onReady && ref.current) onReady(ref.current);
    };

    ref.current.addEventListener("load", onLoad);
    const t = setTimeout(onLoad, 600);
    return () => {
      ref.current?.removeEventListener("load", onLoad);
      clearTimeout(t);
      if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
    };
  }, [html]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <iframe
      ref={ref}
      title={title}
      className="w-full border-0 block"
      style={{ height: `${height}px` }}
      sandbox="allow-same-origin allow-scripts"
      scrolling="no"
    />
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

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

// ── DocumentView ──────────────────────────────────────────────────────────────

function DocumentView({
  instance, index, total, viewRole, canSignRole,
  profileSignature, onSignInstance, onSignedAdvance, onDocSigned,
}) {
  const dispatch   = useDispatch();
  const iframeRef  = useRef(null);
  const canSignRef = useRef(canSignRole);
  const signedRef  = useRef(false);

  const [html,        setHtml       ] = useState(null);
  const [loading,     setLoading    ] = useState(true);
  const [error,       setError      ] = useState(null);
  // uploading = true while API call is in-flight (show green state in sig-box)
  const [uploading,   setUploading  ] = useState(false);

  const alreadySigned = instanceSignedByRole(instance, viewRole);
  const signed        = isSignedForRole(instance.status, viewRole);
  const typeCfg       = TYPE_CFG[instance.displayType] ?? TYPE_CFG.standard;

  const viewRoleUpper = normaliseRole(viewRole);
  const viewRoleLower = viewRoleUpper.toLowerCase();

  useEffect(() => { canSignRef.current = canSignRole;  }, [canSignRole]);
  useEffect(() => { signedRef.current  = alreadySigned; }, [alreadySigned]);
  useEffect(() => () => { iframeRef.current?._sigObs?.disconnect(); }, []);

  // Load HTML
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setHtml(null);
    dispatch(getContractInstanceHtmlThunk(instance._id))
      .then((res) => {
        if (cancelled) return;
        if (res.error)              setError(res.payload?.message || "Failed to load");
        else if (res.payload?.html) setHtml(res.payload.html);
        else                        setError("No content returned");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instance._id, dispatch]);

  // ── getSigBox ────────────────────────────────────────────────────────────
  const getSigBox = useCallback((doc, roleLower) => {
    return (
      doc.querySelector(`#slot-${roleLower}`) ||
      doc.querySelector(`.sig-box[id="slot-${roleLower}"]`) ||
      doc.querySelector(`.sig-box[data-role="${roleLower}"]`)
    );
  }, []);

  // ── markUploading: GREEN state while API is saving ───────────────────────
  const markUploading = useCallback((doc, roleLower, sigUrl) => {
    const sigBox = getSigBox(doc, roleLower);
    if (!sigBox) return;

    const sigLine = sigBox.querySelector(".sig-line");
    if (sigLine) {
      while (sigLine.firstChild) sigLine.removeChild(sigLine.firstChild);

      // Show signature image immediately
      const img = doc.createElement("img");
      img.src = sigUrl;
      img.style.cssText = "display:block;max-height:52px;max-width:100%;object-fit:contain;margin-bottom:2px;opacity:0.7;";
      sigLine.appendChild(img);

      // Green uploading indicator
      const uploadBadge = doc.createElement("div");
      uploadBadge.className = "sig-uploading-badge";
      uploadBadge.style.cssText = [
        "position:absolute", "top:4px", "right:4px",
        "display:inline-flex", "align-items:center", "gap:3px",
        "background:#d1fae5", "color:#059669",
        "font-size:7px", "font-weight:700",
        "padding:2px 6px", "border-radius:6px",
        "text-transform:uppercase", "letter-spacing:.04em",
      ].join(";");
      uploadBadge.innerHTML = `
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
             stroke="#059669" stroke-width="3" style="animation:spin 1s linear infinite;">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
               M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Saving…`;
      sigLine.appendChild(uploadBadge);

      // Inject spin keyframe if not present
      if (!doc.getElementById("sig-spin-style")) {
        const style = doc.createElement("style");
        style.id = "sig-spin-style";
        style.textContent = "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";
        doc.head.appendChild(style);
      }
    }

    sigBox.classList.remove("is-active", "is-locked");
    sigBox.classList.add("is-signed");
    // GREEN while uploading
    sigBox.style.border        = "1.5px solid #10b981";
    sigBox.style.background    = "#f0fdf4";
    sigBox.style.cursor        = "default";
    sigBox.style.pointerEvents = "none";
    sigBox.style.opacity       = "1";

    sigBox.querySelector(".panel-overlay")?.remove();
    sigBox.querySelector(".sig-active-badge")?.remove();

    const roleEl = sigBox.querySelector(".sig-role");
    if (roleEl) roleEl.style.color = "#059669";
  }, [getSigBox]);

  // ── markSigned: WHITE + PURPLE state after API confirms ──────────────────
  const markSigned = useCallback((doc, roleLower, sigUrl) => {
    const sigBox = getSigBox(doc, roleLower);
    if (!sigBox) return;

    const sigLine = sigBox.querySelector(".sig-line");
    if (sigLine) {
      while (sigLine.firstChild) sigLine.removeChild(sigLine.firstChild);

      // Signature image — full opacity now saved
      const img = doc.createElement("img");
      img.src = sigUrl;
      img.style.cssText = "display:block;max-height:52px;max-width:100%;object-fit:contain;margin-bottom:2px;";
      sigLine.appendChild(img);

      // Purple date stamp
      const stamp = doc.createElement("div");
      stamp.style.cssText = "position:absolute;top:2px;right:2px;font-size:7px;color:#6d28d9;font-family:'Courier New',monospace;line-height:1.5;";
      stamp.textContent = new Date().toLocaleDateString("en-GB");
      sigLine.appendChild(stamp);
    }

    sigBox.classList.remove("is-active", "is-locked");
    sigBox.classList.add("is-signed");
    // WHITE + soft purple border — final signed state
    sigBox.style.border        = "1.5px solid #c4b5fd";
    sigBox.style.background    = "#fff";
    sigBox.style.cursor        = "default";
    sigBox.style.pointerEvents = "none";
    sigBox.style.opacity       = "1";

    sigBox.querySelector(".panel-overlay")?.remove();
    sigBox.querySelector(".sig-active-badge")?.remove();
    sigBox.querySelector(".sig-uploading-badge")?.remove();

    // Role label stays purple
    const roleEl = sigBox.querySelector(".sig-role");
    if (roleEl) roleEl.style.color = "#6d28d9";

    // NO sig-signed-chip added
  }, [getSigBox]);

  // ── applySign: green while uploading → purple/white after saved ──────────
  const applySign = useCallback((iframeEl, roleLower) => {
    if (iframeEl.dataset.signing === "1") return;
    if (!profileSignature) {
      toast.error("No saved signature — add one in your profile first");
      return;
    }

    iframeEl.dataset.signing = "1";
    signedRef.current  = true;
    canSignRef.current = false;

    // Step 1: immediately show GREEN uploading state with signature preview
    try {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (doc) markUploading(doc, roleLower, profileSignature);
    } catch (e) { console.warn("markUploading failed:", e); }

    setUploading(true);
    toast.loading("Saving signature…", { id: "sig-save" });

    if (onSignInstance) {
      const appRole = ROLE_FROM_SLOT[roleLower] ?? roleLower.toUpperCase();
      onSignInstance(instance._id, { role: appRole, signatureUrl: profileSignature })
        .then(() => {
          // Step 2: API saved — switch to WHITE + PURPLE final state
          try {
            const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
            if (doc) markSigned(doc, roleLower, profileSignature);
          } catch (e) { console.warn("markSigned failed:", e); }

          setUploading(false);
          toast.success("Signature saved!", { id: "sig-save" });

          if (onDocSigned) onDocSigned(instance._id, appRole);
        })
        .catch((err) => {
          console.error("Sign API failed:", err);
          // Revert — restore click-to-sign state
          signedRef.current        = false;
          canSignRef.current       = true;
          iframeEl.dataset.signing = "0";
          setUploading(false);
          toast.error("Could not save — please try again", { id: "sig-save" });

          // Re-apply slot states to restore the click overlay
          try {
            const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
            if (doc) {
              const sigBox = getSigBox(doc, roleLower);
              if (sigBox) {
                sigBox.classList.remove("is-signed");
                sigBox.classList.add("is-active");
                sigBox.style.border        = "1.5px dashed #7c3aed";
                sigBox.style.background    = "#faf9ff";
                sigBox.style.cursor        = "pointer";
                sigBox.style.pointerEvents = "auto";
                sigBox.style.opacity       = "1";
                const roleEl = sigBox.querySelector(".sig-role");
                if (roleEl) roleEl.style.color = "#6d28d9";
              }
            }
          } catch {}
        });
    } else {
      // No API handler — just go straight to final signed state
      try {
        const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
        if (doc) markSigned(doc, roleLower, profileSignature);
      } catch (e) { console.warn("markSigned failed:", e); }
      setUploading(false);
      toast.success("Signed!", { id: "sig-save" });
    }

    // NO auto-advance — user clicks Next manually
  }, [profileSignature, onSignInstance, onDocSigned, instance._id, markUploading, markSigned, getSigBox]);

  // ── buildClickOverlay ────────────────────────────────────────────────────
  const buildClickOverlay = useCallback((doc, iframeEl, roleLower) => {
    const overlay = doc.createElement("div");
    overlay.className = "panel-overlay";
    overlay.style.cssText = [
      "display:flex", "flex-direction:column", "align-items:center",
      "justify-content:center", "gap:5px",
      "width:100%", "min-height:56px",
      "border:2px dashed #7c3aed",
      "border-radius:6px", "background:#faf9ff",
      "cursor:pointer",
      "transition:background 0.15s,border-color 0.15s",
    ].join(";");
    overlay.innerHTML = `
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
           stroke="#7c3aed" stroke-width="1.5" style="pointer-events:none;">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5
             0 013.536 3.536L12.536 16.536 8 18 9.464 13.536z"/>
      </svg>
      <span style="font-size:9px;font-weight:700;color:#7c3aed;
                   text-transform:uppercase;letter-spacing:.06em;pointer-events:none;">
        Click to sign
      </span>`;

    overlay.addEventListener("mouseenter", () => {
      overlay.style.background  = "#ede9fe";
      overlay.style.borderColor = "#6d28d9";
    });
    overlay.addEventListener("mouseleave", () => {
      overlay.style.background  = "#faf9ff";
      overlay.style.borderColor = "#7c3aed";
    });
    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canSignRef.current || signedRef.current) return;
      applySign(iframeEl, roleLower);
    });
    return overlay;
  }, [applySign]);

  // ── updateSlotStates ─────────────────────────────────────────────────────
  const updateSlotStates = useCallback((iframeEl) => {
    try {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!doc) return;

      const isActive = canSignRef.current && !signedRef.current;

      ["crew", "upm", "fc", "studio"].forEach((role) => {
        const sigBox = getSigBox(doc, role);
        if (!sigBox) return;

        const sigLine = sigBox.querySelector(".sig-line");

        // Already has real signature img → ensure marked signed, skip
        if (sigLine?.querySelector("img")) {
          sigBox.classList.remove("is-active", "is-locked");
          sigBox.classList.add("is-signed");
          sigBox.style.pointerEvents = "none";
          return;
        }

        const isMySlot = role === viewRoleLower;
        const isMine   = isActive && isMySlot;

        sigBox.querySelector(".panel-overlay")?.remove();
        sigBox.querySelector(".sig-active-badge")?.remove();

        if (isMine) {
          sigBox.classList.remove("is-locked");
          sigBox.classList.add("is-active");
          sigBox.style.cursor        = "pointer";
          sigBox.style.opacity       = "1";
          sigBox.style.pointerEvents = "auto";

          if (sigLine) {
            while (sigLine.firstChild) sigLine.removeChild(sigLine.firstChild);
            sigLine.appendChild(buildClickOverlay(doc, iframeEl, role));
          }
        } else {
          sigBox.classList.remove("is-active");
          if (!sigBox.classList.contains("is-signed")) {
            sigBox.classList.add("is-locked");
            sigBox.style.opacity       = "0.45";
            sigBox.style.cursor        = "not-allowed";
            sigBox.style.pointerEvents = "none";
          }
        }
      });

    } catch (err) { console.warn("updateSlotStates:", err); }
  }, [viewRoleLower, getSigBox, buildClickOverlay]);

  // ── handleIframeReady ────────────────────────────────────────────────────
  const handleIframeReady = useCallback((iframeEl) => {
    iframeRef.current = iframeEl;
    updateSlotStates(iframeEl);

    try {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!doc) return;

      const win = iframeEl.contentWindow;
      if (win) {
        const noop = () => {};
        [
          "openSignDialog","showSignatureDialog","signDoc","applySignature",
          "openModal","showModal","signModal","drawSignature","typeSignature",
          "getSignatureImage","clearSignature","showSign","openSign",
          "launchSignDialog","activateNext",
        ].forEach((fn) => { try { win[fn] = noop; } catch {} });
      }

      const obs = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            const cls = (typeof node.className === "string" ? node.className : "").toLowerCase();
            const id  = (node.id || "").toLowerCase();
            const bad =
              cls.includes("modal") || cls.includes("dialog") ||
              cls.includes("sign-overlay") || cls.includes("sig-toast") ||
              id.includes("modal") || id.includes("sign-dialog") ||
              node.style?.position === "fixed" ||
              node.textContent?.includes("SIGN:") ||
              node.textContent?.includes("APPLY SIGNATURE") ||
              node.textContent?.includes("Draw or type");
            if (bad) node.remove();
          }
        }
      });
      const target = doc.body || doc.documentElement;
      if (target) {
        obs.observe(target, { childList: true, subtree: true });
        iframeEl._sigObs = obs;
      }
    } catch (err) { console.warn("handleIframeReady:", err); }
  }, [updateSlotStates]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) updateSlotStates(iframe);
  }, [canSignRole, alreadySigned, updateSlotStates]);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200 space-y-3">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${signed ? "var(--mint-200)" : "var(--border)"}` }}
      >
        {/* Header */}
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
              : <FileText className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{instance.formName}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", borderColor: "rgba(255,255,255,0.3)" }}
              >
                {typeCfg.label}
              </span>
              <span
                className="text-[8px] font-mono uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
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

        {/* Status bar */}
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
              : uploading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--mint-600)" }} />
                : <PenLine className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-semibold"
              style={{ color: signed ? "var(--mint-700)" : uploading ? "var(--mint-700)" : "var(--foreground)" }}
            >
              {signed
                ? "Signature recorded"
                : uploading
                  ? "Saving signature…"
                  : canSignRole && !alreadySigned
                    ? "Click your signature field inside the document to sign"
                    : "Signature pending"}
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {STATUS_CFG[instance.status]?.label ?? "Draft"}
            </p>
          </div>
          {canSignRole && !alreadySigned && !signed && !uploading && (
            <span
              className="text-[9px] font-bold px-2 py-1 rounded-lg animate-pulse"
              style={{ background: "var(--lavender-100)", color: "var(--lavender-700)", border: "1px solid var(--lavender-200)" }}
            >
              ↓ Sign below
            </span>
          )}
          {uploading && (
            <span
              className="text-[9px] font-bold px-2 py-1 rounded-lg"
              style={{ background: "var(--mint-100)", color: "var(--mint-700)", border: "1px solid var(--mint-200)" }}
            >
              Uploading…
            </span>
          )}
        </div>

        {/* Document iframe */}
        <div className="relative" style={{ background: "var(--lavender-50)" }}>
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
                <AutoIframe html={html} title={instance.formName} onReady={handleIframeReady} />
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
      <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>No contracts generated yet</p>
      <p className="text-[11px] mt-1.5 max-w-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        Documents are generated when the crew accepts the offer.
      </p>
      <button
        onClick={onRefresh} disabled={loading}
        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors disabled:opacity-50"
        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}
      >
        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} /> Refresh
      </button>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function ContractInstancesPanel({
  offerId, offerStatus, className, canSignRole = false,
  profileSignature, onSignInstance, isSubmitting = false,
  onAllSigned,
}) {
  const dispatch  = useDispatch();
  const instances = useSelector(selectInstances);
  const loading   = useSelector(selectInstancesLoading);
  const error     = useSelector(selectInstancesError);
  const viewRole  = useSelector(selectViewRole);

  const [activeIdx, setActiveIdx] = useState(0);
  const signedThisSessionRef = useRef(new Set());
  const retryDoneRef = useRef(false);

  const handleRefresh = useCallback(() => {
    retryDoneRef.current = false;
    signedThisSessionRef.current = new Set();
    dispatch(clearInstances());
    dispatch(clearHtmlCache());
    dispatch(getContractInstancesThunk(offerId));
  }, [dispatch, offerId]);

  useEffect(() => {
    if (!offerId) return;
    retryDoneRef.current = false;
    signedThisSessionRef.current = new Set();
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

  useEffect(() => {
    setActiveIdx(0);
    signedThisSessionRef.current = new Set();
  }, [offerId]);

  const activeInstances = dedupByFormKey(
    instances
      .filter((i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  );

  const safeIdx     = Math.min(activeIdx, Math.max(0, activeInstances.length - 1));
  const total       = activeInstances.length;
  const signedCount = activeInstances.filter((i) => isSignedForRole(i.status, viewRole)).length;
  const progress    = total ? Math.round((signedCount / total) * 100) : 0;
  const steps       = activeInstances.map((inst) => ({
    id: inst._id, label: inst.formName, status: inst.status,
  }));

  // onSignedAdvance kept for prop compatibility but not called automatically
  const handleSignedAdvance = useCallback(() => {
    setActiveIdx((prev) => Math.min(prev + 1, total - 1));
  }, [total]);

  const handleDocSigned = useCallback((instanceId, role) => {
    signedThisSessionRef.current.add(instanceId);

    const alreadyIds = new Set(
      activeInstances.filter((i) => isSignedForRole(i.status, viewRole)).map((i) => i._id)
    );
    const totalSignedNow = new Set([...alreadyIds, ...signedThisSessionRef.current]).size;

    console.log(`[Panel] signed ${instanceId}. total=${totalSignedNow}/${total}`);

    if (totalSignedNow >= total && total > 0) {
      toast.success("All documents signed!");
      setTimeout(() => { if (onAllSigned) onAllSigned(role); }, 1200);
    }
  }, [activeInstances, viewRole, total, onAllSigned]);

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

  if (!loading && total === 0) return <EmptyState onRefresh={handleRefresh} loading={loading} />;

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
            <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>Contract Bundle</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{total} documents</span>
              {signedCount > 0 && (
                <span className="text-[10px] font-semibold" style={{ color: "var(--mint-600)" }}>
                  · {signedCount} signed
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
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

      <ContractStepper
        steps={steps} activeIndex={safeIdx}
        onSelect={setActiveIdx} viewRole={viewRole}
      />

      {current && (
        <DocumentView
          key={current._id}
          instance={current}
          index={safeIdx}
          total={total}
          viewRole={viewRole}
          canSignRole={canSignRole}
          profileSignature={profileSignature}
          onSignInstance={onSignInstance}
          onSignedAdvance={handleSignedAdvance}
          onDocSigned={handleDocSigned}
        />
      )}

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

      {canSignRole && signedCount > 0 && signedCount < total && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--mint-600)" }} />
            <p className="text-[12px]" style={{ color: "var(--mint-700)" }}>
              <strong>{signedCount}</strong> of <strong>{total}</strong> documents signed.
            </p>
          </div>
          {safeIdx < total - 1 && (
            <button
              onClick={() => setActiveIdx(safeIdx + 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold"
              style={{ background: "var(--mint-600)", color: "white" }}
            >
              Next Doc <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}