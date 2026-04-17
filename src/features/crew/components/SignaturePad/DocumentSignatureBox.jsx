import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, PenLine, ShieldAlert } from "lucide-react";
import { cn } from "../../../../shared/config/utils";

const ROLE_LABEL = {
  CREW: "Crew",
  UPM: "UPM",
  FC: "FC",
  STUDIO: "Studio",
};

export default function DocumentSignatureBox({
  instanceId,
  instanceName,
  status,
  viewRole,
  canSign,
  isSigned,
  signedAt,
  signatureId,
  profileSignature,
  isSubmitting,
  onSign,
}) {
  const [localError, setLocalError] = useState("");

  const roleLabel = ROLE_LABEL[viewRole] || "Signatory";
  const hasProfileSignature = useMemo(() => {
    if (!profileSignature || typeof profileSignature !== "string") return false;
    return profileSignature.trim().length > 0;
  }, [profileSignature]);

  const signatureSrc = useMemo(() => {
    if (!hasProfileSignature) return "";
    if (profileSignature.startsWith("data:")) return profileSignature;
    return `data:image/png;base64,${profileSignature}`;
  }, [hasProfileSignature, profileSignature]);

  const onSignClick = async () => {
    if (!onSign || !instanceId) return;
    setLocalError("");
    try {
      await onSign(instanceId);
    } catch (err) {
      setLocalError(err?.message || "Failed to sign this document. Please try again.");
    }
  };

  return (
    <section
      className="mt-4 rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}
      >
        <p className="text-[11px] font-semibold" style={{ color: "var(--foreground)" }}>
          Document Signature
        </p>
        <span className="text-[9px] font-mono" style={{ color: "var(--muted-foreground)" }}>
          {instanceName || "Document"}
        </span>
      </div>

      <div className="px-4 py-4 space-y-3">
        {isSigned ? (
          <div className="rounded-lg border px-3 py-3" style={{ borderColor: "var(--mint-200)", background: "var(--mint-50)" }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: "var(--mint-600)" }} />
              <p className="text-[11px] font-semibold" style={{ color: "var(--mint-700)" }}>
                Signed
              </p>
              <span className="ml-auto text-[9px] font-mono" style={{ color: "var(--mint-700)" }}>
                {status || "SIGNED"}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1">
              {signedAt && (
                <p className="text-[10px]" style={{ color: "var(--mint-700)" }}>
                  Signed at: {new Date(signedAt).toLocaleString("en-GB")}
                </p>
              )}
              {signatureId && (
                <p className="text-[10px] font-mono" style={{ color: "var(--mint-700)" }}>
                  Signature ID: {signatureId}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-lg border px-3 py-3" style={{ borderColor: "var(--lavender-100)", background: "var(--lavender-50)" }}>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                Signing as <span className="font-semibold" style={{ color: "var(--foreground)" }}>{roleLabel}</span>
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                Review complete? Apply your saved profile signature to this specific document.
              </p>
            </div>

            {hasProfileSignature && (
              <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Profile signature preview
                </p>
                <div className="h-14 rounded border px-2 flex items-center" style={{ borderColor: "var(--border)", background: "white" }}>
                  <img src={signatureSrc} alt="Profile signature" className="max-h-10 max-w-full object-contain" />
                </div>
              </div>
            )}

            {!hasProfileSignature && (
              <div className="rounded-lg border px-3 py-2.5 flex items-start gap-2" style={{ borderColor: "var(--peach-200)", background: "var(--peach-50)" }}>
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--peach-600)" }} />
                <p className="text-[10px] leading-relaxed" style={{ color: "var(--peach-700)" }}>
                  No saved profile signature found. Add a signature to your profile before signing documents.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onSignClick}
                disabled={!canSign || !hasProfileSignature || isSubmitting}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-colors",
                  (!canSign || !hasProfileSignature || isSubmitting)
                    ? "opacity-55 cursor-not-allowed"
                    : "hover:brightness-95",
                )}
                style={{
                  background: canSign && hasProfileSignature ? "var(--primary)" : "var(--muted)",
                  color: canSign && hasProfileSignature ? "white" : "var(--muted-foreground)",
                }}
              >
                {isSubmitting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <PenLine className="w-3.5 h-3.5" />
                }
                {isSubmitting ? "Signing..." : "Sign This Document"}
              </button>
            </div>

            {!canSign && (
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                Signature is not available for this role at the current stage.
              </p>
            )}

            {localError && (
              <p className="text-[10px] text-red-500">{localError}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
