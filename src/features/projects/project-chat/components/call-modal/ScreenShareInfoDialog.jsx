import React, { useState } from "react";
import { Monitor, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ScreenShareInfoDialog({ open, onClose, onConfirm }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!open) return null;

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem("skipShareWarning", "true");
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 rounded-3xl">
      <div className="bg-zinc-950 p-6 rounded-2xl w-[340px] text-white border border-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Share your screen</h2>
        </div>

        {/* Info Section */}
        <div className="space-y-3 text-sm text-zinc-400 mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-blue-400" />
            <p>Share your entire screen for the best experience</p>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-400" />
            <p>Window sharing may stop if minimized or switched</p>
          </div>

          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-zinc-500" />
            <p>Others will see everything visible on your screen</p>
          </div>

          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-zinc-500" />
            <p>Return to this tab after selecting what to share</p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-2 text-xs text-zinc-500 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="accent-primary"
          />
          Don’t show this again
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="bg-zinc-800 border-none text-muted/70"
          >
            Cancel
          </Button>

          <Button size="sm" onClick={handleConfirm} className="text-black">
            Share Screen
          </Button>
        </div>
      </div>
    </div>
  );
}
