/**
 * SignatureFieldOverlay.jsx
 *
 * DocuSign-style inline signing — NO popup, NO reload.
 *
 * HOW IT WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. The contract HTML template must contain signature placeholder elements:
 *
 *      <div data-sig-field data-sig-role="CREW"
 *           class="sig-placeholder sig-placeholder--crew">
 *        <span class="sig-placeholder__label">Sign here</span>
 *      </div>
 *
 *    These are injected by the backend template engine.
 *
 * 2. After the iframe loads, we use postMessage to ask the iframe document
 *    to report the bounding rects of all [data-sig-field] elements.
 *
 * 3. We render absolutely-positioned overlay badges at exactly those rects.
 *    Unsigned fields for the active role pulse with a highlight animation.
 *
 * 4. Clicking an overlay badge:
 *    a) Marks the field as locally "signing" (spinner)
 *    b) Calls onSign(instanceId) — the Redux thunk
 *    c) On success: sends a postMessage to inject the signature image into
 *       the iframe at that field position, then marks locally "signed"
 *    d) Updates Redux state — NO page refresh
 *
 * CONTRACT TEMPLATE REQUIREMENTS (backend)
 * ─────────────────────────────────────────────────────────────────────────────
 * Each signature field needs:
 *   <div
 *     data-sig-field
 *     data-sig-role="CREW"          ← CREW | UPM | FC | STUDIO
 *     data-sig-field-id="crew-main" ← unique within the document
 *     class="sig-placeholder"
 *   >
 *     <div class="sig-placeholder__inner">
 *       <span class="sig-placeholder__label">Crew Member</span>
 *       <span class="sig-placeholder__date"></span>
 *     </div>
 *   </div>
 *
 * Recommended CSS to inject into templates (add to your template base styles):
 *
 *   .sig-placeholder {
 *     display: inline-block;
 *     min-width: 200px;
 *     min-height: 60px;
 *     border: 2px dashed #a78bfa;
 *     border-radius: 6px;
 *     background: #f5f3ff;
 *     padding: 8px 12px;
 *     position: relative;
 *   }
 *   .sig-placeholder--signed {
 *     border: 2px solid #10b981;
 *     background: #ecfdf5;
 *   }
 *   .sig-placeholder__label {
 *     font-size: 10px;
 *     font-weight: 700;
 *     text-transform: uppercase;
 *     letter-spacing: 0.08em;
 *     color: #7c3aed;
 *     display: block;
 *   }
 *   .sig-placeholder__img {
 *     max-height: 48px;
 *     display: block;
 *     margin-top: 4px;
 *   }
 *
 * PROPS
 * ─────────────────────────────────────────────────────────────────────────────
 *   iframeRef        React ref to the <iframe> element
 *   iframeHeight     number  — current iframe height (for overlay sizing)
 *   instanceId       string
 *   viewRole         string  — CREW | UPM | FC | STUDIO
 *   canSign          bool    — is it this role's turn?
 *   isSigned         bool    — has this role already signed this instance?
 *   profileSignature string? — base64 dataURL of saved sig
 *   isSubmitting     bool
 *   onSign           fn(instanceId) → Promise
 *   signedAt         string?
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { PenLine, Check, Loader2, AlertCircle } from "lucide-react";

const ROLE_COLOR = {
  CREW:   { bg: "#f5f3ff", border: "#a78bfa", text: "#5b21b6", pulse: "rgba(139,92,246,0.15)", signedBg: "#ecfdf5", signedBorder: "#34d399", signedText: "#065f46" },
  UPM:    { bg: "#eff6ff", border: "#60a5fa", text: "#1e40af", pulse: "rgba(96,165,250,0.15)", signedBg: "#ecfdf5", signedBorder: "#34d399", signedText: "#065f46" },
  FC:     { bg: "#fffbeb", border: "#fbbf24", text: "#92400e", pulse: "rgba(251,191,36,0.15)",  signedBg: "#ecfdf5", signedBorder: "#34d399", signedText: "#065f46" },
  STUDIO: { bg: "#f0fdf4", border: "#4ade80", text: "#14532d", pulse: "rgba(74,222,128,0.15)", signedBg: "#ecfdf5", signedBorder: "#34d399", signedText: "#065f46" },
};

const ROLE_LABEL = {
  CREW:   "Crew Member",
  UPM:    "Unit Production Manager",
  FC:     "Financial Controller",
  STUDIO: "Production Executive",
};

/* ─── postMessage protocol ──────────────────────────────────────────────────── */

const MSG_GET_FIELDS   = "SIG_GET_FIELDS";
const MSG_FIELDS_READY = "SIG_FIELDS_READY";
const MSG_APPLY_SIG    = "SIG_APPLY_SIG";
const MSG_SIG_APPLIED  = "SIG_APPLIED";

/**
 * Script injected into the iframe via postMessage so it can report field rects
 * and receive apply-signature commands without cross-origin issues.
 *
 * This is sent as a string and eval'd inside the iframe. We use allow-scripts
 * in the sandbox so this works.
 */
