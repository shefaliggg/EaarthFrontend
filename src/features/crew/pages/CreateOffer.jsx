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
  Plus, ArrowLeft, Save, Send, User, Briefcase, DollarSign, Trash2,
  CheckCircle, Bell, ChevronDown, ChevronUp, Package, Laptop, Code,
  Camera, Smartphone, Car, Coffee, Home, FileText, Eye, X,
  Settings, FileCheck, AlertCircle,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "ACCOUNTS","ACTION VEHICLES","AERIAL","ANIMALS","ANIMATION","ARMOURY","ART",
  "ASSETS","ASSISTANT DIRECTORS","CAMERA","CAST","CHAPERONES","CHOREOGRAPHY",
  "CLEARANCES","COMPUTER GRAPHICS","CONSTRUCTION","CONTINUITY","COSTUME",
  "COSTUME FX","COVID SAFETY","CREATURE EFFECTS","DIT","DIGITAL ASSETS",
  "DIGITAL PLAYBACK","DIRECTOR","DOCUMENTARY","DRAPES","EPK","EDITORIAL",
  "ELECTRICAL","ELECTRICAL RIGGING","FRANCHISE","GREENS","GREENSCREENS","GRIP",
  "HAIR AND MAKEUP","HEALTH AND SAFETY","IT","LOCATIONS","MARINE","MEDICAL",
  "MILITARY","MUSIC","PHOTOGRAPHY","PICTURE VEHICLES","POST PRODUCTION",
  "PRODUCTION","PROP MAKING","PROPS","PROSTHETICS","PUBLICITY","PUPPETEER",
  "RIGGING","SFX","SCRIPT","SCRIPT EDITING","SECURITY","SET DEC","SOUND",
  "STANDBY","STORYBOARD","STUDIO UNIT","STUNTS","SUPPORTING ARTIST",
  "SUSTAINABILITY","TRANSPORT","TUTORS","UNDERWATER","VFX","VIDEO","VOICE",
];

const CONTRACT_OPTIONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HOD", label: "HOD" },
  { value: "NO_CONTRACT", label: "NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)" },
  { value: "SENIOR_AGREEMENT", label: "SENIOR AGREEMENT" },
];

const STATUS_REASONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HMRC_LIST", label: "HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'" },
  { value: "CEST_ASSESSMENT", label: "CEST ASSESSMENT CONFIRMED 'OFF-PAYROLL WORKING RULES DO NOT APPLY'" },
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

const SPECIAL_DAY_TYPES = [
  { key: "SIXTH_DAY", label: "6th Day" },
  { key: "SEVENTH_DAY", label: "7th Day" },
  { key: "PUBLIC_HOLIDAY", label: "Public Holiday" },
  { key: "TRAVEL_DAY", label: "Travel Day" },
  { key: "TURNAROUND", label: "Turnaround" },
];

// Bundle config: rate + engagement → template list
const BUNDLE_CONFIG = {
  "DAILY_PAYE":      ["Daily PAYE Contract", "Box Rental Form", "Policy Acknowledgement", "Crew Information Form"],
  "DAILY_LOAN_OUT":  ["Daily Loan Out Agreement", "Box Rental Form", "Loan Out Declaration"],
  "WEEKLY_PAYE":     ["Weekly PAYE Contract", "Policy Acknowledgement", "Crew Information Form"],
  "WEEKLY_LOAN_OUT": ["Weekly Loan Out Agreement", "Loan Out Declaration"],
  "DAILY_SCHD":      ["SCHD Daily Rate Card", "Crew Information Form"],
  "WEEKLY_SCHD":     ["SCHD Weekly Rate Card", "Crew Information Form"],
  "DAILY_LONG_FORM": ["Long Form Daily Agreement", "Box Rental Form", "Policy Acknowledgement"],
  "WEEKLY_LONG_FORM":["Long Form Weekly Agreement", "Policy Acknowledgement"],
};

// ─── Default Helpers ──────────────────────────────────────────────────────────

