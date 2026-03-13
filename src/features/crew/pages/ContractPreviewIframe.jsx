/**
 * ContractPreviewIframe.jsx
 *
 * FIX: sandbox="allow-same-origin allow-scripts"
 *
 * Previously sandbox="allow-same-origin" blocked ALL script execution inside
 * the iframe. This prevented:
 *   - Any JS in the contract HTML from running
 *   - The browser's ability to compute scrollHeight correctly in some cases
 *
 * "allow-same-origin" is still present so we can read
 * contentDocument.body.scrollHeight for auto-sizing.
 */

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export default function ContractPreviewIframe({ preview, isLoading }) {
  const iframeRef = useRef(null);
  const blobRef   = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);
  const [blobUrl, setBlobUrl]           = useState(null);

  // ── Build blob URL whenever preview HTML changes ──────────────────────────
  useEffect(() => {
    if (!preview) return;

    if (blobRef.current) URL.revokeObjectURL(blobRef.current);

    const blob = new Blob([preview], { type: "text/html; charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    blobRef.current = url;
    setBlobUrl(url);

    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [preview]);

  // ── Auto-resize iframe to inner document height ───────────────────────────
  useEffect(() => {
    if (!blobUrl || !iframeRef.current) return;

    const resize = () => {
      try {
        const doc =
          iframeRef.current?.contentDocument ||
          iframeRef.current?.contentWindow?.document;
        if (doc?.body) {
          const h = Math.max(
            doc.documentElement.scrollHeight,
            doc.body.scrollHeight,
            400
          );
          setIframeHeight(h + 24);
        }
      } catch {
        setIframeHeight(1200);
      }
    };

    iframeRef.current.addEventListener("load", resize);
    const t = setTimeout(resize, 600);

    return () => {
      iframeRef.current?.removeEventListener("load", resize);
      clearTimeout(t);
    };
  }, [blobUrl]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border">
        <div className="text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs text-muted-foreground">Loading contract preview…</p>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!preview) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="text-center space-y-2">
          <FileText className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-xs text-muted-foreground">
            Contract preview not available yet.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Preview loads once the offer is sent for crew signature.
          </p>
        </div>
      </div>
    );
  }

  // ── Iframe ────────────────────────────────────────────────────────────────
  return (
    <iframe
      key={blobUrl}
      ref={iframeRef}
      src={blobUrl}
      className="w-full rounded-lg border border-gray-200 shadow-sm block"
      style={{ height: `${iframeHeight}px`, overflow: "hidden" }}
      title="Contract Preview"
      sandbox="allow-same-origin allow-scripts"
      scrolling="no"
    />
  );
}