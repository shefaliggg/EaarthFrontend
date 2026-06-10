import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";

function NotificationsSettings() {
  const [isEditing, setIsEditing] = useState({
    section: null,
  });

  const [formState, setFormState] = useState({
    offers: null,
    timecards: null,
    general: null,
    summaryEmails: null,
  });

  const offersData =
    isEditing.section === "offers"
      ? formState.offers
      : {
          notifyOfferSent: true,
          notifyOfferAccepted: true,
          notifyOfferDeclined: true,
          notifyOfferExpired: false,
          reminderAfterDays: "3",
          ccAccounts: false,
          ccProduction: false,
        };

  const timecardsData =
    isEditing.section === "timecards"
      ? formState.timecards
      : {
          notifySubmission: true,
          notifyApproval: true,
          notifyRejection: true,
          notifyExport: false,
          weeklyDigest: true,
          digestDay: "monday",
        };

  const generalData =
    isEditing.section === "general"
      ? formState.general
      : {
          crewJoins: true,
          crewLeaves: true,
          documentUploaded: true,
          calendarChange: true,
          settingsChanges: true,
          systemMaintenance: false,
        };

  const summaryData =
    isEditing.section === "summaryEmails"
      ? formState.summaryEmails
      : {
          dailySummary: false,
          weeklySummary: true,
          summaryDay: "monday",
          summaryTime: null,
          includeFinancials: true,
          includeCrewChanges: true,
          includeTimecardStatus: true,
          recipients: "Production Supervisor, Accounts Supervisor",
        };

  const startEditing = (section) => {
    if (section === "offers") {
      setFormState((prev) => ({
        ...prev,
        offers: { ...offersData },
      }));
    }

    if (section === "timecards") {
      setFormState((prev) => ({
        ...prev,
        timecards: { ...timecardsData },
      }));
    }

    if (section === "general") {
      setFormState((prev) => ({
        ...prev,
        general: { ...generalData },
      }));
    }

    if (section === "summaryEmails") {
      setFormState((prev) => ({
        ...prev,
        summaryEmails: { ...summaryData },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });

    setFormState({
      offers: null,
      timecards: null,
      general: null,
      summaryEmails: null,
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
                <h3 className="text-foreground text-sm font-medium">Offers</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Notification preferences for offer-related events
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "offers"}
                onEdit={() => startEditing("offers")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableSwitchField
              label="Notify when offer sent"
              checked={offersData.notifyOfferSent}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    notifyOfferSent: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Notify when offer accepted"
              checked={offersData.notifyOfferAccepted}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    notifyOfferAccepted: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Notify when offer declined"
              checked={offersData.notifyOfferDeclined}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    notifyOfferDeclined: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Notify when offer expired"
              checked={offersData.notifyOfferExpired}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    notifyOfferExpired: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableTextDataField
              label="Reminder after (days)"
              value={offersData.reminderAfterDays}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    reminderAfterDays: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="CC Accounts on offer emails"
              checked={offersData.ccAccounts}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    ccAccounts: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="CC Production on offer emails"
              checked={offersData.ccProduction}
              isEditing={isEditing.section === "offers"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  offers: {
                    ...prev.offers,
                    ccProduction: val,
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
                  Timecards
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Notifications for timecard submission and approval
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "timecards"}
                onEdit={() => startEditing("timecards")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableSwitchField
              label="Notify on submission"
              checked={timecardsData.notifySubmission}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    notifySubmission: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Notify on approval"
              checked={timecardsData.notifyApproval}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    notifyApproval: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Notify on rejection"
              checked={timecardsData.notifyRejection}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    notifyRejection: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Notify on export"
              checked={timecardsData.notifyExport}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    notifyExport: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Weekly digest"
              checked={timecardsData.weeklyDigest}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    weeklyDigest: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSelectField
              label="Digest Day"
              value={timecardsData.digestDay}
              isEditing={isEditing.section === "timecards"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  timecards: {
                    ...prev.timecards,
                    digestDay: val,
                  },
                }))
              }
              items={[
                { label: "Monday", value: "monday" },
                { label: "Tuesday", value: "tuesday" },
                { label: "Wednesday", value: "wednesday" },
                { label: "Thursday", value: "thursday" },
                { label: "Friday", value: "friday" },
                { label: "Saturday", value: "saturday" },
                { label: "Sunday", value: "sunday" },
              ]}
            />
          </div>
        </CardWrapper>

        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">General</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  General project notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "general"}
                onEdit={() => startEditing("general")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableSwitchField
              label="Crew member joins"
              checked={generalData.crewJoins}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    crewJoins: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Crew member leaves"
              checked={generalData.crewLeaves}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    crewLeaves: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Document uploaded"
              checked={generalData.documentUploaded}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    documentUploaded: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Calendar change"
              checked={generalData.calendarChange}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    calendarChange: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Settings changes"
              checked={generalData.settingsChanges}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    settingsChanges: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="System maintenance"
              checked={generalData.systemMaintenance}
              isEditing={isEditing.section === "general"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  general: {
                    ...prev.general,
                    systemMaintenance: val,
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
                  Summary Emails
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Automated summary email delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "summaryEmails"}
                onEdit={() => startEditing("summaryEmails")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableSwitchField
              label="Daily summary"
              checked={summaryData.dailySummary}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    dailySummary: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Weekly summary"
              checked={summaryData.weeklySummary}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    weeklySummary: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSelectField
              label="Summary Day"
              value={summaryData.summaryDay}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    summaryDay: val,
                  },
                }))
              }
              items={[
                { label: "Monday", value: "monday" },
                { label: "Tuesday", value: "tuesday" },
                { label: "Wednesday", value: "wednesday" },
                { label: "Thursday", value: "thursday" },
                { label: "Friday", value: "friday" },
                { label: "Saturday", value: "saturday" },
                { label: "Sunday", value: "sunday" },
              ]}
            />
            <EditableTextDataField
              label="Summary Time"
              value={summaryData.summaryTime}
              isEditing={isEditing.section === "summaryEmails"}
              placeholder="09:00"
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    summaryTime: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Include financials"
              checked={summaryData.includeFinancials}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    includeFinancials: val,
                  },
                }))
              }
            />
            <EditableSwitchField
              label="Include crew changes"
              checked={summaryData.includeCrewChanges}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    includeCrewChanges: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableSwitchField
              label="Include timecard status"
              checked={summaryData.includeTimecardStatus}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    includeTimecardStatus: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableTextDataField
              label="Summary Recipients"
              value={summaryData.recipients}
              isEditing={isEditing.section === "summaryEmails"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  summaryEmails: {
                    ...prev.summaryEmails,
                    recipients: val,
                  },
                }))
              }
              infoPillDescription="Comma-separated role names who will receive summary emails."
            />
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default NotificationsSettings;
