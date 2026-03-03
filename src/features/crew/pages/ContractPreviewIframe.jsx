/**
 * ContractPreviewIframe.jsx
 *
 * Renders the backend-generated contract HTML inside an iframe.
 * - No inner scroll: iframe auto-sizes to its full document height
 * - Full width layout
 * - Signing actions shown inline below the preview
 */

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export default function ContractPreviewIframe({ preview, isLoading }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  // Auto-size iframe to match its inner document height (no scroll)
  useEffect(() => {
    if (!preview) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc?.body) {
          const h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
          if (h > 100) setIframeHeight(h);
        }
      } catch (_) {}
    };

    iframe.addEventListener("load", resize);
    // Also try after a short delay for fonts/images
    const t = setTimeout(resize, 400);
    return () => {
      iframe.removeEventListener("load", resize);
      clearTimeout(t);
    };
  }, [preview]);

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

  if (!preview) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="text-center space-y-2">
          <FileText className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-xs text-muted-foreground">Contract preview not available yet.</p>
          <p className="text-[10px] text-muted-foreground">
            Preview loads once the offer is sent for crew signature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={preview}
      className="w-full rounded-lg border border-gray-200 shadow-sm block"
      style={{ height: `${iframeHeight}px`, overflow: "hidden" }}
      title="Contract Preview"
      sandbox="allow-same-origin"
      scrolling="no"
    />
  );
}