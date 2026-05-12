import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import PerDiemList from "../../components/project/PerDiemList";

function ProjectSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });

  const [formState, setFormState] = useState({
    projectSettings: null,
    projectInformation: null,
    offerHandling: null,
    perDiem: [],
    mealPenalties: null,
    notice: null,
    allowances: {
      box: false,
      computer: false,
      software: false,
      equipment: false,
      mobile: false,
      vehicleAllowance: false,
      vehicleHire: false,
      perDiem: false,
      living: false,
    },
  });

  const basicSettingsData =
    isEditing.section === "projectSettings"
      ? formState.projectSettings
      : {
          workingWeek: "5_days",
          showPrepWrap: true,
        };

  const projectInformationData =
    isEditing.section === "projectInformation"
      ? formState.projectInformation
      : {
          projectType: "Feature Film",
          showProjectTypeInOffers: true,
          unionAgreement: "None",
          constructionUnionAgreement: "None",
          budget: "Low (under £10 million)",
          showBudgetToCrew: false,
          holidayPayPercentage: "0%",
          differentHolidayPayForDailies: false,
          withholdHolidayPayOn6th7th: false,
          overtimeEnabled: false,
          showWeeklyRateForDailiesInOffer: false,
          showWeeklyRateForDailiesInDocuments: false,
          payrollCompany: "dataplan",
          offerEndDateRequirement: "Optional",
          crewCsvExportLayout: "eaarth",
          payrollCsvExportLayout: "dataplan",
          defaultWorkingHours: "12_continuous",
        };

  const offerHandlingData =
    isEditing.section === "offerHandling"
      ? formState.offerHandling
      : {
          shareStatusDetermination: false,
          taxStatusQueryEmail: "",
          taxStatusHandling: "no_loan_outs",
          offerApproval: "accounts",
        };

  const allowancesData =
    isEditing.section === "perDiem"
      ? formState.allowances
      : {
          box: false,
          computer: false,
          software: false,
          equipment: false,
          mobile: false,
          vehicleAllowance: false,
          vehicleHire: false,
          living: false,
        };

  const mealPenaltiesData =
    isEditing.section === "mealPenalties"
      ? formState.mealPenalties
      : {
          breakfast: 6,
          lunch: 5.0,
          dinner: 10.0,
        };

  const noticeData =
    isEditing.section === "notice"
      ? formState.notice
      : {
          noticeDays: "2",
          emailWording: `Dear [Loan Out Company Name] / [Crew member name],
(Original notice):
On behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement on Werwulf will be [finish date].
(Revised notice):
Further to your notice dated [date of previous notice], I hereby confirm that your revised last day of engagement on Werwulf will be [revised finish date].
Many thanks for your hard work on the production.`,
        };

  const perDiemData = isEditing.section === "perDiem" ? formState.perDiem : [];

  const startEditing = (section) => {
    if (section === "projectSettings") {
      setFormState((prev) => ({
        ...prev,
        projectSettings: {
          workingWeek: basicSettingsData.workingWeek,
          showPrepWrap: basicSettingsData.showPrepWrap,
        },
      }));
    }

    if (section === "projectInformation") {
      setFormState((prev) => ({
        ...prev,
        projectInformation: {
          ...projectInformationData,
        },
      }));
    }

    if (section === "offerHandling") {
      setFormState((prev) => ({
        ...prev,
        offerHandling: {
          ...offerHandlingData,
        },
      }));
    }

    if (section === "perDiem") {
      setFormState((prev) => ({
        ...prev,
        perDiem: perDiemData || [],
        allowances: allowancesData,
      }));
    }

    if (section === "mealPenalties") {
      setFormState((prev) => ({
        ...prev,
        mealPenalties: {
          breakfast: mealPenaltiesData.breakfast,
          lunch: mealPenaltiesData.lunch,
          dinner: mealPenaltiesData.dinner,
        },
      }));
    }

    if (section === "notice") {
      setFormState((prev) => ({
        ...prev,
        notice: {
          noticeDays: noticeData.noticeDays,
          emailWording: noticeData.emailWording,
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({
      projectSettings: null,
      projectInformation: null,
      offerHandling: null,
      perDiem: [],
      mealPenalties: null,
      notice: null,
      allowances: {
        box: false,
        computer: false,
        software: false,
        equipment: false,
        mobile: false,
        vehicleAllowance: false,
        vehicleHire: false,
        perDiem: false,
      },
    });
  };

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Basic</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Core project working week configuration. Currency is managed
                  per company in the Contacts tab
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "projectSettings"}
                onEdit={() => startEditing("projectSettings")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSelectField
            label="Working Week"
            value={basicSettingsData?.workingWeek}
            isEditing={isEditing.section === "projectSettings"}
            items={[
              { label: "5 Days", value: "5_days" },
              { label: "5.5 Days", value: "5.5_days" },
              { label: "5/6 Days", value: "5/6_days" },
              { label: "6 Days", value: "6_days" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...prev.projectSettings,
                  workingWeek: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableSwitchField
              label="Show prep/wrap mins in Offer view?"
              checked={basicSettingsData?.showPrepWrap}
              isEditing={isEditing.section === "projectSettings"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectSettings: {
                    ...prev.projectSettings,
                    showPrepWrap: val,
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
                  Project Information
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Essential settings which will govern how rates are calculated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "projectInformation"}
                onEdit={() => startEditing("projectInformation")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <EditableSelectField
            label="Project Type"
            value={projectInformationData?.projectType}
            isEditing={isEditing.section === "projectInformation"}
            items={[
              { label: "Feature Film", value: "Feature Film" },
              { label: "Television", value: "Television" },
            ]}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectInformation: {
                  ...prev.projectInformation,
                  projectType: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableSwitchField
              label="Show project type in offers"
              checked={projectInformationData?.showProjectTypeInOffers}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    showProjectTypeInOffers: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSelectField
              label="Union Agreement"
              value={projectInformationData?.unionAgreement}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "None", value: "None" },
                {
                  label: "Pact/Bectu Agreement (2021)",
                  value: "Pact/Bectu Agreement (2021)",
                },
              ]}
              isRequired={false}
              infoPillDescription="Select 'None' if you will use terms which vary from the current Union Agreement. Select 'PACT/BECTU Agreement' even if you are only aligned to the agreement."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    unionAgreement: val,
                  },
                }))
              }
            />
            <EditableSelectField
              label="Construction Union Agreement"
              value={projectInformationData?.constructionUnionAgreement}
              isEditing={isEditing.section === "projectInformation"}
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
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    constructionUnionAgreement: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Budget"
              value={projectInformationData?.budget}
              isEditing={isEditing.section === "projectInformation"}
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
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    budget: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Show budget level to crew members?"
              checked={projectInformationData?.showBudgetToCrew}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    showBudgetToCrew: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Holiday Pay Percentage"
              value={projectInformationData?.holidayPayPercentage}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "0%", value: "0%" },
                { label: "10.77%", value: "10.77%" },
                { label: "12.07%", value: "12.07%" },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    holidayPayPercentage: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Different holiday pay percentage for Dailies"
              checked={projectInformationData?.differentHolidayPayForDailies}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    differentHolidayPayForDailies: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Withhold holiday pay on 6th and 7th days"
              checked={projectInformationData?.withholdHolidayPayOn6th7th}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    withholdHolidayPayOn6th7th: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Overtime"
              checked={projectInformationData?.overtimeEnabled}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    overtimeEnabled: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Show Weekly rate for Daily crew in Offer view"
              checked={projectInformationData?.showWeeklyRateForDailiesInOffer}
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
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
                projectInformationData?.showWeeklyRateForDailiesInDocuments
              }
              isEditing={isEditing.section === "projectInformation"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    showWeeklyRateForDailiesInDocuments: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSelectField
              label="Payroll Company"
              value={projectInformationData?.payrollCompany}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "Dataplan", value: "dataplan" },
                { label: "Entertainment Payroll Services", value: "eps" },
                { label: "Hargenant", value: "hargenant" },
                { label: "In-house", value: "inhouse" },
                { label: "Moneypenny", value: "moneypenny" },
                { label: "Sargent Disc", value: "sargent_disc" },
                { label: "TPH", value: "tph" },
              ]}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    payrollCompany: val,
                  },
                }))
              }
            />
            <EditableSelectField
              label="Offer End Date"
              value={projectInformationData?.offerEndDateRequirement}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "Optional", value: "Optional" },
                { label: "Mandatory", value: "Mandatory" },
              ]}
              infoPillDescription="Dictated by whether the Company wants end dates in crew contracts."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    offerEndDateRequirement: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSelectField
              label="Crew Data CSV Export Layout"
              value={projectInformationData?.crewCsvExportLayout}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "EAARTH", value: "eaarth" },
                { label: "Moneypenny", value: "moneypenny" },
              ]}
              isRequired={false}
              infoPillDescription="Start form data in CSV format for sharing with the payroll company."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    crewCsvExportLayout: val,
                  },
                }))
              }
            />
            <EditableSelectField
              label="Payroll CSV Export Layout"
              value={projectInformationData?.payrollCsvExportLayout}
              isEditing={isEditing.section === "projectInformation"}
              items={[
                { label: "Dataplan", value: "dataplan" },
                { label: "Entertainment Payroll Services", value: "eps" },
                { label: "Hargenant", value: "hargenant" },
                { label: "In-house", value: "inhouse" },
                { label: "Moneypenny", value: "moneypenny" },
                { label: "Sargent Disc", value: "sargent_disc" },
                { label: "TPH", value: "tph" },
              ]}
              infoPillDescription="Money calculation data in a layout similar to your payroll company's spreadsheet."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectInformation: {
                    ...prev.projectInformation,
                    payrollCsvExportLayout: val,
                  },
                }))
              }
            />
          </div>
          <EditableSelectField
            label="Default Standard Working Hours"
            value={projectInformationData?.defaultWorkingHours}
            isEditing={isEditing.section === "projectInformation"}
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
            infoPillDescription="Excluding lunch. This is for standard crew contracts. You can still specify different hours in each offer."
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectInformation: {
                  ...prev.projectInformation,
                  defaultWorkingHours: val,
                },
              }))
            }
          />
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
            checked={offerHandlingData?.shareStatusDetermination}
            isEditing={isEditing.section === "offerHandling"}
            infoPillDescription="Inform the crew member of your IR35 status determination within their offer. This MUST be set to yes if you require it to appear in documents."
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                offerHandling: {
                  ...prev.offerHandling,
                  shareStatusDetermination: val,
                },
              }))
            }
          />

          <div className="mt-4">
            <EditableTextDataField
              label="Tax Status Query Email"
              value={offerHandlingData?.taxStatusQueryEmail}
              isEditing={isEditing.section === "offerHandling"}
              isRequired={false}
              placeholder="Enter email address"
              type="email"
              infoPillDescription="The person to whom all tax status questions will be directed."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offerHandling: {
                    ...prev.offerHandling,
                    taxStatusQueryEmail: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Tax Status Handling"
              value={offerHandlingData?.taxStatusHandling}
              isEditing={isEditing.section === "offerHandling"}
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
              infoPillDescription="Available options are based on your 'Share status determination with crew members?' selection."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offerHandling: {
                    ...prev.offerHandling,
                    taxStatusHandling: val,
                  },
                }))
              }
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
              infoPillDescription="Order of people who will approve offers before being sent to crew. Available options are based on your 'Tax status handling' selection."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offerHandling: {
                    ...prev.offerHandling,
                    offerApproval: val,
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
                  Allowances
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Which of these allowances might you pay?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "perDiem"}
                onEdit={() => startEditing("perDiem")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableSwitchField
              label="Box"
              checked={allowancesData.box}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, box: val },
                }))
              }
            />

            <EditableSwitchField
              label="Computer"
              checked={allowancesData.computer}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, computer: val },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Software"
              checked={allowancesData.software}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, software: val },
                }))
              }
            />

            <EditableSwitchField
              label="Equipment"
              checked={allowancesData.equipment}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, equipment: val },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Mobile"
              checked={allowancesData.mobile}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, mobile: val },
                }))
              }
            />

            <EditableSwitchField
              label="Vehicle Allowance"
              checked={allowancesData.vehicleAllowance}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, vehicleAllowance: val },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Vehicle Hire"
              checked={allowancesData.vehicleHire}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: { ...prev.allowances, vehicleHire: val },
                }))
              }
            />
            <EditableSwitchField
              label="Per Diem"
              checked={allowancesData.perDiem}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: {
                    ...prev.allowances,
                    perDiem: val,
                  },
                }))
              }
            />
          </div>
          {allowancesData.perDiem && (
            <PerDiemList
              items={perDiemData}
              isEditing={isEditing.section === "perDiem"}
              onChange={(updated) =>
                setFormState((prev) => ({
                  ...prev,
                  perDiem: updated,
                }))
              }
            />
          )}
          <div className="mt-4">
            <EditableSwitchField
              label="Living"
              checked={allowancesData.living}
              isEditing={isEditing.section === "perDiem"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  allowances: {
                    ...prev.allowances,
                    living: val,
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
                  Meal Penalties
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Default penalty amounts when meals are not provided on time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "mealPenalties"}
                onEdit={() => startEditing("mealPenalties")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EditableTextDataField
              label="Breakfast Penalty"
              type="number"
              value={mealPenaltiesData?.breakfast}
              isEditing={isEditing.section === "mealPenalties"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  mealPenalties: {
                    ...prev.mealPenalties,
                    breakfast: Number(val),
                  },
                }))
              }
            />

            <EditableTextDataField
              label="Lunch Penalty"
              type="number"
              value={mealPenaltiesData?.lunch}
              isEditing={isEditing.section === "mealPenalties"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  mealPenalties: {
                    ...prev.mealPenalties,
                    lunch: Number(val),
                  },
                }))
              }
            />
            <EditableTextDataField
              label="Dinner Penalty"
              type="number"
              value={mealPenaltiesData?.dinner}
              isEditing={isEditing.section === "mealPenalties"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  mealPenalties: {
                    ...prev.mealPenalties,
                    dinner: Number(val),
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
                <h3 className="text-foreground text-sm font-medium">Notice</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Settings for 'Notice of termination of contract' emails
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "notice"}
                onEdit={() => startEditing("notice")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableTextDataField
            label="Notice"
            type="number"
            value={noticeData?.noticeDays}
            isEditing={isEditing.section === "notice"}
            infoPillDescription="In days."
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                notice: {
                  ...prev.notice,
                  noticeDays: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableTextDataField
              label="Notice Email Wording"
              multiline={true}
              value={noticeData?.emailWording}
              isEditing={isEditing.section === "notice"}
              infoPillDescription="Template used in notice of termination emails. Use placeholders like [Crew member name], [finish date], etc."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  notice: {
                    ...prev.notice,
                    emailWording: val,
                  },
                }))
              }
            />
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default ProjectSettings;
