import { useState, useRef, useEffect } from "react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Checkbox } from "../../../shared/components/ui/checkbox";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Users, 
  Building2, 
  FileText,
  CheckCircle,
  AlertCircle,
  Copy,
  Save,
  Settings2,
  Info,
  Download,
  Upload,
  Trash,
  X,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";

const DEPARTMENTS = [
  "", "ACCOUNTS", "ACTION VEHICLES", "AERIAL", "ANIMALS", "ANIMATION", "ARMOURY", "ART", 
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

const JOB_TITLES_BY_DEPT = {
  "CAMERA": ["CAMERA OPERATOR", "FOCUS PULLER", "DIT", "CAMERA ASSISTANT", "STEADICAM OPERATOR"],
  "ART": ["ART DIRECTOR", "STANDBY ART", "ART ASSISTANT", "GRAPHIC DESIGNER"],
  "GRIP": ["KEY GRIP", "BEST BOY GRIP", "DOLLY GRIP", "GRIP"],
  "ELECTRICAL": ["GAFFER", "BEST BOY ELECTRIC", "ELECTRICIAN", "LAMP OPERATOR"],
  "SOUND": ["SOUND MIXER", "BOOM OPERATOR", "SOUND ASSISTANT"],
  "COSTUME": ["COSTUME DESIGNER", "COSTUME SUPERVISOR", "COSTUME ASSISTANT", "WARDROBE"],
  "HAIR AND MAKEUP": ["MAKEUP ARTIST", "HAIR STYLIST", "MAKEUP & HAIR DESIGNER"],
  "PRODUCTION": ["PRODUCTION MANAGER", "PRODUCTION COORDINATOR", "PRODUCTION ASSISTANT"],
};

const CONTRACT_OPTIONS = ["", "HOD", "NO_CONTRACT", "SENIOR_AGREEMENT"];
const STATUS_REASONS = ["", "HMRC_LIST", "CEST_ASSESSMENT", "LORIMER_LETTER", "OTHER"];
const WORKING_WEEKS = ["", "5_DAYS", "6_DAYS", "5_6_DAYS"];
const PRODUCTION_PHASES = ["", "PREP", "SHOOT", "WRAP", "PREP_SHOOT", "SHOOT_WRAP", "ALL"];
const ENGAGEMENT_TYPES = ["", "LOAN_OUT", "PAYE", "SCHD", "LONG_FORM"];
const RATE_TYPES = ["DAILY", "WEEKLY"];
const CURRENCIES = ["GBP", "USD", "EUR"];
const OVERTIME_TYPES = ["CALCULATED", "CUSTOM", "NONE"];
const CAP_TYPES = ["", "FLAT", "PERCENTAGE", "NO_CAP"];

const FIELD_TOOLTIPS = {
  overtimeType: "CALCULATED = Auto OT after shift hours\nCUSTOM = Manual OT rates\nNONE = No overtime",
  workingWeek: "5_DAYS = Mon-Fri\n6_DAYS = Mon-Sat\n5_6_DAYS = Varies",
  engagementType: "LOAN_OUT = Through company\nPAYE = Direct employee\nSCHD = Schedule D\nLONG_FORM = Extended contract",
  productionPhase: "PREP = Preparation only\nSHOOT = Shooting only\nWRAP = Wrap only\nALL = All phases"
};

const ROW_DENSITY = {
  COMPACT: { height: 32, fontSize: "text-[11px]" },
  COMFORTABLE: { height: 36, fontSize: "text-xs" },
  SPACIOUS: { height: 44, fontSize: "text-sm" }
};

const createEmptyRow = (previousRow = null, copySettings = true) => {
  const baseRow = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    // Recipient Info (matching CreateOffer)
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    isViaAgent: false,
    agentName: "",
    agentEmailAddress: "",
    alternativeContractType: "",
    
    // Tax Status (matching CreateOffer)
    allowAsSelfEmployedOrLoanOut: "",
    statusDeterminationReason: "",
    otherStatusDeterminationReason: "",
    
    // Role Details (matching CreateOffer)
    unit: "",
    department: "",
    subDepartment: "",
    jobTitle: "",
    jobTitleSuffix: "",
    regularSiteOfWork: "",
    workingInUnitedKingdom: "YES",
    engagementType: "",
    productionPhase: "",
    startDate: "",
    endDate: "",
    workingWeek: "",
    
    // Rate & Compensation (matching CreateOffer)
    rateType: "DAILY",
    currency: "GBP",
    rateAmount: "",
    feePerDay: "",
    shiftHours: "10",
    holidayPayInclusive: false,
    rateDescription: "",
    overtimeType: "CALCULATED",
    budgetCode: "",
    
    // Custom Overtime Rates (matching CreateOffer)
    customOvertimeRates: {
      nonShootOvertimeRate: "",
      shootOvertimeRate: "",
      minimumHours6thDay: "",
      sixthDayHourlyRate: "",
      minimumHours7thDay: "",
      seventhDayHourlyRate: ""
    },
    
    // Allowances (matching CreateOffer structure)
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
    
    softwareAllowance: false,
    softwareAllowanceDescription: "",
    softwareAllowanceFeePerWeek: "",
    softwareAllowanceTerms: "",
    softwareAllowanceBudgetCode: "",
    
    equipmentRental: false,
    equipmentRentalDescription: "",
    equipmentRentalFeePerWeek: "",
    equipmentRentalCapCalculatedAs: "",
    equipmentRentalCap: "",
    equipmentRentalTerms: "",
    equipmentRentalBudgetCode: "",
    
    mobilePhoneAllowance: false,
    mobilePhoneAllowanceFeePerWeek: "",
    mobilePhoneAllowanceTerms: "",
    mobilePhoneAllowanceBudgetCode: "",
    
    vehicleAllowance: false,
    vehicleAllowanceFeePerWeek: "",
    vehicleAllowanceTerms: "",
    vehicleAllowanceBudgetCode: "",
    
    vehicleHire: false,
    vehicleHireRate: "",
    vehicleHireTerms: "",
    vehicleHireBudgetCode: "",
    
    perDiem1: false,
    perDiem1Currency: "GBP",
    perDiem1ShootDayRate: "",
    perDiem1NonShootDayRate: "",
    perDiem1Terms: "",
    perDiem1BudgetCode: "",
    
    perDiem2: false,
    perDiem2Currency: "USD",
    perDiem2ShootDayRate: "",
    perDiem2NonShootDayRate: "",
    perDiem2Terms: "",
    perDiem2BudgetCode: "",
    
    livingAllowance: false,
    livingAllowanceCurrency: "GBP",
    livingAllowanceDailyRate: "",
    livingAllowanceWeeklyRate: "",
    livingAllowanceTerms: "",
    livingAllowanceBudgetCode: "",
    
    // Additional Notes (matching CreateOffer)
    otherDealProvisions: "",
    additionalNotes: "",
    
    selected: false,
  };

  if (previousRow && copySettings) {
    return {
      ...baseRow,
      department: previousRow.department,
      unit: previousRow.unit,
      engagementType: previousRow.engagementType,
      productionPhase: previousRow.productionPhase,
      rateType: previousRow.rateType,
      currency: previousRow.currency,
      workingWeek: previousRow.workingWeek,
      shiftHours: previousRow.shiftHours,
      overtimeType: previousRow.overtimeType,
      workingInUnitedKingdom: previousRow.workingInUnitedKingdom,
      allowAsSelfEmployedOrLoanOut: previousRow.allowAsSelfEmployedOrLoanOut,
      statusDeterminationReason: previousRow.statusDeterminationReason,
      // Copy allowance enabled states
      boxRental: previousRow.boxRental,
      computerAllowance: previousRow.computerAllowance,
      softwareAllowance: previousRow.softwareAllowance,
      equipmentRental: previousRow.equipmentRental,
      mobilePhoneAllowance: previousRow.mobilePhoneAllowance,
      vehicleAllowance: previousRow.vehicleAllowance,
      vehicleHire: previousRow.vehicleHire,
      perDiem1: previousRow.perDiem1,
      perDiem2: previousRow.perDiem2,
      livingAllowance: previousRow.livingAllowance,
    };
  }

  return baseRow;
};

