/**
 * StudioActions.jsx  (UPDATED)
 *
 * Place at:
 *   src/features/crew/components/roleActions/StudioActions/StudioActions.jsx
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { PenTool, Loader2, Trophy } from "lucide-react";
import { studioSignThunk, selectSubmitting } from "../../../store/offer.slice";
import SignDialog from "../../SignaturePad/SignDialog";

export default function StudioActions({ offer }) {
  const dispatch     = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);
  const [showSign,   setShowSign] = useState(false);

  if (!offer || offer.status !== "PENDING_STUDIO_SIGNATURE") return null;

  const handleSign = async (signatureDataUrl) => {
    const result = await dispatch(studioSignThunk({ offerId: offer._id, signature: signatureDataUrl }));
    if (studioSignThunk.fulfilled.match(result)) {
      toast.success("🎉 Studio signed! Offer is now COMPLETED.");
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowSign(true)}
        disabled={isSubmitting}
        className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
      >
        {isSubmitting
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Trophy className="w-3.5 h-3.5" />}
        Final Studio Sign-off
      </Button>

      <SignDialog
        open={showSign}
        onOpenChange={setShowSign}
        roleName="Studio"
        offerCode={offer.offerCode}
        onSign={handleSign}
        isSubmitting={isSubmitting}
      />
    </>
  );
}