/**
 * FcActions.jsx
 *
 * Place at:
 *   src/features/crew/components/roleActions/FcActions/FcActions.jsx
 */
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { PenTool, Loader2 } from "lucide-react";
import { fcSignThunk, selectSubmitting } from "../../../store/offer.slice";

export default function FcActions({ offer }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  if (!offer || offer.status !== "PENDING_FC_SIGNATURE") return null;

  const handleSign = async () => {
    const result = await dispatch(fcSignThunk(offer._id));
    if (fcSignThunk.fulfilled.match(result)) {
      toast.success("FC signature recorded!");
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleSign}
      disabled={isSubmitting}
      className="gap-1.5 bg-pink-600 hover:bg-pink-700 text-white"
    >
      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenTool className="w-3.5 h-3.5" />}
      Sign as FC
    </Button>
  );
}