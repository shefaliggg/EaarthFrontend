/**
 * StudioActions.jsx
 *
 * Place at:
 *   src/features/crew/components/roleActions/StudioActions/StudioActions.jsx
 */
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { PenTool, Loader2 } from "lucide-react";
import { studioSignThunk, selectSubmitting } from "../../../store/offer.slice";

export default function StudioActions({ offer }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);

  if (!offer || offer.status !== "PENDING_STUDIO_SIGNATURE") return null;

  const handleSign = async () => {
    const result = await dispatch(studioSignThunk(offer._id));
    if (studioSignThunk.fulfilled.match(result)) {
      toast.success("🎉 Studio signed! Offer is now COMPLETED.");
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleSign}
      disabled={isSubmitting}
      className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
    >
      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenTool className="w-3.5 h-3.5" />}
      Final Studio Sign-off
    </Button>
  );
}