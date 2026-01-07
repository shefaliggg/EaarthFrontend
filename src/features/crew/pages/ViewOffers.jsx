import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../shared/components/ui/collapsible";
import { Separator } from "../../../shared/components/ui/separator";
import { Textarea } from "../../../shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../shared/components/ui/dialog";
import { 
  ArrowLeft, Edit2, User, Briefcase, DollarSign,
  Building2, ChevronDown, ChevronUp, Package,
  FileText, CheckCircle, Send,
  ClipboardCheck, Calculator, PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  SENT_TO_CREW: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  NEEDS_REVISION: { label: "Needs Revision", color: "bg-red-100 text-red-700" },
  CREW_ACCEPTED: { label: "Crew Accepted", color: "bg-green-100 text-green-700" },
  PRODUCTION_CHECK: { label: "Production Check", color: "bg-teal-100 text-teal-700" },
  ACCOUNTS_CHECK: { label: "Accounts to approve", color: "bg-purple-100 text-purple-700" },
  PENDING_CREW_SIGNATURE: { label: "Awaiting Crew Signature", color: "bg-orange-100 text-orange-700" },
  PENDING_UPM_SIGNATURE: { label: "Awaiting UPM Signature", color: "bg-indigo-100 text-indigo-700" },
  PENDING_FC_SIGNATURE: { label: "Awaiting FC Signature", color: "bg-pink-100 text-pink-700" },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio Signature", color: "bg-violet-100 text-violet-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

const formatCurrency = (amount, currency = "GBP") => {
  if (!amount && amount !== 0) return "—";
  const symbols = { GBP: "£", USD: "$", EUR: "€" };
  return `${symbols[currency] || "£"}${parseFloat(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()} at ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, testId }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = testId || title.toLowerCase().replace(/\s+/g, '-');
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 py-3" data-testid={`section-${sectionId}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-primary" />}
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
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

function DataRow({ label, value, highlight = false, testId }) {
  const rowId = testId || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="grid grid-cols-3 py-2 border-b border-muted/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm col-span-2", highlight ? "text-primary font-semibold" : "font-medium")} data-testid={`value-${rowId}`}>{value || "—"}</span>
    </div>
  );
}

function formatDepartment(department, subDepartment) {
  if (!department) return "—";
  if (subDepartment) return `${department} - ${subDepartment}`;
  return department;
}

// Mock data - Same as MyOffer page
const MOCK_OFFER = {
  id: 1,
  status: "SENT_TO_CREW",
  fullName: "John Smith",
  email: "john.smith@example.com",
  mobileNumber: "+44 7700 900000",
  productionName: "The Great Adventure",
  updatedAt: "2026-01-05T10:30:00Z",
  sentToCrewAt: "2026-01-03T09:00:00Z",
  isViaAgent: false,
  productionType: "Feature Film",
  estimatedShootDates: "March 2026 - June 2026",
  shootDuration: 90,
  studioCompany: "Big Studio Productions",
  holidayPayPercentage: 12.07,
  companyName: "Big Studio Ltd",
  productionAddress: "123 Studio Way, London, UK",
  projectPhone: "+44 20 1234 5678",
  projectEmail: "production@example.com",
  additionalNotes: "Please review carefully and let us know if you have any questions.",
  roles: [{
    unit: "Main Unit",
    department: "Camera",
    subDepartment: "Main Unit",
    jobTitle: "Director of Photography",
    regularSiteOfWork: "STUDIO_BASE",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    engagementType: "EMPLOYEE",
    dailyOrWeeklyEngagement: "WEEKLY",
    workingWeek: "FIVE_DAY_WEEK",
    shiftHours: "10",
    currency: "GBP",
    rateType: "WEEKLY_RATE",
    rateAmount: 2500,
    rateDescription: "Standard weekly rate for 5-day working week",
    overtimeType: "CUSTOM",
    customOvertimeRates: {
      minimumHours6thDay: "8",
      sixthDayHourlyRate: 350,
      minimumHours7thDay: "8",
      seventhDayHourlyRate: 400,
      nonShootOvertimeRate: 250,
      shootOvertimeRate: 300
    },
    allowances: {
      computerAllowance: true,
      computerAllowanceFeePerWeek: 150,
      computerAllowanceCap: 1500,
      computerAllowanceTerms: "Maximum 10 weeks",
      computerAllowancePayableInShoot: true,
      boxRental: true,
      boxRentalFeePerWeek: 200,
      boxRentalCap: 2000,
      boxRentalTerms: "Equipment list to be provided",
      boxRentalPayableInPrep: true,
      boxRentalPayableInShoot: true,
      mobilePhoneAllowance: true,
      mobilePhoneAllowanceFeePerWeek: 50,
      mobilePhoneAllowanceTerms: "UK calls only",
      mobilePhoneAllowancePayableInShoot: true
    }
  }]
};

