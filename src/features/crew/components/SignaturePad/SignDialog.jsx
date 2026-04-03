import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { PenTool, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";

export default function SignDialog({
  open,
  onOpenChange,
  roleName     = "Signatory",
  offerCode    = "",
  onSign,
  isSubmitting = false,
}) {
  const sigRef  = useRef(null);
  const [empty, setEmpty] = useState(true);
  const [done,  setDone]  = useState(false);

  const handleClear = () => {
    sigRef.current?.clear();
    setEmpty(true);
    setDone(false);
  };

  const handleStroke = () => setEmpty(false);

  const handleConfirm = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.toDataURL("image/png");
    await onSign(dataUrl);
    setDone(true);
    setTimeout(() => {
      onOpenChange(false);
      setEmpty(true);
      setDone(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <PenTool className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold leading-tight">
                Sign as {roleName}
              </DialogTitle>
              {offerCode && (
                <DialogDescription className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {offerCode}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 py-4 space-y-3">

          {/* Notice */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-snug">
            By signing below you confirm you have read and agree to all terms in this agreement.
            This signature is legally binding.
          </div>

          {/* Canvas */}
          <div className="relative rounded-lg border-2 border-dashed border-purple-300 bg-purple-50/40 overflow-hidden">
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                width:     396,
                height:    160,
                className: "block w-full",
                style:     { touchAction: "none" },
              }}
              penColor="#1e1b4b"
              onEnd={handleStroke}
            />
            {empty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs text-purple-400 font-medium select-none">
                  Sign here ↓
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={isSubmitting || empty}
              className="gap-1.5 border-border text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </Button>

            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={isSubmitting || empty || done}
              className="flex-1 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {done ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Signed!</>
              ) : isSubmitting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
              ) : (
                <><PenTool className="w-3.5 h-3.5" /> Confirm Signature</>
              )}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}