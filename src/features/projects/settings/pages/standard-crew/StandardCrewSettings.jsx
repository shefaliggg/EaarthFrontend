import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";

function StandardCrewSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });

  const [formState, setFormState] = useState({
    sixthSeventhDay: null,
    overtime: null,
  });
  const sixthSeventhDayData =
    isEditing.section === "sixthSeventhDay"
      ? formState.sixthSeventhDay
      : {
          sixthDayMultiplier: "1.0",
          seventhDayMultiplier: "1.0",
          showMinHours: false,
        };

  const overtimeData =
    isEditing.section === "overtime"
      ? formState.overtime
      : {
          other: "",
          cameraStandard: "",
          cameraContinuous: "",
          cameraSemiContinuous: "",
        };

  const startEditing = (section) => {
    if (section === "sixthSeventhDay") {
      setFormState((prev) => ({
        ...prev,
        sixthSeventhDay: {
          sixthDayMultiplier: sixthSeventhDayData.sixthDayMultiplier,
          seventhDayMultiplier: sixthSeventhDayData.seventhDayMultiplier,
          showMinHours: sixthSeventhDayData.showMinHours,
        },
      }));
    }

    if (section === "overtime") {
      setFormState((prev) => ({
        ...prev,
        overtime: {
          other: overtimeData.other,
          cameraStandard: overtimeData.cameraStandard,
          cameraContinuous: overtimeData.cameraContinuous,
          cameraSemiContinuous: overtimeData.cameraSemiContinuous,
        },
      }));
    }

    setIsEditing({ section });
  };
  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({
      sixthSeventhDay: null,
      overtime: null,
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
                <h3 className="text-foreground text-sm font-medium">
                  6th/7th Days
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Fee multipliers for 6th and 7th day work
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "sixthSeventhDay"}
                onEdit={() => startEditing("sixthSeventhDay")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableSelectField
              label="6th Day Fee Multiplier"
              value={sixthSeventhDayData?.sixthDayMultiplier}
              isEditing={isEditing.section === "sixthSeventhDay"}
              items={[
                { label: "1.0x", value: "1.0" },
                { label: "1.5x", value: "1.5" },
                { label: "2.0x", value: "2.0" },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthSeventhDay: {
                    ...prev.sixthSeventhDay,
                    sixthDayMultiplier: val,
                  },
                }))
              }
              infoPillDescription="For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement (e.g. Unit Drivers, or individuals on over £3,000/wk for whom OT is negotiable)."
            />
            <EditableSelectField
              label="7th Day Fee Multiplier"
              value={sixthSeventhDayData?.seventhDayMultiplier}
              isEditing={isEditing.section === "sixthSeventhDay"}
              items={[
                { label: "1.0x", value: "1.0" },
                { label: "1.5x", value: "1.5" },
                { label: "2.0x", value: "2.0" },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthSeventhDay: {
                    ...prev.sixthSeventhDay,
                    seventhDayMultiplier: val,
                  },
                }))
              }
              infoPillDescription="For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement (e.g. Unit Drivers, or individuals on over £3,000/wk for whom OT is negotiable)."
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Show minimum hours on 6th and 7th days in offers?"
              checked={sixthSeventhDayData?.showMinHours}
              isEditing={isEditing.section === "sixthSeventhDay"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthSeventhDay: {
                    ...prev.sixthSeventhDay,
                    showMinHours: val,
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
                  Overtime
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Custom overtime rates which an offer will default to if you
                  choose not to pay overtime as 'Calculated per agreement'
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "overtime"}
                onEdit={() => startEditing("overtime")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableTextDataField
            label="Other"
            value={overtimeData?.other}
            isEditing={isEditing.section === "overtime"}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                overtime: {
                  ...prev.overtime,
                  other: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableTextDataField
              label="Camera - standard day"
              value={overtimeData?.cameraStandard}
              isEditing={isEditing.section === "overtime"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  overtime: {
                    ...prev.overtime,
                    cameraStandard: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableTextDataField
              label="Camera - continuous day"
              value={overtimeData?.cameraContinuous}
              isEditing={isEditing.section === "overtime"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  overtime: {
                    ...prev.overtime,
                    cameraContinuous: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableTextDataField
              label="Camera - semi-continuous day"
              value={overtimeData?.cameraSemiContinuous}
              isEditing={isEditing.section === "overtime"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  overtime: {
                    ...prev.overtime,
                    cameraSemiContinuous: val,
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

export default StandardCrewSettings;
