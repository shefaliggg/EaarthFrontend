/**
 * AccountsAdminActions.jsx  (UPDATED)
 *
 * Accounts Admin handles two transitions:
 *   PRODUCTION_CHECK → ACCOUNTS_CHECK  (complete accounts check)
 *   ACCOUNTS_CHECK   → PENDING_CREW_SIGNATURE  (release for signing)
 *
 * Place at:
 *   src/features/crew/components/roleActions/AccountsAdminActions/AccountsAdminActions.jsx
 */

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  selectSubmitting,
} from "../../../store/offer.slice";

export default function AccountsAdminActions({ offer }) {
  const dispatch     = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  if (!offer) return null;
  const { _id: offerId, status } = offer;

  // PRODUCTION_CHECK → ACCOUNTS_CHECK
  if (status === "PRODUCTION_CHECK") {
    return (
      <Button
        size="sm"
        onClick={async () => {
          const result = await dispatch(moveToAccountsCheckThunk(offerId));
          if (moveToAccountsCheckThunk.fulfilled.match(result)) {
            toast.success("Accounts check completed!");
          } else {
            toast.error(result.payload?.message || "Failed");
          }
        }}
        disabled={isSubmitting}
        className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        Complete Accounts Check
      </Button>
    );
  }

  // ACCOUNTS_CHECK → PENDING_CREW_SIGNATURE
  if (status === "ACCOUNTS_CHECK") {
    return (
      <Button
        size="sm"
        onClick={async () => {
          const result = await dispatch(moveToPendingCrewSignatureThunk(offerId));
          if (moveToPendingCrewSignatureThunk.fulfilled.match(result)) {
            toast.success("Released for crew signature!");
          } else {
            toast.error(result.payload?.message || "Failed");
          }
        }}
        disabled={isSubmitting}
        className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        Release for Signing
      </Button>
    );
  }

  return null;
}