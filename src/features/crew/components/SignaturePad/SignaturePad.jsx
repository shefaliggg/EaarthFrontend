/**
 * SignaturePad.jsx
 *
 * Reusable canvas-based signature pad.
 * Returns a base64 data URL via onSave(dataUrl).
 *
 * Usage:
 *   <SignaturePad onSave={(dataUrl) => setSignature(dataUrl)} onCancel={() => ...} />
 *
 * Place at: src/features/crew/components/SignaturePad/SignaturePad.jsx
 */

import { useRef, useState, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { RotateCcw, Check, X } from "lucide-react";

export default function SignaturePad({ onSave, onCancel, disabled = false }) {
  const canvasRef  = useRef(null);
  const isDrawing  = useRef(false);
  const lastPos    = useRef({ x: 0, y: 0 });
  const [isEmpty,  setIsEmpty]  = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Canvas setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";

    // Resize canvas to match its CSS display size
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth   = 2.5;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Coordinate helpers ────────────────────────────────────────────────────

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const source = e.touches ? e.touches[0] : e;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  // ── Draw handlers ─────────────────────────────────────────────────────────

  const startDrawing = (e) => {
    if (disabled) return;
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current   = getPos(e);
  };

  const draw = (e) => {
    if (!isDrawing.current || disabled) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const pos    = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
    setIsEmpty(false);
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    isDrawing.current = false;
  };

  // ── Clear ─────────────────────────────────────────────────────────────────

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width * (window.devicePixelRatio || 1), height * (window.devicePixelRatio || 1));
    setIsEmpty(true);
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const save = async () => {
    if (isEmpty) return;
    setIsSaving(true);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    await onSave(dataUrl);
    setIsSaving(false);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Canvas */}
      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-40 cursor-crosshair touch-none block"
          style={{ touchAction: "none" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-gray-400 dark:text-gray-500 select-none">
              Sign here using your mouse or finger
            </p>
          </div>
        )}
        {/* Baseline */}
        <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300 dark:border-gray-600 pointer-events-none" />
        <p className="absolute bottom-2 left-8 text-[9px] text-gray-400 pointer-events-none select-none">
          Sign above the line
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={isEmpty || disabled}
          className="gap-1.5 text-muted-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </Button>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={save}
            disabled={isEmpty || isSaving || disabled}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-3.5 h-3.5" />
            {isSaving ? "Saving..." : "Confirm Signature"}
          </Button>
        </div>
      </div>
    </div>
  );
}