const getDefaultAllowances = () => ({
  boxRental: false, boxRentalTag: "", boxRentalDescription: "", boxRentalFeePerWeek: "",
  boxRentalCapCalculatedAs: "", boxRentalCap: "", boxRentalCapPercentage: "",
  boxRentalTerms: "", boxRentalBudgetCode: "",
  boxRentalPayableInPrep: false, boxRentalPayableInShoot: true, boxRentalPayableInWrap: false,

  computerAllowance: false, computerAllowanceTag: "", computerAllowanceFeePerWeek: "",
  computerAllowanceCapCalculatedAs: "", computerAllowanceCap: "",
  computerAllowanceTerms: "", computerAllowanceBudgetCode: "",
  computerAllowancePayableInPrep: false, computerAllowancePayableInShoot: true, computerAllowancePayableInWrap: false,

  softwareAllowance: false, softwareAllowanceTag: "", softwareAllowanceDescription: "",
  softwareAllowanceFeePerWeek: "", softwareAllowanceTerms: "", softwareAllowanceBudgetCode: "",
  softwareAllowancePayableInPrep: false, softwareAllowancePayableInShoot: true, softwareAllowancePayableInWrap: false,

  equipmentRental: false, equipmentRentalTag: "", equipmentRentalDescription: "",
  equipmentRentalFeePerWeek: "", equipmentRentalTerms: "", equipmentRentalBudgetCode: "",
  equipmentRentalPayableInPrep: false, equipmentRentalPayableInShoot: true, equipmentRentalPayableInWrap: false,

  mobilePhoneAllowance: false, mobilePhoneAllowanceTag: "", mobilePhoneAllowanceFeePerWeek: "",
  mobilePhoneAllowanceTerms: "", mobilePhoneAllowanceBudgetCode: "",
  mobilePhoneAllowancePayableInPrep: false, mobilePhoneAllowancePayableInShoot: true, mobilePhoneAllowancePayableInWrap: false,

  vehicleAllowance: false, vehicleAllowanceTag: "", vehicleAllowanceFeePerWeek: "",
  vehicleAllowanceTerms: "", vehicleAllowanceBudgetCode: "",
  vehicleAllowancePayableInPrep: false, vehicleAllowancePayableInShoot: true, vehicleAllowancePayableInWrap: false,

  vehicleHire: false, vehicleHireTag: "", vehicleHireRate: "",
  vehicleHireTerms: "", vehicleHireBudgetCode: "",
  vehicleHirePayableInPrep: false, vehicleHirePayableInShoot: true, vehicleHirePayableInWrap: false,

  perDiem1: false, perDiem1Tag: "", perDiem1Currency: "GBP", perDiem1ShootDayRate: "",
  perDiem1NonShootDayRate: "", perDiem1Terms: "", perDiem1BudgetCode: "",
  perDiem1PayableInPrep: false, perDiem1PayableInShoot: true, perDiem1PayableInWrap: false,

  perDiem2: false, perDiem2Tag: "", perDiem2Currency: "USD", perDiem2ShootDayRate: "",
  perDiem2NonShootDayRate: "", perDiem2Terms: "", perDiem2BudgetCode: "",
  perDiem2PayableInPrep: false, perDiem2PayableInShoot: true, perDiem2PayableInWrap: false,

  livingAllowance: false, livingAllowanceTag: "", livingAllowanceCurrency: "GBP",
  livingAllowanceDailyRate: "", livingAllowanceWeeklyRate: "",
  livingAllowanceTerms: "", livingAllowanceBudgetCode: "",
  livingAllowancePayableInPrep: false, livingAllowancePayableInShoot: true, livingAllowancePayableInWrap: false,
});

const createDefaultRole = (index) => ({
  id: Date.now().toString() + index,
  isPrimaryRole: index === 0,
  roleName: `ROLE ${index + 1}`,
  jobTitle: "", jobTitleSuffix: "",
  searchAllDepartments: false, createOwnJobTitle: false,
  unit: "", department: "", subDepartment: "", regularSiteOfWork: "",
  engagementType: "", rateType: "DAILY", currency: "GBP",
  feePerDay: "", feePerWeek: "",
  startDate: "", endDate: "", workingWeek: "",
  workingInUnitedKingdom: "YES", budgetCode: "",
  allowances: getDefaultAllowances(),
  specialDayRates: SPECIAL_DAY_TYPES.map((d) => ({ type: d.key, amount: "", unit: "DAILY" })),
});

// ─── Utilities ────────────────────────────────────────────────────────────────

const cn = (...cls) => cls.filter(Boolean).join(" ");

const getCurrencySymbol = (c) => ({ GBP: "£", USD: "$", EUR: "€" }[c] || "£");

const getBundleForms = (rateType, engagementType) => {
  if (!rateType || !engagementType) return null;
  return BUNDLE_CONFIG[`${rateType}_${engagementType}`] ?? null;
};

// ─── Reusable UI ──────────────────────────────────────────────────────────────

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

const PayableInCheckboxes = ({ label, prep, shoot, wrap, onPrepChange, onShootChange, onWrapChange }) => (
  <FormField label={label || "Payable In"}>
    <div className="flex gap-4 pt-1">
      {[["PREP", prep, onPrepChange], ["SHOOT", shoot, onShootChange], ["WRAP", wrap, onWrapChange]].map(([name, checked, onChange]) => (
        <label key={name} className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={onChange} />
          <span className="text-xs font-medium">{name}</span>
        </label>
      ))}
    </div>
  </FormField>
);

