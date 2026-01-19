import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";

export default function TimezoneSection({
  isEditMode = false,
  settings = {
    timezone: "pst",
    autoUpdate: false,
    secondary: false,
    secondaryTimezone: "gmt",
    secondaryLabel: "",
  },
  update = () => {},
}) {

  return (
    <CardWrapper title="Time Zone" icon="Clock">
      <div className="space-y-6">
        {/* Primary Time Zone */}
        <EditableSelectField
          label="Primary Time Zone"
          value={settings.timezone}
          isEditing={isEditMode}
          items={[
            { label: "(GMT-08:00) Pacific Time", value: "pst" },
            { label: "(GMT-05:00) Eastern Time", value: "est" },
            { label: "(GMT+00:00) GMT", value: "gmt" },
            { label: "(GMT+01:00) Central European Time", value: "cet" },
          ]}
          onChange={(val) => update("timezone", val)}
        />

        <EditableCheckboxField
          label="Ask to update my primary time zone to current location"
          checked={settings.autoUpdate}
          isEditing={isEditMode}
          onChange={(val) => update("autoUpdate", val)}
        />

        {/* Secondary Time Zone */}
        {/* Secondary Time Zone */}
        <div className="space-y-2">
          <EditableCheckboxField
            label="Display secondary time zone"
            checked={settings.secondary}
            isEditing={isEditMode}
            onChange={(val) => update("secondary", val)}
          />

          {settings.secondary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="Label"
                value={settings.secondaryLabel ?? ""}
                placeholder="e.g. London"
                isEditing={isEditMode}
                onChange={(val) => update("secondaryLabel", val)}
              />

              <EditableSelectField
                label="Secondary Time Zone"
                value={settings.secondaryTimezone ?? "gmt"}
                isEditing={isEditMode}
                items={[
                  { label: "(GMT-08:00) Pacific Time", value: "pst" },
                  { label: "(GMT-05:00) Eastern Time", value: "est" },
                  { label: "(GMT+00:00) GMT", value: "gmt" },
                  { label: "(GMT+01:00) Central European Time", value: "cet" },
                ]}
                onChange={(val) => update("secondaryTimezone", val)}
              />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
