import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { Checkbox } from "../../../shared/components/ui/checkbox";
import { Badge } from "../../../shared/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../shared/components/ui/collapsible";
import { Separator } from "../../../shared/components/ui/separator";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  User,
  Briefcase,
  DollarSign,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Laptop,
  Smartphone,
  Car,
  Home,
  Eye,
  AlertCircle
} from "lucide-react";
import { cn } from "../../../shared/config/utils";
import { toast } from "sonner";

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

const WORKING_WEEKS = [
  { value: "", label: "SELECT WORKING WEEK" },
  { value: "5_DAYS", label: "5 days" },
  { value: "6_DAYS", label: "6 days" },
  { value: "5_6_DAYS", label: "5/6 days" },
];

const REGULAR_SITE_OPTIONS = [
  { value: "", label: "SELECT SITE OF WORK" },
  { value: "ON_SET", label: "On set" },
  { value: "OFF_SET", label: "Off set" },
];

const DAILY_WEEKLY_OPTIONS = [
  { value: "", label: "SELECT ENGAGEMENT" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
];

const PRODUCTION_PHASES = [
  { value: "", label: "SELECT PRODUCTION PHASE" },
  { value: "PREP", label: "PREP" },
  { value: "SHOOT", label: "SHOOT" },
  { value: "WRAP", label: "WRAP" },
  { value: "PREP_SHOOT", label: "PREP & SHOOT" },
  { value: "SHOOT_WRAP", label: "SHOOT & WRAP" },
  { value: "ALL", label: "ALL (PREP, SHOOT & WRAP)" },
];

const ENGAGEMENT_TYPES = [
  { value: "", label: "SELECT ENGAGEMENT TYPE" },
  { value: "LOAN_OUT", label: "LOAN OUT" },
  { value: "PAYE", label: "PAYE" },
  { value: "SCHD", label: "SCHD (DAILY/WEEKLY)" },
  { value: "LONG_FORM", label: "LONG FORM" },
];

const OVERTIME_TYPES = [
  { value: "CALCULATED", label: "CALCULATED (STANDARD)" },
  { value: "CUSTOM", label: "CUSTOM RATES" },
  { value: "NONE", label: "NO OVERTIME" },
];

const CURRENCIES = [
  { value: "GBP", label: "GBP (£)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

const getDefaultAllowances = () => ({
  boxRental: false, boxRentalFeePerWeek: "", boxRentalTerms: "", boxRentalBudgetCode: "",
  computerAllowance: false, computerAllowanceFeePerWeek: "", computerAllowanceTerms: "", computerAllowanceBudgetCode: "",
  softwareAllowance: false, softwareAllowanceFeePerWeek: "", softwareAllowanceTerms: "", softwareAllowanceBudgetCode: "",
  equipmentRental: false, equipmentRentalFeePerWeek: "", equipmentRentalTerms: "", equipmentRentalBudgetCode: "",
  mobilePhoneAllowance: false, mobilePhoneAllowanceFeePerWeek: "", mobilePhoneAllowanceTerms: "", mobilePhoneAllowanceBudgetCode: "",
  vehicleAllowance: false, vehicleAllowanceFeePerWeek: "", vehicleAllowanceTerms: "", vehicleAllowanceBudgetCode: "",
  vehicleHire: false, vehicleHireRate: "", vehicleHireTerms: "", vehicleHireBudgetCode: "",
  perDiem1: false, perDiem1Currency: "GBP", perDiem1ShootDayRate: "", perDiem1NonShootDayRate: "", perDiem1Terms: "", perDiem1BudgetCode: "",
  perDiem2: false, perDiem2Currency: "USD", perDiem2ShootDayRate: "", perDiem2NonShootDayRate: "", perDiem2Terms: "", perDiem2BudgetCode: "",
  livingAllowance: false, livingAllowanceCurrency: "GBP", livingAllowanceDailyRate: "", livingAllowanceWeeklyRate: "", livingAllowanceTerms: "", livingAllowanceBudgetCode: "",
});

const createDefaultRole = (index) => ({
  id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  shiftHours: "10",
  holidayPayInclusive: false,
  rateDescription: "",
  overtimeType: "CALCULATED",
  customOvertimeRates: { nonShootOvertimeRate: "", shootOvertimeRate: "", minimumHours6thDay: "", sixthDayHourlyRate: "", minimumHours7thDay: "", seventhDayHourlyRate: "" },
  budgetCode: "",
  allowances: getDefaultAllowances(),
});

// Mock data for demonstration
const mockOfferData = {
  id: "1",
  fullName: "John Smith",
  email: "john.smith@example.com",
  mobileNumber: "+44 7700 900000",
  productionName: "The Great Adventure",
  isViaAgent: false,
  agentName: "",
  agentEmail: "",
  allowSelfEmployedOrLoanOut: true,
  statusDeterminationReason: "",
  alternativeContractType: "",
  roles: [
    {
      ...createDefaultRole(0),
      jobTitle: "Director of Photography",
      department: "CAMERA",
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      rateAmount: "1200",
      currency: "GBP",
    }
  ]
};

function SelectField({ label, value, onChange, options, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label className="text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", placeholder, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}

function AllowanceSection({ title, icon: Icon, enabled, onToggle, children }) {
  return (
    <Collapsible open={enabled}>
      <div className="flex items-center gap-2 py-2">
        <Checkbox checked={enabled} onCheckedChange={onToggle} />
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <CollapsibleContent>
        <div className="pl-6 pb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function EditOffer() {
  const navigate = useNavigate();
  const { projectName, id: offerId } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRoles, setExpandedRoles] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    productionName: "",
    isViaAgent: false,
    agentName: "",
    agentEmail: "",
    allowSelfEmployedOrLoanOut: true,
    statusDeterminationReason: "",
    alternativeContractType: "",
    roles: [createDefaultRole(0)],
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const existingOffer = mockOfferData;
      if (existingOffer) {
        const roles = (existingOffer.roles || []).map((role, idx) => ({
          ...createDefaultRole(idx),
          ...role,
          allowances: { ...getDefaultAllowances(), ...(role.allowances || {}) },
        }));
        setFormData({
          fullName: existingOffer.fullName || "",
          email: existingOffer.email || "",
          mobileNumber: existingOffer.mobileNumber || "",
          productionName: existingOffer.productionName || "",
          isViaAgent: existingOffer.isViaAgent || false,
          agentName: existingOffer.agentName || "",
          agentEmail: existingOffer.agentEmail || "",
          allowSelfEmployedOrLoanOut: existingOffer.allowSelfEmployedOrLoanOut ?? true,
          statusDeterminationReason: existingOffer.statusDeterminationReason || "",
          alternativeContractType: existingOffer.alternativeContractType || "",
          roles: roles.length > 0 ? roles : [createDefaultRole(0)],
        });
        const expanded = {};
        roles.forEach(r => { expanded[r.id] = true; });
        setExpandedRoles(expanded);
      }
      setIsLoading(false);
    }, 500);
  }, [offerId]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRole = (roleId, field, value) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === roleId ? { ...r, [field]: value } : r),
    }));
  };

  const updateRoleAllowance = (roleId, field, value) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.map(r => 
        r.id === roleId 
          ? { ...r, allowances: { ...r.allowances, [field]: value } } 
          : r
      ),
    }));
  };

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, createDefaultRole(prev.roles.length)],
    }));
  };

  const removeRole = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r.id !== roleId),
    }));
  };

  const toggleRoleExpanded = (roleId) => {
    setExpandedRoles(prev => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Offer updated successfully");
      navigate(`/projects/${projectName}/offers/${offerId}/view`);
    } catch (error) {
      toast.error("Failed to update offer", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {/* <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" /> */}
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between gap-4 p-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${projectName}/offers/${offerId}/view`)} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold" data-testid="text-edit-title">Edit Offer</h1>
              <p className="text-xs text-muted-foreground">{formData.fullName || "New Offer"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/projects/${projectName}/offers/${offerId}/view`)
              }
              data-testid="button-view"
            >
              <Eye className="w-4 h-4 mr-1.5" /> View
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} data-testid="button-save">
              <Save className="w-4 h-4 mr-1.5" /> {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="px-4 py-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Recipient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Full Name" value={formData.fullName} onChange={(v) => updateField("fullName", v)} />
              <FormField label="Email" value={formData.email} onChange={(v) => updateField("email", v)} type="email" />
              <FormField label="Mobile Number" value={formData.mobileNumber} onChange={(v) => updateField("mobileNumber", v)} />
              <FormField label="Production Name" value={formData.productionName} onChange={(v) => updateField("productionName", v)} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox 
                checked={formData.isViaAgent} 
                onCheckedChange={(v) => updateField("isViaAgent", v)} 
                data-testid="checkbox-via-agent"
              />
              <Label className="text-sm">Via Agent</Label>
            </div>
            {formData.isViaAgent && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <FormField label="Agent Name" value={formData.agentName} onChange={(v) => updateField("agentName", v)} />
                <FormField label="Agent Email" value={formData.agentEmail} onChange={(v) => updateField("agentEmail", v)} type="email" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Employment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox 
                checked={formData.allowSelfEmployedOrLoanOut} 
                onCheckedChange={(v) => updateField("allowSelfEmployedOrLoanOut", v)} 
                data-testid="checkbox-allow-self-employed"
              />
              <Label className="text-sm">Allow Self-Employed or Loan-Out</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Status Determination Reason" value={formData.statusDeterminationReason} onChange={(v) => updateField("statusDeterminationReason", v)} />
              <FormField label="Alternative Contract Type" value={formData.alternativeContractType} onChange={(v) => updateField("alternativeContractType", v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> Roles ({formData.roles.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addRole} data-testid="button-add-role">
              <Plus className="w-4 h-4 mr-1" /> Add Role
            </Button>
          </CardHeader>
          <CardContent className="px-4 py-0 space-y-4">
            {formData.roles.map((role, idx) => (
              <Collapsible 
                key={role.id} 
                open={expandedRoles[role.id] !== false}
                onOpenChange={() => toggleRoleExpanded(role.id)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{role.jobTitle || `Role ${idx + 1}`}</span>
                          {role.isPrimaryRole && <Badge variant="default" className="ml-2 text-[10px]">Primary</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.roles.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); removeRole(role.id); }}
                            data-testid={`button-remove-role-${idx}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                        {expandedRoles[role.id] !== false ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <FormField label="Job Title" value={role.jobTitle} onChange={(v) => updateRole(role.id, "jobTitle", v)} />
                        <FormField label="Job Title Suffix" value={role.jobTitleSuffix} onChange={(v) => updateRole(role.id, "jobTitleSuffix", v)} />
                        <SelectField 
                          label="Department" 
                          value={role.department} 
                          onChange={(v) => updateRole(role.id, "department", v)}
                          options={[{ value: "", label: "SELECT" }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]}
                        />
                        <FormField label="Sub-Department" value={role.subDepartment} onChange={(v) => updateRole(role.id, "subDepartment", v)} />
                        <FormField label="Unit" value={role.unit} onChange={(v) => updateRole(role.id, "unit", v)} />
                        <div className="flex items-center gap-2 pt-6">
                          <Checkbox 
                            checked={role.searchAllDepartments} 
                            onCheckedChange={(v) => updateRole(role.id, "searchAllDepartments", v)} 
                          />
                          <Label className="text-xs">Search All Departments</Label>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <Checkbox 
                            checked={role.createOwnJobTitle} 
                            onCheckedChange={(v) => updateRole(role.id, "createOwnJobTitle", v)} 
                          />
                          <Label className="text-xs">Create Own Job Title</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <SelectField 
                          label="Site of Work (On Shoot Days)" 
                          value={role.regularSiteOfWork} 
                          onChange={(v) => updateRole(role.id, "regularSiteOfWork", v)}
                          options={REGULAR_SITE_OPTIONS}
                        />
                        <SelectField 
                          label="Engagement Type" 
                          value={role.engagementType} 
                          onChange={(v) => updateRole(role.id, "engagementType", v)}
                          options={ENGAGEMENT_TYPES}
                        />
                        <SelectField 
                          label="Production Phase" 
                          value={role.productionPhase} 
                          onChange={(v) => updateRole(role.id, "productionPhase", v)}
                          options={PRODUCTION_PHASES}
                        />
                        <SelectField 
                          label="Working Week" 
                          value={role.workingWeek} 
                          onChange={(v) => updateRole(role.id, "workingWeek", v)}
                          options={WORKING_WEEKS}
                        />
                        <SelectField 
                          label="Working in UK" 
                          value={role.workingInUnitedKingdom || "YES"} 
                          onChange={(v) => updateRole(role.id, "workingInUnitedKingdom", v)}
                          options={[{ value: "YES", label: "Yes" }, { value: "NO", label: "No" }]}
                        />
                        <SelectField 
                          label="Daily/Weekly Engagement" 
                          value={role.dailyOrWeeklyEngagement} 
                          onChange={(v) => updateRole(role.id, "dailyOrWeeklyEngagement", v)}
                          options={DAILY_WEEKLY_OPTIONS}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <FormField label="Start Date" value={role.startDate} onChange={(v) => updateRole(role.id, "startDate", v)} type="date" />
                        <FormField label="End Date" value={role.endDate} onChange={(v) => updateRole(role.id, "endDate", v)} type="date" />
                        <SelectField 
                          label="Rate Type" 
                          value={role.rateType} 
                          onChange={(v) => updateRole(role.id, "rateType", v)}
                          options={[{ value: "DAILY", label: "Daily" }, { value: "WEEKLY", label: "Weekly" }]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <SelectField 
                            label="Currency" 
                            value={role.currency} 
                            onChange={(v) => updateRole(role.id, "currency", v)}
                            options={CURRENCIES}
                          />
                          <FormField label="Rate" value={role.rateAmount} onChange={(v) => updateRole(role.id, "rateAmount", v)} type="number" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <FormField label="Shift Hours" value={role.shiftHours} onChange={(v) => updateRole(role.id, "shiftHours", v)} type="number" />
                        <FormField label="Fee Per Day" value={role.feePerDay} onChange={(v) => updateRole(role.id, "feePerDay", v)} type="number" />
                        <SelectField 
                          label="Overtime Type" 
                          value={role.overtimeType} 
                          onChange={(v) => updateRole(role.id, "overtimeType", v)}
                          options={OVERTIME_TYPES}
                        />
                        <FormField label="Budget Code" value={role.budgetCode} onChange={(v) => updateRole(role.id, "budgetCode", v)} />
                        <div className="flex items-center gap-2 pt-6">
                          <Checkbox 
                            checked={role.holidayPayInclusive} 
                            onCheckedChange={(v) => updateRole(role.id, "holidayPayInclusive", v)} 
                          />
                          <Label className="text-xs">Holiday Pay Inclusive</Label>
                        </div>
                        <FormField label="Rate Description" value={role.rateDescription} onChange={(v) => updateRole(role.id, "rateDescription", v)} className="col-span-2" />
                      </div>

                      {role.overtimeType === "CUSTOM" && (
                        <div className="bg-muted/30 rounded-md p-3 mt-2">
                          <h5 className="text-xs font-semibold mb-2">Custom Overtime Rates</h5>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                            <FormField 
                              label="Non-Shoot OT Rate" 
                              value={role.customOvertimeRates?.nonShootOvertimeRate} 
                              onChange={(v) => updateRole(role.id, "customOvertimeRates", { ...role.customOvertimeRates, nonShootOvertimeRate: v })} 
                            />
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" /> Allowances
                        </h4>
                        
                        <AllowanceSection 
                          title="Box Rental" 
                          icon={Package} 
                          enabled={role.allowances.boxRental}
                          onToggle={(v) => updateRoleAllowance(role.id, "boxRental", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.boxRentalFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "boxRentalFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.boxRentalTerms} onChange={(v) => updateRoleAllowance(role.id, "boxRentalTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.boxRentalBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "boxRentalBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Computer Allowance" 
                          icon={Laptop} 
                          enabled={role.allowances.computerAllowance}
                          onToggle={(v) => updateRoleAllowance(role.id, "computerAllowance", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.computerAllowanceFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "computerAllowanceFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.computerAllowanceTerms} onChange={(v) => updateRoleAllowance(role.id, "computerAllowanceTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.computerAllowanceBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "computerAllowanceBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Software Allowance" 
                          icon={Laptop} 
                          enabled={role.allowances.softwareAllowance}
                          onToggle={(v) => updateRoleAllowance(role.id, "softwareAllowance", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.softwareAllowanceFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "softwareAllowanceFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.softwareAllowanceTerms} onChange={(v) => updateRoleAllowance(role.id, "softwareAllowanceTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.softwareAllowanceBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "softwareAllowanceBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Equipment Rental" 
                          icon={Package} 
                          enabled={role.allowances.equipmentRental}
                          onToggle={(v) => updateRoleAllowance(role.id, "equipmentRental", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.equipmentRentalFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "equipmentRentalFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.equipmentRentalTerms} onChange={(v) => updateRoleAllowance(role.id, "equipmentRentalTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.equipmentRentalBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "equipmentRentalBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Mobile Phone" 
                          icon={Smartphone} 
                          enabled={role.allowances.mobilePhoneAllowance}
                          onToggle={(v) => updateRoleAllowance(role.id, "mobilePhoneAllowance", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.mobilePhoneAllowanceFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "mobilePhoneAllowanceFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.mobilePhoneAllowanceTerms} onChange={(v) => updateRoleAllowance(role.id, "mobilePhoneAllowanceTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.mobilePhoneAllowanceBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "mobilePhoneAllowanceBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Vehicle Allowance" 
                          icon={Car} 
                          enabled={role.allowances.vehicleAllowance}
                          onToggle={(v) => updateRoleAllowance(role.id, "vehicleAllowance", v)}
                        >
                          <FormField label="Fee/Week" value={role.allowances.vehicleAllowanceFeePerWeek} onChange={(v) => updateRoleAllowance(role.id, "vehicleAllowanceFeePerWeek", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.vehicleAllowanceTerms} onChange={(v) => updateRoleAllowance(role.id, "vehicleAllowanceTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.vehicleAllowanceBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "vehicleAllowanceBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Vehicle Hire" 
                          icon={Car} 
                          enabled={role.allowances.vehicleHire}
                          onToggle={(v) => updateRoleAllowance(role.id, "vehicleHire", v)}
                        >
                          <FormField label="Rate" value={role.allowances.vehicleHireRate} onChange={(v) => updateRoleAllowance(role.id, "vehicleHireRate", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.vehicleHireTerms} onChange={(v) => updateRoleAllowance(role.id, "vehicleHireTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.vehicleHireBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "vehicleHireBudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Per Diem (1)" 
                          icon={DollarSign} 
                          enabled={role.allowances.perDiem1}
                          onToggle={(v) => updateRoleAllowance(role.id, "perDiem1", v)}
                        >
                          <FormField label="Shoot Day Rate" value={role.allowances.perDiem1ShootDayRate} onChange={(v) => updateRoleAllowance(role.id, "perDiem1ShootDayRate", v)} type="number" />
                          <FormField label="Non-Shoot Rate" value={role.allowances.perDiem1NonShootDayRate} onChange={(v) => updateRoleAllowance(role.id, "perDiem1NonShootDayRate", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.perDiem1Terms} onChange={(v) => updateRoleAllowance(role.id, "perDiem1Terms", v)} />
                          <FormField label="Budget Code" value={role.allowances.perDiem1BudgetCode} onChange={(v) => updateRoleAllowance(role.id, "perDiem1BudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Per Diem (2)" 
                          icon={DollarSign} 
                          enabled={role.allowances.perDiem2}
                          onToggle={(v) => updateRoleAllowance(role.id, "perDiem2", v)}
                        >
                          <FormField label="Shoot Day Rate" value={role.allowances.perDiem2ShootDayRate} onChange={(v) => updateRoleAllowance(role.id, "perDiem2ShootDayRate", v)} type="number" />
                          <FormField label="Non-Shoot Rate" value={role.allowances.perDiem2NonShootDayRate} onChange={(v) => updateRoleAllowance(role.id, "perDiem2NonShootDayRate", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.perDiem2Terms} onChange={(v) => updateRoleAllowance(role.id, "perDiem2Terms", v)} />
                          <FormField label="Budget Code" value={role.allowances.perDiem2BudgetCode} onChange={(v) => updateRoleAllowance(role.id, "perDiem2BudgetCode", v)} />
                        </AllowanceSection>

                        <AllowanceSection 
                          title="Living Allowance" 
                          icon={Home} 
                          enabled={role.allowances.livingAllowance}
                          onToggle={(v) => updateRoleAllowance(role.id, "livingAllowance", v)}
                        >
                          <FormField label="Daily Rate" value={role.allowances.livingAllowanceDailyRate} onChange={(v) => updateRoleAllowance(role.id, "livingAllowanceDailyRate", v)} type="number" />
                          <FormField label="Weekly Rate" value={role.allowances.livingAllowanceWeeklyRate} onChange={(v) => updateRoleAllowance(role.id, "livingAllowanceWeeklyRate", v)} type="number" />
                          <FormField label="Terms" value={role.allowances.livingAllowanceTerms} onChange={(v) => updateRoleAllowance(role.id, "livingAllowanceTerms", v)} />
                          <FormField label="Budget Code" value={role.allowances.livingAllowanceBudgetCode} onChange={(v) => updateRoleAllowance(role.id, "livingAllowanceBudgetCode", v)} />
                        </AllowanceSection>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}