const SliderCurrencyInput = ({ label, value, onChange, currency = "GBP", required, min = 0, max = 5000, step = 50 }) => {
  const sym = getCurrencySymbol(currency);
  const num = parseFloat(value) || 0;
  const pct = Math.min((num / max) * 100, 100);
  return (
    <FormField label={label} required={required}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{sym}</span>
          <Input
            type="number" step="0.01" value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00" className="w-28"
          />
          <span className="text-xs text-muted-foreground">
            {sym}{num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{sym}0</span>
          <input
            type="range" min={min} max={max} step={step} value={num}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-1.5 rounded-full cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <span className="text-[10px] text-muted-foreground">{sym}{max.toLocaleString()}</span>
        </div>
      </div>
    </FormField>
  );
};

const SectionHeader = ({ title, icon: Icon, section, isOpen, onToggle }) => (
  <button
    onClick={() => onToggle(section)}
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

// Allowance row with table summary + editable budget code & tag (both hidden in print)
const AllowanceTableSection = ({
  title, icon: Icon, isEnabled, onToggle,
  tag, onTagChange, budgetCode, onBudgetCodeChange,
  rateValue, grossValue, currency, children,
}) => {
  const sym = getCurrencySymbol(currency);
  return (
    <div className={cn("rounded-lg border transition-all", isEnabled ? "border-primary/30 bg-primary/5" : "border-border bg-card")}>
      <div className="flex items-center gap-3 p-3">
        <Checkbox checked={isEnabled} onCheckedChange={onToggle} className="w-5 h-5" />
        <Icon className={cn("w-4 h-4", isEnabled ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-sm font-bold uppercase", isEnabled ? "text-primary" : "text-muted-foreground")}>{title}</span>
        {isEnabled && <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary text-[10px]">ENABLED</Badge>}
      </div>
      {isEnabled && (
        <div className="border-t border-primary/10">
          {/* Summary table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/5">
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Item</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Rate</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Hol.</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Gross</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70 print-hide">Budget Code</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70 print-hide">Tag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-medium uppercase">{title}</td>
                  <td className="p-2 text-muted-foreground">{rateValue ? `${sym}${parseFloat(rateValue).toFixed(2)}` : "—"}</td>
                  <td className="p-2 text-muted-foreground">—</td>
                  <td className="p-2 font-semibold">{grossValue ? `${sym}${parseFloat(grossValue).toFixed(2)}` : "—"}</td>
                  <td className="p-2 print-hide">
                    <Input
                      value={budgetCode} onChange={(e) => onBudgetCodeChange(e.target.value.toUpperCase())}
                      placeholder="847-13-001" className="h-7 text-xs uppercase w-32"
                    />
                  </td>
                  <td className="p-2 print-hide">
                    <Input
                      value={tag} onChange={(e) => onTagChange(e.target.value.toUpperCase())}
                      placeholder="E.G. TRANSPORT" className="h-7 text-xs uppercase w-28"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Detail fields */}
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Contracts Inner Tab ──────────────────────────────────────────────────────

const ContractsTab = ({ role, updateRole, formData, setFormData }) => {
  const bundleForms = getBundleForms(role.rateType, role.engagementType);
  const bundleLabel = role.rateType && role.engagementType
    ? `${role.rateType} ${role.engagementType.replace("_", " ")}`
    : null;

  return (
    <div className="space-y-5">
      {/* 3-field row */}
      <Card className="border shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase">Contract Configuration</span>
            <Badge variant="outline" className="ml-auto text-[10px] text-muted-foreground border-muted-foreground/30">
              Decides bundle
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Rate Type" required>
              <SelectField
                value={role.rateType}
                onChange={(v) => updateRole(role.id, { rateType: v })}
                options={RATE_TYPES}
              />
            </FormField>
            <FormField label="Engagement Type" required>
              <SelectField
                value={role.engagementType}
                onChange={(v) => updateRole(role.id, { engagementType: v })}
                options={ENGAGEMENT_TYPES}
              />
            </FormField>
            <FormField label="Alternate Contract Type">
              <SelectField
                value={formData.alternativeContractType}
                onChange={(v) => setFormData({ ...formData, alternativeContractType: v })}
                options={CONTRACT_OPTIONS}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Template Bundle */}
      <Card className="border shadow-none overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-primary/5 border-b border-primary/10">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-primary uppercase tracking-wide">Attached Template Bundle</span>
          {bundleLabel && bundleForms && (
            <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[10px]">{bundleLabel}</Badge>
          )}
        </div>
        <CardContent className="p-4">
          {!role.rateType || !role.engagementType ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Select a <strong>Rate Type</strong> and <strong>Engagement Type</strong> above to load the template bundle.
              </p>
            </div>
          ) : bundleForms ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bundleForms.map((doc, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-bold uppercase text-center leading-tight">{doc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">
                  No template bundle configured for{" "}
                  <span className="text-primary">{bundleLabel}</span>.
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Configure in{" "}
                  <span className="text-primary font-medium cursor-pointer hover:underline">Settings</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CreateOffer() {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    recipient: true, taxStatus: true, roles: true, notes: true,
  });

  const [formData, setFormData] = useState({
    fullName: "", emailAddress: "", mobileNumber: "",
    isViaAgent: false, agentName: "", agentEmailAddress: "",
    alternativeContractType: "",
    allowAsSelfEmployedOrLoanOut: "",
    statusDeterminationReason: "", otherStatusDeterminationReason: "",
    otherDealProvisions: "", additionalNotes: "", isLivingInUk: true,
  });

  const [roles, setRoles] = useState([createDefaultRole(0)]);
  const [activeRoleTab, setActiveRoleTab] = useState(roles[0].id);
  const [roleInnerTab, setRoleInnerTab] = useState({});

  const getInnerTab = (id) => roleInnerTab[id] || "details";
  const setInnerTab = (id, tab) => setRoleInnerTab((p) => ({ ...p, [id]: tab }));

  const toggleSection = (s) => setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  const addRole = () => {
    const r = createDefaultRole(roles.length);
    setRoles([...roles, r]);
    setActiveRoleTab(r.id);
  };

  const removeRole = (id) => {
    if (roles.length <= 1) return;
    const next = roles.filter((r) => r.id !== id);
    if (activeRoleTab === id) setActiveRoleTab(next[0].id);
    setRoles(next);
  };

  const updateRole = (id, updates) =>
    setRoles(roles.map((r) => r.id === id ? { ...r, ...updates } : r));

  const updateRoleAllowances = (id, updates) =>
    setRoles(roles.map((r) =>
      r.id === id ? { ...r, allowances: { ...r.allowances, ...updates } } : r
    ));

  const updateSpecialDayRate = (roleId, type, amount) =>
    setRoles(roles.map((r) =>
      r.id === roleId
        ? { ...r, specialDayRates: r.specialDayRates.map((d) => d.type === type ? { ...d, amount } : d) }
        : r
    ));

  const handleSave = async () => {
    if (!formData.fullName || !formData.emailAddress) {
      toast.error("Missing Information", { description: "Please fill in the recipient's name and email address." });
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Offer Saved", { description: "Saved as draft." });
      navigate(`/projects/${projectName}/onboarding`);
    } catch { toast.error("Error", { description: "Failed to save." }); }
    finally { setIsSaving(false); }
  };

  const handleSend = async () => {
    if (!formData.fullName || !formData.emailAddress) {
      toast.error("Missing Information", { description: "Please fill in required fields." });
      return;
    }
    const pr = roles.find((r) => r.isPrimaryRole) || roles[0];
    if (!pr?.engagementType) {
      toast.error("Missing Information", { description: "Please select an Engagement Type." });
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setShowSuccessModal(true);
      setTimeout(() => { setShowSuccessModal(false); navigate(`/projects/${projectName}/onboarding`); }, 3000);
    } catch { toast.error("Error", { description: "Failed to send." }); }
    finally { setIsSaving(false); }
  };

  const primaryRole = roles.find((r) => r.isPrimaryRole);

  const PDFPreview = () => (
    <div className="bg-white text-black p-8 min-h-[800px]" style={{ fontFamily: "Georgia, serif" }}>
      <div className="border-b-4 border-primary pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-wider">EAARTH PRODUCTIONS</h1>
            <p className="text-sm text-gray-600 mt-1">CREW OFFER LETTER</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
            <p>Reference: OFFER-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b pb-2 mb-4">RECIPIENT DETAILS</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>Full Name:</b> {formData.fullName || "—"}</div>
          <div><b>Email:</b> {formData.emailAddress || "—"}</div>
          <div><b>Mobile:</b> {formData.mobileNumber || "—"}</div>
          <div><b>Contract Type:</b> {formData.alternativeContractType || "Standard"}</div>
        </div>
      </section>
      {roles.map((role, idx) => (
        <section key={role.id} className="mb-6">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">
            ROLE {idx + 1}{role.isPrimaryRole ? " (PRIMARY)" : ""}: {role.jobTitle || "UNTITLED"}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><b>Department:</b> {role.department || "—"}</div>
            <div><b>Engagement:</b> {role.engagementType || "—"}</div>
            <div><b>Rate Type:</b> {role.rateType || "—"}</div>
            <div><b>Start:</b> {role.startDate || "TBC"}</div>
            <div><b>End:</b> {role.endDate || "TBC"}</div>
            <div><b>Fee Per Day:</b> {getCurrencySymbol(role.currency)}{role.feePerDay || "0.00"}</div>
          </div>
        </section>
      ))}
    </div>
  );

  const INNER_TABS = [
    { key: "details", label: "Role Details" },
    { key: "contracts", label: "Contracts" },
    { key: "allowances", label: "Allowances" },
  ];

  return (
    <>
      <style>{`@media print { .print-hide { display: none !important; } }`}</style>

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
                  {formData.fullName || "New Recipient"}{primaryRole?.jobTitle && ` — ${primaryRole.jobTitle}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="gap-2">
                <Eye className="w-4 h-4" /> Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button size="sm" onClick={handleSend} disabled={isSaving} className="gap-2 bg-primary">
                <Send className="w-4 h-4" /> Send Offer
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto space-y-4">

          {/* ── Recipient ── */}
          <Card className="border-0 shadow-sm py-0 overflow-hidden">
            <SectionHeader title="Recipient" icon={User} section="recipient" isOpen={expandedSections.recipient} onToggle={toggleSection} />
            {expandedSections.recipient && (
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="Full Name" required>
                    <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })} placeholder="ENTER FULL NAME" className="uppercase" />
                  </FormField>
                  <FormField label="Email" required tooltip="Preferred email for engine account">
                    <Input type="email" value={formData.emailAddress} onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value.toLowerCase() })} placeholder="email@example.com" />
                  </FormField>
                  <FormField label="Mobile Number">
                    <Input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} placeholder="+44 7XXX XXXXXX" />
                  </FormField>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox id="isViaAgent" checked={formData.isViaAgent} onCheckedChange={(v) => setFormData({ ...formData, isViaAgent: v })} />
                  <Label htmlFor="isViaAgent" className="text-sm font-medium cursor-pointer">Recipient is represented via an agent?</Label>
                </div>

                {formData.isViaAgent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <FormField label="Agent Name">
                      <Input value={formData.agentName} onChange={(e) => setFormData({ ...formData, agentName: e.target.value.toUpperCase() })} placeholder="AGENT'S FULL NAME" className="uppercase" />
                    </FormField>
                    <FormField label="Agent Email Address">
                      <Input type="email" value={formData.agentEmailAddress} onChange={(e) => setFormData({ ...formData, agentEmailAddress: e.target.value.toLowerCase() })} placeholder="agent@example.com" />
                    </FormField>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* ── Tax Status ── */}
          <Card className="border-0 py-0 shadow-sm overflow-hidden">
            <SectionHeader title="Tax Status" icon={Briefcase} section="taxStatus" isOpen={expandedSections.taxStatus} onToggle={toggleSection} />
            {expandedSections.taxStatus && (
              <CardContent className="p-4 space-y-4">
                <FormField label="Allow as Self-Employed or Loan Out?">
                  <div className="flex gap-6 pt-2">
                    {["YES", "NO"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="selfEmployed" value={opt}
                          checked={formData.allowAsSelfEmployedOrLoanOut === opt}
                          onChange={(e) => setFormData({ ...formData, allowAsSelfEmployedOrLoanOut: e.target.value })}
                          className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </FormField>

                {formData.allowAsSelfEmployedOrLoanOut === "YES" && (
                  <FormField label="Status Determination Reason">
                    <SelectField value={formData.statusDeterminationReason}
                      onChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}
                      options={STATUS_REASONS} />
                  </FormField>
                )}

                {formData.statusDeterminationReason === "OTHER" && (
                  <FormField label="Please Specify Other Reason">
                    <Input value={formData.otherStatusDeterminationReason}
                      onChange={(e) => setFormData({ ...formData, otherStatusDeterminationReason: e.target.value.toUpperCase() })}
                      placeholder="ENTER REASON" className="uppercase" />
                  </FormField>
                )}

                <FormField label="Working in the UK?" required>
                  <div className="flex gap-6 pt-2">
                    {["YES", "NEVER"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="workingInUK" value={opt}
                          checked={formData.isLivingInUk === (opt === "YES")}
                          onChange={() => setFormData({ ...formData, isLivingInUk: opt === "YES" })}
                          className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
              </CardContent>
            )}
          </Card>

          {/* ── Roles & Rates ── */}
          <Card className="border-0 py-0 shadow-sm overflow-hidden">
            <SectionHeader title="Roles & Rates" icon={DollarSign} section="roles" isOpen={expandedSections.roles} onToggle={toggleSection} />
            {expandedSections.roles && (
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Configure one or more roles for this offer</p>

                <Tabs value={activeRoleTab} onValueChange={setActiveRoleTab}>
                  <div className="flex items-center gap-2 mb-4">
                    <TabsList className="h-auto p-0 bg-transparent gap-1">
                      {roles.map((role) => (
                        <TabsTrigger key={role.id} value={role.id} className="gap-2 data-[state=active]:bg-muted">
                          {role.isPrimaryRole && (
                            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary px-2 py-0">PRIMARY</Badge>
                          )}
                          <span className="text-sm">{role.roleName}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Button variant="outline" size="sm" onClick={addRole} className="gap-1.5 ml-auto">
                      <Plus className="w-4 h-4" /> Add Role
                    </Button>
                  </div>

                  {roles.map((role) => (
                    <TabsContent key={role.id} value={role.id} className="space-y-4">
                      {roles.length > 1 && !role.isPrimaryRole && (
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm" className="text-destructive gap-2" onClick={() => removeRole(role.id)}>
                            <Trash2 className="w-4 h-4" /> Remove This Role
                          </Button>
                        </div>
                      )}

                      {/* Inner tabs: Role Details | Contracts | Allowances */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex border-b bg-muted/30">
                          {INNER_TABS.map(({ key, label }) => (
                            <button key={key} onClick={() => setInnerTab(role.id, key)}
                              className={cn(
                                "px-5 py-2.5 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors",
                                getInnerTab(role.id) === key
                                  ? "border-primary text-primary bg-primary/5"
                                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}>
                              {label}
                            </button>
                          ))}
                        </div>

                        <div className="p-4">

                          {/* ── DETAILS TAB ── */}
                          {getInnerTab(role.id) === "details" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField label="Unit" required>
                                  <Input value={role.unit} onChange={(e) => updateRole(role.id, { unit: e.target.value.toUpperCase() })} placeholder="E.G., MAIN, SECOND UNIT" className="uppercase" />
                                </FormField>
                                <FormField label="Department" required>
                                  <SelectField value={role.department} onChange={(v) => updateRole(role.id, { department: v })}
                                    options={[{ value: "", label: "SELECT DEPARTMENT..." }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
                                </FormField>
                                <FormField label="Sub-Department">
                                  <Input value={role.subDepartment} onChange={(e) => updateRole(role.id, { subDepartment: e.target.value.toUpperCase() })} placeholder="OPTIONAL" className="uppercase" />
                                </FormField>
                              </div>

                              <FormField label="Job Title" required>
                                <Input value={role.jobTitle} onChange={(e) => updateRole(role.id, { jobTitle: e.target.value.toUpperCase() })} placeholder="TYPE TO SEARCH..." className="uppercase" />
                              </FormField>

                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Checkbox id={`searchAll-${role.id}`} checked={role.searchAllDepartments}
                                    onCheckedChange={(v) => updateRole(role.id, { searchAllDepartments: v })} />
                                  <Label htmlFor={`searchAll-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                                    Search job titles from all departments?
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id={`ownTitle-${role.id}`} checked={role.createOwnJobTitle}
                                    onCheckedChange={(v) => updateRole(role.id, { createOwnJobTitle: v })} />
                                  <Label htmlFor={`ownTitle-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                                    Create your own job title (only available to this project)
                                  </Label>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Job Title Suffix">
                                  <Input value={role.jobTitleSuffix} onChange={(e) => updateRole(role.id, { jobTitleSuffix: e.target.value.toUpperCase() })} placeholder="E.G., 'TO CAST #1'" className="uppercase" />
                                </FormField>
                                <FormField label="Regular Site of Work (On Shoot Days)" required>
                                  <Input value={role.regularSiteOfWork} onChange={(e) => updateRole(role.id, { regularSiteOfWork: e.target.value.toUpperCase() })} placeholder="E.G., VARIOUS LOCATIONS" className="uppercase" />
                                </FormField>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField label="Start Date" required>
                                  <Input type="date" value={role.startDate} onChange={(e) => updateRole(role.id, { startDate: e.target.value })} />
                                </FormField>
                                <FormField label="End Date">
                                  <Input type="date" value={role.endDate} onChange={(e) => updateRole(role.id, { endDate: e.target.value })} />
                                </FormField>
                                <FormField label="Working Week">
                                  <SelectField value={role.workingWeek} onChange={(v) => updateRole(role.id, { workingWeek: v })}
                                    options={[
                                      { value: "", label: "SELECT..." },
                                      { value: "5_DAYS", label: "5 DAYS" },
                                      { value: "5.5_DAYS", label: "5.5 DAYS" },
                                      { value: "5_6_DAYS", label: "5/6 DAYS" },
                                      { value: "6_DAYS", label: "6 DAYS" },
                                    ]} />
                                </FormField>
                              </div>

                              {/* Fee section — sliders only, no Rate & Compensation block */}
                              <div className="border rounded-lg p-4 bg-primary/5 space-y-5">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-primary" />
                                  <h4 className="text-sm font-bold text-primary uppercase">Fee</h4>
                                </div>
                                <FormField label="Currency" required>
                                  <SelectField value={role.currency} onChange={(v) => updateRole(role.id, { currency: v })} options={CURRENCIES} className="w-48" />
                                </FormField>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <SliderCurrencyInput
                                    label="Fee Per Day Including Holiday"
                                    value={role.feePerDay} onChange={(v) => updateRole(role.id, { feePerDay: v })}
                                    currency={role.currency} min={0} max={5000} step={50} required
                                  />
                                  <SliderCurrencyInput
                                    label="Fee Per Week Including Holiday"
                                    value={role.feePerWeek} onChange={(v) => updateRole(role.id, { feePerWeek: v })}
                                    currency={role.currency} min={0} max={25000} step={250}
                                  />
                                </div>

                                {/* Special Day Rates */}
                                <div className="pt-4 border-t space-y-3">
                                  <h5 className="text-xs font-bold text-primary uppercase">Special Day Rates</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SPECIAL_DAY_TYPES.map((day) => {
                                      const dr = role.specialDayRates.find((d) => d.type === day.key);
                                      return (
                                        <SliderCurrencyInput key={day.key} label={day.label}
                                          value={dr?.amount || ""} onChange={(v) => updateSpecialDayRate(role.id, day.key, v)}
                                          currency={role.currency} min={0} max={5000} step={50} />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── CONTRACTS TAB ── */}
                          {getInnerTab(role.id) === "contracts" && (
                            <ContractsTab role={role} updateRole={updateRole} formData={formData} setFormData={setFormData} />
                          )}

                          {/* ── ALLOWANCES TAB ── */}
                          {getInnerTab(role.id) === "allowances" && (
                            <div className="space-y-3">
                              <p className="text-xs text-muted-foreground">
                                Enable allowances below. <strong>Budget Code</strong> and <strong>Tag</strong> are editable and hidden from print. All other financial data is read-only in the table.
                              </p>

                              {/* Box Rental */}
                              <AllowanceTableSection title="Box Rental" icon={Package}
                                isEnabled={role.allowances.boxRental} onToggle={(v) => updateRoleAllowances(role.id, { boxRental: v })}
                                tag={role.allowances.boxRentalTag} onTagChange={(v) => updateRoleAllowances(role.id, { boxRentalTag: v })}
                                budgetCode={role.allowances.boxRentalBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { boxRentalBudgetCode: v })}
                                rateValue={role.allowances.boxRentalFeePerWeek} grossValue={role.allowances.boxRentalFeePerWeek} currency={role.currency}>
                                <FormField label="Description" className="lg:col-span-2">
                                  <Input value={role.allowances.boxRentalDescription}
                                    onChange={(e) => updateRoleAllowances(role.id, { boxRentalDescription: e.target.value.toUpperCase() })}
                                    placeholder="DESCRIPTION OF BOX RENTAL ITEMS" className="uppercase" />
                                </FormField>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.boxRentalFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { boxRentalFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Cap Calculated As">
                                  <SelectField value={role.allowances.boxRentalCapCalculatedAs}
                                    onChange={(v) => updateRoleAllowances(role.id, { boxRentalCapCalculatedAs: v })} options={CAP_TYPES} />
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.boxRentalTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { boxRentalTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.boxRentalPayableInPrep} shoot={role.allowances.boxRentalPayableInShoot} wrap={role.allowances.boxRentalPayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { boxRentalPayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Computer Allowance */}
                              <AllowanceTableSection title="Computer Allowance" icon={Laptop}
                                isEnabled={role.allowances.computerAllowance} onToggle={(v) => updateRoleAllowances(role.id, { computerAllowance: v })}
                                tag={role.allowances.computerAllowanceTag} onTagChange={(v) => updateRoleAllowances(role.id, { computerAllowanceTag: v })}
                                budgetCode={role.allowances.computerAllowanceBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { computerAllowanceBudgetCode: v })}
                                rateValue={role.allowances.computerAllowanceFeePerWeek} grossValue={role.allowances.computerAllowanceFeePerWeek} currency={role.currency}>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.computerAllowanceFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { computerAllowanceFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Cap Calculated As">
                                  <SelectField value={role.allowances.computerAllowanceCapCalculatedAs}
                                    onChange={(v) => updateRoleAllowances(role.id, { computerAllowanceCapCalculatedAs: v })} options={CAP_TYPES} />
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.computerAllowanceTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { computerAllowanceTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.computerAllowancePayableInPrep} shoot={role.allowances.computerAllowancePayableInShoot} wrap={role.allowances.computerAllowancePayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { computerAllowancePayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Software Allowance */}
                              <AllowanceTableSection title="Software Allowance" icon={Code}
                                isEnabled={role.allowances.softwareAllowance} onToggle={(v) => updateRoleAllowances(role.id, { softwareAllowance: v })}
                                tag={role.allowances.softwareAllowanceTag} onTagChange={(v) => updateRoleAllowances(role.id, { softwareAllowanceTag: v })}
                                budgetCode={role.allowances.softwareAllowanceBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { softwareAllowanceBudgetCode: v })}
                                rateValue={role.allowances.softwareAllowanceFeePerWeek} grossValue={role.allowances.softwareAllowanceFeePerWeek} currency={role.currency}>
                                <FormField label="Software Description">
                                  <Input value={role.allowances.softwareAllowanceDescription}
                                    onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceDescription: e.target.value.toUpperCase() })}
                                    placeholder="SOFTWARE DESCRIPTION" className="uppercase" />
                                </FormField>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.softwareAllowanceFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.softwareAllowanceTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { softwareAllowanceTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.softwareAllowancePayableInPrep} shoot={role.allowances.softwareAllowancePayableInShoot} wrap={role.allowances.softwareAllowancePayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { softwareAllowancePayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Equipment Rental */}
                              <AllowanceTableSection title="Equipment Rental" icon={Camera}
                                isEnabled={role.allowances.equipmentRental} onToggle={(v) => updateRoleAllowances(role.id, { equipmentRental: v })}
                                tag={role.allowances.equipmentRentalTag} onTagChange={(v) => updateRoleAllowances(role.id, { equipmentRentalTag: v })}
                                budgetCode={role.allowances.equipmentRentalBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { equipmentRentalBudgetCode: v })}
                                rateValue={role.allowances.equipmentRentalFeePerWeek} grossValue={role.allowances.equipmentRentalFeePerWeek} currency={role.currency}>
                                <FormField label="Equipment Description">
                                  <Input value={role.allowances.equipmentRentalDescription}
                                    onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalDescription: e.target.value.toUpperCase() })}
                                    placeholder="EQUIPMENT DESCRIPTION" className="uppercase" />
                                </FormField>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.equipmentRentalFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.equipmentRentalTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { equipmentRentalTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.equipmentRentalPayableInPrep} shoot={role.allowances.equipmentRentalPayableInShoot} wrap={role.allowances.equipmentRentalPayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { equipmentRentalPayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Mobile Phone */}
                              <AllowanceTableSection title="Mobile Phone Allowance" icon={Smartphone}
                                isEnabled={role.allowances.mobilePhoneAllowance} onToggle={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowance: v })}
                                tag={role.allowances.mobilePhoneAllowanceTag} onTagChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowanceTag: v })}
                                budgetCode={role.allowances.mobilePhoneAllowanceBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowanceBudgetCode: v })}
                                rateValue={role.allowances.mobilePhoneAllowanceFeePerWeek} grossValue={role.allowances.mobilePhoneAllowanceFeePerWeek} currency={role.currency}>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.mobilePhoneAllowanceFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { mobilePhoneAllowanceFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.mobilePhoneAllowanceTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { mobilePhoneAllowanceTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.mobilePhoneAllowancePayableInPrep} shoot={role.allowances.mobilePhoneAllowancePayableInShoot} wrap={role.allowances.mobilePhoneAllowancePayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { mobilePhoneAllowancePayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Vehicle Allowance */}
                              <AllowanceTableSection title="Vehicle Allowance" icon={Car}
                                isEnabled={role.allowances.vehicleAllowance} onToggle={(v) => updateRoleAllowances(role.id, { vehicleAllowance: v })}
                                tag={role.allowances.vehicleAllowanceTag} onTagChange={(v) => updateRoleAllowances(role.id, { vehicleAllowanceTag: v })}
                                budgetCode={role.allowances.vehicleAllowanceBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { vehicleAllowanceBudgetCode: v })}
                                rateValue={role.allowances.vehicleAllowanceFeePerWeek} grossValue={role.allowances.vehicleAllowanceFeePerWeek} currency={role.currency}>
                                <FormField label="Fee Per Week">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.vehicleAllowanceFeePerWeek}
                                      onChange={(e) => updateRoleAllowances(role.id, { vehicleAllowanceFeePerWeek: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.vehicleAllowanceTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { vehicleAllowanceTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.vehicleAllowancePayableInPrep} shoot={role.allowances.vehicleAllowancePayableInShoot} wrap={role.allowances.vehicleAllowancePayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { vehicleAllowancePayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Per Diem 1 */}
                              <AllowanceTableSection title="Per Diem 1" icon={Coffee}
                                isEnabled={role.allowances.perDiem1} onToggle={(v) => updateRoleAllowances(role.id, { perDiem1: v })}
                                tag={role.allowances.perDiem1Tag} onTagChange={(v) => updateRoleAllowances(role.id, { perDiem1Tag: v })}
                                budgetCode={role.allowances.perDiem1BudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { perDiem1BudgetCode: v })}
                                rateValue={role.allowances.perDiem1ShootDayRate} grossValue={role.allowances.perDiem1ShootDayRate} currency={role.allowances.perDiem1Currency}>
                                <FormField label="Currency">
                                  <SelectField value={role.allowances.perDiem1Currency}
                                    onChange={(v) => updateRoleAllowances(role.id, { perDiem1Currency: v })} options={CURRENCIES} />
                                </FormField>
                                <FormField label="Shoot Day Rate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.allowances.perDiem1Currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.perDiem1ShootDayRate}
                                      onChange={(e) => updateRoleAllowances(role.id, { perDiem1ShootDayRate: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Non-Shoot Day Rate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.allowances.perDiem1Currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.perDiem1NonShootDayRate}
                                      onChange={(e) => updateRoleAllowances(role.id, { perDiem1NonShootDayRate: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.perDiem1Terms}
                                    onChange={(e) => updateRoleAllowances(role.id, { perDiem1Terms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.perDiem1PayableInPrep} shoot={role.allowances.perDiem1PayableInShoot} wrap={role.allowances.perDiem1PayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { perDiem1PayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Per Diem 2 */}
                              <AllowanceTableSection title="Per Diem 2" icon={Coffee}
                                isEnabled={role.allowances.perDiem2} onToggle={(v) => updateRoleAllowances(role.id, { perDiem2: v })}
                                tag={role.allowances.perDiem2Tag} onTagChange={(v) => updateRoleAllowances(role.id, { perDiem2Tag: v })}
                                budgetCode={role.allowances.perDiem2BudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { perDiem2BudgetCode: v })}
                                rateValue={role.allowances.perDiem2ShootDayRate} grossValue={role.allowances.perDiem2ShootDayRate} currency={role.allowances.perDiem2Currency}>
                                <FormField label="Currency">
                                  <SelectField value={role.allowances.perDiem2Currency}
                                    onChange={(v) => updateRoleAllowances(role.id, { perDiem2Currency: v })} options={CURRENCIES} />
                                </FormField>
                                <FormField label="Shoot Day Rate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.allowances.perDiem2Currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.perDiem2ShootDayRate}
                                      onChange={(e) => updateRoleAllowances(role.id, { perDiem2ShootDayRate: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Non-Shoot Day Rate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.allowances.perDiem2Currency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.perDiem2NonShootDayRate}
                                      onChange={(e) => updateRoleAllowances(role.id, { perDiem2NonShootDayRate: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.perDiem2Terms}
                                    onChange={(e) => updateRoleAllowances(role.id, { perDiem2Terms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.perDiem2PayableInPrep} shoot={role.allowances.perDiem2PayableInShoot} wrap={role.allowances.perDiem2PayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { perDiem2PayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { perDiem2PayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { perDiem2PayableInWrap: v })} />
                              </AllowanceTableSection>

                              {/* Living Allowance */}
                              <AllowanceTableSection title="Living Allowance" icon={Home}
                                isEnabled={role.allowances.livingAllowance} onToggle={(v) => updateRoleAllowances(role.id, { livingAllowance: v })}
                                tag={role.allowances.livingAllowanceTag} onTagChange={(v) => updateRoleAllowances(role.id, { livingAllowanceTag: v })}
                                budgetCode={role.allowances.livingAllowanceBudgetCode} onBudgetCodeChange={(v) => updateRoleAllowances(role.id, { livingAllowanceBudgetCode: v })}
                                rateValue={role.allowances.livingAllowanceWeeklyRate} grossValue={role.allowances.livingAllowanceWeeklyRate} currency={role.allowances.livingAllowanceCurrency}>
                                <FormField label="Currency">
                                  <SelectField value={role.allowances.livingAllowanceCurrency}
                                    onChange={(v) => updateRoleAllowances(role.id, { livingAllowanceCurrency: v })} options={CURRENCIES} />
                                </FormField>
                                <FormField label="Weekly Rate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">{getCurrencySymbol(role.allowances.livingAllowanceCurrency)}</span>
                                    <Input type="number" step="0.01" value={role.allowances.livingAllowanceWeeklyRate}
                                      onChange={(e) => updateRoleAllowances(role.id, { livingAllowanceWeeklyRate: e.target.value })} placeholder="0.00" />
                                  </div>
                                </FormField>
                                <FormField label="Terms">
                                  <Input value={role.allowances.livingAllowanceTerms}
                                    onChange={(e) => updateRoleAllowances(role.id, { livingAllowanceTerms: e.target.value.toUpperCase() })}
                                    placeholder="TERMS" className="uppercase" />
                                </FormField>
                                <PayableInCheckboxes
                                  prep={role.allowances.livingAllowancePayableInPrep} shoot={role.allowances.livingAllowancePayableInShoot} wrap={role.allowances.livingAllowancePayableInWrap}
                                  onPrepChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInPrep: v })}
                                  onShootChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInShoot: v })}
                                  onWrapChange={(v) => updateRoleAllowances(role.id, { livingAllowancePayableInWrap: v })} />
                              </AllowanceTableSection>
                            </div>
                          )}

                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            )}
          </Card>

          {/* ── Additional Notes ── */}
          <Card className="border-0 py-0 shadow-sm overflow-hidden">
            <SectionHeader title="Additional Notes" icon={Bell} section="notes" isOpen={expandedSections.notes} onToggle={toggleSection} />
            {expandedSections.notes && (
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Other Deal Provisions">
                    <textarea value={formData.otherDealProvisions}
                      onChange={(e) => setFormData({ ...formData, otherDealProvisions: e.target.value })}
                      placeholder="Enter any additional provisions..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
                  </FormField>
                  <FormField label="Additional Notes">
                    <textarea value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Enter any notes for internal reference..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
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
              <DialogDescription>Tag and Budget Code are hidden in print.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]"><PDFPreview /></ScrollArea>
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
                Your offer has been sent to {formData.fullName}. They will receive an email to review and accept it.
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}