import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { APP_CONFIG } from "@/features/crew/config/appConfig";
import { Label } from "@/shared/components/ui/label";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
import { HelpCircle } from "lucide-react";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SettingsSection } from "@/features/projects/settings/components/shared/SettingsSection";
import { loadDetailsSettingsThunk } from "@/features/projects/settings/store/settings.thunks";
import {
  selectDetailsSettings,
  setDetailsFormValidity,
  setDetailsProjectName,
} from "@/features/projects/settings/store/settingsSlice";
import { detailsSettingsSchema } from "./detailsSettingsSchema";

function DetailsSettings() {
  const dispatch = useDispatch();
  const { projectName, isLoading, isLocked } = useSelector(
    selectDetailsSettings,
  );
  const loadedProjectNameRef = useRef(projectName);

  const [projectType, setProjectType] = useState("feature");
  const [showProjectTypeInOffers, setShowProjectTypeInOffers] = useState("yes");
  const [unionAgreement, setUnionAgreement] = useState("none");
  const [constructionUnionAgreement, setConstructionUnionAgreement] =
    useState("none");
  const [budget, setBudget] = useState("low");
  const [holidayPay, setHolidayPay] = useState("10.77");
  const [workingHours, setWorkingHours] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("optional");
  const [payrollCompany, setPayrollCompany] = useState("");
  const [csvExportLayout, setCsvExportLayout] = useState("");
  const [payrollCsvLayout, setPayrollCsvLayout] = useState("");
  const [taxStatusHandling, setTaxStatusHandling] = useState("");
  const [offerApproval, setOfferApproval] = useState("");
  const [showBudgetToCrew, setShowBudgetToCrew] = useState("yes");
  const [dailiesHolidayPay, setDailiesHolidayPay] = useState("no");
  const [withholdHolidayPay, setWithholdHolidayPay] = useState("no");
  const [overtime, setOvertime] = useState("yes");
  const [showWeeklyInOffer, setShowWeeklyInOffer] = useState("yes");
  const [showWeeklyInDocs, setShowWeeklyInDocs] = useState("yes");
  const [shareStatusWithCrew, setShareStatusWithCrew] = useState("yes");

  const {
    register,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(detailsSettingsSchema),
    defaultValues: {
      projectName,
    },
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(loadDetailsSettingsThunk(APP_CONFIG.PROJECT_ID));
  }, [dispatch]);

  useEffect(() => {
    loadedProjectNameRef.current = projectName;
  }, [projectName]);

  useEffect(() => {
    if (!isLoading) {
      reset({ projectName: loadedProjectNameRef.current });
      trigger("projectName");
    }
  }, [isLoading, reset, trigger]);

  useEffect(() => {
    dispatch(setDetailsFormValidity(isValid));
  }, [dispatch, isValid]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col gap-5"
      >
        <SettingsSection
          title="Project Details"
          subtitle="Helpful information which is shown to crew and can be updated any time."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Project Name</Label>
              </div>
              <Input
                {...register("projectName", {
                  onChange: (event) =>
                    dispatch(setDetailsProjectName(event.target.value)),
                })}
                className="placeholder:text-xs"
                id="projectName"
                placeholder="Project Name"
                disabled={isLoading || isLocked}
              />
              {errors.projectName && (
                <p className="text-[0.65rem] text-red-500">
                  {errors.projectName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Code Name</Label>
              </div>
              <Input
                className="placeholder:text-xs"
                id="CodeName"
                placeholder="Code Name"
              />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                If your project has an alternative name for secrecy, enter that.
                Otherwise enter the Project name. The Code name will be used in
                all emails and pages.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Description</Label>
              </div>
              <Textarea placeholder="Description (Optional)" id="description" />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                A brief synopsis of the project which is helpful for crew
                joining the production.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Locations</Label>
              </div>
              <Textarea placeholder="Locations (Optional)" id="locations" />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                Useful information, if known, which might help crew decide if
                they can accept the job.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Additional Notes</Label>
              </div>
              <Textarea
                placeholder="Additional Notes (Optional)"
                id="additionalNotes"
              />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                Use this to convey general project-wide information to crew.
              </p>
            </div>
          </div>
        </SettingsSection>
        {/* ── Project Settings ── */}
        <SettingsSection
          title="Project Settings"
          subtitle="Essential settings which will govern how rates are calculated."
        >
          <div className="flex flex-col gap-5 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">Project Type</Label>
                  <InfoTooltip content="Select Television for SVOD 'streaming' projects.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <ToggleGroup
                  type="single"
                  value={projectType}
                  spacing={2}
                  onValueChange={(val) => val && setProjectType(val)}
                  size="sm"
                  variant="outline"
                  className="w-fit"
                >
                  <ToggleGroupItem
                    value="feature"
                    className="text-[0.7rem] px-3"
                  >
                    Feature Film
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tv" className="text-[0.7rem] px-3">
                    Television
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">
                    Show project type in offers?
                  </Label>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={0}
                    value={showProjectTypeInOffers}
                    onValueChange={(val) =>
                      val && setShowProjectTypeInOffers(val)
                    }
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="text-[0.6rem] px-2.5"
                    >
                      YES
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="text-[0.6rem] px-2.5"
                    >
                      NO
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
            <div className="h-px bg-border/40" />
            {/* Union Agreements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">Union Agreement</Label>
                  <InfoTooltip content="Select 'None' if you will use terms which vary from the current Union Agreement. Select 'PACT/BECTU Agreement' even if you are only aligned to the agreement.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <ToggleGroup
                  type="single"
                  value={unionAgreement}
                  onValueChange={(val) => val && setUnionAgreement(val)}
                  size="sm"
                  variant="outline"
                  spacing={2}
                >
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                  <ToggleGroupItem value="pact_bectu_2021">
                    PACT/BECTU Agreement (2021)
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Construction Union Agreement
                </Label>

                <ToggleGroup
                  type="single"
                  value={constructionUnionAgreement}
                  onValueChange={(val) =>
                    val && setConstructionUnionAgreement(val)
                  }
                  size="sm"
                  variant="outline"
                  spacing={2}
                >
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                  <ToggleGroupItem value="pact_bectu">
                    PACT/BECTU Agreement
                  </ToggleGroupItem>
                  <ToggleGroupItem value="custom">
                    Custom Agreement
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Budget</Label>
              <ToggleGroup
                type="single"
                value={budget}
                onValueChange={(val) => val && setBudget(val)}
                size="sm"
                variant="outline"
                spacing={2}
              >
                <ToggleGroupItem value="low">
                  Low (under £10 million)
                </ToggleGroupItem>
                <ToggleGroupItem value="mid">
                  Mid (£10–£30 million)
                </ToggleGroupItem>
                <ToggleGroupItem value="major">
                  Major (over £30 million)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">
                Show budget level to crew members?
              </Label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showBudgetToCrew}
                onValueChange={(val) => val && setShowBudgetToCrew(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                  YES
                </ToggleGroupItem>
                <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                Holiday Pay Percentage
              </Label>
              <ToggleGroup
                type="single"
                value={holidayPay}
                onValueChange={(val) => val && setHolidayPay(val)}
                size="sm"
                variant="outline"
                spacing={2}
              >
                <ToggleGroupItem value="0">0%</ToggleGroupItem>
                <ToggleGroupItem value="10.77">10.77%</ToggleGroupItem>
                <ToggleGroupItem value="12.07">12.07%</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">
                Different holiday pay percentage for Dailies
              </Label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={dailiesHolidayPay}
                onValueChange={(val) => val && setDailiesHolidayPay(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                  YES
                </ToggleGroupItem>
                <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">
                Withhold holiday pay on 6th and 7th days
              </Label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={withholdHolidayPay}
                onValueChange={(val) => val && setWithholdHolidayPay(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                  YES
                </ToggleGroupItem>
                <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Overtime</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={overtime}
                onValueChange={(val) => val && setOvertime(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                  YES
                </ToggleGroupItem>
                <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-medium">
                Show Weekly rate for Daily crew in
              </Label>

              <div className="flex flex-col rounded-md border border-border/40 divide-y divide-border/40">
                {/* Row 1 */}
                <div className="flex items-center justify-between px-3 py-2">
                  <Label className="text-xs text-muted-foreground">
                    Offer view
                  </Label>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={0}
                    value={showWeeklyInOffer}
                    onValueChange={(val) => val && setShowWeeklyInOffer(val)}
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="text-[0.6rem] px-2.5"
                    >
                      YES
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="text-[0.6rem] px-2.5"
                    >
                      NO
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-between px-3 py-2">
                  <Label className="text-xs text-muted-foreground">
                    Documents
                  </Label>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={0}
                    value={showWeeklyInDocs}
                    onValueChange={(val) => val && setShowWeeklyInDocs(val)}
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="text-[0.6rem] px-2.5"
                    >
                      YES
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="text-[0.6rem] px-2.5"
                    >
                      NO
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
            <div className="h-px bg-border/40" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">
                    Default Standard Working Hours
                  </Label>
                  <InfoTooltip content="Excluding lunch. This is for standard crew contracts. You can still specify different hours in each offer">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <SelectMenu
                  label="Select working hours"
                  selected={workingHours}
                  onSelect={setWorkingHours}
                  items={[
                    { label: "12 hours (continuous)", value: "12_continuous" },
                    { label: "12 hours", value: "12" },
                    { label: "11 hours", value: "11" },
                    { label: "10.5 hours", value: "10.5" },
                    { label: "10 hours", value: "10" },
                    { label: "9 hours", value: "9" },
                    { label: "8 hours", value: "8" },
                    { label: "7.5 hours", value: "7.5" },
                    { label: "7 hours", value: "7" },
                    { label: "6 hours", value: "6" },
                    { label: "5 hours", value: "5" },
                    { label: "4 hours", value: "4" },
                    { label: "3 hours", value: "3" },
                    { label: "2 hours", value: "2" },
                    { label: "1 hour", value: "1" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">Offer End Date</Label>
                  <InfoTooltip content="Dictated by whether the Company wants end dates in crew contracts.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <ToggleGroup
                  type="single"
                  value={offerEndDate}
                  onValueChange={(val) => val && setOfferEndDate(val)}
                  size="sm"
                  variant="outline"
                  spacing={2}
                >
                  <ToggleGroupItem value="optional">Optional</ToggleGroupItem>
                  <ToggleGroupItem value="mandatory">Mandatory</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div className="h-px bg-border/40" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">Payroll Company</Label>
                <SelectMenu
                  label="Select payroll company"
                  selected={payrollCompany}
                  onSelect={setPayrollCompany}
                  items={[
                    { label: "Dataplan", value: "dataplan" },
                    { label: "Entertainment Payroll Services", value: "eps" },
                    { label: "Hargenant", value: "hargenant" },
                    { label: "In-house", value: "inhouse" },
                    { label: "Moneypenny", value: "moneypenny" },
                    { label: "Sargent Disc", value: "sargent_disc" },
                    { label: "TPH", value: "tph" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">
                    Crew Data CSV Export Layout
                  </Label>
                  <InfoTooltip content="Start form data in CSV format for sharing with the payroll company.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <SelectMenu
                  label="Select export layout"
                  selected={csvExportLayout}
                  onSelect={setCsvExportLayout}
                  items={[
                    { label: "EAARTH", value: "eaarth" },
                    { label: "Moneypenny", value: "moneypenny" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">
                    Payroll CSV Export Layout
                  </Label>
                  <InfoTooltip content="Money calculation data in a layout similar to your payroll company's spreadsheet.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <SelectMenu
                  label="Select payroll CSV layout"
                  selected={payrollCsvLayout}
                  onSelect={setPayrollCsvLayout}
                  items={[
                    { label: "Dataplan", value: "dataplan" },
                    { label: "Entertainment Payroll Services", value: "eps" },
                    { label: "Hargenant", value: "hargenant" },
                    { label: "In-house", value: "inhouse" },
                    { label: "Moneypenny", value: "moneypenny" },
                    { label: "Sargent Disc", value: "sargent_disc" },
                    { label: "TPH", value: "tph" },
                  ]}
                />
              </div>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Offer Handling"
          subtitle="How you'd like offers to be reviewed prior to sending to crew."
        >
          <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">
                  Share status determination with crew members?
                </Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={0}
                  value={shareStatusWithCrew}
                  onValueChange={(val) => val && setShareStatusWithCrew(val)}
                >
                  <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                    YES
                  </ToggleGroupItem>
                  <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                    NO
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                Inform the crew member of your IR35 status determination within
                their offer. This MUST be set to yes if you require it to appear
                in documents.
              </p>
            </div>
            <div className="h-px bg-border/40" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">
                    Tax Status Handling
                  </Label>
                  <InfoTooltip content="Available options are based on your 'Share status determination with crew members?' selection.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <SelectMenu
                  label="Select tax status handling"
                  selected={taxStatusHandling}
                  onSelect={setTaxStatusHandling}
                  items={[
                    { label: "Do not allow loan outs", value: "no_loan_outs" },
                    {
                      label:
                        "Accounts approval required for self-employed or loan out",
                      value: "approval_self_or_loan",
                    },
                    {
                      label: "Accounts approval required for loan out",
                      value: "approval_loan",
                    },
                    {
                      label: "Allow loan out if grade is self-employed",
                      value: "allow_if_self",
                    },
                    {
                      label:
                        "Allow all loan outs (not recommended after 5 Apr, 2021)",
                      value: "allow_all",
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">
                    Tax Status Query Email
                  </Label>
                  <InfoTooltip content="The person to whom all tax status questions will be directed.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <Input
                  className="placeholder:text-xs"
                  id="taxStatusEmail"
                  placeholder="Tax Status Query Email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">Offer Approval</Label>
                  <InfoTooltip
                    content="  Order of people who will approve offers before being sent to
                  crew. Available options are based on your 'Tax status
                  handling' selection."
                  >
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <SelectMenu
                  label="Select offer approval flow"
                  selected={offerApproval}
                  onSelect={setOfferApproval}
                  items={[
                    { label: "Accounts", value: "accounts" },
                    {
                      label: "Accounts > Production",
                      value: "accounts_production",
                    },
                    { label: "Production", value: "production" },
                    {
                      label: "Production > Accounts",
                      value: "production_accounts",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </SettingsSection>
      </motion.div>
    </>
  );
}

export default DetailsSettings;
