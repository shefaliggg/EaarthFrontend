import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../shared/components/ui/collapsible";
import { Separator } from "../../../shared/components/ui/separator";
import { 
  ArrowLeft, User, Briefcase, DollarSign, Building2, 
  Package, FileText, CheckCircle, Edit2, Send, 
  ClipboardCheck, Calculator, PenTool, Download,
  ChevronDown, ChevronUp
} from "lucide-react";
import { MOCK_OFFERS_LIST, getMockOfferById } from '../mocks/mockOffers'; // Updated import

// Create a lookup object for easier access in the demo controls
const MOCK_OFFERS = MOCK_OFFERS_LIST.reduce((acc, offer) => {
  acc[offer.id] = offer;
  return acc;
}, {});

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  SENT_TO_CREW: { label: "Pending Your Review", color: "bg-amber-100 text-amber-700" },
  NEEDS_REVISION: { label: "Changes Requested", color: "bg-red-100 text-red-700" },
  CREW_ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700" },
  PRODUCTION_CHECK: { label: "Production Review", color: "bg-teal-100 text-teal-700" },
  ACCOUNTS_CHECK: { label: "Accounts Review", color: "bg-purple-100 text-purple-700" },
  PENDING_CREW_SIGNATURE: { label: "Ready to Sign", color: "bg-blue-100 text-blue-700" },
  PENDING_UPM_SIGNATURE: { label: "Awaiting UPM", color: "bg-indigo-100 text-indigo-700" },
  PENDING_FC_SIGNATURE: { label: "Awaiting FC", color: "bg-pink-100 text-pink-700" },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio", color: "bg-violet-100 text-violet-700" },
  COMPLETED: { label: "Signed", color: "bg-emerald-100 text-emerald-700" },
};

