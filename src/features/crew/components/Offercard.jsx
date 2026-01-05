import { Card, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { 
  CheckCircle, Edit, Send, Eye, Download
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

const formatCurrency = (amount, currency = "GBP") => {
  if (!amount && amount !== 0) return "—";
  const symbols = { GBP: "£", USD: "$", EUR: "€" };
  return `${symbols[currency] || "£"}${parseFloat(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "EEE dd MMM, yyyy");
  } catch {
    return dateStr;
  }
};

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", variant: "secondary" },
  SENT_TO_CREW: { label: "Pending Your Review", variant: "default" },
  NEEDS_REVISION: { label: "Changes Requested", variant: "destructive" },
  CREW_ACCEPTED: { label: "Accepted", variant: "default" },
  PRODUCTION_CHECK: { label: "Production Review", variant: "secondary" },
  ACCOUNTS_CHECK: { label: "Accounts Review", variant: "secondary" },
  PENDING_CREW_SIGNATURE: { label: "Ready to Sign", variant: "default" },
  PENDING_UPM_SIGNATURE: { label: "Awaiting UPM", variant: "secondary" },
  PENDING_FC_SIGNATURE: { label: "Awaiting FC", variant: "secondary" },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio", variant: "secondary" },
  COMPLETED: { label: "Signed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function OfferCard({ offer, onRequestChange, onAccept, isAccepting }) {
  const statusConfig = STATUS_CONFIG[offer.status] || { label: offer.status, variant: "secondary" };
  const primaryRole = offer.roles?.[0] || {};

  return (
    <Card className="overflow-hidden" data-testid={`card-offer-${offer.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <StatusBadge 
                status={offer.status}
                label={statusConfig.label}
                showIcon={true}
                size="md"
              />
              {offer.status === "COMPLETED" && (
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950">
                  <CheckCircle className="w-3 h-3" /> Contract Signed
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold" data-testid={`text-offer-name-${offer.id}`}>
              {primaryRole.jobTitle || "Role"} - {offer.productionName || "Production"}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {primaryRole.department} {primaryRole.subDepartment ? `- ${primaryRole.subDepartment}` : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(primaryRole.contractRate)}/{primaryRole.rateType?.toLowerCase() || "week"} | {formatDate(primaryRole.startDate)} - {formatDate(primaryRole.endDate)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild data-testid={`button-view-offer-${offer.id}`}>
              <Link href={`/offers/${offer.id}/view`}>
                <Eye className="w-4 h-4 mr-1" /> View
              </Link>
            </Button>
            {offer.status === "SENT_TO_CREW" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRequestChange(offer)}
                  data-testid={`button-request-changes-${offer.id}`}
                >
                  <Edit className="w-4 h-4 mr-1" /> Request Changes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onAccept(offer.id)}
                  disabled={isAccepting}
                  data-testid={`button-accept-${offer.id}`}
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Accept
                </Button>
              </>
            )}
            {offer.status === "PENDING_CREW_SIGNATURE" && (
              <Button size="sm" asChild data-testid={`button-sign-${offer.id}`}>
                <Link href={`/offers/${offer.id}/sign`}>
                  <Send className="w-4 h-4 mr-1" /> Sign Contract
                </Link>
              </Button>
            )}
            {offer.status === "COMPLETED" && (
              <Button variant="ghost" size="icon" data-testid={`button-download-${offer.id}`}>
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}