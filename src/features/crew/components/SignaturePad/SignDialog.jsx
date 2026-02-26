/**
 * SignDialog.jsx
 *
 * Modal that wraps SignaturePad.
 * Used by all role action components that need to collect a signature.
 *
 * Usage:
 *   <SignDialog
 *     open={showSign}
 *     onOpenChange={setShowSign}
 *     roleName="UPM"
 *     offerCode="OFR-0001"
 *     onSign={async (dataUrl) => { ... dispatch ... }}
 *     isSubmitting={isSubmitting}
 *   />
 *
 * Place at: src/features/crew/components/SignaturePad/SignDialog.jsx
 */

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../../../shared/components/ui/dialog";
import SignaturePad from "./SignaturePad";
import { PenTool } from "lucide-react";

export default function SignDialog({
  open,
  onOpenChange,
  roleName,
  offerCode,
  onSign,
  isSubmitting = false,
}) {
  const handleSave = async (dataUrl) => {
    await onSign(dataUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Sign as {roleName}</DialogTitle>
          </div>
          <DialogDescription>
            {offerCode && (
              <span className="font-mono text-xs text-muted-foreground">{offerCode} · </span>
            )}
            Draw your signature below. This is a legally binding signature.
          </DialogDescription>
        </DialogHeader>

        <SignaturePad
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
          disabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}