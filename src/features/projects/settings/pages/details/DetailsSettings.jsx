import { motion } from "framer-motion";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { Textarea } from "@/shared/components/ui/textarea";
import { SettingsSection } from "@/features/projects/settings/components/shared/SettingsSection";
import { useState } from "react";
import FilterPillTabs from "../../../../../shared/components/FilterPillTabs";
import { InfoTooltip } from "../../../../../shared/components/InfoTooltip";
import { HelpCircle } from "lucide-react";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";

function DetailsSettings() {
  const [projectType, setProjectType] = useState("feature");
  const [legalTerritory, setLegalTerritory] = useState("uk");
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
          <div className="grid lg:grid-cols-2 gap-3 p-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs" htmlFor="title">
                Title
              </Label>
              <Input
                className="placeholder:text-xs"
                id="title"
                placeholder="Title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs" htmlFor="codename">
                Codename
              </Label>
              <Input
                className="placeholder:text-xs"
                id="codename"
                placeholder="Codename"
              />
              <p className="text-[0.5rem] text-muted-foreground">
                If your project has an alternative name for secrecy, enter that.
                Otherwise enter the Project title. The Codename will be used in
                all emails and pages.
              </p>
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              <Label className="text-xs" htmlFor="description">
                Description
              </Label>
              <Textarea placeholder="Description (Optional)" id="description" />
              <p className="text-[0.5rem] text-muted-foreground">
                A brief synopsis of the project which is helpful for crew
                joining the production.
              </p>
            </div>
            <div className="mt-1 col-span-2 flex flex-col gap-2">
              <Label className="text-xs" htmlFor="locations">
                Locations
              </Label>
              <Textarea placeholder="Locations (Optional)" id="locations" />
              <p className="text-[0.5rem] text-muted-foreground">
                Useful information, if known, which might help crew decide if
                they can accept the job.
              </p>
            </div>
            <div className="mt-1 col-span-2 flex flex-col gap-2">
              <Label className="text-xs" htmlFor="additionalNotes">
                Additional Notes
              </Label>
              <Textarea
                placeholder="Additional Notes (Optional)"
                id="additionalNotes"
              />
              <p className="text-[0.5rem] text-muted-foreground">
                Use this to convey general project-wide information to crew.
              </p>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Project Settings"
          subtitle="Essential settings which will govern how rates are calculated."
        >
          <div className="flex pb-3 px-3 flex-col gap-2">
            <div className="flex items-center gap-1">
              <Label className="text-xs">Project Type</Label>
              <InfoTooltip content="Select Television for SVOD 'streaming' projects.">
                <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </InfoTooltip>
            </div>
            <FilterPillTabs
              value={projectType}
              onChange={setProjectType}
              size="sm"
              variant="default"
              options={[
                { label: "Feature Film", value: "feature" },
                { label: "Television", value: "tv" },
              ]}
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Show project type in offers?
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Label className="text-xs ">Legal Territory</Label>

            <FilterPillTabs
              value={legalTerritory}
              onChange={setLegalTerritory}
              size="sm"
              variant="default"
              options={[
                { label: "United Kingdom", value: "uk" },
                { label: "Iceland", value: "iceland" },
                { label: "Ireland", value: "ireland" },
                { label: "Malta", value: "malta" },
              ]}
            />
            <div className="flex items-center gap-1">
              <Label className="text-xs">Union Agreement</Label>
              <InfoTooltip content="Select 'None' if you will use terms which vary from the current Union Agreement. Select 'PACT/BECTU Agreement' even if you are only aligned to the agreement.">
                <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </InfoTooltip>
            </div>
            <FilterPillTabs
              value={unionAgreement}
              onChange={setUnionAgreement}
              size="sm"
              variant="default"
              options={[
                { label: "None", value: "none" },
                {
                  label: "PACT/BECTU Agreement (2021)",
                  value: "pact_bectu_2021",
                },
              ]}
            />

            <Label className="text-xs ">Construction Union Agreement</Label>

            <FilterPillTabs
              value={constructionUnionAgreement}
              onChange={setConstructionUnionAgreement}
              size="sm"
              variant="default"
              options={[
                { label: "None", value: "none" },
                { label: "PACT/BECTU Agreement", value: "pact_bectu" },
                { label: "Custom Agreement", value: "custom" },
              ]}
            />
            <Label className="text-xs ">Budget</Label>

            <FilterPillTabs
              value={budget}
              onChange={setBudget}
              size="sm"
              variant="default"
              options={[
                { label: "Low (under £10 million)", value: "low" },
                { label: "Mid (between £10 - £30 million)", value: "mid" },
                { label: "Major (over £30 million)", value: "major" },
              ]}
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Show budget level to crew members?
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Label className="text-xs">Holiday Pay Percentage</Label>

            <FilterPillTabs
              value={holidayPay}
              onChange={setHolidayPay}
              size="sm"
              variant="default"
              options={[
                { label: "0%", value: "0" },
                { label: "10.77%", value: "10.77" },
                { label: "12.07%", value: "12.07" },
              ]}
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Different holiday pay percentage for Dailies
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Withhold holiday pay on 6th and 7th days
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Overtime
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Label className="text-xs ">
              Show Weekly rate for Daily crew in
            </Label>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Offer view
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Documents
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Label className="text-xs "> Default Standard Working Hours</Label>
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
            <div className="flex items-center gap-1">
              <Label className="text-xs">Offer End Date</Label>
              <InfoTooltip content="Dictated by whether the Company wants end dates in crew contracts.">
                <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </InfoTooltip>
            </div>
            <FilterPillTabs
              value={offerEndDate}
              onChange={setOfferEndDate}
              size="sm"
              variant="default"
              options={[
                { label: "Optional", value: "optional" },
                { label: "Mandatory", value: "mandatory" },
              ]}
            />
            <Label className="text-xs">Payroll Company</Label>
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
            <Label className="text-xs mt-2">Crew Data CSV Export Layout</Label>
            <SelectMenu
              label="Select export layout"
              selected={csvExportLayout}
              onSelect={setCsvExportLayout}
              items={[
                { label: "EAARTH", value: "eaarth" },
                { label: "Moneypenny", value: "moneypenny" },
              ]}
            />
            <p className="text-[0.5rem] text-muted-foreground">
              Start form data in CSV format for sharing with the payroll
              company.
            </p>
            <Label className="text-xs mt-2">Payroll CSV Export Layout</Label>
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
        </SettingsSection>
        <SettingsSection
          title="Offer Handling"
          subtitle="How you'd like offers to be reviewed prior to sending to crew."
        >
          <div className="flex pb-3 px-3 flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400 dark:text-gray-500">
                Share status determination with crew members?
              </Label>

              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={showProjectTypeInOffers}
                onValueChange={(val) => val && setShowProjectTypeInOffers(val)}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem]">
                  YES
                </ToggleGroupItem>

                <ToggleGroupItem value="no" className="text-[0.6rem]">
                  NO
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <p className="text-[0.5rem] text-muted-foreground">
              Inform the crew member of your IR35 status determination within
              their offer. This MUST be set to yes if you require it to appear
              in documents.
            </p>
            <Label className="text-xs mt-2">Tax Status Handling</Label>
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
            <p className="text-[0.5rem] text-muted-foreground">
              Available options are based on your 'Share status determination
              with crew members?' selection.
            </p>
            <Label className="text-xs" htmlFor="taxStatusEmail">
              Tax Status Query Email
            </Label>
            <Input
              className="placeholder:text-xs"
              id="taxStatusEmail"
              placeholder="Tax Status Query Email"
            />
            <p className="text-[0.5rem] text-muted-foreground">
              The person to whom all tax status questions will be directed.
            </p>
            <Label className="text-xs mt-2">Offer Approval</Label>
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
            <p className="text-[0.5rem] text-muted-foreground">
              Order of people who will approve offers before being sent to crew.
              Available options are based on your 'Tax status handling'
              selection.
            </p>
          </div>
        </SettingsSection>
      </motion.div>
    </>
  );
}

export default DetailsSettings;
