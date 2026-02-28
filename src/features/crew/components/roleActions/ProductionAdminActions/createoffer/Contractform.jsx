import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  Printer, HelpCircle, Search,
  Package, Monitor, Code, Wrench, Car, Smartphone, UtensilsCrossed, Home,
  CalendarIcon, ChevronDown, ChevronRight,
} from "lucide-react";
import { cn } from "../../../../../../shared/config/utils";
import { formatCurrency, formatRateHol } from "../../../../utils/rateCalculations";

// ── shadcn/ui imports ──────────────────────────────────────────────────────
import { Button }           from "../../../../../../shared/components/ui/button";
import { Input }            from "../../../../../../shared/components/ui/input";
import { Label }            from "../../../../../../shared/components/ui/label";
import { Textarea }         from "../../../../../../shared/components/ui/textarea";
import { Checkbox }         from "../../../../../../shared/components/ui/checkbox";
import { Badge }            from "../../../../../../shared/components/ui/badge";
import { Calendar }         from "../../../../../../shared/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../../../shared/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../shared/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../../../../../shared/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../../shared/components/ui/tooltip";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../../../../shared/components/ui/select";

// ── Data constants ─────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Accounts","Action Vehicles","Aerial","Animals","Animation","Armoury","Art","Assets",
  "Assistant Directors","Camera","Cast","Chaperones","Choreography","Clearances",
  "Computer Graphics","Construction","Continuity","Costume","Costume FX","Covid Safety",
  "Creature Effects","DIT","Digital Assets","Digital Playback","Director","Documentary",
  "Drapes","EPK","Editorial","Electrical","Electrical Rigging","Franchise","Greens",
  "Greenscreens","Grip","Hair and Makeup","Health and Safety","IT","Locations","Marine",
  "Medical","Military","Music","Photography","Picture Vehicles","Post Production",
  "Production","Prop Making","Props","Prosthetics","Publicity","Puppeteer","Rigging",
  "SFX","Script","Script Editing","Security","Set Dec","Sound","Standby","Storyboard",
  "Studio Unit","Stunts","Supporting Artist","Sustainability","Transport","Tutors",
  "Underwater","VFX","Video","Voice",
];