const validateRow = (row) => {
  if (!row.fullName || !row.fullName.trim()) return { valid: false, error: "Missing Name" };
  if (!row.emailAddress || !row.emailAddress.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.emailAddress)) return { valid: false, error: "Invalid Email" };
  if (!row.jobTitle || !row.jobTitle.trim()) return { valid: false, error: "Missing Job Title" };
  if (!row.engagementType) return { valid: false, error: "Missing Engagement" };
  if (!row.unit || !row.unit.trim()) return { valid: false, error: "Missing Unit" };
  if (!row.department) return { valid: false, error: "Missing Department" };
  return { valid: true, error: null };
};

const COLUMNS = [
  { key: "select", label: "", width: 40, frozen: true, type: "select" },
  { key: "actions", label: "", width: 100, frozen: true, type: "actions" },
  { key: "status", label: "STATUS", width: 120, frozen: true, type: "status" },
  
  // RECIPIENT INFO
  { key: "fullName", label: "FULL NAME", width: 180, type: "text", required: true, group: "recipient" },
  { key: "emailAddress", label: "EMAIL", width: 200, type: "email", required: true, group: "recipient" },
  { key: "mobileNumber", label: "MOBILE", width: 140, type: "text", group: "recipient" },
  { key: "isViaAgent", label: "VIA AGENT", width: 80, type: "checkbox", group: "recipient" },
  { key: "agentName", label: "AGENT NAME", width: 150, type: "text", group: "recipient" },
  { key: "agentEmailAddress", label: "AGENT EMAIL", width: 180, type: "email", group: "recipient" },
  { key: "alternativeContractType", label: "CONTRACT TYPE", width: 140, type: "select", options: CONTRACT_OPTIONS, group: "recipient" },
  
  // TAX STATUS
  { key: "allowAsSelfEmployedOrLoanOut", label: "SELF-EMP/LOAN", width: 120, type: "select", options: ["", "YES", "NO"], group: "tax" },
  { key: "statusDeterminationReason", label: "STATUS REASON", width: 150, type: "select", options: STATUS_REASONS, group: "tax" },
  { key: "otherStatusDeterminationReason", label: "OTHER REASON", width: 180, type: "text", group: "tax" },
  
  // ROLE DETAILS
  { key: "unit", label: "UNIT", width: 120, type: "text", required: true, group: "role" },
  { key: "department", label: "DEPARTMENT", width: 160, type: "select", options: DEPARTMENTS, required: true, group: "role" },
  { key: "subDepartment", label: "SUB-DEPT", width: 130, type: "text", group: "role" },
  { key: "jobTitle", label: "JOB TITLE", width: 180, type: "text-suggest", required: true, group: "role" },
  { key: "jobTitleSuffix", label: "TITLE SUFFIX", width: 140, type: "text", group: "role" },
  { key: "regularSiteOfWork", label: "SITE OF WORK", width: 160, type: "text", group: "role" },
  { key: "workingInUnitedKingdom", label: "WORKING UK", width: 100, type: "select", options: ["YES", "NEVER"], group: "role" },
  { key: "engagementType", label: "ENGAGEMENT", width: 130, type: "select", options: ENGAGEMENT_TYPES, required: true, tooltip: FIELD_TOOLTIPS.engagementType, group: "role" },
  { key: "productionPhase", label: "PHASE", width: 120, type: "select", options: PRODUCTION_PHASES, tooltip: FIELD_TOOLTIPS.productionPhase, group: "role" },
  { key: "startDate", label: "START DATE", width: 130, type: "date", group: "role" },
  { key: "endDate", label: "END DATE", width: 130, type: "date", group: "role" },
  { key: "workingWeek", label: "WORK WEEK", width: 110, type: "select", options: WORKING_WEEKS, tooltip: FIELD_TOOLTIPS.workingWeek, group: "role" },
  
  // RATE & COMPENSATION
  { key: "rateType", label: "RATE TYPE", width: 100, type: "select", options: RATE_TYPES, group: "compensation" },
  { key: "currency", label: "CURRENCY", width: 90, type: "select", options: CURRENCIES, group: "compensation" },
  { key: "rateAmount", label: "RATE AMOUNT", width: 110, type: "number", group: "compensation" },
  { key: "feePerDay", label: "FEE/DAY", width: 100, type: "number", group: "compensation" },
  { key: "shiftHours", label: "SHIFT HRS", width: 90, type: "number", group: "compensation" },
  { key: "holidayPayInclusive", label: "HOLIDAY PAY", width: 100, type: "checkbox", group: "compensation" },
  { key: "rateDescription", label: "RATE DESC", width: 180, type: "text", group: "compensation" },
  { key: "overtimeType", label: "OVERTIME", width: 120, type: "select", options: OVERTIME_TYPES, tooltip: FIELD_TOOLTIPS.overtimeType, group: "compensation" },
  { key: "budgetCode", label: "BUDGET CODE", width: 120, type: "text", group: "compensation" },
  
  // ALLOWANCES - Box Rental
  { key: "boxRental", label: "BOX", width: 50, type: "checkbox", group: "allowances" },
  { key: "boxRentalDescription", label: "BOX DESC", width: 150, type: "text", group: "allowances" },
  { key: "boxRentalFeePerWeek", label: "BOX £/WK", width: 90, type: "number", group: "allowances" },
  { key: "boxRentalCapCalculatedAs", label: "BOX CAP TYPE", width: 120, type: "select", options: CAP_TYPES, group: "allowances" },
  { key: "boxRentalCap", label: "BOX CAP", width: 90, type: "number", group: "allowances" },
  { key: "boxRentalBudgetCode", label: "BOX BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Computer
  { key: "computerAllowance", label: "COMP", width: 50, type: "checkbox", group: "allowances" },
  { key: "computerAllowanceFeePerWeek", label: "COMP £/WK", width: 90, type: "number", group: "allowances" },
  { key: "computerAllowanceBudgetCode", label: "COMP BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Software
  { key: "softwareAllowance", label: "SOFT", width: 50, type: "checkbox", group: "allowances" },
  { key: "softwareAllowanceDescription", label: "SOFT DESC", width: 140, type: "text", group: "allowances" },
  { key: "softwareAllowanceFeePerWeek", label: "SOFT £/WK", width: 90, type: "number", group: "allowances" },
  { key: "softwareAllowanceBudgetCode", label: "SOFT BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Equipment
  { key: "equipmentRental", label: "EQUIP", width: 50, type: "checkbox", group: "allowances" },
  { key: "equipmentRentalDescription", label: "EQUIP DESC", width: 140, type: "text", group: "allowances" },
  { key: "equipmentRentalFeePerWeek", label: "EQUIP £/WK", width: 100, type: "number", group: "allowances" },
  { key: "equipmentRentalBudgetCode", label: "EQUIP BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Mobile
  { key: "mobilePhoneAllowance", label: "MOB", width: 50, type: "checkbox", group: "allowances" },
  { key: "mobilePhoneAllowanceFeePerWeek", label: "MOB £/WK", width: 90, type: "number", group: "allowances" },
  { key: "mobilePhoneAllowanceBudgetCode", label: "MOB BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Vehicle
  { key: "vehicleAllowance", label: "VEH", width: 50, type: "checkbox", group: "allowances" },
  { key: "vehicleAllowanceFeePerWeek", label: "VEH £/WK", width: 90, type: "number", group: "allowances" },
  { key: "vehicleAllowanceBudgetCode", label: "VEH BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Per Diem 1
  { key: "perDiem1", label: "PD1", width: 50, type: "checkbox", group: "allowances" },
  { key: "perDiem1Currency", label: "PD1 CURR", width: 90, type: "select", options: CURRENCIES, group: "allowances" },
  { key: "perDiem1ShootDayRate", label: "PD1 SHOOT", width: 100, type: "number", group: "allowances" },
  { key: "perDiem1NonShootDayRate", label: "PD1 NON-SHOOT", width: 110, type: "number", group: "allowances" },
  { key: "perDiem1BudgetCode", label: "PD1 BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Per Diem 2
  { key: "perDiem2", label: "PD2", width: 50, type: "checkbox", group: "allowances" },
  { key: "perDiem2Currency", label: "PD2 CURR", width: 90, type: "select", options: CURRENCIES, group: "allowances" },
  { key: "perDiem2ShootDayRate", label: "PD2 SHOOT", width: 100, type: "number", group: "allowances" },
  { key: "perDiem2NonShootDayRate", label: "PD2 NON-SHOOT", width: 110, type: "number", group: "allowances" },
  { key: "perDiem2BudgetCode", label: "PD2 BUDGET", width: 120, type: "text", group: "allowances" },
  
  // ALLOWANCES - Living
  { key: "livingAllowance", label: "LIV", width: 50, type: "checkbox", group: "allowances" },
  { key: "livingAllowanceCurrency", label: "LIV CURR", width: 90, type: "select", options: CURRENCIES, group: "allowances" },
  { key: "livingAllowanceDailyRate", label: "LIV DAILY", width: 100, type: "number", group: "allowances" },
  { key: "livingAllowanceWeeklyRate", label: "LIV WEEKLY", width: 100, type: "number", group: "allowances" },
  { key: "livingAllowanceBudgetCode", label: "LIV BUDGET", width: 120, type: "text", group: "allowances" },
  
  // NOTES
  { key: "otherDealProvisions", label: "OTHER PROVISIONS", width: 250, type: "text", group: "notes" },
  { key: "additionalNotes", label: "ADDITIONAL NOTES", width: 250, type: "text", group: "notes" },
];

const COLUMN_GROUPS = [
  { label: "RECIPIENT INFO", group: "recipient", color: "bg-blue-500/10" },
  { label: "TAX STATUS", group: "tax", color: "bg-purple-500/10" },
  { label: "ROLE DETAILS", group: "role", color: "bg-green-500/10" },
  { label: "COMPENSATION", group: "compensation", color: "bg-orange-500/10" },
  { label: "ALLOWANCES", group: "allowances", color: "bg-pink-500/10" },
  { label: "NOTES", group: "notes", color: "bg-amber-500/10" },
];

function TableCell({ row, column, value, onChange, rowIndex, onKeyDown, cellRef, isInvalid, density, onDragStart, onDragOver, onDrop, isFocused }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    if (column.type === "text-suggest" && column.key === "jobTitle" && row.department) {
      const deptSuggestions = JOB_TITLES_BY_DEPT[row.department] || [];
      setSuggestions(deptSuggestions);
    }
  }, [row.department, column.type, column.key]);
  
  if (column.type === "select" || column.type === "actions" || column.type === "status") {
    return null;
  }
  
  if (column.type === "checkbox") {
    return (
      <div className="flex items-center justify-center h-full">
        <Checkbox 
          checked={value || false} 
          onCheckedChange={(checked) => onChange(column.key, checked)}
        />
      </div>
    );
  }
  
  if (column.key === "department" || column.key === "engagementType" || column.key === "workingWeek" || column.key === "rateType" || column.key === "currency" || column.key === "overtimeType" || column.key === "alternativeContractType" || column.key === "allowAsSelfEmployedOrLoanOut" || column.key === "statusDeterminationReason" || column.key === "productionPhase" || column.key === "workingInUnitedKingdom" || column.key === "boxRentalCapCalculatedAs" || column.key === "perDiem1Currency" || column.key === "perDiem2Currency" || column.key === "livingAllowanceCurrency") {
    return (
      <select
        ref={cellRef}
        value={value || ""}
        onChange={(e) => onChange(column.key, e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full h-full border-0 bg-transparent ${density.fontSize} focus:outline-none focus:ring-2 focus:ring-primary px-1 ${isInvalid ? 'bg-red-50 border-l-2 border-red-400' : ''}`}
      >
        {column.options.map((opt) => (
          <option key={opt} value={opt}>{opt || "—"}</option>
        ))}
      </select>
    );
  }
  
  if (column.type === "date") {
    return (
      <input
        ref={cellRef}
        type="date"
        value={value || ""}
        onChange={(e) => onChange(column.key, e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full h-full border-0 bg-transparent ${density.fontSize} focus:outline-none focus:ring-2 focus:ring-primary px-1 ${isInvalid ? 'bg-red-50 border-l-2 border-red-400' : ''}`}
      />
    );
  }
  
  if (column.type === "number") {
    return (
      <input
        ref={cellRef}
        type="number"
        step="0.01"
        value={value || ""}
        onChange={(e) => onChange(column.key, e.target.value)}
        onKeyDown={onKeyDown}
        draggable={true}
        onDragStart={(e) => onDragStart && onDragStart(e, rowIndex, column.key, value)}
        onDragOver={(e) => onDragOver && onDragOver(e)}
        onDrop={(e) => onDrop && onDrop(e, rowIndex, column.key)}
        className={`w-full h-full border-0 bg-transparent ${density.fontSize} focus:outline-none focus:ring-2 focus:ring-primary px-1 text-right cursor-grab active:cursor-grabbing ${isInvalid ? 'bg-red-50 border-l-2 border-red-400' : ''}`}
        placeholder="0"
      />
    );
  }
  
  if (column.type === "text-suggest") {
    return (
      <div className="relative w-full h-full">
        <input
          ref={cellRef}
          type="text"
          value={value || ""}
          onChange={(e) => {
            onChange(column.key, e.target.value.toUpperCase());
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`w-full h-full border-0 bg-transparent ${density.fontSize} focus:outline-none focus:ring-2 focus:ring-primary px-1 uppercase ${isInvalid ? 'bg-red-50 border-l-2 border-red-400' : ''}`}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-48 bg-white border border-gray-300 shadow-lg z-50 max-h-40 overflow-y-auto">
            {suggestions.filter(s => !value || s.includes(value.toUpperCase())).map((suggestion, idx) => (
              <div
                key={idx}
                className="px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs"
                onMouseDown={() => {
                  onChange(column.key, suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <input
      ref={cellRef}
      type={column.type === "email" ? "email" : "text"}
      value={value || ""}
      onChange={(e) => onChange(column.key, column.key === "emailAddress" || column.key === "agentEmailAddress" ? e.target.value.toLowerCase() : e.target.value.toUpperCase())}
      onKeyDown={onKeyDown}
      className={`w-full h-full border-0 bg-transparent ${density.fontSize} focus:outline-none focus:ring-2 focus:ring-primary px-1 ${column.type !== "email" ? "uppercase" : ""} ${isInvalid ? 'bg-red-50 border-l-2 border-red-400' : ''}`}
    />
  );
}

export default function BulkOfferCreate() {
  const tableRef = useRef(null);
  const cellRefs = useRef({});
  
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('bulkOfferDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        return [createEmptyRow(), createEmptyRow(), createEmptyRow()];
      }
    }
    return [createEmptyRow(), createEmptyRow(), createEmptyRow()];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyPreviousSettings, setCopyPreviousSettings] = useState(true);
  const [density, setDensity] = useState("COMFORTABLE");
  const [bulkEditPanel, setBulkEditPanel] = useState(false);
  const [dragData, setDragData] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [bulkEditData, setBulkEditData] = useState({
    department: "",
    engagementType: "",
    rateType: "",
    currency: "",
    workingWeek: "",
    productionPhase: "",
    allowAsSelfEmployedOrLoanOut: "",
  });

  useEffect(() => {
    localStorage.setItem('bulkOfferDraft', JSON.stringify(rows));
  }, [rows]);

  const updateCell = (rowId, key, value) => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updated = { ...row, [key]: value };
        
        if (key === "engagementType") {
          if (value === "PAYE") {
            updated.allowAsSelfEmployedOrLoanOut = "NO";
          } else if (value === "LOAN_OUT") {
            updated.allowAsSelfEmployedOrLoanOut = "YES";
          }
        }
        
        if (key === "allowAsSelfEmployedOrLoanOut" && value === "NO") {
          updated.statusDeterminationReason = "";
          updated.otherStatusDeterminationReason = "";
        }
        
        return updated;
      }
      return row;
    }));
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    const editableColumns = COLUMNS.filter(c => !c.frozen && c.type !== "status" && c.type !== "actions");
    const totalRows = rows.length;
    
    if (e.key === "Enter") {
      e.preventDefault();
      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex < totalRows) {
        const nextCellKey = `${nextRowIndex}-${colIndex}`;
        cellRefs.current[nextCellKey]?.focus();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        const prevColIndex = colIndex - 1;
        if (prevColIndex >= 0) {
          const prevCellKey = `${rowIndex}-${prevColIndex}`;
          cellRefs.current[prevCellKey]?.focus();
        }
      } else {
        const nextColIndex = colIndex + 1;
        if (nextColIndex < editableColumns.length) {
          const nextCellKey = `${rowIndex}-${nextColIndex}`;
          cellRefs.current[nextCellKey]?.focus();
        }
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      duplicateRow(rows[rowIndex].id);
    }
  };

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    setRows(prev => [...prev, createEmptyRow(copyPreviousSettings ? lastRow : null, copyPreviousSettings)]);
  };

  const addRowBelow = (rowId) => {
    const idx = rows.findIndex(r => r.id === rowId);
    const currentRow = rows[idx];
    const newRow = createEmptyRow(copyPreviousSettings ? currentRow : null, copyPreviousSettings);
    setRows(prev => {
      const updated = [...prev];
      updated.splice(idx + 1, 0, newRow);
      return updated;
    });
  };

  const removeRow = (rowId) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(row => row.id !== rowId));
  };

  const duplicateRow = (rowId) => {
    const row = rows.find(r => r.id === rowId);
    if (!row) return;
    const newRow = {
      ...JSON.parse(JSON.stringify(row)),
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fullName: "",
      emailAddress: "",
      mobileNumber: "",
      agentEmailAddress: "",
      selected: false,
    };
    const idx = rows.findIndex(r => r.id === rowId);
    setRows(prev => {
      const updated = [...prev];
      updated.splice(idx + 1, 0, newRow);
      return updated;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = rows.every(r => r.selected);
    setRows(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const toggleSelectRow = (rowId) => {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, selected: !r.selected } : r));
  };

  const deleteSelected = () => {
    const toDelete = rows.filter(r => r.selected).length;
    if (toDelete === rows.length) {
      alert("Cannot delete all rows");
      return;
    }
    if (toDelete === 0) {
      alert("No rows selected");
      return;
    }
    setRows(prev => prev.filter(r => !r.selected));
  };

  const applyBulkEdit = () => {
    const selectedRows = rows.filter(r => r.selected);
    if (selectedRows.length === 0) {
      alert("No rows selected");
      return;
    }

    setRows(prev => prev.map(row => {
      if (row.selected) {
        const updated = { ...row };
        if (bulkEditData.department) updated.department = bulkEditData.department;
        if (bulkEditData.engagementType) {
          updated.engagementType = bulkEditData.engagementType;
          if (bulkEditData.engagementType === "PAYE") updated.allowAsSelfEmployedOrLoanOut = "NO";
          if (bulkEditData.engagementType === "LOAN_OUT") updated.allowAsSelfEmployedOrLoanOut = "YES";
        }
        if (bulkEditData.rateType) updated.rateType = bulkEditData.rateType;
        if (bulkEditData.currency) updated.currency = bulkEditData.currency;
        if (bulkEditData.workingWeek) updated.workingWeek = bulkEditData.workingWeek;
        if (bulkEditData.productionPhase) updated.productionPhase = bulkEditData.productionPhase;
        if (bulkEditData.allowAsSelfEmployedOrLoanOut) updated.allowAsSelfEmployedOrLoanOut = bulkEditData.allowAsSelfEmployedOrLoanOut;
        return updated;
      }
      return row;
    }));

    setBulkEditPanel(false);
    setBulkEditData({
      department: "",
      engagementType: "",
      rateType: "",
      currency: "",
      workingWeek: "",
      productionPhase: "",
      allowAsSelfEmployedOrLoanOut: "",
    });
  };

  const validRows = rows.filter(row => validateRow(row).valid);
  const selectedRows = rows.filter(r => r.selected);

  const handleCreateDrafts = async () => {
    const firstInvalid = rows.findIndex(row => !validateRow(row).valid);
    
    if (validRows.length === 0) {
      if (firstInvalid !== -1) {
        const rowElement = document.querySelector(`[data-row-index="${firstInvalid}"]`);
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          rowElement.classList.add('animate-pulse', 'bg-red-100');
          setTimeout(() => {
            rowElement.classList.remove('animate-pulse', 'bg-red-100');
          }, 2000);
        }
      }
      alert("Please fill in at least one complete row");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Created ${validRows.length} draft offers!`);
      localStorage.removeItem('bulkOfferDraft');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDragStart = (e, rowIndex, columnKey, value) => {
    setDragData({ rowIndex, columnKey, value });
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, targetRowIndex, targetColumnKey) => {
    e.preventDefault();
    if (!dragData || dragData.columnKey !== targetColumnKey) return;
    
    const startRow = Math.min(dragData.rowIndex, targetRowIndex);
    const endRow = Math.max(dragData.rowIndex, targetRowIndex);
    
    setRows(prev => prev.map((row, idx) => {
      if (idx > startRow && idx <= endRow) {
        return { ...row, [targetColumnKey]: dragData.value };
      }
      return row;
    }));
    
    setDragData(null);
  };

  const frozenColumns = COLUMNS.filter(c => c.frozen);
  const scrollableColumns = COLUMNS.filter(c => !c.frozen);
  const frozenWidth = frozenColumns.reduce((sum, c) => sum + c.width, 0);
  const currentDensity = ROW_DENSITY[density];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-0 bg-card border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                BULK OFFER CREATION
              </h1>
              <p className="text-xs text-muted-foreground">All fields now match Create Offer page</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-xs">
              <span className="text-muted-foreground">Density:</span>
              {["COMPACT", "COMFORTABLE", "SPACIOUS"].map(d => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`px-2 py-0.5 rounded transition-colors ${density === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'}`}
                >
                  {d[0]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-xs">
              <Checkbox 
                checked={copyPreviousSettings} 
                onCheckedChange={setCopyPreviousSettings}
                id="copy-settings"
              />
              <label htmlFor="copy-settings" className="cursor-pointer">Copy previous row settings</label>
            </div>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              {validRows.length} Ready
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="w-3 h-3 text-orange-600" />
              {rows.length - validRows.length} Incomplete
            </Badge>
            {selectedRows.length > 0 && (
              <>
                <Button onClick={() => setBulkEditPanel(true)} variant="outline" size="sm" className="gap-2">
                  <Settings2 className="w-4 h-4" /> Bulk Edit ({selectedRows.length})
                </Button>
                <Button onClick={deleteSelected} variant="outline" size="sm" className="gap-2 text-destructive">
                  <Trash className="w-4 h-4" /> Delete Selected
                </Button>
              </>
            )}
            <Button onClick={addRow} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Row
            </Button>
            <Button 
              onClick={handleCreateDrafts} 
              disabled={validRows.length === 0 || isSubmitting}
              size="sm"
              className="gap-2"
            >
              {isSubmitting ? "Creating..." : `Create ${validRows.length} Draft${validRows.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex" ref={tableRef}>
          {/* Frozen columns */}
          <div className="flex-shrink-0 border-r-2 border-primary/20 bg-card z-10" style={{ width: frozenWidth }}>
            <div className="flex border-b-2 border-border bg-muted sticky top-0" style={{ height: currentDensity.height }}>
              {frozenColumns.map((col) => (
                <div 
                  key={col.key} 
                  className={`flex items-center justify-center px-2 ${currentDensity.fontSize} font-bold text-muted-foreground border-r border-border`}
                  style={{ width: col.width, minWidth: col.width }}
                >
                  {col.key === "select" && (
                    <Checkbox checked={rows.every(r => r.selected)} onCheckedChange={toggleSelectAll} />
                  )}
                  {col.label}
                </div>
              ))}
            </div>
            {rows.map((row, rowIndex) => {
              const validation = validateRow(row);
              return (
                <div 
                  key={row.id} 
                  data-row-index={rowIndex}
                  className={`flex border-b border-border transition-colors ${
                    row.selected ? 'bg-blue-50' : rowIndex % 2 === 0 ? "bg-card" : "bg-muted/30"
                  } ${focusedCell?.rowIndex === rowIndex ? 'ring-2 ring-primary' : ''}`}
                  style={{ height: currentDensity.height }}
                >
                  <div 
                    className="flex items-center justify-center border-r border-border"
                    style={{ width: 40, minWidth: 40 }}
                  >
                    <Checkbox 
                      checked={row.selected || false} 
                      onCheckedChange={() => toggleSelectRow(row.id)}
                    />
                  </div>
                  <div 
                    className="flex items-center justify-center gap-1 border-r border-border"
                    style={{ width: 100, minWidth: 100 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => addRowBelow(row.id)}
                      title="Add row below"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => duplicateRow(row.id)}
                      title="Duplicate (Ctrl+D)"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div 
                    className="flex items-center justify-center border-r border-border"
                    style={{ width: 120, minWidth: 120 }}
                  >
                    {validation.valid ? (
                      <Badge variant="outline" className="gap-1 text-green-600 border-green-300 bg-green-50">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300 bg-orange-50 text-[10px]">
                        <AlertCircle className="w-3 h-3" /> {validation.error}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrollable columns */}
          <div className="flex-1 overflow-x-auto">
            <div style={{ minWidth: scrollableColumns.reduce((sum, c) => sum + c.width, 0) }}>
              {/* Column group headers */}
              <div className="flex border-b border-border bg-muted/50 sticky top-0" style={{ height: 24 }}>
                {COLUMN_GROUPS.map((group) => {
                  const groupCols = scrollableColumns.filter(c => c.group === group.group);
                  if (groupCols.length === 0) return null;
                  const groupWidth = groupCols.reduce((sum, c) => sum + c.width, 0);
                  return (
                    <div 
                      key={group.label}
                      className={`flex items-center justify-center px-2 text-[10px] font-bold text-muted-foreground border-r border-border ${group.color}`}
                      style={{ width: groupWidth, minWidth: groupWidth }}
                    >
                      {group.label}
                    </div>
                  );
                })}
              </div>
              {/* Column headers */}
              <div className="flex border-b-2 border-border bg-muted sticky top-6" style={{ height: currentDensity.height }}>
                {scrollableColumns.map((col) => (
                  <div 
                    key={col.key} 
                    className={`flex items-center justify-center px-2 ${currentDensity.fontSize} font-bold text-muted-foreground border-r border-border ${col.required ? "text-primary" : ""} group relative`}
                    style={{ width: col.width, minWidth: col.width }}
                  >
                    {col.label}
                    {col.required && <span className="text-destructive ml-1">*</span>}
                    {col.tooltip && (
                      <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded shadow-lg z-50 w-48 whitespace-pre-line border border-border">
                        {col.tooltip}
                      </div>
                    )}
                    {col.tooltip && <Info className="w-3 h-3 ml-1 text-muted-foreground" />}
                  </div>
                ))}
              </div>
              {/* Data rows */}
              {rows.map((row, rowIndex) => {
                const validation = validateRow(row);
                return (
                  <div 
                    key={row.id} 
                    className={`flex border-b border-border transition-colors ${
                      row.selected ? 'bg-blue-50' : rowIndex % 2 === 0 ? "bg-card" : "bg-muted/30"
                    } ${focusedCell?.rowIndex === rowIndex ? 'ring-2 ring-primary' : ''}`}
                    style={{ height: currentDensity.height }}
                  >
                    {scrollableColumns.map((col, colIndex) => {
                      const isInvalid = !validation.valid && col.required && !row[col.key];
                      return (
                        <div 
                          key={col.key} 
                          className="border-r border-border relative"
                          style={{ width: col.width, minWidth: col.width }}
                        >
                          <TableCell 
                            row={row}
                            column={col}
                            value={row[col.key]}
                            onChange={(key, value) => updateCell(row.id, key, value)}
                            rowIndex={rowIndex}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            cellRef={(el) => {
                              if (el) cellRefs.current[`${rowIndex}-${colIndex}`] = el;
                            }}
                            isInvalid={isInvalid}
                            density={currentDensity}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isFocused={focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Edit Panel */}
      {bulkEditPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Bulk Edit {selectedRows.length} Rows</h2>
              <Button variant="ghost" size="icon" onClick={() => setBulkEditPanel(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Department</label>
                <select
                  value={bulkEditData.department}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {DEPARTMENTS.filter(d => d).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Engagement Type</label>
                <select
                  value={bulkEditData.engagementType}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, engagementType: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {ENGAGEMENT_TYPES.filter(d => d).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Production Phase</label>
                <select
                  value={bulkEditData.productionPhase}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, productionPhase: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {PRODUCTION_PHASES.filter(d => d).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Self-Employed/Loan Out</label>
                <select
                  value={bulkEditData.allowAsSelfEmployedOrLoanOut}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, allowAsSelfEmployedOrLoanOut: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Rate Type</label>
                <select
                  value={bulkEditData.rateType}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, rateType: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {RATE_TYPES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Currency</label>
                <select
                  value={bulkEditData.currency}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {CURRENCIES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Working Week</label>
                <select
                  value={bulkEditData.workingWeek}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, workingWeek: e.target.value }))}
                  className="w-full border rounded px-2 py-1 mt-1 bg-background"
                >
                  <option value="">-- Keep existing --</option>
                  {WORKING_WEEKS.filter(d => d).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={applyBulkEdit} className="flex-1">
                Apply to Selected
              </Button>
              <Button onClick={() => setBulkEditPanel(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-card border-t px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{rows.length} total rows</span>
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" /> {validRows.length} ready
            </span>
            <span className="flex items-center gap-1 text-orange-600">
              <AlertCircle className="w-4 h-4" /> {rows.length - validRows.length} incomplete
            </span>
            {selectedRows.length > 0 && (
              <span className="flex items-center gap-1 text-primary">
                <Users className="w-4 h-4" /> {selectedRows.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              💡 Tips: Enter ↓ next row • Tab → next field • Ctrl+D duplicate • Drag numbers to fill
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}