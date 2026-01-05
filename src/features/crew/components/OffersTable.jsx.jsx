import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Users, Eye, Edit2, FileText } from "lucide-react";
import { cn } from "@/shared/config/utils";

const STATUS_COLORS = {
  "REQUIRES ATTENTION": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
  "IN REVIEW": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  "PENDING": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  "OFFER SENT": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  "CREW ACCEPTED": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  "PRODUCTION CHECK": { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400" },
  "ACCOUNTS CHECK": { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  "CREW SIGN": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  "UPM SIGN": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  "FC SIGN": { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
  "STUDIO SIGN": { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400" },
  "CONTRACTED": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
};

function getStatusLabel(status) {
  const labels = {
    "DRAFT": "DRAFT",
    "SENT_TO_CREW": "OFFER SENT",
    "NEEDS_REVISION": "REQUIRES ATTENTION",
    "CREW_ACCEPTED": "CREW ACCEPTED",
    "PRODUCTION_CHECK": "PRODUCTION CHECK",
    "ACCOUNTS_CHECK": "ACCOUNTS CHECK",
    "PENDING_CREW_SIGNATURE": "CREW SIGN",
    "PENDING_UPM_SIGNATURE": "UPM SIGN",
    "PENDING_FC_SIGNATURE": "FC SIGN",
    "PENDING_STUDIO_SIGNATURE": "STUDIO SIGN",
    "COMPLETED": "CONTRACTED",
  };
  return labels[status] || status;
}

function getNextAction(status) {
  const actions = {
    "DRAFT": "Complete and send offer",
    "SENT_TO_CREW": "Awaiting crew response",
    "NEEDS_REVISION": "Review crew comments",
    "CREW_ACCEPTED": "Production review",
    "PRODUCTION_CHECK": "Verify requirements",
    "ACCOUNTS_CHECK": "Budget verification",
    "PENDING_CREW_SIGNATURE": "Awaiting crew signature",
    "PENDING_UPM_SIGNATURE": "UPM approval pending",
    "PENDING_FC_SIGNATURE": "Finance Controller sign",
    "PENDING_STUDIO_SIGNATURE": "Studio executive approval",
    "COMPLETED": "Contract complete",
  };
  return actions[status] || "Review offer";
}

export function OffersTable({ offers, isLoading, onNavigate }) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">No offers found</p>
        <p className="text-sm mt-1">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {offers.map((offer) => {
        const statusLabel = getStatusLabel(offer.status);
        const statusColors = STATUS_COLORS[statusLabel] || { bg: "bg-muted", text: "text-muted-foreground" };
        const roles = Array.isArray(offer.roles) ? offer.roles : [];
        const initials = offer.fullName?.split(' ').map(n => n[0]).join('') || '?';
        
        return (
          <div 
            key={offer.id} 
            className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
            data-testid={`row-offer-${offer.id}`}
          >
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm" data-testid={`text-offer-name-${offer.id}`}>
                  {offer.fullName}
                </span>
                <Badge 
                  variant="secondary"
                  className={cn("text-xs", statusColors.bg, statusColors.text)}
                >
                  {statusLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{roles[0]?.jobTitle || "No role"}</span>
                <span>-</span>
                <span className="text-primary font-medium">
                  {roles[0]?.rateType || "Weekly"} / {offer.contractType === "LOAN_OUT" ? "Loan Out" : offer.contractType === "PAYE" ? "PAYE" : offer.contractType?.replace(/_/g, ' ') || "Loan Out"}
                </span>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-right min-w-[140px]">
              <span className="text-xs text-muted-foreground">Next Action</span>
              <span className="text-sm font-medium">{getNextAction(offer.status)}</span>
            </div>

            <div className="flex gap-2">
              {["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(offer.status) ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => onNavigate(`/offers/${offer.id}/view`)}
                    data-testid={`button-view-${offer.id}`}
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-1 bg-primary"
                    onClick={() => onNavigate(`/offers/${offer.id}/edit`)}
                    data-testid={`button-edit-${offer.id}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  className="gap-1 bg-primary"
                  onClick={() => onNavigate(`/offers/${offer.id}/sign`)}
                  data-testid={`button-sign-${offer.id}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Sign
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}