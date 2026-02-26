/**
 * FcActions.jsx  (UPDATED)
 *
 * Place at:
 *   src/features/crew/components/roleActions/FcActions/FcActions.jsx
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";
import { PenTool, Loader2 } from "lucide-react";
import { fcSignThunk, selectSubmitting } from "../../../store/offer.slice";
import SignDialog from "../../SignaturePad/SignDialog";

export default function FcActions({ offer }) {
  const dispatch     = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);
  const [showSign,   setShowSign] = useState(false);

  if (!offer || offer.status !== "PENDING_FC_SIGNATURE") return null;

  const handleSign = async (signatureDataUrl) => {
    const result = await dispatch(fcSignThunk({ offerId: offer._id, signature: signatureDataUrl }));
    if (fcSignThunk.fulfilled.match(result)) {
      toast.success("FC signature recorded! Awaiting Studio signature.");
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
        className="gap-1.5 bg-pink-600 hover:bg-pink-700 text-white"
      >
        {isSubmitting
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <PenTool className="w-3.5 h-3.5" />}
        Sign as FC
      </Button>

      <SignDialog
        open={showSign}
        onOpenChange={setShowSign}
        roleName="Financial Controller"
        offerCode={offer.offerCode}
        onSign={handleSign}
        isSubmitting={isSubmitting}
      />
    </>
  );
}