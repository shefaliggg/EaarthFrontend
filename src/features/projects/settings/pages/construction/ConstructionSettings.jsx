import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";

function ConstructionSettings() {
  const [isEditing, setIsEditing] = useState({
    section: null,
  });

  const [formState, setFormState] = useState({
    dailyRate: null,
    breaks: null,
    sixthDay: null,
    seventhDay: null,
    overtime: null,
    travelTime: null,
    brokenTurnaround: null,
  });

  const dailyRateData =
    isEditing.section === "dailyRate"
      ? formState.dailyRate
      : {
          rateCardOption: "add_holiday_pay",
          standardWorkingHours: "12_continuous",
        };

  const breaksData =
    isEditing.section === "breaks"
      ? formState.breaks
      : {
          breakDuration: "1_5",
        };

  const sixthDayData =
    isEditing.section === "sixthDay"
      ? formState.sixthDay
      : {
          rateCalculation: "multiply_4_3",
          rateApply: "consecutive_days",
          ratePayment: "daily",
          holidayPayApplication: "pay_net_no_holiday",
        };

  const seventhDayData =
    isEditing.section === "seventhDay"
      ? formState.seventhDay
      : {
          rateCalculation: "multiply_1_5",
          ratePayment: "daily",
          payUnsocialHours: false,
          holidayPayApplication: "pay_net_no_holiday",
        };

  const overtimeData =
    isEditing.section === "overtime"
      ? formState.overtime
      : {
          rateCalculation: "multiply_1_5",
          caps: "match_rate_card",
          holidayPayApplication: "pay_net_no_holiday",
          applyUnsocialHours: "pact_bectu",
        };

  const travelTimeData =
    isEditing.section === "travelTime"
      ? formState.travelTime
      : {
          travelTimePaid: false,
        };

  const brokenTurnaroundData =
    isEditing.section === "brokenTurnaround"
      ? formState.brokenTurnaround
      : {
          brokenTurnaroundPaid: false,
        };

  const startEditing = (section) => {
    if (section === "dailyRate") {
      setFormState((prev) => ({
        ...prev,
        dailyRate: {
          rateCardOption: dailyRateData.rateCardOption,
          standardWorkingHours: dailyRateData.standardWorkingHours,
        },
      }));
    }

    if (section === "breaks") {
      setFormState((prev) => ({
        ...prev,
        breaks: {
          breakDuration: breaksData.breakDuration,
        },
      }));
    }

    if (section === "sixthDay") {
      setFormState((prev) => ({
        ...prev,
        sixthDay: {
          rateCalculation: sixthDayData.rateCalculation,
          rateApply: sixthDayData.rateApply,
          ratePayment: sixthDayData.ratePayment,
          holidayPayApplication: sixthDayData.holidayPayApplication,
        },
      }));
    }

    if (section === "seventhDay") {
      setFormState((prev) => ({
        ...prev,
        seventhDay: {
          rateCalculation: seventhDayData.rateCalculation,
          ratePayment: seventhDayData.ratePayment,
          payUnsocialHours: seventhDayData.payUnsocialHours,
          holidayPayApplication: seventhDayData.holidayPayApplication,
        },
      }));
    }

    if (section === "overtime") {
      setFormState((prev) => ({
        ...prev,
        overtime: {
          rateCalculation: overtimeData.rateCalculation,
          caps: overtimeData.caps,
          holidayPayApplication: overtimeData.holidayPayApplication,
          applyUnsocialHours: overtimeData.applyUnsocialHours,
        },
      }));
    }

    if (section === "travelTime") {
      setFormState((prev) => ({
        ...prev,
        travelTime: {
          travelTimePaid: travelTimeData.travelTimePaid,
        },
      }));
    }

    if (section === "brokenTurnaround") {
      setFormState((prev) => ({
        ...prev,
        brokenTurnaround: {
          brokenTurnaroundPaid: brokenTurnaroundData.brokenTurnaroundPaid,
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({
      dailyRate: null,
      breaks: null,
      sixthDay: null,
      seventhDay: null,
      overtime: null,
      travelTime: null,
      brokenTurnaround: null,
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
                  Daily Rate & Hours
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  PACT/BECTU rate card and standard working hours for
                  construction crew
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "dailyRate"}
                onEdit={() => startEditing("dailyRate")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSelectField
            label="Use PACT/BECTU Rate card for Daily rate?"
            value={dailyRateData.rateCardOption}
            isEditing={isEditing.section === "dailyRate"}
            items={[
              {
                label: "Add holiday pay to net rate on Rate card",
                value: "add_holiday_pay",
              },
              {
                label: "Extract holiday pay from gross rate on Rate card",
                value: "extract_holiday_pay",
              },
              {
                label: "Don't use Rate card",
                value: "dont_use",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                dailyRate: {
                  ...prev.dailyRate,
                  rateCardOption: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableSelectField
              label="Default standard working hours"
              value={dailyRateData.standardWorkingHours}
              isEditing={isEditing.section === "dailyRate"}
              items={[
                { label: "12 hours (continuous)", value: "12_continuous" },
                { label: "12 hours", value: "12" },
                { label: "11 hours", value: "11" },
                { label: "10.5 hours", value: "10_5" },
                { label: "10 hours", value: "10" },
                { label: "9 hours", value: "9" },
                { label: "8 hours", value: "8" },
                { label: "7.5 hours", value: "7_5" },
                { label: "7 hours", value: "7" },
                { label: "6 hours", value: "6" },
                { label: "5 hours", value: "5" },
                { label: "4 hours", value: "4" },
                { label: "3 hours", value: "3" },
                { label: "2 hours", value: "2" },
                { label: "1 hour", value: "1" },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dailyRate: {
                    ...prev.dailyRate,
                    standardWorkingHours: val,
                  },
                }))
              }
              infoPillDescription="Excluding breaks"
            />
          </div>
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Breaks</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Duration of unpaid break periods
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "breaks"}
                onEdit={() => startEditing("breaks")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSelectField
            label="Break Duration"
            value={breaksData.breakDuration}
            isEditing={isEditing.section === "breaks"}
            items={[
              { label: "1.5 Hours", value: "1_5" },
              { label: "1 Hour", value: "1" },
              { label: "0.5 Hour", value: "0_5" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                breaks: {
                  ...prev.breaks,
                  breakDuration: val,
                },
              }))
            }
            infoPillDescription="The PACT/BECTU Agreement specifies a 30 minute unpaid morning break and unpaid lunch of 1 hour. You might have agreed different break period(s) for an overall shorter day. This break period duration will only be used to determine when overtime becomes applicable"
          />
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">6th Day</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Rate calculation, applicability, and payment rules for 6th
                  consecutive day
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "sixthDay"}
                onEdit={() => startEditing("sixthDay")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSelectField
            label="6th day rate calculation"
            value={sixthDayData.rateCalculation}
            isEditing={isEditing.section === "sixthDay"}
            items={[
              {
                label: "Multiply net daily by 4/3",
                value: "multiply_4_3",
              },
              {
                label: "Match PACT/BECTU Rate card",
                value: "match_rate_card",
              },
              {
                label: "Use different multiplier",
                value: "different_multiplier",
              },
              {
                label: "Enter own rate in offer",
                value: "own_rate",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                sixthDay: {
                  ...prev.sixthDay,
                  rateCalculation: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableSelectField
              label="When does 6th day rate apply?"
              value={sixthDayData.rateApply}
              isEditing={isEditing.section === "sixthDay"}
              items={[
                {
                  label: "Consecutive working days",
                  value: "consecutive_days",
                },
                {
                  label: "The 6th day worked in a timecard week",
                  value: "timecard_week",
                },
                {
                  label: "Weekend days",
                  value: "weekend_days",
                },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthDay: {
                    ...prev.sixthDay,
                    rateApply: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="6th day rate payment"
              value={sixthDayData.ratePayment}
              isEditing={isEditing.section === "sixthDay"}
              items={[
                {
                  label: "Daily",
                  value: "daily",
                },
                {
                  label: "Hourly",
                  value: "hourly",
                },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthDay: {
                    ...prev.sixthDay,
                    ratePayment: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Holiday pay application"
              value={sixthDayData.holidayPayApplication}
              isEditing={isEditing.section === "sixthDay"}
              items={[
                {
                  label:
                    "Pay net, don't calculate holiday pay (per PACT/BECTU)",
                  value: "pay_net_no_holiday",
                },
                {
                  label: "Pay net, calculate holiday pay",
                  value: "pay_net_with_holiday",
                },
                {
                  label: "Pay gross",
                  value: "pay_gross",
                },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  sixthDay: {
                    ...prev.sixthDay,
                    holidayPayApplication: val,
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
                <h3 className="text-foreground text-sm font-medium">7th Day</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Rate calculation, payment, and unsocial hours for 7th
                  consecutive day.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "seventhDay"}
                onEdit={() => startEditing("seventhDay")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSelectField
            label="7th day rate calculation"
            value={seventhDayData.rateCalculation}
            isEditing={isEditing.section === "seventhDay"}
            items={[
              {
                label: "Multiply net daily by 1.5",
                value: "multiply_1_5",
              },
              {
                label: "Match PACT/BECTU Rate card",
                value: "match_rate_card",
              },
              {
                label: "Use different multiplier",
                value: "different_multiplier",
              },
              {
                label: "Enter own rate in offer",
                value: "own_rate",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                seventhDay: {
                  ...prev.seventhDay,
                  rateCalculation: val,
                },
              }))
            }
          />
          <div className="mt-4">
            <EditableSelectField
              label="7th day rate payment"
              value={seventhDayData.ratePayment}
              isEditing={isEditing.section === "seventhDay"}
              items={[
                {
                  label: "Daily",
                  value: "daily",
                },
                {
                  label: "Hourly",
                  value: "hourly",
                },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  seventhDay: {
                    ...prev.seventhDay,
                    ratePayment: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Pay Unsocial Hours 2 for all hours worked on 7th day?"
              checked={seventhDayData.payUnsocialHours}
              isEditing={isEditing.section === "seventhDay"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  seventhDay: {
                    ...prev.seventhDay,
                    payUnsocialHours: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Holiday pay application"
              value={seventhDayData.holidayPayApplication}
              isEditing={isEditing.section === "seventhDay"}
              items={[
                {
                  label:
                    "Pay net, don't calculate holiday pay (per PACT/BECTU)",
                  value: "pay_net_no_holiday",
                },
                {
                  label: "Pay net, calculate holiday pay",
                  value: "pay_net_with_holiday",
                },
                {
                  label: "Pay gross",
                  value: "pay_gross",
                },
              ]}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  seventhDay: {
                    ...prev.seventhDay,
                    holidayPayApplication: val,
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
                  Overtime rate calculation, caps, holiday pay, and unsocial
                  hours
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
          <EditableSelectField
            label="O/T rate calculation"
            value={overtimeData.rateCalculation}
            isEditing={isEditing.section === "overtime"}
            items={[
              {
                label: "Multiply net hourly by 1.5",
                value: "multiply_1_5",
              },
              {
                label: "1.5x gross hourly rate then extract holiday pay",
                value: "gross_extract_holiday",
              },
              {
                label: "Match PACT/BECTU Rate card",
                value: "match_rate_card",
              },
              {
                label: "Use different multiplier",
                value: "different_multiplier",
              },
              {
                label: "Enter own rate in offer",
                value: "own_rate",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                overtime: {
                  ...prev.overtime,
                  rateCalculation: val,
                },
              }))
            }
          />
          <EditableSelectField
            label="O/T caps"
            value={overtimeData.caps}
            isEditing={isEditing.section === "overtime"}
            items={[
              {
                label: "Match PACT/BECTU Rate card",
                value: "match_rate_card",
              },
              {
                label: "Other cap",
                value: "other_cap",
              },
              {
                label: "No cap",
                value: "no_cap",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                overtime: {
                  ...prev.overtime,
                  caps: val,
                },
              }))
            }
          />
          <EditableSelectField
            label="Holiday pay application"
            value={overtimeData.holidayPayApplication}
            isEditing={isEditing.section === "overtime"}
            items={[
              {
                label: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
                value: "pay_net_no_holiday",
              },
              {
                label: "Pay net, calculate holiday pay",
                value: "pay_net_with_holiday",
              },
              {
                label: "Pay gross",
                value: "pay_gross",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                overtime: {
                  ...prev.overtime,
                  holidayPayApplication: val,
                },
              }))
            }
          />
          <EditableSelectField
            label="Apply unsocial hours"
            value={overtimeData.applyUnsocialHours}
            isEditing={isEditing.section === "overtime"}
            items={[
              {
                label: "Per PACT/BECTU Agreement",
                value: "pact_bectu",
              },
              {
                label: "Custom unsocial hours",
                value: "custom",
              },
              {
                label: "Don't apply",
                value: "dont_apply",
              },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                overtime: {
                  ...prev.overtime,
                  applyUnsocialHours: val,
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
                  Travel Time
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Whether travel time is paid for construction crew
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "travelTime"}
                onEdit={() => startEditing("travelTime")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSwitchField
            label="Travel time paid?"
            checked={travelTimeData.travelTimePaid}
            isEditing={isEditing.section === "travelTime"}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                travelTime: {
                  ...prev.travelTime,
                  travelTimePaid: val,
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
                  Broken Turnaround
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Whether broken turnaround time is compensated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "brokenTurnaround"}
                onEdit={() => startEditing("brokenTurnaround")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <EditableSwitchField
            label="Broken turnaround paid?"
            checked={brokenTurnaroundData.brokenTurnaroundPaid}
            isEditing={isEditing.section === "brokenTurnaround"}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                brokenTurnaround: {
                  ...prev.brokenTurnaround,
                  brokenTurnaroundPaid: val,
                },
              }))
            }
          />
        </CardWrapper>
      </div>
    </>
  );
}

export default ConstructionSettings;
