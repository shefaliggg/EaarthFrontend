import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export default function ContractPreviewIframe({ preview, isLoading }) {
  const iframeRef = useRef(null);
  const blobRef   = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  useEffect(() => {
    if (!preview || !iframeRef.current) return;

    // Revoke previous blob to avoid memory leak
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);

    // Use blob URL — more reliable than srcDoc for large HTML with signatures
    const blob = new Blob([preview], { type: "text/html; charset=utf-8" });
    blobRef.current = URL.createObjectURL(blob);
    iframeRef.current.src = blobRef.current;

    const iframe = iframeRef.current;

    const onLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
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

    iframe.addEventListener("load", onLoad);
    const t = setTimeout(onLoad, 800);

    return () => {
      iframe.removeEventListener("load", onLoad);
      clearTimeout(t);
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
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
            Available after offer reaches signing stage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full rounded-lg border border-gray-200 shadow-sm block"
      style={{ height: `${iframeHeight}px`, overflow: "hidden" }}
      title="Contract Preview"
      sandbox="allow-same-origin allow-scripts"
      scrolling="no"
    />
  );
}