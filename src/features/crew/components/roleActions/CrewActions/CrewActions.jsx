/**
 * CrewActions.jsx
 *
 * Action buttons shown to CREW on the ViewOffer page.
 *
 * Status → allowed actions:
 *   SENT_TO_CREW          → Accept, Request Changes
 *   PENDING_CREW_SIGNATURE → Sign Contract
 *   Others                → read-only (null)
 *
 * Place at:
 *   src/features/crew/components/roleActions/CrewActions/CrewActions.jsx
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../../../../shared/components/ui/dialog";
import { CheckCircle2, MessageSquare, PenTool, Loader2 } from "lucide-react";

import {
  crewAcceptThunk,
  crewRequestChangesThunk,
  crewSignThunk,
  selectSubmitting,
} from "../../../store/offer.slice";

export default function CrewActions({ offer }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [changeForm, setChangeForm] = useState({
    reason: "",
    fieldName: "",
    currentValue: "",
    requestedValue: "",
  });

  if (!offer) return null;

  const { _id: offerId, status } = offer;

  // ── Accept ────────────────────────────────────────────────────────────────

  const handleAccept = async () => {
    const result = await dispatch(crewAcceptThunk(offerId));
    if (crewAcceptThunk.fulfilled.match(result)) {
      toast.success("Offer accepted! It will now go through production review.");
    } else {
      toast.error(result.payload?.message || "Failed to accept offer");
    }
  };

  // ── Request changes ───────────────────────────────────────────────────────

  const handleRequestChanges = async () => {
    if (!changeForm.reason.trim()) {
      toast.error("Please provide a reason for the change request");
      return;
    }
    const result = await dispatch(
      crewRequestChangesThunk({ offerId, ...changeForm })
    );
    if (crewRequestChangesThunk.fulfilled.match(result)) {
      toast.success("Change request submitted. Production Admin will review.");
      setShowChangeDialog(false);
      setChangeForm({ reason: "", fieldName: "", currentValue: "", requestedValue: "" });
    } else {
      toast.error(result.payload?.message || "Failed to submit change request");
    }
  };

  // ── Sign ──────────────────────────────────────────────────────────────────

  const handleSign = async () => {
    const result = await dispatch(crewSignThunk(offerId));
    if (crewSignThunk.fulfilled.match(result)) {
      toast.success("Contract signed successfully!");
    } else {
      toast.error(result.payload?.message || "Failed to sign contract");
    }
  };

  // ── Render by status ──────────────────────────────────────────────────────

  if (status === "SENT_TO_CREW") {
    return (
      <>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={handleAccept}
            disabled={isSubmitting}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            Accept Offer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangeDialog(true)}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Request Changes
          </Button>
        </div>

        {/* Request changes dialog */}
        <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Changes</DialogTitle>
              <DialogDescription>
                Tell the production team what you'd like changed. They will review and re-send the offer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  Reason <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={changeForm.reason}
                  onChange={(e) => setChangeForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="Describe what you'd like changed and why..."
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  Field (optional)
                </label>
                <input
                  value={changeForm.fieldName}
                  onChange={(e) => setChangeForm((p) => ({ ...p, fieldName: e.target.value }))}
                  placeholder="e.g. salary, start date..."
                  className="w-full border rounded-md px-3 py-2 text-sm h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                    Current Value
                  </label>
                  <input
                    value={changeForm.currentValue}
                    onChange={(e) => setChangeForm((p) => ({ ...p, currentValue: e.target.value }))}
                    placeholder="Current..."
                    className="w-full border rounded-md px-3 py-2 text-sm h-8"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                    Requested Value
                  </label>
                  <input
                    value={changeForm.requestedValue}
                    onChange={(e) => setChangeForm((p) => ({ ...p, requestedValue: e.target.value }))}
                    placeholder="Requested..."
                    className="w-full border rounded-md px-3 py-2 text-sm h-8"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowChangeDialog(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRequestChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (status === "PENDING_CREW_SIGNATURE") {
    return (
      <Button
        size="sm"
        onClick={handleSign}
        disabled={isSubmitting}
        className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <PenTool className="w-3.5 h-3.5" />
        )}
        Sign Contract
      </Button>
    );
  }

  return null;
}