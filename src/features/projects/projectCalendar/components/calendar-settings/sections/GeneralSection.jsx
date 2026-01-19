import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

export default function GeneralSection({
  isEditMode,
  settings = {},
  update = () => {},
}) {
  return (
    <CardWrapper title="Language & Region" icon="Globe">
      <div className="grid grid-cols-2 gap-4">
        <EditableSelectField
          label="Language"
          value={settings.language ?? "en-US"}
          isEditing={isEditMode}
          items={[
            { label: "English (United States)", value: "en-US" },
            { label: "English (United Kingdom)", value: "en-UK" },
            { label: "Español", value: "es" },
            { label: "Français", value: "fr" },
            { label: "Deutsch", value: "de" },
            { label: "日本語", value: "ja" },
          ]}
          onChange={(val) => update("language", val)}
        />

        <EditableSelectField
          label="Country"
          value={settings.country ?? "us"}
          isEditing={isEditMode}
          items={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
          ]}
          onChange={(val) => update("country", val)}
        />

        <EditableSelectField
          label="Date Format"
          value={settings.dateFormat ?? "mdy"}
          isEditing={isEditMode}
          items={[
            { label: "12/31/2026", value: "mdy" },
            { label: "31/12/2026", value: "dmy" },
          ]}
          onChange={(val) => update("dateFormat", val)}
        />

        {/* FIXED ALIGNMENT */}
        <div className="flex flex-col justify-end h-full">
          <EditableCheckboxField
            label="24-hour Format"
            description="Use 24-hour time format (13:00)"
            checked={settings.use24Hour ?? false}
            isEditing={isEditMode}
            onChange={(val) => update("use24Hour", val)}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