const JOB_TITLES = [
  "1st AC (SELF-EMPLOYED)","1st AC - A Camera (SELF-EMPLOYED)","1st AC - B Camera (SELF-EMPLOYED)",
  "1st Assistant Accountant (PAYE)","1st Assistant Director (SELF-EMPLOYED)",
  "1st Assistant Editor (SELF-EMPLOYED)","1st Boom Operator (SELF-EMPLOYED)",
  "2nd Assistant Director (SELF-EMPLOYED)","2nd Assistant Editor (PAYE)",
  "3D Concept Art Director (SELF-EMPLOYED)","3D Modeller (SELF-EMPLOYED)",
  "3rd Assistant Director (PAYE)","Accountant (PAYE)","Accountant (SELF-EMPLOYED)",
  "Action Props Master (SELF-EMPLOYED)","Action Vehicles Co-ordinator (SELF-EMPLOYED)",
  "Actor (PAYE)","Additional 1st AD (SELF-EMPLOYED)","Admin Assistant (PAYE)",
  "Aerial Coordinator (SELF-EMPLOYED)","Aerial DOP (SELF-EMPLOYED)",
  "Animal Trainer (SELF-EMPLOYED)","Animator (SELF-EMPLOYED)",
  "Armourer (SELF-EMPLOYED)","Art Department Co-ordinator (PAYE)",
  "Art Director (SELF-EMPLOYED)","Assembly Editor (SELF-EMPLOYED)",
  "Assistant Accountant (PAYE)","Assistant Art Director (SELF-EMPLOYED)",
  "Assistant Buyer (PAYE)","Assistant Costume Designer (SELF-EMPLOYED)",
  "Assistant Director - Children (PAYE)","Assistant Editor (PAYE)",
  "Assistant Location Manager (PAYE)","Assistant Production Coordinator (PAYE)",
  "Best Boy (ELECTRICAL SELF-EMPLOYED)","Best Boy Grip (SELF-EMPLOYED)",
  "Boom Operator (SELF-EMPLOYED)","Camera Operator (SELF-EMPLOYED)",
  "Carpenter (CONSTRUCTION SELF-EMPLOYED)","Casting Director (SELF-EMPLOYED)",
  "Chaperone (SELF-EMPLOYED)","Choreographer (SELF-EMPLOYED)",
  "Concept Artist (SELF-EMPLOYED)","Construction Manager (SELF-EMPLOYED)",
  "Costume Designer (SELF-EMPLOYED)","Costume Supervisor (SELF-EMPLOYED)",
  "DOP (SELF-EMPLOYED)","Director (SELF-EMPLOYED)",
  "Editor (SELF-EMPLOYED)","Electrician (ELECTRICAL SELF-EMPLOYED)",
  "Executive Producer (SELF-EMPLOYED)","Fight Coordinator (SELF-EMPLOYED)",
  "Financial Controller (SELF-EMPLOYED)","Floor Runner (PAYE)",
  "Gaffer (ELECTRICAL SELF-EMPLOYED)","Graphic Designer (SELF-EMPLOYED)",
  "Grip (SELF-EMPLOYED)","Hair and Makeup Artist (SELF-EMPLOYED)",
  "Hair and Makeup Designer (SELF-EMPLOYED)","Health and Safety Advisor (SELF-EMPLOYED)",
  "Key Grip (SELF-EMPLOYED)","Line Producer (SELF-EMPLOYED)",
  "Location Manager (PAYE)","Makeup Artist (SELF-EMPLOYED)",
  "Medic (SELF-EMPLOYED)","Model Maker (SELF-EMPLOYED)",
  "Music Editor (SELF-EMPLOYED)","Nurse (SELF-EMPLOYED)",
  "Painter (CONSTRUCTION SELF-EMPLOYED)","Photographer (SELF-EMPLOYED)",
  "Post Production Coordinator (PAYE)","Post Production Supervisor (SELF-EMPLOYED)",
  "Producer (SELF-EMPLOYED)","Production Accountant (SELF-EMPLOYED)",
  "Production Buyer (SELF-EMPLOYED)","Production Coordinator (PAYE)",
  "Production Designer (SELF-EMPLOYED)","Production Manager (SELF-EMPLOYED)",
  "Production Runner (PAYE)","Production Sound Mixer (SELF-EMPLOYED)",
  "Property Master (SELF-EMPLOYED)","Prosthetics Make Up Artist (SELF-EMPLOYED)",
  "Publicist (SELF-EMPLOYED)","Runner (PAYE)",
  "SFX Supervisor (SELF-EMPLOYED)","SFX Technician (SELF-EMPLOYED)",
  "Script Supervisor (SELF-EMPLOYED)","Sculptor (SELF-EMPLOYED)",
  "Set Decorator (SELF-EMPLOYED)","Set Designer (SELF-EMPLOYED)",
  "Sound Mixer (SELF-EMPLOYED)","Standby Props (SELF-EMPLOYED)",
  "Steadicam Operator (SELF-EMPLOYED)","Stills Photographer (SELF-EMPLOYED)",
  "Storyboard Artist (SELF-EMPLOYED)","Stunt Coordinator (SELF-EMPLOYED)",
  "Stunt Performer (SELF-EMPLOYED)","Transport Captain (SELF-EMPLOYED)",
  "Transport Manager (SELF-EMPLOYED)","Unit Manager (SELF-EMPLOYED)",
  "VFX Editor (SELF-EMPLOYED)","VFX Producer (SELF-EMPLOYED)",
  "VFX Supervisor (SELF-EMPLOYED)","Video Operator (SELF-EMPLOYED)",
  "Wardrobe Supervisor (SELF-EMPLOYED)","Orchestrator and Conductor (SELF-EMPLOYED)",
];

// ── Shared className shorthands ────────────────────────────────────────────
const SI = "rounded-lg mx-1 my-px cursor-pointer hover:bg-accent/30 focus:bg-accent/30 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-semibold";
const ST = "w-full h-9 bg-input border-border hover:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:border-primary [&>svg]:text-primary transition-all";
const SC = "border-border rounded-xl shadow-lg shadow-primary/10 z-[200] bg-popover";