const IFRAME_BRIDGE_SCRIPT = `
(function() {
  if (window.__sigBridgeInstalled) return;
  window.__sigBridgeInstalled = true;

  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || !d.type) return;

    if (d.type === '${MSG_GET_FIELDS}') {
      var fields = Array.from(document.querySelectorAll('[data-sig-field]'));
      var rects = fields.map(function(el) {
        var r = el.getBoundingClientRect();
        return {
          id:   el.dataset.sigFieldId || el.dataset.sigRole + '-' + Math.random(),
          role: (el.dataset.sigRole || '').toUpperCase(),
          top:  r.top  + window.scrollY,
          left: r.left + window.scrollX,
          width:  r.width,
          height: r.height,
          signed: el.classList.contains('sig-placeholder--signed'),
        };
      });
      e.source.postMessage({ type: '${MSG_FIELDS_READY}', fields: rects }, '*');
    }

    if (d.type === '${MSG_APPLY_SIG}') {
      var el = document.querySelector('[data-sig-field-id="' + d.fieldId + '"]')
            || document.querySelector('[data-sig-role="' + d.role + '"][data-sig-field]');
      if (!el) return;
      el.classList.add('sig-placeholder--signed');
      el.classList.remove('sig-placeholder--pending');
      var inner = el.querySelector('.sig-placeholder__inner') || el;
      inner.innerHTML = '';
      if (d.signatureUrl) {
        var img = document.createElement('img');
        img.src = d.signatureUrl;
        img.className = 'sig-placeholder__img';
        img.style.cssText = 'max-height:52px;display:block;margin:0 auto;';
        inner.appendChild(img);
      }
      var dateEl = document.createElement('p');
      dateEl.style.cssText = 'font-size:9px;color:#059669;margin:4px 0 0;text-align:center;font-family:monospace;';
      dateEl.textContent = d.signedAt || new Date().toLocaleDateString('en-GB');
      inner.appendChild(dateEl);
      e.source.postMessage({ type: '${MSG_SIG_APPLIED}', fieldId: d.fieldId }, '*');
    }
  });
})();
`;

/* ─── Hook: bridge to iframe ─────────────────────────────────────────────────── */

function useIframeBridge(iframeRef, ready) {
  const [fields, setFields]         = useState([]);
  const [bridgeReady, setBridgeReady] = useState(false);
  const listenersRef = useRef(false);

  const installBridge = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage({ type: "INJECT_SCRIPT", script: IFRAME_BRIDGE_SCRIPT }, "*");
      // Also try direct eval for same-origin iframes (blob URLs are same-origin)
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const script = doc.createElement("script");
        script.textContent = IFRAME_BRIDGE_SCRIPT;
        (doc.head || doc.body || doc.documentElement).appendChild(script);
        setBridgeReady(true);
      }
    } catch {
      // cross-origin — rely on postMessage only
    }
  }, [iframeRef]);

  const queryFields = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: MSG_GET_FIELDS }, "*");
  }, [iframeRef]);

  const applySignature = useCallback(({ fieldId, role, signatureUrl, signedAt }) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: MSG_APPLY_SIG, fieldId, role, signatureUrl, signedAt }, "*");
  }, [iframeRef]);

  useEffect(() => {
    if (!ready || listenersRef.current) return;
    listenersRef.current = true;

    const onMsg = (e) => {
      if (!e.data?.type) return;
      if (e.data.type === MSG_FIELDS_READY) {
        setFields(e.data.fields || []);
        setBridgeReady(true);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      installBridge();
      setTimeout(queryFields, 200);
    }, 300);
    return () => clearTimeout(t);
  }, [ready, installBridge, queryFields]);

  return { fields, bridgeReady, queryFields, applySignature };
}

/* ─── Single field badge ───────────────────────────────────────────────────── */

