import { Card, CardHeader } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { 
  CheckCircle, Edit, Send, Eye, Download
} from "lucide-react";

// Format currency helper
const formatCurrency = (amount, currency = "GBP") => {
  if (!amount && amount !== 0) return "—";
  const symbols = { GBP: "£", USD: "$", EUR: "€" };
  return `${symbols[currency] || "£"}${parseFloat(amount).toLocaleString("en-GB", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
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
  DRAFT: { label: "Draft", variant: "secondary", color: "bg-slate-100 text-slate-700" },
  SENT_TO_CREW: { label: "Pending Your Review", variant: "default", color: "bg-amber-100 text-amber-700" },
  NEEDS_REVISION: { label: "Changes Requested", variant: "destructive", color: "bg-red-100 text-red-700" },
  CREW_ACCEPTED: { label: "Accepted", variant: "default", color: "bg-green-100 text-green-700" },
  PRODUCTION_CHECK: { label: "Production Review", variant: "secondary", color: "bg-teal-100 text-teal-700" },
  ACCOUNTS_CHECK: { label: "Accounts Review", variant: "secondary", color: "bg-purple-100 text-purple-700" },
  PENDING_CREW_SIGNATURE: { label: "Ready to Sign", variant: "default", color: "bg-blue-100 text-blue-700" },
  PENDING_UPM_SIGNATURE: { label: "Awaiting UPM", variant: "secondary", color: "bg-indigo-100 text-indigo-700" },
  PENDING_FC_SIGNATURE: { label: "Awaiting FC", variant: "secondary", color: "bg-pink-100 text-pink-700" },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio", variant: "secondary", color: "bg-violet-100 text-violet-700" },
  COMPLETED: { label: "Signed", variant: "default", color: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", variant: "destructive", color: "bg-red-100 text-red-700" },
};

// OfferCard Component
export function OfferCard({ offer, onRequestChange, onAccept, isAccepting, onView }) {
  const statusConfig = STATUS_CONFIG[offer.status] || { 
    label: offer.status, 
    variant: "secondary",
    color: "bg-slate-100 text-slate-700"
  };
  const primaryRole = offer.roles?.[0] || {};

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-200 border-l-4"
      style={{
        borderLeftColor: 
          offer.status === "SENT_TO_CREW" ? "#f59e0b" :
          offer.status === "COMPLETED" ? "#10b981" :
          offer.status === "PENDING_CREW_SIGNATURE" ? "#3b82f6" :
          "#94a3b8"
      }}
      data-testid={`card-offer-${offer.id}`}
    >
      <CardHeader className="px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={statusConfig.variant}
                className={statusConfig.color + " hover:" + statusConfig.color}
                data-testid={`badge-status-${offer.id}`}
              >
                {statusConfig.label}
              </Badge>
              {offer.status === "COMPLETED" && (
                <Badge 
                  variant="outline" 
                  className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50"
                >
                  <CheckCircle className="w-3 h-3" /> Contract Signed
                </Badge>
              )}
            </div>
            
            <div>
              <h3 
                className="text-lg font-semibold text-foreground leading-tight mb-1" 
                data-testid={`text-offer-name-${offer.id}`}
              >
                {primaryRole.jobTitle || "Role"} - {offer.productionName || "Production"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {primaryRole.department}{primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="font-semibold text-primary">
                {formatCurrency(primaryRole.contractRate, primaryRole.currency)}
                <span className="text-muted-foreground font-normal">/{primaryRole.rateType?.toLowerCase().replace('_', ' ') || "week"}</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {formatDate(primaryRole.startDate)} - {formatDate(primaryRole.endDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView && onView(offer.id)}
              className="hover:bg-muted"
              data-testid={`button-view-offer-${offer.id}`}
            >
              <Eye className="w-4 h-4 mr-1.5" /> View
            </Button>
            
            {offer.status === "SENT_TO_CREW" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRequestChange && onRequestChange(offer)}
                  className="hover:bg-muted"
                  data-testid={`button-request-changes-${offer.id}`}
                >
                  <Edit className="w-4 h-4 mr-1.5" /> Request Changes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onAccept && onAccept(offer.id)}
                  disabled={isAccepting}
                  className="bg-primary hover:bg-primary/90"
                  data-testid={`button-accept-${offer.id}`}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" /> 
                  {isAccepting ? "Accepting..." : "Accept"}
                </Button>
              </>
            )}
            
            {offer.status === "PENDING_CREW_SIGNATURE" && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                data-testid={`button-sign-${offer.id}`}
              >
                <Send className="w-4 h-4 mr-1.5" /> Sign Contract
              </Button>
            )}
            
            {offer.status === "COMPLETED" && (
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-muted"
                data-testid={`button-download-${offer.id}`}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

// Demo component to show the OfferCard with different states
export default function OfferCardDemo() {
  const [isAccepting, setIsAccepting] = useState(false);

  const sampleOffers = [
    {
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
        endDate: "2026-04-30",
        currency: "GBP"
      }]
    },
    {
      id: 2,
      status: "PENDING_CREW_SIGNATURE",
      productionName: "Action Hero 2",
      roles: [{
        jobTitle: "Gaffer",
        department: "Lighting",
        contractRate: 2800,
        rateType: "WEEKLY",
        startDate: "2026-02-15",
        endDate: "2026-06-15",
        currency: "GBP"
      }]
    },
    {
      id: 3,
      status: "COMPLETED",
      productionName: "Historical Epic",
      roles: [{
        jobTitle: "Key Grip",
        department: "Grip",
        contractRate: 2600,
        rateType: "WEEKLY",
        startDate: "2026-01-15",
        endDate: "2026-04-15",
        currency: "GBP"
      }]
    }
  ];

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

  const handleView = (offerId) => {
    alert(`Navigate to view offer ${offerId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">OfferCard Component Demo</h1>
          <p className="text-muted-foreground">Different states: Pending, Ready to Sign, and Completed</p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Pending Your Review
            </h2>
            <OfferCard 
              offer={sampleOffers[0]}
              onRequestChange={handleRequestChange}
              onAccept={handleAccept}
              onView={handleView}
              isAccepting={isAccepting}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Ready to Sign
            </h2>
            <OfferCard 
              offer={sampleOffers[1]}
              onRequestChange={handleRequestChange}
              onAccept={handleAccept}
              onView={handleView}
              isAccepting={isAccepting}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Signed Contract
            </h2>
            <OfferCard 
              offer={sampleOffers[2]}
              onRequestChange={handleRequestChange}
              onAccept={handleAccept}
              onView={handleView}
              isAccepting={isAccepting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}