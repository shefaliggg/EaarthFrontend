/**
 * DocumentSignatureBox.jsx
 *
 * ── DEPRECATED ───────────────────────────────────────────────────────────────
 *
 * This component is intentionally neutralised.
 *
 * The "SIGN: PRODUCTION OFFICE" / "DRAW · TYPE · APPLY SIGNATURE" dialog that
 * was appearing for UPM / FC / STUDIO roles originated from the
 * SignConfirmDialog inside this file. It was being rendered somewhere in the
 * tree (LayoutSignatory, LayoutCrew, or a parent wrapper) in parallel with the
 * inline confirm flow that lives inside ContractInstancesPanel.jsx.
 *
 * Signing for ALL roles (CREW, UPM, FC, STUDIO) is now handled entirely
 * inline inside the iframe by ContractInstancesPanel → DocumentView →
 * showInlineConfirm. No external modal is needed.
 *
 * If this component is imported anywhere, it now renders null so it cannot
 * interfere. You can safely delete this file once you've confirmed the inline
 * flow works end-to-end.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function DocumentSignatureBox() {
  return null;
}