export default function ViewOffer() {
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [selectedRole, setSelectedRole] = useState("CREW");

  const offer = MOCK_OFFER;
  const statusConfig = STATUS_CONFIG[offer.status] || { label: offer.status, color: "bg-muted" };
  const primaryRole = offer.roles?.[0] || {};

  const handleBack = () => {
    alert("Navigate back");
  };

  const handleEdit = () => {
    alert("Navigate to edit offer");
  };

  const handleSendOffer = () => {
    alert("Offer sent to crew!");
  };

  const handleSubmitChange = () => {
    if (!changeReason.trim()) return;
    alert(`Change request submitted: ${changeReason}`);
    setChangeRequestOpen(false);
    setChangeReason("");
  };

  return (
    <div className="">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Button variant="ghost" size="sm" onClick={handleBack} data-testid="button-back-nav">
          <ArrowLeft className="w-4 h-4 mr-1" /> Offers
        </Button>
        <span>/</span>
        <span>Offer for {offer.fullName}</span>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <Badge className={cn("mb-2", statusConfig.color)}>{statusConfig.label}</Badge>
          {offer.updatedAt && (
            <p className="text-xs text-muted-foreground">Last updated {formatDateTime(offer.updatedAt)}</p>
          )}
          <h1 className="text-2xl font-bold mt-2" data-testid="text-offer-title">
            Offer for {offer.fullName}
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Role selector for demo */}
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="CREW">Crew View</option>
            <option value="PRODUCTION_ADMIN">Production Admin</option>
            <option value="ACCOUNTS_ADMIN">Accounts Admin</option>
            <option value="UPM">UPM</option>
            <option value="FC">FC</option>
            <option value="STUDIO">Studio</option>
          </select>

          {/* Production Admin actions */}
          {selectedRole === "PRODUCTION_ADMIN" && (
            <>
              {(offer.status === "DRAFT" || offer.status === "NEEDS_REVISION") && (
                <>
                  <Button variant="outline" onClick={handleEdit} data-testid="button-edit-offer">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button onClick={handleSendOffer} data-testid="button-send-offer">
                    <Send className="w-4 h-4 mr-2" /> Send to Crew
                  </Button>
                </>
              )}
              {(offer.status === "CREW_ACCEPTED" || offer.status === "PRODUCTION_CHECK") && (
                <Button data-testid="button-production-check">
                  <ClipboardCheck className="w-4 h-4 mr-2" /> Production Check
                </Button>
              )}
            </>
          )}

          {/* Crew actions */}
          {selectedRole === "CREW" && offer.status === "SENT_TO_CREW" && (
            <Button data-testid="button-crew-review">
              <FileText className="w-4 h-4 mr-2" /> Review Offer
            </Button>
          )}

          {/* Crew sign contract */}
          {selectedRole === "CREW" && offer.status === "PENDING_CREW_SIGNATURE" && (
            <Button data-testid="button-sign-contract">
              <PenTool className="w-4 h-4 mr-2" /> Sign Contract
            </Button>
          )}

          {/* Accounts Admin actions */}
          {selectedRole === "ACCOUNTS_ADMIN" && offer.status === "ACCOUNTS_CHECK" && (
            <Button data-testid="button-accounts-check">
              <Calculator className="w-4 h-4 mr-2" /> Accounts Check
            </Button>
          )}
        </div>
      </div>

      <CollapsibleSection title="Status" icon={CheckCircle} testId="status">
        <DataRow label="Status" value={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>} testId="status-badge" />
        {offer.sentToCrewAt && <DataRow label="Sent to crew" value={formatDate(offer.sentToCrewAt)} testId="sent-date" />}
      </CollapsibleSection>

      <CollapsibleSection title="Recipient" icon={User} testId="recipient">
        <DataRow label="Full name" value={offer.fullName} testId="full-name" />
        <DataRow label="Email" value={offer.email} testId="email" />
        <DataRow label="Phone number" value={offer.mobileNumber} testId="phone" />
        {offer.isViaAgent && (
          <>
            <DataRow label="Via agent" value="Yes" testId="via-agent" />
            <DataRow label="Agent name" value={offer.agentName} testId="agent-name" />
            <DataRow label="Agent email" value={offer.agentEmail} testId="agent-email" />
          </>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Offer details" icon={Briefcase} testId="offer-details">
        <DataRow label="Unit" value={primaryRole.unit} testId="unit" />
        <DataRow label="Department" value={formatDepartment(primaryRole.department, primaryRole.subDepartment)} testId="department" />
        <DataRow label="Job title" value={primaryRole.jobTitle} testId="job-title" />
        <DataRow label="Workplace" value={primaryRole.regularSiteOfWork?.replace(/_/g, " ")} testId="workplace" />
        <DataRow label="Start & End date" value={`${formatDate(primaryRole.startDate)} - ${formatDate(primaryRole.endDate)}`} testId="dates" />
        {primaryRole.rateDescription && (
          <>
            <Separator className="my-2" />
            <div className="py-2">
              <span className="text-xs text-muted-foreground block mb-1">Notes</span>
              <p className="text-sm">{primaryRole.rateDescription}</p>
            </div>
          </>
        )}
        {offer.additionalNotes && <DataRow label="Additional notes" value={offer.additionalNotes} />}
      </CollapsibleSection>

      <CollapsibleSection title="Contract" icon={FileText} testId="contract">
        <DataRow label="Engagement" value={primaryRole.engagementType?.replace(/_/g, " ") || "—"} highlight testId="engagement" />
        <DataRow label="Daily or weekly" value={primaryRole.dailyOrWeeklyEngagement?.replace(/_/g, " ")} testId="daily-weekly" />
        <DataRow label="Working week" value={primaryRole.workingWeek?.replace(/_/g, " ")} testId="working-week" />
        <DataRow label="Standard working hours" value={primaryRole.shiftHours ? `${primaryRole.shiftHours}` : "—"} testId="working-hours" />
      </CollapsibleSection>

      <CollapsibleSection title="Fees" icon={DollarSign} testId="fees">
        <DataRow label="Currency" value={primaryRole.currency === "GBP" ? "GBP £" : (primaryRole.currency || "—")} testId="currency" />
        
        <Separator className="my-3" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-xs text-muted-foreground font-medium"></th>
                <th className="text-center py-2 text-xs text-muted-foreground font-medium">Excluding holiday</th>
                <th className="text-center py-2 text-xs text-muted-foreground font-medium">Holiday</th>
                <th className="text-center py-2 text-xs text-muted-foreground font-medium">Including holiday</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-muted-foreground">{primaryRole.rateType?.replace(/_/g, " ") || "Rate"}</td>
                <td className="py-2 text-center" data-testid="value-rate-exc">{formatCurrency(primaryRole.rateAmount, primaryRole.currency)}</td>
                <td className="py-2 text-center text-muted-foreground" data-testid="value-holiday">—</td>
                <td className="py-2 text-center font-semibold" data-testid="value-rate-inc">{formatCurrency(primaryRole.rateAmount, primaryRole.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {primaryRole.overtimeType === "CUSTOM" && primaryRole.customOvertimeRates && (
          <>
            <Separator className="my-3" />
            <div className="space-y-0">
              <DataRow label="Min hrs (6th day)" value={primaryRole.customOvertimeRates.minimumHours6thDay} />
              <DataRow label="6th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.sixthDayHourlyRate, primaryRole.currency)} />
              <DataRow label="Min hrs (7th day)" value={primaryRole.customOvertimeRates.minimumHours7thDay} />
              <DataRow label="7th day hourly" value={formatCurrency(primaryRole.customOvertimeRates.seventhDayHourlyRate, primaryRole.currency)} />
              <div className="bg-muted/50 py-1">
                <DataRow label="Non-Shoot OT" value={formatCurrency(primaryRole.customOvertimeRates.nonShootOvertimeRate, primaryRole.currency)} />
                <DataRow label="Shoot OT" value={formatCurrency(primaryRole.customOvertimeRates.shootOvertimeRate, primaryRole.currency)} />
              </div>
            </div>
          </>
        )}
      </CollapsibleSection>

      {primaryRole.allowances && (
        <CollapsibleSection title="Allowances" icon={Package}>
          {primaryRole.allowances.computerAllowance && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Computer</h4>
              <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.computerAllowanceFeePerWeek, primaryRole.currency)} />
              {primaryRole.allowances.computerAllowanceCap && <DataRow label="Cap" value={formatCurrency(primaryRole.allowances.computerAllowanceCap, primaryRole.currency)} />}
              {primaryRole.allowances.computerAllowanceTerms && <DataRow label="Terms" value={primaryRole.allowances.computerAllowanceTerms} />}
              <DataRow label="Payable in" value={[
                primaryRole.allowances.computerAllowancePayableInPrep && "Prep",
                primaryRole.allowances.computerAllowancePayableInShoot && "Shoot",
                primaryRole.allowances.computerAllowancePayableInWrap && "Wrap"
              ].filter(Boolean).join(", ") || "Shoot"} />
            </div>
          )}
          
          {primaryRole.allowances.boxRental && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Box Rental</h4>
              <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.boxRentalFeePerWeek, primaryRole.currency)} />
              {primaryRole.allowances.boxRentalCap && <DataRow label="Cap" value={formatCurrency(primaryRole.allowances.boxRentalCap, primaryRole.currency)} />}
              {primaryRole.allowances.boxRentalTerms && <DataRow label="Terms" value={primaryRole.allowances.boxRentalTerms} />}
              <DataRow label="Payable in" value={[
                primaryRole.allowances.boxRentalPayableInPrep && "Prep",
                primaryRole.allowances.boxRentalPayableInShoot && "Shoot",
                primaryRole.allowances.boxRentalPayableInWrap && "Wrap"
              ].filter(Boolean).join(", ") || "Shoot"} />
            </div>
          )}
          
          {primaryRole.allowances.mobilePhoneAllowance && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Mobile Phone</h4>
              <DataRow label="Fee per week" value={formatCurrency(primaryRole.allowances.mobilePhoneAllowanceFeePerWeek, primaryRole.currency)} />
              {primaryRole.allowances.mobilePhoneAllowanceTerms && <DataRow label="Terms" value={primaryRole.allowances.mobilePhoneAllowanceTerms} />}
              <DataRow label="Payable in" value={[
                primaryRole.allowances.mobilePhoneAllowancePayableInPrep && "Prep",
                primaryRole.allowances.mobilePhoneAllowancePayableInShoot && "Shoot",
                primaryRole.allowances.mobilePhoneAllowancePayableInWrap && "Wrap"
              ].filter(Boolean).join(", ") || "Shoot"} />
            </div>
          )}
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Project info" icon={Building2} testId="project-info">
        <DataRow label="Project codename" value={offer.productionName} testId="project-name" />
        {offer.productionType && <DataRow label="Type" value={offer.productionType} testId="project-type" />}
        {offer.estimatedShootDates && <DataRow label="Estimated shoot dates" value={offer.estimatedShootDates} testId="shoot-dates" />}
        {offer.shootDuration && <DataRow label="Shoot duration" value={`${offer.shootDuration} days`} testId="duration" />}
        {offer.studioCompany && <DataRow label="Studio/Production company" value={offer.studioCompany} testId="studio" />}
        {offer.holidayPayPercentage && <DataRow label="Holiday pay %" value={`${offer.holidayPayPercentage}%`} testId="holiday-pay" />}
        
        {(offer.companyName || offer.productionAddress || offer.projectPhone || offer.projectEmail) && (
          <>
            <Separator className="my-2" />
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 mt-3">Project contacts</h4>
            {offer.companyName && <DataRow label="Company name" value={offer.companyName} testId="company-name" />}
            {offer.productionAddress && <DataRow label="Production base address" value={offer.productionAddress} testId="prod-address" />}
            {offer.projectPhone && <DataRow label="Project phone number" value={offer.projectPhone} testId="project-phone" />}
            {offer.projectEmail && <DataRow label="Project email address" value={offer.projectEmail} testId="project-email" />}
          </>
        )}
      </CollapsibleSection>

      {/* Change Request Dialog */}
      <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Please describe the changes you would like to request for this offer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Describe the changes you need..."
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              rows={4}
              data-testid="textarea-change-reason"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setChangeRequestOpen(false)}
              data-testid="button-cancel-change"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitChange}
              disabled={!changeReason.trim()}
              data-testid="button-submit-change"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}