function FieldBadge({
  field,
  viewRole,
  canSign,
  isSigned: instanceSigned,
  profileSignature,
  isSubmitting,
  onSign,
  instanceId,
  signedAt,
}) {
  const [status, setStatus]   = useState("idle"); // idle | signing | done | error
  const col = ROLE_COLOR[field.role] || ROLE_COLOR.CREW;

  const isMyField    = field.role === viewRole;
  const isFieldSigned = field.signed || (isMyField && instanceSigned) || status === "done";
  const isActive     = isMyField && canSign && !isFieldSigned;
  const isOtherRole  = !isMyField;

  const handleClick = async () => {
    if (!isActive || status === "signing" || isSubmitting) return;
    if (!profileSignature) return;
    setStatus("signing");
    try {
      await onSign(instanceId, { fieldId: field.id, role: field.role, signatureUrl: profileSignature });
      setStatus("done");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const bgColor     = isFieldSigned ? col.signedBg : isActive ? col.bg : "#f9fafb";
  const borderColor = isFieldSigned ? col.signedBorder : isActive ? col.border : "#d1d5db";
  const textColor   = isFieldSigned ? col.signedText : isActive ? col.text : "#6b7280";

  return (
    <div
      onClick={handleClick}
      style={{
        position:     "absolute",
        top:          field.top,
        left:         field.left,
        width:        Math.max(field.width || 200, 200),
        minHeight:    Math.max(field.height || 64, 64),
        background:   bgColor,
        border:       `2px ${isFieldSigned ? "solid" : isActive ? "dashed" : "dashed"} ${borderColor}`,
        borderRadius: 8,
        cursor:       isActive ? "pointer" : "default",
        display:      "flex",
        flexDirection: "column",
        alignItems:   "center",
        justifyContent: "center",
        gap:          4,
        padding:      "8px 12px",
        boxSizing:    "border-box",
        transition:   "box-shadow 0.15s, transform 0.1s",
        zIndex:       10,
        animation:    isActive ? "sigPulse 2s ease-in-out infinite" : "none",
      }}
      title={isActive ? `Click to sign as ${ROLE_LABEL[field.role]}` : undefined}
    >
      <style>{`
        @keyframes sigPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${col.pulse}; }
          50%       { box-shadow: 0 0 0 8px ${col.pulse}; }
        }
        @keyframes sigCheckIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {isFieldSigned ? (
        <>
          {profileSignature && isMyField ? (
            <img
              src={profileSignature}
              alt="signature"
              style={{ maxHeight: 40, maxWidth: "100%", objectFit: "contain", display: "block" }}
            />
          ) : (
            <div style={{ animation: "sigCheckIn 0.3s ease-out" }}>
              <Check style={{ width: 20, height: 20, color: col.signedText }} />
            </div>
          )}
          <span style={{ fontSize: 9, fontWeight: 700, color: col.signedText, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {ROLE_LABEL[field.role]} · Signed
          </span>
          {signedAt && (
            <span style={{ fontSize: 9, color: col.signedText, fontFamily: "monospace" }}>
              {new Date(signedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          )}
        </>
      ) : status === "signing" ? (
        <>
          <Loader2 style={{ width: 18, height: 18, color: col.text, animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 9, color: col.text, fontWeight: 600 }}>Signing…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      ) : status === "error" ? (
        <>
          <AlertCircle style={{ width: 16, height: 16, color: "#dc2626" }} />
          <span style={{ fontSize: 9, color: "#dc2626", fontWeight: 600 }}>Failed — tap to retry</span>
        </>
      ) : isActive ? (
        <>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: col.border, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PenLine style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: col.text, textAlign: "center" }}>
            {ROLE_LABEL[field.role]}
          </span>
          <span style={{ fontSize: 9, color: col.text, opacity: 0.7 }}>
            {profileSignature ? "Click to sign" : "No saved signature"}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 10, fontWeight: 600, color: textColor }}>
            {ROLE_LABEL[field.role]}
          </span>
          <span style={{ fontSize: 9, color: textColor }}>
            {isOtherRole ? "Awaiting signature" : "Not your turn yet"}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────────── */

export default function SignatureFieldOverlay({
  iframeRef,
  iframeHeight,
  instanceId,
  viewRole,
  canSign,
  isSigned,
  profileSignature,
  isSubmitting,
  onSign,
  signedAt,
  signatures = {},   // full signatures map for all roles
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { fields, bridgeReady, queryFields, applySignature } = useIframeBridge(iframeRef, iframeLoaded);

  /* Watch iframe load event */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      setIframeLoaded(true);
    };
    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete") setIframeLoaded(true);
    return () => iframe.removeEventListener("load", onLoad);
  }, [iframeRef]);

  /* Re-query when iframe resizes */
  useEffect(() => {
    if (bridgeReady) queryFields();
  }, [iframeHeight, bridgeReady, queryFields]);

  /* Wrapped onSign — also tells the iframe to inject the signature visually */
  const handleSign = useCallback(async (instId, { fieldId, role, signatureUrl }) => {
    await onSign(instId);   // dispatch thunk
    // Inject into iframe immediately (no reload)
    applySignature({
      fieldId,
      role,
      signatureUrl,
      signedAt: new Date().toISOString(),
    });
  }, [onSign, applySignature]);

  if (!iframeLoaded || fields.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top:      0,
        left:     0,
        width:    "100%",
        height:   iframeHeight,
        pointerEvents: "none",   // let scroll pass through
        zIndex:   5,
      }}
    >
      {fields.map((field) => {
        const roleKey    = (field.role || "").toLowerCase();
        const roleSig    = signatures[roleKey] || {};
        const fieldSigned = !!roleSig.signedAt || field.signed;
        return (
          <div key={field.id} style={{ pointerEvents: "auto" }}>
            <FieldBadge
              field={field}
              viewRole={viewRole}
              canSign={canSign}
              isSigned={field.role === viewRole ? isSigned : fieldSigned}
              profileSignature={profileSignature}
              isSubmitting={isSubmitting}
              onSign={handleSign}
              instanceId={instanceId}
              signedAt={field.role === viewRole ? signedAt : roleSig.signedAt}
            />
          </div>
        );
      })}
    </div>
  );
}