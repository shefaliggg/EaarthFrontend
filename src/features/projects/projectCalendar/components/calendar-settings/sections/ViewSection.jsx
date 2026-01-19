import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

export default function ViewSection({ isEditMode, settings = {}, update = () => {} }) {
  return (
    <CardWrapper title="View Options" icon="Layout">

      <div className="grid grid-cols-3 gap-6">

        <EditableSelectField
          label="Start Week On"
          value={settings.startWeek ?? "sun"}
          isEditing={isEditMode}
          items={[
            { label: "Sunday", value: "sun" },
            { label: "Monday", value: "mon" },
          ]}
          onChange={(val) => update("startWeek", val)}
        />

        <EditableCheckboxField
          label="Show Weekends"
          description="Display Saturdays and Sundays."
          checked={settings.showWeekends ?? true}
          isEditing={isEditMode}
          onChange={(val) => update("showWeekends", val)}
        />

        <EditableCheckboxField
          label="Show Declined Events"
          description="Display declined meetings in calendar."
          checked={settings.showDeclined ?? true}
          isEditing={isEditMode}
          onChange={(val) => update("showDeclined", val)}
        />

        <EditableCheckboxField
          label="Show Week Numbers"
          description="Display week numbers in calendar view."
          checked={settings.showWeekNumbers ?? false}
          isEditing={isEditMode}
          onChange={(val) => update("showWeekNumbers", val)}
        />

      </div>

    </CardWrapper>
  );
}
