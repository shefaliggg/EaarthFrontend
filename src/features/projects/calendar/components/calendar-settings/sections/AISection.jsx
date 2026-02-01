import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

export default function AISection({ isEditMode, settings = {}, update = () => {} }) {
  return (
    <CardWrapper title="AI & Smart Assistant" icon="Sparkles">

      <div className="grid grid-cols-3 gap-6">

        <EditableCheckboxField
          label="Conflict Resolution"
          description="Allow AI to move flexible meetings."
          checked={settings.conflictResolution ?? false}
          isEditing={isEditMode}
          onChange={(val) => update("conflictResolution", val)}
        />

        <EditableCheckboxField
          label="Agenda Generator"
          description="Auto-generate meeting agendas."
          checked={settings.agendaGenerator ?? true}
          isEditing={isEditMode}
          onChange={(val) => update("agendaGenerator", val)}
        />

      </div>

    </CardWrapper>
  );
}
