// src/crew/components/ViewOfferSections.jsx

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../shared/components/ui/collapsible";
import { Separator } from "../../../shared/components/ui/separator";
import { Badge } from "../../../shared/components/ui/badge";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

// Format helpers
const formatCurrency = (amount, currency = "GBP") => {
  if (!amount && amount !== 0) return "—";
  const symbols = { GBP: "£", USD: "$", EUR: "€" };
  return `${symbols[currency] || "£"}${parseFloat(amount).toLocaleString("en-GB", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
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

// Reusable components
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

// Status Section - Shows timeline of workflow stages
export function StatusSection({ offer, Icon }) {
  const renderStatusTimeline = () => {
    const statuses = [
      { key: "sentToCrewAt", label: "Sent to crew", date: offer.sentToCrewAt },
      { key: "crewAcceptedAt", label: "Crew accepted", date: offer.crewAcceptedAt },
      { key: "productionCheckCompletedAt", label: "Production check completed", date: offer.productionCheckCompletedAt },
      { key: "accountsCheckCompletedAt", label: "Accounts check completed", date: offer.accountsCheckCompletedAt },
      { key: "crewSignedAt", label: "Crew signed", date: offer.crewSignedAt },
      { key: "upmSignedAt", label: "UPM signed", date: offer.upmSignedAt },
      { key: "fcSignedAt", label: "FC signed", date: offer.fcSignedAt },
      { key: "studioSignedAt", label: "Studio signed", date: offer.studioSignedAt },
    ];
    
    const completedStatuses = statuses.filter(s => s.date);
    if (completedStatuses.length === 0) return null;

    return (
      <>
        {completedStatuses.map((status) => (
          <DataRow key={status.key} label={status.label} value={formatDate(status.date)} />
        ))}
      </>
    );
  };

  return (
    <CollapsibleSection title="Status" icon={Icon}>
      <DataRow 
        label="Status" 
        value={
          <Badge className="bg-emerald-100 text-emerald-700">
            {offer.status?.replace(/_/g, " ")}
          </Badge>
        } 
      />
      {renderStatusTimeline()}
    </CollapsibleSection>
  );
}

// Recipient Section - Basic contact info (shown in all states)
export function RecipientSection({ offer, Icon }) {
  return (
    <CollapsibleSection title="Recipient" icon={Icon}>
      <DataRow label="Full name" value={offer.fullName} />
      <DataRow label="Email" value={offer.email} />
      <DataRow label="Phone number" value={offer.mobileNumber} />
      {offer.isViaAgent && (
        <>
          <DataRow label="Via agent" value="Yes" />
          <DataRow label="Agent name" value={offer.agentName} />
          <DataRow label="Agent email" value={offer.agentEmail} />
        </>
      )}
    </CollapsibleSection>
  );
}

// Basic Offer Details - Shown in PENDING status (DRAFT, SENT_TO_CREW, NEEDS_REVISION)
export function BasicOfferDetailsSection({ offer, primaryRole, Icon }) {
  return (
    <CollapsibleSection title="Offer details" icon={Icon}>
      <DataRow label="Job title" value={primaryRole.jobTitle} />
      <DataRow 
        label="Department" 
        value={
          primaryRole.department 
            ? `${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`
            : "—"
        } 
      />
      <DataRow label="Start date" value={formatDate(primaryRole.startDate)} />
      <DataRow label="End date" value={formatDate(primaryRole.endDate)} />
      <DataRow 
        label="Rate" 
        value={`${formatCurrency(primaryRole.rateAmount || primaryRole.contractRate, primaryRole.currency)}/${primaryRole.rateType?.toLowerCase().replace('_', ' ') || "week"}`}
        highlight 
      />
      {offer.additionalNotes && (
        <>
          <Separator className="my-2" />
          <div className="py-2">
            <span className="text-xs text-muted-foreground block mb-1">Notes</span>
            <p className="text-sm">{offer.additionalNotes}</p>
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}

// Detailed Offer Details - Shown in IN_PROGRESS status
export function DetailedOfferDetailsSection({ offer, primaryRole, Icon }) {
  return (
    <CollapsibleSection title="Offer details" icon={Icon}>
      <DataRow label="Unit" value={primaryRole.unit} />
      <DataRow 
        label="Department" 
        value={
          primaryRole.department 
            ? `${primaryRole.department}${primaryRole.subDepartment ? ` - ${primaryRole.subDepartment}` : ''}`
            : "—"
        } 
      />
      <DataRow label="Job title" value={primaryRole.jobTitle} />
      <DataRow label="Workplace" value={primaryRole.regularSiteOfWork?.replace(/_/g, " ")} />
      <DataRow 
        label="Start & End date" 
        value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} 
      />
      {primaryRole.rateDescription && (
        <>
          <Separator className="my-2" />
          <div className="py-2">
            <span className="text-xs text-muted-foreground block mb-1">Notes</span>
            <p className="text-sm">{primaryRole.rateDescription}</p>
          </div>
        </>
      )}
      {offer.additionalNotes && (
        <>
          <Separator className="my-2" />
          <div className="py-2">
            <span className="text-xs text-muted-foreground block mb-1">Additional notes</span>
            <p className="text-sm">{offer.additionalNotes}</p>
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}

// Contract Section - Shown in IN_PROGRESS and COMPLETED
export function ContractSection({ primaryRole, Icon }) {
  return (
    <CollapsibleSection title="Contract" icon={Icon}>
      <DataRow 
        label="Engagement" 
        value={primaryRole.confirmedEmploymentType?.replace(/_/g, " ") || primaryRole.engagementType?.replace(/_/g, " ")}
        highlight 
      />
      <DataRow label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement?.replace(/_/g, " ")} />
      <DataRow label="Working week" value={primaryRole.workingWeek?.replace(/_/g, " ")} />
      <DataRow 
        label="Standard working hours" 
        value={primaryRole.shiftHours ? `${primaryRole.shiftHours} hours` : "—"} 
      />
    </CollapsibleSection>
  );
}

// Fees Section - Detailed breakdown
export function FeesSection({ primaryRole, Icon }) {
  return (
    <CollapsibleSection title="Fees" icon={Icon}>
      <DataRow label="Currency" value={primaryRole.currency === "GBP" ? "GBP £" : primaryRole.currency} />
      
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
              <td className="py-2 text-muted-foreground">
                {primaryRole.rateType?.replace(/_/g, " ") || "Rate"}
              </td>
              <td className="py-2 text-center font-semibold">
                {formatCurrency(primaryRole.rateAmount || primaryRole.contractRate, primaryRole.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {primaryRole.overtimeType === "CUSTOM" && primaryRole.customOvertimeRates && (
        <>
          <Separator className="my-3" />
          <div className="space-y-0">
            <h4 className="font-semibold text-sm mb-2">Overtime Rates</h4>
            <DataRow label="Min hrs (6th day)" value={primaryRole.customOvertimeRates.minimumHours6thDay} />
            <DataRow label="6th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.sixthDayHourlyRate, primaryRole.currency)} />
            <DataRow label="Min hrs (7th day)" value={primaryRole.customOvertimeRates.minimumHours7thDay} />
            <DataRow label="7th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.seventhDayHourlyRate, primaryRole.currency)} />
            <DataRow label="Non-Shoot OT" value={formatCurrency(primaryRole.customOvertimeRates.nonShootOvertimeRate, primaryRole.currency)} />
            <DataRow label="Shoot OT" value={formatCurrency(primaryRole.customOvertimeRates.shootOvertimeRate, primaryRole.currency)} />
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}

// Allowances Section
export function AllowancesSection({ primaryRole, Icon }) {
  const hasAllowances = primaryRole.allowances && Object.keys(primaryRole.allowances).some(
    k => primaryRole.allowances[k] === true
  );

  if (!hasAllowances) return null;

  return (
    <CollapsibleSection title="Allowances" icon={Icon}>
      {primaryRole.allowances.computerAllowance && (
        <div className="mb-4 pb-4 border-b last:border-0">
          <h4 className="font-semibold text-sm mb-2">💻 Computer Allowance</h4>
          <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.computerAllowanceFeePerWeek, primaryRole.currency)} />
          {primaryRole.allowances.computerAllowanceCap && 
            <DataRow label="Cap" value={formatCurrency(primaryRole.allowances.computerAllowanceCap, primaryRole.currency)} />
          }
          {primaryRole.allowances.computerAllowanceTerms && 
            <DataRow label="Terms" value={primaryRole.allowances.computerAllowanceTerms} />
          }
        </div>
      )}
      
      {primaryRole.allowances.boxRental && (
        <div className="mb-4 pb-4 border-b last:border-0">
          <h4 className="font-semibold text-sm mb-2">📦 Box Rental</h4>
          <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.boxRentalFeePerWeek, primaryRole.currency)} />
          {primaryRole.allowances.boxRentalCap && 
            <DataRow label="Cap" value={formatCurrency(primaryRole.allowances.boxRentalCap, primaryRole.currency)} />
          }
          {primaryRole.allowances.boxRentalTerms && 
            <DataRow label="Terms" value={primaryRole.allowances.boxRentalTerms} />
          }
        </div>
      )}
      
      {primaryRole.allowances.mobilePhoneAllowance && (
        <div className="mb-4 pb-4 border-b last:border-0">
          <h4 className="font-semibold text-sm mb-2">📱 Mobile Phone Allowance</h4>
          <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.mobilePhoneAllowanceFeePerWeek, primaryRole.currency)} />
          {primaryRole.allowances.mobilePhoneAllowanceTerms && 
            <DataRow label="Terms" value={primaryRole.allowances.mobilePhoneAllowanceTerms} />
          }
        </div>
      )}

      {primaryRole.allowances.vehicleAllowance && (
        <div className="mb-4 pb-4 border-b last:border-0">
          <h4 className="font-semibold text-sm mb-2">🚗 Vehicle Allowance</h4>
          <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.vehicleAllowanceFeePerWeek, primaryRole.currency)} />
          {primaryRole.allowances.vehicleAllowanceTerms && 
            <DataRow label="Terms" value={primaryRole.allowances.vehicleAllowanceTerms} />
          }
        </div>
      )}
    </CollapsibleSection>
  );
}

// Basic Project Info - Shown in PENDING
export function BasicProjectInfoSection({ offer, Icon }) {
  return (
    <CollapsibleSection title="Project info" icon={Icon}>
      <DataRow label="Production" value={offer.productionName} />
      {offer.productionType && <DataRow label="Type" value={offer.productionType} />}
      {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} />}
    </CollapsibleSection>
  );
}

// Detailed Project Info - Shown in IN_PROGRESS and COMPLETED
export function DetailedProjectInfoSection({ offer, Icon }) {
  return (
    <CollapsibleSection title="Project info" icon={Icon}>
      <DataRow label="Project codename" value={offer.productionName} />
      {offer.productionType && <DataRow label="Type" value={offer.productionType} />}
      {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} />}
      {offer.shootDuration && <DataRow label="Shoot duration" value={`${offer.shootDuration} days`} />}
      {offer.studioCompany && <DataRow label="Studio/Production company" value={offer.studioCompany} />}
      {offer.holidayPayPercentage && <DataRow label="Holiday pay %" value={`${offer.holidayPayPercentage}%`} />}
      
      {(offer.companyName || offer.productionAddress || offer.projectPhone || offer.projectEmail) && (
        <>
          <Separator className="my-2" />
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 mt-3">Project contacts</h4>
          {offer.companyName && <DataRow label="Company name" value={offer.companyName} />}
          {offer.productionAddress && <DataRow label="Production base address" value={offer.productionAddress} />}
          {offer.projectPhone && <DataRow label="Project phone number" value={offer.projectPhone} />}
          {offer.projectEmail && <DataRow label="Project email address" value={offer.projectEmail} />}
        </>
      )}
    </CollapsibleSection>
  );
}

// Signatures Section - Only shown in COMPLETED
export function SignaturesSection({ offer, Icon }) {
  return (
    <CollapsibleSection title="Signatures" icon={Icon}>
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
      {offer.documentPath && (
        <>
          <Separator className="my-3" />
          <div className="py-2">
            <span className="text-xs text-muted-foreground block mb-1">Contract Document</span>
            <p className="text-sm text-primary">{offer.documentPath}</p>
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}