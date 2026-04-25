import { useEffect, useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";

function DetailsSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    details: null,
    projectSettings: null,
    offerHandling: null,
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  const detailsData =
    isEditing.section === "details"
      ? formState.details
      : {
          projectName: "AVATAR 1",
          codeName: "AVATAR 1",
          description: "",
          locations: "",
          additionalNotes: "",
        };

  const projectSettingsData =
    isEditing.section === "projectSettings"
      ? formState.projectSettings
      : {
          projectType: "Feature Film",
          showProjectTypeInOffers: true,
          unionAgreement: "None",
          constructionUnionAgreement: "None",
          budget: "Low (under £10 million)",
          showBudgetToCrew: false,
          holidayPayPercentage: "0%",
          differentHolidayPayForDailies: true,
          withholdHolidayPayOn6th7th: false,
          overtimeEnabled: false,
          showWeeklyRateForDailiesInOffer: false,
          showWeeklyRateForDailiesInDocuments: false,
          defaultWorkingHours: "12_continuous",
          offerEndDateRequirement: "Optional",
          payrollCompany: "dataplan",
          crewCsvExportLayout: "eaarth",
          payrollCsvExportLayout: "dataplan",
        };

  const offerHandlingData =
    isEditing.section === "offerHandling"
      ? formState.offerHandling
      : {
          shareStatusWithCrew: false,
          taxStatusHandling: "no_loan_outs",
          taxStatusQueryEmail: "",
          offerApproval: "accounts",
        };

  const startEditing = (section) => {
    if (section === "details") {
      setFormState((prev) => ({
        ...prev,
        details: {
          projectName: detailsData.projectName,
          codeName: detailsData.codeName,
          description: detailsData.description || "",
          locations: detailsData.locations || "",
          additionalNotes: detailsData.additionalNotes || "",
        },
      }));
    }

    if (section === "projectSettings") {
      setFormState((prev) => ({
        ...prev,
        projectSettings: {
          projectType: projectSettingsData.projectType,
          showProjectTypeInOffers: projectSettingsData.showProjectTypeInOffers,
          unionAgreement: projectSettingsData.unionAgreement,
          constructionUnionAgreement:
            projectSettingsData.constructionUnionAgreement,
          budget: projectSettingsData.budget,
          showBudgetToCrew: projectSettingsData.showBudgetToCrew,
          holidayPayPercentage: projectSettingsData.holidayPayPercentage,
          differentHolidayPayForDailies:
            projectSettingsData.differentHolidayPayForDailies,
          withholdHolidayPayOn6th7th:
            projectSettingsData.withholdHolidayPayOn6th7th,
          overtimeEnabled: projectSettingsData.overtimeEnabled,
          showWeeklyRateForDailiesInOffer:
            projectSettingsData.showWeeklyRateForDailiesInOffer,
          showWeeklyRateForDailiesInDocuments:
            projectSettingsData.showWeeklyRateForDailiesInDocuments,
          defaultWorkingHours: projectSettingsData.defaultWorkingHours,
          offerEndDateRequirement: projectSettingsData.offerEndDateRequirement,
          payrollCompany: projectSettingsData.payrollCompany,
          crewCsvExportLayout: projectSettingsData.crewCsvExportLayout,
          payrollCsvExportLayout: projectSettingsData.payrollCsvExportLayout,
        },
      }));
    }

    if (section === "offerHandling") {
      setFormState((prev) => ({
        ...prev,
        offerHandling: {
          shareStatusWithCrew: offerHandlingData.shareStatusWithCrew,
          taxStatusHandling: offerHandlingData.taxStatusHandling,
          taxStatusQueryEmail: offerHandlingData.taxStatusQueryEmail,
          offerApproval: offerHandlingData.offerApproval,
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ details: null, projectSettings: null, offerHandling: null });
  };

  //   if (isLoading) {
  //   return (
  //     <>
  //       <SettingsCardLoadingSkelton fields={6} columns={2} />
  //       <SettingsCardLoadingSkelton fields={12} columns={2} />
  //       <SettingsCardLoadingSkelton fields={6} columns={2} />
  //     </>
  //   );
  // }

  return (
    <div className="space-y-4">
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Project Details
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Helpful information which is shown to crew and can be updated
                any time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 ">
            <EditToggleButtons
              isEditing={isEditing.section === "details"}
              onEdit={() => startEditing("details")}
              onSave={() => setIsEditing({ section: null })}
              onCancel={cancelEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableTextDataField
            label="Project Name"
            value={detailsData?.projectName}
            isEditing={isEditing.section === "details"}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  projectName: val,
                },
              }))
            }
          />

          <div className="flex flex-col gap-1">
            <EditableTextDataField
              label="Code Name"
              value={detailsData?.codeName}
              isEditing={isEditing.section === "details"}
              infoPillDescription="If your project has an alternative name for secrecy, enter that. Otherwise enter the Project name. The Code name will be used in all emails and pages."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    codeName: val,
                  },
                }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Description"
            value={detailsData?.description}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            infoPillDescription="A brief synopsis of the project which is helpful for crew joining the production."
            placeholder="Enter description"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  description: val,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Locations"
            value={detailsData?.locations}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            infoPillDescription="Useful information, if known, which might help crew decide if they
            can accept the job."
            placeholder="Enter locations"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  locations: val,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Additional Notes"
            value={detailsData?.additionalNotes}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            infoPillDescription="Use this to convey general project-wide information to crew."
            placeholder="Enter additional notes"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  additionalNotes: val,
                },
              }))
            }
          />
        </div>
      </CardWrapper>
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Project Settings
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Essential settings which will govern how rates are calculated
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EditToggleButtons
              isEditing={isEditing.section === "projectSettings"}
              onEdit={() => startEditing("projectSettings")}
              onSave={() => setIsEditing({ section: null })}
              onCancel={cancelEditing}
            />
          </div>
        </div>

        <EditableSelectField
          label="Project Type"
          value={projectSettingsData?.projectType}
          items={[
            { label: "Feature Film", value: "Feature Film" },
            { label: "Television", value: "Television" },
          ]}
          isEditing={isEditing.section === "projectSettings"}
          isRequired={false}
          onChange={(val) =>
            setFormState((prev) => ({
              ...prev,
              projectSettings: {
                ...(prev.projectSettings || {}),
                projectType: val,
              },
            }))
          }
        />
        <div className="mt-4">
          <EditableSwitchField
            label="Show project type in offers"
            checked={projectSettingsData?.showProjectTypeInOffers}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  showProjectTypeInOffers: val,
                },
              }))
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Union Agreement"
            value={projectSettingsData?.unionAgreement}
            items={[
              { label: "None", value: "None" },
              {
                label: "Pact/Bectu Agreement (2021)",
                value: "Pact/Bectu Agreement (2021)",
              },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            infoPillDescription="Select 'None' if you will use terms which vary from the current Union Agreement. Select 'PACT/BECTU Agreement' even if you are only aligned to the agreement."
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  unionAgreement: val,
                },
              }))
            }
          />
          <EditableSelectField
            label="Construction Union Agreement"
            value={projectSettingsData?.constructionUnionAgreement}
            items={[
              { label: "None", value: "None" },
              {
                label: "Pact/Bectu Agreement",
                value: "Pact/Bectu Agreement",
              },
              {
                label: "Custom Agreement",
                value: "Custom Agreement",
              },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  constructionUnionAgreement: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Budget"
            value={projectSettingsData?.budget}
            items={[
              {
                label: "Low (under £10 million)",
                value: "Low (under £10 million)",
              },
              {
                label: "Mid (£10–£30 million)",
                value: "Mid (£10–£30 million)",
              },
              {
                label: "Major (over £30 million)",
                value: "Major (over £30 million)",
              },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  budget: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show budget level to crew members?"
            checked={projectSettingsData?.showBudgetToCrew}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  showBudgetToCrew: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Holiday Pay Percentage"
            value={projectSettingsData?.holidayPayPercentage}
            items={[
              { label: "0%", value: "0%" },
              { label: "10.77%", value: "10.77%" },
              { label: "12.07%", value: "12.07%" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  holidayPayPercentage: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Different holiday pay percentage for Dailies"
            checked={
              projectSettingsData?.differentHolidayPayForDailies ?? false
            }
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  differentHolidayPayForDailies: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Withhold holiday pay on 6th and 7th days"
            checked={projectSettingsData?.withholdHolidayPayOn6th7th}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  withholdHolidayPayOn6th7th: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Overtime"
            checked={projectSettingsData?.overtimeEnabled}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  overtimeEnabled: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show Weekly rate for Daily crew in Offer view"
            checked={projectSettingsData?.showWeeklyRateForDailiesInOffer}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  showWeeklyRateForDailiesInOffer: val,
                },
              }))
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show Weekly rate for Daily crew in Documents"
            checked={
              projectSettingsData?.showWeeklyRateForDailiesInDocuments ?? false
            }
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  showWeeklyRateForDailiesInDocuments: val,
                },
              }))
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Payroll Company"
            value={projectSettingsData?.payrollCompany}
            items={[
              { label: "Dataplan", value: "dataplan" },
              { label: "Entertainment Payroll Services", value: "eps" },
              { label: "Hargenant", value: "hargenant" },
              { label: "In-house", value: "inhouse" },
              { label: "Moneypenny", value: "moneypenny" },
              { label: "Sargent Disc", value: "sargent_disc" },
              { label: "TPH", value: "tph" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  payrollCompany: val,
                },
              }))
            }
          />
          <EditableSelectField
            label="Offer End Date"
            value={projectSettingsData?.offerEndDateRequirement}
            items={[
              { label: "Optional", value: "Optional" },
              { label: "Mandatory", value: "Mandatory" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  offerEndDateRequirement: val,
                },
              }))
            }
            infoPillDescription="Dictated by whether the Company wants end dates in crew contracts."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Crew Data CSV Export Layout"
            value={projectSettingsData?.crewCsvExportLayout}
            items={[
              { label: "EAARTH", value: "eaarth" },
              { label: "Moneypenny", value: "moneypenny" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  crewCsvExportLayout: val,
                },
              }))
            }
            infoPillDescription="Start form data in CSV format for sharing with the payroll company."
          />
          <EditableSelectField
            label="Payroll CSV Export Layout"
            value={projectSettingsData?.payrollCsvExportLayout}
            items={[
              { label: "Dataplan", value: "dataplan" },
              { label: "Entertainment Payroll Services", value: "eps" },
              { label: "Hargenant", value: "hargenant" },
              { label: "In-house", value: "inhouse" },
              { label: "Moneypenny", value: "moneypenny" },
              { label: "Sargent Disc", value: "sargent_disc" },
              { label: "TPH", value: "tph" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  payrollCsvExportLayout: val,
                },
              }))
            }
            infoPillDescription="Money calculation data in a layout similar to your payroll company's spreadsheet."
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Default Standard Working Hours"
            value={projectSettingsData?.defaultWorkingHours}
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
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  defaultWorkingHours: val,
                },
              }))
            }
            infoPillDescription="Excluding lunch. This is for standard crew contracts. You can still specify different hours in each offer."
          />
        </div>
      </CardWrapper>
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Offer Handling
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                How you'd like offers to be reviewed prior to sending to crew.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EditToggleButtons
              isEditing={isEditing.section === "offerHandling"}
              onEdit={() => startEditing("offerHandling")}
              onSave={() => setIsEditing({ section: null })}
              onCancel={cancelEditing}
            />
          </div>
        </div>
        <EditableSwitchField
          label="Share status determination with crew members?"
          checked={offerHandlingData?.shareStatusWithCrew}
          isEditing={isEditing.section === "offerHandling"}
          isRequired={false}
          onChange={(val) =>
            setFormState((prev) => ({
              ...prev,
              offerHandling: {
                ...prev.offerHandling,
                shareStatusWithCrew: val,
              },
            }))
          }
          infoPillDescription="Inform the crew member of your IR35 status determination within their offer. This MUST be set to yes if you require it to appear in documents."
        />
        <div className="mt-4">
          <EditableTextDataField
            label="Tax Status Query Email"
            value={offerHandlingData?.taxStatusQueryEmail}
            isEditing={isEditing.section === "offerHandling"}
            isRequired={false}
            placeholder="Enter email address"
            type="email"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                offerHandling: {
                  ...prev.offerHandling,
                  taxStatusQueryEmail: val,
                },
              }))
            }
            infoPillDescription="The person to whom all tax status questions will be directed."
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Tax Status Handling"
            value={offerHandlingData?.taxStatusHandling}
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
            isEditing={isEditing.section === "offerHandling"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                offerHandling: {
                  ...prev.offerHandling,
                  taxStatusHandling: val,
                },
              }))
            }
            infoPillDescription="Available options are based on your 'Share status determination with crew members?' selection."
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Offer Approval"
            value={offerHandlingData?.offerApproval}
            isEditing={isEditing.section === "offerHandling"}
            isRequired={false}
            items={[
              { label: "Accounts", value: "accounts" },
              { label: "Accounts > Production", value: "accounts_production" },
              { label: "Production", value: "production" },
              { label: "Production > Accounts", value: "production_accounts" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                offerHandling: {
                  ...prev.offerHandling,
                  offerApproval: val,
                },
              }))
            }
            infoPillDescription="Order of people who will approve offers before being sent to crew. Available options are based on your 'Tax status handling' selection."
          />
        </div>
      </CardWrapper>
    </div>
  );
}

export default DetailsSettings;
