import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";

export default function HealthDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
}) {
  return (
    <CardWrapper
      title={"Health $ Dietary"}
      icon={"Heart"}
      actions={
        <EditToggleButtons
          isEditing={isEditing}
          onEdit={setIsEditing}
          onSave={setIsEditing}
          onCancel={setIsEditing}
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-68">
        <EditableTextDataField
          label="Dietary requirements"
          value={profile.dietaryRequirements}
          onChange={(value) =>
            setProfile({
              ...profile,
              dietaryRequirements: value.toUpperCase(),
            })
          }
          multiline
          placeholder="Eg. Vegetarian, Vegan, Halal, Kosher"
          isEditing={isEditing}
          inputClassName={"min-h-[100px]"}
        />

        <EditableTextDataField
          label="Allergies"
          value={profile.allergies}
          onChange={(value) =>
            setProfile({ ...profile, allergies: value.toUpperCase() })
          }
          multiline
          placeholder="Eg. Peanuts, Shellfish, Pollen"
          isEditing={isEditing}
          inputClassName={"min-h-[100px]"}
        />
      </div>
    </CardWrapper>
  );
}
