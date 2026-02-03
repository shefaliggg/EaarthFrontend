import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { Checkbox } from "../../../shared/components/ui/checkbox";
import { Badge } from "../../../shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../shared/components/ui/dialog";
import { ScrollArea } from "../../../shared/components/ui/scroll-area";
import {
  Plus,
  ArrowLeft,
  Save,
  Send,
  User,
  Briefcase,
  DollarSign,
  Trash2,
  CheckCircle,
  Bell,
  ChevronDown,
  ChevronUp,
  Package,
  Laptop,
  Code,
  Camera,
  Smartphone,
  Car,
  Coffee,
  Home,
  FileText,
  Eye,
  X
} from "lucide-react";

const DEPARTMENTS = [
  "ACCOUNTS", "ACTION VEHICLES", "AERIAL", "ANIMALS", "ANIMATION", "ARMOURY", "ART",
  "ASSETS", "ASSISTANT DIRECTORS", "CAMERA", "CAST", "CHAPERONES", "CHOREOGRAPHY",
  "CLEARANCES", "COMPUTER GRAPHICS", "CONSTRUCTION", "CONTINUITY", "COSTUME",
  "COSTUME FX", "COVID SAFETY", "CREATURE EFFECTS", "DIT", "DIGITAL ASSETS",
  "DIGITAL PLAYBACK", "DIRECTOR", "DOCUMENTARY", "DRAPES", "EPK", "EDITORIAL",
  "ELECTRICAL", "ELECTRICAL RIGGING", "FRANCHISE", "GREENS", "GREENSCREENS", "GRIP",
  "HAIR AND MAKEUP", "HEALTH AND SAFETY", "IT", "LOCATIONS", "MARINE", "MEDICAL",
  "MILITARY", "MUSIC", "PHOTOGRAPHY", "PICTURE VEHICLES", "POST PRODUCTION",
  "PRODUCTION", "PROP MAKING", "PROPS", "PROSTHETICS", "PUBLICITY", "PUPPETEER",
  "RIGGING", "SFX", "SCRIPT", "SCRIPT EDITING", "SECURITY", "SET DEC", "SOUND",
  "STANDBY", "STORYBOARD", "STUDIO UNIT", "STUNTS", "SUPPORTING ARTIST",
  "SUSTAINABILITY", "TRANSPORT", "TUTORS", "UNDERWATER", "VFX", "VIDEO", "VOICE"
];

const CONTRACT_OPTIONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HOD", label: "HOD" },
  { value: "NO_CONTRACT", label: "NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)" },
  { value: "SENIOR_AGREEMENT", label: "SENIOR AGREEMENT" },
];

const STATUS_REASONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HMRC_LIST", label: "JOB TITLE APPEARS ON HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'" },
  { value: "CEST_ASSESSMENT", label: "OUR CEST ASSESSMENT HAS CONFIRMED 'OFF-PAYROLL WORKING RULES (IR35) DO NOT APPLY'" },
  { value: "LORIMER_LETTER", label: "YOU HAVE SUPPLIED A VALID LORIMER LETTER" },
  { value: "OTHER", label: "OTHER" },
];

const ENGAGEMENT_TYPES = [
  { value: "", label: "SELECT ENGAGEMENT TYPE" },
  { value: "LOAN_OUT", label: "LOAN OUT" },
  { value: "PAYE", label: "PAYE" },
  { value: "SCHD", label: "SCHD (DAILY/WEEKLY)" },
  { value: "LONG_FORM", label: "LONG FORM" },
];

const RATE_TYPES = [
  { value: "DAILY", label: "DAILY" },
  { value: "WEEKLY", label: "WEEKLY" },
];

const CAP_TYPES = [
  { value: "", label: "SELECT CAP TYPE" },
  { value: "FLAT", label: "FLAT FIGURE" },
  { value: "PERCENTAGE", label: "PERCENTAGE OF INVENTORY" },
  { value: "NO_CAP", label: "NO CAP" },
];

