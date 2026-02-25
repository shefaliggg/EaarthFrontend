import { Card, CardContent } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { Label } from "../../../../shared/components/ui/label";
import { User, Building2, Briefcase, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const CONTRACT_OPTIONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HOD", label: "HOD" },
  { value: "NO_CONTRACT", label: "NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)" },
  { value: "SENIOR_AGREEMENT", label: "SENIOR AGREEMENT" },
];

const STATUS_REASONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HMRC_LIST", label: "JOB TITLE APPEARS ON HMRC LIST" },
  { value: "CEST_ASSESSMENT", label: "CEST ASSESSMENT CONFIRMED" },
  { value: "LORIMER_LETTER", label: "VALID LORIMER LETTER SUPPLIED" },
  { value: "OTHER", label: "OTHER" },
];

const ENGAGEMENT_TYPES = [
  { value: "", label: "SELECT..." },
  { value: "LOAN_OUT", label: "LOAN OUT" },
  { value: "PAYE", label: "PAYE" },
  { value: "SCHD", label: "SCHD" },
  { value: "LONG_FORM", label: "LONG FORM" },
];

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

function InfoItem({ label, value, isEditing, onChange, type = "text", className = "" }) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <label className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground block">
        {label}
      </label>
      {isEditing ? (
        <Input
          type={type}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-7 text-xs"
        />
      ) : (
        <p className="text-xs font-normal text-foreground">
          {value || "—"}
        </p>
      )}
    </div>
  );
}

