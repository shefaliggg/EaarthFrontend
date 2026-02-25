/**
 * ProductionAdminActions.jsx
 *
 * Action buttons shown to PRODUCTION_ADMIN on the ViewOffer page.
 *
 * Status → allowed actions:
 *   DRAFT           → Edit, Send to Crew
 *   NEEDS_REVISION  → Edit, Send to Crew (re-send after crew requested changes)
 *   CREW_ACCEPTED   → Move to Production Check
 *   PRODUCTION_CHECK → (already handled by self — read only here, but
 *                       this component shows "Complete Production Check")
 *   Any other       → read-only (null rendered)
 *
 * Place at:
 *   src/features/crew/components/roleActions/ProductionAdminActions/ProductionAdminActions.jsx
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../../shared/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../../../../../shared/components/ui/dialog";
import { Send, CheckCircle2, Loader2, XCircle, Edit2 } from "lucide-react";

import {
  sendToCrewThunk,
  moveToProductionCheckThunk,
  cancelOfferThunk,
  selectSubmitting,
  clearOfferError,
} from "../../../../store/offer.slice";

export default function ProductionAdminActions({ offer, onEdit }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (!offer) return null;

  const { _id: offerId, status } = offer;

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleSendToCrew = async () => {
    const result = await dispatch(sendToCrewThunk({ offerId }));
    if (sendToCrewThunk.fulfilled.match(result)) {
      toast.success("Offer sent to crew successfully!");
    } else {
      toast.error(result.payload?.message || "Failed to send offer");
    }
  };

  const handleProductionCheck = async () => {
    const result = await dispatch(moveToProductionCheckThunk(offerId));
    if (moveToProductionCheckThunk.fulfilled.match(result)) {
      toast.success("Production check completed!");
    } else {
      toast.error(result.payload?.message || "Failed to complete production check");
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    const result = await dispatch(cancelOfferThunk({ offerId, reason: cancelReason }));
    if (cancelOfferThunk.fulfilled.match(result)) {
      toast.success("Offer cancelled");
      setShowCancelDialog(false);
    } else {
      toast.error(result.payload?.message || "Failed to cancel offer");
    }
  };

  // ── Render by status ──────────────────────────────────────────────────────

  if (status === "DRAFT" || status === "NEEDS_REVISION") {
    return (
      <>
        <div className="flex items-center gap-2 flex-wrap">
          {status === "NEEDS_REVISION" && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
              ⚠ Crew Requested Changes
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Offer
          </Button>
          <Button
            size="sm"
            onClick={handleSendToCrew}
            disabled={isSubmitting}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {status === "NEEDS_REVISION" ? "Re-send to Crew" : "Send to Crew"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </Button>
        </div>

        {/* Cancel confirmation dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Cancel Offer?</DialogTitle>
              <DialogDescription>
                This will permanently cancel the offer. Please provide a reason.
              </DialogDescription>
            </DialogHeader>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(false)}>
                Keep Offer
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Cancel"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (status === "CREW_ACCEPTED") {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleProductionCheck}
          disabled={isSubmitting}
          className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Complete Production Check
        </Button>
      </div>
    );
  }

  // All other statuses — read only for Production Admin
  return null;
}