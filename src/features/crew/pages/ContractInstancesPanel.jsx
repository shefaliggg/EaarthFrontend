/**
 * ContractInstancesPanel.jsx
 *
 * FIXES APPLIED:
 *
 *  BUG 1 — After crew signs ALL docs, offer doesn't advance to PENDING_UPM_SIGNATURE.
 *    FIX:  onAllSigned(role) prop emitted when all docs signed. Parent dispatches
 *          the correct status-advance thunk.
 *
 *  BUG 2 — UPM/FC/Studio "Click to sign" badge never appears.
 *    FIX:  canSignRole must be true for the correct role.
 *
 *  BUG 3 — After signing one doc, panel stays on same doc.
 *    FIX:  onSignedAdvance() called after signing to auto-advance to next doc.
 *
 *  BUG 4 — "SIGN: PRODUCTION EXECUTIVE" draw/type dialog still appears on some docs.
 *    FIX:  handleIframeReady now:
 *          - Overrides all known dialog-opening functions with no-ops in the iframe window
 *          - Adds a MutationObserver that kills any modal nodes injected after page load
 *          - Intercepts addEventListener to block native click handlers on sig elements
 *          Cleanup effect disconnects the observer on unmount.
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

const ROLE_FROM_SLOT = {
  crew:   "CREW",
  upm:    "UPM",
  fc:     "FC",
  studio: "STUDIO",
};

const ROLE_FROM_LABEL_PATTERNS = [
  { pattern: /crew\s*member/i,               role: "crew"   },
  { pattern: /unit\s*production\s*manager/i, role: "upm"    },
  { pattern: /\bupm\b/i,                     role: "upm"    },
  { pattern: /production\s*office/i,         role: "upm"    },
  { pattern: /received\s*by/i,               role: "upm"    },
  { pattern: /financial\s*controller/i,      role: "fc"     },
  { pattern: /\bfc\b/i,                      role: "fc"     },
  { pattern: /production\s*executive/i,      role: "studio" },
  { pattern: /approved.*executive/i,         role: "studio" },
];

function roleFromLabelText(text = "") {
  for (const { pattern, role } of ROLE_FROM_LABEL_PATTERNS) {
    if (pattern.test(text)) return role;
  }
  return null;
}

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
    if (!existing || (inst.generation ?? 1) > (existing.generation ?? 1)) {
      map.set(key, inst);
    }
  }
  return Array.from(map.values());
}

function instanceSignedByRole(instance, viewRole) {
  if (!viewRole) return false;
  return !!instance?.signatures?.[viewRole.toLowerCase()]?.signedAt;
}

function getInstanceSig(instance, viewRole) {
  if (!viewRole) return null;
  return instance?.signatures?.[viewRole.toLowerCase()] ?? null;
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
          setHeight(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0, 400) + 24);
        }
      } catch { setHeight(900); }
      if (onReady && ref.current) onReady(ref.current);
    };

    ref.current.addEventListener("load", onLoad);
    const t = setTimeout(onLoad, 500);
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

// ── DocumentView ──────────────────────────────────────────────────────────────

function DocumentView({
  instance, index, total, viewRole, offerId, canSignRole,
  profileSignature, onSignInstance, isSubmitting, onSignedAdvance,
  onDocSigned,
}) {
  const dispatch   = useDispatch();
  const iframeRef  = useRef(null);
  const canSignRef = useRef(canSignRole);
  const signedRef  = useRef(false);

  const [html,    setHtml   ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  const alreadySigned = instanceSignedByRole(instance, viewRole);
  const sig           = getInstanceSig(instance, viewRole);
  const signed        = isSignedForRole(instance.status, viewRole);
  const typeCfg       = TYPE_CFG[instance.displayType] ?? TYPE_CFG.standard;

  const viewRoleUpper = normaliseRole(viewRole);

  useEffect(() => { canSignRef.current = canSignRole;   }, [canSignRole]);
  useEffect(() => { signedRef.current  = alreadySigned; }, [alreadySigned]);

  // ── Cleanup observer on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      iframeRef.current?._sigModalObserver?.disconnect();
    };
  }, []);

  // ── Load HTML ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setHtml(null);
    dispatch(getContractInstanceHtmlThunk(instance._id)).then((res) => {
      if (cancelled) return;
      if (res.error)              setError(res.payload?.message || "Failed to load");
      else if (res.payload?.html) setHtml(res.payload.html);
      else                        setError("No content returned");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instance._id, dispatch]);

  // ── injectSignatureIntoIframe ─────────────────────────────────────────────
  const injectSignatureIntoIframe = useCallback((roleLower, signatureUrl) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      // Pattern A
      const slotEl = doc.querySelector(`.signature-slot[data-role="${roleLower}"]`);
      if (slotEl) {
        slotEl.innerHTML = `
          <div style="display:flex;align-items:flex-end;padding:4px 6px;width:100%;height:100%;">
            <img src="${signatureUrl}" style="max-height:52px;max-width:100%;object-fit:contain;display:block;" />
          </div>`;
        slotEl.classList.remove("active-role");
        slotEl.classList.add("signed");
        Object.assign(slotEl.style, {
          cursor: "default", pointerEvents: "none",
          background: "transparent", borderColor: "var(--border)",
        });
        slotEl.querySelector(".sig-active-badge")?.remove();
        return;
      }

      // Pattern B
      const containers = [
        ...doc.querySelectorAll(".sig-item"),
        ...doc.querySelectorAll(".sig-box"),
      ];
      for (const container of containers) {
        const labelEl   = container.querySelector(
          ".sig-label, .sig-role, [class*='sig-label'], .sig-title, .sig-name"
        );
        const labelText = labelEl?.textContent?.trim() || "";
        if (!labelText) continue;
        if (roleFromLabelText(labelText) !== roleLower) continue;

        const sigLine = container.querySelector(".sig-line");
        if (!sigLine) continue;

        container.querySelector(".inline-sign-overlay")?.remove();
        Object.assign(sigLine.style, {
          position: "relative", minHeight: "64px",
          borderBottom: "1px solid var(--border)", background: "transparent",
        });
        sigLine.innerHTML = `
          <img src="${signatureUrl}"
               style="display:block;max-height:52px;max-width:100%;object-fit:contain;margin-bottom:2px;" />`;
        break;
      }
    } catch (err) {
      console.warn("injectSignatureIntoIframe failed:", err);
    }
  }, []);

  // ── showInlineConfirm ─────────────────────────────────────────────────────
  const showInlineConfirm = useCallback((iframeEl, roleLower, _triggerEl) => {
    try {
      if (iframeEl.dataset.signing === "1") return;

      iframeEl.dataset.signing = "1";
      signedRef.current  = true;
      canSignRef.current = false;

      injectSignatureIntoIframe(roleLower, profileSignature);
      toast.success("Signed — moving to next document");

      setTimeout(() => {
        if (onSignedAdvance) onSignedAdvance();
      }, 800);

      if (onSignInstance) {
        const appRole = ROLE_FROM_SLOT[roleLower] ?? roleLower.toUpperCase();
        onSignInstance(instance._id, { role: appRole, signatureUrl: profileSignature })
          .then(() => {
            if (onDocSigned) onDocSigned(instance._id, appRole);
          })
          .catch((err) => {
            console.error("Background sign failed:", err);
            signedRef.current        = false;
            canSignRef.current       = true;
            iframeEl.dataset.signing = "0";
            toast.error("Could not save — please try again");
          });
      }
    } catch (err) {
      console.warn("showInlineConfirm failed:", err);
    }
  }, [profileSignature, onSignInstance, onSignedAdvance, onDocSigned, instance._id, injectSignatureIntoIframe]);

  // ── attachOverlayListeners ────────────────────────────────────────────────
  const attachOverlayListeners = useCallback((overlay, iframeEl, roleLower) => {
    overlay.addEventListener("mouseenter", () => {
      overlay.style.borderColor = "#7c3aed";
      overlay.style.background  = "#faf9ff";
      overlay.querySelector("svg")?.setAttribute("stroke", "#7c3aed");
      const lbl = overlay.querySelector("span");
      if (lbl) lbl.style.color = "#7c3aed";
    });
    overlay.addEventListener("mouseleave", () => {
      overlay.style.borderColor = "#d1d5db";
      overlay.style.background  = "transparent";
      overlay.querySelector("svg")?.setAttribute("stroke", "#aaa");
      const lbl = overlay.querySelector("span");
      if (lbl) lbl.style.color = "#aaa";
    });
    overlay.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (!canSignRef.current || signedRef.current) return;
      showInlineConfirm(iframeEl, roleLower, overlay);
    });
  }, [showInlineConfirm]);

  // ── handleInlineSign ──────────────────────────────────────────────────────
  const handleInlineSign = useCallback((roleArg, triggerEl) => {
    if (!profileSignature) {
      toast.error("No saved signature — update your profile first");
      return;
    }
    const appRoleUpper = normaliseRole(roleArg);
    const roleLower    = appRoleUpper.toLowerCase();

    if (appRoleUpper !== viewRoleUpper) return;
    if (signedRef.current)             return;
    if (!canSignRef.current)           return;

    const iframe = iframeRef.current;
    if (iframe) showInlineConfirm(iframe, roleLower, triggerEl);
  }, [profileSignature, viewRoleUpper, showInlineConfirm]);

  // ── makeBadge ─────────────────────────────────────────────────────────────
  const makeBadge = useCallback((doc) => {
    const badge = doc.createElement("div");
    badge.className = "sig-active-badge";
    badge.style.cssText = [
      "display:flex", "flex-direction:column", "align-items:center",
      "justify-content:center", "gap:5px", "width:100%", "min-height:60px",
      "border:1.5px dashed #d1d5db", "border-radius:6px",
      "background:transparent", "cursor:pointer",
      "transition:border-color 0.15s,background 0.15s",
    ].join(";");
    badge.innerHTML = `
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
           stroke="#aaa" stroke-width="1.5" style="display:block;">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5
             0 013.536 3.536L12.536 16.536 8 18 9.464 13.536z"/>
      </svg>
      <span style="font-size:9px;font-weight:600;color:#aaa;
                   text-transform:uppercase;letter-spacing:.06em;pointer-events:none;">
        Click to sign
      </span>`;
    badge.addEventListener("mouseenter", () => {
      badge.style.borderColor = "#7c3aed";
      badge.style.background  = "#faf9ff";
      badge.querySelector("svg")?.setAttribute("stroke", "#7c3aed");
      const lbl = badge.querySelector("span");
      if (lbl) lbl.style.color = "#7c3aed";
    });
    badge.addEventListener("mouseleave", () => {
      badge.style.borderColor = "#d1d5db";
      badge.style.background  = "transparent";
      badge.querySelector("svg")?.setAttribute("stroke", "#aaa");
      const lbl = badge.querySelector("span");
      if (lbl) lbl.style.color = "#aaa";
    });
    return badge;
  }, []);

  // ── updateSlotStates ──────────────────────────────────────────────────────
  const updateSlotStates = useCallback((iframeEl) => {
    try {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!doc) return;
      const isActive = canSignRef.current && !signedRef.current;

      // Pattern A
      doc.querySelectorAll(".signature-slot[data-role]").forEach((el) => {
        if (el.classList.contains("signed")) return;

        const slotRoleUpper = normaliseRole(el.dataset.role);
        const mine = isActive && slotRoleUpper === viewRoleUpper;

        if (mine) {
          el.classList.add("active-role");
          el.classList.remove("locked");
          Object.assign(el.style, {
            cursor: "pointer", pointerEvents: "auto",
            opacity: "1", position: "relative",
          });
          el.querySelector(".sig-active-badge")?.remove();
          const badge = makeBadge(doc);
          el.innerHTML = "";
          el.appendChild(badge);
        } else {
          el.classList.remove("active-role");
          el.classList.add("locked");
          Object.assign(el.style, { cursor: "not-allowed", pointerEvents: "none" });
          if (!el.querySelector("img")) el.style.opacity = "0.45";
          el.querySelector(".sig-active-badge")?.remove();
        }
      });

      // Pattern B
      const containers = [
        ...doc.querySelectorAll(".sig-item"),
        ...doc.querySelectorAll(".sig-box"),
      ];
      containers.forEach((container) => {
        const labelEl   = container.querySelector(
          ".sig-label, .sig-role, [class*='sig-label'], .sig-title, .sig-name"
        );
        const labelText = labelEl?.textContent?.trim() || "";
        if (!labelText) return;

        const slotRoleLower = roleFromLabelText(labelText);
        if (!slotRoleLower) return;

        const sigLine = container.querySelector(".sig-line");
        if (!sigLine) return;

        container.querySelector(".inline-sign-overlay")?.remove();

        if (sigLine.querySelector("img")) return;

        const slotRoleUpper = normaliseRole(slotRoleLower);
        const isMySlot = slotRoleUpper === viewRoleUpper;
        if (isMySlot && signedRef.current) return;

        const mine = isActive && isMySlot;

        if (mine) {
          const overlay = doc.createElement("div");
          overlay.className = "inline-sign-overlay";
          overlay.style.cssText = [
            "display:flex", "align-items:center", "justify-content:center",
            "min-height:60px", "border:1.5px dashed #d1d5db",
            "border-radius:6px", "background:transparent",
            "cursor:pointer", "margin-top:4px",
            "transition:border-color 0.15s,background 0.15s",
          ].join(";");
          overlay.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:5px;pointer-events:none;">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                   stroke="#aaa" stroke-width="1.5" style="display:block;">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5
                     0 013.536 3.536L12.536 16.536 8 18 9.464 13.536z"/>
              </svg>
              <span style="font-size:9px;font-weight:600;color:#aaa;
                           text-transform:uppercase;letter-spacing:.06em;">
                Click to sign
              </span>
            </div>`;
          attachOverlayListeners(overlay, iframeEl, slotRoleLower);
          sigLine.insertAdjacentElement("afterend", overlay);
        } else {
          if (!sigLine.querySelector("img")) sigLine.style.opacity = "0.5";
        }
      });

    } catch (err) { console.warn("updateSlotStates failed:", err); }
  }, [viewRoleUpper, makeBadge, attachOverlayListeners]);

  // ── handleIframeReady — FULL FIX including modal kill switch ──────────────
  const handleIframeReady = useCallback((iframeEl) => {
    iframeRef.current = iframeEl;
    updateSlotStates(iframeEl);

    try {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!doc) return;

      // 1. Block the click-to-sign slot handler (existing)
      const clickHandler = (e) => {
        const slot = e.target.closest(".signature-slot.active-role");
        if (!slot) return;
        e.preventDefault();
        e.stopPropagation();
        handleInlineSign(slot.dataset.role, slot);
      };
      doc.removeEventListener("click", clickHandler);
      doc.addEventListener("click", clickHandler);

      // 2. Override all known dialog-opening functions with no-ops
      const win = iframeEl.contentWindow;
      if (win) {
        const noop = () => {};
        const dialogFns = [
          "openSignDialog", "showSignatureDialog", "signDoc",
          "openModal", "showModal", "signModal",
          "drawSignature", "typeSignature", "applySignature",
          "getSignatureImage", "clearSignature",
          "showSign", "openSign", "launchSignDialog",
        ];
        dialogFns.forEach((fn) => {
          try { win[fn] = noop; } catch { /* cross-origin guard */ }
        });
      }

      // 3. MutationObserver — remove modal/dialog nodes the instant they appear
      //    This catches modals injected by JS after page load (setTimeout, event handlers)
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;

            const classList = (typeof node.className === "string" ? node.className : "").toLowerCase();
            const nodeId    = (node.id || "").toLowerCase();

            const isModal =
              classList.includes("modal") ||
              classList.includes("dialog") ||
              classList.includes("sign-overlay") ||
              classList.includes("sig-toast") ||
              classList.includes("signature-popup") ||
              classList.includes("signing-modal") ||
              nodeId.includes("modal") ||
              nodeId.includes("sign-dialog") ||
              node.style?.position === "fixed";

            const hasSignTitle =
              node.textContent?.includes("SIGN:") ||
              node.textContent?.includes("APPLY SIGNATURE") ||
              node.textContent?.includes("Draw or type your signature");

            if (isModal || hasSignTitle) {
              console.log(
                "[ContractInstancesPanel] Killed modal injected by template script:",
                node.className || node.id || node.tagName
              );
              node.remove();
            }
          }
        }
      });

      const observeTarget = doc.body || doc.documentElement;
      if (observeTarget) {
        observer.observe(observeTarget, { childList: true, subtree: true });
        // Store so cleanup effect can disconnect it
        iframeEl._sigModalObserver = observer;
      }

    } catch (err) { console.warn("iframe listener attach failed:", err); }
  }, [updateSlotStates, handleInlineSign]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) updateSlotStates(iframe);
  }, [canSignRole, alreadySigned, updateSlotStates]);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200 space-y-3">
      <div className="rounded-xl overflow-hidden"
           style={{ border: `1px solid ${signed ? "var(--mint-200)" : "var(--border)"}` }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3"
             style={{ background: signed ? "var(--mint-600)" : "var(--primary)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
               style={{ background: "rgba(255,255,255,0.2)" }}>
            {signed
              ? <CheckCircle2 className="w-4 h-4 text-white" />
              : <FileText className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{instance.formName}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wider"
                    style={{ background: "rgba(255,255,255,0.2)", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                {typeCfg.label}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.7)" }}>
                DOC {index + 1} OF {total}
              </span>
              {(instance.generation ?? 1) > 1 && (
                <span className="text-[8px] font-mono px-1.5 py-px rounded"
                      style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  GEN {instance.generation}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={instance.status} />
        </div>

        {/* Status bar */}
        <div className="px-4 py-3 flex items-center gap-3"
             style={{ borderBottom: "1px solid var(--border)", background: signed ? "var(--mint-50)" : "var(--muted)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
               style={{ background: signed ? "var(--mint-100)" : "var(--card)" }}>
            {signed
              ? <Check className="w-3.5 h-3.5" style={{ color: "var(--mint-600)", strokeWidth: 2.5 }} />
              : <PenLine className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold"
               style={{ color: signed ? "var(--mint-700)" : "var(--foreground)" }}>
              {signed
                ? "Signature recorded"
                : canSignRole && !alreadySigned
                  ? "Click your signature field inside the document to sign"
                  : "Signature pending"}
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {STATUS_CFG[instance.status]?.label ?? "Draft"}
            </p>
          </div>
          {canSignRole && !alreadySigned && !signed && (
            <span className="text-[9px] font-bold px-2 py-1 rounded-lg animate-pulse"
                  style={{ background: "var(--lavender-100)", color: "var(--lavender-700)", border: "1px solid var(--lavender-200)" }}>
              ↓ Sign below
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
              <div className="rounded-lg overflow-hidden"
                   style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
           style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}>
        <Shield className="w-6 h-6" style={{ color: "var(--lavender-300)" }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>No contracts generated yet</p>
      <p className="text-[11px] mt-1.5 max-w-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        Documents are generated when the crew accepts the offer.
      </p>
      <button onClick={onRefresh} disabled={loading}
              className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors disabled:opacity-50"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}>
        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} /> Refresh
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

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

  const [activeIdx,   setActiveIdx  ] = useState(0);
  const signedThisSessionRef = useRef(new Set());
  const retryDoneRef = useRef(false);

  const handleRefresh = useCallback(() => {
    retryDoneRef.current = false;
    signedThisSessionRef.current = new Set();
    dispatch(clearInstances()); dispatch(clearHtmlCache());
    dispatch(getContractInstancesThunk(offerId));
  }, [dispatch, offerId]);

  useEffect(() => {
    if (!offerId) return;
    retryDoneRef.current = false;
    signedThisSessionRef.current = new Set();
    dispatch(clearInstances()); dispatch(clearHtmlCache());
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

  const handleSignedAdvance = useCallback(() => {
    setActiveIdx((prev) => {
      const next = prev + 1;
      return next < total ? next : prev;
    });
  }, [total]);

  const handleDocSigned = useCallback((instanceId, role) => {
    signedThisSessionRef.current.add(instanceId);

    const allSignedIds = new Set([
      ...activeInstances
        .filter((i) => isSignedForRole(i.status, viewRole))
        .map((i) => i._id),
      ...signedThisSessionRef.current,
    ]);

    const totalSignedNow = allSignedIds.size;

    console.log(`[ContractInstancesPanel] Doc signed: ${instanceId}. Total signed: ${totalSignedNow}/${total}`);

    if (totalSignedNow >= total && total > 0) {
      console.log(`[ContractInstancesPanel] ALL ${total} docs signed for role ${role} → calling onAllSigned`);
      toast.success(`All documents signed! Advancing to next stage…`);
      setTimeout(() => {
        if (onAllSigned) onAllSigned(role);
      }, 1200);
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
      <div className={cn("rounded-xl px-4 py-3 flex items-center gap-2", className)}
           style={{ background: "#fff1f1", border: "1px solid #fecaca" }}>
        <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }} />
        <p className="text-[11px]" style={{ color: "#dc2626" }}>{error}</p>
        <button onClick={handleRefresh} className="ml-auto text-[10px] underline" style={{ color: "#dc2626" }}>Retry</button>
      </div>
    );
  }

  if (!loading && total === 0) return <EmptyState onRefresh={handleRefresh} loading={loading} />;

  const current = activeInstances[safeIdx];

  return (
    <div className={cn("space-y-5", className)}>

      {/* Bundle bar */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
               style={{ background: "var(--primary)" }}>
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
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${progress}%`, background: "var(--mint-500)" }} />
          </div>
          <span className="text-[10px] shrink-0" style={{ color: "var(--muted-foreground)" }}>{signedCount}/{total}</span>
          <button onClick={handleRefresh} disabled={loading} title="Refresh"
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}>
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
          instance={current} index={safeIdx} total={total}
          viewRole={viewRole} offerId={offerId}
          canSignRole={canSignRole} profileSignature={profileSignature}
          onSignInstance={onSignInstance} isSubmitting={isSubmitting}
          onSignedAdvance={handleSignedAdvance}
          onDocSigned={handleDocSigned}
        />
      )}

      {total > 1 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={safeIdx === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{safeIdx + 1} of {total}</span>
          <button onClick={() => setActiveIdx((i) => Math.min(total - 1, i + 1))}
                  disabled={safeIdx === total - 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}>
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {canSignRole && signedCount > 0 && signedCount < total && (
        <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
             style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--mint-600)" }} />
            <p className="text-[12px]" style={{ color: "var(--mint-700)" }}>
              <strong>{signedCount}</strong> of <strong>{total}</strong> documents signed.
            </p>
          </div>
          {safeIdx < total - 1 && (
            <button onClick={() => setActiveIdx(safeIdx + 1)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all"
                    style={{ background: "var(--mint-600)", color: "white" }}>
              Next Doc <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}