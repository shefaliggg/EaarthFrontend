// src/features/crew/pages/MyOffer.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../shared/components/ui/dialog";
import { Textarea } from "../../../shared/components/ui/textarea";
import { Label } from "../../../shared/components/ui/label";
import { FileText, MessageSquare, User, CheckCircle } from "lucide-react";

// Mock data imports
import { USE_MOCK_DATA } from "../mocks/mockConfig";
import { getMockOffers } from "../mocks/mockOffers";
import { OfferCard } from "../components/Offercard";

export default function MyOffer() {
  const navigate = useNavigate();
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [changeFields, setChangeFields] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get offers (mock or real)
  let offers;
  if (USE_MOCK_DATA) {
    offers = getMockOffers();
  } else {
    // TODO: Replace with real data fetching
    offers = [];
  }

  const handleViewOffer = (offerId) => {
    navigate(`/projects/demo-project/offers/${offerId}/view`);
  };

  const handleRequestChange = (offer) => {
    setSelectedOffer(offer);
    setShowChangeDialog(true);
  };

  const handleAccept = (offerId) => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      alert("Offer accepted successfully!");
    }, 1000);
  };

  const submitChangeRequest = () => {
    if (!selectedOffer || !changeReason.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowChangeDialog(false);
      setChangeReason("");
      setChangeFields("");
      alert("Change request submitted!");
    }, 1000);
  };

  // Filter offers by status
  const pendingOffers = offers.filter(o => ["SENT_TO_CREW", "NEEDS_REVISION"].includes(o.status));
  const inProgressOffers = offers.filter(o => [
    "CREW_ACCEPTED", 
    "PRODUCTION_CHECK", 
    "ACCOUNTS_CHECK", 
    "PENDING_CREW_SIGNATURE", 
    "PENDING_UPM_SIGNATURE", 
    "PENDING_FC_SIGNATURE", 
    "PENDING_STUDIO_SIGNATURE"
  ].includes(o.status));
  const completedOffers = offers.filter(o => o.status === "COMPLETED");

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
  function OffersSection({ title, icon: Icon, iconColor, count, offers }) {
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
              onView={handleViewOffer}
              onRequestChange={handleRequestChange}
              onAccept={handleAccept}
              isAccepting={isAccepting}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-my-offers-title">
              My Offers
            </h1>
            <p className="text-muted-foreground mt-0.5">View and manage your crew offers</p>
          </div>
          <OffersSummary 
            pendingCount={pendingOffers.length}
            inProgressCount={inProgressOffers.length}
            signedCount={completedOffers.length}
          />
        </div>

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
            />

            <OffersSection
              title="In Progress"
              icon={User}
              iconColor="text-blue-500"
              count={inProgressOffers.length}
              offers={inProgressOffers}
            />

            <OffersSection
              title="Signed Contracts"
              icon={CheckCircle}
              iconColor="text-emerald-500"
              count={completedOffers.length}
              offers={completedOffers}
            />
          </div>
        )}
      </div>

      {/* Change Request Dialog */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
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
            <Button variant="outline" onClick={() => setShowChangeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitChangeRequest}
              disabled={!changeReason.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}