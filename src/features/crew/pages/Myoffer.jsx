import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { 
  FileText, 
  AlertCircle, 
  MessageSquare, 
  User, 
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { PageHeader } from '@/shared/components/PageHeader';
import { OfferCard } from './OfferCard';

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// Error State Component
function ErrorState() {
  return (
    <div className="p-6">
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Offers</h3>
        <p className="text-muted-foreground">Unable to load your offers.</p>
      </Card>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Offers Yet</h3>
      <p className="text-muted-foreground">You don't have any offers assigned to you yet.</p>
      <p className="text-sm text-muted-foreground mt-2">When production sends you an offer, it will appear here.</p>
    </Card>
  );
}

// Offers Summary Component
function OffersSummary({ pendingCount, inProgressCount, signedCount }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span>Pending: {pendingCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span>In Progress: {inProgressCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Signed: {signedCount}</span>
      </div>
    </div>
  );
}

// Offers Section Component
function OffersSection({ 
  title, 
  icon: Icon, 
  iconColor,
  count, 
  offers, 
  onRequestChange, 
  onAccept, 
  isAccepting 
}) {
  if (offers.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        {title} ({count})
      </h2>
      <div className="space-y-3">
        {offers.map(offer => (
          <OfferCard 
            key={offer.id} 
            offer={offer}
            onRequestChange={onRequestChange}
            onAccept={onAccept}
            isAccepting={isAccepting}
          />
        ))}
      </div>
    </div>
  );
}

// Change Request Dialog Component
function ChangeRequestDialog({ 
  open, 
  onOpenChange, 
  changeReason, 
  setChangeReason,
  changeFields,
  setChangeFields,
  onSubmit,
  isSubmitting
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Let production know what changes you need to the offer
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What needs to change?</Label>
            <Textarea 
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Describe the changes you would like..."
              className="min-h-[100px]"
              data-testid="textarea-change-reason"
            />
          </div>
          <div className="space-y-2">
            <Label>Specific fields (optional)</Label>
            <Textarea 
              value={changeFields}
              onChange={(e) => setChangeFields(e.target.value)}
              placeholder="E.g., rate, start date, allowances (comma-separated)"
              data-testid="textarea-change-fields"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            data-testid="button-cancel-change-request"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!changeReason.trim() || isSubmitting}
            data-testid="button-submit-change-request"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main MyOffer Component
export default function MyOffer() {
  const { toast } = useToast();
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [changeFields, setChangeFields] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ["/api/my-offers"],
  });

  const acceptMutation = useMutation({
    mutationFn: async (offerId) => {
      return apiRequest("POST", `/api/offers/${offerId}/accept`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-offers"] });
      toast({ title: "Offer accepted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to accept offer", variant: "destructive" });
    }
  });

  const changeRequestMutation = useMutation({
    mutationFn: async ({ offerId, reason, fieldsRequested }) => {
      return apiRequest("POST", `/api/offers/${offerId}/change-requests`, {
        reason,
        fieldsRequested,
        status: "PENDING"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-offers"] });
      setShowChangeDialog(false);
      setChangeReason("");
      setChangeFields("");
      toast({ title: "Change request submitted" });
    },
    onError: () => {
      toast({ title: "Failed to submit change request", variant: "destructive" });
    }
  });

  const handleRequestChange = (offer) => {
    setSelectedOffer(offer);
    setShowChangeDialog(true);
  };

  const submitChangeRequest = () => {
    if (!selectedOffer || !changeReason.trim()) return;
    changeRequestMutation.mutate({
      offerId: selectedOffer.id,
      reason: changeReason,
      fieldsRequested: changeFields.split(",").map(f => f.trim()).filter(Boolean)
    });
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;

  const pendingOffers = offers.filter(o => ["SENT_TO_CREW", "NEEDS_REVISION"].includes(o.status));
  const inProgressOffers = offers.filter(o => ["CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK", "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"].includes(o.status));
  const completedOffers = offers.filter(o => o.status === "COMPLETED");

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="My Offers"
          subtitle="View and manage your crew offers"
          icon="User"
          extraContents={
            <OffersSummary 
              pendingCount={pendingOffers.length}
              inProgressCount={inProgressOffers.length}
              signedCount={completedOffers.length}
            />
          }
        />

        {offers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <OffersSection
              title="Pending Your Response"
              icon={MessageSquare}
              iconColor="text-amber-500"
              count={pendingOffers.length}
              offers={pendingOffers}
              onRequestChange={handleRequestChange}
              onAccept={(id) => acceptMutation.mutate(id)}
              isAccepting={acceptMutation.isPending}
            />

            <OffersSection
              title="In Progress"
              icon={User}
              iconColor="text-blue-500"
              count={inProgressOffers.length}
              offers={inProgressOffers}
              onRequestChange={handleRequestChange}
              onAccept={(id) => acceptMutation.mutate(id)}
              isAccepting={acceptMutation.isPending}
            />

            <OffersSection
              title="Signed Contracts"
              icon={CheckCircle}
              iconColor="text-emerald-500"
              count={completedOffers.length}
              offers={completedOffers}
              onRequestChange={handleRequestChange}
              onAccept={(id) => acceptMutation.mutate(id)}
              isAccepting={acceptMutation.isPending}
            />
          </div>
        )}
      </div>

      <ChangeRequestDialog
        open={showChangeDialog}
        onOpenChange={setShowChangeDialog}
        changeReason={changeReason}
        setChangeReason={setChangeReason}
        changeFields={changeFields}
        setChangeFields={setChangeFields}
        onSubmit={submitChangeRequest}
        isSubmitting={changeRequestMutation.isPending}
      />
    </div>
  );
}