function SelectItem({ label, value, isEditing, onChange, options }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground block">
        {label}
      </label>
      {isEditing ? (
        <select 
          value={value || ""} 
          onChange={(e) => onChange?.(e.target.value)} 
          className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        >
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <p className="text-xs font-normal text-foreground">
          {options.find(o => o.value === value)?.label || value || "—"}
        </p>
      )}
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border shadow-sm">
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/30 transition-colors border-b"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-bold">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
      {isOpen && (
        <CardContent className="p-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

export default function OfferDetailsCards({ offer, primaryRole, isEditing = false, onUpdate }) {
  const handleUpdate = (field, value) => {
    if (onUpdate) {
      onUpdate({ [field]: value });
    }
  };

  const handleRoleUpdate = (field, value) => {
    if (onUpdate) {
      onUpdate({ 
        roles: [{ ...primaryRole, [field]: value }] 
      });
    }
  };

 return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 max-w-[1400px] mx-auto">
      {/* Left Column - Smaller Cards */}
      <div className="space-y-4">
        {/* Recipient Card */}
        <CollapsibleSection title="Recipient" icon={User}>
          <div className="space-y-3">
            <InfoItem 
              label="Full Name" 
              value={offer.fullName} 
              isEditing={isEditing}
              onChange={(v) => handleUpdate('fullName', v)}
            />
            <InfoItem 
              label="Email" 
              value={offer.email}
              type="email"
              isEditing={isEditing}
              onChange={(v) => handleUpdate('email', v)}
            />
            <InfoItem 
              label="Phone" 
              value={offer.mobileNumber}
              type="tel"
              isEditing={isEditing}
              onChange={(v) => handleUpdate('mobileNumber', v)}
            />
            
            {/* Via Agent Checkbox */}
            {isEditing && (
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="isViaAgent"
                  checked={offer.isViaAgent || false}
                  onCheckedChange={(checked) => handleUpdate('isViaAgent', checked)}
                  className="w-3.5 h-3.5"
                />
                <Label htmlFor="isViaAgent" className="text-[10px] font-medium cursor-pointer">
                  Via Agent?
                </Label>
              </div>
            )}

            {/* Agent Details */}
            {(offer.isViaAgent || (isEditing && offer.isViaAgent)) && (
              <div className="space-y-2.5 pt-1 border-t">
                <InfoItem 
                  label="Agent Name" 
                  value={offer.agentName}
                  isEditing={isEditing}
                  onChange={(v) => handleUpdate('agentName', v)}
                />
                <InfoItem 
                  label="Agent Email" 
                  value={offer.agentEmailAddress}
                  type="email"
                  isEditing={isEditing}
                  onChange={(v) => handleUpdate('agentEmailAddress', v)}
                />
              </div>
            )}

            {/* Alternative Contract Type */}
            <SelectItem 
              label="Alternative Contract Type" 
              value={offer.alternativeContractType}
              isEditing={isEditing}
              onChange={(v) => handleUpdate('alternativeContractType', v)}
              options={CONTRACT_OPTIONS}
            />
          </div>
        </CollapsibleSection>

        {/* Tax Status Card */}
        <CollapsibleSection title="Tax Status" icon={Briefcase}>
          <div className="space-y-3">
            <div className="space-y-0.5">
              <label className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground block">
                Allow as Self-Employed/Loan Out?
              </label>
              {isEditing ? (
                <div className="flex gap-3 pt-0.5">
                  {["YES", "NO"].map(opt => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="selfEmployed" 
                        value={opt} 
                        checked={offer.allowAsSelfEmployedOrLoanOut === opt} 
                        onChange={(e) => handleUpdate('allowAsSelfEmployedOrLoanOut', e.target.value)} 
                        className="w-3.5 h-3.5 text-primary" 
                      />
                      <span className="text-xs font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-normal text-foreground">
                  {offer.allowAsSelfEmployedOrLoanOut || "—"}
                </p>
              )}
            </div>
            
            {offer.allowAsSelfEmployedOrLoanOut === "YES" && (
              <>
                <SelectItem 
                  label="Status Determination Reason" 
                  value={offer.statusDeterminationReason}
                  isEditing={isEditing}
                  onChange={(v) => handleUpdate('statusDeterminationReason', v)}
                  options={STATUS_REASONS}
                />
                
                {offer.statusDeterminationReason === "OTHER" && (
                  <InfoItem 
                    label="Specify Other Reason" 
                    value={offer.otherStatusDeterminationReason}
                    isEditing={isEditing}
                    onChange={(v) => handleUpdate('otherStatusDeterminationReason', v)}
                  />
                )}
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* Project Info Card */}
        <CollapsibleSection title="Project Info" icon={Building2}>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem 
              label="Production Name" 
              value={offer.productionName}
              isEditing={isEditing}
              onChange={(v) => handleUpdate('productionName', v)}
            />
            <InfoItem 
              label="Type" 
              value={offer.productionType}
              isEditing={isEditing}
              onChange={(v) => handleUpdate('productionType', v)}
            />
            <InfoItem 
              label="Studio/Company" 
              value={offer.studioCompany}
              isEditing={isEditing}
              onChange={(v) => handleUpdate('studioCompany', v)}
            />
            <InfoItem 
              label="Duration" 
              value={offer.shootDuration ? `${offer.shootDuration} days` : "—"}
              isEditing={isEditing}
              onChange={(v) => handleUpdate('shootDuration', v.replace(/[^\d]/g, ''))}
            />
          </div>
        </CollapsibleSection>
      </div>

      {/* Right Column - Larger Cards */}
      <div className="space-y-4">
        {/* Offer Details Card */}
        <CollapsibleSection title="Offer Details" icon={Briefcase}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem 
                label="Unit" 
                value={primaryRole?.unit}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('unit', v)}
              />
              <InfoItem 
                label="Department" 
                value={primaryRole?.department}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('department', v)}
              />
            </div>

            <InfoItem 
              label="Sub-Department" 
              value={primaryRole?.subDepartment}
              isEditing={isEditing}
              onChange={(v) => handleRoleUpdate('subDepartment', v)}
            />

            <InfoItem 
              label="Job Title" 
              value={primaryRole?.jobTitle}
              isEditing={isEditing}
              onChange={(v) => handleRoleUpdate('jobTitle', v)}
            />

            <InfoItem 
              label="Job Title Suffix" 
              value={primaryRole?.jobTitleSuffix}
              isEditing={isEditing}
              onChange={(v) => handleRoleUpdate('jobTitleSuffix', v)}
            />

            <InfoItem 
              label="Regular Site of Work" 
              value={primaryRole?.regularSiteOfWork}
              isEditing={isEditing}
              onChange={(v) => handleRoleUpdate('regularSiteOfWork', v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectItem 
                label="Engagement Type" 
                value={primaryRole?.engagementType || offer.confirmedEmploymentType}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('engagementType', v)}
                options={ENGAGEMENT_TYPES}
              />
              
              <InfoItem 
                label="Production Phase" 
                value={primaryRole?.productionPhase}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('productionPhase', v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoItem 
                label="Start Date" 
                value={isEditing ? primaryRole?.startDate : formatDate(primaryRole?.startDate)}
                type="date"
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('startDate', v)}
              />
              <InfoItem 
                label="End Date" 
                value={isEditing ? primaryRole?.endDate : formatDate(primaryRole?.endDate)}
                type="date"
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('endDate', v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoItem 
                label="Daily/Weekly" 
                value={primaryRole?.dailyOrWeeklyEngagement}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('dailyOrWeeklyEngagement', v)}
              />
              <InfoItem 
                label="Working Week" 
                value={primaryRole?.workingWeek}
                isEditing={isEditing}
                onChange={(v) => handleRoleUpdate('workingWeek', v)}
              />
            </div>

            <InfoItem 
              label="Shift Hours" 
              value={primaryRole?.shiftHours ? `${primaryRole.shiftHours}h` : "—"}
              isEditing={isEditing}
              onChange={(v) => handleRoleUpdate('shiftHours', v)}
            />
          </div>
        </CollapsibleSection>

        {/* Notes Card */}
        <CollapsibleSection title="Notes" icon={FileText}>
          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground block mb-0.5">
                Deal Provisions
              </label>
              {isEditing ? (
                <textarea
                  value={offer.otherDealProvisions || ""}
                  onChange={(e) => handleUpdate('otherDealProvisions', e.target.value)}
                  className="w-full rounded-md border px-2 py-1.5 text-xs min-h-[60px] resize-none"
                  placeholder="Enter deal provisions..."
                />
              ) : (
                <p className="text-xs text-foreground">
                  {offer.otherDealProvisions || "—"}
                </p>
              )}
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground block mb-0.5">
                Additional Notes
              </label>
              {isEditing ? (
                <textarea
                  value={offer.additionalNotes || ""}
                  onChange={(e) => handleUpdate('additionalNotes', e.target.value)}
                  className="w-full rounded-md border px-2 py-1.5 text-xs min-h-[60px] resize-none"
                  placeholder="Enter additional notes..."
                />
              ) : (
                <p className="text-xs text-foreground">
                  {offer.additionalNotes || "—"}
                </p>
              )}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}