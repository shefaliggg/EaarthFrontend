import { useCallback }           from "react";
import { useOutletContext }       from "react-router-dom";
import { toast }                 from "sonner";
import { Loader2 }               from "lucide-react";

import CardWrapper           from "@/shared/components/wrappers/CardWrapper";
import EditableSwitchField   from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField   from "@/shared/components/wrappers/EditableSelectField";

import { useNotificationsSettings } from "./useNotificationsSettings";

const DAYS = [
  { label: "Monday",    value: "monday"    },
  { label: "Tuesday",   value: "tuesday"   },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday",  value: "thursday"  },
  { label: "Friday",    value: "friday"    },
  { label: "Saturday",  value: "saturday"  },
  { label: "Sunday",    value: "sunday"    },
];

function SectionHeader({ title, description }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
      <div>
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        <p className="text-muted-foreground text-[0.7rem] mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    error,
    updateOffers,
    updateTimecards,
    updateGeneral,
    updateSummaryEmails,
  } = useNotificationsSettings(projectId);

  const autoSave = useCallback(async (thunkFn, updates) => {
    try {
      await thunkFn(updates).unwrap();
    } catch (err) {
      toast.error(err?.message || "Failed to update settings");
    }
  }, []);

  if (isFetching && !settings.offers.notifyOfferSent) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading notification settings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
        {error?.message ?? "Something went wrong. Please try again."}
      </div>
    );
  }

  const { offers, timecards, general, summaryEmails } = settings;

  return (
    <div className="space-y-4">

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Offers"
          description="Notification preferences for offer-related events"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSwitchField
            label="Notify when offer sent"
            checked={offers.notifyOfferSent}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, notifyOfferSent: val })}
          />
          <EditableSwitchField
            label="Notify when offer accepted"
            checked={offers.notifyOfferAccepted}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, notifyOfferAccepted: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Notify when offer declined"
            checked={offers.notifyOfferDeclined}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, notifyOfferDeclined: val })}
          />
          <EditableSwitchField
            label="Notify when offer expired"
            checked={offers.notifyOfferExpired}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, notifyOfferExpired: val })}
          />
        </div>
        <div className="mt-4">
          <EditableTextDataField
            label="Reminder after (days)"
            value={offers.reminderAfterDays}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, reminderAfterDays: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="CC Accounts on offer emails"
            checked={offers.ccAccounts}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, ccAccounts: val })}
          />
          <EditableSwitchField
            label="CC Production on offer emails"
            checked={offers.ccProduction}
            isEditing={true}
            onChange={(val) => autoSave(updateOffers, { ...offers, ccProduction: val })}
          />
        </div>
      </CardWrapper>

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Timecards"
          description="Notifications for timecard submission and approval"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSwitchField
            label="Notify on submission"
            checked={timecards.notifySubmission}
            isEditing={true}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, notifySubmission: val })}
          />
          <EditableSwitchField
            label="Notify on approval"
            checked={timecards.notifyApproval}
            isEditing={true}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, notifyApproval: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Notify on rejection"
            checked={timecards.notifyRejection}
            isEditing={true}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, notifyRejection: val })}
          />
          <EditableSwitchField
            label="Notify on export"
            checked={timecards.notifyExport}
            isEditing={true}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, notifyExport: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Weekly digest"
            checked={timecards.weeklyDigest}
            isEditing={true}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, weeklyDigest: val })}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Digest Day"
            value={timecards.digestDay}
            isEditing={true}
            items={DAYS}
            onChange={(val) => autoSave(updateTimecards, { ...timecards, digestDay: val })}
          />
        </div>
      </CardWrapper>

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="General"
          description="General project notifications"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSwitchField
            label="Crew member joins"
            checked={general.crewJoins}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, crewJoins: val })}
          />
          <EditableSwitchField
            label="Crew member leaves"
            checked={general.crewLeaves}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, crewLeaves: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Document uploaded"
            checked={general.documentUploaded}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, documentUploaded: val })}
          />
          <EditableSwitchField
            label="Calendar change"
            checked={general.calendarChange}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, calendarChange: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Settings changes"
            checked={general.settingsChanges}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, settingsChanges: val })}
          />
          <EditableSwitchField
            label="System maintenance"
            checked={general.systemMaintenance}
            isEditing={true}
            onChange={(val) => autoSave(updateGeneral, { ...general, systemMaintenance: val })}
          />
        </div>
      </CardWrapper>

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Summary Emails"
          description="Automated summary email delivery"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSwitchField
            label="Daily summary"
            checked={summaryEmails.dailySummary}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, dailySummary: val })}
          />
          <EditableSwitchField
            label="Weekly summary"
            checked={summaryEmails.weeklySummary}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, weeklySummary: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSelectField
            label="Summary Day"
            value={summaryEmails.summaryDay}
            isEditing={true}
            items={DAYS}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, summaryDay: val })}
          />
          <EditableTextDataField
            label="Summary Time"
            type="time"
            value={summaryEmails.summaryTime}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, summaryTime: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Include financials"
            checked={summaryEmails.includeFinancials}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, includeFinancials: val })}
          />
          <EditableSwitchField
            label="Include crew changes"
            checked={summaryEmails.includeCrewChanges}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, includeCrewChanges: val })}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <EditableSwitchField
            label="Include timecard status"
            checked={summaryEmails.includeTimecardStatus}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, includeTimecardStatus: val })}
          />
        </div>
        <div className="mt-4">
          <EditableTextDataField
            label="Summary Recipients"
            value={summaryEmails.recipients}
            isEditing={true}
            onChange={(val) => autoSave(updateSummaryEmails, { ...summaryEmails, recipients: val })}
            infoPillDescription="Comma-separated role names who will receive summary emails."
          />
        </div>
      </CardWrapper>

    </div>
  );
}

export default NotificationsSettings;