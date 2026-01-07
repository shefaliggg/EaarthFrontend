import { Card, CardHeader } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { 
  CheckCircle, 
  Edit, 
  Send, 
  Eye, 
  Download
} from "lucide-react";

// Format currency helper
const formatCurrency = (amount, currency = "GBP") => {
  if (!amount && amount !== 0) return "—";
  const symbols = { GBP: "£", USD: "$", EUR: "€" };
  return `${symbols[currency] || "£"}${parseFloat(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

// Status configuration
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

// OfferCard Component
export function OfferCard({ offer, onRequestChange, onAccept, isAccepting }) {
  const statusConfig = STATUS_CONFIG[offer.status] || { label: offer.status, variant: "secondary" };
  const primaryRole = offer.roles?.[0] || {};

  return (
    <Card className="overflow-hidden " data-testid={`card-offer-${offer.id}`}>
      <CardHeader className="px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={statusConfig.variant} data-testid={`badge-status-${offer.id}`}>
                {statusConfig.label}
              </Badge>
              {offer.status === "COMPLETED" && (
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
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
            <Button variant="outline" size="sm" data-testid={`button-view-offer-${offer.id}`}>
              <Eye className="w-4 h-4 mr-1" /> View
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
              <Button size="sm" data-testid={`button-sign-${offer.id}`}>
                <Send className="w-4 h-4 mr-1" /> Sign Contract
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

// Demo component to show the OfferCard
export default function OfferCardDemo() {
  const [isAccepting, setIsAccepting] = useState(false);

  const sampleOffer = {
    id: 1,
    status: "SENT_TO_CREW",
    productionName: "The Great Adventure",
    roles: [{
      jobTitle: "Director of Photography",
      department: "Camera",
      subDepartment: "Main Unit",
      contractRate: 2500,
      rateType: "WEEKLY",
      startDate: "2026-02-01",
      endDate: "2026-04-30"
    }]
  };

  const handleRequestChange = (offer) => {
    alert(`Request changes for offer ${offer.id}`);
  };

  const handleAccept = (offerId) => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      alert(`Offer ${offerId} accepted!`);
    }, 1000);
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">OfferCard Component Demo</h2>
        <OfferCard 
          offer={sampleOffer}
          onRequestChange={handleRequestChange}
          onAccept={handleAccept}
          isAccepting={isAccepting}
        />
      </div>
    </div>
  );
}