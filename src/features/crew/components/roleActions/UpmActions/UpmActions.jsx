/**
 * UpmActions.jsx
 *
 * Place at:
 *   src/features/crew/components/roleActions/UpmActions/UpmActions.jsx
 */
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { PenTool, Loader2 } from "lucide-react";
import { upmSignThunk, selectSubmitting } from "../../../store/offer.slice";

export default function UpmActions({ offer }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  if (!offer || offer.status !== "PENDING_UPM_SIGNATURE") return null;

  const handleSign = async () => {
    const result = await dispatch(upmSignThunk(offer._id));
    if (upmSignThunk.fulfilled.match(result)) {
      toast.success("UPM signature recorded!");
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleSign}
      disabled={isSubmitting}
      className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenTool className="w-3.5 h-3.5" />}
      Sign as UPM
    </Button>
  );
}