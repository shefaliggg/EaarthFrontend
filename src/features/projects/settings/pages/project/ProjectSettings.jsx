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