const CURRENCIES = [
  { value: "GBP", label: "GBP (£)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

// Overtime rule options matching contract schema
const OVERTIME_RULE_OPTIONS = [
  { label: "After Standard Hours", value: "AFTER_STANDARD_HOURS" },
  { label: "Enhanced O/T", value: "ENHANCED_OT" },
  { label: "Camera O/T", value: "CAMERA_OT" },
  { label: "Post O/T", value: "POST_OT" },
  { label: "Pre O/T", value: "PRE_OT" },
  { label: "Night Penalty", value: "NIGHT_PENALTY" },
  { label: "BTA", value: "BTA" },
  { label: "Late Meal", value: "LATE_MEAL" },
  { label: "Broken Meal", value: "BROKEN_MEAL" },
  { label: "Travel", value: "TRAVEL" },
  { label: "Dawn", value: "DAWN" },
  { label: "Night", value: "NIGHT" },
];

// Special day types matching contract schema
const SPECIAL_DAY_TYPES = [
  { key: "SIXTH_DAY", label: "6th Day" },
  { key: "SEVENTH_DAY", label: "7th Day" },
  { key: "PUBLIC_HOLIDAY", label: "Public Holiday" },
  { key: "TRAVEL_DAY", label: "Travel Day" },
  { key: "TURNAROUND", label: "Turnaround" },
];

const getDefaultAllowances = () => ({
  boxRental: false,
  boxRentalDescription: "",
  boxRentalFeePerWeek: "",
  boxRentalCapCalculatedAs: "",
  boxRentalCap: "",
  boxRentalCapPercentage: "",
  boxRentalTerms: "",
  boxRentalBudgetCode: "",
  boxRentalPayableInPrep: false,
  boxRentalPayableInShoot: true,
  boxRentalPayableInWrap: false,
  computerAllowance: false,
  computerAllowanceFeePerWeek: "",
  computerAllowanceCapCalculatedAs: "",
  computerAllowanceCap: "",
  computerAllowanceTerms: "",
  computerAllowanceBudgetCode: "",
  computerAllowancePayableInPrep: false,
  computerAllowancePayableInShoot: true,
  computerAllowancePayableInWrap: false,
  softwareAllowance: false,
  softwareAllowanceDescription: "",
  softwareAllowanceFeePerWeek: "",
  softwareAllowanceTerms: "",
  softwareAllowanceBudgetCode: "",
  softwareAllowancePayableInPrep: false,
  softwareAllowancePayableInShoot: true,
  softwareAllowancePayableInWrap: false,
  equipmentRental: false,
  equipmentRentalDescription: "",
  equipmentRentalFeePerWeek: "",
  equipmentRentalDailyRateCalculation: "",
  equipmentRentalCapCalculatedAs: "",
  equipmentRentalCap: "",
  equipmentRentalTerms: "",
  equipmentRentalBudgetCode: "",
  equipmentRentalPayableInPrep: false,
  equipmentRentalPayableInShoot: true,
  equipmentRentalPayableInWrap: false,
  mobilePhoneAllowance: false,
  mobilePhoneAllowancePaidAs: "",
  mobilePhoneAllowanceFeePerWeek: "",
  mobilePhoneAllowanceTerms: "",
  mobilePhoneAllowanceBudgetCode: "",
  mobilePhoneAllowancePayableInPrep: false,
  mobilePhoneAllowancePayableInShoot: true,
  mobilePhoneAllowancePayableInWrap: false,
  vehicleAllowance: false,
  vehicleAllowanceFeePerWeek: "",
  vehicleAllowanceTerms: "",
  vehicleAllowanceBudgetCode: "",
  vehicleAllowancePayableInPrep: false,
  vehicleAllowancePayableInShoot: true,
  vehicleAllowancePayableInWrap: false,
  vehicleHire: false,
  vehicleHireRate: "",
  vehicleHireTerms: "",
  vehicleHireBudgetCode: "",
  vehicleHirePayableInPrep: false,
  vehicleHirePayableInShoot: true,
  vehicleHirePayableInWrap: false,
  perDiem1: false,
  perDiem1Currency: "GBP",
  perDiem1ShootDayRate: "",
  perDiem1NonShootDayRate: "",
  perDiem1Terms: "",
  perDiem1BudgetCode: "",
  perDiem1PayableInPrep: false,
  perDiem1PayableInShoot: true,
  perDiem1PayableInWrap: false,
  perDiem2: false,
  perDiem2Currency: "USD",
  perDiem2ShootDayRate: "",
  perDiem2NonShootDayRate: "",
  perDiem2Terms: "",
  perDiem2BudgetCode: "",
  perDiem2PayableInPrep: false,
  perDiem2PayableInShoot: true,
  perDiem2PayableInWrap: false,
  livingAllowance: false,
  livingAllowanceCurrency: "GBP",
  livingAllowanceDailyRate: "",
  livingAllowanceWeeklyRate: "",
  livingAllowanceTerms: "",
  livingAllowanceBudgetCode: "",
  livingAllowancePayableInPrep: false,
  livingAllowancePayableInShoot: true,
  livingAllowancePayableInWrap: false,
});

const createDefaultRole = (index) => ({
  id: Date.now().toString() + index,
  isPrimaryRole: index === 0,
  roleName: `ROLE ${index + 1}`,
  jobTitle: "",
  jobTitleSuffix: "",
  searchAllDepartments: false,
  createOwnJobTitle: false,
  unit: "",
  department: "",
  subDepartment: "",
  regularSiteOfWork: "",
  engagementType: "",
  productionPhase: "",
  startDate: "",
  endDate: "",
  dailyOrWeeklyEngagement: "",
  workingWeek: "",
  workingInUnitedKingdom: "YES",
  rateType: "DAILY",
  currency: "GBP",
  rateAmount: "",
  feePerDay: "",
  standardWorkingHours: "10",
  holidayPayInclusive: false,
  rateDescription: "",
  overtimeType: "CALCULATED", // UI only - for radio button state
  overtime: {
    enabled: true,
    rules: [], // Matches contract schema: overtime.rules[]
  },
  specialDayRates: SPECIAL_DAY_TYPES.map(day => ({
    type: day.key,
    amount: "",
    unit: "DAILY",
  })),
  budgetCode: "",
  allowances: getDefaultAllowances(),
});

// Utility function for conditional classes
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export default function CreateOffer() {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    recipient: true,
    taxStatus: true,
    roles: true,
    notes: true,
    attachments: true,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    isViaAgent: false,
    agentName: "",
    agentEmailAddress: "",
    alternativeContractType: "",
    allowAsSelfEmployedOrLoanOut: "",
    statusDeterminationReason: "",
    otherStatusDeterminationReason: "",
    otherDealProvisions: "",
    additionalNotes: "",
    isLivingInUk: true,
    // Template attachments
    dailyLoanOutAgreement: true,
    boxRentalForm: true,
    policyAcknowledgement: false,
    crewInformationForm: false,
  });

  const [roles, setRoles] = useState([createDefaultRole(0)]);
  const [activeRoleTab, setActiveRoleTab] = useState(roles[0].id);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addRole = () => {
    const newRole = createDefaultRole(roles.length);
    setRoles([...roles, newRole]);
    setActiveRoleTab(newRole.id);
  };

  const removeRole = (id) => {
    if (roles.length <= 1) return;
    const newRoles = roles.filter(r => r.id !== id);
    if (activeRoleTab === id) setActiveRoleTab(newRoles[0].id);
    setRoles(newRoles);
  };

  const updateRole = (id, updates) => {
    setRoles(roles.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateRoleAllowances = (id, updates) => {
    setRoles(roles.map(r => r.id === id ? { ...r, allowances: { ...r.allowances, ...updates } } : r));
  };

  // Overtime helpers
  const addOvertimeRule = (roleId) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          overtime: {
            ...r.overtime,
            rules: [
              ...r.overtime.rules,
              {
                name: "AFTER_STANDARD_HOURS",
                startsAfterHours: 10,
                rateMultiplier: 1.5,
                maxHours: null,
                budgetCode: "",
                terms: "",
                payableInPrep: false,
                payableInShoot: true,
                payableInWrap: false,
              },
            ],
          },
        };
      }
      return r;
    }));
  };

  const updateOvertimeRule = (roleId, ruleIndex, updates) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          overtime: {
            ...r.overtime,
            rules: r.overtime.rules.map((rule, idx) =>
              idx === ruleIndex ? { ...rule, ...updates } : rule
            ),
          },
        };
      }
      return r;
    }));
  };

  const removeOvertimeRule = (roleId, ruleIndex) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          overtime: {
            ...r.overtime,
            rules: r.overtime.rules.filter((_, idx) => idx !== ruleIndex),
          },
        };
      }
      return r;
    }));
  };

  // Special day rate helpers
  const updateSpecialDayRate = (roleId, type, amount) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          specialDayRates: r.specialDayRates.map(day =>
            day.type === type ? { ...day, amount } : day
          ),
        };
      }
      return r;
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.emailAddress) {
      toast.error("Missing Information", {
        description: "Please fill in the recipient's name and email address."
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Offer Saved", {
        description: "The offer has been saved as a draft."
      });
      navigate(`/projects/${projectName}/onboarding`);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save the offer. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!formData.fullName || !formData.emailAddress) {
      toast.error("Missing Information", {
        description: "Please fill in required fields (Full Name and Email Address)."
      });
      return;
    }

    const primaryRole = roles.find(r => r.isPrimaryRole) || roles[0];
    if (!primaryRole?.engagementType) {
      toast.error("Missing Information", {
        description: "Please select an Engagement Type for the role."
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/projects/${projectName}/onboarding`);
      }, 3000);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send the offer. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "GBP": return "£";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "£";
    }
  };

  const SectionHeader = ({ title, icon: Icon, section, isOpen }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-primary/5 rounded-t-lg border-b border-primary/10 hover:bg-primary/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-primary uppercase tracking-wide">{title}</span>
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const FormField = ({ label, required, tooltip, children, className }) => (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
        {label} {required && <span className="text-destructive">*</span>}
        {tooltip && <span className="font-normal text-muted-foreground ml-1 text-[10px] normal-case">({tooltip})</span>}
      </Label>
      {children}
    </div>
  );

  const SelectField = ({ value, onChange, options, className, ...props }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );

  const CurrencyInput = ({ label, value, onChange, currency = "GBP", required }) => (
    <FormField label={label} required={required}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground w-4">{getCurrencySymbol(currency)}</span>
        <Input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1"
        />
      </div>
    </FormField>
  );

  const PayableInCheckboxes = ({ label, prep, shoot, wrap, onPrepChange, onShootChange, onWrapChange }) => (
    <FormField label={label || "Payable In"}>
      <div className="flex gap-4 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={prep} onCheckedChange={onPrepChange} />
          <span className="text-xs font-medium">PREP</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={shoot} onCheckedChange={onShootChange} />
          <span className="text-xs font-medium">SHOOT</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={wrap} onCheckedChange={onWrapChange} />
          <span className="text-xs font-medium">WRAP</span>
        </label>
      </div>
    </FormField>
  );

  const AllowanceSection = ({ title, icon: Icon, isEnabled, onToggle, children }) => (
    <div className={cn(
      "rounded-lg border transition-all",
      isEnabled ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      <div className="flex items-center gap-3 p-3">
        <Checkbox checked={isEnabled} onCheckedChange={onToggle} className="w-5 h-5" />
        <Icon className={cn("w-5 h-5", isEnabled ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-sm font-bold uppercase", isEnabled ? "text-primary" : "text-muted-foreground")}>
          {title}
        </span>
        {isEnabled && (
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary text-[10px]">
            ENABLED
          </Badge>
        )}
      </div>
      {isEnabled && (
        <div className="px-3 pb-4 pt-2 border-t border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  const primaryRole = roles.find(r => r.isPrimaryRole);

  const PDFPreview = () => (
    <div className="bg-white text-black p-8 min-h-[800px] font-serif" style={{ fontFamily: "Georgia, serif" }}>
      <div className="border-b-4 border-primary pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-wider">EAARTH PRODUCTIONS</h1>
            <p className="text-sm text-gray-600 mt-1">CREW OFFER LETTER</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
            <p>Reference: OFFER-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">RECIPIENT DETAILS</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold">Full Name:</span> {formData.fullName || "—"}</div>
          <div><span className="font-semibold">Email Address:</span> {formData.emailAddress || "—"}</div>
          <div><span className="font-semibold">Mobile Number:</span> {formData.mobileNumber || "—"}</div>
          <div><span className="font-semibold">Contract Type:</span> {formData.alternativeContractType || "Standard"}</div>
          {formData.isViaAgent && (
            <>
              <div><span className="font-semibold">Agent Name:</span> {formData.agentName || "—"}</div>
              <div><span className="font-semibold">Agent Email:</span> {formData.agentEmailAddress || "—"}</div>
            </>
          )}
        </div>
      </section>

      {roles.map((role, idx) => (
        <section key={role.id} className="mb-6">
          <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            ROLE {idx + 1} {role.isPrimaryRole && "(PRIMARY)"}: {role.jobTitle || "UNTITLED"}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><span className="font-semibold">Job Title:</span> {role.jobTitle || "—"} {role.jobTitleSuffix}</div>
            <div><span className="font-semibold">Department:</span> {role.department || "—"}</div>
            <div><span className="font-semibold">Unit:</span> {role.unit || "—"}</div>
            <div><span className="font-semibold">Start Date:</span> {role.startDate || "TBC"}</div>
            <div><span className="font-semibold">End Date:</span> {role.endDate || "TBC"}</div>
            <div><span className="font-semibold">Rate:</span> {getCurrencySymbol(role.currency)}{role.rateAmount || "0.00"} ({role.rateType})</div>
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="sticky py-3">
        <div className="flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${projectName}/onboarding`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">CREATE NEW OFFER</h1>
              <p className="text-xs text-muted-foreground">
                {formData.fullName || "New Recipient"} {primaryRole?.jobTitle && `- ${primaryRole.jobTitle}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="gap-2">
              <Eye className="w-4 h-4" /> Preview Offer
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2" disabled={isSaving}>
              <Save className="w-4 h-4" /> Save Draft
            </Button>
            <Button size="sm" onClick={handleSend} className="gap-2 bg-primary" disabled={isSaving}>
              <Send className="w-4 h-4" /> Send Offer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto space-y-4">
        {/* Recipient Section */}
        <Card className="border-0 shadow-sm py-0 overflow-hidden">
          <SectionHeader
            title="Recipient"
            icon={User}
            section="recipient"
            isOpen={expandedSections.recipient}
          />

          {expandedSections.recipient && (
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Full Name" required>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="ENTER FULL NAME"
                    className="uppercase"
                  />
                </FormField>

                <FormField label="Email" required tooltip="Preferred email for engine account">
                  <Input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emailAddress: e.target.value.toLowerCase(),
                      })
                    }
                    placeholder="email@example.com"
                  />
                </FormField>

                <FormField label="Mobile Number">
                  <Input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobileNumber: e.target.value,
                      })
                    }
                    placeholder="+44 7XXX XXXXXX"
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="isViaAgent"
                  checked={formData.isViaAgent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isViaAgent: checked })
                  }
                />
                <Label
                  htmlFor="isViaAgent"
                  className="text-sm font-medium cursor-pointer"
                >
                  Recipient is represented via an agent?
                </Label>
              </div>

              {formData.isViaAgent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <FormField label="Agent Name">
                    <Input
                      value={formData.agentName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agentName: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="AGENT'S FULL NAME"
                      className="uppercase"
                    />
                  </FormField>

                  <FormField label="Agent Email Address">
                    <Input
                      type="email"
                      value={formData.agentEmailAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agentEmailAddress: e.target.value.toLowerCase(),
                        })
                      }
                      placeholder="agent@example.com"
                    />
                  </FormField>
                </div>
              )}

              <FormField label="Alternative Contract Type">
                <SelectField
                  value={formData.alternativeContractType}
                  onChange={(v) =>
                    setFormData({ ...formData, alternativeContractType: v })
                  }
                  options={CONTRACT_OPTIONS}
                />
              </FormField>
            </CardContent>
          )}
        </Card>

        {/* Tax Status Section */}
        <Card className="border-0 py-0 shadow-sm overflow-hidden">
          <SectionHeader title="Tax Status" icon={Briefcase} section="taxStatus" isOpen={expandedSections.taxStatus} />
          {expandedSections.taxStatus && (
            <CardContent className="p-4 space-y-4">
              <FormField label="Allow as Self-Employed or Loan Out?">
                <div className="flex gap-6 pt-2">
                  {["YES", "NO"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="selfEmployed"
                        value={opt}
                        checked={formData.allowAsSelfEmployedOrLoanOut === opt}
                        onChange={(e) => setFormData({ ...formData, allowAsSelfEmployedOrLoanOut: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              {formData.allowAsSelfEmployedOrLoanOut === "YES" && (
                <FormField label="Status Determination Reason">
                  <SelectField
                    value={formData.statusDeterminationReason}
                    onChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}
                    options={STATUS_REASONS}
                  />
                </FormField>
              )}

              {formData.statusDeterminationReason === "OTHER" && (
                <FormField label="Please Specify Other Reason">
                  <Input
                    value={formData.otherStatusDeterminationReason}
                    onChange={(e) => setFormData({ ...formData, otherStatusDeterminationReason: e.target.value.toUpperCase() })}
                    placeholder="ENTER REASON"
                    className="uppercase"
                  />
                </FormField>
              )}

              <FormField label="Working in the UK?" required>
                <div className="flex gap-6 pt-2">
                  {["YES", "NEVER"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`workingInUK`}
                        value={opt}
                        checked={formData.isLivingInUk}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isLivingInUk: e.target.value,
                          })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </CardContent>
          )}
        </Card>

        {/* Roles Section */}
        <Card className="border-0 py-0 shadow-sm overflow-hidden">
          <SectionHeader
            title="Roles & Rates"
            icon={DollarSign}
            section="roles"
            isOpen={expandedSections.roles}
          />

          {expandedSections.roles && (
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Configure one or more roles for this offer
              </p>

              <Tabs value={activeRoleTab} onValueChange={setActiveRoleTab}>
                <div className="flex items-center gap-2 mb-4">
                  <TabsList className="h-auto p-0 bg-transparent gap-1">
                    {roles.map((role) => (
                      <TabsTrigger
                        key={role.id}
                        value={role.id}
                        className="gap-2 data-[state=active]:bg-muted"
                      >
                        {role.isPrimaryRole && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-primary/10 text-primary px-2 py-0"
                          >
                            PRIMARY
                          </Badge>
                        )}
                        <span className="text-sm">{role.roleName}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRole}
                    className="gap-1.5 ml-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Role
                  </Button>
                </div>

                {roles.map((role) => (
                  <TabsContent
                    key={role.id}
                    value={role.id}
                    className="space-y-4"
                  >
                    {roles.length > 1 && !role.isPrimaryRole && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive gap-2"
                          onClick={() => removeRole(role.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove This Role
                        </Button>
                      </div>
                    )}

                    {/* Unit & Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Unit" required>
                        <Input
                          value={role.unit}
                          onChange={(e) => updateRole(role.id, { unit: e.target.value.toUpperCase() })}
                          placeholder="E.G., MAIN, SECOND UNIT"
                          className="uppercase"
                        />
                      </FormField>

                      <FormField label="Department" required>
                        <SelectField
                          value={role.department}
                          onChange={(v) => updateRole(role.id, { department: v })}
                          options={[{ value: "", label: "SELECT DEPARTMENT..." }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]}
                        />
                      </FormField>

                      <FormField label="Sub-Department">
                        <Input
                          value={role.subDepartment}
                          onChange={(e) =>
                            updateRole(role.id, { subDepartment: e.target.value.toUpperCase() })
                          }
                          placeholder="OPTIONAL"
                          className="uppercase"
                        />
                      </FormField>
                    </div>

                    {/* Job Title */}
                    <FormField label="Job Title" required>
                      <Input
                        value={role.jobTitle}
                        onChange={(e) =>
                          updateRole(role.id, { jobTitle: e.target.value.toUpperCase() })
                        }
                        placeholder="TYPE TO SEARCH..."
                        className="uppercase"
                      />
                    </FormField>

                    {/* Search Options */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id={`searchAllDepts-${role.id}`}
                          checked={role.searchAllDepartments}
                          onCheckedChange={(checked) => updateRole(role.id, { searchAllDepartments: checked })}
                        />
                        <Label htmlFor={`searchAllDepts-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                          Search job titles from all departments?
                        </Label>
                      </div>

                      <p className="text-[10px] text-muted-foreground uppercase">
                        Engagement type (e.g. PAYE) is shown as guidance only, can be amended later (depending on your settings), and won't appear in the chosen job title
                      </p>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`createOwnTitle-${role.id}`}
                          checked={role.createOwnJobTitle}
                          onCheckedChange={(checked) => updateRole(role.id, { createOwnJobTitle: checked })}
                        />
                        <Label htmlFor={`createOwnTitle-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                          Create your own job title (only available to this project)
                        </Label>
                      </div>

                      <p className="text-[10px] text-muted-foreground uppercase">
                        For job titles which require non-standard crew templates, <span className="text-primary cursor-pointer">contact EAARTH Studios</span>
                      </p>
                    </div>

                    {/* Job Title Suffix + Regular Site */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <FormField label="Job Title Suffix">
                          <Input
                            value={role.jobTitleSuffix}
                            onChange={(e) =>
                              updateRole(role.id, { jobTitleSuffix: e.target.value.toUpperCase() })
                            }
                            placeholder="E.G., 'TO CAST #1'"
                            className="uppercase"
                          />
                        </FormField>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          E.g., if job title = driver, add the suffix: "to cast #1" or "to producer's name"
                        </p>
                      </div>

                      <FormField label="Regular Site of Work (On Shoot Days)" required>
                        <Input
                          value={role.regularSiteOfWork}
                          onChange={(e) =>
                            updateRole(role.id, { regularSiteOfWork: e.target.value.toUpperCase() })
                          }
                          placeholder="E.G., VARIOUS LOCATIONS"
                          className="uppercase"
                        />
                      </FormField>
                    </div>

                    {/* Engagement & Rate Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Engagement Type" required>
                        <SelectField
                          value={role.engagementType}
                          onChange={(v) => updateRole(role.id, { engagementType: v })}
                          options={ENGAGEMENT_TYPES}
                        />
                      </FormField>
                      <FormField label="Rate Type">
                        <SelectField
                          value={role.rateType}
                          onChange={(v) => updateRole(role.id, { rateType: v })}
                          options={RATE_TYPES}
                        />
                      </FormField>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Start Date" required>
                        <Input
                          type="date"
                          value={role.startDate}
                          onChange={(e) => updateRole(role.id, { startDate: e.target.value })}
                        />
                      </FormField>

                      <FormField label="End Date">
                        <Input
                          type="date"
                          value={role.endDate}
                          onChange={(e) => updateRole(role.id, { endDate: e.target.value })}
                        />
                      </FormField>
                    </div>

                    {/* Working Week, Currency, Fee */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Working Week">
                        <SelectField
                          value={role.workingWeek}
                          onChange={(v) => updateRole(role.id, { workingWeek: v })}
                          options={[
                            { value: "", label: "SELECT..." },
                            { value: "5_DAYS", label: "5 DAYS" },
                            { value: "5.5_DAYS", label: "5.5 DAYS" },
                            { value: "5_6_DAYS", label: "5/6 DAYS" },
                            { value: "6_DAYS", label: "6 DAYS" }
                          ]}
                        />
                      </FormField>

                      <FormField label="Currency" required>
                        <SelectField
                          value={role.currency}
                          onChange={(v) => updateRole(role.id, { currency: v })}
                          options={CURRENCIES}
                        />
                      </FormField>

                      <FormField label="Fee Per Day Including Holiday" required>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground w-4">
                            {getCurrencySymbol(role.currency)}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            value={role.feePerDay}
                            onChange={(e) => updateRole(role.id, { feePerDay: e.target.value })}
                            placeholder="0.00"
                            className="flex-1"
                          />
                        </div>
                      </FormField>
                    </div>

                    {/* Rate & Compensation Section */}
                    <div className="border rounded-lg p-4 bg-primary/5 space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-bold text-primary uppercase">Rate & Compensation</h4>
                      </div>

                      {/* Base Rate */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 border-b">
                        <CurrencyInput
                          label={`${role.rateType === "DAILY" ? "Daily" : "Weekly"} Rate Amount`}
                          value={role.rateAmount}
                          onChange={(v) => updateRole(role.id, { rateAmount: v })}
                          currency={role.currency}
                          required
                        />

                        <FormField label="Standard Working Hours">
                          <Input
                            type="number"
                            value={role.standardWorkingHours}
                            onChange={(e) => updateRole(role.id, { standardWorkingHours: e.target.value })}
                            placeholder="10"
                          />
                        </FormField>

                        <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-muted/50">
                          <Checkbox
                            id={`holidayPay-${role.id}`}
                            checked={role.holidayPayInclusive}
                            onCheckedChange={(checked) => updateRole(role.id, { holidayPayInclusive: checked })}
                          />
                          <Label htmlFor={`holidayPay-${role.id}`} className="text-sm cursor-pointer font-medium">
                            Holiday Pay Inclusive in Rate
                          </Label>
                        </div>
                      </div>

                      {/* Special Day Rates Section */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-primary uppercase">Special Day Rates</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {SPECIAL_DAY_TYPES.map((day) => {
                            const dayRate = role.specialDayRates.find(d => d.type === day.key);
                            return (
                              <CurrencyInput
                                key={day.key}
                                label={day.label}
                                value={dayRate?.amount || ""}
                                onChange={(v) => updateSpecialDayRate(role.id, day.key, v)}
                                currency={role.currency}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Overtime Section */}
                      <div className="space-y-4 pt-6 border-t">
                        <FormField label="Overtime">
                          <div className="flex gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`overtime-${role.id}`}
                                value="CALCULATED"
                                checked={role.overtimeType === "CALCULATED"}
                                onChange={() => updateRole(role.id, { overtimeType: "CALCULATED" })}
                                className="w-4 h-4 text-primary"
                              />
                              <span className="text-sm font-medium">CALCULATED PER AGREEMENT</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`overtime-${role.id}`}
                                value="CUSTOM"
                                checked={role.overtimeType === "CUSTOM"}
                                onChange={() => updateRole(role.id, { overtimeType: "CUSTOM" })}
                                className="w-4 h-4 text-primary"
                              />
                              <span className="text-sm font-medium">CUSTOM OVERTIME RATES</span>
                            </label>
                          </div>
                        </FormField>

                        {/* Custom Overtime Rules */}
                        {role.overtimeType === "CUSTOM" && (
                          <div className="space-y-4">
                            {role.overtime.rules.map((rule, ruleIdx) => (
                              <div key={ruleIdx} className={cn(
                                "rounded-lg border transition-all p-4 space-y-4",
                                "border-primary/30 bg-primary/5"
                              )}>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-bold text-primary uppercase">
                                    Overtime Rule {ruleIdx + 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOvertimeRule(role.id, ruleIdx)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <FormField label="Rule Type">
                                    <SelectField
                                      value={rule.name}
                                      onChange={(v) => updateOvertimeRule(role.id, ruleIdx, { name: v })}
                                      options={[
                                        { value: "", label: "SELECT RULE..." },
                                        ...OVERTIME_RULE_OPTIONS
                                      ]}
                                    />
                                  </FormField>

                                  <FormField label="Rate Multiplier">
                                    <Input
                                      type="number"
                                      step="0.1"
                                      value={rule.rateMultiplier}
                                      onChange={(e) => updateOvertimeRule(role.id, ruleIdx, { rateMultiplier: Number(e.target.value) })}
                                      placeholder="1.5"
                                    />
                                  </FormField>

                                  <FormField label="Starts After Hours">
                                    <Input
                                      type="number"
                                      value={rule.startsAfterHours ?? ""}
                                      onChange={(e) => updateOvertimeRule(role.id, ruleIdx, { startsAfterHours: Number(e.target.value) })}
                                      placeholder="10"
                                    />
                                  </FormField>

                                  <FormField label="Max Hours (Optional)">
                                    <Input
                                      type="number"
                                      value={rule.maxHours ?? ""}
                                      onChange={(e) => updateOvertimeRule(role.id, ruleIdx, { maxHours: e.target.value ? Number(e.target.value) : null })}
                                      placeholder="No cap"
                                    />
                                  </FormField>

                                  <FormField label="Budget Code">
                                    <Input
                                      value={rule.budgetCode || ""}
                                      onChange={(e) => updateOvertimeRule(role.id, ruleIdx, { budgetCode: e.target.value.toUpperCase() })}
                                      placeholder="E.G. 847-13-001"
                                      className="uppercase"
                                    />
                                  </FormField>

                                  <FormField label="Terms" className="lg:col-span-1">
                                    <Input
                                      value={rule.terms || ""}
                                      onChange={(e) => updateOvertimeRule(role.id, ruleIdx, { terms: e.target.value.toUpperCase() })}
                                      placeholder="TERMS"
                                      className="uppercase"
                                    />
                                  </FormField>

                                  <PayableInCheckboxes
                                    label="Payable In"
                                    prep={rule.payableInPrep}
                                    shoot={rule.payableInShoot}
                                    wrap={rule.payableInWrap}
                                    onPrepChange={(v) => updateOvertimeRule(role.id, ruleIdx, { payableInPrep: v })}
                                    onShootChange={(v) => updateOvertimeRule(role.id, ruleIdx, { payableInShoot: v })}
                                    onWrapChange={(v) => updateOvertimeRule(role.id, ruleIdx, { payableInWrap: v })}
                                  />
                                </div>
                              </div>
                            ))}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addOvertimeRule(role.id)}
                              className="gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Overtime Rule
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role-Specific Allowances */}
                    <div className="border rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-bold text-primary uppercase">Role-Specific Allowances</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Configure allowances specific to this role. Each role can have different allowance settings.
                      </p>
                      <div className="space-y-3">
                        {/* Box Rental */}
                        <AllowanceSection
                          title="Box Rental?"
                          icon={Package}
                          isEnabled={role.allowances.boxRental}
                          onToggle={(v) => updateRoleAllowances(role.id, { boxRental: v })}
                        >
                          <FormField label="Box Rental Description" className="lg:col-span-3">
                            <textarea
                              value={role.allowances.boxRentalDescription}
                              onChange={(e) => updateRoleAllowances(role.id, { boxRentalDescription: e.target.value.toUpperCase() })}
                              placeholder="DESCRIPTION OF BOX RENTAL ITEMS"
                              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase resize-none"
                              maxLength={250}
                            />
                          </FormField>
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.boxRentalFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { boxRentalFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Cap Calculated As">
                            <SelectField
                              value={role.allowances.boxRentalCapCalculatedAs}
                              onChange={(v) => updateRoleAllowances(role.id, { boxRentalCapCalculatedAs: v })}
                              options={CAP_TYPES}
                            />
                          </FormField>
                          {role.allowances.boxRentalCapCalculatedAs === "FLAT" && (
                            <CurrencyInput
                              label="Box Rental Cap Amount"
                              value={role.allowances.boxRentalCap}
                              onChange={(v) => updateRoleAllowances(role.id, { boxRentalCap: v })}
                              currency={role.currency}
                            />
                          )}
                          {role.allowances.boxRentalCapCalculatedAs === "PERCENTAGE" && (
                            <FormField label="Cap Percentage of Inventory">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={role.allowances.boxRentalCapPercentage}
                                  onChange={(e) => updateRoleAllowances(role.id, { boxRentalCapPercentage: e.target.value })}
                                  placeholder="0.00"
                                />
                                <span className="text-sm font-semibold">%</span>
                              </div>
                            </FormField>
                          )}
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.boxRentalTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { boxRentalTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.boxRentalBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { boxRentalBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.boxRentalPayableInPrep}
                            shoot={role.allowances.boxRentalPayableInShoot}
                            wrap={role.allowances.boxRentalPayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Computer Allowance */}
                        <AllowanceSection
                          title="Computer Allowance?"
                          icon={Laptop}
                          isEnabled={role.allowances.computerAllowance}
                          onToggle={(v) => updateRoleAllowances(role.id, { computerAllowance: v })}
                        >
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.computerAllowanceFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { computerAllowanceFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Cap Calculated As">
                            <SelectField
                              value={role.allowances.computerAllowanceCapCalculatedAs}
                              onChange={(v) => updateRoleAllowances(role.id, { computerAllowanceCapCalculatedAs: v })}
                              options={CAP_TYPES}
                            />
                          </FormField>
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.computerAllowanceTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { computerAllowanceTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.computerAllowanceBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { computerAllowanceBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.computerAllowancePayableInPrep}
                            shoot={role.allowances.computerAllowancePayableInShoot}
                            wrap={role.allowances.computerAllowancePayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Software Allowance */}
                        <AllowanceSection
                          title="Software Allowance?"
                          icon={Code}
                          isEnabled={role.allowances.softwareAllowance}
                          onToggle={(v) => updateRoleAllowances(role.id, { softwareAllowance: v })}
                        >
                          <FormField label="Software Description">
                            <Input
                              value={role.allowances.softwareAllowanceDescription}
                              onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceDescription: e.target.value.toUpperCase() })}
                              placeholder="SOFTWARE DESCRIPTION"
                              className="uppercase"
                            />
                          </FormField>
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.softwareAllowanceFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { softwareAllowanceFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.softwareAllowanceTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.softwareAllowanceBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.softwareAllowancePayableInPrep}
                            shoot={role.allowances.softwareAllowancePayableInShoot}
                            wrap={role.allowances.softwareAllowancePayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Equipment Rental */}
                        <AllowanceSection
                          title="Equipment Rental?"
                          icon={Camera}
                          isEnabled={role.allowances.equipmentRental}
                          onToggle={(v) => updateRoleAllowances(role.id, { equipmentRental: v })}
                        >
                          <FormField label="Equipment Description">
                            <Input
                              value={role.allowances.equipmentRentalDescription}
                              onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalDescription: e.target.value.toUpperCase() })}
                              placeholder="EQUIPMENT DESCRIPTION"
                              className="uppercase"
                            />
                          </FormField>
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.equipmentRentalFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { equipmentRentalFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.equipmentRentalTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.equipmentRentalBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.equipmentRentalPayableInPrep}
                            shoot={role.allowances.equipmentRentalPayableInShoot}
                            wrap={role.allowances.equipmentRentalPayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Mobile Phone Allowance */}
                        <AllowanceSection
                          title="Mobile Phone Allowance?"
                          icon={Smartphone}
                          isEnabled={role.allowances.mobilePhoneAllowance}
                          onToggle={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowance: v })}
                        >
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.mobilePhoneAllowanceFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowanceFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.mobilePhoneAllowanceTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { mobilePhoneAllowanceTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.mobilePhoneAllowanceBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { mobilePhoneAllowanceBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.mobilePhoneAllowancePayableInPrep}
                            shoot={role.allowances.mobilePhoneAllowancePayableInShoot}
                            wrap={role.allowances.mobilePhoneAllowancePayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Vehicle Allowance */}
                        <AllowanceSection
                          title="Vehicle Allowance?"
                          icon={Car}
                          isEnabled={role.allowances.vehicleAllowance}
                          onToggle={(v) => updateRoleAllowances(role.id, { vehicleAllowance: v })}
                        >
                          <CurrencyInput
                            label="Fee Per Week"
                            value={role.allowances.vehicleAllowanceFeePerWeek}
                            onChange={(v) => updateRoleAllowances(role.id, { vehicleAllowanceFeePerWeek: v })}
                            currency={role.currency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.vehicleAllowanceTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { vehicleAllowanceTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.vehicleAllowanceBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { vehicleAllowanceBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.vehicleAllowancePayableInPrep}
                            shoot={role.allowances.vehicleAllowancePayableInShoot}
                            wrap={role.allowances.vehicleAllowancePayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Per Diem 1 */}
                        <AllowanceSection
                          title="Per Diem 1?"
                          icon={Coffee}
                          isEnabled={role.allowances.perDiem1}
                          onToggle={(v) => updateRoleAllowances(role.id, { perDiem1: v })}
                        >
                          <FormField label="Currency">
                            <SelectField
                              value={role.allowances.perDiem1Currency}
                              onChange={(v) => updateRoleAllowances(role.id, { perDiem1Currency: v })}
                              options={CURRENCIES}
                            />
                          </FormField>
                          <CurrencyInput
                            label="Shoot Day Rate"
                            value={role.allowances.perDiem1ShootDayRate}
                            onChange={(v) => updateRoleAllowances(role.id, { perDiem1ShootDayRate: v })}
                            currency={role.allowances.perDiem1Currency}
                          />
                          <CurrencyInput
                            label="Non-Shoot Day Rate"
                            value={role.allowances.perDiem1NonShootDayRate}
                            onChange={(v) => updateRoleAllowances(role.id, { perDiem1NonShootDayRate: v })}
                            currency={role.allowances.perDiem1Currency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.perDiem1Terms}
                              onChange={(e) => updateRoleAllowances(role.id, { perDiem1Terms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.perDiem1BudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { perDiem1BudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.perDiem1PayableInPrep}
                            shoot={role.allowances.perDiem1PayableInShoot}
                            wrap={role.allowances.perDiem1PayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInWrap: v })}
                          />
                        </AllowanceSection>

                        {/* Living Allowance */}
                        <AllowanceSection
                          title="Living Allowance?"
                          icon={Home}
                          isEnabled={role.allowances.livingAllowance}
                          onToggle={(v) => updateRoleAllowances(role.id, { livingAllowance: v })}
                        >
                          <FormField label="Currency">
                            <SelectField
                              value={role.allowances.livingAllowanceCurrency}
                              onChange={(v) => updateRoleAllowances(role.id, { livingAllowanceCurrency: v })}
                              options={CURRENCIES}
                            />
                          </FormField>
                          <CurrencyInput
                            label="Weekly Rate"
                            value={role.allowances.livingAllowanceWeeklyRate}
                            onChange={(v) => updateRoleAllowances(role.id, { livingAllowanceWeeklyRate: v })}
                            currency={role.allowances.livingAllowanceCurrency}
                          />
                          <FormField label="Terms">
                            <Input
                              value={role.allowances.livingAllowanceTerms}
                              onChange={(e) => updateRoleAllowances(role.id, { livingAllowanceTerms: e.target.value.toUpperCase() })}
                              placeholder="TERMS AND CONDITIONS"
                              className="uppercase"
                            />
                          </FormField>
                          <FormField label="Budget Code">
                            <Input
                              value={role.allowances.livingAllowanceBudgetCode}
                              onChange={(e) => updateRoleAllowances(role.id, { livingAllowanceBudgetCode: e.target.value.toUpperCase() })}
                              placeholder="E.G. 847-13-001"
                              className="uppercase"
                            />
                          </FormField>
                          <PayableInCheckboxes
                            label="Payable In"
                            prep={role.allowances.livingAllowancePayableInPrep}
                            shoot={role.allowances.livingAllowancePayableInShoot}
                            wrap={role.allowances.livingAllowancePayableInWrap}
                            onPrepChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInPrep: v })}
                            onShootChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInShoot: v })}
                            onWrapChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInWrap: v })}
                          />
                        </AllowanceSection>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          )}
        </Card>

        {/* Attached Template Bundle */}
        <Card className="border-0 py-0 shadow-sm overflow-hidden">
          <SectionHeader
            title="Attached Template Bundle"
            icon={FileText}
            section="attachments"
            isOpen={expandedSections.attachments}
          />
          {expandedSections.attachments && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {["Daily Loan Out Agreement", "Box Rental Form", "Policy Acknowledgement", "Crew Information Form"].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-bold uppercase text-center">{doc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Additional Notes Section */}
        <Card className="border-0 py-0 shadow-sm overflow-hidden">
          <SectionHeader
            title="Additional Notes"
            icon={Bell}
            section="notes"
            isOpen={expandedSections.notes}
          />

          {expandedSections.notes && (
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Other Deal Provisions">
                  <textarea
                    value={formData.otherDealProvisions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherDealProvisions: e.target.value,
                      })
                    }
                    placeholder="Enter any additional provisions..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-none"
                  />
                </FormField>

                <FormField label="Additional Notes">
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    placeholder="Enter any notes for internal reference..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-none"
                  />
                </FormField>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer Preview</DialogTitle>
            <DialogDescription>
              This is a preview of the offer letter that will be sent to the recipient.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <PDFPreview />
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <div className="py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Offer Sent Successfully!</DialogTitle>
            <DialogDescription>
              Your offer has been sent to {formData.fullName}. They will receive an email with instructions to review and accept the offer.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}