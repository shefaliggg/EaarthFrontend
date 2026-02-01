import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

export default function NotificationSection({ isEditMode, settings = {}, update = () => {} }) {
  return (
    <CardWrapper title="Notification Settings" icon="Bell">

      <div className="grid grid-cols-3 gap-6">

        <EditableSelectField
          label="Default Notification"
          value={settings.defaultNotification ?? "10"}
          isEditing={isEditMode}
          items={[
            { label: "10 minutes before", value: "10" },
            { label: "30 minutes before", value: "30" },
            { label: "1 hour before", value: "60" },
          ]}
          onChange={(val) => update("defaultNotification", val)}
        />

        <EditableCheckboxField
          label="Desktop Notifications"
          description="Show desktop alerts for events."
          checked={settings.desktopNotifications ?? true}
          isEditing={isEditMode}
          onChange={(val) => update("desktopNotifications", val)}
        />

        <EditableCheckboxField
          label="Play Sounds"
          description="Play sound when notifications appear."
          checked={settings.playSounds ?? true}
          isEditing={isEditMode}
          onChange={(val) => update("playSounds", val)}
        />

      </div>

    </CardWrapper>
  );
}
