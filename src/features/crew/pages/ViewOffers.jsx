import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Separator } from "../../../shared/components/ui/separator";
import { 
  ArrowLeft, User, Briefcase, DollarSign, Building2, 
  Package, FileText, CheckCircle, Edit2, Send, 
  PenTool, Download, Mail, Phone, MapPin, Calendar
} from "lucide-react";
import { MOCK_OFFERS_LIST, getMockOfferById } from '../mocks/mockOffers';

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

const formatCurrency = (amount) => {
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

function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex flex-col">
      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
        <p className={`text-sm font-medium leading-tight ${highlight ? "text-primary font-semibold" : ""}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function CompactCard({ title, icon: Icon, children, className = "" }) {
  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className="pb-1 px-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-6">
        {children}
      </CardContent>
    </Card>
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
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground">Offer not found</p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[offer.status] || { label: offer.status, color: "bg-muted" };
  const primaryRole = offer.roles?.[0] || {};

  const isPending = ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION"].includes(offer.status);
  const isInProgress = [
    "CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK", 
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE", 
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"
  ].includes(offer.status);
  const isCompleted = offer.status === "COMPLETED";

  const handleNavigateToSign = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/sign`);
  };

  const handleNavigateToViewContract = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/contract`);
  };

  const getActionButton = () => {
    // CREW - Review offer (SENT_TO_CREW status)
    if (viewAsRole === "CREW" && offer.status === "SENT_TO_CREW") {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('Edit button clicked, navigating to:', `/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/edit`);
              navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/edit`);
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Offer
          </Button>
          <Button 
            onClick={() => {
              console.log('Review button clicked, navigating to:', `/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/review`);
              navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/review`);
            }}
          >
            <FileText className="w-4 h-4 mr-2" /> Review Offer
          </Button>
        </div>
      );
    }

    // CREW - Review revised offer (NEEDS_REVISION status)
    if (viewAsRole === "CREW" && offer.status === "NEEDS_REVISION") {
      return (
        <Button 
          onClick={() => {
            console.log('Review Revised button clicked, navigating to:', `/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/review`);
            navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/review`);
          }}
        >
          <FileText className="w-4 h-4 mr-2" /> Review Revised Offer
        </Button>
      );
    }

    // CREW - Sign contract
    if (viewAsRole === "CREW" && offer.status === "PENDING_CREW_SIGNATURE") {
      return (
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNavigateToSign}>
          <PenTool className="w-4 h-4 mr-2" /> Sign Contract
        </Button>
      );
    }

    // UPM - Sign as UPM
    if (viewAsRole === "UPM" && offer.status === "PENDING_UPM_SIGNATURE") {
      return (
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleNavigateToSign}>
          <PenTool className="w-4 h-4 mr-2" /> Sign as UPM
        </Button>
      );
    }

    // FC - Sign as FC
    if (viewAsRole === "FC" && offer.status === "PENDING_FC_SIGNATURE") {
      return (
        <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleNavigateToSign}>
          <PenTool className="w-4 h-4 mr-2" /> Sign as FC
        </Button>
      );
    }

    // STUDIO - Sign as Studio
    if (viewAsRole === "STUDIO" && offer.status === "PENDING_STUDIO_SIGNATURE") {
      return (
        <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleNavigateToSign}>
          <PenTool className="w-4 h-4 mr-2" /> Sign as Studio
        </Button>
      );
    }

    // PRODUCTION_ADMIN - Edit and send offer
    if (viewAsRole === "PRODUCTION_ADMIN" && (offer.status === "DRAFT" || offer.status === "NEEDS_REVISION")) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${projectName || "demo-project"}/offers/${selectedOfferId}/edit`)}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Offer
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" /> Send to Crew
          </Button>
        </div>
      );
    }

    // PRODUCTION_ADMIN - Production check
    if (viewAsRole === "PRODUCTION_ADMIN" && offer.status === "PRODUCTION_CHECK") {
      return (
        <Button onClick={() => navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/production-check`)}>
          <CheckCircle className="w-4 h-4 mr-2" /> Production Check
        </Button>
      );
    }

    // PRODUCTION_ADMIN or ACCOUNTS - Accounts check
    if ((viewAsRole === "PRODUCTION_ADMIN" || viewAsRole === "ACCOUNTS") && offer.status === "ACCOUNTS_CHECK") {
      return (
        <Button onClick={() => navigate(`/projects/${projectName || 'demo-project'}/offers/${selectedOfferId}/accounts-check`)}>
          <CheckCircle className="w-4 h-4 mr-2" /> Accounts Check
        </Button>
      );
    }

    // Anyone - View completed contract
    if (offer.status === "COMPLETED") {
      return (
        <Button variant="outline" onClick={handleNavigateToViewContract}>
          <Download className="w-4 h-4 mr-2" /> View Signed Contract
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="px-2">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Demo Controls */}
        <Card className="p-0">
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
                  <option value="ACCOUNTS">ACCOUNTS</option>
                  <option value="UPM">UPM</option>
                  <option value="FC">FC</option>
                  <option value="STUDIO">STUDIO</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb & Header */}
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

        <div className="flex items-start justify-between flex-wrap gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold mt-2">Offer for {offer.fullName}</h1>
          </div>
          {getActionButton()}
        </div>

        {/* PENDING STATE - Simplified view */}
        {isPending && (
          <>
            <CompactCard title="Status" icon={CheckCircle}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                <InfoItem label="Current Status" value={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>} />
                {offer.sentToCrewAt && <InfoItem icon={Calendar} label="Sent to crew" value={formatDate(offer.sentToCrewAt)} />}
                {offer.updatedAt && <InfoItem icon={Calendar} label="Last updated" value={formatDate(offer.updatedAt)} />}
              </div>
            </CompactCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <CompactCard title="Recipient" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={User} label="Full name" value={offer.fullName} />
                  <InfoItem icon={Mail} label="Email" value={offer.email} />
                  <InfoItem icon={Phone} label="Phone number" value={offer.mobileNumber} />
                </div>
              </CompactCard>

              <CompactCard title="Offer details" icon={Briefcase}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={Briefcase} label="Job title" value={primaryRole.jobTitle} />
                  <InfoItem label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
                  <InfoItem icon={Calendar} label="Start date" value={formatDate(primaryRole.startDate)} />
                  <InfoItem icon={Calendar} label="End date" value={formatDate(primaryRole.endDate)} />
                  <div className="md:col-span-2">
                    <Separator className="mb-2" />
                    <InfoItem icon={DollarSign} label="Weekly Rate" value={`${formatCurrency(primaryRole.contractRate)}/week`} highlight />
                  </div>
                </div>
              </CompactCard>
            </div>

            <CompactCard title="Project info" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <InfoItem icon={Building2} label="Production" value={offer.productionName} />
                {offer.productionType && <InfoItem label="Type" value={offer.productionType} />}
                {offer.estimatedShootDates && <InfoItem icon={Calendar} label="Estimated shoot dates" value={offer.estimatedShootDates} />}
              </div>
            </CompactCard>
          </>
        )}

        {/* IN PROGRESS STATE */}
        {isInProgress && (
          <>
            <CompactCard title="Status" icon={CheckCircle}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
                <InfoItem label="Status" value={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>} />
                {offer.sentToCrewAt && <InfoItem icon={Calendar} label="Sent to crew" value={formatDate(offer.sentToCrewAt)} />}
                {offer.crewAcceptedAt && <InfoItem icon={CheckCircle} label="Crew accepted" value={formatDate(offer.crewAcceptedAt)} />}
                {offer.productionCheckCompletedAt && <InfoItem icon={CheckCircle} label="Production check" value={formatDate(offer.productionCheckCompletedAt)} />}
                {offer.accountsCheckCompletedAt && <InfoItem icon={CheckCircle} label="Accounts check" value={formatDate(offer.accountsCheckCompletedAt)} />}
              </div>
            </CompactCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <CompactCard title="Recipient" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={User} label="Full name" value={offer.fullName} />
                  <InfoItem icon={Mail} label="Email" value={offer.email} />
                  <InfoItem icon={Phone} label="Phone number" value={offer.mobileNumber} />
                </div>
              </CompactCard>

              <CompactCard title="Offer details" icon={Briefcase}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Unit" value={primaryRole.unit} />
                  <InfoItem label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
                  <InfoItem icon={Briefcase} label="Job title" value={primaryRole.jobTitle} />
                  <InfoItem icon={MapPin} label="Workplace" value={primaryRole.regularSiteOfWork} />
                  <div className="md:col-span-2">
                    <InfoItem icon={Calendar} label="Period" value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} />
                  </div>
                </div>
              </CompactCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <CompactCard title="Contract" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Engagement" value={offer.confirmedEmploymentType?.replace(/_/g, " ")} highlight />
                  <InfoItem label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement} />
                  <InfoItem label="Working week" value={primaryRole.workingWeek} />
                  <InfoItem label="Standard hours" value={primaryRole.shiftHours ? `${primaryRole.shiftHours} hours` : "—"} />
                </div>
              </CompactCard>

              <CompactCard title="Fees" icon={DollarSign}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Currency" value="GBP £" />
                  <InfoItem icon={DollarSign} label="Weekly rate" value={formatCurrency(primaryRole.contractRate)} highlight />
                  {primaryRole.customOvertimeRates && (
                    <>
                      <div className="md:col-span-2">
                        <Separator className="my-1.5" />
                        <p className="text-xs font-semibold mb-2">Overtime Rates</p>
                      </div>
                      <InfoItem label="6th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.sixthDayHourlyRate)} />
                      <InfoItem label="7th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.seventhDayHourlyRate)} />
                    </>
                  )}
                </div>
              </CompactCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              {primaryRole.allowances && (
                <CompactCard title="Allowances" icon={Package}>
                  {primaryRole.allowances.boxRental && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-semibold mb-2">📦 Box Rental</p>
                      </div>
                      <InfoItem label="Fee per week" value={formatCurrency(primaryRole.allowances.boxRentalFeePerWeek)} />
                    </div>
                  )}
                </CompactCard>
              )}

              <CompactCard title="Project info" icon={Building2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={Building2} label="Project codename" value={offer.productionName} />
                  {offer.productionType && <InfoItem label="Type" value={offer.productionType} />}
                  {offer.estimatedShootDates && <InfoItem icon={Calendar} label="Estimated shoot dates" value={offer.estimatedShootDates} />}
                  {offer.shootDuration && <InfoItem label="Shoot duration" value={`${offer.shootDuration} days`} />}
                  {offer.studioCompany && <InfoItem label="Studio/Production" value={offer.studioCompany} />}
                </div>
              </CompactCard>
            </div>
          </>
        )}

        {/* COMPLETED STATE */}
        {isCompleted && (
          <>
            <CompactCard title="Signatures" icon={CheckCircle}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
                {offer.crewSignedAt && (
                  <div className="flex flex-col">
                    <p className="text-[11px] text-muted-foreground mb-0.5">Crew Member</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium leading-tight">Signed {formatDate(offer.crewSignedAt)}</p>
                    </div>
                  </div>
                )}
                {offer.upmSignedAt && (
                  <div className="flex flex-col">
                    <p className="text-[11px] text-muted-foreground mb-0.5">UPM</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium leading-tight">Signed {formatDate(offer.upmSignedAt)}</p>
                    </div>
                  </div>
                )}
                {offer.fcSignedAt && (
                  <div className="flex flex-col">
                    <p className="text-[11px] text-muted-foreground mb-0.5">Financial Controller</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium leading-tight">Signed {formatDate(offer.fcSignedAt)}</p>
                    </div>
                  </div>
                )}
                {offer.studioSignedAt && (
                  <div className="flex flex-col">
                    <p className="text-[11px] text-muted-foreground mb-0.5">Studio Executive</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium leading-tight">Signed {formatDate(offer.studioSignedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CompactCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <CompactCard title="Recipient" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={User} label="Full name" value={offer.fullName} />
                  <InfoItem icon={Mail} label="Email" value={offer.email} />
                  <InfoItem icon={Phone} label="Phone number" value={offer.mobileNumber} />
                </div>
              </CompactCard>

              <CompactCard title="Offer details" icon={Briefcase}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Unit" value={primaryRole.unit} />
                  <InfoItem label="Department" value={`${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`} />
                  <InfoItem icon={Briefcase} label="Job title" value={primaryRole.jobTitle} />
                  <InfoItem icon={MapPin} label="Workplace" value={primaryRole.regularSiteOfWork} />
                  <div className="md:col-span-2">
                    <InfoItem icon={Calendar} label="Period" value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} />
                  </div>
                </div>
              </CompactCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <CompactCard title="Contract" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Engagement" value={offer.confirmedEmploymentType?.replace(/_/g, " ")} highlight />
                  <InfoItem label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement} />
                  <InfoItem label="Working week" value={primaryRole.workingWeek} />
                  <InfoItem label="Standard hours" value={primaryRole.shiftHours ? `${primaryRole.shiftHours} hours` : "—"} />
                </div>
              </CompactCard>

              <CompactCard title="Fees" icon={DollarSign}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem label="Currency" value="GBP £" />
                  <InfoItem icon={DollarSign} label="Weekly rate" value={formatCurrency(primaryRole.contractRate)} highlight />
                </div>
              </CompactCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              {primaryRole.allowances && (
                <CompactCard title="Allowances" icon={Package}>
                  {primaryRole.allowances.computerAllowance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-semibold">💻 Computer Allowance</p>
                      </div>
                      <InfoItem label="Fee per week" value={formatCurrency(primaryRole.allowances.computerAllowanceFeePerWeek)} />
                    </div>
                  )}
                </CompactCard>
              )}

              <CompactCard title="Project info" icon={Building2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={Building2} label="Project codename" value={offer.productionName} />
                  {offer.productionType && <InfoItem label="Type" value={offer.productionType} />}
                  {offer.estimatedShootDates && <div className="md:col-span-2"><InfoItem icon={Calendar} label="Estimated shoot dates" value={offer.estimatedShootDates} /></div>}
                  {offer.shootDuration && <InfoItem label="Shoot duration" value={`${offer.shootDuration} days`} />}
                  {offer.studioCompany && <InfoItem label="Studio/Production" value={offer.studioCompany} />}
                  {offer.companyName && <InfoItem label="Company name" value={offer.companyName} />}
                  {offer.productionAddress && <div><InfoItem icon={MapPin} label="Production base" value={offer.productionAddress} /></div>}
                </div>
              </CompactCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}