const formatCurrency = (amount, currency = "GBP") => {
  if (!amount) return "—";
  return `£${parseFloat(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()} at ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch {
    return dateStr;
  }
};

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function DataRow({ label, value, highlight = false }) {
  return (
    <div className="grid grid-cols-3 py-2 border-b border-muted/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm col-span-2 ${highlight ? "text-primary font-semibold" : "font-medium"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function ViewOffer() {
  const navigate = useNavigate();
  const { projectName, id } = useParams();
  
  const [selectedOfferId, setSelectedOfferId] = useState(id || "1");
  const [viewAsRole, setViewAsRole] = useState("CREW");

  const offer = MOCK_OFFERS[selectedOfferId] || getMockOfferById(selectedOfferId);
  
  if (!offer) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Offer not found</p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[offer.status] || { label: offer.status, color: "bg-muted" };
  const primaryRole = offer.roles?.[0] || {};

  // Determine which sections to show based on status
  const isPending = ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION"].includes(offer.status);
  const isInProgress = [
    "CREW_ACCEPTED", 
    "PRODUCTION_CHECK", 
    "ACCOUNTS_CHECK", 
    "PENDING_CREW_SIGNATURE", 
    "PENDING_UPM_SIGNATURE", 
    "PENDING_FC_SIGNATURE", 
    "PENDING_STUDIO_SIGNATURE"
  ].includes(offer.status);
  const isCompleted = offer.status === "COMPLETED";

  // Navigation handlers using React Router
  const handleNavigateToSign = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/sign`);
  };

  const handleNavigateToViewContract = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/contract`);
  };

  const getActionButton = () => {
    if (viewAsRole === "CREW" && offer.status === "SENT_TO_CREW") {
      return (
        <Button onClick={() => navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/review`)}>
          <FileText className="w-4 h-4 mr-2" /> Review Offer
        </Button>
      );
    }
    if (viewAsRole === "CREW" && offer.status === "PENDING_CREW_SIGNATURE") {
      return (
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNavigateToSign}
        >
          <PenTool className="w-4 h-4 mr-2" /> Sign Contract
        </Button>
      );
    }
    if (viewAsRole === "UPM" && offer.status === "PENDING_UPM_SIGNATURE") {
      return (
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={handleNavigateToSign}
        >
          <PenTool className="w-4 h-4 mr-2" /> Sign as UPM
        </Button>
      );
    }
    if (viewAsRole === "FC" && offer.status === "PENDING_FC_SIGNATURE") {
      return (
        <Button 
          className="bg-pink-600 hover:bg-pink-700"
          onClick={handleNavigateToSign}
        >
          <PenTool className="w-4 h-4 mr-2" /> Sign as FC
        </Button>
      );
    }
    if (viewAsRole === "STUDIO" && offer.status === "PENDING_STUDIO_SIGNATURE") {
      return (
        <Button 
          className="bg-violet-600 hover:bg-violet-700"
          onClick={handleNavigateToSign}
        >
          <PenTool className="w-4 h-4 mr-2" /> Sign as Studio
        </Button>
      );
    }
    if (viewAsRole === "PRODUCTION_ADMIN" && (offer.status === "DRAFT" || offer.status === "NEEDS_REVISION")) {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/edit`)}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" /> Send to Crew
          </Button>
        </div>
      );
    }
    if (offer.status === "COMPLETED") {
      return (
        <Button 
          variant="outline"
          onClick={handleNavigateToViewContract}
        >
          <Download className="w-4 h-4 mr-2" /> View Signed Contract
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Demo Controls */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Select Offer to View
                </label>
                <select
                  value={selectedOfferId}
                  onChange={(e) => setSelectedOfferId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  {MOCK_OFFERS_LIST.map(offer => (
                    <option key={offer.id} value={offer.id}>
                      {offer.fullName} - {STATUS_CONFIG[offer.status]?.label || offer.status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  View As Role
                </label>
                <select
                  value={viewAsRole}
                  onChange={(e) => setViewAsRole(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="CREW">CREW</option>
                  <option value="PRODUCTION_ADMIN">PRODUCTION ADMIN</option>
                  <option value="UPM">UPM</option>
                  <option value="FC">FC</option>
                  <option value="STUDIO">STUDIO</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of your ViewOffer component remains the same... */}
        {/* Breadcrumb, Header, Status Section, etc. */}
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/projects/${projectName || 'demo-project'}/offers`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Offers
          </Button>
          <span>/</span>
          <span>Offer for {offer.fullName}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Badge className={`mb-2 ${statusConfig.color}`}>{statusConfig.label}</Badge>
            {offer.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Last updated {formatDateTime(offer.updatedAt)}
              </p>
            )}
            <h1 className="text-2xl font-bold mt-2">Offer for {offer.fullName}</h1>
          </div>
          {getActionButton()}
        </div>

        {/* All your existing sections... */}
        {/* I'll include the key sections for completeness */}
        
        {/* Status Section */}
        <CollapsibleSection title="Status" icon={CheckCircle}>
          <DataRow label="Status" value={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>} />
          {offer.sentToCrewAt && <DataRow label="Sent to crew" value={formatDate(offer.sentToCrewAt)} />}
          {offer.crewAcceptedAt && <DataRow label="Crew accepted" value={formatDate(offer.crewAcceptedAt)} />}
          {offer.productionCheckCompletedAt && <DataRow label="Production check completed" value={formatDate(offer.productionCheckCompletedAt)} />}
          {offer.accountsCheckCompletedAt && <DataRow label="Accounts check completed" value={formatDate(offer.accountsCheckCompletedAt)} />}
          {offer.crewSignedAt && <DataRow label="Crew signed" value={formatDate(offer.crewSignedAt)} />}
          {offer.upmSignedAt && <DataRow label="UPM signed" value={formatDate(offer.upmSignedAt)} />}
          {offer.fcSignedAt && <DataRow label="FC signed" value={formatDate(offer.fcSignedAt)} />}
          {offer.studioSignedAt && <DataRow label="Studio signed" value={formatDate(offer.studioSignedAt)} />}
        </CollapsibleSection>

        {/* Recipient Section */}
        <CollapsibleSection title="Recipient" icon={User}>
          <DataRow label="Full name" value={offer.fullName} />
          <DataRow label="Email" value={offer.email} />
          <DataRow label="Phone number" value={offer.mobileNumber} />
        </CollapsibleSection>

        {/* PENDING: Basic offer details */}
        {isPending && (
          <>
            <CollapsibleSection title="Offer details" icon={Briefcase}>
              <DataRow label="Job title" value={primaryRole.jobTitle} />
              <DataRow label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
              <DataRow label="Start date" value={formatDate(primaryRole.startDate)} />
              <DataRow label="End date" value={formatDate(primaryRole.endDate)} />
              <DataRow label="Rate" value={`${formatCurrency(primaryRole.contractRate)}/week`} highlight />
            </CollapsibleSection>

            <CollapsibleSection title="Project info" icon={Building2}>
              <DataRow label="Production" value={offer.productionName} />
              {offer.productionType && <DataRow label="Type" value={offer.productionType} />}
              {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} />}
            </CollapsibleSection>
          </>
        )}

        {/* IN PROGRESS: Detailed information */}
        {isInProgress && (
          <>
            <CollapsibleSection title="Offer details" icon={Briefcase}>
              <DataRow label="Unit" value={primaryRole.unit} />
              <DataRow label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
              <DataRow label="Job title" value={primaryRole.jobTitle} />
              <DataRow label="Workplace" value={primaryRole.regularSiteOfWork} />
              <DataRow label="Start & End date" value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} />
            </CollapsibleSection>

            <CollapsibleSection title="Contract" icon={FileText}>
              <DataRow label="Engagement" value={offer.confirmedEmploymentType?.replace(/_/g, " ")} highlight />
              <DataRow label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement} />
              <DataRow label="Working week" value={primaryRole.workingWeek} />
              <DataRow label="Standard working hours" value={primaryRole.shiftHours ? `${primaryRole.shiftHours} hours` : "—"} />
            </CollapsibleSection>

            <CollapsibleSection title="Fees" icon={DollarSign}>
              <DataRow label="Currency" value="GBP £" />
              <Separator className="my-3" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs text-muted-foreground font-medium"></th>
                      <th className="text-center py-2 text-xs text-muted-foreground font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 text-muted-foreground">Weekly rate</td>
                      <td className="py-2 text-center font-semibold">{formatCurrency(primaryRole.contractRate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {primaryRole.customOvertimeRates && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-0">
                    <h4 className="font-semibold text-sm mb-2">Overtime Rates</h4>
                    <DataRow label="6th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.sixthDayHourlyRate)} />
                    <DataRow label="7th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.seventhDayHourlyRate)} />
                  </div>
                </>
              )}
            </CollapsibleSection>

            {primaryRole.allowances && (
              <CollapsibleSection title="Allowances" icon={Package}>
                {primaryRole.allowances.boxRental && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">📦 Box Rental</h4>
                    <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.boxRentalFeePerWeek)} />
                  </div>
                )}
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Project info" icon={Building2}>
              <DataRow label="Project codename" value={offer.productionName} />
              {offer.productionType && <DataRow label="Type" value={offer.productionType} />}
              {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} />}
              {offer.shootDuration && <DataRow label="Shoot duration" value={`${offer.shootDuration} days`} />}
              {offer.studioCompany && <DataRow label="Studio/Production company" value={offer.studioCompany} />}
            </CollapsibleSection>
          </>
        )}

        {/* COMPLETED: Everything including signatures */}
        {isCompleted && (
          <>
            <CollapsibleSection title="Offer details" icon={Briefcase}>
              <DataRow label="Unit" value={primaryRole.unit} />
              <DataRow label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
              <DataRow label="Job title" value={primaryRole.jobTitle} />
              <DataRow label="Workplace" value={primaryRole.regularSiteOfWork} />
              <DataRow label="Start & End date" value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} />
            </CollapsibleSection>

            <CollapsibleSection title="Contract" icon={FileText}>
              <DataRow label="Engagement" value={offer.confirmedEmploymentType?.replace(/_/g, " ")} highlight />
              <DataRow label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement} />
              <DataRow label="Working week" value={primaryRole.workingWeek} />
              <DataRow label="Standard working hours" value={primaryRole.shiftHours ? `${primaryRole.shiftHours} hours` : "—"} />
            </CollapsibleSection>

            <CollapsibleSection title="Fees" icon={DollarSign}>
              <DataRow label="Currency" value="GBP £" />
              <Separator className="my-3" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs text-muted-foreground font-medium"></th>
                      <th className="text-center py-2 text-xs text-muted-foreground font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 text-muted-foreground">Weekly rate</td>
                      <td className="py-2 text-center font-semibold">{formatCurrency(primaryRole.contractRate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {primaryRole.allowances && (
              <CollapsibleSection title="Allowances" icon={Package}>
                {primaryRole.allowances.computerAllowance && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">💻 Computer Allowance</h4>
                    <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.computerAllowanceFeePerWeek)} />
                  </div>
                )}
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Signatures" icon={CheckCircle}>
              {offer.crewSignedAt && (
                <DataRow 
                  label="Crew Member" 
                  value={
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Signed on {formatDate(offer.crewSignedAt)}</span>
                    </div>
                  } 
                />
              )}
              {offer.upmSignedAt && (
                <DataRow 
                  label="UPM" 
                  value={
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Signed on {formatDate(offer.upmSignedAt)}</span>
                    </div>
                  } 
                />
              )}
              {offer.fcSignedAt && (
                <DataRow 
                  label="Financial Controller" 
                  value={
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Signed on {formatDate(offer.fcSignedAt)}</span>
                    </div>
                  } 
                />
              )}
              {offer.studioSignedAt && (
                <DataRow 
                  label="Studio Executive" 
                  value={
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Signed on {formatDate(offer.studioSignedAt)}</span>
                    </div>
                  } 
                />
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Project info" icon={Building2}>
              <DataRow label="Project codename" value={offer.productionName} />
              {offer.productionType && <DataRow label="Type" value={offer.productionType} />}
              {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} />}
              {offer.shootDuration && <DataRow label="Shoot duration" value={`${offer.shootDuration} days`} />}
              {offer.studioCompany && <DataRow label="Studio/Production company" value={offer.studioCompany} />}
              {offer.companyName && <DataRow label="Company name" value={offer.companyName} />}
              {offer.productionAddress && <DataRow label="Production base address" value={offer.productionAddress} />}
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}