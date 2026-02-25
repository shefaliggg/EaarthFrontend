/**
 * AccountsAdminActions.jsx
 *
 * Place at:
 *   src/features/crew/components/roleActions/AccountsAdminActions/AccountsAdminActions.jsx
 */
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { moveToAccountsCheckThunk, selectSubmitting } from "../../../store/offer.slice";

export default function AccountsAdminActions({ offer }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  if (!offer || offer.status !== "PRODUCTION_CHECK") return null;

  const handleAccountsCheck = async () => {
    const result = await dispatch(moveToAccountsCheckThunk(offer._id));
    if (moveToAccountsCheckThunk.fulfilled.match(result)) {
      toast.success("Accounts check completed!");
    } else {
      toast.error(result.payload?.message || "Failed to complete accounts check");
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleAccountsCheck}
      disabled={isSubmitting}
      className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
    >
      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
      Complete Accounts Check
    </Button>
  );
}