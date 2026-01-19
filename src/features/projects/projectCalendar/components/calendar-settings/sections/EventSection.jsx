import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";

export default function EventSection({ isEditMode, settings = {}, update = () => {} }) {
  return (
    <CardWrapper title="Event Settings" icon="Calendar">

      <div className="grid grid-cols-3 gap-6">

        <EditableSelectField
          label="Default Duration"
          value={settings.defaultDuration ?? "60"}
          isEditing={isEditMode}
          items={[
            { label: "30 minutes", value: "30" },
            { label: "60 minutes", value: "60" },
            { label: "90 minutes", value: "90" },
          ]}
          onChange={(val) => update("defaultDuration", val)}
        />

        <EditableCheckboxField
          label="Speedy Meetings"
          description="Shorten meetings automatically."
          checked={settings.speedyMeetings ?? false}
          isEditing={isEditMode}
          onChange={(val) => update("speedyMeetings", val)}
        />

      </div>

    </CardWrapper>
  );
}