// ── CollapsibleSection ─────────────────────────────────────────────────────
function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}
      className="border border-border rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <button type="button"
          className="w-full flex items-center justify-between px-3 py-2 bg-accent/10 hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <span className="text-xs font-medium text-foreground">{title}</span>
          </div>
          {open
            ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
            : <ChevronRight className="h-3.5 w-3.5 text-primary" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 py-2 pl-6 space-y-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ── TooltipLabel ───────────────────────────────────────────────────────────
function TooltipLabel({ htmlFor, label, tooltip }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground/80">
          {label}
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// ── DatePicker ─────────────────────────────────────────────────────────────
function DatePicker({ id, value, onChange, onFocus, onBlur, placeholder = "Pick a date" }) {
  const date = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <Popover onOpenChange={(open) => { if (open) onFocus?.(); else onBlur?.(); }}>
      <PopoverTrigger asChild>
        <Button id={id} variant="outline"
          className={cn(
            "w-full h-9 justify-start text-left font-normal bg-input border-border hover:border-primary/50 hover:bg-input text-sm",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary shrink-0" />
          {date ? format(date, "dd MMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border z-[200]" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => { onChange(d ? format(d, "yyyy-MM-dd") : ""); onBlur?.(); }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ── Main ContractForm ──────────────────────────────────────────────────────

export function ContractForm({
  data,
  onChange,
  onPrint,
  onFieldFocus,
  onFieldBlur,
  calculatedRates,
  engineSettings,
  salaryBudgetCodes,
  setSalaryBudgetCodes,
  salaryTags,
  setSalaryTags,
  overtimeBudgetCodes,
  setOvertimeBudgetCodes,
  overtimeTags,
  setOvertimeTags,
  allowances,
  setAllowances,
}) {
  const NO_UPPER = [
    "overtime","allowSelfEmployed","workingInUK","statusDeterminationReason",
    "engagementType","dailyOrWeekly","unit","department","subDepartment",
    "currency","alternativeContract","searchAllDepartments","startDate","endDate",
    "isViaAgent","createOwnJobTitle","searchAllDepartments",
  ];

  const set = (field, value) => {
    const v = typeof value === "string" && !NO_UPPER.includes(field)
      ? value.toUpperCase() : value;
    onChange({ ...data, [field]: v });
  };

  const updateArr = (setter, i, value) =>
    setter((prev) => { const u = [...prev]; u[i] = value.toUpperCase(); return u; });

  const updateAllowance = (key, field, value) => {
    const v = typeof value === "string" ? value.toUpperCase() : value;
    setAllowances((prev) => ({ ...prev, [key]: { ...prev[key], [field]: v } }));
  };

  const cs = { GBP:"£", USD:"$", EUR:"€", AUD:"A$", CAD:"C$", NZD:"NZ$", DKK:"kr", ISK:"kr" }[data.currency] ?? "£";

  return (
    <div className="space-y-3">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-primary/60">
        <span className="hover:text-primary cursor-pointer transition-colors">Werwulf</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Offers</span>
        <span>/</span>
        <span className="text-primary font-medium">Create offer</span>
      </nav>

      <h2 className="text-base font-semibold text-foreground">New Offer</h2>

      <div className="space-y-2">

        {/* ── Recipient ── */}
        <CollapsibleSection title="Recipient">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs text-foreground/80">Full name</Label>
            <Input id="fullName" value={data.fullName ?? ""}
              onChange={(e) => set("fullName", e.target.value)}
              onFocus={() => onFieldFocus?.("fullName")} onBlur={onFieldBlur}
              placeholder="FULL NAME" className="h-9 bg-input text-sm uppercase" />
          </div>

          <div className="space-y-1.5">
            <TooltipLabel htmlFor="email" label="Email"
              tooltip="Ensure this is the recipient's preferred email address for use on their engine account." />
            <Input id="email" type="email" value={data.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              onFocus={() => onFieldFocus?.("email")} onBlur={onFieldBlur}
              placeholder="EMAIL ADDRESS" className="h-9 bg-input text-sm uppercase" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobileNumber" className="text-xs text-foreground/80">Mobile number</Label>
            <Input id="mobileNumber" value={data.mobileNumber ?? ""}
              onChange={(e) => set("mobileNumber", e.target.value)}
              onFocus={() => onFieldFocus?.("mobileNumber")} onBlur={onFieldBlur}
              placeholder="MOBILE NUMBER" className="h-9 bg-input text-sm" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox id="isViaAgent" checked={!!data.isViaAgent}
              onCheckedChange={(v) => set("isViaAgent", v)} />
            <Label htmlFor="isViaAgent" className="text-sm font-normal cursor-pointer">
              Check the box if this deal is via an agent
            </Label>
          </div>

          {data.isViaAgent && (
            <div className="space-y-1.5">
              <Label htmlFor="agentEmail" className="text-xs text-foreground/80">Agent email</Label>
              <Input id="agentEmail" type="email" value={data.agentEmail ?? ""}
                onChange={(e) => set("agentEmail", e.target.value)}
                onFocus={() => onFieldFocus?.("agentEmail")} onBlur={onFieldBlur}
                placeholder="AGENT EMAIL" className="h-9 bg-input text-sm uppercase" />
            </div>
          )}
        </CollapsibleSection>

        {/* ── Alternative Contract ── */}
        <CollapsibleSection title="Alternative Contract" defaultOpen={false}>
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Contract type</Label>
            <Select value={data.alternativeContract ?? ""}
              onValueChange={(v) => set("alternativeContract", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="hod">HoD</SelectItem>
                <SelectItem className={SI} value="no_contract">No contract (all other documents to be processed)</SelectItem>
                <SelectItem className={SI} value="senior">Senior agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>

        {/* ── Unit and Department ── */}
        <CollapsibleSection title="Unit and Department">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Unit</Label>
            <Select value={data.unit ?? ""} onValueChange={(v) => set("unit", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="main">Main</SelectItem>
                <SelectItem className={SI} value="splinter_camera">Splinter Camera</SelectItem>
                <SelectItem className={SI} value="vfx_elements">VFX Elements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Department</Label>
            <Select value={data.department ?? ""} onValueChange={(v) => set("department", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select department..." /></SelectTrigger>
              <SelectContent className={SC}>
                {DEPARTMENTS.map((d) => (
                  <SelectItem className={SI} key={d} value={d.toLowerCase().replace(/\s+/g, "_")}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Sub-department</Label>
            <Select value={data.subDepartment ?? ""} onValueChange={(v) => set("subDepartment", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="new">New</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>

        {/* ── Role ── */}
        <CollapsibleSection title="Role">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Job title</Label>
            <JobTitleCombobox
              value={data.jobTitle ?? ""}
              onChange={(v) => set("jobTitle", v)}
              onFocus={() => onFieldFocus?.("jobTitle")}
              onBlur={onFieldBlur}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="searchAllDepts" checked={!!data.searchAllDepartments}
              onCheckedChange={(v) => set("searchAllDepartments", v)} />
            <Label htmlFor="searchAllDepts" className="text-sm font-normal cursor-pointer">
              Search job titles from all departments?
            </Label>
          </div>

          <p className="text-xs text-muted-foreground">
            Engagement type (e.g. PAYE) is shown as guidance only, can be amended later, and won't appear in the chosen job title.
          </p>

          <div className="flex items-center gap-2">
            <Checkbox id="createOwnTitle" checked={!!data.createOwnJobTitle}
              onCheckedChange={(v) => set("createOwnJobTitle", v)} />
            <Label htmlFor="createOwnTitle" className="text-sm font-normal cursor-pointer">
              Create your own job title (only available to this project)
            </Label>
          </div>

          {data.createOwnJobTitle && (
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/80">New job title</Label>
              <Input value={data.newJobTitle ?? ""}
                onChange={(e) => set("newJobTitle", e.target.value)}
                onFocus={() => onFieldFocus?.("newJobTitle")} onBlur={onFieldBlur}
                placeholder="Add your own job title" className="h-9 bg-input text-sm uppercase" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="jobTitleSuffix" className="text-xs text-foreground/80">Job title suffix</Label>
            <Input id="jobTitleSuffix" value={data.jobTitleSuffix ?? ""}
              onChange={(e) => set("jobTitleSuffix", e.target.value)}
              onFocus={() => onFieldFocus?.("jobTitleSuffix")} onBlur={onFieldBlur}
              placeholder="e.g. 'to Cast #1'" className="h-9 bg-input text-sm uppercase" />
          </div>
        </CollapsibleSection>

        {/* ── Tax Status ── */}
        <CollapsibleSection title="Tax Status" defaultOpen={false}>
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Allow as self-employed or loan out?</Label>
            <RadioGroup value={data.allowSelfEmployed ?? ""}
              onValueChange={(v) => set("allowSelfEmployed", v)}
              className="flex gap-4">
              {["yes","no"].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`se_${v}`} />
                  <Label htmlFor={`se_${v}`} className="text-sm font-normal capitalize cursor-pointer">{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Status determination reason</Label>
            <Select value={data.statusDeterminationReason ?? ""}
              onValueChange={(v) => set("statusDeterminationReason", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="hmrc_list">Job title appears on HMRC list of 'Roles normally treated as self-employed'</SelectItem>
                <SelectItem className={SI} value="cest">Our CEST assessment has confirmed 'Off-payroll working rules (IR35) do not apply'</SelectItem>
                <SelectItem className={SI} value="lorimer">You have supplied a valid Lorimer letter</SelectItem>
                <SelectItem className={SI} value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.statusDeterminationReason === "other" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/80">Other reason</Label>
              <Input value={data.otherStatusDeterminationReason ?? ""}
                onChange={(e) => set("otherStatusDeterminationReason", e.target.value)}
                onFocus={() => onFieldFocus?.("otherStatusDeterminationReason")} onBlur={onFieldBlur}
                className="h-9 bg-input text-sm uppercase" />
            </div>
          )}
        </CollapsibleSection>

        {/* ── Place of Work ── */}
        <CollapsibleSection title="Place of Work" defaultOpen={false}>
          <div className="space-y-1.5">
            <TooltipLabel
              label="Regular site of work (on Shoot days)"
              tooltip="On set = crew whose overtime is calculated based on the shooting day. Off set = crew whose overtime is always based on a SWD." />
            <Select value={data.regularSiteOfWork ?? ""} onValueChange={(v) => set("regularSiteOfWork", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="on_set">On set</SelectItem>
                <SelectItem className={SI} value="off_set">Off set</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <TooltipLabel
              label="Working in the UK?"
              tooltip="Yes = recipient will be required to submit proof of Right to Work in the UK." />
            <RadioGroup value={data.workingInUK ?? ""}
              onValueChange={(v) => set("workingInUK", v)}
              className="flex gap-4">
              {[{v:"yes",l:"Yes"},{v:"never",l:"Never"}].map(({v,l}) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`uk_${v}`} />
                  <Label htmlFor={`uk_${v}`} className="text-sm font-normal cursor-pointer">{l}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleSection>

        {/* ── Engagement ── */}
        <CollapsibleSection title="Engagement">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">
              Start date <span className="text-destructive">*</span>
            </Label>
            <DatePicker id="startDate" value={data.startDate}
              onChange={(v) => set("startDate", v)}
              onFocus={() => onFieldFocus?.("startDate")} onBlur={onFieldBlur}
              placeholder="Pick start date" />
          </div>

          <div className="space-y-1.5">
            <TooltipLabel label="End date (optional)"
              tooltip="The End date will appear in the contract if your templates have a slot for it." />
            <DatePicker id="endDate" value={data.endDate}
              onChange={(v) => set("endDate", v)}
              onFocus={() => onFieldFocus?.("endDate")} onBlur={onFieldBlur}
              placeholder="Pick end date" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Daily or weekly</Label>
            <Select value={data.dailyOrWeekly ?? ""} onValueChange={(v) => set("dailyOrWeekly", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="daily">Daily</SelectItem>
                <SelectItem className={SI} value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Engagement type</Label>
            <Select value={data.engagementType ?? ""} onValueChange={(v) => set("engagementType", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="loan_out">LOAN OUT</SelectItem>
                <SelectItem className={SI} value="paye">PAYE</SelectItem>
                <SelectItem className={SI} value="schd">SCHD (DAILY/WEEKLY)</SelectItem>
                <SelectItem className={SI} value="long_form">LONG FORM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Working week</Label>
            <Select value={data.workingWeek ?? ""} onValueChange={(v) => set("workingWeek", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                <SelectItem className={SI} value="5">5 days</SelectItem>
                <SelectItem className={SI} value="5.5">5.5 days</SelectItem>
                <SelectItem className={SI} value="5_6">5/6 days</SelectItem>
                <SelectItem className={SI} value="6">6 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>

        {/* ── Rates ── */}
        <CollapsibleSection title="Rates">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Currency</Label>
            <Select value={data.currency ?? "GBP"} onValueChange={(v) => set("currency", v)}>
              <SelectTrigger className={ST}><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className={SC}>
                {["AUD","CAD","DKK","EUR","GBP","ISK","NZD","USD"].map((c) => (
                  <SelectItem className={SI} key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feePerDay" className="text-xs text-foreground/80">
              Fee per day including holiday <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">{cs}</span>
              <Input id="feePerDay" value={data.feePerDay ?? ""}
                onChange={(e) => set("feePerDay", e.target.value)}
                onFocus={() => onFieldFocus?.("feePerDay")} onBlur={onFieldBlur}
                className="h-9 bg-input pl-7 text-sm" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">Overtime</Label>
            <RadioGroup value={data.overtime ?? "calculated"}
              onValueChange={(v) => set("overtime", v)}
              className="flex flex-col gap-1.5">
              {[{v:"calculated",l:"Calculated per agreement"},{v:"custom",l:"Custom overtime rates"}].map(({v,l}) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`ot_${v}`} />
                  <Label htmlFor={`ot_${v}`} className="text-sm font-normal cursor-pointer">{l}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {data.overtime === "custom" && (
            <div className="space-y-2 pt-1">
              {[
                {id:"otherOT",    label:"Other O/T"},
                {id:"cameraOTSWD",  label:"Camera O/T (SWD)"},
                {id:"cameraOTSCWD", label:"Camera O/T (SCWD)"},
                {id:"cameraOTCWD",  label:"Camera O/T (CWD)"},
              ].map(({id, label}) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-xs text-foreground/80">
                    {label} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">{cs}</span>
                    <Input id={id} value={data[id] ?? ""}
                      onChange={(e) => set(id, e.target.value)}
                      onFocus={() => onFieldFocus?.(id)} onBlur={onFieldBlur}
                      className="h-9 bg-input pl-7 text-sm" placeholder="0.00" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* ── Salary Table ── */}
        <CollapsibleSection title="Salary">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Item","Budget Code","Tag","Rate / Hol","Gross"].map((h) => (
                    <th key={h} className={cn("py-1.5 px-1 font-medium text-primary uppercase tracking-wider text-[10px]", h==="Gross"?"text-right":"text-left")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calculatedRates.salary.map((row, i) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-accent/10">
                    <td className="py-1.5 px-1 text-foreground/80">{row.item}</td>
                    <td className="py-0.5 px-1">
                      <input type="text" value={salaryBudgetCodes[i] || ""}
                        onChange={(e) => updateArr(setSalaryBudgetCodes, i, e.target.value)}
                        onFocus={() => onFieldFocus?.(`salaryRow_${i}`)} onBlur={onFieldBlur}
                        className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
                    </td>
                    <td className="py-0.5 px-1">
                      <input type="text" value={salaryTags[i] || ""}
                        onChange={(e) => updateArr(setSalaryTags, i, e.target.value)}
                        onFocus={() => onFieldFocus?.(`salaryRow_${i}`)} onBlur={onFieldBlur}
                        className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
                    </td>
                    <td className="py-1.5 px-1 text-foreground/80">{formatRateHol(row.rate, row.hol, cs)}</td>
                    <td className="py-1.5 px-1 text-right text-foreground/80">{formatCurrency(row.gross, cs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ── Overtime Table ── */}
        <CollapsibleSection title="Overtime">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Item","Budget Code","Tag","Rate / Hol","Gross"].map((h) => (
                    <th key={h} className={cn("py-1.5 px-1 font-medium text-primary uppercase tracking-wider text-[10px]", h==="Gross"?"text-right":"text-left")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calculatedRates.overtime.map((row, i) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-accent/20">
                    <td className="py-1.5 px-1 text-foreground/80">{row.item}</td>
                    <td className="py-0.5 px-1">
                      <input type="text" value={overtimeBudgetCodes[i] || ""}
                        onChange={(e) => updateArr(setOvertimeBudgetCodes, i, e.target.value)}
                        onFocus={() => onFieldFocus?.(`overtimeRow_${i}`)} onBlur={onFieldBlur}
                        className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
                    </td>
                    <td className="py-0.5 px-1">
                      <input type="text" value={overtimeTags[i] || ""}
                        onChange={(e) => updateArr(setOvertimeTags, i, e.target.value)}
                        onFocus={() => onFieldFocus?.(`overtimeRow_${i}`)} onBlur={onFieldBlur}
                        className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
                    </td>
                    <td className="py-1.5 px-1 text-foreground/80">{formatRateHol(row.rate, row.hol, cs)}</td>
                    <td className="py-1.5 px-1 text-right text-foreground/80">{formatCurrency(row.gross, cs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ── Allowances ── */}
        <CollapsibleSection title="Allowances">
          <p className="text-xs text-muted-foreground">
            Enable allowances below.{" "}
            <span className="font-medium text-foreground/80">Budget Code</span> and{" "}
            <span className="font-medium text-foreground/80">Tag</span> are editable and hidden from print.
          </p>

          <div className="space-y-2">
          {[
            {key:"boxRental",  label:"BOX RENTAL",            icon:Package,         type:"feeWeekWithCap", hasDescription:true  },
            {key:"computer",   label:"COMPUTER ALLOWANCE",    icon:Monitor,         type:"feeWeekWithCap", hasDescription:false },
            {key:"software",   label:"SOFTWARE ALLOWANCE",    icon:Code,            type:"feeWeek",        hasDescription:true  },
            {key:"equipment",  label:"EQUIPMENT RENTAL",      icon:Wrench,          type:"feeWeek",        hasDescription:true  },
            {key:"vehicle",    label:"VEHICLE ALLOWANCE",     icon:Car,             type:"feeWeek",        hasDescription:false },
            {key:"mobile",     label:"MOBILE PHONE ALLOWANCE",icon:Smartphone,      type:"feeWeek",        hasDescription:false },
            {key:"living",     label:"LIVING ALLOWANCE",      icon:Home,            type:"living",         hasDescription:false },
            {key:"perDiem1",   label:"PER DIEM 1",            icon:UtensilsCrossed, type:"perDiem",        hasDescription:false },
            {key:"perDiem2",   label:"PER DIEM 2",            icon:UtensilsCrossed, type:"perDiem",        hasDescription:false },
          ].map(({key, label, icon: Icon, type, hasDescription}) => {
            const a = allowances[key];
            return (
              <div key={key} className="border border-border rounded-lg overflow-hidden">
                {/* Allowance header */}
                <div className="flex items-center justify-between px-3 py-2 bg-accent/20">
                  <div className="flex items-center gap-2">
                    <Checkbox id={`allow_${key}`} checked={!!a.enabled}
                      onCheckedChange={(v) => updateAllowance(key, "enabled", v)} />
                    <Label htmlFor={`allow_${key}`} className="flex items-center gap-1.5 cursor-pointer">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary tracking-wide">{label}</span>
                    </Label>
                  </div>
                  <Badge variant="outline"
                    className={cn("text-[10px] px-2 py-0 h-5 rounded-full font-medium",
                      a.enabled ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground")}>
                    {a.enabled ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>

                {a.enabled && (
                  <div className="px-3 py-2 space-y-2">
                    {/* Budget Code + Tag */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Budget Code</Label>
                        <Input value={a.budgetCode ?? ""}
                          onChange={(e) => updateAllowance(key, "budgetCode", e.target.value)}
                          onFocus={() => onFieldFocus?.(`allowance_${key}`)} onBlur={onFieldBlur}
                          className="h-8 bg-input text-xs font-mono uppercase" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Tag</Label>
                        <Input value={a.tag ?? ""}
                          onChange={(e) => updateAllowance(key, "tag", e.target.value)}
                          onFocus={() => onFieldFocus?.(`allowance_${key}`)} onBlur={onFieldBlur}
                          className="h-8 bg-input text-xs font-mono uppercase" />
                      </div>
                    </div>

                    {hasDescription && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <Input value={a.description ?? ""}
                          onChange={(e) => updateAllowance(key, "description", e.target.value)}
                          onFocus={() => onFieldFocus?.(`allowance_${key}`)} onBlur={onFieldBlur}
                          className="h-8 bg-muted text-xs uppercase" />
                      </div>
                    )}

                    {(type === "feeWeekWithCap" || type === "feeWeek") && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Fee Per Week</Label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">£</span>
                            <Input value={a.feePerWeek ?? ""}
                              onChange={(e) => updateAllowance(key, "feePerWeek", e.target.value)}
                              onFocus={() => onFieldFocus?.(`allowance_${key}`)} onBlur={onFieldBlur}
                              className="h-8 bg-input pl-5 text-xs" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Terms</Label>
                          <Input value={a.terms ?? ""}
                            onChange={(e) => updateAllowance(key, "terms", e.target.value)}
                            onFocus={() => onFieldFocus?.(`allowance_${key}`)} onBlur={onFieldBlur}
                            className="h-8 bg-muted text-xs uppercase" />
                        </div>
                      </div>
                    )}

                    {type === "perDiem" && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Currency</Label>
                            <Select value={a.currency ?? "GBP"} onValueChange={(v) => updateAllowance(key, "currency", v)}>
                              <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={SC}>
                                <SelectItem className={SI} value="GBP">GBP (£)</SelectItem>
                                <SelectItem className={SI} value="USD">USD ($)</SelectItem>
                                <SelectItem className={SI} value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Shoot Day</Label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">{a.currency==="USD"?"$":"£"}</span>
                              <Input value={a.shootDayRate ?? ""}
                                onChange={(e) => updateAllowance(key, "shootDayRate", e.target.value)}
                                className="h-8 bg-input pl-5 text-xs" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Non-Shoot</Label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">{a.currency==="USD"?"$":"£"}</span>
                              <Input value={a.nonShootDayRate ?? ""}
                                onChange={(e) => updateAllowance(key, "nonShootDayRate", e.target.value)}
                                className="h-8 bg-input pl-5 text-xs" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Terms</Label>
                          <Input value={a.terms ?? ""}
                            onChange={(e) => updateAllowance(key, "terms", e.target.value)}
                            className="h-8 bg-muted text-xs uppercase" />
                        </div>
                      </>
                    )}

                    {type === "living" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Currency</Label>
                          <Select value={a.currency ?? "GBP"} onValueChange={(v) => updateAllowance(key, "currency", v)}>
                            <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={SC}>
                              <SelectItem className={SI} value="GBP">GBP (£)</SelectItem>
                              <SelectItem className={SI} value="USD">USD ($)</SelectItem>
                              <SelectItem className={SI} value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Weekly Rate</Label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">£</span>
                            <Input value={a.weeklyRate ?? ""}
                              onChange={(e) => updateAllowance(key, "weeklyRate", e.target.value)}
                              className="h-8 bg-input pl-5 text-xs" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Terms</Label>
                          <Input value={a.terms ?? ""}
                            onChange={(e) => updateAllowance(key, "terms", e.target.value)}
                            className="h-8 bg-muted text-xs uppercase" />
                        </div>
                      </div>
                    )}

                    {/* Cap + Payable In */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Cap Calculated As</Label>
                        <Select value={a.capCalculatedAs ?? ""} onValueChange={(v) => updateAllowance(key, "capCalculatedAs", v)}>
                          <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent className={SC}>
                            <SelectItem className={SI} value="flat_figure">FLAT FIGURE</SelectItem>
                            <SelectItem className={SI} value="weekly">WEEKLY</SelectItem>
                            <SelectItem className={SI} value="monthly">MONTHLY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Cap Amount</Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">£</span>
                          <Input value={(a.rateCap ?? "").replace(/^£/, "")}
                            onChange={(e) => updateAllowance(key, "rateCap", `£${e.target.value}`)}
                            className="h-8 bg-input pl-5 text-xs" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Payable In</Label>
                      <div className="flex items-center gap-4">
                        {[{f:"payablePrep",l:"PREP"},{f:"payableShoot",l:"SHOOT"},{f:"payableWrap",l:"WRAP"}].map(({f,l}) => (
                          <div key={f} className="flex items-center gap-1.5">
                            <Checkbox id={`${key}_${f}`} checked={!!a[f]}
                              onCheckedChange={(v) => updateAllowance(key, f, v)} />
                            <Label htmlFor={`${key}_${f}`} className="text-xs font-normal cursor-pointer">{l}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </CollapsibleSection>

        {/* ── Other ── */}
        <CollapsibleSection title="Other" defaultOpen={false}>
          <div className="space-y-1.5">
            <Label htmlFor="otherDealProvisions" className="text-xs text-foreground/80">Other deal provisions</Label>
            <Textarea id="otherDealProvisions" value={data.otherDealProvisions ?? ""}
              onChange={(e) => { if (e.target.value.length <= 300) set("otherDealProvisions", e.target.value); }}
              onFocus={() => onFieldFocus?.("otherDealProvisions")} onBlur={onFieldBlur}
              placeholder="Other deal provisions..." rows={2}
              className="bg-input text-sm resize-none uppercase" />
            <p className="text-xs text-muted-foreground text-right">{(data.otherDealProvisions ?? "").length}/300</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="additionalNotes" className="text-xs text-foreground/80">Internal notes</Label>
            <Textarea id="additionalNotes" value={data.additionalNotes ?? ""}
              onChange={(e) => { if (e.target.value.length <= 300) set("additionalNotes", e.target.value); }}
              onFocus={() => onFieldFocus?.("additionalNotes")} onBlur={onFieldBlur}
              placeholder="Internal notes..." rows={2}
              className="bg-input text-sm resize-none" />
            <p className="text-xs text-muted-foreground text-right">{(data.additionalNotes ?? "").length}/300</p>
            <p className="text-xs text-muted-foreground">
              Internal notes are shown to everyone in Offers in Engine, but NOT on contracts/documents.
            </p>
          </div>
        </CollapsibleSection>

      </div>

      {/* ── Footer ── */}
      <div className="flex gap-2 pt-1">
        <Button onClick={onPrint} className="flex-1 text-sm">
          Save Offer
        </Button>
        <Button onClick={onPrint} variant="outline"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
      </div>

    </div>
  );
}

// ── Job Title Combobox ─────────────────────────────────────────────────────

function JobTitleCombobox({ value, onChange, onFocus, onBlur }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filtered = JOB_TITLES.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={open ? search : value}
          onChange={(e) => { setSearch(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => { setOpen(true); setSearch(""); onFocus?.(); }}
          onBlur={() => setTimeout(() => onBlur?.(), 200)}
          placeholder="Search job titles..."
          className="h-9 bg-input pl-9 text-sm"
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-xl shadow-xl shadow-primary/10 max-h-[220px] overflow-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted-foreground text-center">No results found</p>
          ) : filtered.map((title) => (
            <button key={title} type="button"
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-colors",
                value === title
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-popover-foreground hover:bg-accent/30 hover:text-primary"
              )}
              onMouseDown={(e) => { e.preventDefault(); onChange(title); setOpen(false); setSearch(""); }}>
              {title}
            </button>
          ))}
          <div className="border-t border-border px-3 py-2 sticky bottom-0 bg-popover">
            <button type="button"
              className="text-xs text-primary hover:text-primary/80 w-full text-left transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const custom = search.trim();
                if (custom) { onChange(custom.toUpperCase()); setOpen(false); setSearch(""); }
              }}>
              + Create your own job title (only available to this project)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}