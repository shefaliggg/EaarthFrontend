/**
 * ProjectSettings.jsx
 * Path: src/features/projects/settings/components/details/ProjectSettings.jsx
 */

import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Loader2 } from "lucide-react";

import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import PerDiemList from "../../components/project/PerDiemList";
import { useDetailsSettings } from "./useDetailsSettings";

function ProjectSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    error,
    updateBasic,
    updateProjectInformation,
    updateOfferHandling,
    updateAllowances,
    updateMealPenalties,
    updateNotice,
  } = useDetailsSettings(projectId);

  const [saveError, setSaveError] = useState(null);

  // ── Meal Penalties & Notice — Edit/Save/Cancel drafts ────────────────────
  const [editingSection, setEditingSection] = useState(null);
  const [mealPenaltiesDraft, setMealPenaltiesDraft] = useState(null);
  const [noticeDraft, setNoticeDraft] = useState(null);

  // ── Auto-save helper (Basic / ProjectInfo / OfferHandling / Allowances) ──
  const autoSave = useCallback(async (thunkFn, updates) => {
    setSaveError(null);
    try {
      await thunkFn(updates).unwrap();
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
    }
  }, []);

  // ── Edit/Save/Cancel helper (MealPenalties / Notice) ─────────────────────
  const save = useCallback(async (thunkFn, draft, afterSave) => {
    setSaveError(null);
    try {
      await thunkFn(draft).unwrap();
      afterSave();
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
    }
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingSection(null);
    setSaveError(null);
    setMealPenaltiesDraft(null);
    setNoticeDraft(null);
  }, []);

  // ── Display data ──────────────────────────────────────────────────────────
  const basicData = settings.basic;
  const projectInfoData = settings.projectInformation;
  const offerHandlingData = settings.offerHandling;
  const allowancesData = settings.allowances;
  const perDiemData = settings.perDiemItems;
  const mealPenaltiesData =
    editingSection === "mealPenalties"
      ? mealPenaltiesDraft
      : settings.mealPenalties;
  const noticeData =
    editingSection === "notice" ? noticeDraft : settings.notice;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isFetching && !settings.basic.workingWeek) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading project settings…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(error || saveError) && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError ??
            error?.message ??
            "Something went wrong. Please try again."}
        </div>
      )}

      {/* ── Basic — auto-save ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Basic</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Core project working week configuration. Currency is managed per
                company in the Contacts tab
              </p>
            </div>
          </div>
          {isUpdating && editingSection === null && (
            <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
              <Loader2 size={11} className="animate-spin" /> Saving…
            </div>
          )}
        </div>

        <EditableSelectField
          label="Working Week"
          value={basicData?.workingWeek}
          isEditing={true}
          items={[
            { label: "5 Days", value: "5_days" },
            { label: "5.5 Days", value: "5.5_days" },
            { label: "5/6 Days", value: "5/6_days" },
            { label: "6 Days", value: "6_days" },
          ]}
          onChange={(val) =>
            autoSave(updateBasic, { ...basicData, workingWeek: val })
          }
        />
        <div className="mt-4">
          <EditableSwitchField
            label="Show prep/wrap mins in Offer view?"
            checked={basicData?.showPrepWrap}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateBasic, { ...basicData, showPrepWrap: val })
            }
          />
        </div>
      </CardWrapper>

      {/* ── Project Information — auto-save ── */}
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
        </div>

        <EditableSelectField
          label="Project Type"
          value={projectInfoData?.projectType}
          isEditing={true}
          items={[
            { label: "Feature Film", value: "Feature Film" },
            { label: "Television", value: "Television" },
          ]}
          onChange={(val) =>
            autoSave(updateProjectInformation, {
              ...projectInfoData,
              projectType: val,
            })
          }
        />
        <div className="mt-4">
          <EditableSwitchField
            label="Show project type in offers"
            checked={projectInfoData?.showProjectTypeInOffers}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                showProjectTypeInOffers: val,
              })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Union Agreement"
            value={projectInfoData?.unionAgreement}
            isEditing={true}
            items={[
              { label: "None", value: "None" },
              {
                label: "Pact/Bectu Agreement (2021)",
                value: "Pact/Bectu Agreement (2021)",
              },
            ]}
            infoPillDescription="Select 'None' if you will use terms which vary from the current Union Agreement."
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                unionAgreement: val,
              })
            }
          />
          <EditableSelectField
            label="Construction Union Agreement"
            value={projectInfoData?.constructionUnionAgreement}
            isEditing={true}
            items={[
              { label: "None", value: "None" },
              { label: "Pact/Bectu Agreement", value: "Pact/Bectu Agreement" },
              { label: "Custom Agreement", value: "Custom Agreement" },
            ]}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                constructionUnionAgreement: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Budget"
            value={projectInfoData?.budget}
            isEditing={true}
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
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                budget: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show budget level to crew members?"
            checked={projectInfoData?.showBudgetToCrew}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                showBudgetToCrew: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Holiday Pay Percentage"
            value={projectInfoData?.holidayPayPercentage}
            isEditing={true}
            items={[
              { label: "0%", value: "0%" },
              { label: "10.77%", value: "10.77%" },
              { label: "12.07%", value: "12.07%" },
            ]}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                holidayPayPercentage: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Different holiday pay percentage for Dailies"
            checked={projectInfoData?.differentHolidayPayForDailies}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                differentHolidayPayForDailies: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Withhold holiday pay on 6th and 7th days"
            checked={projectInfoData?.withholdHolidayPayOn6th7th}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                withholdHolidayPayOn6th7th: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Overtime"
            checked={projectInfoData?.overtimeEnabled}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                overtimeEnabled: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show Weekly rate for Daily crew in Offer view"
            checked={projectInfoData?.showWeeklyRateForDailiesInOffer}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                showWeeklyRateForDailiesInOffer: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show Weekly rate for Daily crew in Documents"
            checked={projectInfoData?.showWeeklyRateForDailiesInDocuments}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                showWeeklyRateForDailiesInDocuments: val,
              })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Payroll Company"
            value={projectInfoData?.payrollCompany}
            isEditing={true}
            items={[
              { label: "Dataplan", value: "dataplan" },
              { label: "Entertainment Payroll Services", value: "eps" },
              { label: "Hargenant", value: "hargenant" },
              { label: "In-house", value: "inhouse" },
              { label: "Moneypenny", value: "moneypenny" },
              { label: "Sargent Disc", value: "sargent_disc" },
              { label: "TPH", value: "tph" },
            ]}
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                payrollCompany: val,
              })
            }
          />
          <EditableSelectField
            label="Offer End Date"
            value={projectInfoData?.offerEndDateRequirement}
            isEditing={true}
            items={[
              { label: "Optional", value: "Optional" },
              { label: "Mandatory", value: "Mandatory" },
            ]}
            infoPillDescription="Dictated by whether the Company wants end dates in crew contracts."
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                offerEndDateRequirement: val,
              })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Crew Data CSV Export Layout"
            value={projectInfoData?.crewCsvExportLayout}
            isEditing={true}
            items={[
              { label: "EAARTH", value: "eaarth" },
              { label: "Moneypenny", value: "moneypenny" },
            ]}
            infoPillDescription="Start form data in CSV format for sharing with the payroll company."
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                crewCsvExportLayout: val,
              })
            }
          />
          <EditableSelectField
            label="Payroll CSV Export Layout"
            value={projectInfoData?.payrollCsvExportLayout}
            isEditing={true}
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
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                payrollCsvExportLayout: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Default Standard Working Hours"
            value={projectInfoData?.defaultWorkingHours}
            isEditing={true}
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
            infoPillDescription="Excluding lunch. This is for standard crew contracts."
            onChange={(val) =>
              autoSave(updateProjectInformation, {
                ...projectInfoData,
                defaultWorkingHours: val,
              })
            }
          />
        </div>
      </CardWrapper>

      {/* ── Offer Handling — auto-save ── */}
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
        </div>

        <EditableSwitchField
          label="Share status determination with crew members?"
          checked={offerHandlingData?.shareStatusDetermination}
          isEditing={true}
          infoPillDescription="Inform the crew member of your IR35 status determination within their offer."
          onChange={(val) =>
            autoSave(updateOfferHandling, {
              ...offerHandlingData,
              shareStatusDetermination: val,
            })
          }
        />
        <div className="mt-4">
          <EditableSelectField
            label="Tax Status Handling"
            value={offerHandlingData?.taxStatusHandling}
            isEditing={true}
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
              autoSave(updateOfferHandling, {
                ...offerHandlingData,
                taxStatusHandling: val,
              })
            }
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Offer Approval"
            value={offerHandlingData?.offerApproval}
            isEditing={true}
            items={[
              { label: "Accounts", value: "accounts" },
              { label: "Accounts > Production", value: "accounts_production" },
              { label: "Production", value: "production" },
              { label: "Production > Accounts", value: "production_accounts" },
            ]}
            infoPillDescription="Order of people who will approve offers before being sent to crew."
            onChange={(val) =>
              autoSave(updateOfferHandling, {
                ...offerHandlingData,
                offerApproval: val,
              })
            }
          />
        </div>
      </CardWrapper>

      {/* ── Allowances — auto-save ── */}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Box", "box"],
            ["Computer", "computer"],
            ["Software", "software"],
            ["Equipment", "equipment"],
            ["Mobile", "mobile"],
            ["Vehicle Allowance", "vehicleAllowance"],
            ["Vehicle Hire", "vehicleHire"],
            ["Per Diem", "perDiem"],
          ].map(([label, key]) => (
            <EditableSwitchField
              key={key}
              label={label}
              checked={allowancesData?.[key] ?? false}
              isEditing={true}
              onChange={(val) =>
                autoSave(updateAllowances, {
                  allowances: { ...allowancesData, [key]: val },
                  perDiemItems: perDiemData,
                })
              }
            />
          ))}
        </div>

        {allowancesData?.perDiem && (
          <PerDiemList
            items={perDiemData}
            isEditing={true}
            onChange={(updated) =>
              autoSave(updateAllowances, {
                allowances: allowancesData,
                perDiemItems: updated,
              })
            }
          />
        )}

        <div className="mt-4">
          <EditableSwitchField
            label="Living"
            checked={allowancesData?.living ?? false}
            isEditing={true}
            onChange={(val) =>
              autoSave(updateAllowances, {
                allowances: { ...allowancesData, living: val },
                perDiemItems: perDiemData,
              })
            }
          />
        </div>
      </CardWrapper>

      {/* ── Meal Penalties — Edit/Save/Cancel ── */}
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
              isEditing={editingSection === "mealPenalties"}
              isLoading={isUpdating && editingSection === "mealPenalties"}
              onEdit={() => {
                setMealPenaltiesDraft({ ...settings.mealPenalties });
                setEditingSection("mealPenalties");
                setSaveError(null);
              }}
              onSave={() =>
                save(updateMealPenalties, mealPenaltiesDraft, cancelEditing)
              }
              onCancel={cancelEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <EditableTextDataField
            label="Breakfast Penalty"
            type="number"
            value={mealPenaltiesData?.breakfast}
            isEditing={editingSection === "mealPenalties"}
            onChange={(val) =>
              setMealPenaltiesDraft((p) => ({ ...p, breakfast: Number(val) }))
            }
          />
          <EditableTextDataField
            label="Lunch Penalty"
            type="number"
            value={mealPenaltiesData?.lunch}
            isEditing={editingSection === "mealPenalties"}
            onChange={(val) =>
              setMealPenaltiesDraft((p) => ({ ...p, lunch: Number(val) }))
            }
          />
          <EditableTextDataField
            label="Dinner Penalty"
            type="number"
            value={mealPenaltiesData?.dinner}
            isEditing={editingSection === "mealPenalties"}
            onChange={(val) =>
              setMealPenaltiesDraft((p) => ({ ...p, dinner: Number(val) }))
            }
          />
        </div>
      </CardWrapper>

      {/* ── Notice — Edit/Save/Cancel ── */}
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
              isEditing={editingSection === "notice"}
              isLoading={isUpdating && editingSection === "notice"}
              onEdit={() => {
                setNoticeDraft({ ...settings.notice });
                setEditingSection("notice");
                setSaveError(null);
              }}
              onSave={() => save(updateNotice, noticeDraft, cancelEditing)}
              onCancel={cancelEditing}
            />
          </div>
        </div>

        <EditableTextDataField
          label="Notice"
          type="number"
          value={noticeData?.noticeDays}
          isEditing={editingSection === "notice"}
          infoPillDescription="In days."
          onChange={(val) => setNoticeDraft((p) => ({ ...p, noticeDays: val }))}
        />
        <div className="mt-4">
          <EditableTextDataField
            label="Notice Email Wording"
            multiline={true}
            value={noticeData?.emailWording}
            isEditing={editingSection === "notice"}
            infoPillDescription="Template used in notice of termination emails. Use placeholders like [Crew member name], [finish date], etc."
            onChange={(val) =>
              setNoticeDraft((p) => ({ ...p, emailWording: val }))
            }
          />
        </div>
      </CardWrapper>
    </div>
  );
}

export default ProjectSettings;
