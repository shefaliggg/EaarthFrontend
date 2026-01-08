// src/crew/components/ViewOfferActions.jsx

import { Button } from "../../../shared/components/ui/button";
import { 
  Edit2, Send, FileText, Calculator, 
  PenTool, Download, ClipboardCheck 
} from "lucide-react";

/**
 * Role-based action buttons for ViewOffer page
 * Shows different actions based on user role and offer status
 */
export function ViewOfferActions({ 
  role, 
  status, 
  offerId,
  onEdit,
  onSend,
  onReview,
  onSign,
  onProductionCheck,
  onAccountsCheck,
  onViewContract
}) {
  
  // Production Admin actions
  if (role === "PRODUCTION_ADMIN") {
    if (status === "DRAFT" || status === "NEEDS_REVISION") {
      return (
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => onEdit?.(offerId)}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Offer
          </Button>
          <Button onClick={() => onSend?.(offerId)}>
            <Send className="w-4 h-4 mr-2" /> Send to Crew
          </Button>
        </div>
      );
    }
    
    if (status === "CREW_ACCEPTED" || status === "PRODUCTION_CHECK") {
      return (
        <Button onClick={() => onProductionCheck?.(offerId)}>
          <ClipboardCheck className="w-4 h-4 mr-2" /> Production Check
        </Button>
      );
    }
  }
  
  // Crew actions
  if (role === "CREW") {
    if (status === "SENT_TO_CREW") {
      return (
        <Button onClick={() => onReview?.(offerId)}>
          <FileText className="w-4 h-4 mr-2" /> Review Offer
        </Button>
      );
    }
    
    if (status === "PENDING_CREW_SIGNATURE") {
      return (
        <Button onClick={() => onSign?.(offerId, "crew")}>
          <PenTool className="w-4 h-4 mr-2" /> Sign Contract
        </Button>
      );
    }
  }
  
  // Accounts Admin actions
  if (role === "ACCOUNTS_ADMIN" && status === "ACCOUNTS_CHECK") {
    return (
      <Button onClick={() => onAccountsCheck?.(offerId)}>
        <Calculator className="w-4 h-4 mr-2" /> Accounts Check
      </Button>
    );
  }
  
  // UPM actions
  if (role === "UPM" && status === "PENDING_UPM_SIGNATURE") {
    return (
      <Button onClick={() => onSign?.(offerId, "upm")}>
        <PenTool className="w-4 h-4 mr-2" /> Sign as UPM
      </Button>
    );
  }
  
  // FC actions
  if (role === "FC" && status === "PENDING_FC_SIGNATURE") {
    return (
      <Button onClick={() => onSign?.(offerId, "fc")}>
        <PenTool className="w-4 h-4 mr-2" /> Sign as FC
      </Button>
    );
  }
  
  // Studio actions
  if (role === "STUDIO" && status === "PENDING_STUDIO_SIGNATURE") {
    return (
      <Button onClick={() => onSign?.(offerId, "studio")}>
        <PenTool className="w-4 h-4 mr-2" /> Sign as Studio
      </Button>
    );
  }
  
  // Completed - anyone can view
  if (status === "COMPLETED") {
    return (
      <Button variant="outline" onClick={() => onViewContract?.(offerId)}>
        <Download className="w-4 h-4 mr-2" /> View Signed Contract
      </Button>
    );
  }
  
  // No actions available for this role/status combination
  return null;
}