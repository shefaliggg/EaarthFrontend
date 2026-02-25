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
  { value: "GBP", label: "GBP (\u00A3)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (\u20AC)" },
];

const SPECIAL_DAY_TYPES = [
  { key: "SIXTH_DAY", label: "6th Day" },
  { key: "SEVENTH_DAY", label: "7th Day" },
  { key: "PUBLIC_HOLIDAY", label: "Public Holiday" },
  { key: "TRAVEL_DAY", label: "Travel Day" },
  { key: "TURNAROUND", label: "Turnaround" },
];

// Bundle config: rate + engagement -> template list
const SALARY_TABLE_ROWS = [
  { item: "Salary Weekly", budgetCode: "", rate: "1784.60", hol: "\u00A3215.40", gross: "\u00A32000.00" },
  { item: "Salary Daily", budgetCode: "", rate: "356.92", hol: "\u00A343.08", gross: "\u00A3400.00" },
  { item: "Salary Hourly", budgetCode: "", rate: "32.44", hol: "\u00A33.92", gross: "\u00A336.36" },
  { item: "6th Day", budgetCode: "10-001", rate: "48.67", hol: "\u00A35.87", gross: "\u00A354.54" },
  { item: "7th Day", budgetCode: "10-002", rate: "64.89", hol: "\u00A37.83", gross: "\u00A372.72" },
  { item: "Public Holiday", budgetCode: "10-003", rate: "64.89", hol: "\u00A37.83", gross: "\u00A372.72" },
  { item: "Travel Day", budgetCode: "10-004", rate: "356.92", hol: "\u00A343.08", gross: "\u00A3400.00" },
  { item: "Turnaround", budgetCode: "10-005", rate: "43.26", hol: "\u00A35.22", gross: "\u00A348.48" },
  { item: "6th day hourly (MIN 6 HOURS)", budgetCode: "10-006", rate: "48.67", hol: "\u00A35.88", gross: "\u00A354.55" },
  { item: "7th day hourly (MIN 6 HOURS)", budgetCode: "10-007", rate: "64.90", hol: "\u00A37.83", gross: "\u00A372.73" },
];
const OVERTIME_TABLE_ROWS = [
  { item: "Add Hour", budgetCode: "15-002", rate: "32.44", hol: "\u00A33.92", gross: "\u00A336.36" },
  { item: "Enhanced O/T", budgetCode: "15-003", rate: "48.67", hol: "\u00A35.87", gross: "\u00A354.54" },
  { item: "Camera O/T", budgetCode: "15-004", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Post O/T", budgetCode: "15-005", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Pre O/T", budgetCode: "15-006", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "BTA", budgetCode: "15-007", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Late Meal", budgetCode: "15-008", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Broken Meal", budgetCode: "15-009", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Travel", budgetCode: "15-010", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Dawn / Early", budgetCode: "15-011", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
  { item: "Night Pen", budgetCode: "15-012", rate: "0.00", hol: "\u00A30.00", gross: "\u00A30.00" },
];
const ALLOWANCES_TABLE_ROWS = [
  { item: "Computer", budgetCode: "20-002", value: "\u00A30.00 / \u00A3500" },
  { item: "Software", budgetCode: "20-003", value: "\u00A30.00 / \u00A3300" },
  { item: "Box Rental", budgetCode: "20-004", value: "\u00A3150.00 / \u00A3500" },
  { item: "Equipment", budgetCode: "20-005", value: "\u00A30.00 / \u00A3750" },
  { item: "Vehicle", budgetCode: "20-006", value: "\u00A30.00 / \u00A31000" },
  { item: "Mobile", budgetCode: "20-007", value: "\u00A35.00 / \u00A345.00" },
  { item: "Living", budgetCode: "20-008", value: "\u00A30.00 / \u00A3800" },
  { item: "Per Diem Shoot Rate", budgetCode: "20-009", value: "\u00A350.00 / \u00A3350.00" },
  { item: "Per Diem Non Shoot Rate", budgetCode: "20-010", value: "\u00A325.00 / \u00A3150.00" },
  { item: "Breakfast", budgetCode: "20-011", value: "\u00A315.00 / \u00A385.00" },
  { item: "Lunch", budgetCode: "20-012", value: "\u00A320.00 / \u00A3120.00" },
  { item: "Dinner", budgetCode: "20-013", value: "\u00A330.00 / \u00A3180.00" },
  { item: "Fuel", budgetCode: "20-014", value: "\u00A31.50 / \u00A3250.00" },
  { item: "Mileage", budgetCode: "20-015", value: "\u00A30.45p / \u00A3125.00" },
];

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


const cn = (...cls) => cls.filter(Boolean).join(" ");

const getCurrencySymbol = (c) => ({ GBP: "\u00A3", USD: "$", EUR: "\u20AC" }[c] || "\u00A3");

const getBundleForms = (rateType, engagementType) => {
  if (!rateType || !engagementType) return null;
  return BUNDLE_CONFIG[`${rateType}_${engagementType}`] ?? null;
};


const FormField = ({ label, required, tooltip, children, className }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className="text-sm font-medium text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
      {tooltip && <span className="font-normal text-muted-foreground ml-1 text-xs">({tooltip})</span>}
    </Label>
    {children}
  </div>
);

const SelectField = ({ value, onChange, options, className, ...props }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "flex h-8 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

const PayableInCheckboxes = ({ label, prep, shoot, wrap, onPrepChange, onShootChange, onWrapChange }) => (
  <FormField label={label || "Payable In"}>
    <div className="flex flex-wrap gap-x-3 gap-y-2 pt-1">
      {[["PREP", prep, onPrepChange], ["SHOOT", shoot, onShootChange], ["WRAP", wrap, onWrapChange]].map(([name, checked, onChange]) => (
        <label key={name} className="flex items-center gap-1.5 cursor-pointer min-w-0">
          <Checkbox checked={checked} onCheckedChange={onChange} className="h-4 w-4" />
          <span className="text-[11px] leading-none font-medium whitespace-nowrap">{name}</span>
        </label>
      ))}
    </div>
  </FormField>
);

// Allowance row with table summary + editable budget code & tag (both hidden in print)
const AllowanceTableSection = ({
  title, icon, isEnabled, onToggle, children,
}) => {
  const IconComponent = icon;
  return (
    <div className={cn("rounded-lg border transition-all bg-white", isEnabled ? "border-primary/30" : "border-border")}>
      <div className="flex items-center gap-3 p-3">
        <Checkbox checked={isEnabled} onCheckedChange={onToggle} className="w-5 h-5" />
        <IconComponent className={cn("w-4 h-4", isEnabled ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-sm font-bold uppercase", isEnabled ? "text-primary" : "text-muted-foreground")}>{title}</span>
        {isEnabled && <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary text-[10px]">ENABLED</Badge>}
      </div>
      {isEnabled && (
        <div className="border-t border-primary/10">
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};


const ContractsTab = ({ role, updateRole, formData, setFormData }) => {
  const bundleForms = getBundleForms(role.rateType, role.engagementType);
  const bundleLabel = role.rateType && role.engagementType
    ? `${role.rateType} ${role.engagementType.replace("_", " ")}`
    : null;

  return (
    <div>
      <div className="contracts-config-section">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-muted-foreground">Contract Configuration</span>
          <Badge variant="outline" className="ml-auto text-[10px] text-muted-foreground border-muted-foreground/30">Decides bundle</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Rate Type" required>
            <SelectField value={role.rateType} onChange={(v) => updateRole(role.id, { rateType: v })} options={RATE_TYPES} />
          </FormField>
          <FormField label="Engagement Type" required>
            <SelectField value={role.engagementType} onChange={(v) => updateRole(role.id, { engagementType: v })} options={ENGAGEMENT_TYPES} />
          </FormField>
          <FormField label="Alternate Contract Type" className="md:col-span-2">
            <SelectField value={formData.alternativeContractType} onChange={(v) => setFormData({ ...formData, alternativeContractType: v })} options={CONTRACT_OPTIONS} />
          </FormField>
        </div>
      </div>
      <div className="contracts-template-section mt-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-muted-foreground">Attached Template Bundle</span>
          {bundleLabel && bundleForms && (
            <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[10px]">{bundleLabel}</Badge>
          )}
        </div>
        <div>
          {!role.rateType || !role.engagementType ? (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-xs font-medium">Select a <strong>Rate Type</strong> and <strong>Engagement Type</strong> above to load the template bundle.</span>
            </div>
          ) : bundleForms ? (
            <div className="flex flex-wrap gap-2">
              {bundleForms.map((doc, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-2 rounded-lg border bg-transparent hover:border-primary/50 transition-colors cursor-pointer group flex-1 min-w-[80px] max-w-[120px]">
                  <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center mb-1 group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-center leading-tight">{doc}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div>
                <span className="text-xs font-semibold">No template bundle configured for <span className="text-primary">{bundleLabel}</span>.</span>
                <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Settings className="w-3 h-3" /> Configure in <span className="text-primary font-medium cursor-pointer hover:underline">Settings</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default function CreateOffer() {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const [feeModeByRole, setFeeModeByRole] = useState({});
  const [activePreviewField, setActivePreviewField] = useState("");

  const getFeeMode = (id) => feeModeByRole[id] || "DAY";
  const setFeeMode = (id, mode) => setFeeModeByRole((p) => ({ ...p, [id]: mode }));

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

  const primaryRole = roles.find((r) => r.isPrimaryRole) || roles[0];
  const previewRole = roles.find((r) => r.id === activeRoleTab) || primaryRole;
  const formatMoney = (value, currency = "GBP") => {
    if (value === "" || value === null || value === undefined) return "0.00";
    const n = Number(value);
    return Number.isFinite(n) ? `${getCurrencySymbol(currency)}${n.toFixed(2)}` : `${getCurrencySymbol(currency)}0.00`;
  };
  const cleanLabel = (text = "") =>
    text
      .replace(/\*/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const normalizeText = (v = "") => v.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const isFieldActive = (label) => {
    const a = normalizeText(activePreviewField);
    const b = normalizeText(label);
    return Boolean(a) && Boolean(b) && (a.includes(b) || b.includes(a));
  };
  const formatPreviewValue = (value) => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };
  const getEnabledAllowanceGroups = (allowances = {}) => {
    const groups = [
      { enabledKey: "boxRental", heading: "Box Rental", fields: [{ label: "Fee Per Week", key: "boxRentalFeePerWeek" }, { label: "Terms", key: "boxRentalTerms" }, { label: "Tag", key: "boxRentalTag" }] },
      { enabledKey: "computerAllowance", heading: "Computer Allowance", fields: [{ label: "Fee Per Week", key: "computerAllowanceFeePerWeek" }, { label: "Terms", key: "computerAllowanceTerms" }, { label: "Tag", key: "computerAllowanceTag" }] },
      { enabledKey: "softwareAllowance", heading: "Software Allowance", fields: [{ label: "Fee Per Week", key: "softwareAllowanceFeePerWeek" }, { label: "Terms", key: "softwareAllowanceTerms" }, { label: "Tag", key: "softwareAllowanceTag" }] },
      { enabledKey: "equipmentRental", heading: "Equipment Rental", fields: [{ label: "Fee Per Week", key: "equipmentRentalFeePerWeek" }, { label: "Terms", key: "equipmentRentalTerms" }, { label: "Tag", key: "equipmentRentalTag" }] },
      { enabledKey: "mobilePhoneAllowance", heading: "Mobile Phone Allowance", fields: [{ label: "Fee Per Week", key: "mobilePhoneAllowanceFeePerWeek" }, { label: "Terms", key: "mobilePhoneAllowanceTerms" }, { label: "Tag", key: "mobilePhoneAllowanceTag" }] },
      { enabledKey: "vehicleAllowance", heading: "Vehicle Allowance", fields: [{ label: "Fee Per Week", key: "vehicleAllowanceFeePerWeek" }, { label: "Terms", key: "vehicleAllowanceTerms" }, { label: "Tag", key: "vehicleAllowanceTag" }] },
      { enabledKey: "perDiem1", heading: "Per Diem 1", fields: [{ label: "Shoot Day Rate", key: "perDiem1ShootDayRate" }, { label: "Non-Shoot Day Rate", key: "perDiem1NonShootDayRate" }, { label: "Terms", key: "perDiem1Terms" }] },
      { enabledKey: "perDiem2", heading: "Per Diem 2", fields: [{ label: "Shoot Day Rate", key: "perDiem2ShootDayRate" }, { label: "Non-Shoot Day Rate", key: "perDiem2NonShootDayRate" }, { label: "Terms", key: "perDiem2Terms" }] },
      { enabledKey: "livingAllowance", heading: "Living Allowance", fields: [{ label: "Weekly Rate", key: "livingAllowanceWeeklyRate" }, { label: "Terms", key: "livingAllowanceTerms" }, { label: "Tag", key: "livingAllowanceTag" }] },
    ];
    return groups
      .filter((group) => allowances[group.enabledKey])
      .map((group) => ({
        heading: group.heading,
        entries: group.fields.map((f) => ({ label: f.label, value: allowances[f.key] })),
      }));
  };
  const getEnabledAllowanceRows = (role) => {
    const allowances = role?.allowances || {};
    const rows = [
      { enabledKey: "computerAllowance", label: "Computer", valueKey: "computerAllowanceFeePerWeek", currencyKey: "currency" },
      { enabledKey: "softwareAllowance", label: "Software", valueKey: "softwareAllowanceFeePerWeek", currencyKey: "currency" },
      { enabledKey: "boxRental", label: "Box Rental", valueKey: "boxRentalFeePerWeek", currencyKey: "currency" },
      { enabledKey: "equipmentRental", label: "Equipment", valueKey: "equipmentRentalFeePerWeek", currencyKey: "currency" },
      { enabledKey: "vehicleAllowance", label: "Vehicle", valueKey: "vehicleAllowanceFeePerWeek", currencyKey: "currency" },
      { enabledKey: "mobilePhoneAllowance", label: "Mobile", valueKey: "mobilePhoneAllowanceFeePerWeek", currencyKey: "currency" },
      { enabledKey: "livingAllowance", label: "Living", valueKey: "livingAllowanceWeeklyRate", currencyKey: "livingAllowanceCurrency" },
      { enabledKey: "perDiem1", label: "Per Diem 1", valueKey: "perDiem1ShootDayRate", currencyKey: "perDiem1Currency" },
      { enabledKey: "perDiem2", label: "Per Diem 2", valueKey: "perDiem2ShootDayRate", currencyKey: "perDiem2Currency" },
    ];
    return rows
      .filter((r) => allowances[r.enabledKey])
      .map((r) => ({
        label: r.label,
        value: allowances[r.valueKey],
        currency: r.currencyKey === "currency" ? role?.currency : allowances[r.currencyKey],
      }));
  };
  const handleSidebarFieldActivity = (event) => {
    const target = event.target;
    if (!target || !["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    const formField = target.closest(".space-y-1\\.5");
    const labelNode = formField?.querySelector("label") || target.closest("label");
    const labelText = cleanLabel(labelNode?.textContent || target.getAttribute("placeholder") || target.getAttribute("name") || "");
    if (labelText) setActivePreviewField(labelText);
  };
  const PreviewField = ({ label, value, className = "" }) => (
    <div className={cn("rounded p-1.5 bg-white", isFieldActive(label) ? "ring-1 ring-amber-300 bg-amber-50" : "", className)}>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-[11px] font-semibold break-words leading-tight">{formatPreviewValue(value)}</p>
    </div>
  );

  const PDFPreview = () => (
    <div className="rounded-2xl border border-border bg-muted/20 p-3">
      <div className="rounded-xl border border-slate-300 bg-[#fffefb] p-4 text-[11px] leading-tight text-slate-900 shadow-sm">
        <div className="relative border-b border-slate-200 bg-slate-200/70 px-2 py-2 rounded-md mb-3">
          <p className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-800 whitespace-nowrap">
            {previewRole?.rateType || "N/A"} | {previewRole?.engagementType || "N/A"} | {formData.alternativeContractType || "STANDARD"}
          </p>
          <h2 className="text-left text-lg font-semibold tracking-wide">
            CREW OFFER SUMMARY
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="rounded border p-2">
            <p className="font-semibold text-primary mb-1">Recipient</p>
            <div className="grid grid-cols-3 gap-1.5">
              <PreviewField label="Full Name" value={formData.fullName} className="col-span-3" />
              <PreviewField label="Email" value={formData.emailAddress} />
              <PreviewField label="Mobile Number" value={formData.mobileNumber} />
              <PreviewField label="Via Agent" value={formData.isViaAgent} />
            </div>
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">Agent Info</p>
              <div className="grid grid-cols-3 gap-1.5">
                <PreviewField label="Agent Name" value={formData.agentName} />
                <PreviewField label="Agent Email Address" value={formData.agentEmailAddress} className="col-span-2" />
              </div>
            </div>
          </div>
          <div className="rounded border p-2">
            <p className="font-semibold text-primary mb-1">Contracts</p>
            <div className="grid grid-cols-3 gap-1.5">
              <PreviewField label="Rate Type" value={previewRole?.rateType} />
              <PreviewField label="Engagement Type" value={previewRole?.engagementType} />
              <PreviewField label="Alternate Contract Type" value={formData.alternativeContractType} />
              <PreviewField label="Self Employed/Loan Out" value={formData.allowAsSelfEmployedOrLoanOut} />
              <PreviewField label="Status Reason" value={formData.statusDeterminationReason} />
              <PreviewField label="Other Status Reason" value={formData.otherStatusDeterminationReason} />
            </div>
          </div>
        </div>

        <div className="rounded border p-2 mb-2">
          <p className="font-semibold text-primary mb-1">Roles ({roles.length})</p>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">
            {roles.map((role) => (
              <div key={role.id} className="rounded border border-slate-200 p-2">
                <p className="text-[10px] font-semibold uppercase text-slate-700 mb-1">{role.roleName}</p>
                <p className="text-[9px] font-semibold uppercase text-primary/80 mb-1">Role Details</p>
                <div className="grid grid-cols-6 gap-1.5 mb-1.5">
                  <PreviewField label="Unit" value={role.unit} />
                  <PreviewField label="Department" value={role.department} />
                  <PreviewField label="Sub-Department" value={role.subDepartment} />
                  <PreviewField label="Job Title" value={role.jobTitle} className="col-span-2" />
                  <PreviewField label="Job Title Suffix" value={role.jobTitleSuffix} />
                  <PreviewField label="Site of Work" value={role.regularSiteOfWork} className="col-span-3" />
                  <PreviewField label="Start Date" value={role.startDate} />
                  <PreviewField label="End Date" value={role.endDate} />
                  <PreviewField label="Working Week" value={role.workingWeek} />
                </div>
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <p className="text-[9px] font-semibold uppercase text-primary/80 mb-1">Rate & Compensation</p>
                  <div className="grid grid-cols-6 gap-1.5 mb-1.5">
                    <PreviewField label="Rate Type" value={role.rateType} />
                    <PreviewField label="Currency" value={role.currency} />
                    <PreviewField label="Fee Mode" value={getFeeMode(role.id)} />
                    <PreviewField label="Fee Per Day" value={role.feePerDay} />
                    <PreviewField label="Fee Per Week" value={role.feePerWeek} />
                    <PreviewField label="Engagement Type" value={role.engagementType} />
                  </div>
                </div>
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <p className="text-[9px] font-semibold uppercase text-primary/80 mb-1">Allowances</p>
                  <div className="grid grid-cols-1 gap-1.5">
                  {getEnabledAllowanceGroups(role.allowances).length === 0 ? (
                    <p className="text-[10px] text-muted-foreground">No allowances enabled</p>
                  ) : (
                    getEnabledAllowanceGroups(role.allowances).map((group) => (
                      <div key={`${role.id}-${group.heading}`} className="rounded border border-slate-200 p-1.5">
                        <p className="text-[9px] font-semibold uppercase text-slate-700 mb-1">{group.heading}</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {group.entries.map((entry) => (
                            <PreviewField key={`${role.id}-${group.heading}-${entry.label}`} label={entry.label} value={entry.value} />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border overflow-hidden">
            <div className="px-2 py-1.5 bg-slate-200 text-slate-800 text-[11px] font-bold">Salary</div>
            <table className="w-full text-[10px]"><tbody>{SALARY_TABLE_ROWS.slice(0, 5).map((row) => <tr key={row.item} className="border-b last:border-b-0"><td className="px-2 py-1">{row.item}</td><td className="px-2 py-1 font-semibold text-right">{row.gross}</td></tr>)}</tbody></table>
          </div>
          <div className="rounded border overflow-hidden">
            <div className="px-2 py-1.5 bg-slate-200 text-slate-800 text-[11px] font-bold">Overtime</div>
            <table className="w-full text-[10px]"><tbody>{OVERTIME_TABLE_ROWS.slice(0, 5).map((row) => <tr key={row.item} className="border-b last:border-b-0"><td className="px-2 py-1">{row.item}</td><td className="px-2 py-1 font-semibold text-right">{row.gross}</td></tr>)}</tbody></table>
          </div>
          <div className="rounded border overflow-hidden">
            <div className="px-2 py-1.5 bg-slate-200 text-slate-800 text-[11px] font-bold">Allowances</div>
            <table className="w-full text-[10px]"><tbody>
              {getEnabledAllowanceRows(previewRole).length === 0 ? (
                <tr><td className="px-2 py-1 text-muted-foreground" colSpan={2}>No allowances enabled</td></tr>
              ) : (
                getEnabledAllowanceRows(previewRole).map((row, idx) => (
                  <tr key={row.label} className={idx === getEnabledAllowanceRows(previewRole).length - 1 ? "" : "border-b"}>
                    <td className="px-2 py-1">{row.label}</td>
                    <td className="px-2 py-1 font-semibold text-right">{formatMoney(row.value, row.currency)}</td>
                  </tr>
                ))
              )}
            </tbody></table>
          </div>
        </div>

        <div className="rounded border border-amber-300 bg-amber-50 p-2 mt-2">
          <p className="text-[10px] font-semibold text-amber-700 uppercase">Additional Notes</p>
          <p className={cn("text-[10px] rounded px-1 py-0.5", isFieldActive("Other Deal Provisions") ? "bg-amber-100 ring-1 ring-amber-300" : "")}>
            <span className="text-amber-800/80">Other Deal Provisions:</span> {formatPreviewValue(formData.otherDealProvisions)}
          </p>
          <p className={cn("text-[10px] rounded px-1 py-0.5 mt-1", isFieldActive("Additional Notes") ? "bg-amber-100 ring-1 ring-amber-300" : "")}>
            <span className="text-amber-800/80">Additional Notes:</span> {formatPreviewValue(formData.additionalNotes)}
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <style>{`
        @media print { .print-hide { display: none !important; } }
        .project-settings-form input:not([type="checkbox"]),
        .project-settings-form select {
          height: 1.9rem;
          font-size: 0.8125rem;
        }
        .project-settings-form textarea {
          font-size: 0.8125rem;
          line-height: 1.35;
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="sticky py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${projectName}/onboarding`)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">CREATE NEW OFFER</h1>
                <p className="text-xs text-muted-foreground">
                  {formData.fullName || "New Recipient"}{primaryRole?.jobTitle && ` - ${primaryRole.jobTitle}`}
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

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          <div
            className="project-settings-form xl:col-span-4 space-y-4 xl:h-[calc(100vh-9rem)] xl:overflow-y-auto xl:pr-1"
            onFocusCapture={handleSidebarFieldActivity}
            onInputCapture={handleSidebarFieldActivity}
          >

          <Card className="border shadow-sm py-0 overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="text-sm font-semibold">Recipient</h3>
                  <p className="text-xs text-muted-foreground">Basic recipient details</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Full Name" required className="md:col-span-2">
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
          </Card>

          <Card className="border shadow-sm py-0 overflow-hidden">
              <CardContent className="p-4">
                <div className="pb-2 border-b mb-4">
                  <h3 className="text-sm font-semibold">Contracts</h3>
                  <p className="text-xs text-muted-foreground">Contract configuration and templates</p>
                </div>
                <ContractsTab
                  role={roles[0]}
                  updateRole={updateRole}
                  formData={formData}
                  setFormData={setFormData}
                />
              </CardContent>
          </Card>



          <Card className="border py-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="pb-2 border-b mb-4">
                  <h3 className="text-sm font-semibold">Roles & Rates</h3>
                  <p className="text-xs text-muted-foreground">Role details, compensation, and allowances</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Configure one or more roles for this offer</p>

                <Tabs value={activeRoleTab} onValueChange={setActiveRoleTab} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TabsList className="h-auto p-1 bg-muted/40 gap-1">
                      {roles.map((role) => (
                        <TabsTrigger
                          key={role.id}
                          value={role.id}
                          className={cn(
                            "text-xs px-3 py-1.5",
                            role.isPrimaryRole ? "font-semibold" : ""
                          )}
                        >
                          {role.roleName}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Button variant="outline" size="sm" onClick={addRole} className="gap-1.5 ml-auto">
                      <Plus className="w-4 h-4" /> Add Role
                    </Button>
                  </div>

                  {roles.map((role) => (
                    <TabsContent key={role.id} value={role.id} className="space-y-4">
                    <div className="space-y-4 rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{role.roleName}</h4>
                          {role.isPrimaryRole && (
                            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary px-2 py-0">PRIMARY</Badge>
                          )}
                        </div>
                      </div>
                      {roles.length > 1 && !role.isPrimaryRole && (
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm" className="text-destructive gap-2" onClick={() => removeRole(role.id)}>
                            <Trash2 className="w-4 h-4" /> Remove This Role
                          </Button>
                        </div>
                      )}

                      <div className="space-y-6">

                          <section className="space-y-4">
                            <h4 className="text-sm font-semibold">Role Details</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            </div>
                          </section>
                          <section className="space-y-4 border-t pt-4">
                            <h4 className="text-sm font-semibold">Rate & Compensation</h4>
                            <div className="space-y-4">
                              <div className="border rounded-lg p-3 bg-primary/5">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <span className={cn("text-[11px] font-medium", getFeeMode(role.id) === "DAY" ? "text-primary" : "text-muted-foreground")}>
                                    Fee Per Day Including Holiday
                                  </span>
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={getFeeMode(role.id) === "WEEK"}
                                    aria-label="Toggle fee mode"
                                    onClick={() => setFeeMode(role.id, getFeeMode(role.id) === "WEEK" ? "DAY" : "WEEK")}
                                    className={cn(
                                      "relative h-6 w-11 rounded-full transition-colors",
                                      getFeeMode(role.id) === "WEEK" ? "bg-primary" : "bg-muted-foreground/40"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                                        getFeeMode(role.id) === "WEEK" ? "translate-x-5" : "translate-x-0.5"
                                      )}
                                    />
                                  </button>
                                  <span className={cn("text-[11px] font-medium", getFeeMode(role.id) === "WEEK" ? "text-primary" : "text-muted-foreground")}>
                                    Fee Per Week Including Holiday
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="px-4 py-2 bg-primary/5 border-b">
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Salary</h4>
                                  </div>
                                  <div>
                                  <table className="w-full text-[11px]">
                                    <thead>
                                      <tr className="border-b bg-muted/40">
                                        <th className="text-left p-1.5 font-semibold uppercase">Item</th>
                                        <th className="text-left p-1.5 font-semibold uppercase">Rate / Hol</th>
                                        <th className="text-left p-1.5 font-semibold uppercase">Gross</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {SALARY_TABLE_ROWS.map((row) => (
                                        <tr key={row.item} className="border-b last:border-b-0">
                                          <td className="p-1.5 font-medium">
                                            {row.item}
                                            <span className="text-muted-foreground font-normal ml-1">({row.budgetCode || "-"})</span>
                                          </td>
                                          <td className="p-1.5">{row.rate} <span className="text-muted-foreground">/ {row.hol}</span></td>
                                          <td className="p-1.5">{row.gross}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="border rounded-lg overflow-hidden">
                                <div className="px-4 py-2 bg-primary/5 border-b">
                                  <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Overtime</h4>
                                </div>
                                <div>
                                  <table className="w-full text-[11px]">
                                    <thead>
                                      <tr className="border-b bg-muted/40">
                                        <th className="text-left p-1.5 font-semibold uppercase">Item</th>
                                        <th className="text-left p-1.5 font-semibold uppercase">Rate / Hol</th>
                                        <th className="text-left p-1.5 font-semibold uppercase">Gross</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {OVERTIME_TABLE_ROWS.map((row) => (
                                        <tr key={row.item} className="border-b last:border-b-0">
                                          <td className="p-1.5 font-medium">
                                            {row.item}
                                            <span className="text-muted-foreground font-normal ml-1">({row.budgetCode || "-"})</span>
                                          </td>
                                          <td className="p-1.5">{row.rate} <span className="text-muted-foreground">/ {row.hol}</span></td>
                                          <td className="p-1.5">{row.gross}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="border rounded-lg overflow-hidden">
                                <div className="px-4 py-2 bg-primary/5 border-b">
                                  <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Allowances</h4>
                                </div>
                                <div>
                                  <table className="w-full text-[11px]">
                                    <thead>
                                      <tr className="border-b bg-muted/40">
                                        <th className="text-left p-1.5 font-semibold uppercase">Item</th>
                                        <th className="text-left p-1.5 font-semibold uppercase">Rate/Cap - Paid Till Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ALLOWANCES_TABLE_ROWS.map((row) => (
                                        <tr key={row.item} className="border-b last:border-b-0">
                                          <td className="p-1.5 font-medium">
                                            {row.item}
                                            <span className="text-muted-foreground font-normal ml-1">({row.budgetCode || "-"})</span>
                                          </td>
                                          <td className="p-1.5">{row.value}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                </div>
                              </div>
                            </div>
                          </section>

                          <section className="space-y-3 border-t pt-4">
                            <h4 className="text-sm font-semibold">Allowances</h4>
                            <div>
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

                  {/* Mobile Phone Allowance */}
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
              </div>
                          </section>

                          

                          

                        </div>
                    </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
          </Card>
          <Card className="border py-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="pb-2 border-b mb-4">
                  <h3 className="text-sm font-semibold">Additional Notes</h3>
                  <p className="text-xs text-muted-foreground">Internal and deal-specific notes</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
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
          </Card>
          </div>

          <div className="xl:col-span-8">
            <div className="xl:sticky xl:top-4">
              <PDFPreview />
            </div>
          </div>
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

