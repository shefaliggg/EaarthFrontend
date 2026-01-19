import { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import {
  ArrowLeft, Edit2, Send, PenTool, Download, FileText, X, Save
} from "lucide-react";

// Mock data
const MOCK_OFFERS_LIST = [
  {
    id: "1",
    fullName: "CHRISTOPHER FITZPATRICK",
    email: "chris@example.com",
    mobileNumber: "+44 7123 456789",
    status: "SENT_TO_CREW",
    productionName: "PROJECT PHOENIX",
    productionType: "Feature Film",
    estimatedShootDates: "15 Jan 2025 - 30 Apr 2025",
    shootDuration: "75",
    studioCompany: "EAARTH STUDIOS",
    sentToCrewAt: "2025-01-10",
    updatedAt: "2025-01-15",
    confirmedEmploymentType: "DAILY SELF-EMPLOYED",
    otherDealProvisions: "Ad hoc days: Off-set rate £400; on-set upgrades rate £500",
    additionalNotes: "All box gear current and owned by recipient. SCHD.",
    roles: [{
      id: "r1",
      isPrimaryRole: true,
      jobTitle: "SMUFX MODELLER",
      department: "PROSTHETICS",
      unit: "MAIN",
      regularSiteOfWork: "Off set",
      startDate: "2026-01-06",
      endDate: "2026-04-30",
      dailyOrWeeklyEngagement: "WEEKLY",
      workingWeek: "5 DAYS",
      shiftHours: "10",
      contractRate: "850.00",
      rateType: "WEEKLY",
      budgetCode: "10-987",
      allowances: {
        boxRental: true,
        boxRentalFeePerWeek: "150.00",
        boxRentalBudgetCode: "10-988",
        computerAllowance: true,
        computerAllowanceFeePerWeek: "50.00",
        computerAllowanceBudgetCode: "10-989",
      }
    }]
  },
  {
    id: "2",
    fullName: "SARAH JOHNSON",
    email: "sarah@example.com",
    mobileNumber: "+44 7987 654321",
    status: "COMPLETED",
    productionName: "PROJECT ATLAS",
    productionType: "TV Series",
    estimatedShootDates: "01 Feb 2025 - 31 May 2025",
    sentToCrewAt: "2024-12-15",
    crewAcceptedAt: "2024-12-20",
    crewSignedAt: "2025-01-05",
    upmSignedAt: "2025-01-06",
    fcSignedAt: "2025-01-07",
    studioSignedAt: "2025-01-08",
    confirmedEmploymentType: "LOAN_OUT",
    roles: [{
      id: "r2",
      isPrimaryRole: true,
      jobTitle: "DIRECTOR OF PHOTOGRAPHY",
      department: "CAMERA",
      unit: "MAIN UNIT",
      regularSiteOfWork: "PINEWOOD STUDIOS",
      startDate: "2025-02-01",
      endDate: "2025-05-31",
      dailyOrWeeklyEngagement: "WEEKLY",
      workingWeek: "5 DAYS",
      shiftHours: "12",
      contractRate: "2500.00",
      rateType: "WEEKLY",
      customOvertimeRates: {
        sixthDayHourlyRate: "125.00",
        seventhDayHourlyRate: "150.00"
      },
      allowances: {
        computerAllowance: true,
        computerAllowanceFeePerWeek: "75.00",
        vehicleAllowance: true,
        vehicleAllowanceFeePerWeek: "200.00"
      }
    }]
  }
];

import OfferStatusProgress from '../components/OfferStatusProgress';
import OfferDocuments from '../components/OfferDocuments';
import OfferDetailsCards from '../components/OfferDetailsCards';
import OfferCompensation from '../components/OfferCompensation';

export default function ViewOffer() {
  const [selectedOfferId, setSelectedOfferId] = useState("1");
  const [viewAsRole, setViewAsRole] = useState("CREW");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedOffer, setEditedOffer] = useState(null);

  const offer = editedOffer || MOCK_OFFERS_LIST.find(o => o.id === selectedOfferId);

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-6">
        <div className="container mx-auto">
          <p className="text-center text-muted-foreground">Offer not found</p>
        </div>
      </div>
    );
  }

  const primaryRole = offer.roles?.[0] || {};

  const handleDownloadDocument = (docId) => {
    console.log('Download document:', docId);
  };

  const handleEdit = () => {
    setEditedOffer(JSON.parse(JSON.stringify(offer)));
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditedOffer(null);
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    console.log('Saving edited offer:', editedOffer);
    setIsEditMode(false);
  };

  const handleOfferUpdate = (updates) => {
    setEditedOffer(prev => ({ ...prev, ...updates }));
  };

  const handleRoleUpdate = (updates) => {
    setEditedOffer(prev => ({
      ...prev,
      roles: [{ ...prev.roles[0], ...updates }]
    }));
  };

  const getActionButton = () => {
    if (isEditMode) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSaveEdit}>
            <Save className="w-4 h-4 mr-1" /> Save Changes
          </Button>
        </div>
      );
    }

    if (viewAsRole === "CREW" && offer.status === "SENT_TO_CREW") {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-1" /> Review
          </Button>
        </div>
      );
    }

    if (viewAsRole === "CREW" && offer.status === "PENDING_CREW_SIGNATURE") {
      return (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <PenTool className="w-4 h-4 mr-1" /> Sign Contract
        </Button>
      );
    }

    if (offer.status === "COMPLETED") {
      return (
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> Download Contract
        </Button>
      );
    }

    if (viewAsRole === "PRODUCTION_ADMIN" && (offer.status === "DRAFT" || offer.status === "NEEDS_REVISION")) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button size="sm">
            <Send className="w-4 h-4 mr-1" /> Send to Crew
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="">
      <div className="container mx-auto p-6 space-y-4">
        {/* Demo Controls */}
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  Select Offer
                </label>
                <select
                  value={selectedOfferId}
                  onChange={(e) => {
                    setSelectedOfferId(e.target.value);
                    setIsEditMode(false);
                    setEditedOffer(null);
                  }}
                  className="w-full border rounded-md px-2 py-1.5 text-sm bg-white"
                  disabled={isEditMode}
                >
                  {MOCK_OFFERS_LIST.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.fullName} - {o.roles?.[0]?.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  View As Role
                </label>
                <select
                  value={viewAsRole}
                  onChange={(e) => setViewAsRole(e.target.value)}
                  className="w-full border rounded-md px-2 py-1.5 text-sm bg-white"
                  disabled={isEditMode}
                >
                  <option value="CREW">CREW</option>
                  <option value="PRODUCTION_ADMIN">PRODUCTION ADMIN</option>
                  <option value="ACCOUNTS">ACCOUNTS</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ArrowLeft className="w-3 h-3 mr-1" /> Offers
              </Button>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {isEditMode && <Badge variant="secondary" className="text-xs">EDITING</Badge>}
              {offer.fullName}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {primaryRole?.jobTitle} • {primaryRole?.department}
            </p>
          </div>
          {getActionButton()}
        </div>

        {/* Status Progress */}
        <OfferStatusProgress
          status={offer.status}
          sentToCrewAt={offer.sentToCrewAt}
          updatedAt={offer.updatedAt}
          crewAcceptedAt={offer.crewAcceptedAt}
          productionCheckCompletedAt={offer.productionCheckCompletedAt}
          accountsCheckCompletedAt={offer.accountsCheckCompletedAt}
        />

        {/* Documents */}
        <OfferDocuments
          documents={['passport', 'right_to_work', 'employment_contract', 'tax_forms', 'bank_details', 'nda']}
          onDownload={handleDownloadDocument}
        />

        {/* Details Grid */}
        <OfferDetailsCards
          offer={offer}
          primaryRole={primaryRole}
          isEditing={isEditMode}
          onUpdate={handleOfferUpdate}
        />

        {/* Compensation */}
        <OfferCompensation
          primaryRole={primaryRole}
          isEditing={isEditMode}
          onUpdate={handleRoleUpdate}
        />

        {/* Notes Section */}
        {(offer.otherDealProvisions || offer.additionalNotes || isEditMode) && (
          <Card className="border shadow-sm">
            <div className="px-4 py-2 border-b bg-muted/20">
              <h3 className="text-xs font-bold uppercase tracking-wide">Additional Notes</h3>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(offer.otherDealProvisions || isEditMode) && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-2">
                      Deal Provisions
                    </label>
                    {isEditMode ? (
                      <textarea
                        value={offer.otherDealProvisions || ""}
                        onChange={(e) => handleOfferUpdate({ otherDealProvisions: e.target.value })}
                        className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-none"
                        placeholder="Enter deal provisions..."
                      />
                    ) : (
                      <p className="text-sm px-3 py-2 bg-muted/30 rounded border min-h-[80px]">
                        {offer.otherDealProvisions}
                      </p>
                    )}
                  </div>
                )}
                {(offer.additionalNotes || isEditMode) && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-2">
                      Additional Notes
                    </label>
                    {isEditMode ? (
                      <textarea
                        value={offer.additionalNotes || ""}
                        onChange={(e) => handleOfferUpdate({ additionalNotes: e.target.value })}
                        className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-none"
                        placeholder="Enter additional notes..."
                      />
                    ) : (
                      <p className="text-sm px-3 py-2 bg-muted/30 rounded border min-h-[80px]">
                        {offer.additionalNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}